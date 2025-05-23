import {
  Calendar,
  LogOut,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogoutMutation } from "@/hooks/use-logout-mutation";
import { useUserSettings } from "@/contexts/user-settings-context";

export function Header() {
  const { settings } = useUserSettings();
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const logoutMutation = useLogoutMutation();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <div className="hidden items-center gap-2 md:flex">
        <Calendar className="h-5 w-5 text-primary" />
        <span className="font-medium">{formattedDate}</span>
      </div>
      <div className="flex-1 md:flex-none md:w-1/3">
        {/* <form>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full rounded-full border-none bg-secondary pl-10 pr-4 shadow-none focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>
        </form> */}
      </div>
      <div className="ml-auto flex items-center gap-4">
        {/* <Button variant="outline" className="hidden gap-2 rounded-full border-none bg-secondary md:flex">
          <span>Day View</span>
          <ChevronDown className="h-4 w-4" />
        </Button> */}
        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="relative rounded-full border-none bg-secondary"
            >
              <Bell className="h-4 w-4" />
              <Badge className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary p-0 text-[10px]">
                3
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-[300px] overflow-auto">
              <DropdownMenuItem className="flex flex-col items-start p-3">
                <div className="flex w-full items-start gap-2">
                  <div className="mt-0.5 h-2 w-2 rounded-full bg-primary"></div>
                  <div className="grid flex-1 gap-1">
                    <p className="font-medium">New booking</p>
                    <p className="text-xs text-muted-foreground">
                      Sarah booked a haircut at 2:00 PM
                    </p>
                    <p className="text-xs text-muted-foreground">
                      10 minutes ago
                    </p>
                  </div>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start p-3">
                <div className="flex w-full items-start gap-2">
                  <div className="mt-0.5 h-2 w-2 rounded-full bg-primary"></div>
                  <div className="grid flex-1 gap-1">
                    <p className="font-medium">Appointment reminder</p>
                    <p className="text-xs text-muted-foreground">
                      You have 5 appointments tomorrow
                    </p>
                    <p className="text-xs text-muted-foreground">1 hour ago</p>
                  </div>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start p-3">
                <div className="flex w-full items-start gap-2">
                  <div className="mt-0.5 h-2 w-2 rounded-full bg-primary"></div>
                  <div className="grid flex-1 gap-1">
                    <p className="font-medium">Review received</p>
                    <p className="text-xs text-muted-foreground">
                      John left a 5-star review
                    </p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
              </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center text-center font-medium text-primary">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu> */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full bg-black text-white">
              {/* <Avatar className="h-8 w-8 border-2 border-white"> */}
                {/* <AvatarImage src={user?.profilePicture || "/placeholder.svg"} alt="User" /> */}
                {/* <AvatarFallback>{user?.data.name.charAt(0)}</AvatarFallback> */}
              {/* </Avatar> */}
              { settings ? (`${settings?.profile.name[0]}${settings?.profile.name[1]}`) : "BS" }
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {/* <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator /> */}
            <DropdownMenuItem
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
            >
              {logoutMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging out...
                </>
              ) : (
                <>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
