import { AlertTriangle, Package } from "lucide-react";
import { Button } from "@/components/ui/button";

const lowStockItems = [
  { name: "iPhone 15 Pro Case", current: 3, minimum: 10 },
  { name: "Samsung Charger 25W", current: 5, minimum: 15 },
  { name: "Lightning Cable 1m", current: 8, minimum: 20 },
  { name: "Screen Protector Universal", current: 12, minimum: 25 },
];

export function LowStockAlert() {
  return (
    <div className="bg-card rounded-xl p-5 shadow-card border-l-4 border-warning animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-lg bg-warning/10">
          <AlertTriangle className="w-5 h-5 text-warning" />
        </div>
        <div>
          <h3 className="font-display font-semibold text-lg">Low Stock Alert</h3>
          <p className="text-sm text-muted-foreground">{lowStockItems.length} items need restock</p>
        </div>
      </div>
      <div className="space-y-3">
        {lowStockItems.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
          >
            <div className="flex items-center gap-3">
              <Package className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="font-medium text-sm">{item.name}</p>
                <p className="text-xs text-muted-foreground">
                  Min stock: {item.minimum}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="px-2 py-1 rounded-full text-xs font-semibold bg-warning/10 text-warning">
                {item.current} left
              </span>
            </div>
          </div>
        ))}
      </div>
      <Button variant="outline" className="w-full mt-4">
        View All Low Stock Items
      </Button>
    </div>
  );
}
