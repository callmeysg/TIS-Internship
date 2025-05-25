"use client"

import type * as React from "react"
import { useEffect, useState, useCallback } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { createClientComponentClient } from "@/lib/supabase"
import type { Profile } from "@/lib/types"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  FolderOpen,
  Store,
  LogOut,
  ChevronUp,
  Sparkles,
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["ADMIN", "CASHIER"] },
  { name: "Explore Items", href: "/explore", icon: Store, roles: ["ADMIN", "CASHIER"] },
  { name: "Orders", href: "/orders", icon: ShoppingCart, roles: ["ADMIN", "CASHIER"] },
  { name: "Categories", href: "/categories", icon: FolderOpen, roles: ["ADMIN"] },
  { name: "Items", href: "/items", icon: Package, roles: ["ADMIN"] },
  { name: "Users", href: "/users", icon: Users, roles: ["ADMIN"] },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const pathname = usePathname()
  const supabase = createClientComponentClient()

  useEffect(() => {
    let mounted = true

    const getProfile = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (user && mounted) {
          const { data: profile, error } = await supabase.from("profiles").select("*").eq("userId", user.id).single()

          if (!error && profile && mounted) {
            setProfile(profile)
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    getProfile()

    return () => {
      mounted = false
    }
  }, [supabase])

  const handleSignOut = useCallback(async () => {
    try {
      await supabase.auth.signOut()
      window.location.href = "/login"
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }, [supabase])

  const filteredNavigation = profile?.role ? navigation.filter((item) => item.roles.includes(profile.role)) : []

  if (loading) {
    return (
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <div className="h-14 bg-muted/30 animate-pulse rounded-lg" />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {[...Array(6)].map((_, i) => (
                  <SidebarMenuItem key={i}>
                    <div className="h-10 bg-muted/30 animate-pulse rounded-lg" />
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    )
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="hover:bg-sidebar-accent/50 transition-colors duration-200">
              <Link href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-sm">
                  <Sparkles className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    Retail
                  </span>
                  <span className="truncate text-xs text-muted-foreground">Management System</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredNavigation.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    className="hover:bg-sidebar-accent/50 transition-all duration-200 group"
                  >
                    <Link href={item.href}>
                      <item.icon className="transition-transform duration-200 group-hover:scale-110" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-sidebar-accent/50 transition-all duration-200"
                >
                  <Avatar className="h-8 w-8 rounded-xl border-2 border-background shadow-sm">
                    <AvatarFallback className="rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold">
                      {profile?.username?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{profile?.username || "User"}</span>
                    <span className="truncate text-xs text-muted-foreground">{profile?.email || ""}</span>
                  </div>
                  <ChevronUp className="ml-auto size-4 transition-transform duration-200" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-xl border-0 shadow-lg bg-background/95 backdrop-blur-sm"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <div className="p-3">
                  <div className="flex items-center gap-3 px-1 py-2 text-left text-sm">
                    <Avatar className="h-10 w-10 rounded-xl border-2 border-background shadow-sm">
                      <AvatarFallback className="rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold">
                        {profile?.username?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{profile?.username || "User"}</span>
                      <span className="truncate text-xs text-muted-foreground">{profile?.email || ""}</span>
                    </div>
                  </div>
                  <div className="px-1 py-1">
                    <Badge
                      variant={profile?.role === "ADMIN" ? "default" : "secondary"}
                      className="text-xs bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20"
                    >
                      {profile?.role || "USER"}
                    </Badge>
                  </div>
                </div>
                <DropdownMenuSeparator className="bg-border/50" />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
