import { useEffect, useState } from 'react'
import { getTopCustomers } from '../services/reportsService'
import { useNavigate } from 'react-router-dom'

export default function TopCustomersPage() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      setLoading(true)
      const result = await getTopCustomers()
      setData(result)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const maxSpend = data.length > 0 ? Number(data[0].totalspend) : 1

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        🏆 Top 10 Customers
      </h1>

      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading...</div>
      ) : (
        <div className="bg-white rounded shadow p-6">
          {data.map((c, i) => (
            <div
              key={c.custno}
              className="mb-4 cursor-pointer hover:opacity-80"
              onClick={() => navigate(`/customers/${c.custno}`)}
            >
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-2">
                  <span className={`w-7 h-7 rounded-full flex items-center 
                    justify-center text-white text-xs font-bold
                    ${i === 0 ? 'bg-yellow-400' :
                      i === 1 ? 'bg-gray-400' :
                      i === 2 ? 'bg-amber-600' : 'bg-blue-400'}`}>
                    {i + 1}
                  </span>
                  <span className="font-medium text-sm">{c.custname}</span>
                </div>
                <span className="text-sm font-semibold text-green-700">
                  ₱{Number(c.totalspend || 0).toLocaleString('en-PH', {
                    minimumFractionDigits: 2
                  })}
                </span>
              </div>
              {/* Bar chart */}
              <div className="w-full bg-gray-100 rounded-full h-3">
                <div
                  className="bg-blue-500 h-3 rounded-full"
                  style={{
                    width: `${(Number(c.totalspend) / maxSpend) * 100}%`
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}