import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface ShopSettings {
  id: string;
  shop_name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  website: string | null;
  logo_url: string | null;
  receipt_show_logo: boolean;
  receipt_show_cashier: boolean;
  receipt_show_tax: boolean;
  receipt_footer: string | null;
  receipt_size: string;
  tax_enabled: boolean;
  tax_name: string;
  tax_rate: number;
  tax_number: string | null;
  created_at: string;
  updated_at: string;
}

export function useSettings() {
  const [settings, setSettings] = useState<ShopSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    const { data, error } = await supabase
      .from("shop_settings")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (error) {
      toast({ title: "Error fetching settings", description: error.message, variant: "destructive" });
      return;
    }

    setSettings(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchSettings();

    const channel = supabase
      .channel("settings-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "shop_settings" }, (payload) => {
        if (payload.eventType === "UPDATE") {
          setSettings(payload.new as ShopSettings);
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const updateSettings = async (updates: Partial<ShopSettings>) => {
    if (!settings?.id) return false;
    
    const { error } = await supabase
      .from("shop_settings")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", settings.id);

    if (error) {
      toast({ title: "Error saving settings", description: error.message, variant: "destructive" });
      return false;
    }

    toast({ title: "Settings Saved", description: "Your settings have been updated." });
    return true;
  };

  const uploadLogo = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `logo.${fileExt}`;

    const { error } = await supabase.storage
      .from("product-images")
      .upload(fileName, file, { upsert: true });

    if (error) {
      toast({ title: "Error uploading logo", description: error.message, variant: "destructive" });
      return null;
    }

    const { data } = supabase.storage.from("product-images").getPublicUrl(fileName);
    return data.publicUrl;
  };

  return { settings, loading, updateSettings, uploadLogo, refetch: fetchSettings };
}
