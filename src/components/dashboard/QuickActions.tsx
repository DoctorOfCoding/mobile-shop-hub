import { useNavigate } from "react-router-dom";
import { ShoppingCart, Package, Wrench, Smartphone, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const actions = [
  {
    title: "New Sale",
    description: "Create a new sale transaction",
    icon: ShoppingCart,
    url: "/pos",
    variant: "primary" as const,
  },
  {
    title: "Add Stock",
    description: "Add new inventory items",
    icon: Package,
    url: "/inventory",
    variant: "default" as const,
  },
  {
    title: "New Repair",
    description: "Register a repair job",
    icon: Wrench,
    url: "/repairs",
    variant: "default" as const,
  },
  {
    title: "Buy Phone",
    description: "Purchase used phone",
    icon: Smartphone,
    url: "/used-phones",
    variant: "default" as const,
  },
];

export function QuickActions() {
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in">
      <h3 className="font-display font-semibold text-lg mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <button
            key={action.title}
            onClick={() => navigate(action.url)}
            className={cn(
              "group relative p-4 rounded-xl border transition-all duration-300",
              "hover:shadow-card-hover hover:-translate-y-1",
              action.variant === "primary"
                ? "gradient-primary text-primary-foreground border-transparent shadow-glow"
                : "bg-card border-border hover:border-primary/30"
            )}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div
              className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center mb-3",
                action.variant === "primary"
                  ? "bg-primary-foreground/20"
                  : "bg-primary/10 group-hover:bg-primary/20"
              )}
            >
              <action.icon
                className={cn(
                  "w-5 h-5",
                  action.variant === "primary" ? "text-primary-foreground" : "text-primary"
                )}
              />
            </div>
            <p className="font-semibold text-sm">{action.title}</p>
            <p
              className={cn(
                "text-xs mt-1",
                action.variant === "primary" ? "text-primary-foreground/70" : "text-muted-foreground"
              )}
            >
              {action.description}
            </p>
            <Plus
              className={cn(
                "absolute top-3 right-3 w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity",
                action.variant === "primary" ? "text-primary-foreground/70" : "text-primary"
              )}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
