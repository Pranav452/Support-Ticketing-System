"use client"

import { useState, useEffect } from "react"
import { AgentDashboard } from "@/components/agent-dashboard"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

export default function DashboardPage() {
  const [tickets, setTickets] = useState([])
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    resolved: 0,
    byCategory: {},
    avgResolutionTime: 0,
  })
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      const response = await fetch("/api/tickets?includeStats=true")
      const data = await response.json()
      setTickets(data.tickets)
      setStats(data.stats)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateTicket = async (id: number, updates: any) => {
    try {
      await fetch(`/api/tickets/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })
    } catch (error) {
      console.error("Error updating ticket:", error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Agent Dashboard</h1>
            <p className="text-gray-600">Manage customer support tickets and monitor AI performance</p>
          </div>
          <Button onClick={fetchData} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>

        <AgentDashboard tickets={tickets} stats={stats} onUpdateTicket={handleUpdateTicket} onRefresh={fetchData} />
      </div>
    </div>
  )
}
