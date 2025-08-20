import { supabase } from '../lib/supabase'

// Función para crear un usuario administrador
export async function createAdminUser(email: string, password: string, fullName: string) {
  try {
    // 1. Crear el usuario en Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName }
      }
    })

    if (authError) {
      console.error('Error creating auth user:', authError)
      return { error: authError }
    }

    if (!authData.user) {
      return { error: new Error('No user created') }
    }

    // 2. Crear el perfil con rol de admin
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          id: authData.user.id,
          email: authData.user.email!,
          full_name: fullName,
          role: 'admin'
        }
      ])
      .select()
      .single()

    if (profileError) {
      console.error('Error creating profile:', profileError)
      return { error: profileError }
    }

    return { data: { user: authData.user, profile: profileData } }
  } catch (error) {
    console.error('Error in createAdminUser:', error)
    return { error }
  }
}

// Función para promover un usuario existente a admin
export async function promoteToAdmin(userId: string) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({ role: 'admin' })
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      console.error('Error promoting user to admin:', error)
      return { error }
    }

    return { data }
  } catch (error) {
    console.error('Error in promoteToAdmin:', error)
    return { error }
  }
}