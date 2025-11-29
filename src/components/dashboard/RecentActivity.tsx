import { ShoppingCart, Wrench, Smartphone, Package, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const activities = [
  {
    type: "sale",
    icon: ShoppingCart,
    title: "New Sale",
    description: "iPhone 14 Case + Screen Protector",
    amount: "+Rs 2,500",
    time: "2 min ago",
    color: "text-success bg-success/10",
  },
  {
    type: "repair",
    icon: Wrench,
    title: "Repair Completed",
    description: "Samsung S22 Screen Replacement",
    amount: "+Rs 8,500",
    time: "15 min ago",
    color: "text-info bg-info/10",
  },
  {
    type: "phone",
    icon: Smartphone,
    title: "Used Phone Sold",
    description: "iPhone 12 Pro Max 256GB",
    amount: "+Rs 85,000",
    time: "1 hour ago",
    color: "text-accent bg-accent/10",
  },
  {
    type: "stock",
    icon: Package,
    title: "Stock Updated",
    description: "50x USB-C Cables added",
    amount: "-Rs 15,000",
    time: "2 hours ago",
    color: "text-primary bg-primary/10",
  },
];

export function RecentActivity() {
  return (
    <div className="bg-card rounded-xl p-5 shadow-card animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display font-semibold text-lg">Recent Activity</h3>
          <p className="text-sm text-muted-foreground">Latest transactions</p>
        </div>
        <Clock className="w-5 h-5 text-muted-foreground" />
      </div>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className={cn("p-2 rounded-lg", activity.color)}>
              <activity.icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm">{activity.title}</p>
              <p className="text-xs text-muted-foreground truncate">{activity.description}</p>
            </div>
            <div className="text-right">
              <p
                className={cn(
                  "font-semibold text-sm",
                  activity.amount.startsWith("+") ? "text-success" : "text-foreground"
                )}
              >
                {activity.amount}
              </p>
              <p className="text-xs text-muted-foreground">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
