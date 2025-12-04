export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      customers: {
        Row: {
          created_at: string
          email: string | null
          id: string
          last_visit: string | null
          name: string
          phone: string
          total_purchases: number | null
          total_repairs: number | null
          total_spent: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          last_visit?: string | null
          name: string
          phone: string
          total_purchases?: number | null
          total_repairs?: number | null
          total_spent?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          last_visit?: string | null
          name?: string
          phone?: string
          total_purchases?: number | null
          total_repairs?: number | null
          total_spent?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          category: string
          cost_price: number
          created_at: string
          id: string
          image_url: string | null
          min_stock: number
          name: string
          selling_price: number
          sku: string
          stock: number
          supplier: string | null
          updated_at: string
        }
        Insert: {
          category: string
          cost_price?: number
          created_at?: string
          id?: string
          image_url?: string | null
          min_stock?: number
          name: string
          selling_price?: number
          sku: string
          stock?: number
          supplier?: string | null
          updated_at?: string
        }
        Update: {
          category?: string
          cost_price?: number
          created_at?: string
          id?: string
          image_url?: string | null
          min_stock?: number
          name?: string
          selling_price?: number
          sku?: string
          stock?: number
          supplier?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      repairs: {
        Row: {
          advance_payment: number | null
          created_at: string
          customer_name: string
          customer_phone: string
          device_model: string
          estimated_cost: number | null
          final_cost: number | null
          id: string
          imei: string | null
          job_id: string
          problem: string
          status: string
          technician: string | null
          updated_at: string
        }
        Insert: {
          advance_payment?: number | null
          created_at?: string
          customer_name: string
          customer_phone: string
          device_model: string
          estimated_cost?: number | null
          final_cost?: number | null
          id?: string
          imei?: string | null
          job_id: string
          problem: string
          status?: string
          technician?: string | null
          updated_at?: string
        }
        Update: {
          advance_payment?: number | null
          created_at?: string
          customer_name?: string
          customer_phone?: string
          device_model?: string
          estimated_cost?: number | null
          final_cost?: number | null
          id?: string
          imei?: string | null
          job_id?: string
          problem?: string
          status?: string
          technician?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      sale_items: {
        Row: {
          created_at: string
          id: string
          product_id: string | null
          product_name: string
          quantity: number
          sale_id: string
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          id?: string
          product_id?: string | null
          product_name: string
          quantity?: number
          sale_id: string
          total_price: number
          unit_price: number
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string | null
          product_name?: string
          quantity?: number
          sale_id?: string
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "sale_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sale_items_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "sales"
            referencedColumns: ["id"]
          },
        ]
      }
      sales: {
        Row: {
          created_at: string
          customer_id: string | null
          customer_name: string | null
          discount_amount: number | null
          discount_percent: number | null
          id: string
          payment_method: string
          subtotal: number
          total: number
        }
        Insert: {
          created_at?: string
          customer_id?: string | null
          customer_name?: string | null
          discount_amount?: number | null
          discount_percent?: number | null
          id?: string
          payment_method: string
          subtotal?: number
          total?: number
        }
        Update: {
          created_at?: string
          customer_id?: string | null
          customer_name?: string | null
          discount_amount?: number | null
          discount_percent?: number | null
          id?: string
          payment_method?: string
          subtotal?: number
          total?: number
        }
        Relationships: [
          {
            foreignKeyName: "sales_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      shop_settings: {
        Row: {
          address: string | null
          created_at: string
          email: string | null
          id: string
          logo_url: string | null
          phone: string | null
          receipt_footer: string | null
          receipt_show_cashier: boolean | null
          receipt_show_logo: boolean | null
          receipt_show_tax: boolean | null
          receipt_size: string | null
          shop_name: string
          tax_enabled: boolean | null
          tax_name: string | null
          tax_number: string | null
          tax_rate: number | null
          updated_at: string
          website: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          logo_url?: string | null
          phone?: string | null
          receipt_footer?: string | null
          receipt_show_cashier?: boolean | null
          receipt_show_logo?: boolean | null
          receipt_show_tax?: boolean | null
          receipt_size?: string | null
          shop_name?: string
          tax_enabled?: boolean | null
          tax_name?: string | null
          tax_number?: string | null
          tax_rate?: number | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          logo_url?: string | null
          phone?: string | null
          receipt_footer?: string | null
          receipt_show_cashier?: boolean | null
          receipt_show_logo?: boolean | null
          receipt_show_tax?: boolean | null
          receipt_size?: string | null
          shop_name?: string
          tax_enabled?: boolean | null
          tax_name?: string | null
          tax_number?: string | null
          tax_rate?: number | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      used_phones: {
        Row: {
          actual_selling_price: number | null
          condition: string
          created_at: string
          expected_selling_price: number
          id: string
          imei: string
          model: string
          phone_id: string
          purchase_price: number
          purchased_at: string
          purchased_from: string
          sold_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          actual_selling_price?: number | null
          condition: string
          created_at?: string
          expected_selling_price?: number
          id?: string
          imei: string
          model: string
          phone_id: string
          purchase_price?: number
          purchased_at?: string
          purchased_from: string
          sold_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          actual_selling_price?: number | null
          condition?: string
          created_at?: string
          expected_selling_price?: number
          id?: string
          imei?: string
          model?: string
          phone_id?: string
          purchase_price?: number
          purchased_at?: string
          purchased_from?: string
          sold_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
