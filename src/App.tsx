import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuth } from './hooks/useAuth'
import { Header } from './components/layout/Header'
import { ProductGrid } from './components/products/ProductGrid'
import { AdminDashboard } from './components/admin/AdminDashboard'
import { AuthForm } from './components/auth/AuthForm'
import { CreateAdminForm } from './components/admin/CreateAdminForm'
import { ServiceGrid } from './components/services/ServiceGrid'

function App() {
  const { user, profile, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-pink-600 font-medium">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50">
        <Header />
        
        <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/servicios" element={<ServicesPage />} />
            <Route 
              path="/admin" 
              element={
                profile?.role === 'admin' ? (
                  <AdminDashboard />
                ) : (
                  <Navigate to="/" replace />
                )
              } 
            />
            <Route path="/auth" element={<AuthForm />} />
            <Route path="/create-admin" element={<CreateAdminForm />} />
          </Routes>
        </main>
        
        <Toaster
          position="top-right"
          toastOptions={{
            className: 'bg-white text-gray-900',
            duration: 4000,
            style: {
              background: '#fff',
              color: '#374151',
              borderRadius: '12px',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
            },
          }}
        />
      </div>
    </BrowserRouter>
  )
}

function ServicesPage() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-25 to-rose-50">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3985163/pexels-photo-3985163.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop')] bg-cover bg-center opacity-20"></div>
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light text-gray-900 mb-6 tracking-tight">
            Servicios
          </h1>
          <p className="text-xl sm:text-2xl text-gray-700 font-light mb-8 max-w-2xl mx-auto leading-relaxed">
            Experiencias personalizadas para tu bienestar y belleza
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="max-w-7xl mx-auto px-4">
        <ServiceGrid />
      </section>
    </div>
  )
}

function HomePage() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-rose-50 via-pink-25 to-purple-50">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3762800/pexels-photo-3762800.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop')] bg-cover bg-center opacity-20"></div>
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light text-gray-900 mb-6 tracking-tight">
            Hilosaki
          </h1>
          <p className="text-xl sm:text-2xl text-gray-700 font-light mb-8 max-w-2xl mx-auto leading-relaxed">
            Curated beauty and wellness for the modern woman
          </p>

<div className="flex flex-col sm:flex-row gap-4 justify-center">
  <button 
    className="px-8 py-3 bg-black text-white font-medium tracking-wide hover:bg-gray-800 transition-colors"
    onClick={() => {
      const productsSection = document.getElementById('productos-section')
      productsSection?.scrollIntoView({ behavior: 'smooth' })
    }}
  >
    EXPLORAR PRODUCTOS
  </button>
  <button 
    className="px-8 py-3 border border-black text-black font-medium tracking-wide hover:bg-black hover:text-white transition-colors"
    onClick={() => window.location.href = '/servicios'}
  >
    VER SERVICIOS
  </button>
</div>
        
          
        </div>
      </section>

      {/* Featured Collections */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <div className="relative group cursor-pointer">
            <div className="aspect-[4/3] bg-gradient-to-br from-pink-100 to-rose-100 overflow-hidden">
              <img 
                src="https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop"
                alt="Beauty Collection"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="text-center text-white">
                <h3 className="text-3xl font-light mb-2">BEAUTY</h3>
                <p className="text-lg">Productos de belleza premium</p>
              </div>
            </div>
          </div>
          
          <div className="relative group cursor-pointer">
            <div className="aspect-[4/3] bg-gradient-to-br from-purple-100 to-pink-100 overflow-hidden">
              <img 
                src="https://images.pexels.com/photos/3985163/pexels-photo-3985163.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop"
                alt="Wellness Collection"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="text-center text-white">
                <h3 className="text-3xl font-light mb-2">WELLNESS</h3>
                <p className="text-lg">Servicios de bienestar</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="productos-section" className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-light text-gray-900 mb-4 tracking-tight">
            Nuevos Productos
          </h2>
          <p className="text-lg text-gray-600 font-light">
            Recién llegados y listos para explorar
          </p>
        </div>
        <ProductGrid />
      </section>

      {/* Services Preview */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-light text-gray-900 mb-4 tracking-tight">
              Servicios Especiales
            </h2>
            <p className="text-lg text-gray-600 font-light mb-8">
              Experiencias personalizadas para tu bienestar
            </p>
            <a 
              href="/servicios"
              className="inline-block px-8 py-3 border border-black text-black font-medium tracking-wide hover:bg-black hover:text-white transition-colors"
            >
              VER TODOS LOS SERVICIOS
            </a>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-black text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-light mb-4 tracking-tight">
            Mantente Conectada
          </h2>
          <p className="text-lg font-light mb-8 opacity-90">
            Recibe las últimas novedades y ofertas exclusivas
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Tu email"
              className="flex-1 px-4 py-3 bg-transparent border border-white text-white placeholder-gray-300 focus:outline-none focus:border-pink-400"
            />
            <button className="px-8 py-3 bg-white text-black font-medium tracking-wide hover:bg-gray-100 transition-colors">
              SUSCRIBIRSE
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default App