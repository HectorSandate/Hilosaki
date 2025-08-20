import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react'
import { supabase, Product, Category } from '../../lib/supabase'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { Modal } from '../ui/Modal'
import { Input } from '../ui/Input'
import toast from 'react-hot-toast'

export function ProductManager() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<{ product: Product; permanent: boolean } | null>(null)

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(*)
        `)
        .order('created_at', { ascending: false })

      if (error) {
        toast.error('Error al cargar productos')
      } else {
        setProducts(data || [])
      }
    } catch (error) {
      toast.error('Error al cargar productos')
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name')

      if (error) {
        console.error('Error fetching categories:', error)
      } else {
        setCategories(data || [])
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setShowModal(true)
  }

  const handleDelete = (product: Product, permanent: boolean) => {
    setDeleteConfirm({ product, permanent })
  }

  const confirmDelete = async () => {
    if (!deleteConfirm) return

    try {
      const { product, permanent } = deleteConfirm
      
      if (permanent) {
        // Hard delete
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', product.id)

        if (error) {
          toast.error('Error al eliminar producto')
          return
        }
        
        setProducts(prev => prev.filter(p => p.id !== product.id))
        toast.success('Producto eliminado permanentemente')
      } else {
        // Soft delete
        const { error } = await supabase
          .from('products')
          .update({ 
            is_active: false,
            deleted_at: new Date().toISOString()
          })
          .eq('id', product.id)

        if (error) {
          toast.error('Error al deshabilitar producto')
          return
        }
        
        setProducts(prev => prev.map(p => 
          p.id === product.id 
            ? { ...p, is_active: false, deleted_at: new Date().toISOString() }
            : p
        ))
        toast.success('Producto deshabilitado')
      }
    } catch (error) {
      toast.error('Error al procesar eliminación')
    } finally {
      setDeleteConfirm(null)
    }
  }

  const toggleProductStatus = async (productId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ 
          is_active: !currentStatus,
          deleted_at: !currentStatus ? null : new Date().toISOString()
        })
        .eq('id', productId)

      if (error) {
        toast.error('Error al cambiar estado del producto')
        return
      }

      setProducts(prev => prev.map(p => 
        p.id === productId 
          ? { ...p, is_active: !currentStatus, deleted_at: !currentStatus ? null : new Date().toISOString() }
          : p
      ))
      
      toast.success(`Producto ${!currentStatus ? 'activado' : 'desactivado'}`)
    } catch (error) {
      toast.error('Error al cambiar estado del producto')
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse h-8 bg-gray-200 rounded w-48"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="p-6">
              <div className="animate-pulse">
                <div className="h-32 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gestión de Productos</h2>
        <Button
          onClick={() => {
            setEditingProduct(null)
            setShowModal(true)
          }}
          className="flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Agregar Producto</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className={`overflow-hidden ${!product.is_active ? 'opacity-60' : ''}`}>
              <div className="aspect-square bg-gradient-to-br from-pink-50 to-rose-50 relative">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-pink-300 text-sm">Sin imagen</span>
                  </div>
                )}
                
                <div className="absolute top-2 right-2 flex space-x-1">
                  <button
                    onClick={() => toggleProductStatus(product.id, product.is_active)}
                    className={`p-1 rounded-full ${
                      product.is_active 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {product.is_active ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{product.category?.name}</p>
                <p className="text-lg font-bold text-pink-600 mb-3">${product.price.toFixed(2)}</p>
                
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(product)}
                    className="flex-1"
                  >
                    <Edit size={14} />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(product, false)}
                    className="flex-1"
                  >
                    <EyeOff size={14} />
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(product, true)}
                    className="flex-1"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Product Form Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingProduct ? 'Editar Producto' : 'Agregar Producto'}
        maxWidth="lg"
      >
        <ProductForm
          product={editingProduct}
          categories={categories}
          onSubmit={() => {
            setShowModal(false)
            setEditingProduct(null)
            fetchProducts()
          }}
          onCancel={() => {
            setShowModal(false)
            setEditingProduct(null)
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
            {deleteConfirm?.permanent 
              ? '¿Estás segura de que quieres eliminar este producto permanentemente? Esta acción no se puede deshacer.'
              : '¿Estás segura de que quieres deshabilitar este producto? Podrás reactivarlo más tarde.'
            }
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
              {deleteConfirm?.permanent ? 'Eliminar Permanentemente' : 'Deshabilitar'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

interface ProductFormProps {
  product?: Product | null
  categories: Category[]
  onSubmit: () => void
  onCancel: () => void
}

function ProductForm({ product, categories, onSubmit, onCancel }: ProductFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || 0,
    image_url: product?.image_url || '',
    category_id: product?.category_id || '',
    is_service: product?.is_service || false
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (product) {
        // Update existing product
        const { error } = await supabase
          .from('products')
          .update(formData)
          .eq('id', product.id)

        if (error) {
          toast.error('Error al actualizar producto')
          return
        }
        
        toast.success('Producto actualizado exitosamente')
      } else {
        // Create new product
        const { error } = await supabase
          .from('products')
          .insert(formData)

        if (error) {
          toast.error('Error al crear producto')
          return
        }
        
        toast.success('Producto creado exitosamente')
      }

      onSubmit()
    } catch (error) {
      toast.error('Error al procesar el producto')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              type === 'number' ? parseFloat(value) || 0 : value
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Nombre del Producto"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Categoría
          </label>
          <select
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
          >
            <option value="">Seleccionar categoría</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descripción
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Precio"
          name="price"
          type="number"
          step="0.01"
          min="0"
          value={formData.price}
          onChange={handleChange}
          required
        />
        
        <Input
          label="URL de Imagen"
          name="image_url"
          value={formData.image_url}
          onChange={handleChange}
          placeholder="https://ejemplo.com/imagen.jpg"
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="is_service"
          name="is_service"
          checked={formData.is_service}
          onChange={handleChange}
          className="rounded border-pink-300 text-pink-600 focus:ring-pink-500 w-4 h-4"
        />
        <label htmlFor="is_service" className="text-sm font-medium text-gray-700">
          ✨ Es un servicio (aparecerá en la sección de servicios)
        </label>
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
          {loading ? 'Guardando...' : (product ? 'Actualizar' : 'Crear')}
        </Button>
      </div>
    </form>
  )
}