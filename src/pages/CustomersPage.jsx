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

  useEffect(() => {
    loadCustomers()
  }, [])

  async function loadCustomers() {
    try {
      setLoading(true)
      const data = await getCustomers(currentUser?.user_type)
      setCustomers(data)
    } catch (err) {
      console.error('Error loading customers:', err)
    } finally {
      setLoading(false)
    }
  }

  const filtered = customers.filter(c =>
    c.custname?.toLowerCase().includes(search.toLowerCase()) ||
    c.payterm?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Customers</h1>
        {rights.CUST_ADD === 1 && (
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm font-semibold"
          >
            + Add Customer
          </button>
        )}
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by name or payterm..."
        className="w-full border rounded px-3 py-2 mb-4 text-sm"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {/* Table */}
      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading customers...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-10 text-gray-500">No customers found</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded shadow text-sm">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-4 py-3 text-left">Cust No</th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Address</th>
                <th className="px-4 py-3 text-left">Pay Term</th>
                <th className="px-4 py-3 text-left">Status</th>
                {(currentUser?.user_type === 'ADMIN' ||
                  currentUser?.user_type === 'SUPERADMIN') && (
                  <th className="px-4 py-3 text-left">Stamp</th>
                )}
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr
                  key={c.custno}
                  className={`border-b hover:bg-gray-50 cursor-pointer
                    ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                    ${c.record_status === 'INACTIVE' ? 'opacity-50' : ''}
                  `}
                >
                  <td
                    className="px-4 py-3 text-blue-600 hover:underline"
                    onClick={() => navigate(`/customers/${c.custno}`)}
                  >
                    {c.custno}
                  </td>
                  <td className="px-4 py-3">{c.custname}</td>
                  <td className="px-4 py-3">{c.address}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-semibold
                      ${c.payterm === 'COD' ? 'bg-green-100 text-green-700' :
                        c.payterm === '30D' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'}`}>
                      {c.payterm}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-semibold
                      ${c.record_status === 'ACTIVE' ?
                        'bg-green-100 text-green-700' :
                        'bg-red-100 text-red-700'}`}>
                      {c.record_status}
                    </span>
                  </td>
                  {(currentUser?.user_type === 'ADMIN' ||
                    currentUser?.user_type === 'SUPERADMIN') && (
                    <td className="px-4 py-3 text-xs text-gray-400">
                      {c.stamp}
                    </td>
                  )}
                  <td className="px-4 py-3 flex gap-2">
                    {rights.CUST_EDIT === 1 && (
                      <button
                        onClick={() => {
                          setSelectedCustomer(c)
                          setShowEditModal(true)
                        }}
                        className="bg-yellow-400 text-white px-2 py-1 rounded text-xs hover:bg-yellow-500"
                      >
                        Edit
                      </button>
                    )}
                    {rights.CUST_DEL === 1 &&
                      c.record_status === 'ACTIVE' && (
                      <button
                        onClick={() => {
                          setSelectedCustomer(c)
                          setShowDeleteDialog(true)
                        }}
                        className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <AddCustomerModal
          onClose={() => setShowAddModal(false)}
          onSaved={loadCustomers}
        />
      )}

      {/* Edit Modal */}
      {showEditModal && selectedCustomer && (
        <EditCustomerModal
          customer={selectedCustomer}
          onClose={() => setShowEditModal(false)}
          onSaved={loadCustomers}
        />
      )}

      {/* Delete Dialog */}
      {showDeleteDialog && selectedCustomer && (
        <SoftDeleteDialog
          customer={selectedCustomer}
          onClose={() => setShowDeleteDialog(false)}
          onDeleted={loadCustomers}
          userId={currentUser?.id}
        />
      )}
    </div>
  )
}

// ADD CUSTOMER MODAL
function AddCustomerModal({ onClose, onSaved }) {
  const [form, setForm] = useState({
    custno: '', custname: '', address: '', payterm: 'COD'
  })
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
        <h2 className="text-lg font-bold mb-4">Add Customer</h2>
        {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-3 text-sm">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Customer No</label>
            <input
              className="w-full border rounded px-3 py-2 text-sm"
              value={form.custno}
              onChange={e => setForm({...form, custno: e.target.value})}
              required placeholder="e.g. C0083"
            />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Customer Name</label>
            <input
              className="w-full border rounded px-3 py-2 text-sm"
              value={form.custname}
              onChange={e => setForm({...form, custname: e.target.value})}
              required placeholder="Enter name"
            />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Address</label>
            <input
              className="w-full border rounded px-3 py-2 text-sm"
              value={form.address}
              onChange={e => setForm({...form, address: e.target.value})}
              placeholder="Enter address"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Pay Term</label>
            <select
              className="w-full border rounded px-3 py-2 text-sm"
              value={form.payterm}
              onChange={e => setForm({...form, payterm: e.target.value})}
            >
              <option value="COD">COD</option>
              <option value="30D">30D</option>
              <option value="45D">45D</option>
            </select>
          </div>
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={onClose}
              className="px-4 py-2 border rounded text-sm hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
              {loading ? 'Saving...' : 'Save'}
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
    custname: customer.custname,
    address: customer.address,
    payterm: customer.payterm
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
        <h2 className="text-lg font-bold mb-4">Edit Customer — {customer.custno}</h2>
        {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-3 text-sm">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Customer Name</label>
            <input
              className="w-full border rounded px-3 py-2 text-sm"
              value={form.custname}
              onChange={e => setForm({...form, custname: e.target.value})}
              required
            />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Address</label>
            <input
              className="w-full border rounded px-3 py-2 text-sm"
              value={form.address}
              onChange={e => setForm({...form, address: e.target.value})}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Pay Term</label>
            <select
              className="w-full border rounded px-3 py-2 text-sm"
              value={form.payterm}
              onChange={e => setForm({...form, payterm: e.target.value})}
            >
              <option value="COD">COD</option>
              <option value="30D">30D</option>
              <option value="45D">45D</option>
            </select>
          </div>
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={onClose}
              className="px-4 py-2 border rounded text-sm hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="px-4 py-2 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600">
              {loading ? 'Saving...' : 'Update'}
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
    console.log('Deleting customer:', customer.custno)
    console.log('User ID:', userId)
    
    const { data, error } = await supabase
      .from('customer')
      .update({ 
        record_status: 'INACTIVE', 
       stamp: `DEL-${new Date().toISOString().slice(0,10)}`
      })
      .eq('custno', customer.custno)
    
    console.log('Delete result:', data)
    console.log('Delete error:', error)
    
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-xl">
        <h2 className="text-lg font-bold mb-2 text-red-600">Confirm Delete</h2>
        <p className="text-sm text-gray-600 mb-4">
          Are you sure you want to deactivate <strong>{customer.custname}</strong>?
          This customer will be hidden from regular users.
        </p>
        <div className="flex gap-2 justify-end">
          <button onClick={onClose}
            className="px-4 py-2 border rounded text-sm hover:bg-gray-50">
            Cancel
          </button>
          <button onClick={handleDelete} disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700">
            {loading ? 'Deleting...' : 'Yes, Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}