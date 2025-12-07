import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { repairSchema, formatValidationErrors } from "@/lib/validations";
export interface Repair {
  id: string;
  job_id: string;
  customer_name: string;
  customer_phone: string;
  device_model: string;
  imei: string | null;
  problem: string;
  estimated_cost: number;
  advance_payment: number;
  final_cost: number | null;
  technician: string | null;
  status: "pending" | "in_progress" | "completed" | "delivered";
  created_at: string;
  updated_at: string;
}

export interface RepairFormData {
  customer_name: string;
  customer_phone: string;
  device_model: string;
  imei?: string | null;
  problem: string;
  estimated_cost: number;
  advance_payment: number;
  technician?: string | null;
}

export function useRepairs() {
  const [repairs, setRepairs] = useState<Repair[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRepairs = async () => {
    const { data, error } = await supabase
      .from("repairs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error fetching repairs", description: error.message, variant: "destructive" });
      return;
    }

    setRepairs((data as Repair[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchRepairs();

    const channel = supabase
      .channel("repairs-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "repairs" }, (payload) => {
        if (payload.eventType === "INSERT") {
          setRepairs((prev) => [payload.new as Repair, ...prev]);
        } else if (payload.eventType === "UPDATE") {
          setRepairs((prev) => prev.map((r) => (r.id === (payload.new as Repair).id ? (payload.new as Repair) : r)));
        } else if (payload.eventType === "DELETE") {
          setRepairs((prev) => prev.filter((r) => r.id !== (payload.old as Repair).id));
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const addRepair = async (repair: RepairFormData) => {
    const validation = repairSchema.safeParse(repair);
    if (!validation.success) {
      toast({ title: "Validation Error", description: formatValidationErrors(validation.error), variant: "destructive" });
      return false;
    }
    const validatedData = validation.data;
    const { error } = await supabase.from("repairs").insert([{ 
      customer_name: validatedData.customer_name,
      customer_phone: validatedData.customer_phone,
      device_model: validatedData.device_model,
      imei: validatedData.imei || null,
      problem: validatedData.problem,
      estimated_cost: validatedData.estimated_cost,
      advance_payment: validatedData.advance_payment,
      technician: validatedData.technician || null,
      job_id: "" 
    }]);
    if (error) {
      toast({ title: "Error adding repair job", description: error.message, variant: "destructive" });
      return false;
    }
    toast({ title: "Repair Job Created", description: "Repair job has been created successfully." });
    return true;
  };

  const updateRepair = async (id: string, repair: Partial<Repair>) => {
    const validation = repairSchema.partial().safeParse(repair);
    if (!validation.success) {
      toast({ title: "Validation Error", description: formatValidationErrors(validation.error), variant: "destructive" });
      return false;
    }
    const { error } = await supabase.from("repairs").update({ ...validation.data, updated_at: new Date().toISOString() }).eq("id", id);
    if (error) {
      toast({ title: "Error updating repair", description: error.message, variant: "destructive" });
      return false;
    }
    toast({ title: "Repair Updated", description: "Repair job has been updated successfully." });
    return true;
  };

  const deleteRepair = async (id: string) => {
    const { error } = await supabase.from("repairs").delete().eq("id", id);
    if (error) {
      toast({ title: "Error deleting repair", description: error.message, variant: "destructive" });
      return false;
    }
    toast({ title: "Repair Deleted", description: "Repair job has been removed.", variant: "destructive" });
    return true;
  };

  return { repairs, loading, addRepair, updateRepair, deleteRepair, refetch: fetchRepairs };
}
