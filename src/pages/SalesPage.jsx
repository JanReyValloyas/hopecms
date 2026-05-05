import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

export default function SalesPage() {
  const [sales, setSales] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    loadSales()
  }, [])

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
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Sales</h1>
        <span className="text-sm text-gray-500">Read-only</span>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by transaction no, customer no, or employee..."
        className="w-full border rounded px-3 py-2 mb-4 text-sm"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {/* Table */}
      {loading ? (
        <div className="text-center py-10 text-gray-500">
          Loading sales...
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No sales recorded
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded shadow text-sm">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-4 py-3 text-left">Trans No</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Customer No</th>
                <th className="px-4 py-3 text-left">Employee No</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => (
                <tr
                  key={s.transno}
                  className={`border-b hover:bg-gray-50
                    ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                >
                  <td className="px-4 py-3 font-medium text-blue-600">
                    {s.transno}
                  </td>
                  <td className="px-4 py-3">{s.salesdate}</td>
                  <td className="px-4 py-3">{s.custno}</td>
                  <td className="px-4 py-3">{s.empno}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}