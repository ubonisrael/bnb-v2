"use client"

import { useState } from "react"
import { ArrowLeft, Send, Calendar, Clock, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface CampaignCreatorProps {
  onBack: () => void
  onSave: (campaign: any) => void
}

export function CampaignCreator({ onBack, onSave }: CampaignCreatorProps) {
  const [campaignType, setCampaignType] = useState<"email" | "sms">("email")
  const [campaignName, setCampaignName] = useState("")
  const [subject, setSubject] = useState("")
  const [previewText, setPreviewText] = useState("")
  const [content, setContent] = useState("")
  const [audience, setAudience] = useState("all-clients")
  const [sendOption, setSendOption] = useState<"now" | "later" | "draft">("draft")
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(undefined)
  const [scheduledTime, setScheduledTime] = useState<string | undefined>(undefined)

  const handleSave = () => {
    // Create campaign object
    const campaign = {
      name: campaignName,
      type: campaignType,
      subject,
      previewText,
      content,
      audience: getAudienceName(audience),
      status: sendOption === "now" ? "active" : sendOption === "later" ? "scheduled" : "draft",
      scheduledDate: sendOption === "later" && scheduledDate ? scheduledDate : null,
      scheduledTime,
      createdAt: new Date(),
    }

    onSave(campaign)
  }

  const getAudienceName = (audienceValue: string) => {
    switch (audienceValue) {
      case "all-clients":
        return "All Clients"
      case "regular-clients":
        return "Regular Clients"
      case "new-clients":
        return "New Clients"
      case "inactive-clients":
        return "Inactive Clients"
      default:
        return "Custom Audience"
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
          <Button variant="outline" onClick={() => onSave({ ...campaignName, status: "draft" })}>
            Save as Draft
          </Button>
          <Button onClick={handleSave}>
            {sendOption === "now" ? (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Campaign
              </>
            ) : sendOption === "later" ? (
              <>
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Campaign
              </>
            ) : (
              "Save Campaign"
            )}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Create New Campaign</CardTitle>
              <CardDescription>Set up your campaign details and content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="campaign-name">Campaign Name</Label>
                  <Input
                    id="campaign-name"
                    placeholder="Enter campaign name"
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Campaign Type</Label>
                  <RadioGroup
                    defaultValue={campaignType}
                    onValueChange={(value) => setCampaignType(value as "email" | "sms")}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="email" id="email" />
                      <Label htmlFor="email">Email Campaign</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="sms" id="sms" />
                      <Label htmlFor="sms">SMS Campaign</Label>
                    </div>
                  </RadioGroup>
                </div>

                <Tabs defaultValue="content" className="mt-6">
                  <TabsList>
                    <TabsTrigger value="content">Content</TabsTrigger>
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                  </TabsList>
                  <TabsContent value="content" className="space-y-4 pt-4">
                    {campaignType === "email" ? (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="subject">Email Subject</Label>
                          <Input
                            id="subject"
                            placeholder="Enter email subject"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="preview-text">Preview Text</Label>
                          <Input
                            id="preview-text"
                            placeholder="Enter preview text"
                            value={previewText}
                            onChange={(e) => setPreviewText(e.target.value)}
                          />
                          <p className="text-xs text-muted-foreground">
                            This text appears in the inbox preview of most email clients.
                          </p>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="content">Email Content</Label>
                          <Textarea
                            id="content"
                            placeholder="Enter email content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="min-h-[300px]"
                          />
                        </div>
                      </>
                    ) : (
                      <div className="space-y-2">
                        <Label htmlFor="sms-content">SMS Content</Label>
                        <Textarea
                          id="sms-content"
                          placeholder="Enter SMS content"
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                          className="min-h-[150px]"
                        />
                        <div className="flex justify-between">
                          <p className="text-xs text-muted-foreground">SMS messages are limited to 160 characters.</p>
                          <p className="text-xs">{content.length}/160 characters</p>
                        </div>
                      </div>
                    )}
                  </TabsContent>
                  <TabsContent value="preview" className="pt-4">
                    <div className="rounded-md border p-4">
                      {campaignType === "email" ? (
                        <>
                          <p className="font-medium">Subject: {subject || "Your subject will appear here"}</p>
                          <p className="text-sm text-muted-foreground">
                            Preview: {previewText || "Your preview text will appear here"}
                          </p>
                          <div className="mt-4 border-t pt-4">
                            <div className="prose max-w-none">
                              {content ? (
                                <div dangerouslySetInnerHTML={{ __html: content }} />
                              ) : (
                                <p>Your email content will appear here</p>
                              )}
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="bg-muted p-4 rounded-md max-w-xs mx-auto">
                          <div className="bg-background rounded-lg p-3 shadow-sm">
                            <p className="text-sm">{content || "Your SMS content will appear here"}</p>
                            <p className="text-xs text-right text-muted-foreground mt-1">Just now</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Campaign Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Audience</Label>
                  <Select value={audience} onValueChange={setAudience}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select audience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-clients">All Clients</SelectItem>
                      <SelectItem value="regular-clients">Regular Clients</SelectItem>
                      <SelectItem value="new-clients">New Clients</SelectItem>
                      <SelectItem value="inactive-clients">Inactive Clients</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex items-center mt-2">
                    <Users className="h-4 w-4 text-muted-foreground mr-2" />
                    <p className="text-sm text-muted-foreground">
                      {audience === "all-clients"
                        ? "245"
                        : audience === "regular-clients"
                          ? "120"
                          : audience === "new-clients"
                            ? "85"
                            : "40"}{" "}
                      recipients
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>When to send</Label>
                  <RadioGroup
                    defaultValue={sendOption}
                    onValueChange={(value) => setSendOption(value as "now" | "later" | "draft")}
                    className="space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="now" id="now" />
                      <Label htmlFor="now">Send immediately</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="later" id="later" />
                      <Label htmlFor="later">Schedule for later</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="draft" id="draft" />
                      <Label htmlFor="draft">Save as draft</Label>
                    </div>
                  </RadioGroup>
                </div>

                {sendOption === "later" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !scheduledDate && "text-muted-foreground",
                            )}
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            {scheduledDate ? format(scheduledDate, "PPP") : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <CalendarComponent
                            mode="single"
                            selected={scheduledDate}
                            onSelect={setScheduledDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label>Time</Label>
                      <Select value={scheduledTime} onValueChange={setScheduledTime}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select time">
                            <div className="flex items-center">
                              <Clock className="mr-2 h-4 w-4" />
                              {scheduledTime || "Select time"}
                            </div>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 24 }).map((_, hour) => (
                            <SelectItem key={hour} value={`${hour}:00`}>
                              {hour === 0
                                ? "12:00 AM"
                                : hour < 12
                                  ? `${hour}:00 AM`
                                  : hour === 12
                                    ? "12:00 PM"
                                    : `${hour - 12}:00 PM`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

