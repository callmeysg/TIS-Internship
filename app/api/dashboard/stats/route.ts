import { NextResponse } from "next/server"
import { createServerComponentClient } from "@/lib/supabase"
import { getUserProfile } from "@/lib/auth"

export async function GET() {
  try {
    const profile = await getUserProfile()

    if (!profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = createServerComponentClient()

    // Get today's date
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // Today's sales
    const { data: todayOrders } = await supabase
      .from("orders")
      .select("totalAmount")
      .eq("status", "COMPLETED")
      .gte("createdAt", today.toISOString())
      .lt("createdAt", tomorrow.toISOString())

    const todaySales = todayOrders?.reduce((sum, order) => sum + Number(order.totalAmount), 0) || 0

    // Total orders count
    const { count: totalOrders } = await supabase.from("orders").select("*", { count: "exact", head: true })

    // Total items count
    const { count: totalItems } = await supabase.from("items").select("*", { count: "exact", head: true })

    // Low stock items (stock < 10)
    const { count: lowStockItems } = await supabase
      .from("items")
      .select("*", { count: "exact", head: true })
      .lt("stock", 10)

    // Recent orders
    const { data: recentOrders } = await supabase
      .from("orders")
      .select(`
        *,
        profile:profiles!orders_userId_fkey(username, email)
      `)
      .order("createdAt", { ascending: false })
      .limit(5)

    // Top selling items
    const { data: topSellingData } = await supabase.from("order_items").select(`
        itemId,
        quantity,
        item:items(*)
      `)

    const itemSales =
      topSellingData?.reduce((acc: any, orderItem: any) => {
        const itemId = orderItem.itemId
        if (!acc[itemId]) {
          acc[itemId] = {
            item: orderItem.item,
            totalSold: 0,
          }
        }
        acc[itemId].totalSold += orderItem.quantity
        return acc
      }, {}) || {}

    const topSellingItems = Object.values(itemSales)
      .sort((a: any, b: any) => b.totalSold - a.totalSold)
      .slice(0, 5)

    return NextResponse.json({
      todaySales,
      totalOrders: totalOrders || 0,
      totalItems: totalItems || 0,
      lowStockItems: lowStockItems || 0,
      recentOrders: recentOrders || [],
      topSellingItems,
    })
  } catch (error) {
    console.error("Dashboard stats error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
