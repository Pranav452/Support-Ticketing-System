import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export interface Ticket {
  id: number
  customer_email: string
  customer_name?: string
  subject: string
  description: string
  category?: string
  priority: string
  status: string
  sentiment_score?: number
  confidence_score?: number
  auto_response?: string
  agent_response?: string
  created_at: string
  updated_at: string
  resolved_at?: string
}

export interface KnowledgeBase {
  id: number
  title: string
  content: string
  category?: string
  tags: string[]
  created_at: string
  updated_at: string
}

export async function createTicket(ticket: Omit<Ticket, "id" | "created_at" | "updated_at">): Promise<Ticket> {
  const [result] = await sql`
    INSERT INTO tickets (
      customer_email, customer_name, subject, description, category, 
      priority, status, sentiment_score, confidence_score, auto_response
    ) VALUES (
      ${ticket.customer_email}, ${ticket.customer_name}, ${ticket.subject}, 
      ${ticket.description}, ${ticket.category}, ${ticket.priority}, 
      ${ticket.status}, ${ticket.sentiment_score}, ${ticket.confidence_score}, 
      ${ticket.auto_response}
    ) RETURNING *
  `
  return result as Ticket
}

export async function getTickets(status?: string): Promise<Ticket[]> {
  if (status) {
    return await sql`SELECT * FROM tickets WHERE status = ${status} ORDER BY created_at DESC`
  }
  return await sql`SELECT * FROM tickets ORDER BY created_at DESC`
}

export async function getTicketById(id: number): Promise<Ticket | null> {
  const [result] = await sql`SELECT * FROM tickets WHERE id = ${id}`
  return (result as Ticket) || null
}

export async function updateTicket(id: number, updates: Partial<Ticket>): Promise<Ticket> {
  const setClause = Object.keys(updates)
    .map((key) => `${key} = $${Object.keys(updates).indexOf(key) + 2}`)
    .join(", ")

  const values = [id, ...Object.values(updates)]

  const [result] = await sql`
    UPDATE tickets 
    SET ${sql.unsafe(setClause)}, updated_at = CURRENT_TIMESTAMP
    WHERE id = $1 
    RETURNING *
  `.apply(null, values)

  return result as Ticket
}

export async function getKnowledgeBase(): Promise<KnowledgeBase[]> {
  return await sql`SELECT * FROM knowledge_base ORDER BY created_at DESC`
}

export async function searchSimilarTickets(category: string, limit = 5): Promise<Ticket[]> {
  return await sql`
    SELECT * FROM tickets 
    WHERE category = ${category} 
    AND status = 'resolved' 
    AND agent_response IS NOT NULL
    ORDER BY created_at DESC 
    LIMIT ${limit}
  `
}

export async function getTicketsByCategory(category: string): Promise<Ticket[]> {
  return await sql`
    SELECT * FROM tickets 
    WHERE category = ${category} 
    ORDER BY created_at DESC
  `
}

export async function getTicketStats(): Promise<{
  total: number
  open: number
  resolved: number
  byCategory: Record<string, number>
  avgResolutionTime: number
}> {
  const [totalResult] = await sql`SELECT COUNT(*) as count FROM tickets`
  const [openResult] = await sql`SELECT COUNT(*) as count FROM tickets WHERE status = 'open'`
  const [resolvedResult] = await sql`SELECT COUNT(*) as count FROM tickets WHERE status = 'resolved'`

  const categoryResults = await sql`
    SELECT category, COUNT(*) as count 
    FROM tickets 
    WHERE category IS NOT NULL 
    GROUP BY category
  `

  const [avgTimeResult] = await sql`
    SELECT AVG(EXTRACT(EPOCH FROM (resolved_at - created_at))/3600) as avg_hours
    FROM tickets 
    WHERE resolved_at IS NOT NULL
  `

  const byCategory: Record<string, number> = {}
  categoryResults.forEach((row: any) => {
    byCategory[row.category] = Number.parseInt(row.count)
  })

  return {
    total: Number.parseInt(totalResult.count),
    open: Number.parseInt(openResult.count),
    resolved: Number.parseInt(resolvedResult.count),
    byCategory,
    avgResolutionTime: Number.parseFloat(avgTimeResult?.avg_hours || "0"),
  }
}
