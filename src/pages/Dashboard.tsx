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
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardStats } from "@/hooks/useDashboardStats";

export default function Dashboard() {
  const { stats, loading } = useDashboardStats();

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-32" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="lg:col-span-2 h-80" />
          <Skeleton className="h-80" />
        </div>
      </div>
    );
  }

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
          value={`Rs ${stats.todaySales.toLocaleString()}`}
          icon={<DollarSign className="w-5 h-5" />}
          variant="primary"
        />
        <StatCard
          title="Weekly Revenue"
          value={`Rs ${stats.weeklyRevenue.toLocaleString()}`}
          icon={<TrendingUp className="w-5 h-5" />}
        />
        <StatCard
          title="Monthly Sales"
          value={`Rs ${stats.monthlySales.toLocaleString()}`}
          icon={<ShoppingBag className="w-5 h-5" />}
          variant="success"
        />
        <StatCard
          title="Pending Repairs"
          value={stats.pendingRepairs.toString()}
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
