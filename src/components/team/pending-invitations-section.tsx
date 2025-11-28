"use client";

import { Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/services/api-service";

interface InvitedUser {
  id: number;
  full_name: string;
  email: string;
  phone: string | null;
  is_email_verified: boolean;
}

interface Inviter {
  id: number;
  full_name: string;
  email: string;
  phone: string | null;
}

interface PendingInvitation {
  id: number;
  uuid: string;
  UserId: number;
  ServiceProviderId: number;
  role: "admin" | "staff";
  invitedBy: number | null;
  status: "pending";
  invitedAt: string | null;
  acceptedAt: string | null;
  createdAt: string;
  updatedAt: string;
  User: InvitedUser;
  Inviter: Inviter;
}

interface PendingInvitationsResponse {
  success: boolean;
  message: string;
  data: {
    invitations: PendingInvitation[];
  };
}

const roleBadgeColors = {
  admin: "bg-blue-100 text-blue-800",
  staff: "bg-gray-100 text-gray-800",
};

export function PendingInvitationsSection() {
  const queryClient = useQueryClient();

  // Fetch pending invitations
  const { data: invitationsData, isLoading } = useQuery({
    queryKey: ["pending-invitations"],
    queryFn: async () => {
      const response = await api.get<PendingInvitationsResponse>(
        "members/invitations/pending"
      );
      return response.data.invitations;
    },
    staleTime: 5 * 60 * 1000,
  });

  // Delete invitation mutation
  const deleteInvitationMutation = useMutation({
    mutationFn: async (invitationId: number) => {
      const response = await api.delete(`members/invitations/${invitationId}`);
      return (response as any).data;
    },
    onMutate: () => {
      toast.loading("Deleting invitation...", { id: "delete-invitation" });
    },
    onSuccess: (data: any) => {
      toast.success(data.message || "Invitation deleted successfully", {
        id: "delete-invitation",
      });
      queryClient.invalidateQueries({ queryKey: ["pending-invitations"] });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to delete invitation",
        { id: "delete-invitation" }
      );
    },
  });

  const handleDeleteInvitation = (invitationId: number) => {
    if (confirm("Are you sure you want to delete this invitation?")) {
      deleteInvitationMutation.mutate(invitationId);
    }
  };

  return (
    <Card className="border-0 shadow-card">
      <CardHeader>
        <CardTitle>
          Pending Invitations ({invitationsData?.length ?? 0})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
                <Skeleton className="h-9 w-20" />
              </div>
            ))}
          </div>
        ) : !invitationsData || invitationsData.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#6E6E73]">No pending invitations</p>
          </div>
        ) : (
          <div className="space-y-3">
            {invitationsData.map((invitation) => (
              <div
                key={invitation.id}
                className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-[#121212] truncate">
                      {invitation.User.full_name}
                    </h3>
                    <Badge className={roleBadgeColors[invitation.role]}>
                      {invitation.role}
                    </Badge>
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-800">
                      Pending
                    </Badge>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm text-[#6E6E73] mt-1">
                    <span className="truncate">{invitation.User.email}</span>
                    <span className="hidden sm:inline">•</span>
                    <span>
                      Invited{" "}
                      {invitation.invitedAt
                        ? new Date(invitation.invitedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "recently"}
                    </span>
                    {invitation.Inviter && (
                      <>
                        <span className="hidden sm:inline">•</span>
                        <span>by {invitation.Inviter.full_name}</span>
                      </>
                    )}
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteInvitation(invitation.id)}
                  disabled={deleteInvitationMutation.isPending}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
