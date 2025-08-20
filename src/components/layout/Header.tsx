import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ShoppingBag, User, LogOut, Settings, Sparkles, Home } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useCartCount } from '../../hooks/useCartCount'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'
import { AuthForm } from '../auth/AuthForm'
import { Cart } from '../cart/Cart'

export function Header() {
  const { user, profile, signOut, isAdmin } = useAuth()
  const cartCount = useCartCount()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showCart, setShowCart] = useState(false)

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-lg border-b border-pink-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <div className="flex items-center">
            <motion.h1 
              className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 bg-clip-text text-transparent cursor-pointer"
              whileHover={{ scale: 1.05 }}
              onClick={() => window.location.href = '/'}
            >
              ✨ Hilosaki
            </motion.h1>
          </div>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <motion.a
              onClick={() => window.location.pathname = '/'}
              className="flex items-center space-x-2 text-gray-600 hover:text-pink-600 transition-colors font-medium"
              whileHover={{ scale: 1.05 }}
            >
              <Home size={18} />
              <span>Inicio</span>
            </motion.a>
            <motion.a
              onClick={() => window.location.pathname = '/servicios'}
              className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors font-medium"
              whileHover={{ scale: 1.05 }}
            >
              <Sparkles size={18} />
              <span>Servicios</span>
            </motion.a>
          </nav>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            {user ? (
              <>
                <Button
                  variant="outline"
                  size={window.innerWidth < 640 ? "sm" : "sm"}
                  onClick={() => setShowCart(true)}
                  className="flex items-center space-x-1 sm:space-x-2 hover:bg-pink-50 border-pink-200 text-xs sm:text-sm relative"
                >
                  <ShoppingBag size={16} className="sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Carrito</span>
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                      {cartCount > 99 ? '99+' : cartCount}
                    </span>
                  )}
                </Button>

                {isAdmin && (
                  <Button
                    variant="secondary"
                    size={window.innerWidth < 640 ? "sm" : "sm"}
                    onClick={() => window.location.pathname = '/admin'}
                    className="flex items-center space-x-1 sm:space-x-2"
                  >
                    <Settings size={16} className="sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">Admin</span>
                  </Button>
                )}

                <div className="flex items-center space-x-1 sm:space-x-3">
                  <span className="hidden md:block text-sm text-gray-600 font-medium">
                    Hola, {profile?.full_name || profile?.email}
                  </span>
                  <Button
                    variant="outline"
                    size={window.innerWidth < 640 ? "sm" : "sm"}
                    onClick={handleSignOut}
                    className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm"
                  >
                    <LogOut size={16} className="sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Salir</span>
                  </Button>
                </div>
              </>
            ) : (
              <Button
                onClick={() => setShowAuthModal(true)}
                className="flex items-center space-x-1 sm:space-x-2 bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-xs sm:text-sm px-3 sm:px-4"
              >
                <User size={16} className="sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Iniciar Sesión</span>
                <span className="sm:hidden">Login</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        maxWidth="md"
      >
        <AuthForm onSuccess={() => setShowAuthModal(false)} />
      </Modal>

      <Modal
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        title="Carrito de Compras"
        maxWidth="lg"
      >
        <Cart onClose={() => setShowCart(false)} />
      </Modal>
    </header>
  )
}