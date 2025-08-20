import React from 'react'
import { motion } from 'framer-motion'
import { ShoppingCart, Heart } from 'lucide-react'
import { Product } from '../../lib/supabase'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <div className="group cursor-pointer">
      <div className="aspect-square bg-gray-100 relative overflow-hidden mb-4">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingCart size={48} className="text-gray-400" />
          </div>
        )}
        
        <button
          className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm hover:bg-white transition-colors"
        >
          <Heart size={16} className="text-gray-600" />
        </button>
      </div>

      <div className="space-y-2">
        <h3 className="font-light text-lg text-gray-900 group-hover:text-pink-600 transition-colors">
          {product.name}
        </h3>
        
        {product.description && (
          <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
        )}
        
        <div className="flex items-center justify-between pt-2">
          <span className="text-lg font-light text-gray-900">
            ${product.price.toFixed(2)}
          </span>
          <button
            onClick={() => onAddToCart(product)}
            className="text-sm font-medium text-black hover:text-pink-600 transition-colors tracking-wide"
          >
            AGREGAR
          </button>
        </div>
      </div>
    </div>
  )
}