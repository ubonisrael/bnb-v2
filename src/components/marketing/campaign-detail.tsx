"use client"

import { useState } from "react"
import { format } from "date-fns"
import { ArrowLeft, Mail, Users, Calendar, Edit, Copy, Trash, Send } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

// Mock data for campaign details
const mockCampaignDetails = {
  1: {
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
    subject: "Summer Specials - Limited Time Offers Inside!",
    previewText: "Enjoy 20% off all services this summer",
    content: `
      <h1>Summer Special Promotion</h1>
      <p>Dear valued client,</p>
      <p>Summer is here, and we're excited to offer you some amazing deals on our most popular services!</p>
      <ul>
        <li>20% off all haircuts and styling</li>
        <li>Buy one, get one 50% off on all nail services</li>
        <li>Complimentary scalp massage with any color service</li>
      </ul>
      <p>These offers are valid until August 31st. Book your appointment today!</p>
      <a href="#">Book Now</a>
    `,
    stats: {
      sent: 245,
      delivered: 240,
      opened: 78,
      clicked: 20,
      bounced: 5,
      unsubscribed: 2,
    },
    topLinks: [
      { url: "Book Now", clicks: 15 },
      { url: "View Services", clicks: 5 },
    ],
  },
  4: {
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
    subject: "Holiday Specials - Treat Yourself This Season!",
    previewText: "Exclusive holiday packages and gift card offers",
    content: `
      <h1>Holiday Special Offers</h1>
      <p>Dear valued client,</p>
      <p>The holiday season is approaching, and we have some special offers just for you!</p>
      <ul>
        <li>Holiday package: Haircut, manicure, and facial for $150 (save $50)</li>
        <li>Buy a $100 gift card, get a $20 gift card free</li>
        <li>25% off all products with any service booking</li>
      </ul>
      <p>These offers are valid from December 1st to January 15th. Book your appointment today!</p>
      <a href="#">Book Now</a>
    `,
    stats: null,
    topLinks: null,
  },
}

interface CampaignDetailProps {
  campaignId: number
  onBack: () => void
}

export function CampaignDetail({ campaignId, onBack }: CampaignDetailProps) {
  const [campaign, setCampaign] = useState(mockCampaignDetails[campaignId as keyof typeof mockCampaignDetails])
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isSendDialogOpen, setIsSendDialogOpen] = useState(false)

  if (!campaign) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Campaign not found</p>
      </div>
    )
  }

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
        <Button variant="ghost" onClick={onBack} className="gap-1">
          <ArrowLeft className="h-4 w-4" />
          Back to campaigns
        </Button>
        <div className="flex gap-2">
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="outline">
            <Copy className="mr-2 h-4 w-4" />
            Duplicate
          </Button>
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="text-destructive">
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the campaign and remove it from our
                  servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          {(campaign.status === "draft" || campaign.status === "scheduled") && (
            <AlertDialog open={isSendDialogOpen} onOpenChange={setIsSendDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button>
                  <Send className="mr-2 h-4 w-4" />
                  {campaign.status === "scheduled" ? "Send Now" : "Send"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Send campaign now?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will send the campaign to {campaign.recipients} recipients immediately.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction>Send Now</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{campaign.name}</CardTitle>
                  <CardDescription>Created on {format(campaign.createdAt, "MMMM d, yyyy")}</CardDescription>
                </div>
                {getStatusBadge(campaign.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Type</p>
                      <p className="text-sm text-muted-foreground capitalize">{campaign.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Audience</p>
                      <p className="text-sm text-muted-foreground">{campaign.audience}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">
                        {campaign.status === "scheduled" ? "Scheduled Date" : "Send Date"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {campaign.scheduledDate ? format(campaign.scheduledDate, "MMMM d, yyyy") : "Not scheduled"}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="mb-2 font-medium">Email Content</h3>
                  <div className="rounded-md border p-4">
                    <p className="font-medium">Subject: {campaign.subject}</p>
                    <p className="text-sm text-muted-foreground">Preview: {campaign.previewText}</p>
                    <Separator className="my-4" />
                    <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: campaign.content }} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Campaign Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium">Recipients</p>
                  <p className="text-2xl font-bold">{campaign.recipients}</p>
                </div>

                {campaign.stats && (
                  <>
                    <Separator />
                    <div className="space-y-4">
                      <div>
                        <div className="mb-1 flex items-center justify-between">
                          <p className="text-sm font-medium">Open Rate</p>
                          <p className="text-sm">{campaign.openRate}%</p>
                        </div>
                        <Progress value={campaign.openRate} className="h-2" />
                      </div>
                      <div>
                        <div className="mb-1 flex items-center justify-between">
                          <p className="text-sm font-medium">Click Rate</p>
                          <p className="text-sm">{campaign.clickRate}%</p>
                        </div>
                        <Progress value={campaign.clickRate} className="h-2" />
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <p className="text-sm font-medium">Delivery Statistics</p>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="rounded-md bg-muted p-2">
                          <p className="text-xs text-muted-foreground">Sent</p>
                          <p className="font-medium">{campaign.stats.sent}</p>
                        </div>
                        <div className="rounded-md bg-muted p-2">
                          <p className="text-xs text-muted-foreground">Delivered</p>
                          <p className="font-medium">{campaign.stats.delivered}</p>
                        </div>
                        <div className="rounded-md bg-muted p-2">
                          <p className="text-xs text-muted-foreground">Opened</p>
                          <p className="font-medium">{campaign.stats.opened}</p>
                        </div>
                        <div className="rounded-md bg-muted p-2">
                          <p className="text-xs text-muted-foreground">Clicked</p>
                          <p className="font-medium">{campaign.stats.clicked}</p>
                        </div>
                        <div className="rounded-md bg-muted p-2">
                          <p className="text-xs text-muted-foreground">Bounced</p>
                          <p className="font-medium">{campaign.stats.bounced}</p>
                        </div>
                        <div className="rounded-md bg-muted p-2">
                          <p className="text-xs text-muted-foreground">Unsubscribed</p>
                          <p className="font-medium">{campaign.stats.unsubscribed}</p>
                        </div>
                      </div>
                    </div>

                    {campaign.topLinks && campaign.topLinks.length > 0 && (
                      <>
                        <Separator />
                        <div>
                          <p className="mb-2 text-sm font-medium">Top Clicked Links</p>
                          <div className="space-y-2">
                            {campaign.topLinks.map((link, index) => (
                              <div key={index} className="flex items-center justify-between rounded-md border p-2">
                                <p className="text-sm">{link.url}</p>
                                <Badge variant="outline">{link.clicks} clicks</Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

