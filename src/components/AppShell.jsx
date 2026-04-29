import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AppShell({ children }) {
  const { currentUser, signOut } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* NAVBAR */}
      <nav className="bg-blue-700 text-white px-6 py-3 flex justify-between items-center">
        <h1 className="font-bold text-lg">Hope, Inc. CMS</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm">
            {currentUser?.username || currentUser?.email}
          </span>
          <button
            onClick={handleLogout}
            className="bg-white text-blue-700 px-3 py-1 rounded text-sm font-semibold hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="flex flex-1">
        {/* SIDEBAR */}
        <aside className="w-48 bg-gray-800 text-white flex flex-col p-4 gap-2">
          <Link to="/customers"
            className="px-3 py-2 rounded hover:bg-gray-700 text-sm">
            👥 Customers
          </Link>
          <Link to="/sales"
            className="px-3 py-2 rounded hover:bg-gray-700 text-sm">
            🧾 Sales
          </Link>
          <Link to="/products"
            className="px-3 py-2 rounded hover:bg-gray-700 text-sm">
            📦 Products
          </Link>
          <Link to="/admin"
            className="px-3 py-2 rounded hover:bg-gray-700 text-sm">
            ⚙️ Admin
          </Link>
          <Link to="/deleted-customers"
            className="px-3 py-2 rounded hover:bg-gray-700 text-sm">
            🗑️ Deleted Customers
          </Link>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 p-6 bg-gray-100">
          {children}
        </main>
      </div>
    </div>
  )
}