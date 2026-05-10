import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

export default function AuthCallbackPage() {
  const navigate = useNavigate()
  const [message, setMessage] = useState('Processing your login...')

  useEffect(() => {
    async function handleCallback() {
      try {
        const { data: { session } } = await supabase.auth.getSession()

        if (!session) {
          navigate('/login')
          return
        }

        // Check record_status — login guard
        const { data: userRow } = await supabase
          .from('user')
          .select('record_status, user_type')
          .eq('userid', session.user.id)
          .maybeSingle()

        if (!userRow) {
          // Not in user table yet
          await supabase.auth.signOut()
          navigate('/login?error=not_registered')
          return
        }

        if (userRow.record_status === 'INACTIVE') {
          // Block INACTIVE users
          await supabase.auth.signOut()
          navigate('/login?error=inactive')
          return
        }

        // ACTIVE — allow in
        setMessage('Login successful! Redirecting...')
        navigate('/customers')

      } catch (err) {
        console.error('Auth callback error:', err)
        navigate('/login')
      }
    }

    handleCallback()
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-500 flex items-center justify-center mx-auto mb-6 shadow-lg">
          <span className="text-white font-bold text-2xl">C</span>
        </div>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500 mx-auto mb-4"></div>
        <p className="text-gray-600 text-sm font-medium">{message}</p>
        <p className="text-gray-400 text-xs mt-2">Please wait...</p>
      </div>
    </div>
  )
}