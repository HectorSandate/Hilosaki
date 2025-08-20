import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase, Product } from '../../lib/supabase'
import { ServiceCard } from './ServiceCard'
import { AddToCartModal } from '../cart/AddToCartModal'
import toast from 'react-hot-toast'

export function ServiceGrid() {
  const [services, setServices] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedService, setSelectedService] = useState<Product | null>(null)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(*)
        `)
        .eq('is_active', true)
        .eq('is_service', true)
        .is('deleted_at', null)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching services:', error)
        toast.error('Error al cargar servicios')
      } else {
        setServices(data || [])
      }
    } catch (error) {
      console.error('Error fetching services:', error)
      toast.error('Error al cargar servicios')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = (service: Product) => {
    setSelectedService(service)
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 aspect-[4/3] rounded-3xl mb-6"></div>
            <div className="h-6 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full mb-3"></div>
            <div className="h-4 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full w-3/4"></div>
          </div>
        ))}
      </div>
    )
  }

  if (services.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-6">💫</div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Próximamente servicios increíbles</h3>
        <p className="text-gray-600 text-lg max-w-md mx-auto">
          Estamos preparando servicios únicos y especiales para ti. ¡Mantente atenta!
        </p>
      </div>
    )
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {services.map((service, index) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <ServiceCard service={service} onAddToCart={handleAddToCart} />
          </motion.div>
        ))}
      </motion.div>

      {selectedService && (
        <AddToCartModal
          product={selectedService}
          onClose={() => setSelectedService(null)}
        />
      )}
    </>
  )
}