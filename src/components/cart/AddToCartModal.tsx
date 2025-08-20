import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ShoppingCart, Plus, Minus } from 'lucide-react'
import { Product, supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import toast from 'react-hot-toast'

interface AddToCartModalProps {
  product: Product
  onClose: () => void
}

export function AddToCartModal({ product, onClose }: AddToCartModalProps) {
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Debes iniciar sesión para agregar al carrito')
      return
    }

    setLoading(true)
    try {
      // Check if item already exists in cart
      const { data: existingItem } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_id', product.id)
        .maybeSingle()

      if (existingItem) {
        // Update quantity
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + quantity })
          .eq('id', existingItem.id)

        if (error) {
          toast.error('Error al actualizar el carrito')
          return
        }
      } else {
        // Create new cart item
        const { error } = await supabase
          .from('cart_items')
          .insert({
            user_id: user.id,
            product_id: product.id,
            quantity
          })

        if (error) {
          toast.error('Error al agregar al carrito')
          return
        }
      }

      toast.success('¡Producto agregado al carrito!')
      onClose()
    } catch (error) {
      toast.error('Error al agregar al carrito')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={true} onClose={onClose} title="Agregar al Carrito">
      <div className="text-center">
        <div className="mb-6">
          <div className="w-24 h-24 bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl mx-auto mb-4 flex items-center justify-center overflow-hidden">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <ShoppingCart size={32} className="text-pink-400" />
            )}
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
          <p className="text-pink-600 font-bold text-xl">${product.price.toFixed(2)}</p>
        </div>

        <div className="flex items-center justify-center space-x-4 mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
          >
            <Minus size={16} />
          </Button>
          
          <motion.span
            key={quantity}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className="text-xl font-semibold w-12 text-center"
          >
            {quantity}
          </motion.span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setQuantity(quantity + 1)}
          >
            <Plus size={16} />
          </Button>
        </div>

        <div className="mb-6">
          <p className="text-gray-600 mb-2">Total:</p>
          <p className="text-2xl font-bold text-pink-600">
            ${(product.price * quantity).toFixed(2)}
          </p>
        </div>

        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleAddToCart}
            disabled={loading}
            className="flex-1"
          >
            {loading ? 'Agregando...' : 'Agregar al Carrito'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}