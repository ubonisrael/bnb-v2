"use client"

import { useState } from "react"
import { Search, Plus, Filter, MoreHorizontal, Download, Mail, Phone, Calendar, Tag } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data for clients
const clients = [
  {
    id: 1,
    name: "Jane Doe",
    email: "jane.doe@example.com",
    phone: "+1 (555) 123-4567",
    lastVisit: "Mar 15, 2023",
    totalSpent: "$450",
    visits: 8,
    tags: ["VIP", "Regular"],
    avatar: "/placeholder.svg",
  },
  {
    id: 2,
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "+1 (555) 987-6543",
    lastVisit: "Feb 28, 2023",
    totalSpent: "$320",
    visits: 5,
    tags: ["New Client"],
    avatar: "/placeholder.svg",
  },
  {
    id: 3,
    name: "Emily Johnson",
    email: "emily.johnson@example.com",
    phone: "+1 (555) 456-7890",
    lastVisit: "Mar 10, 2023",
    totalSpent: "$780",
    visits: 12,
    tags: ["VIP"],
    avatar: "/placeholder.svg",
  },
  {
    id: 4,
    name: "Michael Brown",
    email: "michael.brown@example.com",
    phone: "+1 (555) 234-5678",
    lastVisit: "Mar 5, 2023",
    totalSpent: "$150",
    visits: 2,
    tags: ["New Client"],
    avatar: "/placeholder.svg",
  },
  {
    id: 5,
    name: "Sarah Wilson",
    email: "sarah.wilson@example.com",
    phone: "+1 (555) 876-5432",
    lastVisit: "Mar 18, 2023",
    totalSpent: "$620",
    visits: 10,
    tags: ["Regular"],
    avatar: "/placeholder.svg",
  },
]

export default function ClientsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.phone.includes(searchQuery),
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1>Clients</h1>
          <p className="text-muted-foreground">Manage your client database.</p>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Client
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Client</DialogTitle>
                <DialogDescription>Enter the client's information to add them to your database.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="Enter client's full name" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="client@example.com" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" placeholder="+1 (555) 123-4567" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input id="tags" placeholder="VIP, Regular, etc." />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Add Client</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Card className="shadow-card">
        <CardHeader className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <CardTitle>Client List</CardTitle>
          <div className="flex w-full items-center gap-2 sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search clients..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Clients</TabsTrigger>
              <TabsTrigger value="vip">VIP</TabsTrigger>
              <TabsTrigger value="regular">Regular</TabsTrigger>
              <TabsTrigger value="new">New</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="m-0">
              <div className="rounded-md border">
                <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:hidden">
                  {filteredClients.map((client) => (
                    <Card key={client.id} className="shadow-card">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={client.avatar} alt={client.name} />
                            <AvatarFallback>
                              {client.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{client.name}</div>
                            <div className="text-sm text-muted-foreground">{client.email}</div>
                          </div>
                        </div>
                        <div className="mt-4 grid gap-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            {client.phone}
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            Last visit: {client.lastVisit}
                          </div>
                          <div className="flex items-center gap-2">
                            <Tag className="h-4 w-4 text-muted-foreground" />
                            {client.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="mr-1">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="mt-4 flex justify-end gap-2">
                          <Button variant="outline" size="sm">
                            <Mail className="mr-2 h-4 w-4" />
                            Email
                          </Button>
                          <Button size="sm">View Profile</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <table className="hidden w-full md:table">
                  <thead>
                    <tr className="border-b bg-muted/50 text-left text-sm font-medium">
                      <th className="px-4 py-3">Client</th>
                      <th className="px-4 py-3">Contact</th>
                      <th className="px-4 py-3">Last Visit</th>
                      <th className="px-4 py-3">Total Spent</th>
                      <th className="px-4 py-3">Visits</th>
                      <th className="px-4 py-3">Tags</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredClients.map((client) => (
                      <tr key={client.id} className="border-b">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={client.avatar} alt={client.name} />
                              <AvatarFallback>
                                {client.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{client.name}</div>
                              <div className="text-xs text-muted-foreground">{client.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">{client.phone}</td>
                        <td className="px-4 py-3">{client.lastVisit}</td>
                        <td className="px-4 py-3">{client.totalSpent}</td>
                        <td className="px-4 py-3">{client.visits}</td>
                        <td className="px-4 py-3">
                          {client.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="mr-1">
                              {tag}
                            </Badge>
                          ))}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>View profile</DropdownMenuItem>
                              <DropdownMenuItem>Edit client</DropdownMenuItem>
                              <DropdownMenuItem>Book appointment</DropdownMenuItem>
                              <DropdownMenuItem>Send message</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">Delete client</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
            <TabsContent value="vip" className="m-0">
              <div className="rounded-md border">
                <table className="hidden w-full md:table">
                  <thead>
                    <tr className="border-b bg-muted/50 text-left text-sm font-medium">
                      <th className="px-4 py-3">Client</th>
                      <th className="px-4 py-3">Contact</th>
                      <th className="px-4 py-3">Last Visit</th>
                      <th className="px-4 py-3">Total Spent</th>
                      <th className="px-4 py-3">Visits</th>
                      <th className="px-4 py-3">Tags</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredClients
                      .filter((client) => client.tags.includes("VIP"))
                      .map((client) => (
                        <tr key={client.id} className="border-b">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={client.avatar} alt={client.name} />
                                <AvatarFallback>
                                  {client.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{client.name}</div>
                                <div className="text-xs text-muted-foreground">{client.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">{client.phone}</td>
                          <td className="px-4 py-3">{client.lastVisit}</td>
                          <td className="px-4 py-3">{client.totalSpent}</td>
                          <td className="px-4 py-3">{client.visits}</td>
                          <td className="px-4 py-3">
                            {client.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="mr-1">
                                {tag}
                              </Badge>
                            ))}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
            <TabsContent value="regular" className="m-0">
              {/* Similar table for regular clients */}
            </TabsContent>
            <TabsContent value="new" className="m-0">
              {/* Similar table for new clients */}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

