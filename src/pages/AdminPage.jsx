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
    // Block if no ADM_USER right
    if (rights.ADM_USER !== 1) {
      navigate('/customers')
      return
    }
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
    try {
      await supabase
        .from('user')
        .update({ record_status: 'ACTIVE' })
        .eq('userid', userid)
      loadUsers()
    } catch (err) {
      console.error(err)
    }
  }

  async function handleDeactivate(userid) {
    try {
      await supabase
        .from('user')
        .update({ record_status: 'INACTIVE' })
        .eq('userid', userid)
      loadUsers()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">
          User Management
        </h1>
        <span className="text-sm text-gray-500">Admin only</span>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500">
          Loading users...
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No users found
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded shadow text-sm">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-4 py-3 text-left">Username</th>
                <th className="px-4 py-3 text-left">User Type</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr
                  key={u.userid}
                  className={`border-b hover:bg-gray-50
                    ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                >
                  <td className="px-4 py-3 font-medium">{u.username}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-semibold
                      ${u.user_type === 'SUPERADMIN' ?
                        'bg-purple-100 text-purple-700' :
                        u.user_type === 'ADMIN' ?
                        'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'}`}>
                      {u.user_type}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-semibold
                      ${u.record_status === 'ACTIVE' ?
                        'bg-green-100 text-green-700' :
                        'bg-red-100 text-red-700'}`}>
                      {u.record_status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {/* SUPERADMIN rows are protected */}
                    {u.user_type === 'SUPERADMIN' ? (
                      <span
                        className="text-xs text-gray-400 italic"
                        title="SUPERADMIN accounts cannot be modified"
                      >
                        🔒 Protected
                      </span>
                    ) : (
                      <div className="flex gap-2">
                        {u.record_status === 'INACTIVE' && (
                          <button
                            onClick={() => handleActivate(u.userid)}
                            className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600"
                          >
                            Activate
                          </button>
                        )}
                        {u.record_status === 'ACTIVE' && (
                          <button
                            onClick={() => handleDeactivate(u.userid)}
                            className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
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
        </div>
      )}
    </div>
  )
}