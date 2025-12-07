import { ReactNode } from "react";
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
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { profile, role, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
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
                      <p className="text-sm font-medium">{profile?.full_name || profile?.username || 'User'}</p>
                      <div className="flex items-center gap-1 justify-end">
                        <Badge variant={isAdmin ? 'default' : 'secondary'} className="text-[10px] h-4">
                          {isAdmin ? 'Manager' : 'Employee'}
                        </Badge>
                      </div>
                    </div>
                    <div className="rounded-full bg-primary/10 p-2">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span>{profile?.full_name || profile?.username}</span>
                      <span className="text-xs font-normal text-muted-foreground">
                        {profile?.email}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
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
