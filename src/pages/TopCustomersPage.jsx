import { useEffect, useState } from 'react'
import { getTopCustomers } from '../services/reportsService'
import { useNavigate } from 'react-router-dom'
import { Trophy, Medal } from 'lucide-react'

export default function TopCustomersPage() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => { loadData() }, [])

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
  const medals = [
  <Trophy size={20} className="text-yellow-400" />,
  <Medal size={20} className="text-gray-400" />,
  <Medal size={20} className="text-amber-600" />
]

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Top 10 Customers</h1>
          <p className="text-sm text-gray-500 mt-1">Ranked by total spend</p>
        </div>
        <span className="bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full text-xs font-medium">Report</span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-6">
          {data.map((c, i) => (
            <div
              key={c.custno}
              className="mb-5 cursor-pointer group"
              onClick={() => navigate(`/customers/${c.custno}`)}
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-xl w-8 text-center">
                    {i < 3 ? medals[i] : `#${i + 1}`}
                  </span>
                  <div>
                    <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {c.custname}
                    </p>
                    <p className="text-xs text-gray-400">{c.custno} · {c.totaltransactions} transactions</p>
                  </div>
                </div>
                <span className="font-bold text-green-700">
                  ₱{Number(c.totalspend || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full transition-all
                    ${i === 0 ? 'bg-yellow-400' :
                      i === 1 ? 'bg-gray-400' :
                      i === 2 ? 'bg-amber-600' : 'bg-blue-500'}`}
                  style={{ width: `${(Number(c.totalspend) / maxSpend) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}