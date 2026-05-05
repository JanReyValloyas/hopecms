import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useRights } from '../context/UserRightsContext'
import { getCustomers, softDeleteCustomer } from '../services/customerService'
import { supabase } from '../supabaseClient'

export default function CustomersPage() {
  const { currentUser } = useAuth()
  const { rights } = useRights()
  const navigate = useNavigate()
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState(null)

  useEffect(() => { loadCustomers() }, [])

  async function loadCustomers() {
    try {
      setLoading(true)
      const data = await getCustomers(currentUser?.user_type)
      setCustomers(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const filtered = customers.filter(c =>
    c.custname?.toLowerCase().includes(search.toLowerCase()) ||
    c.payterm?.toLowerCase().includes(search.toLowerCase()) ||
    c.custno?.toLowerCase().includes(search.toLowerCase()) ||
    c.address?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="text-sm text-gray-500 mt-1">
            {filtered.length} of {customers.length} customers
          </p>
        </div>
        {rights.CUST_ADD === 1 && (
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold flex items-center gap-2"
          >
            <span>+</span> Add Customer
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
        <input
          type="text"
          placeholder="Search by name, customer no, address or payterm..."
          className="w-full border border-gray-300 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-gray-500">No customers found</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Cust No</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Name</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Address</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Pay Term</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Status</th>
                  {(currentUser?.user_type === 'ADMIN' ||
                    currentUser?.user_type === 'SUPERADMIN') && (
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Stamp</th>
                  )}
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((c) => (
                  <tr key={c.custno} className="hover:bg-blue-50 transition-colors">
                    <td
                      className="px-4 py-3 text-blue-600 hover:underline cursor-pointer font-medium"
                      onClick={() => navigate(`/customers/${c.custno}`)}
                    >
                      {c.custno}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">{c.custname}</td>
                    <td className="px-4 py-3 text-gray-600">{c.address}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold
                        ${c.payterm === 'COD' ? 'bg-green-100 text-green-700' :
                          c.payterm === '30D' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-blue-100 text-blue-700'}`}>
                        {c.payterm}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold
                        ${c.record_status === 'ACTIVE' ?
                          'bg-green-100 text-green-700' :
                          'bg-red-100 text-red-700'}`}>
                        {c.record_status}
                      </span>
                    </td>
                    {(currentUser?.user_type === 'ADMIN' ||
                      currentUser?.user_type === 'SUPERADMIN') && (
                      <td className="px-4 py-3 text-xs text-gray-400">{c.stamp}</td>
                    )}
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        {rights.CUST_EDIT === 1 && (
                          <button
                            onClick={() => { setSelectedCustomer(c); setShowEditModal(true) }}
                            className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 px-3 py-1 rounded-lg text-xs font-semibold transition-colors"
                          >
                            Edit
                          </button>
                        )}
                        {rights.CUST_DEL === 1 && c.record_status === 'ACTIVE' && (
                          <button
                            onClick={() => { setSelectedCustomer(c); setShowDeleteDialog(true) }}
                            className="bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1 rounded-lg text-xs font-semibold transition-colors"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showAddModal && (
        <AddCustomerModal onClose={() => setShowAddModal(false)} onSaved={loadCustomers} />
      )}
      {showEditModal && selectedCustomer && (
        <EditCustomerModal customer={selectedCustomer} onClose={() => setShowEditModal(false)} onSaved={loadCustomers} />
      )}
      {showDeleteDialog && selectedCustomer && (
        <SoftDeleteDialog customer={selectedCustomer} onClose={() => setShowDeleteDialog(false)} onDeleted={loadCustomers} userId={currentUser?.id} />
      )}
    </div>
  )
}

// ADD CUSTOMER MODAL
function AddCustomerModal({ onClose, onSaved }) {
  const [form, setForm] = useState({ custno: '', custname: '', address: '', payterm: 'COD' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const { addCustomer } = await import('../services/customerService')
      await addCustomer({ ...form, record_status: 'ACTIVE', stamp: '' })
      onSaved()
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <h2 className="text-lg font-bold mb-4 text-gray-900">Add New Customer</h2>
        {error && <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-3 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Customer No</label>
            <input className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.custno} onChange={e => setForm({...form, custno: e.target.value})} required placeholder="e.g. C0083" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
            <input className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.custname} onChange={e => setForm({...form, custname: e.target.value})} required placeholder="Enter name" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.address} onChange={e => setForm({...form, address: e.target.value})} placeholder="Enter address" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pay Term</label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.payterm} onChange={e => setForm({...form, payterm: e.target.value})}>
              <option value="COD">COD</option>
              <option value="30D">30D</option>
              <option value="45D">45D</option>
            </select>
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <button type="button" onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors disabled:opacity-50">
              {loading ? 'Saving...' : 'Save Customer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// EDIT CUSTOMER MODAL
function EditCustomerModal({ customer, onClose, onSaved }) {
  const [form, setForm] = useState({
    custname: customer.custname, address: customer.address, payterm: customer.payterm
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const { updateCustomer } = await import('../services/customerService')
      await updateCustomer(customer.custno, form)
      onSaved()
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <h2 className="text-lg font-bold mb-1 text-gray-900">Edit Customer</h2>
        <p className="text-sm text-gray-500 mb-4">Customer No: {customer.custno}</p>
        {error && <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-3 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
            <input className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.custname} onChange={e => setForm({...form, custname: e.target.value})} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pay Term</label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.payterm} onChange={e => setForm({...form, payterm: e.target.value})}>
              <option value="COD">COD</option>
              <option value="30D">30D</option>
              <option value="45D">45D</option>
            </select>
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <button type="button" onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg text-sm hover:bg-yellow-600 transition-colors disabled:opacity-50">
              {loading ? 'Updating...' : 'Update Customer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// SOFT DELETE DIALOG
function SoftDeleteDialog({ customer, onClose, onDeleted, userId }) {
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('customer')
        .update({
          record_status: 'INACTIVE',
          stamp: `DEL-${new Date().toISOString().slice(0,10)}`
        })
        .eq('custno', customer.custno)
      if (error) throw error
      onDeleted()
      onClose()
    } catch (err) {
      console.error('Delete failed:', err)
      alert('Error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <div className="text-center mb-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">🗑️</span>
          </div>
          <h2 className="text-lg font-bold text-gray-900">Delete Customer?</h2>
          <p className="text-sm text-gray-500 mt-1">
            Are you sure you want to deactivate <strong>{customer.custname}</strong>?
            This customer will be hidden from regular users.
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button onClick={handleDelete} disabled={loading}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors disabled:opacity-50">
            {loading ? 'Deleting...' : 'Yes, Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}