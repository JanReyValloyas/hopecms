import { useEffect, useState } from 'react'
import { getCustomerSalesSummary } from '../services/reportsService'

export default function CustomerSalesSummaryPage() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    loadData()
  }, [])

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
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Customer Sales Summary
        </h1>
        <span className="text-sm text-gray-500">Report</span>
      </div>

      <input
        type="text"
        placeholder="Search by customer name..."
        className="w-full border rounded px-3 py-2 mb-4 text-sm"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-10 text-gray-500">No data found</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded shadow text-sm">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-4 py-3 text-left">Customer No</th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Pay Term</th>
                <th className="px-4 py-3 text-right">Transactions</th>
                <th className="px-4 py-3 text-right">Total Spend</th>
                <th className="px-4 py-3 text-left">Last Sale</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr
                  key={c.custno}
                  className={`border-b hover:bg-gray-50
                    ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                >
                  <td className="px-4 py-3">{c.custno}</td>
                  <td className="px-4 py-3 font-medium">{c.custname}</td>
                  <td className="px-4 py-3">{c.payterm}</td>
                  <td className="px-4 py-3 text-right">
                    {c.totaltransactions || 0}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-green-700">
                    ₱{Number(c.totalspend || 0).toLocaleString('en-PH', {
                      minimumFractionDigits: 2
                    })}
                  </td>
                  <td className="px-4 py-3">{c.lastsaledate || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}