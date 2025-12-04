import { useState } from "react";
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  DollarSign,
  Package,
  Wrench,
  Users,
  Smartphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { useSales } from "@/hooks/useSales";
import { useRepairs } from "@/hooks/useRepairs";

const reports = [
  { title: "Daily Sales Report", description: "Detailed breakdown of today's sales transactions", icon: DollarSign, color: "text-success bg-success/10", type: "sales" },
  { title: "Weekly Revenue Report", description: "Week-over-week revenue analysis", icon: TrendingUp, color: "text-primary bg-primary/10", type: "sales" },
  { title: "Monthly P&L Report", description: "Profit and loss statement for the month", icon: FileText, color: "text-info bg-info/10", type: "financial" },
  { title: "Cashier Performance", description: "Individual cashier sales metrics", icon: Users, color: "text-accent bg-accent/10", type: "staff" },
  { title: "Inventory Report", description: "Stock levels and movement analysis", icon: Package, color: "text-warning bg-warning/10", type: "inventory" },
  { title: "Category-wise Sales", description: "Sales breakdown by product category", icon: TrendingUp, color: "text-primary bg-primary/10", type: "sales" },
  { title: "Repair Jobs Report", description: "Repair revenue and completion rates", icon: Wrench, color: "text-info bg-info/10", type: "repairs" },
  { title: "Used Phone Profit", description: "Profit analysis on used phone sales", icon: Smartphone, color: "text-success bg-success/10", type: "used_phones" },
  { title: "Top Selling Products", description: "Best performing products this month", icon: Package, color: "text-accent bg-accent/10", type: "inventory" },
];

export default function Reports() {
  const [selectedType, setSelectedType] = useState("all");
  const [dateRange, setDateRange] = useState("month");
  const { stats, loading: statsLoading } = useDashboardStats();
  const { sales, loading: salesLoading } = useSales();
  const { repairs, loading: repairsLoading } = useRepairs();

  const loading = statsLoading || salesLoading || repairsLoading;

  const filteredReports = reports.filter(
    (report) => selectedType === "all" || report.type === selectedType
  );

  const completedRepairs = repairs.filter(r => r.status === "completed" || r.status === "delivered").length;

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-24" />)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => <Skeleton key={i} className="h-40" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Reports</h1>
          <p className="text-muted-foreground">Generate and export business reports</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[150px]">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl p-4 shadow-card border border-border">
          <p className="text-sm text-muted-foreground">Total Sales</p>
          <p className="text-2xl font-bold text-success">Rs {stats.monthlySales.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">This month</p>
        </div>
        <div className="bg-card rounded-xl p-4 shadow-card border border-border">
          <p className="text-sm text-muted-foreground">Weekly Revenue</p>
          <p className="text-2xl font-bold text-primary">Rs {stats.weeklyRevenue.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">This week</p>
        </div>
        <div className="bg-card rounded-xl p-4 shadow-card border border-border">
          <p className="text-sm text-muted-foreground">Total Transactions</p>
          <p className="text-2xl font-bold">{sales.length}</p>
          <p className="text-xs text-muted-foreground">all time</p>
        </div>
        <div className="bg-card rounded-xl p-4 shadow-card border border-border">
          <p className="text-sm text-muted-foreground">Repairs Completed</p>
          <p className="text-2xl font-bold">{completedRepairs}</p>
          <p className="text-xs text-muted-foreground">all time</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { value: "all", label: "All Reports" },
          { value: "sales", label: "Sales" },
          { value: "financial", label: "Financial" },
          { value: "inventory", label: "Inventory" },
          { value: "repairs", label: "Repairs" },
          { value: "staff", label: "Staff" },
        ].map((filter) => (
          <Button
            key={filter.value}
            variant={selectedType === filter.value ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedType(filter.value)}
            className="whitespace-nowrap"
          >
            {filter.label}
          </Button>
        ))}
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredReports.map((report) => (
          <div
            key={report.title}
            className="bg-card rounded-xl border border-border p-5 shadow-card hover:shadow-card-hover transition-all duration-200 group"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className={cn("p-3 rounded-xl", report.color)}>
                <report.icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold mb-1">{report.title}</h3>
                <p className="text-sm text-muted-foreground">{report.description}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                <FileText className="w-4 h-4 mr-1" />
                View
              </Button>
              <Button variant="secondary" size="sm" className="flex-1">
                <Download className="w-4 h-4 mr-1" />
                Export
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Export All */}
      <div className="bg-card rounded-xl border border-border p-6 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="font-semibold text-lg">Export All Reports</h3>
            <p className="text-sm text-muted-foreground">
              Download all reports for the selected date range in one file
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export as Excel
            </Button>
            <Button variant="glow">
              <Download className="w-4 h-4 mr-2" />
              Export as PDF
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
