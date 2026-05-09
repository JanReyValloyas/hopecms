import { useEffect, useState } from 'react'
import { getCustomerSalesSummary } from '../services/reportsService'
import { useNavigate } from 'react-router-dom'

export default function CustomerSalesSummaryPage() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  useEffect(() => { loadData() }, [])

  async function loadData() {
    try {
      setLoading(true)
      const result = await getCustomerSalesSummary()
      setData(result)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const filtered = data.filter(c =>
    c.custname?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer Sales Summary</h1>
          <p className="text-sm text-gray-500 mt-1">{filtered.length} customers</p>
        </div>
        <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-medium">Report</span>
      </div>

      <div className="relative mb-4">
        <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
        <input type="text" placeholder="Search by customer name..."
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
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Customer No</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Name</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Pay Term</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600">Transactions</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600">Total Spend</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Last Sale</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((c) => (
                   <tr
  key={c.custno}
  className="border-b border-gray-50 hover:bg-rose-50/30 transition-colors cursor-pointer"
  onClick={() => navigate(`/customers/${c.custno}`)}
>
                    <td className="px-4 py-3 font-medium text-blue-600">{c.custno}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{c.custname}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold
                        ${c.payterm === 'COD' ? 'bg-green-100 text-green-700' :
                          c.payterm === '30D' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-blue-100 text-blue-700'}`}>
                        {c.payterm}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-900">{c.totaltransactions || 0}</td>
                    <td className="px-4 py-3 text-right font-semibold text-green-700">
                      ₱{Number(c.totalspend || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{c.lastsaledate || 'N/A'}</td>
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