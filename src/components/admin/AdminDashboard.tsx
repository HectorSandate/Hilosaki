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
        <div className="flex flex-wrap gap-2 sm:gap-4 mb-8 overflow-x-auto pb-2">
          {tabs.map(tab => {
            const Icon = tab.icon
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-pink-100 text-pink-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon size={18} className="sm:w-5 sm:h-5" />
                <span className="font-medium text-sm sm:text-base">{tab.label}</span>
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