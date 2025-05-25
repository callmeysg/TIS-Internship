"use client"

import { useCartStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import { Menu } from "lucide-react"

export function Header() {
  const { getTotalItems } = useCartStore()
  const totalItems = getTotalItems()

  return (
    <header className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => {
              // This will be handled by the sidebar component
            }}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="hidden md:block">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Dashboard</h2>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Link href="/checkout">
            <Button
              variant="outline"
              size="sm"
              className="relative border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-900"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Cart</span>
              {totalItems > 0 && (
                <div className="absolute -top-2 -right-2 h-5 w-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-medium">
                  {totalItems}
                </div>
              )}
            </Button>
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
