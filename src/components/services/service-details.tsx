import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "../ui/skeleton";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { getDurationLabel, getInitials } from "@/lib/helpers";
import { Separator } from "../ui/separator";
import {
  Calendar,
  Clock,
  PoundSterling,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface ServiceDetailsProps {
  service: ServiceWithStaffAndCategory | null;
  isLoadingDetails: boolean;
  availableDays: string[];
  analyticsPeriod: ServiceAnalyticsPeriod;
  setAnalyticsPeriod: React.Dispatch<React.SetStateAction<ServiceAnalyticsPeriod>>;
  analytics: ServiceDetailsAnalytics | null;
  selectedPeriodData?: { count: number; percentageChange: number };
}

export default function ServiceDetails({
  service,
  isLoadingDetails,
  availableDays,
  analyticsPeriod,
  setAnalyticsPeriod,
  analytics,
  selectedPeriodData,
}: ServiceDetailsProps) {
  return (
    <TabsContent value="details" className="space-y-4 mt-4">
      {isLoadingDetails ? (
        <div className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : service ? (
        <>
          {/* Basic Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {service.category?.name || "No Category"}
              </Badge>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-2">Description</h4>
              <p className="text-sm text-muted-foreground">
                {service.description}
              </p>
            </div>

            <Separator />

            {/* Price and Duration */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <PoundSterling className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Price</p>
                  <p className="text-lg font-semibold">
                    £{service.fullPrice.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Duration</p>
                  <p className="text-lg font-semibold">
                    {getDurationLabel(service.duration)}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Available Days */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <h4 className="text-sm font-semibold">Available Days</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {availableDays.map((day) => (
                  <Badge key={day} variant="outline" className="text-xs">
                    {day}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            {/* Analytics */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-semibold">Analytics</h4>
                <Select
                  value={analyticsPeriod}
                  onValueChange={(value: any) => setAnalyticsPeriod(value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="last7Days">Last 7 Days</SelectItem>
                    <SelectItem value="last2Weeks">Last 2 Weeks</SelectItem>
                    <SelectItem value="lastMonth">Last Month</SelectItem>
                    <SelectItem value="lastQuarter">Last Quarter</SelectItem>
                    <SelectItem value="lastYear">Last Year</SelectItem>
                    <SelectItem value="allTime">All Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Bookings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {selectedPeriodData?.count || 0}
                    </div>
                    {analyticsPeriod !== "allTime" &&
                      selectedPeriodData &&
                      "percentageChange" in selectedPeriodData && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          {selectedPeriodData.percentageChange >= 0 ? (
                            <>
                              <TrendingUp className="h-3 w-3 text-green-500" />
                              <span className="text-green-500">
                                +
                                {selectedPeriodData.percentageChange.toFixed(1)}
                                %
                              </span>
                            </>
                          ) : (
                            <>
                              <TrendingDown className="h-3 w-3 text-red-500" />
                              <span className="text-red-500">
                                {selectedPeriodData.percentageChange.toFixed(1)}
                                %
                              </span>
                            </>
                          )}
                        </p>
                      )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Revenue
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      £{analytics?.totalRevenue.toFixed(2) || 0}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Total earned
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Clients
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {analytics?.uniqueClients || 0}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Unique customers
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Separator />

            {/* Assigned Staff */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Users className="h-4 w-4 text-muted-foreground" />
                <h4 className="text-sm font-semibold">Assigned Staff</h4>
                <Badge variant="secondary" className="text-xs">
                  {service.staff?.length || 0}
                </Badge>
              </div>
              {service.staff && service.staff.length > 0 ? (
                <div className="space-y-2">
                  {service.staff.map((staffMember) => (
                    <div
                      key={staffMember.id}
                      className="flex items-center gap-3 p-2 rounded-lg bg-muted/50"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {staffMember.user
                            ? getInitials(staffMember.user.full_name)
                            : "??"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {staffMember.user?.full_name || "Unknown"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {staffMember.user?.email || "No email"}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs capitalize">
                        {staffMember.role}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No staff assigned
                </p>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            Failed to load service details
          </p>
        </div>
      )}
    </TabsContent>
  );
}
