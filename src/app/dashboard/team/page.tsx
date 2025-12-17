"use client";

import { useState } from "react";
import { Plus, Search, UserX, Trash2, X } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import api from "@/services/api-service";
import { getInitials } from "@/lib/helpers";
import { PendingInvitationsSection } from "@/components/team/pending-invitations-section";
import { InviteStaffDialog } from "@/components/team/invite-staff-dialog";
import { StaffDetailsSheet } from "@/components/team/staff-details-sheet";

interface MemberUser {
  id: number;
  full_name: string;
  email: string;
  phone: string | null;
  is_email_verified: boolean;
  avatar: string | null;
}

interface Member {
  id: number;
  UserId: number;
  ServiceProviderId: number;
  role: "owner" | "admin" | "staff";
  status: string;
  invitedBy: number | null;
  invitedAt: string;
  acceptedAt: string | null;
  createdAt: string;
  updatedAt: string;
  User: MemberUser;
}

interface MembersResponse {
  success: boolean;
  message: string;
  data: {
    members: Member[];
  };
}

const roleOrder = { owner: 0, admin: 1, staff: 2 };
const roleBadgeColors = {
  owner: "bg-purple-100 text-purple-800",
  admin: "bg-blue-100 text-blue-800",
  staff: "bg-gray-100 text-gray-800",
};

export default function TeamPage() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState<number | null>(null);

  // Fetch members
  const { data: membersData, isLoading: isLoadingMembers } = useQuery({
    queryKey: ["members"],
    queryFn: async () => {
      const response = await api.get<MembersResponse>("members");
      return response.data.members;
    },
    staleTime: 5 * 60 * 1000,
  });

  console.log("Members Data:", membersData);

  // Sort members by role and filter by search
  const sortedMembers = (Array.isArray(membersData) ? membersData : [])
    .sort((a, b) => roleOrder[a.role] - roleOrder[b.role])
    .filter((member) => {
      if (!searchQuery) return true;
      const searchLower = searchQuery.toLowerCase();
      return (
        member.User.full_name.toLowerCase().includes(searchLower) ||
        member.User.email.toLowerCase().includes(searchLower) ||
        member.role.toLowerCase().includes(searchLower)
      );
    });

  // Bulk suspend mutation
  const bulkSuspendMutation = useMutation({
    mutationFn: async (memberIds: number[]) => {
      const response = await api.post("members/bulk-suspend", { memberIds });
      return (response as any).data;
    },
    onMutate: () => {
      toast.loading("Suspending members...", { id: "bulk-suspend" });
    },
    onSuccess: (data: any) => {
      toast.success(data.message, { id: "bulk-suspend" });
      queryClient.invalidateQueries({ queryKey: ["members"] });
      setSelectedMembers([]);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to suspend members", {
        id: "bulk-suspend",
      });
    },
  });

  // Bulk delete mutation
  const bulkDeleteMutation = useMutation({
    mutationFn: async (memberIds: number[]) => {
      const response = await api.post("members/bulk-delete", { memberIds });
      return (response as any).data;
    },
    onMutate: () => {
      toast.loading("Deleting members...", { id: "bulk-delete" });
    },
    onSuccess: (data: any) => {
      toast.success(data.message, { id: "bulk-delete" });
      queryClient.invalidateQueries({ queryKey: ["members"] });
      setSelectedMembers([]);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete members", {
        id: "bulk-delete",
      });
    },
  });

  const handleSelectAll = () => {
    if (selectedMembers.length === sortedMembers.length) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(sortedMembers.map((m) => m.id));
    }
  };

  const handleSelectMember = (memberId: number) => {
    setSelectedMembers((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleBulkSuspend = () => {
    if (selectedMembers.length === 0) {
      toast.error("Please select at least one member");
      return;
    }
    if (confirm(`Are you sure you want to suspend ${selectedMembers.length} member(s)?`)) {
      bulkSuspendMutation.mutate(selectedMembers);
    }
  };

  const handleBulkDelete = () => {
    if (selectedMembers.length === 0) {
      toast.error("Please select at least one member");
      return;
    }
    if (
      confirm(
        `Are you sure you want to delete ${selectedMembers.length} member(s)? This action cannot be undone.`
      )
    ) {
      bulkDeleteMutation.mutate(selectedMembers);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#121212]">Team Management</h1>
          <p className="text-[#6E6E73]">Manage your team members and invitations</p>
        </div>
        <Button onClick={() => setIsInviteDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Invite Staff
        </Button>
      </div>

      <Tabs defaultValue="members" className="space-y-6">
        <TabsList>
          <TabsTrigger value="members">Team Members</TabsTrigger>
          <TabsTrigger value="invitations">Pending Invitations</TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="space-y-4">
          {/* Search and Actions */}
          <Card className="border-0 shadow-card">
            <CardContent className="pt-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6E6E73]" />
                  <Input
                    placeholder="Search by name, email, or role..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {selectedMembers.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-[#6E6E73]">
                      {selectedMembers.length} selected
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleBulkSuspend}
                      disabled={bulkSuspendMutation.isPending}
                      className="gap-2"
                    >
                      <UserX className="h-4 w-4" />
                      Suspend
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleBulkDelete}
                      disabled={bulkDeleteMutation.isPending}
                      className="gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedMembers([])}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Team Members List */}
          <Card className="border-0 shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Team Members ({sortedMembers.length})</CardTitle>
                {sortedMembers.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSelectAll}
                    className="text-sm"
                  >
                    {selectedMembers.length === sortedMembers.length
                      ? "Deselect All"
                      : "Select All"}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingMembers ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-48" />
                      </div>
                      <Skeleton className="h-6 w-16" />
                    </div>
                  ))}
                </div>
              ) : sortedMembers.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-[#6E6E73]">No team members found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {sortedMembers.map((member) => (
                    <div
                      key={member.id}
                      className={`flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer ${
                        selectedMembers.includes(member.id) ? "bg-blue-50 border-blue-200" : ""
                      }`}
                      onClick={(e) => {
                        if ((e.target as HTMLElement).closest('input[type="checkbox"]')) {
                          return;
                        }
                        setSelectedStaffId(member.id);
                      }}
                    >
                      <Checkbox
                        checked={selectedMembers.includes(member.id)}
                        onCheckedChange={() => handleSelectMember(member.id)}
                        onClick={(e) => e.stopPropagation()}
                      />

                      <Avatar className="h-12 w-12">
                        <AvatarImage src={member.User.avatar || undefined} />
                        <AvatarFallback className="bg-[#7B68EE] text-white">
                          {getInitials(member.User.full_name)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-[#121212] truncate">
                            {member.User.full_name}
                          </h3>
                          <Badge className={roleBadgeColors[member.role]}>
                            {member.role}
                          </Badge>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm text-[#6E6E73]">
                          <span className="truncate">{member.User.email}</span>
                          {member.User.phone && (
                            <>
                              <span className="hidden sm:inline">•</span>
                              <span>{member.User.phone}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="text-right text-sm text-[#6E6E73]">
                        <div>Joined</div>
                        <div>
                          {new Date(member.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invitations">
          <PendingInvitationsSection />
        </TabsContent>
      </Tabs>

      {/* Invite Staff Dialog */}
      <InviteStaffDialog
        open={isInviteDialogOpen}
        onOpenChange={setIsInviteDialogOpen}
      />

      {/* Staff Details Sheet */}
      {selectedStaffId && (
        <StaffDetailsSheet
          memberId={selectedStaffId}
          open={!!selectedStaffId}
          onOpenChange={(open: boolean) => !open && setSelectedStaffId(null)}
        />
      )}
    </div>
  );
}

