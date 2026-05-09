import { useState } from 'react'
import { supabase } from '../supabaseClient'
import { Link } from 'react-router-dom'
import { Mail, Lock, ArrowRight, Users } from 'lucide-react'

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
    <div className="min-h-screen flex bg-gray-50">

      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
        style={{background: 'linear-gradient(145deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'}}>

        {/* Decorative Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full opacity-10"
            style={{background: 'radial-gradient(circle, #f43f5e, transparent)'}}></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full opacity-10"
            style={{background: 'radial-gradient(circle, #f43f5e, transparent)'}}></div>
          <div className="absolute top-1/2 left-1/2 w-48 h-48 rounded-full opacity-5"
            style={{background: 'radial-gradient(circle, #ffffff, transparent)', transform: 'translate(-50%, -50%)'}}></div>

          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
              backgroundSize: '50px 50px'
            }}></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-16 w-full">
          {/* Top Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500 flex items-center justify-center shadow-lg">
              <Users size={20} className="text-white" />
            </div>
            <span className="font-bold text-white text-lg">CMS</span>
          </div>

          {/* Center Text */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
              style={{background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.3)'}}>
              <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
              <span className="text-rose-400 text-xs font-medium">Enterprise Platform</span>
            </div>

            <h2 className="text-5xl font-bold text-white leading-tight mb-6">
              Customer<br />
              <span style={{
                background: 'linear-gradient(135deg, #f43f5e, #fb7185)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Management
              </span><br />
              System
            </h2>

            <p className="text-gray-400 text-base leading-relaxed max-w-sm">
              A complete solution for managing customer relationships,
              sales tracking, and business intelligence.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12">
              {[
                { value: '82', label: 'Customers', icon: '👥' },
                { value: '124', label: 'Transactions', icon: '📊' },
                { value: '57', label: 'Products', icon: '📦' },
              ].map((stat, i) => (
                <div key={i} className="p-4 rounded-2xl"
                  style={{background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)'}}>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-gray-400 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom */}
          <p className="text-gray-600 text-xs">
            © 2026 Customer Management System. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">

          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-2xl bg-rose-500 flex items-center justify-center">
              <Users size={20} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">Customer Management System</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-1">Welcome back</h2>
          <p className="text-gray-400 text-sm mb-8">Sign in to your account to continue</p>

          {error && (
            <div className="mb-6 p-4 rounded-2xl text-sm flex items-center gap-3 bg-rose-50 border border-rose-100 text-rose-700">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  className="w-full pl-11 pr-4 py-3 rounded-xl text-sm outline-none border border-gray-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all bg-white"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="you@company.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  className="w-full pl-11 pr-4 py-3 rounded-xl text-sm outline-none border border-gray-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all bg-white"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all flex items-center justify-center gap-2 mt-2"
              style={{
                background: loading ? '#fda4af' : 'linear-gradient(135deg, #f43f5e, #fb7185)',
                boxShadow: loading ? 'none' : '0 4px 15px rgba(244, 63, 94, 0.3)',
              }}
            >
              {loading ? 'Signing in...' : (
                <>Sign In <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-xs text-gray-400">or continue with</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          <button
            onClick={handleGoogle}
            className="w-full py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-3 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all"
          >
            <img src="https://www.google.com/favicon.ico" className="w-4 h-4" />
            Continue with Google
          </button>

          <p className="text-center text-sm mt-8 text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-rose-500 hover:text-rose-600 transition-colors">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}