"use client"

import { useState } from "react"
import { CampaignList } from "@/components/marketing/campaign-list"
import { CampaignDetail } from "@/components/marketing/campaign-detail"
import { CampaignCreator } from "@/components/marketing/campaign-creator"

export default function MarketingPage() {
  const [view, setView] = useState<"list" | "detail" | "create">("list")
  const [selectedCampaignId, setSelectedCampaignId] = useState<number | undefined>(undefined)

  const handleSelectCampaign = (campaignId: number) => {
    setSelectedCampaignId(campaignId)
    setView("detail")
  }

  const handleCreateCampaign = () => {
    setView("create")
  }

  const handleSaveCampaign = (campaign: any) => {
    // In a real app, this would save the campaign to the database
    console.log("Saving campaign:", campaign)
    setView("list")
  }

  const handleBackToList = () => {
    setView("list")
    setSelectedCampaignId(undefined)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[#121212] text-3xl font-bold">Marketing</h1>
        <p className="text-[#6E6E73]">Create and manage marketing campaigns for your business.</p>
      </div>

      {view === "list" && (
        <CampaignList onSelectCampaign={handleSelectCampaign} onCreateCampaign={handleCreateCampaign} />
      )}

      {view === "detail" && selectedCampaignId && (
        <CampaignDetail campaignId={selectedCampaignId} onBack={handleBackToList} />
      )}

      {view === "create" && <CampaignCreator onBack={handleBackToList} onSave={handleSaveCampaign} />}
    </div>
  )
}

