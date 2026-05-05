import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useRights } from '../context/UserRightsContext'
import { supabase } from '../supabaseClient'

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
      const { data, error } = await supabase.from('user').select('*').order('username')
      if (error) throw error
      setUsers(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleActivate(userid) {
    await supabase.from('user').update({ record_status: 'ACTIVE' }).eq('userid', userid)
    loadUsers()
  }

  async function handleDeactivate(userid) {
    await supabase.from('user').update({ record_status: 'INACTIVE' }).eq('userid', userid)
    loadUsers()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-sm text-gray-500 mt-1">{users.length} registered users</p>
        </div>
        <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-xs font-medium">
          Admin only
        </span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Username</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">User Type</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Status</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((u) => (
                  <tr key={u.userid} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">{u.username}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold
                        ${u.user_type === 'SUPERADMIN' ? 'bg-purple-100 text-purple-700' :
                          u.user_type === 'ADMIN' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'}`}>
                        {u.user_type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold
                        ${u.record_status === 'ACTIVE' ?
                          'bg-green-100 text-green-700' :
                          'bg-red-100 text-red-700'}`}>
                        {u.record_status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {u.user_type === 'SUPERADMIN' ? (
                        <span className="text-xs text-gray-400 italic flex items-center gap-1">
                          🔒 Protected
                        </span>
                      ) : (
                        <div className="flex gap-2">
                          {u.record_status === 'INACTIVE' && (
                            <button onClick={() => handleActivate(u.userid)}
                              className="bg-green-100 text-green-700 hover:bg-green-200 px-3 py-1 rounded-lg text-xs font-semibold transition-colors">
                              Activate
                            </button>
                          )}
                          {u.record_status === 'ACTIVE' && (
                            <button onClick={() => handleDeactivate(u.userid)}
                              className="bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1 rounded-lg text-xs font-semibold transition-colors">
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
          </div>
        </div>
      )}
    </div>
  )
}