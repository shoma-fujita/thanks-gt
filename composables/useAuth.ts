// composables/useAuth.ts
import { supabase } from '@/utils/supabase'

export const useAuth = () => {
  const user = useState('user', () => null)

  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    })

    if (error) console.error('Google Auth Error:', error)
    return data
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    user.value = null
  }

  return { user, signInWithGoogle, signOut }
}
