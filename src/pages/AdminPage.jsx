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

  useEffect(() => {
    if (rights.ADM_USER !== 1) { navigate('/customers'); return }
    loadData()
  }, [rights])

  async function loadData() {
    try {
      setLoading(true)
      const { data: usersData } = await supabase.from('user').select('*').order('username')
      setUsers(usersData || [])

      // Load all rights
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

  async function handleStatusToggle(user) {
    if (user.user_type === 'SUPERADMIN') return
    const newStatus = user.record_status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
    await supabase.from('user').update({ record_status: newStatus }).eq('userid', user.userid)
    loadData()
  }

  const rightCodes = ['CUST_VIEW', 'CUST_ADD', 'CUST_EDIT', 'CUST_DEL', 'SALES_VIEW', 'PROD_VIEW', 'ADM_USER']
  const rightLabels = {
    CUST_VIEW: 'View', CUST_ADD: 'Add', CUST_EDIT: 'Edit', CUST_DEL: 'Delete',
    SALES_VIEW: 'Sales', PROD_VIEW: 'Products', ADM_USER: 'Admin'
  }

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

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">Active</th>
                {rightCodes.map(code => (
                  <th key={code} className="px-4 py-4 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {rightLabels[code]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array(3).fill(0).map((_, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    <td className="px-6 py-4"><div className="skeleton h-4 w-32"></div></td>
                    <td className="px-6 py-4"><div className="skeleton h-4 w-20"></div></td>
                    {Array(8).fill(0).map((_, j) => (
                      <td key={j} className="px-4 py-4"><div className="skeleton h-5 w-9 mx-auto"></div></td>
                    ))}
                  </tr>
                ))
              ) : users.map((u) => {
                const isSuperAdmin = u.user_type === 'SUPERADMIN'
                const isActive = u.record_status === 'ACTIVE'
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
                            <span className="text-xs text-amber-600 flex items-center gap-1">
                              🔒 Protected
                            </span>
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
                    <td className="px-6 py-4 text-center">
                      <Toggle
                        checked={isActive}
                        onChange={() => handleStatusToggle(u)}
                        disabled={isSuperAdmin}
                      />
                    </td>
                    {rightCodes.map(code => (
                      <td key={code} className="px-4 py-4 text-center">
                        <Toggle
                          checked={(userRights[u.userid]?.[code] || 0) === 1}
                          onChange={() => {}}
                          disabled={true}
                        />
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}