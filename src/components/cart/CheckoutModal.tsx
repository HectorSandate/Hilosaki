import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, User, Phone, MessageCircle, Truck, Package } from 'lucide-react'
import { CartItem, supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import toast from 'react-hot-toast'

interface CheckoutModalProps {
  cartItems: CartItem[]
  total: number
  onClose: () => void
  onSuccess: () => void
}

// Función simplificada para crear pedidos
const createOrder = async (orderData: any) => {
  try {
    console.log('Creating order with data:', orderData)
    
    // La base de datos automáticamente generará el order_number con el trigger
    // NO incluimos order_number en los datos
    const { data: order, error } = await supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      throw error
    }

    console.log('Order created successfully:', order)
    return order
  } catch (error) {
    console.error('Error in createOrder:', error)
    throw error
  }
}

export function CheckoutModal({ cartItems, total, onClose, onSuccess }: CheckoutModalProps) {
  const [loading, setLoading] = useState(false)
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery')
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    notes: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { user } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    const newErrors: Record<string, string> = {}
    if (!formData.customerName.trim()) newErrors.customerName = 'El nombre es requerido'
    if (!formData.customerPhone.trim()) newErrors.customerPhone = 'El teléfono es requerido'
    if (deliveryType === 'delivery' && !formData.customerAddress.trim()) {
      newErrors.customerAddress = 'La dirección es requerida para entrega'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    try {
      console.log('Starting order creation process...')
      
      // Crear pedido SIN order_number (el trigger lo generará automáticamente)
      const orderData = {
        user_id: user?.id,
        customer_name: formData.customerName,
        customer_phone: formData.customerPhone,
        customer_address: deliveryType === 'delivery' ? formData.customerAddress : null,
        delivery_type: deliveryType,
        total_amount: total,
        notes: formData.notes || null,
        status: 'pending'
        // NO incluimos order_number - lo genera el trigger automáticamente
      }

      const order = await createOrder(orderData)

      // Crear items del pedido
      const orderItems = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.product?.price || 0,
        total_price: (item.product?.price || 0) * item.quantity
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) {
        console.error('Error creating order items:', itemsError)
        toast.error('Error al procesar los productos')
        return
      }

      // Limpiar carrito
      const { error: clearCartError } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user?.id)

      if (clearCartError) {
        console.error('Error clearing cart:', clearCartError)
      }

      // Enviar notificación por email (opcional)
      try {
        await fetch('/api/send-order-notification', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            order,
            items: cartItems,
            deliveryType
          })
        })
      } catch (err) {
        console.error('Email notification failed:', err)
      }

      toast.success('¡Pedido creado exitosamente!')
      onSuccess()
      
    } catch (error) {
      console.error('Error creating order:', error)
      
      // Mensajes de error más específicos
      if (error?.code === '23505') {
        toast.error('Error de duplicación en la base de datos. Por favor, intenta nuevamente.')
      } else if (error?.code === '42501') {
        toast.error('No tienes permisos para crear pedidos. Verifica tu sesión.')
      } else if (error?.message?.includes('network') || error?.message?.includes('fetch')) {
        toast.error('Error de conexión. Verifica tu internet e intenta nuevamente.')
      } else if (error?.message?.includes('JWT')) {
        toast.error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.')
      } else {
        toast.error('Error inesperado. Por favor, intenta nuevamente o contacta al soporte.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors(prev => ({
        ...prev,
        [e.target.name]: ''
      }))
    }
  }

  return (
    <Modal isOpen={true} onClose={onClose} title="Finalizar Pedido" maxWidth="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Delivery Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Método de Entrega
          </label>
          <div className="grid grid-cols-2 gap-3">
            <motion.button
              type="button"
              onClick={() => setDeliveryType('delivery')}
              className={`p-3 sm:p-4 rounded-lg border-2 transition-all ${
                deliveryType === 'delivery'
                  ? 'border-pink-400 bg-pink-50 text-pink-700'
                  : 'border-gray-200 hover:border-pink-200'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Truck size={20} className="sm:w-6 sm:h-6 mx-auto mb-2" />
              <span className="text-xs sm:text-sm font-medium">Entrega a Domicilio</span>
            </motion.button>
            
            <motion.button
              type="button"
              onClick={() => setDeliveryType('pickup')}
              className={`p-3 sm:p-4 rounded-lg border-2 transition-all ${
                deliveryType === 'pickup'
                  ? 'border-pink-400 bg-pink-50 text-pink-700'
                  : 'border-gray-200 hover:border-pink-200'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Package size={20} className="sm:w-6 sm:h-6 mx-auto mb-2" />
              <span className="text-xs sm:text-sm font-medium">Recoger en Persona</span>
            </motion.button>
          </div>
        </div>

        {/* Customer Information */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nombre Completo"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              error={errors.customerName}
              required
            />
            
            <Input
              label="Teléfono"
              name="customerPhone"
              value={formData.customerPhone}
              onChange={handleChange}
              error={errors.customerPhone}
              required
            />
          </div>

          {deliveryType === 'delivery' && (
            <Input
              label="Dirección de Entrega"
              name="customerAddress"
              value={formData.customerAddress}
              onChange={handleChange}
              error={errors.customerAddress}
              required
            />
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notas Adicionales (Opcional)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 transition-colors"
              placeholder="Instrucciones especiales, preferencias, etc."
            />
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-pink-50 rounded-lg p-4">
          <h3 className="font-semibold text-base sm:text-lg text-gray-900 mb-3">Resumen del Pedido</h3>
          <div className="space-y-2">
            {cartItems.map(item => (
              <div key={item.id} className="flex justify-between text-xs sm:text-sm">
                <span>{item.product?.name} x{item.quantity}</span>
                <span>${((item.product?.price || 0) * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t border-pink-200 pt-2 mt-2">
              <div className="flex justify-between font-semibold text-sm sm:text-base">
                <span>Total</span>
                <span className="text-pink-600">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1 w-full"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="flex-1 w-full"
          >
            {loading ? 'Procesando...' : 'Confirmar Pedido'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}