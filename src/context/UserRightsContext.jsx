import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { useAuth } from './AuthContext'

const UserRightsContext = createContext()

export function UserRightsProvider({ children }) {
  const { currentUser } = useAuth()
  const [rights, setRights] = useState({
    CUST_VIEW: 0,
    CUST_ADD: 0,
    CUST_EDIT: 0,
    CUST_DEL: 0,
    SALES_VIEW: 0,
    SD_VIEW: 0,
    PROD_VIEW: 0,
    PRICE_VIEW: 0,
    ADM_USER: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (currentUser) {
      loadRights()
    }
  }, [currentUser])

  async function loadRights() {
    try {
      const { data, error } = await supabase
        .from('UserModule_Rights')
        .select('rightcode, right_value')
        .eq('userid', currentUser.id)

      if (error) throw error

      // Convert array to object
      const rightsMap = {}
      data.forEach(row => {
        rightsMap[row.rightcode] = row.right_value
      })
      setRights(rightsMap)
    } catch (err) {
      console.error('Error loading rights:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <UserRightsContext.Provider value={{ rights, loading }}>
      {children}
    </UserRightsContext.Provider>
  )
}

export const useRights = () => useContext(UserRightsContext)