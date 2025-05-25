"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { createClientComponentClient } from "@/lib/supabase"
import type { Profile } from "@/lib/types"
import { LayoutDashboard, Package, ShoppingCart, Users, FolderOpen, Store, LogOut, Menu, X } from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["ADMIN", "CASHIER"] },
  { name: "Explore Items", href: "/explore", icon: Store, roles: ["ADMIN", "CASHIER"] },
  { name: "Orders", href: "/orders", icon: ShoppingCart, roles: ["ADMIN", "CASHIER"] },
  { name: "Categories", href: "/categories", icon: FolderOpen, roles: ["ADMIN"] },
  { name: "Items", href: "/items", icon: Package, roles: ["ADMIN"] },
  { name: "Users", href: "/users", icon: Users, roles: ["ADMIN"] },
]

export function Sidebar() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const pathname = usePathname()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const getProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase.from("profiles").select("*").eq("userId", user.id).single()
        setProfile(profile)
      }
    }
    getProfile()
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = "/login"
  }

  const filteredNavigation = navigation.filter((item) => profile?.role && item.roles.includes(profile.role))

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-white dark:bg-black rounded-sm"></div>
          </div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Retail</h1>
        </div>
        <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMobileOpen(false)}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4">
        <nav className="space-y-1">
          {filteredNavigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-white",
                )}
                onClick={() => setIsMobileOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <p className="text-sm font-medium text-gray-900 dark:text-white">{profile?.username}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{profile?.email}</p>
          <div className="mt-2">
            <span
              className={cn(
                "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                profile?.role === "ADMIN"
                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
              )}
            >
              {profile?.role}
            </span>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-900"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign out
        </Button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="sm"
        className="md:hidden fixed top-4 left-4 z-50"
        onClick={() => setIsMobileOpen(true)}
      >
        <Menu className="h-4 w-4" />
      </Button>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-white dark:bg-gray-800 border-r">
        <SidebarContent />
      </div>

      {/* Mobile sidebar */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsMobileOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 border-r">
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  )
}
