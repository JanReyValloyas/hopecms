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
        title={collapsed ? label : ''}
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group"
        style={{
          background: active ? 'rgba(37, 99, 235, 0.15)' : 'transparent',
          color: active ? '#60a5fa' : '#94a3b8',
        }}
      >
        <span className="text-lg flex-shrink-0 group-hover:scale-110 transition-transform">{icon}</span>
        {!collapsed && <span className="truncate">{label}</span>}
      </Link>
    )
  }

  const SectionLabel = ({ label }) => collapsed ? (
    <div className="h-px bg-slate-700 mx-3 my-3"></div>
  ) : (
    <p className="text-xs font-semibold px-3 mt-5 mb-1 uppercase tracking-widest text-slate-500">
      {label}
    </p>
  )

  const sidebarWidth = collapsed ? '68px' : '240px'

  return (
    <div className="min-h-screen flex" style={{background: '#F8FAFC'}}>
      {/* SIDEBAR */}
      <aside
        className="fixed left-0 top-0 bottom-0 flex flex-col z-50"
        style={{
          width: sidebarWidth,
          background: '#0f172a',
          transition: 'width 0.3s ease',
          borderRight: '1px solid rgba(255,255,255,0.05)'
        }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-slate-800">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{background: 'linear-gradient(135deg, #2563eb, #3b82f6)'}}>
              <span className="text-sm">🏢</span>
            </div>
            {!collapsed && (
              <div className="overflow-hidden">
                <p className="font-bold text-white text-sm truncate">Hope, Inc.</p>
                <p className="text-xs text-slate-500 truncate">CMS Platform</p>
              </div>
            )}
          </div>
          {!collapsed && (
            <button
              onClick={() => setCollapsed(true)}
              className="text-slate-500 hover:text-white transition-colors flex-shrink-0"
              title="Collapse sidebar"
            >
              ◀
            </button>
          )}
        </div>

        {/* Expand button when collapsed */}
        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            className="mx-auto mt-2 w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-all"
            title="Expand sidebar"
          >
            ▶
          </button>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-2 py-3 overflow-y-auto overflow-x-hidden">
          <SectionLabel label="Main" />
          <NavLink to="/dashboard" icon="🏠" label="Dashboard" />
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

        {/* User Profile at Bottom */}
        <div className="border-t border-slate-800 p-3">
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl overflow-hidden">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
              style={{background: 'linear-gradient(135deg, #2563eb, #3b82f6)'}}>
              {(currentUser?.username || currentUser?.email || 'U')[0].toUpperCase()}
            </div>
            {!collapsed && (
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium text-white truncate">
                  {currentUser?.username || currentUser?.email?.split('@')[0]}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  {currentUser?.user_type || 'USER'}
                </p>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="mt-2 w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500 hover:text-white transition-all"
          >
            <span className="flex-shrink-0">🚪</span>
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main
        className="flex-1 min-h-screen"
        style={{
          marginLeft: sidebarWidth,
          transition: 'margin-left 0.3s ease',
          padding: '32px',
        }}
      >
        {children}
      </main>
    </div>
  )
}