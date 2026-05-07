import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useRights } from '../context/UserRightsContext'

export default function AppShell({ children }) {
  const { currentUser, signOut } = useAuth()
  const { rights } = useRights()
  const navigate = useNavigate()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)

  async function handleLogout() {
    await signOut()
    navigate('/login')
  }

  const NavLink = ({ to, icon, label }) => {
    const active = location.pathname === to || location.pathname.startsWith(to + '/')
    return (
      <Link to={to}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
          active
            ? 'bg-rose-50 text-rose-600'
            : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
        }`}
      >
        <span className="text-base flex-shrink-0">{icon}</span>
        {!collapsed && <span className="truncate">{label}</span>}
        {active && !collapsed && (
          <span className="ml-auto w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0"></span>
        )}
      </Link>
    )
  }

  const SectionLabel = ({ label }) => !collapsed ? (
    <p className="text-xs font-semibold px-3 mt-6 mb-2 uppercase tracking-widest text-gray-400">
      {label}
    </p>
  ) : <div className="h-px bg-gray-100 mx-3 my-3"></div>

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* SIDEBAR */}
      <aside
        className="fixed left-0 top-0 bottom-0 flex flex-col bg-white border-r border-gray-100 z-50"
        style={{
          width: collapsed ? '68px' : '240px',
          transition: 'width 0.3s ease',
        }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 bg-rose-500">
              <span className="text-white text-sm font-bold">H</span>
            </div>
            {!collapsed && (
              <div>
                <p className="font-bold text-gray-900 text-sm">HopeCMS</p>
                <p className="text-xs text-gray-400">Management System</p>
              </div>
            )}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-lg hover:bg-gray-100"
          >
            {collapsed ? '›' : '‹'}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-3 overflow-y-auto overflow-x-hidden space-y-0.5">
          <SectionLabel label="Main" />
          <NavLink to="/dashboard" icon="⊞" label="Dashboard" />
          {rights.CUST_VIEW === 1 && <NavLink to="/customers" icon="👥" label="Customers" />}
          {rights.SALES_VIEW === 1 && <NavLink to="/sales" icon="🧾" label="Sales" />}
          {rights.PROD_VIEW === 1 && <NavLink to="/products" icon="📦" label="Products" />}

          <SectionLabel label="Reports" />
          {rights.SALES_VIEW === 1 && <NavLink to="/reports/sales-summary" icon="📊" label="Sales Summary" />}
          {rights.SALES_VIEW === 1 && <NavLink to="/reports/top-customers" icon="🏆" label="Top Customers" />}
          {rights.PROD_VIEW === 1 && <NavLink to="/reports/product-revenue" icon="💰" label="Product Revenue" />}

          {rights.ADM_USER === 1 && (
            <>
              <SectionLabel label="Admin" />
              <NavLink to="/admin" icon="⚙️" label="User Management" />
            </>
          )}
          {(currentUser?.user_type === 'ADMIN' ||
            currentUser?.user_type === 'SUPERADMIN' ||
            rights.ADM_USER === 1) && (
            <NavLink to="/deleted-customers" icon="🗑️" label="Deleted Customers" />
          )}
        </nav>

        {/* User at bottom */}
        <div className="border-t border-gray-100 p-3 space-y-1">
          <div className={`flex items-center gap-3 px-2 py-2 rounded-xl overflow-hidden ${collapsed ? 'justify-center' : ''}`}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 bg-rose-400">
              {(currentUser?.username || currentUser?.email || 'U')[0].toUpperCase()}
            </div>
            {!collapsed && (
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {currentUser?.username || currentUser?.email?.split('@')[0]}
                </p>
                <p className="text-xs text-gray-400 truncate">{currentUser?.user_type || 'USER'}</p>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-gray-500 hover:bg-rose-50 hover:text-rose-600 transition-all ${collapsed ? 'justify-center' : ''}`}
          >
        
            
          </button>
        </div>
      </aside>

     {/* Top Navbar */}
<div
  className="fixed top-0 right-0 z-40 flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100"
  style={{
    left: collapsed ? '68px' : '240px',
    transition: 'left 0.3s ease'
  }}
>
  <div>
    <h2 className="text-sm font-semibold text-gray-900 capitalize">
      {location.pathname.split('/')[1].replace('-', ' ') || 'Dashboard'}
    </h2>
    <p className="text-xs text-gray-400">
      {new Date().toLocaleDateString('en-PH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
    </p>
  </div>

  <div className="flex items-center gap-3">
    <div className="px-3 py-1.5 rounded-full text-xs font-medium bg-rose-50 text-rose-600 border border-rose-100">
      {currentUser?.user_type || 'USER'}
    </div>
    <div className="w-8 h-8 rounded-full bg-rose-400 flex items-center justify-center text-white text-xs font-bold">
      {(currentUser?.username || currentUser?.email || 'U')[0].toUpperCase()}
    </div>
    <span className="text-sm font-medium text-gray-700">
      {currentUser?.username || currentUser?.email?.split('@')[0]}
    </span>
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-100 transition-colors"
    >
      <span>🚪</span> Sign Out
    </button>
  </div>
</div>

      {/* MAIN CONTENT */}
      <main
        className="flex-1 pt-20 px-8 pb-8"
        style={{
          marginLeft: collapsed ? '68px' : '240px',
          transition: 'margin-left 0.3s ease',
        }}
      >
        {children}
      </main>
    </div>
  )
}