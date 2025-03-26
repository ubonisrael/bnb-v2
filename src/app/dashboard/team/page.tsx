"use client"

import { useState } from "react"
import { Plus, Search, Filter, MoreHorizontal, Pencil, Trash2 } from "lucide-react"

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
import { TeamMemberDialog } from "@/components/team/team-member-dialog"

// Mock data for team members
const initialTeamMembers = [
  {
    id: 1,
    name: "Emma Johnson",
    role: "Hair Stylist",
    email: "emma@example.com",
    phone: "(555) 123-4567",
    bio: "Specializes in modern cuts and color techniques with over 8 years of experience.",
    services: ["Haircut", "Hair Coloring", "Styling"],
    avatar: "/placeholder.svg",
    isActive: true,
  },
  {
    id: 2,
    name: "Michael Smith",
    role: "Barber",
    email: "michael@example.com",
    phone: "(555) 234-5678",
    bio: "Expert in traditional barbering and modern men's styles with 5 years of experience.",
    services: ["Men's Haircut", "Beard Trim", "Hot Towel Shave"],
    avatar: "/placeholder.svg",
    isActive: true,
  },
  {
    id: 3,
    name: "Sophia Lee",
    role: "Nail Technician",
    email: "sophia@example.com",
    phone: "(555) 345-6789",
    bio: "Certified nail technician specializing in nail art and gel extensions.",
    services: ["Manicure", "Pedicure", "Gel Nails", "Nail Art"],
    avatar: "/placeholder.svg",
    isActive: true,
  },
  {
    id: 4,
    name: "David Wilson",
    role: "Massage Therapist",
    email: "david@example.com",
    phone: "(555) 456-7890",
    bio: "Licensed massage therapist with expertise in deep tissue and relaxation techniques.",
    services: ["Swedish Massage", "Deep Tissue Massage", "Hot Stone Massage"],
    avatar: "/placeholder.svg",
    isActive: false,
  },
]

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState(initialTeamMembers)
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentMember, setCurrentMember] = useState<any>(null)

  // Filter team members based on search query
  const filteredMembers = teamMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Handle adding a new team member
  const handleAddMember = (member: any) => {
    if (currentMember) {
      // Update existing member
      setTeamMembers(teamMembers.map((m) => (m.id === currentMember.id ? { ...member, id: currentMember.id } : m)))
    } else {
      // Add new member
      setTeamMembers([...teamMembers, { ...member, id: Date.now() }])
    }
    setIsDialogOpen(false)
    setCurrentMember(null)
  }

  // Handle editing a team member
  const handleEditMember = (member: any) => {
    setCurrentMember(member)
    setIsDialogOpen(true)
  }

  // Handle deleting a team member
  const handleDeleteMember = (id: number) => {
    setTeamMembers(teamMembers.filter((member) => member.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-[#121212] text-3xl font-bold">Team</h1>
          <p className="text-[#6E6E73]">Manage your team members and their services.</p>
        </div>
        <Button
          onClick={() => {
            setCurrentMember(null)
            setIsDialogOpen(true)
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Team Member
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search team members..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {filteredMembers.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <h3 className="text-lg font-medium">No team members found</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {searchQuery
              ? "No team members match your search criteria."
              : "Get started by adding your first team member."}
          </p>
          {searchQuery ? (
            <Button variant="outline" className="mt-4" onClick={() => setSearchQuery("")}>
              Clear Search
            </Button>
          ) : (
            <Button className="mt-4" onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Team Member
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredMembers.map((member) => (
            <Card key={member.id} className="border-0 shadow-card">
              <CardHeader className="relative flex flex-row items-start gap-4 space-y-0 pb-2">
                <Avatar className="h-16 w-16 border-2 border-white">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback className="text-lg">
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <CardTitle className="flex items-center gap-2">
                    {member.name}
                    {!member.isActive && (
                      <Badge variant="outline" className="ml-2 bg-[#6E6E73]/10 text-[#6E6E73]">
                        Inactive
                      </Badge>
                    )}
                  </CardTitle>
                  <div className="text-sm font-medium text-[#7B68EE]">{member.role}</div>
                  <div className="text-xs text-muted-foreground">{member.email}</div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="absolute right-6 top-6">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleEditMember(member)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => handleDeleteMember(member.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Bio</h4>
                    <p className="mt-1 text-sm">{member.bio}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Services</h4>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {member.services.map((service) => (
                        <Badge key={service} variant="outline" className="bg-[#F5F5F7]">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <TeamMemberDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        member={currentMember}
        onSave={handleAddMember}
      />
    </div>
  )
}

