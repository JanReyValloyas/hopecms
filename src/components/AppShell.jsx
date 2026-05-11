import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useRights } from '../context/UserRightsContext'
import {
  Users, ShoppingCart, Package, BarChart2,
  Trophy, TrendingUp, Settings, Trash2,
  ChevronLeft, ChevronRight, LogOut
} from 'lucide-react'

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

 const NavLink = ({ to, icon: Icon, label }) => {
  const active = location.pathname === to || location.pathname.startsWith(to + '/')
  return (
    <Link to={to}
      title={collapsed ? label : ''}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
        active
          ? 'bg-blue-600 text-white'
          : 'text-slate-400 hover:bg-slate-800 hover:text-white'
      }`}
    >
      <Icon size={18} className="flex-shrink-0" />
      {!collapsed && <span className="truncate">{label}</span>}
      {active && !collapsed && (
        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white flex-shrink-0"></span>
      )}
    </Link>
  )
}

const SectionLabel = ({ label }) => !collapsed ? (
  <p className="text-xs font-semibold px-3 mt-6 mb-2 uppercase tracking-widest text-slate-500">
    {label}
  </p>
) : <div className="h-px bg-slate-700 mx-3 my-3"></div>

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* SIDEBAR */}
      <aside
       className="fixed left-0 top-0 bottom-0 flex flex-col z-50"
style={{
  width: collapsed ? '68px' : '240px',
  transition: 'width 0.3s ease',
  background: '#0f172a',
  borderRight: '1px solid #1e293b'
}}
      >
      {/* Logo */}
<div className="flex items-center justify-between px-4 py-5 border-b border-slate-700">
  <div className="flex items-center gap-3 overflow-hidden">
    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)'}}>
      <span className="text-white text-sm font-bold">H</span>
    </div>
    {!collapsed && (
      <div>
        <p className="font-bold text-white text-sm">Hope, Inc.</p>
        <p className="text-xs text-slate-400">Customer Management System</p>
      </div>
    )}
  </div>
  <button
    onClick={() => setCollapsed(!collapsed)}
    className="text-slate-400 hover:text-white transition-colors flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-lg hover:bg-slate-700"
  >
    {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
  </button>
</div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-3 overflow-y-auto overflow-x-hidden space-y-0.5">
          <SectionLabel label="Main" />
          {rights.CUST_VIEW === 1 && <NavLink to="/customers" icon={Users} label="Customers" />}
          {rights.SALES_VIEW === 1 && <NavLink to="/sales" icon={ShoppingCart} label="Sales" />}
          {rights.PROD_VIEW === 1 && <NavLink to="/products" icon={Package} label="Products" />}

        

          {rights.ADM_USER === 1 && (
            <>
              <SectionLabel label="Admin" />
              <NavLink to="/admin" icon={Settings} label="User Management" />
            </>
          )}

          {(currentUser?.user_type === 'ADMIN' ||
            currentUser?.user_type === 'SUPERADMIN' ||
            rights.ADM_USER === 1) && (
            <NavLink to="/deleted-customers" icon={Trash2} label="Deleted Customers" />
          )}
        </nav>
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
            {location.pathname.split('/')[1].replace(/-/g, ' ') || 'Customers'}
          </h2>
          <p className="text-xs text-gray-400">
            {new Date().toLocaleDateString('en-PH', {
              weekday: 'long', year: 'numeric',
              month: 'long', day: 'numeric'
            })}
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
  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-400 hover:bg-red-500 hover:text-white transition-all ${collapsed ? 'justify-center' : ''}`}
>
  <LogOut size={16} className="flex-shrink-0" />
  {!collapsed && <span>Sign Out</span>}
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