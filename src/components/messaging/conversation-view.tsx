"use client"

import { useState, useRef, useEffect } from "react"
import { formatDistanceToNow } from "date-fns"
import { Send, Paperclip, MoreHorizontal, Phone, Video } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

// Mock data for messages
const mockConversations = {
  1: {
    id: 1,
    recipient: {
      id: 101,
      name: "Jane Doe",
      avatar: "/placeholder.svg",
      businessName: "Elegant Hair Salon",
      status: "online",
    },
    messages: [
      {
        id: 1,
        content: "Hello! I'd like to book an appointment for a haircut.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        senderId: 101,
      },
      {
        id: 2,
        content: "Hi Jane! We'd be happy to help you with that. When would you like to come in?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23), // 23 hours ago
        senderId: 0, // Current user
      },
      {
        id: 3,
        content: "I was thinking this Friday afternoon, around 3 PM if possible.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 22), // 22 hours ago
        senderId: 101,
      },
      {
        id: 4,
        content: "Let me check our availability... Yes, we have a slot at 3:15 PM on Friday. Would that work for you?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 21), // 21 hours ago
        senderId: 0,
      },
      {
        id: 5,
        content: "That's perfect! I'll take that slot.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 20), // 20 hours ago
        senderId: 101,
      },
      {
        id: 6,
        content:
          "Great! I've booked you in for a haircut at 3:15 PM this Friday. Is there anything specific you're looking for with your haircut?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 19), // 19 hours ago
        senderId: 0,
      },
      {
        id: 7,
        content: "I'm thinking of trying a bob cut, maybe with some layers. Do you think that would suit me?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 18), // 18 hours ago
        senderId: 101,
      },
      {
        id: 8,
        content:
          "A bob with layers would look great on you! Our stylist Emma specializes in that style and will be able to advise on the best length and layers for your face shape.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 17), // 17 hours ago
        senderId: 0,
      },
      {
        id: 9,
        content: "That sounds wonderful! I'm looking forward to it.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 16), // 16 hours ago
        senderId: 101,
      },
      {
        id: 10,
        content: "Hi, I'd like to reschedule my appointment for tomorrow if possible.",
        timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
        senderId: 101,
      },
    ],
  },
  2: {
    id: 2,
    recipient: {
      id: 102,
      name: "John Smith",
      avatar: "/placeholder.svg",
      businessName: "Modern Cuts",
      status: "offline",
    },
    messages: [
      {
        id: 1,
        content: "Hi, do you have any availability for a beard trim this week?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
        senderId: 102,
      },
      {
        id: 2,
        content: "Hello John! Yes, we have several openings. How about Wednesday at 2 PM?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 47), // 47 hours ago
        senderId: 0,
      },
      {
        id: 3,
        content: "Wednesday at 2 PM works perfectly for me. I'll see you then!",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 46), // 46 hours ago
        senderId: 102,
      },
      {
        id: 4,
        content: "Great! We've got you booked in. See you on Wednesday!",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 45), // 45 hours ago
        senderId: 0,
      },
      {
        id: 5,
        content: "Thanks for confirming my appointment!",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        senderId: 102,
      },
    ],
  },
}

interface ConversationViewProps {
  conversationId: number
}

export function ConversationView({ conversationId }: ConversationViewProps) {
  const [newMessage, setNewMessage] = useState("")
  const [conversation, setConversation] = useState(mockConversations[conversationId as keyof typeof mockConversations])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom of messages when conversation changes or new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [conversation])

  // Update conversation when conversationId changes
  useEffect(() => {
    if (mockConversations[conversationId as keyof typeof mockConversations]) {
      setConversation(mockConversations[conversationId as keyof typeof mockConversations])
    }
  }, [conversationId])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const newMessageObj = {
      id: conversation.messages.length + 1,
      content: newMessage,
      timestamp: new Date(),
      senderId: 0, // Current user
    }

    setConversation({
      ...conversation,
      messages: [...conversation.messages, newMessageObj],
    })
    setNewMessage("")
  }

  if (!conversation) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Select a conversation to start messaging</p>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      {/* Conversation header */}
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={conversation.recipient.avatar} alt={conversation.recipient.name} />
            <AvatarFallback>
              {conversation.recipient.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium">{conversation.recipient.name}</h3>
              <div
                className={cn(
                  "h-2 w-2 rounded-full",
                  conversation.recipient.status === "online" ? "bg-[#4CD964]" : "bg-muted",
                )}
              />
            </div>
            {conversation.recipient.businessName && (
              <p className="text-xs text-muted-foreground">{conversation.recipient.businessName}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Phone className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Call</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Video className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Video Call</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View profile</DropdownMenuItem>
              <DropdownMenuItem>Block user</DropdownMenuItem>
              <DropdownMenuItem>Clear conversation</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">Delete conversation</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {conversation.messages.map((message) => (
          <div key={message.id} className={cn("flex", message.senderId === 0 ? "justify-end" : "justify-start")}>
            <div
              className={cn(
                "max-w-[70%] rounded-lg px-4 py-2",
                message.senderId === 0 ? "bg-[#7B68EE] text-white" : "bg-muted",
              )}
            >
              <p className="text-sm">{message.content}</p>
              <p className="mt-1 text-right text-xs opacity-70">
                {formatDistanceToNow(message.timestamp, { addSuffix: true })}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <div className="border-t p-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Paperclip className="h-4 w-4" />
          </Button>
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
            className="flex-1"
          />
          <Button size="icon" onClick={handleSendMessage} disabled={!newMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

