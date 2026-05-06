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

  const NavLink = ({ to, icon, label }) => {
    const active = location.pathname === to || location.pathname.startsWith(to + '/')
    return (
      <Link to={to}
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
        style={{
          background: active ? 'rgba(0, 113, 227, 0.1)' : 'transparent',
          color: active ? '#0071e3' : '#6e6e73',
        }}
      >
        <span className="text-base">{icon}</span>
        <span>{label}</span>
      </Link>
    )
  }

  const SectionLabel = ({ label }) => (
    <p className="text-xs font-semibold px-3 mt-5 mb-1 uppercase tracking-widest"
      style={{color: '#c7c7cc'}}>
      {label}
    </p>
  )

  return (
    <div className="min-h-screen flex flex-col" style={{background: '#f5f5f7'}}>
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-4"
        style={{
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          WebkitBackdropFilter: 'blur(20px)'
        }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{background: 'linear-gradient(135deg, #0071e3, #42a5f5)'}}>
            <span className="text-sm">🏢</span>
          </div>
          <div>
            <h1 className="font-semibold text-sm" style={{color: '#1d1d1f'}}>Hope, Inc.</h1>
            <p className="text-xs" style={{color: '#a1a1a6'}}>CMS</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium" style={{color: '#1d1d1f'}}>
              {currentUser?.username || currentUser?.email?.split('@')[0]}
            </p>
            <p className="text-xs" style={{color: '#a1a1a6'}}>
              {currentUser?.user_type || 'USER'}
            </p>
          </div>
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold"
            style={{background: 'linear-gradient(135deg, #0071e3, #42a5f5)'}}>
            {(currentUser?.username || currentUser?.email || 'U')[0].toUpperCase()}
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl text-sm font-medium"
            style={{
              background: '#f5f5f7',
              color: '#ff3b30',
              border: '1px solid #ffd6d6'
            }}
          >
            Sign Out
          </button>
        </div>
      </nav>

      <div className="flex flex-1 pt-16">
        {/* SIDEBAR */}
        <aside className="fixed left-0 top-16 bottom-0 w-56 py-4 px-3 overflow-y-auto"
          style={{
            background: 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRight: '1px solid rgba(0,0,0,0.06)'
          }}>

          <SectionLabel label="Main" />
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
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 ml-56 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}