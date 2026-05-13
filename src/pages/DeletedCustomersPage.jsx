// M2-PR-05: DeletedCustomersPage + sidebar link gating
// M1-PR-04: /deleted-customers blocked for USER
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getCustomers, recoverCustomer } from '../services/customerService'
import { Trash2, CheckCircle } from 'lucide-react'

export default function DeletedCustomersPage() {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (currentUser?.user_type === 'USER') {
      navigate('/customers')
      return
    }
    loadDeletedCustomers()
  }, [currentUser])

  async function loadDeletedCustomers() {
    try {
      setLoading(true)
      const data = await getCustomers('ADMIN')
      setCustomers(data.filter(c => c.record_status === 'INACTIVE'))
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleRecover(custno) {
    try {
      await recoverCustomer(custno, currentUser?.id)
      loadDeletedCustomers()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Deleted Customers</h1>
          <p className="text-sm text-gray-500 mt-1">{customers.length} inactive customers</p>
        </div>
        <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-medium">
          Admin / Superadmin only
        </span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      ) : customers.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm">
         <CheckCircle size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No deleted customers</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Cust No</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Name</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Address</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Pay Term</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Stamp</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {customers.map((c) => (
                  <tr key={c.custno} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">{c.custno}</td>
                    <td className="px-4 py-3 text-gray-900">{c.custname}</td>
                    <td className="px-4 py-3 text-gray-600">{c.address}</td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                        {c.payterm}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400">{c.stamp}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleRecover(c.custno)}
                        className="bg-green-100 text-green-700 hover:bg-green-200 px-3 py-1 rounded-lg text-xs font-semibold transition-colors"
                      >
                        Recover
                      </button>
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