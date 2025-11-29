import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Mon", sales: 4200, profit: 1200 },
  { name: "Tue", sales: 3800, profit: 980 },
  { name: "Wed", sales: 5100, profit: 1450 },
  { name: "Thu", sales: 4600, profit: 1100 },
  { name: "Fri", sales: 6200, profit: 1800 },
  { name: "Sat", sales: 7500, profit: 2200 },
  { name: "Sun", sales: 5800, profit: 1600 },
];

export function SalesChart() {
  return (
    <div className="bg-card rounded-xl p-5 shadow-card animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-display font-semibold text-lg">Sales Overview</h3>
          <p className="text-sm text-muted-foreground">Weekly sales and profit trends</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-sm text-muted-foreground">Sales</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-success" />
            <span className="text-sm text-muted-foreground">Profit</span>
          </div>
        </div>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(175, 84%, 32%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(175, 84%, 32%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 90%)" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(220, 10%, 45%)", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(220, 10%, 45%)", fontSize: 12 }}
              tickFormatter={(value) => `Rs${value / 1000}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(0, 0%, 100%)",
                border: "1px solid hsl(214, 20%, 90%)",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
              formatter={(value: number) => [`Rs ${value.toLocaleString()}`, ""]}
            />
            <Area
              type="monotone"
              dataKey="sales"
              stroke="hsl(175, 84%, 32%)"
              strokeWidth={2}
              fill="url(#salesGradient)"
            />
            <Area
              type="monotone"
              dataKey="profit"
              stroke="hsl(142, 76%, 36%)"
              strokeWidth={2}
              fill="url(#profitGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
