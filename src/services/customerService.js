import { supabase } from '../supabaseClient'

// Get all customers
export async function getCustomers(userType) {
  let query = supabase
    .from('customer')
    .select('*')
    .order('custno')

  // USER only sees ACTIVE customers
  if (userType === 'USER') {
    query = query.eq('record_status', 'ACTIVE')
  }

  const { data, error } = await query
  if (error) throw error
  return data
}

// Add new customer
export async function addCustomer(customer) {
  const { data, error } = await supabase
    .from('customer')
    .insert([customer])
    .select()
  if (error) throw error
  return data
}

// Update customer
export async function updateCustomer(custno, updates) {
  const { data, error } = await supabase
    .from('customer')
    .update(updates)
    .eq('custno', custno)
    .select()
  if (error) throw error
  return data
}

// Soft delete customer
export async function softDeleteCustomer(custno, userId) {
 const stamp = `DEL-${new Date().toISOString().slice(0,10)}`
  const { error } = await supabase
    .from('customer')
    .update({ record_status: 'INACTIVE', stamp })
    .eq('custno', custno)
  if (error) throw error
}

// Recover customer
export async function recoverCustomer(custno, userId) {
const stamp = `RECV-${new Date().toISOString().slice(0,10)}`
  const { error } = await supabase
    .from('customer')
    .update({ record_status: 'ACTIVE', stamp })
    .eq('custno', custno)
  if (error) throw error
}