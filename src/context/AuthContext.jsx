import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          // Check if account is ACTIVE
          const { data: userRow } = await supabase
            .from('user')
            .select('record_status, user_type, username')
            .eq('userId', session.user.id)
            .single()

          if (userRow?.record_status !== 'ACTIVE') {
            await supabase.auth.signOut()
            setError('Your account is pending activation by a Sales Manager.')
            setCurrentUser(null)
          } else {
            setCurrentUser({ ...session.user, ...userRow })
            setError('')
          }
        } else {
          setCurrentUser(null)
        }
        setLoading(false)
      }
    )
    return () => subscription.unsubscribe()
  }, [])

  const signOut = () => supabase.auth.signOut()

  return (
    <AuthContext.Provider value={{ currentUser, loading, error, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)