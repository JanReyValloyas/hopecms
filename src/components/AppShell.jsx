import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useRights } from '../context/UserRightsContext'

export default function AppShell({ children }) {
  const { currentUser, signOut } = useAuth()
  const { rights } = useRights()
  const navigate = useNavigate()
  const location = useLocation()

  async function handleLogout() {
    await signOut()
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path
    ? 'bg-blue-600 text-white'
    : 'text-gray-300 hover:bg-gray-700 hover:text-white'

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* NAVBAR */}
      <nav className="bg-gray-900 text-white px-6 py-3 flex justify-between items-center shadow-lg fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-sm">🏢</span>
          </div>
          <h1 className="font-bold text-lg">Hope, Inc. CMS</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium">
              {currentUser?.username || currentUser?.email}
            </p>
            <p className="text-xs text-gray-400">
              {currentUser?.user_type || 'USER'}
            </p>
          </div>
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
            {(currentUser?.username || currentUser?.email || 'U')[0].toUpperCase()}
          </div>
          <button
            onClick={handleLogout}
            className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="flex flex-1 pt-14">
        {/* SIDEBAR */}
        <aside className="w-56 bg-gray-900 text-white flex flex-col py-4 fixed left-0 top-14 bottom-0 overflow-y-auto">

          {/* MAIN */}
          <div className="px-4 mb-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Main
            </p>
          </div>

          {rights.CUST_VIEW === 1 && (
            <Link to="/customers"
              className={`mx-2 px-3 py-2 rounded-lg text-sm flex items-center gap-2 mb-1 transition-colors ${isActive('/customers')}`}>
              <span>👥</span> Customers
            </Link>
          )}

          {rights.SALES_VIEW === 1 && (
            <Link to="/sales"
              className={`mx-2 px-3 py-2 rounded-lg text-sm flex items-center gap-2 mb-1 transition-colors ${isActive('/sales')}`}>
              <span>🧾</span> Sales
            </Link>
          )}

          {rights.PROD_VIEW === 1 && (
            <Link to="/products"
              className={`mx-2 px-3 py-2 rounded-lg text-sm flex items-center gap-2 mb-1 transition-colors ${isActive('/products')}`}>
              <span>📦</span> Products
            </Link>
          )}

          {/* REPORTS */}
          <div className="px-4 mt-4 mb-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Reports
            </p>
          </div>

          {rights.SALES_VIEW === 1 && (
            <Link to="/reports/sales-summary"
              className={`mx-2 px-3 py-2 rounded-lg text-sm flex items-center gap-2 mb-1 transition-colors ${isActive('/reports/sales-summary')}`}>
              <span>📊</span> Sales Summary
            </Link>
          )}

          {rights.SALES_VIEW === 1 && (
            <Link to="/reports/top-customers"
              className={`mx-2 px-3 py-2 rounded-lg text-sm flex items-center gap-2 mb-1 transition-colors ${isActive('/reports/top-customers')}`}>
              <span>🏆</span> Top Customers
            </Link>
          )}

          {rights.PROD_VIEW === 1 && (
            <Link to="/reports/product-revenue"
              className={`mx-2 px-3 py-2 rounded-lg text-sm flex items-center gap-2 mb-1 transition-colors ${isActive('/reports/product-revenue')}`}>
              <span>💰</span> Product Revenue
            </Link>
          )}

          {/* ADMIN */}
          {rights.ADM_USER === 1 && (
            <>
              <div className="px-4 mt-4 mb-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Admin
                </p>
              </div>
              <Link to="/admin"
                className={`mx-2 px-3 py-2 rounded-lg text-sm flex items-center gap-2 mb-1 transition-colors ${isActive('/admin')}`}>
                <span>⚙️</span> User Management
              </Link>
            </>
          )}

          {(currentUser?.user_type === 'ADMIN' ||
            currentUser?.user_type === 'SUPERADMIN' ||
            rights.ADM_USER === 1) && (
            <Link to="/deleted-customers"
              className={`mx-2 px-3 py-2 rounded-lg text-sm flex items-center gap-2 mb-1 transition-colors ${isActive('/deleted-customers')}`}>
              <span>🗑️</span> Deleted Customers
            </Link>
          )}
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 ml-56 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}