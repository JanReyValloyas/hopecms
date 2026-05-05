import { useEffect, useState } from 'react'
import { getProductRevenue } from '../services/reportsService'

export default function ProductRevenuePage() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

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

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Product Revenue
        </h1>
        <span className="text-sm text-gray-500">Read-only</span>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading...</div>
      ) : data.length === 0 ? (
        <div className="text-center py-10 text-gray-500">No data found</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded shadow text-sm">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-4 py-3 text-left">Product Code</th>
                <th className="px-4 py-3 text-left">Description</th>
                <th className="px-4 py-3 text-left">Unit</th>
                <th className="px-4 py-3 text-right">Total Qty Sold</th>
                <th className="px-4 py-3 text-right">Total Revenue</th>
              </tr>
            </thead>
            <tbody>
              {data.map((p, i) => (
                <tr
                  key={p.prodcode}
                  className={`border-b hover:bg-gray-50
                    ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                >
                  <td className="px-4 py-3">{p.prodcode}</td>
                  <td className="px-4 py-3 font-medium">{p.description}</td>
                  <td className="px-4 py-3">{p.unit}</td>
                  <td className="px-4 py-3 text-right">{p.totalqtysold}</td>
                  <td className="px-4 py-3 text-right font-semibold text-green-700">
                    ₱{Number(p.totalrevenue || 0).toLocaleString('en-PH', {
                      minimumFractionDigits: 2
                    })}
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
