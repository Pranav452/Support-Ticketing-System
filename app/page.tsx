"use client"
import { TicketForm } from "@/components/ticket-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Zap, Target, Shield } from "lucide-react"

export default function HomePage() {
  const handleTicketSubmit = async (data: any) => {
    const response = await fetch("/api/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error("Failed to submit ticket")
    }

    return response.json()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Smart Customer Support</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            AI-powered support system that automatically categorizes tickets and provides intelligent responses using
            RAG architecture
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardHeader className="text-center">
              <Brain className="h-8 w-8 mx-auto text-blue-500 mb-2" />
              <CardTitle className="text-lg">AI Categorization</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Automatically categorizes tickets using advanced NLP
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Zap className="h-8 w-8 mx-auto text-green-500 mb-2" />
              <CardTitle className="text-lg">Smart Responses</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Generates contextual responses from knowledge base
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Target className="h-8 w-8 mx-auto text-orange-500 mb-2" />
              <CardTitle className="text-lg">Priority Detection</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Automatically assigns priority based on urgency
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Shield className="h-8 w-8 mx-auto text-purple-500 mb-2" />
              <CardTitle className="text-lg">Quality Assurance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">Confidence scoring with human escalation</p>
            </CardContent>
          </Card>
        </div>

        {/* Ticket Form */}
        <TicketForm onSubmit={handleTicketSubmit} />

        {/* How it Works */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <h3 className="font-semibold mb-2">Submit Ticket</h3>
              <p className="text-sm text-muted-foreground">
                Customer submits a support ticket with their issue description
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 font-bold">2</span>
              </div>
              <h3 className="font-semibold mb-2">AI Analysis</h3>
              <p className="text-sm text-muted-foreground">
                RAG pipeline analyzes the ticket and searches for similar solutions
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-600 font-bold">3</span>
              </div>
              <h3 className="font-semibold mb-2">Smart Response</h3>
              <p className="text-sm text-muted-foreground">System generates response or escalates to human agent</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
