import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface DashboardStats {
  todaySales: number;
  weeklyRevenue: number;
  monthlySales: number;
  pendingRepairs: number;
  lowStockProducts: number;
  totalCustomers: number;
}

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats>({
    todaySales: 0,
    weeklyRevenue: 0,
    monthlySales: 0,
    pendingRepairs: 0,
    lowStockProducts: 0,
    totalCustomers: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    const today = new Date().toISOString().split('T')[0];
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    // Fetch today's sales
    const { data: todaySalesData } = await supabase
      .from("sales")
      .select("total")
      .gte("created_at", today);

    // Fetch weekly sales
    const { data: weeklySalesData } = await supabase
      .from("sales")
      .select("total")
      .gte("created_at", weekAgo.toISOString());

    // Fetch monthly sales
    const { data: monthlySalesData } = await supabase
      .from("sales")
      .select("total")
      .gte("created_at", monthAgo.toISOString());

    // Fetch pending repairs
    const { data: repairsData } = await supabase
      .from("repairs")
      .select("id")
      .in("status", ["pending", "in_progress"]);

    // Fetch low stock products
    const { data: productsData } = await supabase
      .from("products")
      .select("id, stock, min_stock");

    // Fetch customers
    const { data: customersData } = await supabase
      .from("customers")
      .select("id");

    const lowStock = productsData?.filter(p => p.stock <= p.min_stock) || [];

    setStats({
      todaySales: todaySalesData?.reduce((sum, s) => sum + Number(s.total), 0) || 0,
      weeklyRevenue: weeklySalesData?.reduce((sum, s) => sum + Number(s.total), 0) || 0,
      monthlySales: monthlySalesData?.reduce((sum, s) => sum + Number(s.total), 0) || 0,
      pendingRepairs: repairsData?.length || 0,
      lowStockProducts: lowStock.length,
      totalCustomers: customersData?.length || 0
    });
    setLoading(false);
  };

  useEffect(() => {
    fetchStats();

    // Subscribe to changes
    const salesChannel = supabase
      .channel("dashboard-sales")
      .on("postgres_changes", { event: "*", schema: "public", table: "sales" }, fetchStats)
      .subscribe();

    const repairsChannel = supabase
      .channel("dashboard-repairs")
      .on("postgres_changes", { event: "*", schema: "public", table: "repairs" }, fetchStats)
      .subscribe();

    return () => {
      supabase.removeChannel(salesChannel);
      supabase.removeChannel(repairsChannel);
    };
  }, []);

  return { stats, loading, refetch: fetchStats };
}
