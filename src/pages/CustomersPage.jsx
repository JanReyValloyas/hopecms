import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useRights } from '../context/UserRightsContext'
import { getCustomers, softDeleteCustomer } from '../services/customerService'
import { supabase } from '../supabaseClient'

function Toggle({ checked, onChange }) {
  return (
    <label className="toggle-switch">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className="toggle-slider"></span>
    </label>
  )
}

function SkeletonRow() {
  return (
    <tr className="border-b border-gray-100">
      {Array(6).fill(0).map((_, i) => (
        <td key={i} className="px-6 py-4">
          <div className="skeleton h-4 w-24"></div>
        </td>
      ))}
    </tr>
  )
}

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
  const [openMenuId, setOpenMenuId] = useState(null)
  const [page, setPage] = useState(1)
  const perPage = 10

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
    c.custno?.toLowerCase().includes(search.toLowerCase()) ||
    c.address?.toLowerCase().includes(search.toLowerCase()) ||
    c.payterm?.toLowerCase().includes(search.toLowerCase())
  )

  const totalPages = Math.ceil(filtered.length / perPage)
  const paginated = filtered.slice((page - 1) * perPage, page * perPage)

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="text-sm text-gray-400 mt-0.5">{filtered.length} total accounts</p>
        </div>
        {rights.CUST_ADD === 1 && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-rose-500 hover:bg-rose-600 transition-colors shadow-sm"
          >
            <span>+</span> Create New Customer
          </button>
        )}
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-4 p-4 flex items-center gap-3">
       <Search size={16} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, ID, address or pay term..."
          className="flex-1 text-sm outline-none text-gray-900 placeholder-gray-400"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }}
        />
        {search && (
          <button onClick={() => setSearch('')} className="text-gray-400 hover:text-gray-600 text-xs">
            Clear
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Address</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Pay Term</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
              {(currentUser?.user_type === 'ADMIN' || currentUser?.user_type === 'SUPERADMIN') && (
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Stamp</th>
              )}
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array(10).fill(0).map((_, i) => <SkeletonRow key={i} />)
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <span className="text-5xl">🔍</span>
                    <p className="text-gray-400 text-sm font-medium">No customers found</p>
                    <p className="text-gray-300 text-xs">Try adjusting your search</p>
                  </div>
                </td>
              </tr>
            ) : paginated.map((c) => (
              <tr key={c.custno} className="border-b border-gray-50 hover:bg-rose-50/30 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0 cursor-pointer"
                      style={{background: `hsl(${c.custno.charCodeAt(1) * 20}, 65%, 60%)`}}
                      onClick={() => navigate(`/customers/${c.custno}`)}
                    >
                      {c.custname[0]}
                    </div>
                    <div>
                      <p
                        className="text-sm font-semibold text-gray-900 hover:text-rose-600 cursor-pointer transition-colors"
                        onClick={() => navigate(`/customers/${c.custno}`)}
                      >
                        {c.custname}
                      </p>
                      <p className="text-xs text-gray-400">{c.custno}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{c.address}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium
                    ${c.payterm === 'COD' ? 'bg-emerald-100 text-emerald-700' :
                      c.payterm === '30D' ? 'bg-blue-100 text-blue-700' :
                      'bg-purple-100 text-purple-700'}`}>
                    {c.payterm}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium
                    ${c.record_status === 'ACTIVE' ?
                      'bg-rose-100 text-rose-700' :
                      'bg-gray-100 text-gray-600'}`}>
                    {c.record_status}
                  </span>
                </td>
                {(currentUser?.user_type === 'ADMIN' || currentUser?.user_type === 'SUPERADMIN') && (
                  <td className="px-6 py-4 text-xs text-gray-300">{c.stamp}</td>
                )}
                <td className="px-6 py-4 text-right">
                  <div className="relative inline-block">
                    <button
                      onClick={() => setOpenMenuId(openMenuId === c.custno ? null : c.custno)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all opacity-0 group-hover:opacity-100"
                    >
                      •••
                    </button>
                    {openMenuId === c.custno && (
                      <div className="absolute right-0 top-10 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-20 w-44">
                        <button
                          onClick={() => { navigate(`/customers/${c.custno}`); setOpenMenuId(null) }}
                          className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left flex items-center gap-2"
                        >
                          <span>👁️</span> View Details
                        </button>
                        {rights.CUST_EDIT === 1 && (
                          <button
                            onClick={() => { setSelectedCustomer(c); setShowEditModal(true); setOpenMenuId(null) }}
                            className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left flex items-center gap-2"
                          >
                            <span>✏️</span> Edit Details
                          </button>
                        )}
                        {rights.CUST_DEL === 1 && c.record_status === 'ACTIVE' && (
                          <>
                            <div className="h-px bg-gray-100 my-1"></div>
                            <button
                              onClick={() => { setSelectedCustomer(c); setShowDeleteDialog(true); setOpenMenuId(null) }}
                              className="w-full px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 text-left flex items-center gap-2"
                            >
                              <span>🗑️</span> Delete Customer
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        {!loading && filtered.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs text-gray-400">
              Showing <span className="font-semibold text-gray-600">{(page - 1) * perPage + 1}</span>–
              <span className="font-semibold text-gray-600">{Math.min(page * perPage, filtered.length)}</span> of{' '}
              <span className="font-semibold text-gray-600">{filtered.length}</span> customers
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm"
              >
                ‹
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = page <= 3 ? i + 1 : page - 2 + i
                if (pageNum > totalPages) return null
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium transition-all
                      ${pageNum === page ? 'bg-rose-500 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
                  >
                    {pageNum}
                  </button>
                )
              })}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm"
              >
                ›
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close menu */}
      {openMenuId && (
        <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />
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

// ADD MODAL
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
      onSaved(); onClose()
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">New Customer</h2>
            <p className="text-sm text-gray-400 mt-0.5">Add a new account to the system</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors">✕</button>
        </div>
        {error && <div className="bg-rose-50 text-rose-700 p-3 rounded-xl mb-4 text-sm border border-rose-100">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: 'Customer No', key: 'custno', placeholder: 'e.g. C0083' },
            { label: 'Customer Name', key: 'custname', placeholder: 'Full name or company' },
            { label: 'Address', key: 'address', placeholder: 'Street, City, State' },
          ].map(field => (
            <div key={field.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{field.label}</label>
              <input
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all"
                value={form[field.key]}
                onChange={e => setForm({...form, [field.key]: e.target.value})}
                required={field.key !== 'address'}
                placeholder={field.placeholder}
              />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Pay Term</label>
            <select
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all bg-white"
              value={form.payterm}
              onChange={e => setForm({...form, payterm: e.target.value})}
            >
              <option value="COD">COD — Cash on Delivery</option>
              <option value="30D">30D — Net 30 Days</option>
              <option value="45D">45D — Net 45 Days</option>
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 px-4 py-2.5 bg-rose-500 text-white rounded-xl text-sm font-medium hover:bg-rose-600 transition-colors disabled:opacity-50">
              {loading ? 'Creating...' : 'Create Customer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// EDIT MODAL
function EditCustomerModal({ customer, onClose, onSaved }) {
  const [form, setForm] = useState({ custname: customer.custname, address: customer.address, payterm: customer.payterm })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const { updateCustomer } = await import('../services/customerService')
      await updateCustomer(customer.custno, form)
      onSaved(); onClose()
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Edit Customer</h2>
            <p className="text-sm text-gray-400 mt-0.5">{customer.custno}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors">✕</button>
        </div>
        {error && <div className="bg-rose-50 text-rose-700 p-3 rounded-xl mb-4 text-sm border border-rose-100">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: 'Customer Name', key: 'custname' },
            { label: 'Address', key: 'address' },
          ].map(field => (
            <div key={field.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{field.label}</label>
              <input
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all"
                value={form[field.key]}
                onChange={e => setForm({...form, [field.key]: e.target.value})}
                required={field.key === 'custname'}
              />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Pay Term</label>
            <select
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-rose-400 bg-white"
              value={form.payterm}
              onChange={e => setForm({...form, payterm: e.target.value})}
            >
              <option value="COD">COD</option>
              <option value="30D">30D</option>
              <option value="45D">45D</option>
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 px-4 py-2.5 bg-rose-500 text-white rounded-xl text-sm font-medium hover:bg-rose-600 transition-colors disabled:opacity-50">
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// DELETE DIALOG
function SoftDeleteDialog({ customer, onClose, onDeleted, userId }) {
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('customer')
        .update({ record_status: 'INACTIVE', stamp: `DEL-${new Date().toISOString().slice(0,10)}` })
        .eq('custno', customer.custno)
      if (error) throw error
      onDeleted(); onClose()
    } catch (err) { alert('Error: ' + err.message) }
    finally { setLoading(false) }
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl text-center">
        <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">🗑️</span>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Delete Customer?</h2>
        <p className="text-sm text-gray-500 mb-6">
          <strong>{customer.custname}</strong> will be deactivated and hidden from regular users.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">
            Cancel
          </button>
          <button onClick={handleDelete} disabled={loading}
            className="flex-1 px-4 py-2.5 bg-rose-500 text-white rounded-xl text-sm font-medium hover:bg-rose-600 disabled:opacity-50">
            {loading ? 'Deleting...' : 'Yes, Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}