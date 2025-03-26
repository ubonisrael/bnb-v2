import { Suspense } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PaymentHistory } from "@/components/payments/payment-history"
import { PaymentInitiation } from "@/components/payments/payment-initiation"
import { PaymentMethods } from "@/components/payments/payment-methods"
import { PaymentOverview } from "@/components/payments/payment-overview"
import PaymentsLoading from "./loading"

export default function PaymentsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
        <p className="text-muted-foreground">
          Manage your payments, view transaction history, and update payment methods.
        </p>
      </div>

      <Suspense fallback={<PaymentsLoading />}>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Payment Overview</CardTitle>
              <CardDescription>View your payment statistics and upcoming payments.</CardDescription>
            </CardHeader>
            <CardContent>
              <PaymentOverview />
            </CardContent>
          </Card>

          <div className="lg:col-span-3">
            <Tabs defaultValue="history" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="history">Transaction History</TabsTrigger>
                <TabsTrigger value="initiate">Make a Payment</TabsTrigger>
                <TabsTrigger value="methods">Payment Methods</TabsTrigger>
              </TabsList>

              <TabsContent value="history" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Transaction History</CardTitle>
                    <CardDescription>View all your past transactions and their status.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <PaymentHistory />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="initiate" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Make a Payment</CardTitle>
                    <CardDescription>Send payments to vendors, employees, or transfer funds.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <PaymentInitiation />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="methods" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Methods</CardTitle>
                    <CardDescription>Manage your payment methods and preferences.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <PaymentMethods />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </Suspense>
    </div>
  )
}

