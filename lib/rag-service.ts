import { analyzeTicket, calculateConfidenceScore } from "./ticket-analyzer"
import { generateSmartResponse, shouldEscalateToHuman } from "./response-generator"
import { searchSimilarTickets, getKnowledgeBase, createTicket } from "./database"

export interface TicketSubmission {
  customerEmail: string
  customerName?: string
  subject: string
  description: string
}

export interface ProcessedTicket {
  ticket: any
  analysis: any
  similarTickets: any[]
  knowledgeMatches: any[]
  autoResponse: string
  confidenceScore: number
  shouldEscalate: boolean
  escalationReason: string
}

export async function processTicket(submission: TicketSubmission): Promise<ProcessedTicket> {
  // Step 1: Analyze the ticket
  const analysis = await analyzeTicket(submission.subject, submission.description)

  // Step 2: Find similar resolved tickets
  const similarTickets = await searchSimilarTickets(analysis.category, 3)

  // Step 3: Get relevant knowledge base entries
  const knowledgeBase = await getKnowledgeBase()
  const relevantKnowledge = knowledgeBase
    .filter((kb) => kb.category === analysis.category || kb.tags.some((tag) => analysis.tags.includes(tag)))
    .slice(0, 3)

  // Step 4: Generate embeddings for semantic search (simplified for demo)
  // In production, you'd store and search pre-computed embeddings
  const queryText = `${submission.subject} ${submission.description}`

  // Step 5: Calculate confidence score
  const confidenceScore = calculateConfidenceScore(
    similarTickets.map((t) => ({ similarity: 0.8 })), // Simplified
    relevantKnowledge.map((k) => ({ similarity: 0.7 })), // Simplified
    analysis,
  )

  // Step 6: Generate smart response
  const autoResponse = await generateSmartResponse({
    ticketSubject: submission.subject,
    ticketDescription: submission.description,
    category: analysis.category,
    similarTickets,
    knowledgeBase: relevantKnowledge,
  })

  // Step 7: Determine if escalation is needed
  const escalation = await shouldEscalateToHuman(
    confidenceScore,
    analysis.sentiment,
    analysis.priority,
    analysis.category,
  )

  // Step 8: Create ticket in database
  const ticket = await createTicket({
    customer_email: submission.customerEmail,
    customer_name: submission.customerName,
    subject: submission.subject,
    description: submission.description,
    category: analysis.category,
    priority: analysis.priority,
    status: escalation.shouldEscalate ? "escalated" : "auto-responded",
    sentiment_score: analysis.sentiment,
    confidence_score: confidenceScore,
    auto_response: autoResponse,
  })

  return {
    ticket,
    analysis,
    similarTickets,
    knowledgeMatches: relevantKnowledge,
    autoResponse,
    confidenceScore,
    shouldEscalate: escalation.shouldEscalate,
    escalationReason: escalation.reason,
  }
}

export async function reprocessTicketWithFeedback(
  ticketId: number,
  feedback: "helpful" | "not_helpful",
  humanResponse?: string,
): Promise<void> {
  // This would update the ML model based on feedback
  // For now, we'll just log the feedback
  console.log(`Ticket ${ticketId} feedback: ${feedback}`)

  if (humanResponse) {
    // Update ticket with human response
    // Implementation would go here
  }
}
