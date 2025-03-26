"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Search, Plus, Filter, MoreHorizontal, Mail, Users, Calendar, MessageSquare } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data for campaigns
const mockCampaigns = [
  {
    id: 1,
    name: "Summer Special Promotion",
    type: "email",
    status: "active",
    audience: "All Clients",
    recipients: 245,
    openRate: 32,
    clickRate: 8,
    scheduledDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2), // 2 days from now
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
  },
  {
    id: 2,
    name: "New Service Announcement",
    type: "email",
    status: "draft",
    audience: "Regular Clients",
    recipients: 120,
    openRate: null,
    clickRate: null,
    scheduledDate: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
  },
  {
    id: 3,
    name: "Appointment Reminder",
    type: "sms",
    status: "completed",
    audience: "Upcoming Appointments",
    recipients: 78,
    openRate: null,
    clickRate: null,
    scheduledDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1), // 1 day ago
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
  },
  {
    id: 4,
    name: "Holiday Special Offers",
    type: "email",
    status: "scheduled",
    audience: "All Clients",
    recipients: 245,
    openRate: null,
    clickRate: null,
    scheduledDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days from now
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1), // 1 day ago
  },
  {
    id: 5,
    name: "Customer Feedback Request",
    type: "email",
    status: "completed",
    audience: "Recent Clients",
    recipients: 85,
    openRate: 45,
    clickRate: 12,
    scheduledDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 7 days ago
  },
]

interface CampaignListProps {
  onSelectCampaign: (campaignId: number) => void
  onCreateCampaign: () => void
}

export function CampaignList({ onSelectCampaign, onCreateCampaign }: CampaignListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [campaigns, setCampaigns] = useState(mockCampaigns)

  // Filter campaigns based on search query
  const filteredCampaigns = campaigns.filter(
    (campaign) =>
      campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.audience.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.status.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-[#4CD964]/10 text-[#4CD964] border-[#4CD964]/30">Active</Badge>
      case "draft":
        return (
          <Badge variant="outline" className="bg-muted/50">
            Draft
          </Badge>
        )
      case "scheduled":
        return <Badge className="bg-[#5AC8FA]/10 text-[#5AC8FA] border-[#5AC8FA]/30">Scheduled</Badge>
      case "completed":
        return <Badge className="bg-[#6E6E73]/10 text-[#6E6E73] border-[#6E6E73]/30">Completed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search campaigns..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button onClick={onCreateCampaign}>
            <Plus className="mr-2 h-4 w-4" />
            Create Campaign
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Campaigns</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">
          {filteredCampaigns.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <h3 className="text-lg font-medium">No campaigns found</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {searchQuery
                  ? "No campaigns match your search criteria."
                  : "Get started by creating your first marketing campaign."}
              </p>
              {searchQuery ? (
                <Button variant="outline" className="mt-4" onClick={() => setSearchQuery("")}>
                  Clear Search
                </Button>
              ) : (
                <Button className="mt-4" onClick={onCreateCampaign}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Campaign
                </Button>
              )}
            </div>
          ) : (
            <div className="rounded-md border">
              <div className="grid grid-cols-1 gap-4 p-4 sm:hidden">
                {filteredCampaigns.map((campaign) => (
                  <div
                    key={campaign.id}
                    className="rounded-lg border p-4 cursor-pointer hover:border-primary/50 hover:bg-muted/50"
                    onClick={() => onSelectCampaign(campaign.id)}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{campaign.name}</h3>
                      {getStatusBadge(campaign.status)}
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                      {campaign.type === "email" ? <Mail className="h-4 w-4" /> : <MessageSquare className="h-4 w-4" />}
                      <span className="capitalize">{campaign.type}</span>
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{campaign.audience}</span>
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {campaign.scheduledDate
                          ? `Scheduled for ${format(campaign.scheduledDate, "MMM d, yyyy")}`
                          : `Created on ${format(campaign.createdAt, "MMM d, yyyy")}`}
                      </span>
                    </div>
                    {campaign.openRate !== null && (
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        <div className="rounded-md bg-muted p-2 text-center">
                          <p className="text-xs text-muted-foreground">Open Rate</p>
                          <p className="font-medium">{campaign.openRate}%</p>
                        </div>
                        <div className="rounded-md bg-muted p-2 text-center">
                          <p className="text-xs text-muted-foreground">Click Rate</p>
                          <p className="font-medium">{campaign.clickRate}%</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <table className="hidden w-full sm:table">
                <thead>
                  <tr className="border-b bg-muted/50 text-left text-sm font-medium">
                    <th className="px-4 py-3">Campaign</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Audience</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCampaigns.map((campaign) => (
                    <tr
                      key={campaign.id}
                      className="border-b cursor-pointer hover:bg-muted/50"
                      onClick={() => onSelectCampaign(campaign.id)}
                    >
                      <td className="px-4 py-3">
                        <div className="font-medium">{campaign.name}</div>
                        <div className="text-xs text-muted-foreground">{campaign.recipients} recipients</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {campaign.type === "email" ? (
                            <Mail className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <MessageSquare className="h-4 w-4 text-muted-foreground" />
                          )}
                          <span className="capitalize">{campaign.type}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">{campaign.audience}</td>
                      <td className="px-4 py-3">{getStatusBadge(campaign.status)}</td>
                      <td className="px-4 py-3">
                        {campaign.scheduledDate
                          ? format(campaign.scheduledDate, "MMM d, yyyy")
                          : format(campaign.createdAt, "MMM d, yyyy")}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                onSelectCampaign(campaign.id)
                              }}
                            >
                              View details
                            </DropdownMenuItem>
                            <DropdownMenuItem>Edit campaign</DropdownMenuItem>
                            <DropdownMenuItem>Duplicate campaign</DropdownMenuItem>
                            {campaign.status === "active" && <DropdownMenuItem>Pause campaign</DropdownMenuItem>}
                            {campaign.status === "draft" && <DropdownMenuItem>Publish campaign</DropdownMenuItem>}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">Delete campaign</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>
        <TabsContent value="active" className="mt-4">
          {/* Similar content for active campaigns */}
        </TabsContent>
        <TabsContent value="scheduled" className="mt-4">
          {/* Similar content for scheduled campaigns */}
        </TabsContent>
        <TabsContent value="draft" className="mt-4">
          {/* Similar content for draft campaigns */}
        </TabsContent>
        <TabsContent value="completed" className="mt-4">
          {/* Similar content for completed campaigns */}
        </TabsContent>
      </Tabs>
    </div>
  )
}

