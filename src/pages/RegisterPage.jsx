import { useState } from 'react'
import { supabase } from '../supabaseClient'
import { useNavigate, Link } from 'react-router-dom'

export default function RegisterPage() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleRegister(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: `${firstName} ${lastName}`,
          username: username
        }
      }
    })

    if (error) {
      setError(error.message)
    } else {
      setSuccess('Registration successful! Please wait for admin activation before logging in.')
    }
    setLoading(false)
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` }
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-700">
          Hope, Inc. CMS
        </h1>
        <h2 className="text-lg font-semibold text-center mb-4">Register</h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 text-green-700 p-3 rounded mb-4 text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">First Name</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 text-sm"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              required
              placeholder="Enter your first name"
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Last Name</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 text-sm"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              required
              placeholder="Enter your last name"
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 text-sm"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              placeholder="Choose a username"
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full border rounded px-3 py-2 text-sm"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              className="w-full border rounded px-3 py-2 text-sm"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="Create a password"
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <div className="my-4 text-center text-gray-400 text-sm">— or —</div>

        <button
          onClick={handleGoogle}
          className="w-full border border-gray-300 py-2 rounded font-semibold text-sm hover:bg-gray-50 flex items-center justify-center gap-2"
        >
          <img src="https://www.google.com/favicon.ico" className="w-4 h-4" />
          Register with Google
        </button>

        <p className="text-center text-sm mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  )
}