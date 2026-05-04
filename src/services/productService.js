import { supabase } from '../supabaseClient'

// Get all products with current price
export async function getProducts() {
  const { data, error } = await supabase
    .from('product_current_price')
    .select('*')
    .order('prodcode')
  if (error) throw error
  return data
}

// Get price history for a product
export async function getPriceHistory(prodCode) {
  const { data, error } = await supabase
    .from('pricehist')
    .select('*')
    .eq('prodcode', prodCode)
    .order('effdate', { ascending: false })
  if (error) throw error
  return data
}

// Get current price for a product
export async function getCurrentPrice(prodCode) {
  const { data, error } = await supabase
    .from('product_current_price')
    .select('unitprice')
    .eq('prodcode', prodCode)
    .single()
  if (error) throw error
  return data?.unitprice
}