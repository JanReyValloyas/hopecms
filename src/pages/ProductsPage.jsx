import { useEffect, useState } from 'react'
import { getProducts } from '../services/productService'

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    loadProducts()
  }, [])

  async function loadProducts() {
    try {
      setLoading(true)
      const data = await getProducts()
      setProducts(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const filtered = products.filter(p =>
    p.description?.toLowerCase().includes(search.toLowerCase()) ||
    p.prodcode?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Product Catalogue</h1>
        <span className="text-sm text-gray-500">Read-only</span>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by product name or code..."
        className="w-full border rounded px-3 py-2 mb-4 text-sm"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {/* Table */}
      {loading ? (
        <div className="text-center py-10 text-gray-500">
          Loading products...
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No products found
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded shadow text-sm">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-4 py-3 text-left">Product Code</th>
                <th className="px-4 py-3 text-left">Description</th>
                <th className="px-4 py-3 text-left">Unit</th>
                <th className="px-4 py-3 text-left">Current Price</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <tr
                  key={p.prodcode}
                  className={`border-b hover:bg-gray-50
                    ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                >
                  <td className="px-4 py-3 font-medium">{p.prodcode}</td>
                  <td className="px-4 py-3">{p.description}</td>
                  <td className="px-4 py-3">{p.unit}</td>
                  <td className="px-4 py-3 font-semibold text-green-700">
                    ₱{Number(p.unitprice).toLocaleString('en-PH', {
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