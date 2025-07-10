"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, CheckCircle, MessageSquare, TrendingUp } from "lucide-react"

interface Ticket {
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
}

interface AgentDashboardProps {
  tickets: Ticket[]
  stats: any
  onUpdateTicket: (id: number, updates: any) => Promise<void>
  onRefresh: () => void
}

export function AgentDashboard({ tickets, stats, onUpdateTicket, onRefresh }: AgentDashboardProps) {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [agentResponse, setAgentResponse] = useState("")
  const [filter, setFilter] = useState<"all" | "open" | "escalated" | "auto-responded">("all")

  const filteredTickets = tickets.filter((ticket) => {
    if (filter === "all") return true
    return ticket.status === filter
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "destructive"
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "default"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
        return "default"
      case "escalated":
        return "destructive"
      case "auto-responded":
        return "secondary"
      case "open":
        return "outline"
      default:
        return "outline"
    }
  }

  const handleResolveTicket = async (ticketId: number) => {
    await onUpdateTicket(ticketId, {
      status: "resolved",
      agent_response: agentResponse,
      resolved_at: new Date().toISOString(),
    })
    setSelectedTicket(null)
    setAgentResponse("")
    onRefresh()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const getSentimentEmoji = (score?: number) => {
    if (!score) return "😐"
    if (score > 0.3) return "😊"
    if (score < -0.3) return "😠"
    return "😐"
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.open}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.resolved}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Resolution</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgResolutionTime.toFixed(1)}h</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tickets" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tickets">Tickets</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="tickets" className="space-y-4">
          {/* Filter Buttons */}
          <div className="flex gap-2">
            <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
              All ({tickets.length})
            </Button>
            <Button variant={filter === "open" ? "default" : "outline"} size="sm" onClick={() => setFilter("open")}>
              Open ({tickets.filter((t) => t.status === "open").length})
            </Button>
            <Button
              variant={filter === "escalated" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("escalated")}
            >
              Escalated ({tickets.filter((t) => t.status === "escalated").length})
            </Button>
            <Button
              variant={filter === "auto-responded" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("auto-responded")}
            >
              Auto-Responded ({tickets.filter((t) => t.status === "auto-responded").length})
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tickets List */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Tickets ({filteredTickets.length})</h3>
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {filteredTickets.map((ticket) => (
                  <Card
                    key={ticket.id}
                    className={`cursor-pointer transition-colors ${
                      selectedTicket?.id === ticket.id ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => setSelectedTicket(ticket)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-sm">
                            #{ticket.id} - {ticket.subject}
                          </CardTitle>
                          <CardDescription className="text-xs">
                            {ticket.customer_name || ticket.customer_email} • {formatDate(ticket.created_at)}
                          </CardDescription>
                        </div>
                        <div className="flex gap-1">
                          {ticket.sentiment_score && (
                            <span className="text-lg">{getSentimentEmoji(ticket.sentiment_score)}</span>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex flex-wrap gap-2">
                        <Badge variant={getPriorityColor(ticket.priority)}>{ticket.priority}</Badge>
                        <Badge variant={getStatusColor(ticket.status)}>{ticket.status.replace("-", " ")}</Badge>
                        {ticket.category && <Badge variant="outline">{ticket.category}</Badge>}
                        {ticket.confidence_score && (
                          <Badge variant="secondary">{(ticket.confidence_score * 100).toFixed(0)}% confidence</Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Ticket Details */}
            <div className="space-y-4">
              {selectedTicket ? (
                <>
                  <h3 className="text-lg font-semibold">Ticket Details</h3>
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        #{selectedTicket.id} - {selectedTicket.subject}
                      </CardTitle>
                      <CardDescription>
                        From: {selectedTicket.customer_name || selectedTicket.customer_email}
                        <br />
                        Created: {formatDate(selectedTicket.created_at)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Customer Message</h4>
                        <p className="text-sm text-muted-foreground bg-muted p-3 rounded">
                          {selectedTicket.description}
                        </p>
                      </div>

                      {selectedTicket.auto_response && (
                        <div>
                          <h4 className="font-medium mb-2">AI-Generated Response</h4>
                          <div className="text-sm bg-blue-50 p-3 rounded border-l-4 border-blue-200">
                            {selectedTicket.auto_response}
                          </div>
                        </div>
                      )}

                      {selectedTicket.status !== "resolved" && (
                        <div className="space-y-3">
                          <h4 className="font-medium">Agent Response</h4>
                          <Textarea
                            value={agentResponse}
                            onChange={(e) => setAgentResponse(e.target.value)}
                            placeholder="Type your response to the customer..."
                            rows={4}
                          />
                          <Button
                            onClick={() => handleResolveTicket(selectedTicket.id)}
                            disabled={!agentResponse.trim()}
                            className="w-full"
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Resolve Ticket
                          </Button>
                        </div>
                      )}

                      {selectedTicket.agent_response && (
                        <div>
                          <h4 className="font-medium mb-2">Agent Response</h4>
                          <div className="text-sm bg-green-50 p-3 rounded border-l-4 border-green-200">
                            {selectedTicket.agent_response}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card>
                  <CardContent className="flex items-center justify-center h-64">
                    <p className="text-muted-foreground">Select a ticket to view details</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Tickets by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(stats.byCategory).map(([category, count]) => (
                    <div key={category} className="flex justify-between items-center">
                      <span className="capitalize">{category}</span>
                      <Badge variant="secondary">{count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Auto-Resolution Rate</span>
                  <Badge variant="secondary">
                    {((tickets.filter((t) => t.status === "auto-responded").length / tickets.length) * 100).toFixed(1)}%
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Escalation Rate</span>
                  <Badge variant="secondary">
                    {((tickets.filter((t) => t.status === "escalated").length / tickets.length) * 100).toFixed(1)}%
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Avg Confidence Score</span>
                  <Badge variant="secondary">
                    {((tickets.reduce((sum, t) => sum + (t.confidence_score || 0), 0) / tickets.length) * 100).toFixed(
                      1,
                    )}
                    %
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
