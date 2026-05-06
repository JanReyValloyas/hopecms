import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../supabaseClient'

function StatCard({ title, value, icon, color, subtitle }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-card border border-slate-100 hover:shadow-card-hover transition-all cursor-default">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="text-3xl font-bold mt-2" style={{color}}>{value}</p>
          {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
        </div>
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
          style={{background: `${color}15`}}>
          {icon}
        </div>
      </div>
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-card border border-slate-100">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="skeleton h-4 w-24 mb-3"></div>
          <div className="skeleton h-8 w-16 mb-2"></div>
          <div className="skeleton h-3 w-20"></div>
        </div>
        <div className="skeleton w-12 h-12 rounded-2xl"></div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [recentCustomers, setRecentCustomers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadStats() }, [])

  async function loadStats() {
    try {
      const [custRes, salesRes, prodRes, inactiveRes] = await Promise.all([
        supabase.from('customer').select('custno', { count: 'exact' }).eq('record_status', 'ACTIVE'),
        supabase.from('sales').select('transno', { count: 'exact' }),
        supabase.from('product').select('prodcode', { count: 'exact' }),
        supabase.from('customer').select('custno', { count: 'exact' }).eq('record_status', 'INACTIVE'),
      ])

      setStats({
        totalCustomers: custRes.count || 0,
        totalSales: salesRes.count || 0,
        totalProducts: prodRes.count || 0,
        inactiveCustomers: inactiveRes.count || 0,
      })

      // Get recent customers
      const { data } = await supabase
        .from('customer')
        .select('custno, custname, payterm, record_status')
        .eq('record_status', 'ACTIVE')
        .limit(5)
      setRecentCustomers(data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {greeting}, {currentUser?.username || 'Executive'} 👋
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            Here's what's happening at Hope, Inc. today.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/customers')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{background: 'linear-gradient(135deg, #2563eb, #3b82f6)', boxShadow: '0 4px 12px rgba(37,99,235,0.3)'}}
          >
            <span>+</span> Add Customer
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-5 mb-8">
        {loading ? (
          Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <StatCard
              title="Active Customers"
              value={stats.totalCustomers}
              icon="👥"
              color="#2563eb"
              subtitle="Currently active accounts"
            />
            <StatCard
              title="Total Transactions"
              value={stats.totalSales}
              icon="🧾"
              color="#059669"
              subtitle="All time sales records"
            />
            <StatCard
              title="Products"
              value={stats.totalProducts}
              icon="📦"
              color="#7c3aed"
              subtitle="In catalogue"
            />
            <StatCard
              title="Inactive Accounts"
              value={stats.inactiveCustomers}
              icon="⚠️"
              color="#d97706"
              subtitle="Require attention"
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Recent Customers */}
        <div className="col-span-2 bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Recent Customers</h2>
            <button
              onClick={() => navigate('/customers')}
              className="text-xs font-medium text-blue-600 hover:underline"
            >
              View all →
            </button>
          </div>
          <div className="divide-y divide-slate-50">
            {loading ? (
              Array(5).fill(0).map((_, i) => (
                <div key={i} className="px-6 py-4 flex items-center gap-4">
                  <div className="skeleton w-10 h-10 rounded-full"></div>
                  <div className="flex-1">
                    <div className="skeleton h-4 w-32 mb-2"></div>
                    <div className="skeleton h-3 w-20"></div>
                  </div>
                </div>
              ))
            ) : recentCustomers.map((c) => (
              <div
                key={c.custno}
                className="px-6 py-4 flex items-center gap-4 hover:bg-slate-50 cursor-pointer transition-colors"
                onClick={() => navigate(`/customers/${c.custno}`)}
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0"
                  style={{background: `hsl(${c.custno.charCodeAt(1) * 20}, 65%, 55%)`}}>
                  {c.custname[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{c.custname}</p>
                  <p className="text-xs text-slate-400">{c.custno}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium
                  ${c.payterm === 'COD' ? 'bg-emerald-50 text-emerald-700' :
                    c.payterm === '30D' ? 'bg-blue-50 text-blue-700' :
                    'bg-purple-50 text-purple-700'}`}>
                  {c.payterm}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-6">
            <h2 className="font-semibold text-slate-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              {[
                { icon: '👥', label: 'View Customers', desc: 'Browse all accounts', path: '/customers', color: '#2563eb' },
                { icon: '🧾', label: 'Sales History', desc: 'View all transactions', path: '/sales', color: '#059669' },
                { icon: '📊', label: 'Sales Report', desc: 'Customer summary', path: '/reports/sales-summary', color: '#7c3aed' },
                { icon: '🏆', label: 'Top Customers', desc: 'Revenue leaders', path: '/reports/top-customers', color: '#d97706' },
              ].map((action, i) => (
                <button
                  key={i}
                  onClick={() => navigate(action.path)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors text-left group"
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                    style={{background: `${action.color}15`}}>
                    {action.icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {action.label}
                    </p>
                    <p className="text-xs text-slate-400">{action.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* System Status */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white">
            <h2 className="font-semibold mb-4">System Status</h2>
            <div className="space-y-3">
              {[
                { label: 'Database', status: 'Operational' },
                { label: 'Authentication', status: 'Operational' },
                { label: 'API', status: 'Operational' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                    <span className="text-xs text-emerald-400">{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}