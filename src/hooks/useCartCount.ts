import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'

export function useCartCount() {
  const [cartCount, setCartCount] = useState(0)
  const { user } = useAuth()

  useEffect(() => {
    if (!user) {
      setCartCount(0)
      return
    }

    fetchCartCount()

    // Subscribe to cart changes
    const subscription = supabase
      .channel('cart_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'cart_items',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          fetchCartCount()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [user])

  const fetchCartCount = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select('quantity')
        .eq('user_id', user.id)

      if (error) {
        console.error('Error fetching cart count:', error)
        return
      }

      const totalCount = data?.reduce((sum, item) => sum + item.quantity, 0) || 0
      setCartCount(totalCount)
    } catch (error) {
      console.error('Error fetching cart count:', error)
    }
  }

  return cartCount
}