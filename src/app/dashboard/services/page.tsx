"use client"

import { useState } from "react"
import { Search, Plus, Filter, MoreHorizontal, Clock, DollarSign, Edit, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for services
const services = [
  {
    id: 1,
    name: "Haircut & Styling",
    category: "Hair",
    duration: "60 min",
    price: "$65",
    description: "Professional haircut and styling service tailored to your preferences.",
    popularity: "High",
  },
  {
    id: 2,
    name: "Beard Trim",
    category: "Hair",
    duration: "30 min",
    price: "$35",
    description: "Precision beard trimming and shaping for a clean, polished look.",
    popularity: "Medium",
  },
  {
    id: 3,
    name: "Manicure",
    category: "Nails",
    duration: "45 min",
    price: "$40",
    description: "Complete nail care service including cuticle treatment, shaping, and polish.",
    popularity: "High",
  },
  {
    id: 4,
    name: "Pedicure",
    category: "Nails",
    duration: "60 min",
    price: "$55",
    description: "Relaxing foot treatment including soak, exfoliation, massage, and polish.",
    popularity: "Medium",
  },
  {
    id: 5,
    name: "Facial Treatment",
    category: "Skin",
    duration: "75 min",
    price: "$90",
    description: "Customized facial treatment to address your specific skin concerns.",
    popularity: "High",
  },
  {
    id: 6,
    name: "Swedish Massage",
    category: "Massage",
    duration: "60 min",
    price: "$85",
    description: "Relaxing full-body massage to reduce tension and improve circulation.",
    popularity: "High",
  },
  {
    id: 7,
    name: "Hair Coloring",
    category: "Hair",
    duration: "120 min",
    price: "$120",
    description: "Professional hair coloring service with premium products.",
    popularity: "Medium",
  },
]

export default function ServicesPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredServices = services.filter(
    (service) =>
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1>Services</h1>
          <p className="text-muted-foreground">Manage your service offerings.</p>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Service
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Add New Service</DialogTitle>
                <DialogDescription>Create a new service to offer to your clients.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Service Name</Label>
                    <Input id="name" placeholder="Enter service name" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Select>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hair">Hair</SelectItem>
                        <SelectItem value="nails">Nails</SelectItem>
                        <SelectItem value="skin">Skin</SelectItem>
                        <SelectItem value="massage">Massage</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Select>
                      <SelectTrigger id="duration">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="45">45 minutes</SelectItem>
                        <SelectItem value="60">60 minutes</SelectItem>
                        <SelectItem value="75">75 minutes</SelectItem>
                        <SelectItem value="90">90 minutes</SelectItem>
                        <SelectItem value="120">120 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="price">Price</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input id="price" type="number" className="pl-8" placeholder="0.00" />
                    </div>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Input id="description" placeholder="Enter service description" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Add Service</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="shadow-card">
        <CardHeader className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <CardTitle>Service List</CardTitle>
          <div className="flex w-full items-center gap-2 sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search services..."
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
              <TabsTrigger value="all">All Services</TabsTrigger>
              <TabsTrigger value="hair">Hair</TabsTrigger>
              <TabsTrigger value="nails">Nails</TabsTrigger>
              <TabsTrigger value="skin">Skin</TabsTrigger>
              <TabsTrigger value="massage">Massage</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="m-0">
              <div className="rounded-md border">
                <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:hidden">
                  {filteredServices.map((service) => (
                    <Card key={service.id} className="shadow-card">
                      <CardContent className="p-4">
                        <div className="flex justify-between">
                          <div className="font-medium">{service.name}</div>
                          <Badge variant="outline">{service.category}</Badge>
                        </div>
                        <div className="mt-2 text-sm text-muted-foreground">{service.description}</div>
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{service.duration}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{service.price}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <table className="hidden w-full md:table">
                  <thead>
                    <tr className="border-b bg-muted/50 text-left text-sm font-medium">
                      <th className="px-4 py-3">Service</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Duration</th>
                      <th className="px-4 py-3">Price</th>
                      <th className="px-4 py-3">Popularity</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredServices.map((service) => (
                      <tr key={service.id} className="border-b">
                        <td className="px-4 py-3">
                          <div>
                            <div className="font-medium">{service.name}</div>
                            <div className="text-xs text-muted-foreground">{service.description}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="outline">{service.category}</Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            {service.duration}
                          </div>
                        </td>
                        <td className="px-4 py-3">{service.price}</td>
                        <td className="px-4 py-3">
                          <Badge
                            variant="outline"
                            className={
                              service.popularity === "High"
                                ? "border-primary/30 bg-primary/10 text-primary"
                                : "border-muted bg-muted/50"
                            }
                          >
                            {service.popularity}
                          </Badge>
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
                              <DropdownMenuItem>Edit service</DropdownMenuItem>
                              <DropdownMenuItem>Duplicate service</DropdownMenuItem>
                              <DropdownMenuItem>View bookings</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">Delete service</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
            <TabsContent value="hair" className="m-0">
              {/* Similar table for hair services */}
            </TabsContent>
            <TabsContent value="nails" className="m-0">
              {/* Similar table for nail services */}
            </TabsContent>
            <TabsContent value="skin" className="m-0">
              {/* Similar table for skin services */}
            </TabsContent>
            <TabsContent value="massage" className="m-0">
              {/* Similar table for massage services */}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

