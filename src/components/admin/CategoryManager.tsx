import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Tag } from 'lucide-react'
import { supabase, Category } from '../../lib/supabase'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { Modal } from '../ui/Modal'
import { Input } from '../ui/Input'
import toast from 'react-hot-toast'

export function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<Category | null>(null)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name')

      if (error) {
        toast.error('Error al cargar categorías')
      } else {
        setCategories(data || [])
      }
    } catch (error) {
      toast.error('Error al cargar categorías')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setShowModal(true)
  }

  const handleDelete = (category: Category) => {
    setDeleteConfirm(category)
  }

  const confirmDelete = async () => {
    if (!deleteConfirm) return

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', deleteConfirm.id)

      if (error) {
        toast.error('Error al eliminar categoría')
        return
      }

      setCategories(prev => prev.filter(c => c.id !== deleteConfirm.id))
      toast.success('Categoría eliminada exitosamente')
    } catch (error) {
      toast.error('Error al eliminar categoría')
    } finally {
      setDeleteConfirm(null)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-4">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900">Categorías</h3>
        <Button
          onClick={() => {
            setEditingCategory(null)
            setShowModal(true)
          }}
          size="sm"
          className="flex items-center space-x-2"
        >
          <Plus size={16} />
          <span>Agregar Categoría</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-rose-400 rounded-lg flex items-center justify-center">
                    <Tag size={20} className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{category.name}</h4>
                    {category.description && (
                      <p className="text-sm text-gray-600">{category.description}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex space-x-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(category)}
                  >
                    <Edit size={14} />
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(category)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Category Form Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingCategory ? 'Editar Categoría' : 'Agregar Categoría'}
      >
        <CategoryForm
          category={editingCategory}
          onSubmit={() => {
            setShowModal(false)
            setEditingCategory(null)
            fetchCategories()
          }}
          onCancel={() => {
            setShowModal(false)
            setEditingCategory(null)
          }}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Confirmar Eliminación"
      >
        <div className="text-center">
          <p className="text-gray-600 mb-6">
            ¿Estás segura de que quieres eliminar la categoría "{deleteConfirm?.name}"?
          </p>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => setDeleteConfirm(null)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={confirmDelete}
              className="flex-1"
            >
              Eliminar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

interface CategoryFormProps {
  category?: Category | null
  onSubmit: () => void
  onCancel: () => void
}

function CategoryForm({ category, onSubmit, onCancel }: CategoryFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: category?.name || '',
    description: category?.description || ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (category) {
        // Update existing category
        const { error } = await supabase
          .from('categories')
          .update(formData)
          .eq('id', category.id)

        if (error) {
          toast.error('Error al actualizar categoría')
          return
        }
        
        toast.success('Categoría actualizada exitosamente')
      } else {
        // Create new category
        const { error } = await supabase
          .from('categories')
          .insert(formData)

        if (error) {
          toast.error('Error al crear categoría')
          return
        }
        
        toast.success('Categoría creada exitosamente')
      }

      onSubmit()
    } catch (error) {
      toast.error('Error al procesar la categoría')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Nombre de la Categoría"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descripción (Opcional)
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
          placeholder="Descripción de la categoría..."
        />
      </div>

      <div className="flex space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="flex-1"
        >
          {loading ? 'Guardando...' : (category ? 'Actualizar' : 'Crear')}
        </Button>
      </div>
    </form>
  )
}