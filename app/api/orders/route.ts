import { type NextRequest, NextResponse } from "next/server"
import { createServerComponentClient } from "@/lib/supabase"
import { getUserProfile } from "@/lib/auth"
import { orderSchema } from "@/lib/validations"

export async function GET() {
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
      .order("createdAt", { ascending: false })

    // If not admin, only show user's own orders
    if (profile.role !== "ADMIN") {
      query = query.eq("userId", profile.userId)
    }

    const { data: orders, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(orders)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const profile = await getUserProfile()

    if (!profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = orderSchema.parse(body)

    const supabase = createServerComponentClient()

    // Calculate total amount
    const totalAmount = validatedData.items.reduce((sum, item) => sum + item.price * item.quantity, 0)

    // Create order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert([
        {
          totalAmount,
          userId: profile.userId,
          status: "COMPLETED",
        },
      ])
      .select()
      .single()

    if (orderError) {
      return NextResponse.json({ error: orderError.message }, { status: 500 })
    }

    // Create order items
    const orderItems = validatedData.items.map((item) => ({
      orderId: order.id,
      itemId: item.itemId,
      quantity: item.quantity,
      price: item.price,
    }))

    const { error: orderItemsError } = await supabase.from("order_items").insert(orderItems)

    if (orderItemsError) {
      return NextResponse.json({ error: orderItemsError.message }, { status: 500 })
    }

    // Update item stock
    for (const item of validatedData.items) {
      await supabase.rpc("decrement_stock", {
        item_id: item.itemId,
        quantity: item.quantity,
      })
    }

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
