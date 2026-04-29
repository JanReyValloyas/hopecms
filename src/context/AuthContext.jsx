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
          try {
            const { data: userRow, error: userError } = await supabase
              .from('user')
              .select('record_status, user_type, username')
              .eq('userid', session.user.id)
              .single()

            if (userError || !userRow) {
              setCurrentUser({ ...session.user })
              setLoading(false)
              return
            }

            if (userRow?.record_status !== 'ACTIVE') {
              await supabase.auth.signOut()
              setError('Your account is pending activation by a Sales Manager.')
              setCurrentUser(null)
            } else {
              setCurrentUser({ ...session.user, ...userRow })
              setError('')
            }
          } catch (err) {
            console.error('Auth error:', err)
            setCurrentUser({ ...session.user })
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