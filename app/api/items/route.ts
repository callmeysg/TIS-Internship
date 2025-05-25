import { type NextRequest, NextResponse } from "next/server"
import { createServerComponentClient } from "@/lib/supabase"
import { getUserProfile } from "@/lib/auth"
import { itemSchema } from "@/lib/validations"

export async function GET(request: NextRequest) {
  try {
    const profile = await getUserProfile()

    if (!profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get("categoryId")
    const search = searchParams.get("search")

    const supabase = createServerComponentClient()

    let query = supabase
      .from("items")
      .select(`
        *,
        category:categories(*)
      `)
      .order("name")

    if (categoryId) {
      query = query.eq("categoryId", categoryId)
    }

    if (search) {
      query = query.ilike("name", `%${search}%`)
    }

    const { data: items, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(items)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const profile = await getUserProfile()

    if (!profile || profile.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = itemSchema.parse(body)

    const supabase = createServerComponentClient()

    const { data: item, error } = await supabase
      .from("items")
      .insert([validatedData])
      .select(`
        *,
        category:categories(*)
      `)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
