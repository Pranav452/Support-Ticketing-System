"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { MessageSquare, BarChart3, Home } from "lucide-react"

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <MessageSquare className="h-6 w-6 text-blue-600" />
              <span className="font-bold text-xl">Smart Support</span>
            </Link>

            <div className="flex space-x-4">
              <Link href="/">
                <Button variant={pathname === "/" ? "default" : "ghost"} size="sm">
                  <Home className="mr-2 h-4 w-4" />
                  Submit Ticket
                </Button>
              </Link>

              <Link href="/dashboard">
                <Button variant={pathname === "/dashboard" ? "default" : "ghost"} size="sm">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
