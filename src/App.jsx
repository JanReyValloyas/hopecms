import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import CustomersPage from './pages/CustomersPage'
import SalesPage from './pages/SalesPage'
import ProductsPage from './pages/ProductsPage'
import AdminPage from './pages/AdminPage'
import DeletedCustomersPage from './pages/DeletedCustomersPage'
import AuthCallbackPage from './pages/AuthCallbackPage'
import AppShell from './components/AppShell'
import { useAuth } from './context/AuthContext'
import CustomerDetailPage from './pages/CustomerDetailPage'
import CustomerSalesSummaryPage from './pages/CustomerSalesSummaryPage'
import TopCustomersPage from './pages/TopCustomersPage'
import ProductRevenuePage from './pages/ProductRevenuePage'
import DashboardPage from './pages/DashboardPage'

function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth()
  if (loading) return <div>Loading...</div>
  if (!currentUser) return <Navigate to="/login" />
  return <AppShell>{children}</AppShell>
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
        <Route path="/customers" element={<ProtectedRoute><CustomersPage /></ProtectedRoute>} />
        <Route path="/sales" element={<ProtectedRoute><SalesPage /></ProtectedRoute>} />
        <Route path="/products" element={<ProtectedRoute><ProductsPage /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
        <Route path="/deleted-customers" element={<ProtectedRoute><DeletedCustomersPage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
        <Route path="/customers/:custno" element={<ProtectedRoute><CustomerDetailPage /></ProtectedRoute>} />
        <Route path="/reports/sales-summary" element={<ProtectedRoute><CustomerSalesSummaryPage /></ProtectedRoute>} />
        <Route path="/reports/top-customers" element={<ProtectedRoute><TopCustomersPage /></ProtectedRoute>} />
        <Route path="/reports/product-revenue" element={<ProtectedRoute><ProductRevenuePage /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App