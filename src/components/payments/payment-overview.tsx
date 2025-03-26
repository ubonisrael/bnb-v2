"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight, DollarSign, CalendarClock } from "lucide-react"
import { Button } from "@/components/ui/button"

export function PaymentOverview() {
  // Mock data for payment statistics
  const paymentStats = [
    {
      title: "Total Revenue",
      value: "$12,845.00",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      color: "#7B68EE",
    },
    {
      title: "Pending Payments",
      value: "$2,150.00",
      change: "+5.2%",
      trend: "up",
      icon: CalendarClock,
      color: "#FFCC00",
    },
    {
      title: "Expenses",
      value: "$4,320.00",
      change: "-2.4%",
      trend: "down",
      icon: ArrowUpRight,
      color: "#FF6B6B",
    },
    {
      title: "Net Income",
      value: "$8,525.00",
      change: "+15.3%",
      trend: "up",
      icon: ArrowDownRight,
      color: "#4CD964",
    },
  ]

  // Mock data for upcoming payments
  const upcomingPayments = [
    {
      id: "up_1",
      description: "Monthly subscription",
      amount: 49.99,
      dueDate: "2023-06-15",
      recipient: "BanknBook Premium",
    },
    {
      id: "up_2",
      description: "Equipment lease",
      amount: 250.0,
      dueDate: "2023-06-20",
      recipient: "Equipment Rentals Co.",
    },
    {
      id: "up_3",
      description: "Marketing services",
      amount: 150.0,
      dueDate: "2023-06-25",
      recipient: "Digital Marketing Agency",
    },
  ]

  // Format date to more readable format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  // Calculate days remaining until due date
  const getDaysRemaining = (dueDate: string) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {paymentStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">{stat.title}</p>
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                </div>
                <div className={`rounded-full bg-[${stat.color}]/10 p-2`}>
                  <stat.icon className={`h-5 w-5 text-[${stat.color}]`} />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className={`text-xs font-medium ${stat.trend === "up" ? "text-[#4CD964]" : "text-[#FF6B6B]"}`}>
                  {stat.change}
                </span>
                <span className="text-xs text-muted-foreground ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Upcoming Payments</h3>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>

        <div className="space-y-3">
          {upcomingPayments.map((payment) => {
            const daysRemaining = getDaysRemaining(payment.dueDate)
            return (
              <Card key={payment.id}>
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{payment.description}</h4>
                    <p className="text-sm text-muted-foreground">{payment.recipient}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <p className="font-bold">${payment.amount.toFixed(2)}</p>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-muted-foreground">Due:</span>
                      <span
                        className={`text-xs font-medium ${
                          daysRemaining <= 3
                            ? "text-[#FF6B6B]"
                            : daysRemaining <= 7
                              ? "text-[#FFCC00]"
                              : "text-[#4CD964]"
                        }`}
                      >
                        {formatDate(payment.dueDate)} ({daysRemaining} days)
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}

