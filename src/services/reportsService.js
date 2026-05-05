import { supabase } from '../supabaseClient'

// Get customer sales summary
export async function getCustomerSalesSummary() {
  const { data, error } = await supabase
    .from('customer_sales_summary')
    .select('*')
    .order('totalspend', { ascending: false })
  if (error) throw error
  return data
}

// Get top 10 customers by total spend
export async function getTopCustomers() {
  const { data, error } = await supabase
    .from('customer_sales_summary')
    .select('*')
    .order('totalspend', { ascending: false })
    .limit(10)
  if (error) throw error
  return data
}

// Get product revenue
export async function getProductRevenue() {
  const { data, error } = await supabase
    .from('product_revenue')
    .select('*')
    .order('totalrevenue', { ascending: false })
  if (error) throw error
  return data
}