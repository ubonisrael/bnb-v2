"use client"

import { useState } from "react"
import { MessageList } from "@/components/messaging/message-list"
import { ConversationView } from "@/components/messaging/conversation-view"

export default function MessagesPage() {
  const [selectedConversationId, setSelectedConversationId] = useState<number | undefined>(undefined)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[#121212] text-3xl font-bold">Messages</h1>
        <p className="text-[#6E6E73]">Communicate with your clients and team members.</p>
      </div>

      <div className="h-[calc(100vh-220px)] overflow-hidden rounded-lg border bg-white shadow-card">
        <div className="grid h-full grid-cols-1 md:grid-cols-3">
          <div className="md:col-span-1">
            <MessageList
              onSelectConversation={setSelectedConversationId}
              selectedConversationId={selectedConversationId}
            />
          </div>
          <div className="hidden md:col-span-2 md:block">
            {selectedConversationId ? (
              <ConversationView conversationId={selectedConversationId} />
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-muted-foreground">Select a conversation to start messaging</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

