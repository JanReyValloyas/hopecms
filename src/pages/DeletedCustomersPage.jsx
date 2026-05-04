import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getCustomers, recoverCustomer } from '../services/customerService'

export default function DeletedCustomersPage() {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Block USER from this page
    if (currentUser?.user_type === 'USER') {
      navigate('/customers')
      return
    }
    loadDeletedCustomers()
  }, [currentUser])

  async function loadDeletedCustomers() {
    try {
      setLoading(true)
      // Get ALL customers including INACTIVE
      const data = await getCustomers('ADMIN')
      // Filter only INACTIVE
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
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Deleted Customers
        </h1>
        <span className="text-sm text-gray-500">
          ADMIN / SUPERADMIN only
        </span>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading...</div>
      ) : customers.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No deleted customers found
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded shadow text-sm">
            <thead className="bg-red-600 text-white">
              <tr>
                <th className="px-4 py-3 text-left">Cust No</th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Address</th>
                <th className="px-4 py-3 text-left">Pay Term</th>
                <th className="px-4 py-3 text-left">Stamp</th>
                <th className="px-4 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c, i) => (
                <tr
                  key={c.custno}
                  className={`border-b hover:bg-gray-50
                    ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                >
                  <td className="px-4 py-3">{c.custno}</td>
                  <td className="px-4 py-3">{c.custname}</td>
                  <td className="px-4 py-3">{c.address}</td>
                  <td className="px-4 py-3">{c.payterm}</td>
                  <td className="px-4 py-3 text-xs text-gray-400">
                    {c.stamp}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleRecover(c.custno)}
                      className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600"
                    >
                      Recover
                    </button>
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