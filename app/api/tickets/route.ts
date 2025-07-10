import { type NextRequest, NextResponse } from "next/server"
import { processTicket } from "@/lib/rag-service"
import { getTickets, getTicketStats } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customerEmail, customerName, subject, description } = body

    if (!customerEmail || !subject || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const result = await processTicket({
      customerEmail,
      customerName,
      subject,
      description,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error processing ticket:", error)
    return NextResponse.json({ error: "Failed to process ticket" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const includeStats = searchParams.get("includeStats") === "true"

    const tickets = await getTickets(status || undefined)

    if (includeStats) {
      const stats = await getTicketStats()
      return NextResponse.json({ tickets, stats })
    }

    return NextResponse.json({ tickets })
  } catch (error) {
    console.error("Error fetching tickets:", error)
    return NextResponse.json({ error: "Failed to fetch tickets" }, { status: 500 })
  }
}
