import { type NextRequest, NextResponse } from "next/server"
import { createServerComponentClient } from "@/lib/supabase"
import { getUserProfile } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const profile = await getUserProfile()

    if (!profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = createServerComponentClient()

    let query = supabase
      .from("orders")
      .select(`
        *,
        profile:profiles!orders_userId_fkey(username, email),
        orderItems:order_items(
          *,
          item:items(*)
        )
      `)
      .eq("id", params.id)

    // If not admin, only allow access to own orders
    if (profile.role !== "ADMIN") {
      query = query.eq("userId", profile.userId)
    }

    const { data: order, error } = await query.single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json(order)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
