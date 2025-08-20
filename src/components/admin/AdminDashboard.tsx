import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Package, Users, ShoppingCart, TrendingUp, Plus, Tag, Shield } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { ProductManager } from './ProductManager'
import { OrderManager } from './OrderManager'
import { StatsOverview } from './StatsOverview'
import { CategoryManager } from './CategoryManager'
import { CreateAdminForm } from './CreateAdminForm'

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'categories' | 'admin'>('overview')
  const { profile, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-pink-600 font-medium">Cargando...</p>
        </div>
      </div>
    )
  }

  if (profile?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Acceso Denegado</h1>
          <p className="text-gray-600 mb-6">No tienes permisos para acceder a esta página.</p>
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'overview', label: 'Resumen', icon: TrendingUp },
    { id: 'products', label: 'Productos', icon: Package },
    { id: 'orders', label: 'Pedidos', icon: ShoppingCart },
    { id: 'categories', label: 'Categorías', icon: Tag },
    { id: 'admin', label: 'Administradores', icon: Shield }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
            Panel de Administración
          </h1>
          <p className="text-gray-600 mt-2">Gestiona tu tienda y pedidos</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-4 mb-8">
          {tabs.map(tab => {
            const Icon = tab.icon
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-pink-100 text-pink-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon size={20} />
                <span className="font-medium">{tab.label}</span>
              </motion.button>
            )
          })}
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && <StatsOverview />}
          {activeTab === 'products' && <ProductManager />}
          {activeTab === 'orders' && <OrderManager />}
          {activeTab === 'categories' && <CategoryManager />}
          {activeTab === 'admin' && <CreateAdminForm />}
        </motion.div>
      </div>
    </div>
  )
}
