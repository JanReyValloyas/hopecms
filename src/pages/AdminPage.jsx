import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useRights } from '../context/UserRightsContext'
import { supabase } from '../supabaseClient'
import { Users, Shield, Lock } from 'lucide-react'

export default function AdminPage() {
  const { currentUser } = useAuth()
  const { rights } = useRights()
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (rights.ADM_USER !== 1) { navigate('/customers'); return }
    loadUsers()
  }, [rights])

  async function loadUsers() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('user')
        .select('*')
        .order('username')
      if (error) throw error
      setUsers(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleActivate(userid) {
    await supabase
      .from('user')
      .update({ record_status: 'ACTIVE' })
      .eq('userid', userid)
    loadUsers()
  }

  async function handleDeactivate(userid) {
    await supabase
      .from('user')
      .update({ record_status: 'INACTIVE' })
      .eq('userid', userid)
    loadUsers()
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
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-16">
           <Users size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No users found</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.userid} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0 bg-rose-400">
                        {(u.username || 'U')[0].toUpperCase()}
                      </div>
                      <p className="text-sm font-semibold text-gray-900">{u.username}</p>
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
                      ${u.record_status === 'ACTIVE' ?
                        'bg-rose-100 text-rose-700' :
                        'bg-gray-100 text-gray-600'}`}>
                      {u.record_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {u.user_type === 'SUPERADMIN' ? (
                     <span className="inline-flex items-center gap-1 px-4 py-1.5 text-xs text-gray-400 italic font-medium">
                     <Lock size={12} /> 
                      Protected
                     </span>
                    ) : (
                      <div className="flex gap-2 justify-end">
                        {u.record_status === 'INACTIVE' && (
                          <button
                            onClick={() => handleActivate(u.userid)}
                            className="px-4 py-1.5 bg-rose-500 text-white rounded-xl text-xs font-semibold hover:bg-rose-600 transition-colors"
                          >
                            Activate
                          </button>
                        )}
                        {u.record_status === 'ACTIVE' && (
                          <button
                            onClick={() => handleDeactivate(u.userid)}
                            className="px-4 py-1.5 bg-gray-100 text-gray-600 rounded-xl text-xs font-semibold hover:bg-gray-200 transition-colors"
                          >
                            Deactivate
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}