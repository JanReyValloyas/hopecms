import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { Search, ShoppingCart } from 'lucide-react'

export default function SalesPage() {
  const [sales, setSales] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => { loadSales() }, [])

  async function loadSales() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('sales')
        .select('*')
        .order('salesdate', { ascending: false })
      if (error) throw error
      setSales(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const filtered = sales.filter(s =>
    s.transno?.toLowerCase().includes(search.toLowerCase()) ||
    s.custno?.toLowerCase().includes(search.toLowerCase()) ||
    s.empno?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sales</h1>
          <p className="text-sm text-gray-500 mt-1">
            {filtered.length} of {sales.length} transactions
          </p>
        </div>
        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
          Read-only
        </span>
      </div>

      <div className="relative mb-4">
        <Search size={16} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search by transaction no, customer no, or employee..."
          className="w-full border border-gray-300 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm">
          <ShoppingCart size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No sales found</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Trans No</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Date</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Customer No</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Employee No</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((s) => (
                  <tr key={s.transno} className="hover:bg-blue-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-blue-600">{s.transno}</td>
                    <td className="px-4 py-3 text-gray-600">{s.salesdate}</td>
                    <td className="px-4 py-3 text-gray-900">{s.custno}</td>
                    <td className="px-4 py-3 text-gray-900">{s.empno}</td>
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