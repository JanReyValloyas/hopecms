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
      window.location.href = '/dashboard'
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
        style={{background: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 50%, #fecdd3 100%)'}}>

        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-20"
          style={{background: 'radial-gradient(circle, #f43f5e, transparent)', transform: 'translate(30%, -30%)'}}></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-20"
          style={{background: 'radial-gradient(circle, #fb7185, transparent)', transform: 'translate(-30%, 30%)'}}></div>

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">H</span>
            </div>
            <span className="font-bold text-gray-900 text-lg">HopeCMS</span>
          </div>
        </div>

        {/* Center Content */}
        <div className="relative z-10">
          <h2 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
            Manage your<br />
            <span className="text-rose-500">customers</span><br />
            with precision.
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed max-w-sm">
            Enterprise-grade customer intelligence built for modern executives.
          </p>

          {/* Stats */}
          <div className="flex gap-8 mt-10">
            {[
              { value: '82', label: 'Customers' },
              { value: '124', label: 'Transactions' },
              { value: '57', label: 'Products' },
            ].map((stat, i) => (
              <div key={i}>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom quote */}
        <div className="relative z-10">
          <p className="text-sm text-gray-400 italic">
            "Built for teams that value precision and elegance."
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">

          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-2xl bg-rose-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">H</span>
            </div>
            <span className="font-bold text-gray-900 text-lg">HopeCMS</span>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h2>
          <p className="text-gray-400 text-sm mb-8">Sign in to your account to continue</p>

          {error && (
            <div className="mb-6 p-4 rounded-2xl text-sm flex items-center gap-3 bg-rose-50 border border-rose-100 text-rose-700">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none border border-gray-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all bg-white"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="you@company.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none border border-gray-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all bg-white"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white bg-rose-500 hover:bg-rose-600 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-xs text-gray-400">or continue with</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          <button
            onClick={handleGoogle}
            className="w-full py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-3 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <img src="https://www.google.com/favicon.ico" className="w-4 h-4" />
            Continue with Google
          </button>

          <p className="text-center text-sm mt-8 text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-rose-500 hover:text-rose-600">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}