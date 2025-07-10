import { generateText } from "ai"
import { google } from "@ai-sdk/google"

export interface TicketAnalysis {
  category: string
  priority: "low" | "medium" | "high" | "urgent"
  sentiment: number // -1 to 1
  tags: string[]
  urgencyKeywords: string[]
}

export async function analyzeTicket(subject: string, description: string): Promise<TicketAnalysis> {
  const { text } = await generateText({
    model: google("gemini-1.5-flash"),
    prompt: `Analyze this customer support ticket and provide a JSON response with the following structure:
    {
      "category": "one of: shipping, returns, payment, quality, account, technical, other",
      "priority": "low, medium, high, or urgent",
      "sentiment": "number between -1 (very negative) and 1 (very positive)",
      "tags": ["array", "of", "relevant", "tags"],
      "urgencyKeywords": ["keywords", "that", "indicate", "urgency"]
    }

    Subject: ${subject}
    Description: ${description}

    Consider factors like:
    - Emotional language and tone
    - Financial impact
    - Time sensitivity
    - Customer frustration level
    - Business impact

    Respond only with valid JSON.`,
  })

  try {
    return JSON.parse(text)
  } catch (error) {
    // Fallback analysis
    return {
      category: "other",
      priority: "medium",
      sentiment: 0,
      tags: [],
      urgencyKeywords: [],
    }
  }
}

export function calculateConfidenceScore(
  similarTickets: any[],
  knowledgeMatches: any[],
  analysis: TicketAnalysis,
): number {
  let confidence = 0.5 // Base confidence

  // Boost confidence based on similar resolved tickets
  if (similarTickets.length > 0) {
    const avgSimilarity = similarTickets.reduce((sum, ticket) => sum + ticket.similarity, 0) / similarTickets.length
    confidence += avgSimilarity * 0.3
  }

  // Boost confidence based on knowledge base matches
  if (knowledgeMatches.length > 0) {
    const avgSimilarity = knowledgeMatches.reduce((sum, match) => sum + match.similarity, 0) / knowledgeMatches.length
    confidence += avgSimilarity * 0.2
  }

  // Adjust based on category certainty
  const commonCategories = ["shipping", "returns", "payment", "quality"]
  if (commonCategories.includes(analysis.category)) {
    confidence += 0.1
  }

  return Math.min(confidence, 1.0)
}
