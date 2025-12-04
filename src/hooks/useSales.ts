import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Sale {
  id: string;
  customer_name: string | null;
  customer_id: string | null;
  subtotal: number;
  discount_percent: number;
  discount_amount: number;
  total: number;
  payment_method: "cash" | "card" | "easypaisa" | "jazzcash";
  created_at: string;
}

export interface SaleItem {
  id: string;
  sale_id: string;
  product_id: string | null;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
}

export interface CartItem {
  id: string;
  product_id?: string;
  name: string;
  price: number;
  quantity: number;
}

export function useSales() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSales = async () => {
    const { data, error } = await supabase
      .from("sales")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error fetching sales", description: error.message, variant: "destructive" });
      return;
    }

    setSales((data as Sale[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchSales();

    const channel = supabase
      .channel("sales-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "sales" }, (payload) => {
        if (payload.eventType === "INSERT") {
          setSales((prev) => [payload.new as Sale, ...prev]);
        } else if (payload.eventType === "DELETE") {
          setSales((prev) => prev.filter((s) => s.id !== (payload.old as Sale).id));
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const completeSale = async (
    cart: CartItem[],
    customerName: string | null,
    discountPercent: number,
    paymentMethod: "cash" | "card" | "easypaisa" | "jazzcash"
  ) => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discountAmount = (subtotal * discountPercent) / 100;
    const total = subtotal - discountAmount;

    // Create sale
    const { data: saleData, error: saleError } = await supabase
      .from("sales")
      .insert([{
        customer_name: customerName || null,
        subtotal,
        discount_percent: discountPercent,
        discount_amount: discountAmount,
        total,
        payment_method: paymentMethod
      }])
      .select()
      .single();

    if (saleError) {
      toast({ title: "Error completing sale", description: saleError.message, variant: "destructive" });
      return false;
    }

    // Create sale items
    const saleItems = cart.map(item => ({
      sale_id: saleData.id,
      product_id: item.product_id || null,
      product_name: item.name,
      quantity: item.quantity,
      unit_price: item.price,
      total_price: item.price * item.quantity
    }));

    const { error: itemsError } = await supabase.from("sale_items").insert(saleItems);

    if (itemsError) {
      toast({ title: "Error saving sale items", description: itemsError.message, variant: "destructive" });
      return false;
    }

    // Update product stock
    for (const item of cart) {
      if (item.product_id) {
        const { data: product } = await supabase.from("products").select("stock").eq("id", item.product_id).single();
        if (product) {
          await supabase.from("products").update({ stock: product.stock - item.quantity }).eq("id", item.product_id);
        }
      }
    }

    toast({ title: "Sale Completed", description: `Total: Rs ${total.toLocaleString()}` });
    return true;
  };

  const getTodaySales = () => {
    const today = new Date().toISOString().split('T')[0];
    return sales.filter(s => s.created_at.startsWith(today));
  };

  const getWeekSales = () => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return sales.filter(s => new Date(s.created_at) >= weekAgo);
  };

  const getMonthSales = () => {
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    return sales.filter(s => new Date(s.created_at) >= monthAgo);
  };

  return { sales, loading, completeSale, getTodaySales, getWeekSales, getMonthSales, refetch: fetchSales };
}
