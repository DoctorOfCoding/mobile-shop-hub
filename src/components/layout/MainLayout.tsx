import { ReactNode, useState } from "react";
import { AppSidebar } from "./AppSidebar";
import { Bell, Search, User, ChevronDown, Check } from "lucide-react";
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

// Mock users data - replace with actual data from backend
const mockUsers = [
  { id: "1", name: "Admin User", role: "Administrator", email: "admin@mobileshop.com" },
  { id: "2", name: "John Smith", role: "Cashier", email: "john@mobileshop.com" },
  { id: "3", name: "Sarah Wilson", role: "Cashier", email: "sarah@mobileshop.com" },
  { id: "4", name: "Mike Johnson", role: "Technician", email: "mike@mobileshop.com" },
];

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [selectedUser, setSelectedUser] = useState(mockUsers[0]);

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
                      <p className="text-sm font-medium">{selectedUser.name}</p>
                      <p className="text-xs text-muted-foreground">{selectedUser.role}</p>
                    </div>
                    <div className="rounded-full bg-primary/10 p-2">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuLabel>Switch User</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {mockUsers.map((user) => (
                    <DropdownMenuItem
                      key={user.id}
                      onClick={() => setSelectedUser(user)}
                      className="flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-primary/10 p-2">
                          <User className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.role}</p>
                        </div>
                      </div>
                      {selectedUser.id === user.id && (
                        <Check className="w-4 h-4 text-primary" />
                      )}
                    </DropdownMenuItem>
                  ))}
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
