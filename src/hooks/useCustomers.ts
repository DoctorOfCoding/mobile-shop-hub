import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  total_purchases: number;
  total_spent: number;
  total_repairs: number;
  last_visit: string | null;
  created_at: string;
  updated_at: string;
}

export interface CustomerFormData {
  name: string;
  phone: string;
  email?: string | null;
}

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async () => {
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error fetching customers", description: error.message, variant: "destructive" });
      return;
    }

    setCustomers(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchCustomers();

    const channel = supabase
      .channel("customers-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "customers" }, (payload) => {
        if (payload.eventType === "INSERT") {
          setCustomers((prev) => [payload.new as Customer, ...prev]);
        } else if (payload.eventType === "UPDATE") {
          setCustomers((prev) => prev.map((c) => (c.id === (payload.new as Customer).id ? (payload.new as Customer) : c)));
        } else if (payload.eventType === "DELETE") {
          setCustomers((prev) => prev.filter((c) => c.id !== (payload.old as Customer).id));
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const addCustomer = async (customer: CustomerFormData) => {
    const { error } = await supabase.from("customers").insert([customer]);
    if (error) {
      toast({ title: "Error adding customer", description: error.message, variant: "destructive" });
      return false;
    }
    toast({ title: "Customer Added", description: "Customer has been added successfully." });
    return true;
  };

  const updateCustomer = async (id: string, customer: Partial<CustomerFormData>) => {
    const { error } = await supabase.from("customers").update({ ...customer, updated_at: new Date().toISOString() }).eq("id", id);
    if (error) {
      toast({ title: "Error updating customer", description: error.message, variant: "destructive" });
      return false;
    }
    toast({ title: "Customer Updated", description: "Customer has been updated successfully." });
    return true;
  };

  const deleteCustomer = async (id: string) => {
    const { error } = await supabase.from("customers").delete().eq("id", id);
    if (error) {
      toast({ title: "Error deleting customer", description: error.message, variant: "destructive" });
      return false;
    }
    toast({ title: "Customer Deleted", description: "Customer has been removed.", variant: "destructive" });
    return true;
  };

  return { customers, loading, addCustomer, updateCustomer, deleteCustomer, refetch: fetchCustomers };
}
