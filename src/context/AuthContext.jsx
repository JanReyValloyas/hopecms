import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        // Try to load user data with timeout
        const userRow = await Promise.race([
          loadUserRow(session.user.id),
          new Promise(resolve => setTimeout(() => resolve(null), 3000))
        ])

        if (userRow) {
          setCurrentUser({
            ...session.user,
            username: userRow.username,
            user_type: userRow.user_type,
            record_status: userRow.record_status
          })
        } else {
          // Timeout — just use session user
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
      const { data } = await supabase
        .from('user')
        .select('userid, username, user_type, record_status')
        .eq('userid', userId)
        .single()
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