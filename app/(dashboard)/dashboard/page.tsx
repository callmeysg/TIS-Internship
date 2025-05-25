"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DollarSign, ShoppingCart, Package, AlertTriangle, TrendingUp, Eye, ArrowUpRight } from "lucide-react"
import Link from "next/link"
import type { DashboardStats } from "@/lib/types"

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const fetchStats = async () => {
      try {
        const response = await fetch("/api/dashboard/stats", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()

        if (mounted) {
          setStats(data)
          setError(null)
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error)
        if (mounted) {
          setError("Failed to load dashboard data")
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    fetchStats()

    return () => {
      mounted = false
    }
  }, [])

  if (loading) {
    return (
      <div className="flex flex-1 flex-col gap-8">
        <div className="flex flex-col gap-3">
          <div className="h-9 w-48 bg-muted/50 animate-pulse rounded-lg" />
          <div className="h-5 w-96 bg-muted/30 animate-pulse rounded-md" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="border-0 shadow-sm bg-gradient-to-br from-muted/20 to-muted/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <div className="h-4 w-24 bg-muted/50 animate-pulse rounded" />
                <div className="h-10 w-10 bg-muted/50 animate-pulse rounded-xl" />
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-8 w-16 bg-muted/50 animate-pulse rounded mb-2" />
                <div className="h-3 w-32 bg-muted/30 animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-1 flex-col gap-8">
        <div className="flex flex-col gap-3">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">Welcome back to your retail management system</p>
        </div>
        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-destructive/10 p-4 mb-4">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Error Loading Dashboard</h3>
            <p className="text-muted-foreground mb-6 text-center max-w-md">{error}</p>
            <Button onClick={() => window.location.reload()} className="bg-gradient-to-r from-primary to-primary/90">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-muted-foreground text-lg">Welcome back to your retail management system</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-emerald-50/80 via-green-50/50 to-teal-50/30 dark:from-emerald-950/20 dark:via-green-950/10 dark:to-teal-950/5 hover:shadow-md transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Today's Sales</CardTitle>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-sm">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold text-emerald-900 dark:text-emerald-100 mb-1">
              ${stats?.todaySales?.toFixed(2) || "0.00"}
            </div>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              Revenue from completed orders
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50/80 via-indigo-50/50 to-purple-50/30 dark:from-blue-950/20 dark:via-indigo-950/10 dark:to-purple-950/5 hover:shadow-md transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Orders</CardTitle>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm">
              <ShoppingCart className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold text-blue-900 dark:text-blue-100 mb-1">{stats?.totalOrders || 0}</div>
            <p className="text-xs text-blue-600 dark:text-blue-400">All time orders processed</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-violet-50/80 via-purple-50/50 to-fuchsia-50/30 dark:from-violet-950/20 dark:via-purple-950/10 dark:to-fuchsia-950/5 hover:shadow-md transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-violet-700 dark:text-violet-300">Total Items</CardTitle>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-sm">
              <Package className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold text-violet-900 dark:text-violet-100 mb-1">{stats?.totalItems || 0}</div>
            <p className="text-xs text-violet-600 dark:text-violet-400">Items in inventory</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-orange-50/80 via-red-50/50 to-pink-50/30 dark:from-orange-950/20 dark:via-red-950/10 dark:to-pink-950/5 hover:shadow-md transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">Low Stock Alert</CardTitle>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-sm">
              <AlertTriangle className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold text-orange-900 dark:text-orange-100 mb-1">
              {stats?.lowStockItems || 0}
            </div>
            <p className="text-xs text-orange-600 dark:text-orange-400">Items with stock {"<"} 10</p>
          </CardContent>
        </Card>
      </div>

      {/* Content Grid */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Recent Orders */}
        <Card className="border-0 shadow-sm bg-gradient-to-br from-background to-muted/20 hover:shadow-md transition-all duration-300">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-xl font-semibold">Recent Orders</CardTitle>
                <CardDescription className="text-muted-foreground">Latest orders from all users</CardDescription>
              </div>
              <Link href="/orders">
                <Button
                  variant="outline"
                  size="sm"
                  className="group hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View All
                  <ArrowUpRight className="h-3 w-3 ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {!stats?.recentOrders || stats.recentOrders.length === 0 ? (
              <div className="text-center py-12">
                <div className="rounded-full bg-muted/50 p-4 w-fit mx-auto mb-4">
                  <ShoppingCart className="h-8 w-8 text-muted-foreground/50" />
                </div>
                <p className="text-sm text-muted-foreground">No recent orders</p>
              </div>
            ) : (
              stats.recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 rounded-xl border bg-gradient-to-r from-background to-muted/10 hover:shadow-sm transition-all duration-200"
                >
                  <div className="space-y-1">
                    <p className="font-medium text-sm">{order.profile?.username || "Unknown User"}</p>
                    <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="font-semibold text-sm">${Number(order.totalAmount).toFixed(2)}</p>
                    <Badge variant={order.status === "COMPLETED" ? "default" : "secondary"} className="text-xs">
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Top Selling Items */}
        <Card className="border-0 shadow-sm bg-gradient-to-br from-background to-muted/20 hover:shadow-md transition-all duration-300">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-xl font-semibold">Top Selling Items</CardTitle>
                <CardDescription className="text-muted-foreground">Most popular items by quantity sold</CardDescription>
              </div>
              <Link href="/items">
                <Button
                  variant="outline"
                  size="sm"
                  className="group hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                >
                  <Package className="h-4 w-4 mr-2" />
                  Manage
                  <ArrowUpRight className="h-3 w-3 ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {!stats?.topSellingItems || stats.topSellingItems.length === 0 ? (
              <div className="text-center py-12">
                <div className="rounded-full bg-muted/50 p-4 w-fit mx-auto mb-4">
                  <Package className="h-8 w-8 text-muted-foreground/50" />
                </div>
                <p className="text-sm text-muted-foreground">No sales data available</p>
              </div>
            ) : (
              stats.topSellingItems.map((item: any, index) => (
                <div
                  key={item.item.id}
                  className="flex items-center justify-between p-4 rounded-xl border bg-gradient-to-r from-background to-muted/10 hover:shadow-sm transition-all duration-200"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">#{index + 1}</span>
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium text-sm">{item.item.name}</p>
                      <p className="text-xs text-muted-foreground">${Number(item.item.price).toFixed(2)}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs bg-gradient-to-r from-background to-muted/20">
                    {item.totalSold} sold
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
