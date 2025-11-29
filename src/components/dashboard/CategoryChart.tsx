import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const data = [
  { name: "Accessories", value: 45, color: "hsl(175, 84%, 32%)" },
  { name: "Used Phones", value: 30, color: "hsl(32, 95%, 55%)" },
  { name: "Repair Services", value: 25, color: "hsl(142, 76%, 36%)" },
];

export function CategoryChart() {
  return (
    <div className="bg-card rounded-xl p-5 shadow-card animate-fade-in">
      <div className="mb-4">
        <h3 className="font-display font-semibold text-lg">Sales by Category</h3>
        <p className="text-sm text-muted-foreground">Revenue distribution</p>
      </div>
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(0, 0%, 100%)",
                border: "1px solid hsl(214, 20%, 90%)",
                borderRadius: "8px",
              }}
              formatter={(value: number) => [`${value}%`, ""]}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => (
                <span className="text-sm text-foreground">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
