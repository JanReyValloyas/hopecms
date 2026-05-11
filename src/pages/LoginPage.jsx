import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { Link, useSearchParams } from 'react-router-dom'
import { Mail, Lock, ArrowRight, Building2 } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const err = searchParams.get('error')
    if (err === 'inactive') {
      setError('Your account is pending activation. Please contact your administrator.')
    } else if (err === 'not_registered') {
      setError('Your account is not registered in the system. Please contact your administrator.')
    }
  }, [searchParams])

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    if (data?.user) {
      const { data: userRow } = await supabase
        .from('user')
        .select('record_status, user_type')
        .eq('userid', data.user.id)
        .maybeSingle()
      if (!userRow || userRow.record_status === 'INACTIVE') {
  await supabase.auth.signOut()
  setError('Your account is pending activation. Please contact your administrator.')
  setLoading(false)
  return
}
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
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-16 relative overflow-hidden"
        style={{background: 'linear-gradient(145deg, #0f172a 0%, #1e293b 50%, #1e40af 100%)'}}>

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}></div>

        {/* Decorative circles */}
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

        {/* Center Content */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{background: 'rgba(59, 130, 246, 0.15)', border: '1px solid rgba(59, 130, 246, 0.3)'}}>
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
            <span className="text-blue-400 text-xs font-medium">Enterprise Platform</span>
          </div>

          <h2 className="text-5xl font-bold text-white leading-tight mb-6">
            Manage your<br />
            <span style={{
              background: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              customers
            </span><br />
            with precision.
          </h2>

          <p className="text-slate-400 text-base leading-relaxed max-w-sm">
            A complete solution for managing customer relationships,
            sales history, and business intelligence.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-10">
            {[
              { value: '82', label: 'Customers' },
              { value: '124', label: 'Transactions' },
              { value: '57', label: 'Products' },
            ].map((stat, i) => (
              <div key={i} className="p-4 rounded-2xl text-center"
                style={{background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)'}}>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
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

          <h2 className="text-3xl font-bold text-gray-900 mb-1">Welcome back</h2>
          <p className="text-gray-400 text-sm mb-8">
            Sign in to your account to continue
          </p>

          {error && (
            <div className="mb-6 p-4 rounded-xl text-sm flex items-center gap-3 bg-red-50 border border-red-100 text-red-700">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  className="w-full pl-11 pr-4 py-3 rounded-xl text-sm outline-none border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="you@company.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  className="w-full pl-11 pr-4 py-3 rounded-xl text-sm outline-none border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
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
                background: loading ? '#93c5fd' : 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
                boxShadow: loading ? 'none' : '0 4px 15px rgba(29, 78, 216, 0.3)',
              }}
            >
              {loading ? 'Signing in...' : <><span>Sign In</span> <ArrowRight size={16} /></>}
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
            <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-700">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}