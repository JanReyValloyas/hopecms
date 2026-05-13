// M2-PR-03: CustomerDetailPage + SalesHistoryPanel + SalesDetailModal

import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { getSalesByCustomer, getSalesDetail } from '../services/salesService'
import { ArrowLeft, User, MousePointerClick } from 'lucide-react'

export default function CustomerDetailPage() {
  const { custno } = useParams()
  const navigate = useNavigate()
  const [customer, setCustomer] = useState(null)
  const [sales, setSales] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedTrans, setSelectedTrans] = useState(null)
  const [salesDetail, setSalesDetail] = useState([])
  const [detailLoading, setDetailLoading] = useState(false)

  useEffect(() => { loadData() }, [custno])

  async function loadData() {
    try {
      setLoading(true)
      const { data: custData } = await supabase
        .from('customer').select('*').eq('custno', custno).single()
      setCustomer(custData)
      const salesData = await getSalesByCustomer(custno)
      setSales(salesData)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleTransClick(transno) {
    setSelectedTrans(transno)
    setDetailLoading(true)
    try {
      const data = await getSalesDetail(transno)
      setSalesDetail(data)
    } catch (err) {
      console.error(err)
    } finally {
      setDetailLoading(false)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
    </div>
  )
  if (!customer) return (
    <div className="text-center py-20">
      <p className="text-gray-500">Customer not found</p>
    </div>
  )

  return (
    <div>
      {/* Back button */}
      <button
        onClick={() => navigate('/customers')}
        className="mb-4 text-blue-600 hover:underline text-sm flex items-center gap-1"
      >
       <ArrowLeft size={16} />
      </button>

      {/* Customer Profile */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">
              <User size={24} className="text-blue-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{customer.custname}</h1>
              <p className="text-sm text-gray-500">{customer.custno}</p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold
            ${customer.record_status === 'ACTIVE' ?
              'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {customer.record_status}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">Address</p>
            <p className="text-sm font-medium text-gray-900">{customer.address}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">Pay Term</p>
            <p className="text-sm font-medium text-gray-900">{customer.payterm}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">Total Transactions</p>
            <p className="text-sm font-medium text-gray-900">{sales.length}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Sales History */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Sales History</h2>
            <p className="text-xs text-gray-500">{sales.length} transactions</p>
          </div>
          {sales.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-400 text-sm">No sales recorded</p>
            </div>
          ) : (
            <div className="overflow-y-auto max-h-96">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Trans No</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Date</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Emp No</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {sales.map(s => (
                    <tr
                      key={s.transno}
                      onClick={() => handleTransClick(s.transno)}
                      className={`cursor-pointer transition-colors
                        ${selectedTrans === s.transno ?
                          'bg-blue-50 border-l-2 border-blue-500' :
                          'hover:bg-gray-50'}`}
                    >
                      <td className="px-4 py-2.5 text-blue-600 font-medium">{s.transno}</td>
                      <td className="px-4 py-2.5 text-gray-600">{s.salesdate}</td>
                      <td className="px-4 py-2.5 text-gray-600">{s.empno}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Sales Detail */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">
              {selectedTrans ? `Transaction: ${selectedTrans}` : 'Transaction Details'}
            </h2>
            <p className="text-xs text-gray-500">
              {selectedTrans ? `${salesDetail.length} line items` : 'Select a transaction'}
            </p>
          </div>
          {!selectedTrans ? (
            <div className="text-center py-10">
              <MousePointerClick size={32} className="text-gray-300 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">Click a transaction to see line items</p>
            </div>
          ) : detailLoading ? (
            <div className="flex items-center justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="overflow-y-auto max-h-96">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Product</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Qty</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Unit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {salesDetail.map((sd, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-4 py-2.5 text-gray-900">{sd.product?.description || sd.prodcode}</td>
                      <td className="px-4 py-2.5 text-gray-600">{sd.quantity}</td>
                      <td className="px-4 py-2.5 text-gray-600">{sd.product?.unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}