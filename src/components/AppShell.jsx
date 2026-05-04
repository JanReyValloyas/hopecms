import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useRights } from '../context/UserRightsContext'

export default function AppShell({ children }) {
  const { currentUser, signOut } = useAuth()
  const { rights } = useRights()
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
          <span className="text-xs bg-blue-500 px-2 py-1 rounded">
            {currentUser?.user_type || 'USER'}
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
        <aside className="w-48 bg-gray-800 text-white flex flex-col p-4 gap-1">

          {/* Customers — always visible */}
          {rights.CUST_VIEW === 1 && (
            <Link to="/customers"
              className="px-3 py-2 rounded hover:bg-gray-700 text-sm">
              👥 Customers
            </Link>
          )}

          {/* Sales — visible if SALES_VIEW = 1 */}
          {rights.SALES_VIEW === 1 && (
            <Link to="/sales"
              className="px-3 py-2 rounded hover:bg-gray-700 text-sm">
              🧾 Sales
            </Link>
          )}

          {/* Products — visible if PROD_VIEW = 1 */}
          {rights.PROD_VIEW === 1 && (
            <Link to="/products"
              className="px-3 py-2 rounded hover:bg-gray-700 text-sm">
              📦 Products
            </Link>
          )}

          {/* Admin — visible if ADM_USER = 1 */}
          {rights.ADM_USER === 1 && (
            <Link to="/admin"
              className="px-3 py-2 rounded hover:bg-gray-700 text-sm">
              ⚙️ Admin
            </Link>
          )}

          {/* Deleted Customers — ADMIN/SUPERADMIN only */}
          {(currentUser?.user_type === 'ADMIN' ||
            currentUser?.user_type === 'SUPERADMIN') && (
            <Link to="/deleted-customers"
              className="px-3 py-2 rounded hover:bg-gray-700 text-sm">
              🗑️ Deleted Customers
            </Link>
          )}
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 p-6 bg-gray-100">
          {children}
        </main>
      </div>
    </div>
  )
}