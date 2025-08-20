import React from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Heart, Calendar } from 'lucide-react'
import { Product } from '../../lib/supabase'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'

interface ServiceCardProps {
  service: Product
  onAddToCart: (service: Product) => void
}

export function ServiceCard({ service, onAddToCart }: ServiceCardProps) {
  return (
    <div className="group cursor-pointer">
      <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden mb-4">
        {service.image_url ? (
          <img
            src={service.image_url}
            alt={service.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Sparkles size={48} className="text-gray-400" />
          </div>
        )}
        
        <button
          className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm hover:bg-white transition-colors"
        >
          <Heart size={16} className="text-gray-600" />
        </button>
      </div>

      <div className="space-y-2">
        <h3 className="font-light text-lg text-gray-900 group-hover:text-purple-600 transition-colors">
          {service.name}
        </h3>
        
        {service.description && (
          <p className="text-sm text-gray-600 line-clamp-2">{service.description}</p>
        )}
        
        <div className="flex items-center justify-between pt-2">
          <span className="text-lg font-light text-gray-900">
            ${service.price.toFixed(2)}
          </span>
          <button
            onClick={() => onAddToCart(service)}
            className="text-sm font-medium text-black hover:text-purple-600 transition-colors tracking-wide"
          >
            RESERVAR
          </button>
        </div>
      </div>
    </div>
  )
}