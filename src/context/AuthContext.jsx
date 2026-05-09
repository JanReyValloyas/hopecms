import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        const userData = await loadUserRow(session.user.id)
        if (userData && userData.record_status === 'ACTIVE') {
          setCurrentUser({
            ...session.user,
            username: userData.username,
            user_type: userData.user_type,
            record_status: userData.record_status
          })
        } else if (userData && userData.record_status === 'INACTIVE') {
          await supabase.auth.signOut()
          setCurrentUser(null)
        } else {
          setCurrentUser(session.user)
        }
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT') {
          setCurrentUser(null)
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  async function loadUserRow(userId) {
    try {
      const { data, error } = await supabase
        .from('user')
        .select('userid, username, user_type, record_status')
        .eq('userid', userId)
        .maybeSingle()
      if (error) return null
      return data
    } catch {
      return null
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setCurrentUser(null)
  }

  return (
    <AuthContext.Provider value={{ currentUser, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)