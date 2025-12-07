import { ReactNode, useEffect, useState } from "react";
import { AppSidebar } from "./AppSidebar";
import { Bell, Search, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userName, setUserName] = useState<string>("");
  const [userRole, setUserRole] = useState<string>("");

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!user?.id) return;

      // Fetch profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, username")
        .eq("id", user.id)
        .single();

      if (profile) {
        setUserName(profile.full_name || profile.username || user.email?.split("@")[0] || "User");
      }

      // Fetch role
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .single();

      if (roleData) {
        setUserRole(roleData.role === "admin" ? "Admin" : "User");
      } else {
        setUserRole("Role not assigned");
      }
    };

    fetchUserDetails();
  }, [user?.id, user?.email]);

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Sign Out Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      navigate("/auth", { replace: true });
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="sticky top-0 z-40 h-16 border-b border-border bg-card/80 backdrop-blur-md">
          <div className="flex items-center justify-between h-full px-6">
            {/* Search */}
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search products, customers, repairs..."
                className="pl-10 bg-secondary/50 border-0 focus-visible:ring-primary/30"
              />
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full gradient-accent text-[10px] font-bold flex items-center justify-center text-accent-foreground">
                  3
                </span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-3 pl-3 border-l border-border cursor-pointer hover:bg-accent/10 rounded-lg px-3 py-2 transition-colors">
                    <div className="text-right">
                      <p className="text-sm font-medium">{userName || "User"}</p>
                      <p className="text-xs text-muted-foreground">{userRole || "Loading..."}</p>
                    </div>
                    <div className="rounded-full bg-primary/10 p-2">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuLabel>Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="cursor-pointer text-destructive focus:text-destructive"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
