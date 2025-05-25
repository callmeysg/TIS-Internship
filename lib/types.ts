export type Role = "ADMIN" | "CASHIER"
export type OrderStatus = "PENDING" | "COMPLETED" | "CANCELLED"

export interface Profile {
  id: string
  userId: string
  username: string
  email: string
  role: Role
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
  description?: string
  createdAt: string
  updatedAt: string
}

export interface Item {
  id: string
  name: string
  price: number
  imageUrl?: string
  stock: number
  categoryId: string
  category?: Category
  createdAt: string
  updatedAt: string
}

export interface Order {
  id: string
  totalAmount: number
  status: OrderStatus
  userId: string
  profile?: Profile
  orderItems?: OrderItem[]
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  id: string
  quantity: number
  price: number
  orderId: string
  itemId: string
  item?: Item
}

export interface CartItem {
  item: Item
  quantity: number
}

export interface DashboardStats {
  todaySales: number
  totalOrders: number
  totalItems: number
  lowStockItems: number
  recentOrders: Order[]
  topSellingItems: Array<{
    item: Item
    totalSold: number
  }>
}
