import {
  DollarSign,
  TrendingUp,
  ShoppingBag,
  Wrench,
  Calendar,
  Filter,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { CategoryChart } from "@/components/dashboard/CategoryChart";
import { TopProducts } from "@/components/dashboard/TopProducts";
import { LowStockAlert } from "@/components/dashboard/LowStockAlert";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your shop overview.</p>
        </div>
        <div className="flex items-center gap-3">
          <Select defaultValue="today">
            <SelectTrigger className="w-[160px]">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Today's Sales"
          value="Rs 47,850"
          icon={<DollarSign className="w-5 h-5" />}
          trend={12}
          trendLabel="vs yesterday"
          variant="primary"
        />
        <StatCard
          title="Weekly Revenue"
          value="Rs 312,400"
          icon={<TrendingUp className="w-5 h-5" />}
          trend={8}
          trendLabel="vs last week"
        />
        <StatCard
          title="Monthly Sales"
          value="Rs 1,247,500"
          icon={<ShoppingBag className="w-5 h-5" />}
          trend={15}
          trendLabel="vs last month"
          variant="success"
        />
        <StatCard
          title="Pending Repairs"
          value="12"
          icon={<Wrench className="w-5 h-5" />}
          variant="accent"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesChart />
        </div>
        <CategoryChart />
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TopProducts />
        <LowStockAlert />
        <RecentActivity />
      </div>
    </div>
  );
}
