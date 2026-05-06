import { useState } from 'react'
import { supabase } from '../supabaseClient'
import { Link } from 'react-router-dom'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else if (data?.user) {
      window.location.href = '/customers'
    }
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` }
    })
  }

  return (
    <div className="min-h-screen flex" style={{background: 'linear-gradient(135deg, #1d1d1f 0%, #2d2d2f 50%, #1a1a2e 100%)'}}>
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-16 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full opacity-5" 
          style={{background: 'radial-gradient(circle, #0071e3, transparent)', transform: 'translate(-50%, -50%)'}}></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-5"
          style={{background: 'radial-gradient(circle, #0071e3, transparent)', transform: 'translate(50%, 50%)'}}></div>
        
        <div className="relative z-10 text-center">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8"
            style={{background: 'linear-gradient(135deg, #0071e3, #42a5f5)'}}>
            <span className="text-4xl">🏢</span>
          </div>
          <h1 className="text-5xl font-semibold text-white mb-4 tracking-tight">
            Hope, Inc.
          </h1>
          <p className="text-xl font-light mb-2" style={{color: '#a1a1a6'}}>
            Customer Management System
          </p>
          <p className="text-sm mt-8 max-w-xs mx-auto leading-relaxed" style={{color: '#6e6e73'}}>
            Enterprise-grade customer intelligence for the modern business executive.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mt-16">
            {[
              { value: '82', label: 'Customers' },
              { value: '124', label: 'Transactions' },
              { value: '57', label: 'Products' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl font-semibold text-white">{stat.value}</p>
                <p className="text-xs mt-1" style={{color: '#6e6e73'}}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8"
        style={{background: '#f5f5f7'}}>
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-10">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{background: 'linear-gradient(135deg, #0071e3, #42a5f5)'}}>
              <span className="text-3xl">🏢</span>
            </div>
            <h1 className="text-2xl font-semibold" style={{color: '#1d1d1f'}}>Hope, Inc. CMS</h1>
          </div>

          <h2 className="text-3xl font-semibold mb-2 tracking-tight" style={{color: '#1d1d1f'}}>
            Sign in
          </h2>
          <p className="text-sm mb-8" style={{color: '#6e6e73'}}>
            Welcome back. Enter your credentials to continue.
          </p>

          {error && (
            <div className="mb-6 p-4 rounded-2xl text-sm flex items-center gap-3"
              style={{background: '#fff2f2', border: '1px solid #ffd6d6', color: '#ff3b30'}}>
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{color: '#1d1d1f'}}>
                Email Address
              </label>
              <input
                type="email"
                className="w-full px-4 py-3.5 rounded-2xl text-sm outline-none"
                style={{
                  background: 'white',
                  border: '1px solid #e5e5ea',
                  color: '#1d1d1f',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                }}
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="you@company.com"
                onFocus={e => e.target.style.border = '1px solid #0071e3'}
                onBlur={e => e.target.style.border = '1px solid #e5e5ea'}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{color: '#1d1d1f'}}>
                Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-3.5 rounded-2xl text-sm outline-none"
                style={{
                  background: 'white',
                  border: '1px solid #e5e5ea',
                  color: '#1d1d1f',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                }}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                onFocus={e => e.target.style.border = '1px solid #0071e3'}
                onBlur={e => e.target.style.border = '1px solid #e5e5ea'}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl text-sm font-medium text-white mt-2"
              style={{
                background: loading ? '#a1a1a6' : 'linear-gradient(135deg, #0071e3, #0077ed)',
                boxShadow: loading ? 'none' : '0 4px 15px rgba(0, 113, 227, 0.3)',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px" style={{background: '#e5e5ea'}}></div>
            <span className="text-xs" style={{color: '#a1a1a6'}}>or</span>
            <div className="flex-1 h-px" style={{background: '#e5e5ea'}}></div>
          </div>

          <button
            onClick={handleGoogle}
            className="w-full py-3.5 rounded-2xl text-sm font-medium flex items-center justify-center gap-3"
            style={{
              background: 'white',
              border: '1px solid #e5e5ea',
              color: '#1d1d1f',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              cursor: 'pointer'
            }}
          >
            <img src="https://www.google.com/favicon.ico" className="w-4 h-4" />
            Continue with Google
          </button>

          <p className="text-center text-sm mt-8" style={{color: '#6e6e73'}}>
            Don't have an account?{' '}
            <Link to="/register" className="font-medium" style={{color: '#0071e3'}}>
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}