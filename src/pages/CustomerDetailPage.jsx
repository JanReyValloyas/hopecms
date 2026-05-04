import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { getSalesByCustomer, getSalesDetail } from '../services/salesService'

export default function CustomerDetailPage() {
  const { custno } = useParams()
  const navigate = useNavigate()
  const [customer, setCustomer] = useState(null)
  const [sales, setSales] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedTrans, setSelectedTrans] = useState(null)
  const [salesDetail, setSalesDetail] = useState([])
  const [detailLoading, setDetailLoading] = useState(false)

  useEffect(() => {
    loadData()
  }, [custno])

  async function loadData() {
    try {
      setLoading(true)
      // Get customer
      const { data: custData } = await supabase
        .from('customer')
        .select('*')
        .eq('custno', custno)
        .single()
      setCustomer(custData)

      // Get sales
      const salesData = await getSalesByCustomer(custno)
      setSales(salesData)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleTransClick(transNo) {
    setSelectedTrans(transNo)
    setDetailLoading(true)
    try {
      const data = await getSalesDetail(transNo)
      setSalesDetail(data)
    } catch (err) {
      console.error(err)
    } finally {
      setDetailLoading(false)
    }
  }

  if (loading) return <div className="text-center py-10">Loading...</div>
  if (!customer) return <div className="text-center py-10">Customer not found</div>

  return (
    <div>
      {/* Back button */}
      <button
        onClick={() => navigate('/customers')}
        className="mb-4 text-blue-600 hover:underline text-sm"
      >
        ← Back to Customers
      </button>

      {/* Customer Profile */}
      <div className="bg-white rounded shadow p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          {customer.custname}
        </h1>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-500">Customer No:</span>
            <span className="ml-2">{customer.custno}</span>
          </div>
          <div>
            <span className="font-medium text-gray-500">Address:</span>
            <span className="ml-2">{customer.address}</span>
          </div>
          <div>
            <span className="font-medium text-gray-500">Pay Term:</span>
            <span className="ml-2">{customer.payterm}</span>
          </div>
          <div>
            <span className="font-medium text-gray-500">Status:</span>
            <span className={`ml-2 px-2 py-1 rounded text-xs font-semibold
              ${customer.record_status === 'ACTIVE' ?
                'bg-green-100 text-green-700' :
                'bg-red-100 text-red-700'}`}>
              {customer.record_status}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Sales History Panel */}
        <div className="bg-white rounded shadow p-4">
          <h2 className="text-lg font-bold mb-3 text-gray-800">
            Sales History
          </h2>
          {sales.length === 0 ? (
            <p className="text-gray-500 text-sm">No sales recorded</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2 text-left">Trans No</th>
                  <th className="px-3 py-2 text-left">Date</th>
                  <th className="px-3 py-2 text-left">Emp No</th>
                </tr>
              </thead>
              <tbody>
                {sales.map(s => (
                  <tr
                    key={s.transNo}
                    onClick={() => handleTransClick(s.transNo)}
                    className={`border-b cursor-pointer hover:bg-blue-50
                      ${selectedTrans === s.transNo ? 'bg-blue-100' : ''}`}
                  >
                    <td className="px-3 py-2 text-blue-600">{s.transno}</td>
                    <td className="px-3 py-2">{s.salesdate}</td>
                    <td className="px-3 py-2">{s.empno}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Sales Detail Panel */}
        <div className="bg-white rounded shadow p-4">
          <h2 className="text-lg font-bold mb-3 text-gray-800">
            {selectedTrans ? `Transaction: ${selectedTrans}` : 'Select a transaction'}
          </h2>
          {!selectedTrans ? (
            <p className="text-gray-500 text-sm">
              Click a transaction to see line items
            </p>
          ) : detailLoading ? (
            <p className="text-gray-500 text-sm">Loading...</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2 text-left">Product</th>
                  <th className="px-3 py-2 text-left">Qty</th>
                  <th className="px-3 py-2 text-left">Unit</th>
                </tr>
              </thead>
              <tbody>
                {salesDetail.map((sd, i) => (
                  <tr key={i} className="border-b">
                    <td className="px-3 py-2">
                      {sd.product?.description || sd.prodCode}
                    </td>
                    <td className="px-3 py-2">{sd.quantity}</td>
                    <td className="px-3 py-2">{sd.product?.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}