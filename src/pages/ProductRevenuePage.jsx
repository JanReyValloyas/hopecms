import { useEffect, useState } from 'react'
import { getProductRevenue } from '../services/reportsService'
import { useNavigate } from 'react-router-dom'
import { Search, TrendingUp } from 'lucide-react'

export default function ProductRevenuePage() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  useEffect(() => { loadData() }, [])

  async function loadData() {
    try {
      setLoading(true)
      const result = await getProductRevenue()
      setData(result)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const filtered = data.filter(p =>
    p.description?.toLowerCase().includes(search.toLowerCase()) ||
    p.prodcode?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Revenue</h1>
          <p className="text-sm text-gray-500 mt-1">{filtered.length} products</p>
        </div>
        <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-medium">Report</span>
      </div>

      <div className="relative mb-4">
        <Search size={16} className="text-gray-400" />
        <input type="text" placeholder="Search by product name or code..."
          className="w-full border border-gray-300 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          value={search} onChange={e => setSearch(e.target.value)} />
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
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Product Code</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Description</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Unit</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600">Total Qty Sold</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600">Total Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((p, i) => (
                  <tr
  key={p.prodcode}
  className="border-b border-gray-50 hover:bg-rose-50/30 transition-colors"
>
                    <td className="px-4 py-3 font-medium text-blue-600">{p.prodcode}</td>
                    <td className="px-4 py-3 text-gray-900">{p.description}</td>
                    <td className="px-4 py-3 text-gray-600">{p.unit}</td>
                    <td className="px-4 py-3 text-right text-gray-900">{p.totalqtysold}</td>
                    <td className="px-4 py-3 text-right font-semibold text-green-700">
                      ₱{Number(p.totalrevenue || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
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