"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Send, CheckCircle, AlertTriangle } from "lucide-react"

interface TicketFormProps {
  onSubmit: (data: {
    customerEmail: string
    customerName: string
    subject: string
    description: string
  }) => Promise<any>
}

export function TicketForm({ onSubmit }: TicketFormProps) {
  const [formData, setFormData] = useState({
    customerEmail: "",
    customerName: "",
    subject: "",
    description: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setResult(null)

    try {
      const response = await onSubmit(formData)
      setResult(response)
      setFormData({ customerEmail: "", customerName: "", subject: "", description: "" })
    } catch (err) {
      setError("Failed to submit ticket. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (result) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Ticket Submitted Successfully
          </CardTitle>
          <CardDescription>Ticket #{result.ticket.id} has been created and processed</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">Category</Label>
              <p className="text-sm text-muted-foreground capitalize">{result.analysis.category}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Priority</Label>
              <p className="text-sm text-muted-foreground capitalize">{result.analysis.priority}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Confidence Score</Label>
              <p className="text-sm text-muted-foreground">{(result.confidenceScore * 100).toFixed(1)}%</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Status</Label>
              <p className="text-sm text-muted-foreground capitalize">{result.ticket.status.replace("-", " ")}</p>
            </div>
          </div>

          {result.shouldEscalate && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                This ticket has been escalated to a human agent: {result.escalationReason}
              </AlertDescription>
            </Alert>
          )}

          <div>
            <Label className="text-sm font-medium">AI-Generated Response</Label>
            <div className="mt-2 p-3 bg-muted rounded-md">
              <p className="text-sm">{result.autoResponse}</p>
            </div>
          </div>

          <Button onClick={() => setResult(null)} className="w-full">
            Submit Another Ticket
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Submit Support Ticket</CardTitle>
        <CardDescription>
          Describe your issue and our AI will automatically categorize and provide an initial response
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.customerEmail}
                onChange={(e) => handleInputChange("customerEmail", e.target.value)}
                required
                placeholder="your@email.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.customerName}
                onChange={(e) => handleInputChange("customerName", e.target.value)}
                placeholder="John Doe"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject *</Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) => handleInputChange("subject", e.target.value)}
              required
              placeholder="Brief description of your issue"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              required
              placeholder="Please provide detailed information about your issue..."
              rows={6}
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing Ticket...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Submit Ticket
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
