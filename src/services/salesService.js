// M1-PR-02: Read-only service functions for sales, salesDetail, product, priceHist

import { supabase } from '../supabaseClient'

// Get sales by customer
export async function getSalesByCustomer(custNo) {
  const { data, error } = await supabase
    .from('sales')
    .select('*')
    .eq('custno', custNo)
    .order('salesdate', { ascending: false })
  if (error) throw error
  return data
}

// Get sales detail by transaction - manual join
export async function getSalesDetail(transNo) {
  console.log('Getting details for transno:', transNo)
  
  const { data, error } = await supabase
    .from('salesdetail')
    .select('transno, prodcode, quantity')
    .eq('transno', transNo)

  if (error) throw error
  if (!data || data.length === 0) return []

  // Get product descriptions manually
  const details = await Promise.all(data.map(async (sd) => {
    const { data: prod } = await supabase
      .from('product')
      .select('description, unit')
      .eq('prodcode', sd.prodcode)
      .single()
    return { ...sd, product: prod }
  }))

  return details
}