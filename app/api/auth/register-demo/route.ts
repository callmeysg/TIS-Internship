import { NextResponse } from "next/server"
import { createServerComponentClient } from "@/lib/supabase"

export async function POST() {
  try {
    const supabase = createServerComponentClient()

    // Create admin user
    const { data: adminAuth, error: adminAuthError } = await supabase.auth.admin.createUser({
      email: "admin@example.com",
      password: "admin123",
      email_confirm: true,
    })

    if (adminAuthError) {
      console.error("Admin auth error:", adminAuthError)
    } else if (adminAuth.user) {
      // Create admin profile
      const { error: adminProfileError } = await supabase.from("profiles").insert([
        {
          userId: adminAuth.user.id,
          username: "admin",
          email: "admin@example.com",
          role: "ADMIN",
        },
      ])

      if (adminProfileError) {
        console.error("Admin profile error:", adminProfileError)
      }
    }

    // Create cashier user
    const { data: cashierAuth, error: cashierAuthError } = await supabase.auth.admin.createUser({
      email: "cashier@example.com",
      password: "cashier123",
      email_confirm: true,
    })

    if (cashierAuthError) {
      console.error("Cashier auth error:", cashierAuthError)
    } else if (cashierAuth.user) {
      // Create cashier profile
      const { error: cashierProfileError } = await supabase.from("profiles").insert([
        {
          userId: cashierAuth.user.id,
          username: "cashier",
          email: "cashier@example.com",
          role: "CASHIER",
        },
      ])

      if (cashierProfileError) {
        console.error("Cashier profile error:", cashierProfileError)
      }
    }

    return NextResponse.json({
      success: true,
      message: "Demo users created successfully",
      adminId: adminAuth?.user?.id,
      cashierId: cashierAuth?.user?.id,
    })
  } catch (error) {
    console.error("Demo user creation error:", error)
    return NextResponse.json({ error: "Failed to create demo users" }, { status: 500 })
  }
}
