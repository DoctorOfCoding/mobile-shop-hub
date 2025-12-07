import { z } from "zod";

// Customer validation schema
export const customerSchema = z.object({
  name: z.string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  phone: z.string()
    .trim()
    .min(1, "Phone number is required")
    .max(20, "Phone number must be less than 20 characters")
    .regex(/^[\d\s\-+()]+$/, "Phone number contains invalid characters"),
  email: z.string()
    .trim()
    .email("Invalid email address")
    .max(255, "Email must be less than 255 characters")
    .optional()
    .nullable()
    .or(z.literal("")),
});

// Repair validation schema
export const repairSchema = z.object({
  customer_name: z.string()
    .trim()
    .min(1, "Customer name is required")
    .max(100, "Customer name must be less than 100 characters"),
  customer_phone: z.string()
    .trim()
    .min(1, "Phone number is required")
    .max(20, "Phone number must be less than 20 characters")
    .regex(/^[\d\s\-+()]+$/, "Phone number contains invalid characters"),
  device_model: z.string()
    .trim()
    .min(1, "Device model is required")
    .max(100, "Device model must be less than 100 characters"),
  imei: z.string()
    .trim()
    .max(15, "IMEI must be 15 digits or less")
    .regex(/^[\d]*$/, "IMEI must contain only digits")
    .optional()
    .nullable()
    .or(z.literal("")),
  problem: z.string()
    .trim()
    .min(1, "Problem description is required")
    .max(1000, "Problem description must be less than 1000 characters"),
  estimated_cost: z.number()
    .min(0, "Estimated cost cannot be negative")
    .max(10000000, "Estimated cost is too high"),
  advance_payment: z.number()
    .min(0, "Advance payment cannot be negative")
    .max(10000000, "Advance payment is too high"),
  technician: z.string()
    .trim()
    .max(100, "Technician name must be less than 100 characters")
    .optional()
    .nullable()
    .or(z.literal("")),
});

// Product validation schema
export const productSchema = z.object({
  name: z.string()
    .trim()
    .min(1, "Product name is required")
    .max(200, "Product name must be less than 200 characters"),
  category: z.string()
    .trim()
    .min(1, "Category is required")
    .max(100, "Category must be less than 100 characters"),
  sku: z.string()
    .trim()
    .min(1, "SKU is required")
    .max(50, "SKU must be less than 50 characters"),
  cost_price: z.number()
    .min(0, "Cost price cannot be negative")
    .max(100000000, "Cost price is too high"),
  selling_price: z.number()
    .min(0, "Selling price cannot be negative")
    .max(100000000, "Selling price is too high"),
  stock: z.number()
    .int("Stock must be a whole number")
    .min(0, "Stock cannot be negative")
    .max(1000000, "Stock is too high"),
  min_stock: z.number()
    .int("Minimum stock must be a whole number")
    .min(0, "Minimum stock cannot be negative")
    .max(1000000, "Minimum stock is too high"),
  supplier: z.string()
    .trim()
    .max(200, "Supplier name must be less than 200 characters")
    .optional()
    .nullable()
    .or(z.literal("")),
});

// Helper to format validation errors for toast
export function formatValidationErrors(error: z.ZodError): string {
  return error.errors.map(e => e.message).join(", ");
}
