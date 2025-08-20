import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, UserPlus } from 'lucide-react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Card } from '../ui/Card'
import { createAdminUser } from '../../utils/createAdmin'
import toast from 'react-hot-toast'

export function CreateAdminForm() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await createAdminUser(
        formData.email,
        formData.password,
        formData.fullName
      )

      if (error) {
        toast.error('Error al crear administrador: ' + error.message)
      } else {
        toast.success('¡Administrador creado exitosamente!')
        setFormData({ email: '', password: '', fullName: '' })
      }
    } catch (error) {
      toast.error('Error inesperado al crear administrador')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <Card className="max-w-md mx-auto p-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield size={32} className="text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Crear Administrador</h2>
        <p className="text-gray-600 mt-2">Solo para configuración inicial</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nombre Completo"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          required
        />
        
        <Input
          label="Correo Electrónico"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        
        <Input
          label="Contraseña"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
          minLength={6}
        />

        <Button
          type="submit"
          className="w-full flex items-center justify-center space-x-2"
          disabled={loading}
        >
          <UserPlus size={20} />
          <span>{loading ? 'Creando...' : 'Crear Administrador'}</span>
        </Button>
      </form>
    </Card>
  )
}