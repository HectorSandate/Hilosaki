import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Package, MapPin, Phone, User, Calendar, DollarSign } from 'lucide-react'
import { supabase, Order } from '../../lib/supabase'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import toast from 'react-hot-toast'

export function OrderManager() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState<string>('all')

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            product:products(*)
          )
        `)
        .order('created_at', { ascending: false })

      if (error) {
        toast.error('Error al cargar pedidos')
      } else {
        setOrders(data || [])
      }
    } catch (error) {
      toast.error('Error al cargar pedidos')
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId)

      if (error) {
        toast.error('Error al actualizar estado del pedido')
        return
      }

      setOrders(prev => prev.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus as any }
          : order
      ))
      
      toast.success('Estado del pedido actualizado')
    } catch (error) {
      toast.error('Error al actualizar estado del pedido')
    }
  }

  const filteredOrders = selectedStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === selectedStatus)

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  }

  const statusLabels = {
    pending: 'Pendiente',
    processing: 'Procesando',
    completed: 'Completado',
    cancelled: 'Cancelado'
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse h-8 bg-gray-200 rounded w-48"></div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gestión de Pedidos</h2>
        
        <div className="flex space-x-2">
          {['all', 'pending', 'processing', 'completed', 'cancelled'].map(status => (
            <Button
              key={status}
              variant={selectedStatus === status ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSelectedStatus(status)}
            >
              {status === 'all' ? 'Todos' : statusLabels[status as keyof typeof statusLabels]}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Pedido #{order.order_number}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {new Date(order.created_at).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status]}`}>
                    {statusLabels[order.status]}
                  </span>
                  <span className="text-lg font-bold text-pink-600">
                    ${order.total_amount.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <User size={16} className="text-gray-500" />
                  <span className="text-sm text-gray-700">{order.customer_name}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Phone size={16} className="text-gray-500" />
                  <span className="text-sm text-gray-700">{order.customer_phone}</span>
                </div>
                
                {order.customer_address && (
                  <div className="flex items-center space-x-2">
                    <MapPin size={16} className="text-gray-500" />
                    <span className="text-sm text-gray-700">{order.customer_address}</span>
                  </div>
                )}
                
                <div className="flex items-center space-x-2">
                  <Package size={16} className="text-gray-500" />
                  <span className="text-sm text-gray-700 capitalize">
                    {order.delivery_type === 'delivery' ? 'Entrega a domicilio' : 'Recoger en persona'}
                  </span>
                </div>
              </div>

              {order.order_items && order.order_items.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Productos:</h4>
                  <div className="space-y-2">
                    {order.order_items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center text-sm">
                        <span className="text-gray-700">
                          {item.product?.name} x{item.quantity}
                        </span>
                        <span className="text-gray-900 font-medium">
                          ${item.total_price.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {order.notes && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Notas:</strong> {order.notes}
                  </p>
                </div>
              )}

              <div className="flex space-x-2">
                {order.status === 'pending' && (
                  <Button
                    size="sm"
                    onClick={() => updateOrderStatus(order.id, 'processing')}
                  >
                    Marcar como Procesando
                  </Button>
                )}
                
                {order.status === 'processing' && (
                  <Button
                    size="sm"
                    onClick={() => updateOrderStatus(order.id, 'completed')}
                  >
                    Marcar como Completado
                  </Button>
                )}
                
                {order.status !== 'cancelled' && order.status !== 'completed' && (
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => updateOrderStatus(order.id, 'cancelled')}
                  >
                    Cancelar Pedido
                  </Button>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <Package size={48} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No hay pedidos {selectedStatus !== 'all' && `con estado "${statusLabels[selectedStatus as keyof typeof statusLabels]}"`}
          </h3>
          <p className="text-gray-600">
            Los pedidos aparecerán aquí cuando los clientes realicen compras.
          </p>
        </div>
      )}
    </div>
  )
}