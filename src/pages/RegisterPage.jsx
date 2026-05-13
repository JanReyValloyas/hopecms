// M2-PR-02: Registration form with validation

import { useState } from 'react'
import { supabase } from '../supabaseClient'
import { Link } from 'react-router-dom'
import { Building2 } from 'lucide-react'

export default function RegisterPage() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleRegister(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: `${firstName} ${lastName}`, username } }
    })
    if (error) setError(error.message)
    else setSuccess('Registration successful! Please wait for administrator activation before logging in.')
    setLoading(false)
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` }
    })
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-16 relative overflow-hidden"
        style={{background: 'linear-gradient(145deg, #0f172a 0%, #1e293b 50%, #1e40af 100%)'}}>

        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}></div>

        <div className="absolute top-20 right-20 w-64 h-64 rounded-full opacity-10"
          style={{background: 'radial-gradient(circle, #3b82f6, transparent)'}}></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 rounded-full opacity-10"
          style={{background: 'radial-gradient(circle, #1d4ed8, transparent)'}}></div>

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)'}}>
            <Building2 size={20} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-white text-sm">Hope, Inc.</p>
            <p className="text-xs text-slate-400">Customer Management System</p>
          </div>
        </div>

        {/* Center */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{background: 'rgba(59, 130, 246, 0.15)', border: '1px solid rgba(59, 130, 246, 0.3)'}}>
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
            <span className="text-blue-400 text-xs font-medium">New Account</span>
          </div>

          <h2 className="text-5xl font-bold text-white leading-tight mb-6">
            Join the<br />
            <span style={{
              background: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Hope, Inc.
            </span><br />
            platform.
          </h2>

          <p className="text-slate-400 text-base leading-relaxed max-w-sm">
            Create your account and start managing customer relationships with precision and efficiency.
          </p>

          <div className="mt-10 p-5 rounded-2xl"
            style={{background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)'}}>
            <p className="text-slate-400 text-sm">
              ⚠️ New accounts require administrator approval before access is granted.
            </p>
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-slate-600 text-xs">
            © 2026 Hope, Inc. Customer Management System
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-sm">

          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)'}}>
              <Building2 size={20} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">Hope, Inc.</p>
              <p className="text-xs text-gray-400">Customer Management System</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-1">Create account</h2>
          <p className="text-gray-400 text-sm mb-8">Fill in your details to register</p>

          {error && (
            <div className="mb-4 p-4 rounded-xl text-sm flex items-center gap-3 bg-red-50 border border-red-100 text-red-700">
              <span>⚠️</span> {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 rounded-xl text-sm flex items-center gap-3 bg-blue-50 border border-blue-100 text-blue-700">
              <span>✅</span> {success}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  required placeholder="Juan"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  required placeholder="dela Cruz"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Username</label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required placeholder="juandelacruz"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <input
                type="email"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required placeholder="juan@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <input
                type="password"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required placeholder="••••••••" minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all mt-2"
              style={{
                background: loading ? '#93c5fd' : 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
                boxShadow: loading ? 'none' : '0 4px 15px rgba(29, 78, 216, 0.3)',
              }}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-xs text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          <button
            onClick={handleGoogle}
            className="w-full py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-3 bg-white border border-gray-200 hover:bg-gray-50 transition-all"
          >
            <img src="https://www.google.com/favicon.ico" className="w-4 h-4" />
            Register with Google
          </button>

          <p className="text-center text-sm mt-8 text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}