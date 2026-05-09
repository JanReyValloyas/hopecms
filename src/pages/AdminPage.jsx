import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useRights } from '../context/UserRightsContext'
import { supabase } from '../supabaseClient'

function Toggle({ checked, onChange, disabled }) {
  return (
    <label className="toggle-switch" style={{ opacity: disabled ? 0.4 : 1, cursor: disabled ? 'not-allowed' : 'pointer' }}>
      <input type="checkbox" checked={checked} onChange={onChange} disabled={disabled} />
      <span className="toggle-slider"></span>
    </label>
  )
}

export default function AdminPage() {
  const { currentUser } = useAuth()
  const { rights } = useRights()
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [userRights, setUserRights] = useState({})
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('active')

  useEffect(() => {
    if (rights.ADM_USER !== 1) { navigate('/customers'); return }
    loadData()
  }, [rights])

  async function loadData() {
    try {
      setLoading(true)
      const { data: usersData } = await supabase
        .from('user')
        .select('*')
        .order('username')
      setUsers(usersData || [])

      const { data: rightsData } = await supabase
        .from('UserModule_Rights')
        .select('userid, rightcode, right_value')

      const rightsMap = {}
      rightsData?.forEach(r => {
        if (!rightsMap[r.userid]) rightsMap[r.userid] = {}
        rightsMap[r.userid][r.rightcode] = r.right_value
      })
      setUserRights(rightsMap)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleActivate(userid) {
    await supabase.from('user').update({ record_status: 'ACTIVE' }).eq('userid', userid)
    loadData()
  }

  async function handleDeactivate(userid) {
    await supabase.from('user').update({ record_status: 'INACTIVE' }).eq('userid', userid)
    loadData()
  }

  const activeUsers = users.filter(u => u.record_status === 'ACTIVE')
  const pendingUsers = users.filter(u => u.record_status === 'INACTIVE' && u.stamp === 'PROVISIONED')
  const inactiveUsers = users.filter(u => u.record_status === 'INACTIVE' && u.stamp !== 'PROVISIONED')

  const rightCodes = ['CUST_VIEW', 'CUST_ADD', 'CUST_EDIT', 'CUST_DEL', 'SALES_VIEW', 'PROD_VIEW', 'ADM_USER']
  const rightLabels = {
    CUST_VIEW: 'View', CUST_ADD: 'Add', CUST_EDIT: 'Edit', CUST_DEL: 'Delete',
    SALES_VIEW: 'Sales', PROD_VIEW: 'Products', ADM_USER: 'Admin'
  }

  const displayUsers = activeTab === 'active' ? activeUsers :
    activeTab === 'pending' ? pendingUsers : inactiveUsers

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-sm text-gray-400 mt-0.5">{users.length} registered users</p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-rose-100 text-rose-700">
          Admin Only
        </span>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { key: 'active', label: 'Active', count: activeUsers.length, color: 'emerald' },
          { key: 'pending', label: 'Pending Activation', count: pendingUsers.length, color: 'amber' },
          { key: 'inactive', label: 'Deactivated', count: inactiveUsers.length, color: 'gray' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-rose-500 text-white shadow-sm'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {tab.label}
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
              activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Pending Alert */}
      {pendingUsers.length > 0 && activeTab === 'pending' && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-4 flex items-center gap-3">
          <span className="text-2xl">⏳</span>
          <div>
            <p className="text-sm font-semibold text-amber-800">
              {pendingUsers.length} user{pendingUsers.length > 1 ? 's' : ''} waiting for activation
            </p>
            <p className="text-xs text-amber-600">
              These users have registered but need your approval to access the system.
            </p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {displayUsers.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">
              {activeTab === 'pending' ? '⏳' : activeTab === 'active' ? '👥' : '🗂️'}
            </p>
            <p className="text-gray-400 text-sm font-medium">
              No {activeTab} users found
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                  {activeTab === 'active' && rightCodes.map(code => (
                    <th key={code} className="px-4 py-4 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      {rightLabels[code]}
                    </th>
                  ))}
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array(3).fill(0).map((_, i) => (
                    <tr key={i} className="border-b border-gray-50">
                      <td className="px-6 py-4"><div className="skeleton h-4 w-32"></div></td>
                      <td className="px-6 py-4"><div className="skeleton h-4 w-20"></div></td>
                      <td className="px-6 py-4"><div className="skeleton h-4 w-16"></div></td>
                      <td className="px-6 py-4"><div className="skeleton h-4 w-20"></div></td>
                    </tr>
                  ))
                ) : displayUsers.map((u) => {
                  const isSuperAdmin = u.user_type === 'SUPERADMIN'
                  return (
                    <tr key={u.userid} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0 bg-rose-400">
                            {(u.username || 'U')[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{u.username}</p>
                            {isSuperAdmin && (
                              <span className="text-xs text-amber-600">🔒 Protected</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium
                          ${u.user_type === 'SUPERADMIN' ? 'bg-amber-100 text-amber-700' :
                            u.user_type === 'ADMIN' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-600'}`}>
                          {u.user_type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium
                          ${u.record_status === 'ACTIVE' ? 'bg-rose-100 text-rose-700' :
                            u.stamp === 'PROVISIONED' ? 'bg-amber-100 text-amber-700' :
                            'bg-gray-100 text-gray-600'}`}>
                          {u.stamp === 'PROVISIONED' && u.record_status === 'INACTIVE' ? 'Pending' : u.record_status}
                        </span>
                      </td>

                      {/* Rights toggles for active users */}
                      {activeTab === 'active' && rightCodes.map(code => (
                        <td key={code} className="px-4 py-4 text-center">
                          <Toggle
                            checked={(userRights[u.userid]?.[code] || 0) === 1}
                            onChange={() => {}}
                            disabled={true}
                          />
                        </td>
                      ))}

                      <td className="px-6 py-4 text-right">
                        {isSuperAdmin ? (
                          <span className="text-xs text-gray-300 italic">Protected</span>
                        ) : activeTab === 'pending' ? (
                          <button
                            onClick={() => handleActivate(u.userid)}
                            className="px-4 py-2 bg-rose-500 text-white rounded-xl text-xs font-semibold hover:bg-rose-600 transition-colors"
                          >
                            ✓ Activate
                          </button>
                        ) : activeTab === 'active' ? (
                          <button
                            onClick={() => handleDeactivate(u.userid)}
                            className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-xs font-semibold hover:bg-gray-200 transition-colors"
                          >
                            Deactivate
                          </button>
                        ) : (
                          <button
                            onClick={() => handleActivate(u.userid)}
                            className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-xs font-semibold hover:bg-emerald-600 transition-colors"
                          >
                            Reactivate
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}