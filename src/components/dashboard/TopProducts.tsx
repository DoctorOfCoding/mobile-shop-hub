import { Package, TrendingUp } from "lucide-react";

const topProducts = [
  { name: "iPhone 14 Pro Case", sales: 145, revenue: 21750, trend: 12 },
  { name: "Samsung S23 Screen Guard", sales: 128, revenue: 12800, trend: 8 },
  { name: "AirPods Pro", sales: 89, revenue: 44500, trend: 15 },
  { name: "USB-C Cable (2m)", sales: 234, revenue: 11700, trend: 5 },
  { name: "Power Bank 20000mAh", sales: 67, revenue: 16750, trend: -3 },
];

export function TopProducts() {
  return (
    <div className="bg-card rounded-xl p-5 shadow-card animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display font-semibold text-lg">Top Selling Products</h3>
          <p className="text-sm text-muted-foreground">Best performers this month</p>
        </div>
        <Package className="w-5 h-5 text-muted-foreground" />
      </div>
      <div className="space-y-3">
        {topProducts.map((product, index) => (
          <div
            key={product.name}
            className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full gradient-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                {index + 1}
              </span>
              <div>
                <p className="font-medium text-sm">{product.name}</p>
                <p className="text-xs text-muted-foreground">{product.sales} units sold</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-sm">Rs {product.revenue.toLocaleString()}</p>
              <div className="flex items-center gap-1 justify-end">
                <TrendingUp
                  className={`w-3 h-3 ${product.trend >= 0 ? "text-success" : "text-destructive"}`}
                />
                <span
                  className={`text-xs font-medium ${
                    product.trend >= 0 ? "text-success" : "text-destructive"
                  }`}
                >
                  {product.trend > 0 && "+"}
                  {product.trend}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
