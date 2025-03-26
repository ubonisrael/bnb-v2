"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { Search, Plus } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// Mock data for conversations
const mockConversations = [
  {
    id: 1,
    recipient: {
      id: 101,
      name: "Jane Doe",
      avatar: "/placeholder.svg",
      businessName: "Elegant Hair Salon",
    },
    lastMessage: {
      id: 1001,
      content: "Hi, I'd like to reschedule my appointment for tomorrow if possible.",
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      isRead: false,
      senderId: 101,
    },
    unreadCount: 1,
  },
  {
    id: 2,
    recipient: {
      id: 102,
      name: "John Smith",
      avatar: "/placeholder.svg",
      businessName: "Modern Cuts",
    },
    lastMessage: {
      id: 1002,
      content: "Thanks for confirming my appointment!",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      isRead: true,
      senderId: 102,
    },
    unreadCount: 0,
  },
  {
    id: 3,
    recipient: {
      id: 103,
      name: "Emily Johnson",
      avatar: "/placeholder.svg",
      businessName: "",
    },
    lastMessage: {
      id: 1003,
      content: "Do you have any availability this weekend for a manicure?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      isRead: true,
      senderId: 103,
    },
    unreadCount: 0,
  },
  {
    id: 4,
    recipient: {
      id: 104,
      name: "Michael Brown",
      avatar: "/placeholder.svg",
      businessName: "Relaxation Spa",
    },
    lastMessage: {
      id: 1004,
      content: "I've sent you the details about our new service packages.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      isRead: true,
      senderId: 0, // Current user
    },
    unreadCount: 0,
  },
  {
    id: 5,
    recipient: {
      id: 105,
      name: "Sarah Wilson",
      avatar: "/placeholder.svg",
      businessName: "",
    },
    lastMessage: {
      id: 1005,
      content: "Looking forward to my appointment next week!",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
      isRead: true,
      senderId: 105,
    },
    unreadCount: 0,
  },
]

interface MessageListProps {
  onSelectConversation: (conversationId: number) => void
  selectedConversationId?: number
}

export function MessageList({ onSelectConversation, selectedConversationId }: MessageListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [conversations, setConversations] = useState(mockConversations)

  // Filter conversations based on search query
  const filteredConversations = conversations.filter(
    (conversation) =>
      conversation.recipient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversation.recipient.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversation.lastMessage.content.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="flex h-full flex-col border-r">
      <div className="p-4 border-b">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search messages..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button size="icon" variant="outline">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        {filteredConversations.length === 0 ? (
          <div className="flex h-full items-center justify-center p-4">
            <p className="text-center text-sm text-muted-foreground">No conversations found</p>
          </div>
        ) : (
          <ul className="divide-y">
            {filteredConversations.map((conversation) => (
              <li
                key={conversation.id}
                className={cn(
                  "cursor-pointer p-4 transition-colors hover:bg-muted/50",
                  selectedConversationId === conversation.id && "bg-muted",
                )}
                onClick={() => onSelectConversation(conversation.id)}
              >
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10 flex-shrink-0">
                    <AvatarImage src={conversation.recipient.avatar} alt={conversation.recipient.name} />
                    <AvatarFallback>
                      {conversation.recipient.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium truncate">{conversation.recipient.name}</h4>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(conversation.lastMessage.timestamp, { addSuffix: true })}
                      </span>
                    </div>
                    {conversation.recipient.businessName && (
                      <p className="text-xs text-muted-foreground truncate">{conversation.recipient.businessName}</p>
                    )}
                    <div className="mt-1 flex items-center justify-between">
                      <p
                        className={cn(
                          "text-sm truncate",
                          conversation.lastMessage.senderId === 0 && "text-muted-foreground",
                          !conversation.lastMessage.isRead && conversation.lastMessage.senderId !== 0 && "font-medium",
                        )}
                      >
                        {conversation.lastMessage.senderId === 0 ? "You: " : ""}
                        {conversation.lastMessage.content}
                      </p>
                      {conversation.unreadCount > 0 && (
                        <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                          {conversation.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

