import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export type UserRole = 'admin' | 'customer'
export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled'
export type DeliveryType = 'delivery' | 'pickup'

export interface Profile {
  id: string
  email: string
  full_name?: string
  phone?: string
  address?: string
  role: UserRole
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  description?: string
  created_at: string
}

export interface Product {
  id: string
  name: string
  description?: string
  price: number
  image_url?: string
  category_id?: string
  is_service: boolean
  is_active: boolean
  deleted_at?: string
  created_at: string
  updated_at: string
  category?: Category
}

export interface Order {
  id: string
  user_id: string
  order_number: string
  customer_name: string
  customer_phone: string
  customer_address?: string
  delivery_type: DeliveryType
  status: OrderStatus
  total_amount: number
  notes?: string
  created_at: string
  updated_at: string
  order_items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  unit_price: number
  total_price: number
  created_at: string
  product?: Product
}

export interface CartItem {
  id: string
  user_id: string
  product_id: string
  quantity: number
  created_at: string
  updated_at: string
  product?: Product
}