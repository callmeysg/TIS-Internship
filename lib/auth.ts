import { createServerComponentClient } from "./supabase"
import { redirect } from "next/navigation"
import type { Profile } from "./types"

export async function getUser() {
  const supabase = createServerComponentClient()

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
      return null
    }

    return user
  } catch (error) {
    console.error("Error getting user:", error)
    return null
  }
}

export async function getUserProfile(): Promise<Profile | null> {
  const user = await getUser()

  if (!user) {
    return null
  }

  const supabase = createServerComponentClient()

  try {
    const { data: profile, error } = await supabase.from("profiles").select("*").eq("userId", user.id).single()

    if (error || !profile) {
      console.error("Error getting profile:", error)
      return null
    }

    return profile
  } catch (error) {
    console.error("Error getting profile:", error)
    return null
  }
}

export async function requireAuth() {
  const user = await getUser()

  if (!user) {
    redirect("/login")
  }

  return user
}

export async function requireAdmin() {
  const profile = await getUserProfile()

  if (!profile || profile.role !== "ADMIN") {
    redirect("/dashboard")
  }

  return profile
}
