import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { LayoutDashboard, ShoppingCart, Package, Wrench, Smartphone, Users, FileText, Settings, LogOut, ChevronLeft, ChevronRight, Store } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
const menuItems = [{
  title: "Dashboard",
  url: "/",
  icon: LayoutDashboard
}, {
  title: "Point of Sale",
  url: "/pos",
  icon: ShoppingCart
}, {
  title: "Inventory",
  url: "/inventory",
  icon: Package
}, {
  title: "Repairs",
  url: "/repairs",
  icon: Wrench
}, {
  title: "Used Phones",
  url: "/used-phones",
  icon: Smartphone
}, {
  title: "Customers",
  url: "/customers",
  icon: Users
}, {
  title: "Reports",
  url: "/reports",
  icon: FileText
}, {
  title: "Settings",
  url: "/settings",
  icon: Settings
}];
export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const {
    signOut
  } = useAuth();
  const handleLogout = async () => {
    const {
      error
    } = await signOut();
    if (error) {
      toast.error("Failed to logout");
    } else {
      toast.success("Logged out successfully");
      navigate("/auth");
    }
  };
  return <aside className={cn("h-screen sticky top-0 flex flex-col transition-all duration-300 ease-in-out", "bg-sidebar text-sidebar-foreground", collapsed ? "w-[70px]" : "w-[260px]")} style={{
    background: "var(--gradient-sidebar)"
  }}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        <div className={cn("flex items-center gap-3", collapsed && "justify-center w-full")}>
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
            <Store className="w-5 h-5 text-primary-foreground" />
          </div>
          {!collapsed && <div className="animate-fade-in">
              <h1 className="font-display font-bold text-lg text-sidebar-foreground">Links Mobile</h1>
              <p className="text-xs text-sidebar-foreground/60">Shop Management</p>
            </div>}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {menuItems.map(item => {
        const isActive = location.pathname === item.url;
        return <NavLink key={item.title} to={item.url} className={cn("flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200", "hover:bg-sidebar-accent group", isActive && "bg-sidebar-primary text-sidebar-primary-foreground shadow-md", !isActive && "text-sidebar-foreground/70 hover:text-sidebar-foreground", collapsed && "justify-center px-2")}>
              <item.icon className={cn("w-5 h-5 transition-transform duration-200", "group-hover:scale-110", isActive && "text-sidebar-primary-foreground")} />
              {!collapsed && <span className="font-medium text-sm animate-fade-in">{item.title}</span>}
            </NavLink>;
      })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-sidebar-border space-y-2">
        <button onClick={() => setCollapsed(!collapsed)} className={cn("flex items-center gap-3 px-3 py-2.5 rounded-lg w-full transition-all duration-200", "hover:bg-sidebar-accent text-sidebar-foreground/70 hover:text-sidebar-foreground", collapsed && "justify-center px-2")}>
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <>
              <ChevronLeft className="w-5 h-5" />
              <span className="font-medium text-sm">Collapse</span>
            </>}
        </button>
        <button onClick={handleLogout} className={cn("flex items-center gap-3 px-3 py-2.5 rounded-lg w-full transition-all duration-200", "hover:bg-destructive/20 text-sidebar-foreground/70 hover:text-destructive", collapsed && "justify-center px-2")}>
          <LogOut className="w-5 h-5" />
          {!collapsed && <span className="font-medium text-sm">Logout</span>}
        </button>
      </div>
    </aside>;
}