import { generateText } from "ai"
import { google } from "@ai-sdk/google"

export interface ResponseContext {
  ticketSubject: string
  ticketDescription: string
  category: string
  similarTickets: any[]
  knowledgeBase: any[]
  customerHistory?: any[]
}

export async function generateSmartResponse(context: ResponseContext): Promise<string> {
  const similarTicketsContext = context.similarTickets
    .map((ticket) => `Similar Issue: ${ticket.subject}\nResolution: ${ticket.agent_response}`)
    .join("\n\n")

  const knowledgeContext = context.knowledgeBase.map((kb) => `${kb.title}: ${kb.content}`).join("\n\n")

  const { text } = await generateText({
    model: google("gemini-1.5-flash"),
    prompt: `You are a helpful customer support agent. Generate a professional, empathetic response to this customer ticket.

    Customer Issue:
    Subject: ${context.ticketSubject}
    Description: ${context.ticketDescription}
    Category: ${context.category}

    Relevant Knowledge Base:
    ${knowledgeContext}

    Similar Resolved Tickets:
    ${similarTicketsContext}

    Guidelines:
    1. Be empathetic and acknowledge the customer's concern
    2. Provide a clear, actionable solution based on the knowledge base
    3. Reference similar successful resolutions when applicable
    4. Be concise but thorough
    5. End with next steps or follow-up information
    6. Maintain a professional, friendly tone

    Generate a response that addresses the customer's specific issue:`,
  })

  return text
}

export async function shouldEscalateToHuman(
  confidenceScore: number,
  sentiment: number,
  priority: string,
  category: string,
): Promise<{ shouldEscalate: boolean; reason: string }> {
  // Escalation rules
  if (confidenceScore < 0.6) {
    return { shouldEscalate: true, reason: "Low confidence in automated response" }
  }

  if (sentiment < -0.7) {
    return { shouldEscalate: true, reason: "Highly negative customer sentiment" }
  }

  if (priority === "urgent") {
    return { shouldEscalate: true, reason: "Urgent priority ticket" }
  }

  if (category === "technical" && confidenceScore < 0.8) {
    return { shouldEscalate: true, reason: "Complex technical issue" }
  }

  return { shouldEscalate: false, reason: "Automated response appropriate" }
}
