import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["ADMIN", "CASHIER"]),
})

export const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  description: z.string().optional(),
})

export const itemSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  price: z.number().min(0.01, "Price must be greater than 0"),
  stock: z.number().int().min(0, "Stock must be a non-negative integer"),
  categoryId: z.string().min(1, "Category is required"),
  imageUrl: z.string().optional(),
})

export const orderSchema = z.object({
  items: z
    .array(
      z.object({
        itemId: z.string(),
        quantity: z.number().int().min(1),
        price: z.number().min(0),
      }),
    )
    .min(1, "At least one item is required"),
})

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type CategoryFormData = z.infer<typeof categorySchema>
export type ItemFormData = z.infer<typeof itemSchema>
export type OrderFormData = z.infer<typeof orderSchema>
