import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface UsedPhone {
  id: string;
  phone_id: string;
  model: string;
  imei: string;
  condition: "excellent" | "good" | "fair" | "poor";
  purchase_price: number;
  expected_selling_price: number;
  actual_selling_price: number | null;
  purchased_from: string;
  purchased_at: string;
  sold_at: string | null;
  status: "in_stock" | "sold";
  created_at: string;
  updated_at: string;
}

export interface UsedPhoneFormData {
  model: string;
  imei: string;
  condition: "excellent" | "good" | "fair" | "poor";
  purchase_price: number;
  expected_selling_price: number;
  purchased_from: string;
  purchased_at?: string;
}

export function useUsedPhones() {
  const [usedPhones, setUsedPhones] = useState<UsedPhone[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsedPhones = async () => {
    const { data, error } = await supabase
      .from("used_phones")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error fetching used phones", description: error.message, variant: "destructive" });
      return;
    }

    setUsedPhones((data as UsedPhone[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsedPhones();

    const channel = supabase
      .channel("used-phones-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "used_phones" }, (payload) => {
        if (payload.eventType === "INSERT") {
          setUsedPhones((prev) => [payload.new as UsedPhone, ...prev]);
        } else if (payload.eventType === "UPDATE") {
          setUsedPhones((prev) => prev.map((p) => (p.id === (payload.new as UsedPhone).id ? (payload.new as UsedPhone) : p)));
        } else if (payload.eventType === "DELETE") {
          setUsedPhones((prev) => prev.filter((p) => p.id !== (payload.old as UsedPhone).id));
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const addUsedPhone = async (phone: UsedPhoneFormData) => {
    const { error } = await supabase.from("used_phones").insert([{ ...phone, phone_id: "" }]);
    if (error) {
      toast({ title: "Error adding phone", description: error.message, variant: "destructive" });
      return false;
    }
    toast({ title: "Phone Added", description: "Used phone has been added to inventory." });
    return true;
  };

  const updateUsedPhone = async (id: string, phone: Partial<UsedPhone>) => {
    const { error } = await supabase.from("used_phones").update({ ...phone, updated_at: new Date().toISOString() }).eq("id", id);
    if (error) {
      toast({ title: "Error updating phone", description: error.message, variant: "destructive" });
      return false;
    }
    toast({ title: "Phone Updated", description: "Used phone has been updated successfully." });
    return true;
  };

  const sellPhone = async (id: string, actualSellingPrice: number) => {
    const { error } = await supabase.from("used_phones").update({
      status: "sold",
      actual_selling_price: actualSellingPrice,
      sold_at: new Date().toISOString().split('T')[0],
      updated_at: new Date().toISOString()
    }).eq("id", id);
    if (error) {
      toast({ title: "Error selling phone", description: error.message, variant: "destructive" });
      return false;
    }
    toast({ title: "Phone Sold", description: "Phone has been marked as sold." });
    return true;
  };

  const deleteUsedPhone = async (id: string) => {
    const { error } = await supabase.from("used_phones").delete().eq("id", id);
    if (error) {
      toast({ title: "Error deleting phone", description: error.message, variant: "destructive" });
      return false;
    }
    toast({ title: "Phone Deleted", description: "Used phone has been removed.", variant: "destructive" });
    return true;
  };

  return { usedPhones, loading, addUsedPhone, updateUsedPhone, sellPhone, deleteUsedPhone, refetch: fetchUsedPhones };
}
