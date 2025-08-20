import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Package, ShoppingCart, DollarSign, Users } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { Card } from '../ui/Card'

interface Stats {
  totalOrders: number
  totalRevenue: number
  totalProducts: number
  pendingOrders: number
  completedOrders: number
}

export function StatsOverview() {
  const [stats, setStats] = useState<Stats>({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    pendingOrders: 0,
    completedOrders: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      // Get total orders and revenue
      const { data: orders } = await supabase
        .from('orders')
        .select('total_amount, status')

      // Get total products
      const { data: products } = await supabase
        .from('products')
        .select('id')
        .eq('is_active', true)
        .is('deleted_at', null)

      const totalOrders = orders?.length || 0
      const totalRevenue = orders?.filter(order => order.status === 'completed').reduce((sum, order) => sum + Number(order.total_amount), 0) || 0
      const totalProducts = products?.length || 0
      const pendingOrders = orders?.filter(order => order.status === 'pending').length || 0
      const completedOrders = orders?.filter(order => order.status === 'completed').length || 0

      setStats({
        totalOrders,
        totalRevenue,
        totalProducts,
        pendingOrders,
        completedOrders
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Total de Pedidos',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'from-blue-400 to-blue-600'
    },
    {
      title: 'Ingresos Totales',
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'from-green-400 to-green-600'
    },
    {
      title: 'Productos Activos',
      value: stats.totalProducts,
      icon: Package,
      color: 'from-purple-400 to-purple-600'
    },
    {
      title: 'Pedidos Pendientes',
      value: stats.pendingOrders,
      icon: TrendingUp,
      color: 'from-orange-400 to-orange-600'
    },
    {
      title: 'Pedidos Completados',
      value: stats.completedOrders,
      icon: Users,
      color: 'from-pink-400 to-pink-600'
    }
  ]

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {statCards.map((stat, index) => {
        const Icon = stat.icon
        return (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card hover className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color}`}>
                  <Icon size={24} className="text-white" />
                </div>
              </div>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}