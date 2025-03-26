"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Trash2, Edit, Plus, CheckCircle2, BanknoteIcon as Bank, CreditCardIcon } from "lucide-react"

// Mock data for payment methods
const initialPaymentMethods = [
  {
    id: "pm_1",
    type: "credit_card",
    name: "Visa ending in 4242",
    expiryDate: "05/2025",
    isDefault: true,
    icon: CreditCardIcon,
  },
  {
    id: "pm_2",
    type: "bank_account",
    name: "Chase Bank Account",
    accountNumber: "****6789",
    isDefault: false,
    icon: Bank,
  },
]

export function PaymentMethods() {
  const [paymentMethods, setPaymentMethods] = useState(initialPaymentMethods)
  const [isAddingMethod, setIsAddingMethod] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSetDefault = (id: string) => {
    setPaymentMethods((methods) =>
      methods.map((method) => ({
        ...method,
        isDefault: method.id === id,
      })),
    )
  }

  const handleDeleteMethod = (id: string) => {
    setPaymentMethods((methods) => methods.filter((method) => method.id !== id))
  }

  const handleAddMethod = () => {
    // Simulate adding a new payment method
    setIsAddingMethod(true)

    // Simulate API call
    setTimeout(() => {
      setIsAddingMethod(false)
      setIsSuccess(true)

      // Add a new mock payment method
      const newMethod = {
        id: `pm_${paymentMethods.length + 1}`,
        type: "credit_card",
        name: "Mastercard ending in 5678",
        expiryDate: "09/2026",
        isDefault: false,
        icon: CreditCardIcon,
      }

      setPaymentMethods((prev) => [...prev, newMethod])

      // Reset success message after 3 seconds
      setTimeout(() => {
        setIsSuccess(false)
      }, 3000)
    }, 1500)
  }

  return (
    <div className="space-y-6">
      {isSuccess && (
        <div className="bg-[#4CD964]/10 p-4 rounded-md flex items-center gap-2 mb-4">
          <CheckCircle2 className="h-5 w-5 text-[#4CD964]" />
          <p className="text-sm font-medium">Payment method added successfully!</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {paymentMethods.map((method) => (
          <Card key={method.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-[#7B68EE]/10 p-2">
                      <method.icon className="h-5 w-5 text-[#7B68EE]" />
                    </div>
                    <div>
                      <h3 className="font-medium">{method.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {method.type === "credit_card"
                          ? `Expires: ${method.expiryDate}`
                          : `Account: ${method.accountNumber}`}
                      </p>
                    </div>
                  </div>
                  {method.isDefault && (
                    <span className="text-xs bg-[#4CD964]/10 text-[#4CD964] px-2 py-1 rounded-full font-medium">
                      Default
                    </span>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={method.isDefault}
                      onCheckedChange={() => handleSetDefault(method.id)}
                      disabled={method.isDefault}
                    />
                    <Label htmlFor="default" className="text-sm">
                      {method.isDefault ? "Default method" : "Set as default"}
                    </Label>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteMethod(method.id)}
                      disabled={method.isDefault}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        <Dialog>
          <DialogTrigger asChild>
            <Card className="border-dashed cursor-pointer hover:border-[#7B68EE] transition-colors">
              <CardContent className="p-6 flex flex-col items-center justify-center h-full min-h-[180px]">
                <div className="rounded-full bg-[#7B68EE]/10 p-3 mb-3">
                  <Plus className="h-6 w-6 text-[#7B68EE]" />
                </div>
                <h3 className="font-medium mb-1">Add Payment Method</h3>
                <p className="text-sm text-muted-foreground text-center">Add a new credit card or bank account</p>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Payment Method</DialogTitle>
              <DialogDescription>Enter your payment details to add a new payment method.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="payment-type">Payment Type</Label>
                <Select defaultValue="credit_card">
                  <SelectTrigger id="payment-type">
                    <SelectValue placeholder="Select payment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="credit_card">Credit Card</SelectItem>
                    <SelectItem value="bank_account">Bank Account</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="card-number">Card Number</Label>
                <Input id="card-number" placeholder="1234 5678 9012 3456" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input id="expiry" placeholder="MM/YY" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="cvc">CVC</Label>
                  <Input id="cvc" placeholder="123" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="name">Name on Card</Label>
                <Input id="name" placeholder="John Doe" />
              </div>
              <div className="flex items-center gap-2">
                <Switch id="default-method" />
                <Label htmlFor="default-method">Set as default payment method</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {}}>
                Cancel
              </Button>
              <Button onClick={handleAddMethod} disabled={isAddingMethod}>
                {isAddingMethod ? "Adding..." : "Add Method"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Payment Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Automatic Payments</h4>
              <p className="text-sm text-muted-foreground">
                Automatically charge your default payment method for recurring bills
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Payment Notifications</h4>
              <p className="text-sm text-muted-foreground">
                Receive notifications before automatic payments are processed
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Payment Receipts</h4>
              <p className="text-sm text-muted-foreground">Receive email receipts for all payments</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </div>
    </div>
  )
}

