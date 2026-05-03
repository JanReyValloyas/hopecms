import { supabase } from '../supabaseClient'

// Get sales by customer
export async function getSalesByCustomer(custNo) {
  const { data, error } = await supabase
    .from('sales')
    .select('*')
    .eq('custNo', custNo)
    .order('salesDate', { ascending: false })
  if (error) throw error
  return data
}

// Get sales detail by transaction
export async function getSalesDetail(transNo) {
  const { data, error } = await supabase
    .from('salesdetail')
    .select(`
      *,
      product (description, unit)
    `)
    .eq('transNo', transNo)
  if (error) throw error
  return data
}