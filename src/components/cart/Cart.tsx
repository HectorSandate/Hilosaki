import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'
import { supabase, CartItem } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../ui/Button'
import { CheckoutModal } from './CheckoutModal'
import toast from 'react-hot-toast'

interface CartProps {
  onClose: () => void
}

export function Cart({ onClose }: CartProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showCheckout, setShowCheckout] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchCartItems()
    }
  }, [user])

  const fetchCartItems = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          product:products(*)
        `)
        .eq('user_id', user.id)

      if (error) {
        toast.error('Error al cargar el carrito')
      } else {
        setCartItems(data || [])
      }
    } catch (error) {
      toast.error('Error al cargar el carrito')
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      await removeItem(itemId)
      return
    }

    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity: newQuantity })
        .eq('id', itemId)

      if (error) {
        toast.error('Error al actualizar cantidad')
      } else {
        setCartItems(prev => prev.map(item => 
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        ))
      }
    } catch (error) {
      toast.error('Error al actualizar cantidad')
    }
  }

  const removeItem = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId)

      if (error) {
        toast.error('Error al eliminar producto')
      } else {
        setCartItems(prev => prev.filter(item => item.id !== itemId))
        toast.success('Producto eliminado del carrito')
      }
    } catch (error) {
      toast.error('Error al eliminar producto')
    }
  }

  const total = cartItems.reduce((sum, item) => 
    sum + (item.product?.price || 0) * item.quantity, 0
  )

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse flex space-x-4">
            <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingBag size={48} className="text-pink-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Tu carrito está vacío</h3>
        <p className="text-gray-600 mb-4">Agrega algunos productos hermosos a tu carrito</p>
        <Button onClick={onClose}>Continuar Comprando</Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="max-h-96 overflow-y-auto space-y-4">
        {cartItems.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-2 sm:space-x-4 p-3 sm:p-4 bg-pink-50 rounded-lg"
          >
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-pink-100 to-rose-100 rounded-lg flex items-center justify-center overflow-hidden">
              {item.product?.image_url ? (
                <img
                  src={item.product.image_url}
                  alt={item.product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <ShoppingBag size={20} className="sm:w-6 sm:h-6 text-pink-400" />
              )}
            </div>

            <div className="flex-1">
              <h4 className="font-semibold text-sm sm:text-base text-gray-900">{item.product?.name}</h4>
              <p className="text-pink-600 font-bold text-sm sm:text-base">${item.product?.price.toFixed(2)}</p>
            </div>

            <div className="flex items-center space-x-1 sm:space-x-2">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="p-1 sm:p-2 hover:bg-white rounded-full transition-colors"
              >
                <Minus size={14} className="sm:w-4 sm:h-4 text-gray-600" />
              </button>
              
              <span className="w-6 sm:w-8 text-center font-semibold text-sm sm:text-base">{item.quantity}</span>
              
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="p-1 sm:p-2 hover:bg-white rounded-full transition-colors"
              >
                <Plus size={14} className="sm:w-4 sm:h-4 text-gray-600" />
              </button>
            </div>

            <button
              onClick={() => removeItem(item.id)}
              className="p-1 sm:p-2 hover:bg-red-50 rounded-full transition-colors"
            >
              <Trash2 size={14} className="sm:w-4 sm:h-4 text-red-500" />
            </button>
          </motion.div>
        ))}
      </div>

      <div className="border-t border-pink-200 pt-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-base sm:text-lg font-semibold text-gray-900">Total:</span>
          <span className="text-xl sm:text-2xl font-bold text-pink-600">${total.toFixed(2)}</span>
        </div>

        <Button
          onClick={() => setShowCheckout(true)}
          className="w-full"
          size={window.innerWidth < 640 ? "md" : "lg"}
        >
          Proceder al Checkout
        </Button>
      </div>

      {showCheckout && (
        <CheckoutModal
          cartItems={cartItems}
          total={total}
          onClose={() => setShowCheckout(false)}
          onSuccess={() => {
            setShowCheckout(false)
            onClose()
            setCartItems([])
          }}
        />
      )}
    </div>
  )
}