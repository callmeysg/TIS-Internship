"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useCartStore } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react"
import Image from "next/image"

export default function CheckoutPage() {
  const [isProcessing, setIsProcessing] = useState(false)
  const { items, updateQuantity, removeItem, clearCart, getTotalAmount } = useCartStore()
  const { toast } = useToast()
  const router = useRouter()

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId)
    } else {
      updateQuantity(itemId, newQuantity)
    }
  }

  const handleCheckout = async () => {
    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before checking out.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      const orderData = {
        items: items.map((cartItem) => ({
          itemId: cartItem.item.id,
          quantity: cartItem.quantity,
          price: cartItem.item.price,
        })),
      }

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      })

      if (response.ok) {
        const order = await response.json()
        clearCart()
        toast({
          title: "Order completed!",
          description: `Order #${order.id.slice(-8)} has been processed successfully.`,
        })
        router.push("/orders")
      } else {
        const error = await response.json()
        toast({
          title: "Order failed",
          description: error.error || "Failed to process order",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Order failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Checkout</h1>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
            <p className="text-muted-foreground mb-4">Add some items to get started</p>
            <Button onClick={() => router.push("/explore")}>Browse Items</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Checkout</h1>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Cart Items</CardTitle>
              <CardDescription>Review your items before checkout</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {items.map((cartItem) => (
                  <div key={cartItem.item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="relative h-16 w-16 flex-shrink-0">
                      <Image
                        src={cartItem.item.imageUrl || "/placeholder.svg?height=64&width=64"}
                        alt={cartItem.item.name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>

                    <div className="flex-1">
                      <h4 className="font-semibold">{cartItem.item.name}</h4>
                      <p className="text-sm text-muted-foreground">${Number(cartItem.item.price).toFixed(2)} each</p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(cartItem.item.id, cartItem.quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        value={cartItem.quantity}
                        onChange={(e) => handleQuantityChange(cartItem.item.id, Number.parseInt(e.target.value) || 0)}
                        className="w-20 text-center"
                        min="0"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(cartItem.item.id, cartItem.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold">${(Number(cartItem.item.price) * cartItem.quantity).toFixed(2)}</p>
                    </div>

                    <Button variant="outline" size="sm" onClick={() => removeItem(cartItem.item.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {items.map((cartItem) => (
                  <div key={cartItem.item.id} className="flex justify-between text-sm">
                    <span>
                      {cartItem.item.name} × {cartItem.quantity}
                    </span>
                    <span>${(Number(cartItem.item.price) * cartItem.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>${getTotalAmount().toFixed(2)}</span>
              </div>

              <Button onClick={handleCheckout} disabled={isProcessing} className="w-full" size="lg">
                {isProcessing ? "Processing..." : "Complete Order"}
              </Button>

              <Button variant="outline" onClick={clearCart} className="w-full">
                Clear Cart
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
