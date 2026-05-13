// M2-PR-04: Auth callback loading page with login guard

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { Building2 } from 'lucide-react'

export default function AuthCallbackPage() {
  const navigate = useNavigate()
  const [message, setMessage] = useState('Processing your login...')

  useEffect(() => {
    async function handleCallback() {
      try {
        // Wait for session to be established
        let session = null
        let attempts = 0

        while (!session && attempts < 10) {
          const { data } = await supabase.auth.getSession()
          session = data?.session
          if (!session) {
            await new Promise(resolve => setTimeout(resolve, 500))
            attempts++
          }
        }

        if (!session) {
          navigate('/login')
          return
        }

        setMessage('Verifying your account...')

        // Check record_status
        const { data: userRow } = await supabase
          .from('user')
          .select('record_status, user_type')
          .eq('userid', session.user.id)
          .maybeSingle()

        if (!userRow || userRow.record_status === 'INACTIVE') {
          await supabase.auth.signOut()
          navigate('/login?error=inactive')
          return
        }

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
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
          style={{background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)'}}>
          <Building2 size={24} className="text-white" />
        </div>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 text-sm font-medium">{message}</p>
        <p className="text-gray-400 text-xs mt-2">Please wait...</p>
      </div>
    </div>
  )
}