import React from 'react'
import { motion } from 'framer-motion'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
}

export function Card({ children, className = '', hover = false }: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -8, boxShadow: '0 25px 50px rgba(236, 72, 153, 0.15)' } : {}}
      className={`bg-white rounded-3xl shadow-xl border border-pink-100/50 backdrop-blur-sm ${className}`}
    >
      {children}
    </motion.div>
  )
}