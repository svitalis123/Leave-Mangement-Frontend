// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAuthStore } from '@/store/authStore'
import { DashboardLayout } from '@/components/layouts/DashboardLayout'
import { LoginPage } from '@/pages/auth/LoginPage'
import { RegisterPage } from '@/pages/auth/RegisterPage'
import { AdminDashboard } from '@/pages/dashboard/AdminDashboard'
import { EmployeeDashboard } from '@/pages/dashboard/EmployeeDashboard'
import { CalendarView } from '@/pages/calendar/CalendarView'
import { UserManagement } from '@/pages/admin/UserManagement'
import { LeaveTypeManagement } from '@/pages/admin/LeaveTypeManagement'
import { NewLeaveRequest } from '@/pages/leave/NewLeaveRequest'
import { UserLeaveManagement } from './pages/admin/UserLeaveManagement'


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
})

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated())
  const user = useAuthStore((state) => state.user)
  
  console.log('PrivateRoute check:', { isAuthenticated, user, path: location.pathname })

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}


function AdminRoute({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const isAdmin = useAuthStore((state) => state.isAdmin())
  const user = useAuthStore((state) => state.user)
  
  console.log('AdminRoute check:', { isAdmin, user, path: location.pathname })

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}

function RoleBasedDashboard() {
  const isAdmin = useAuthStore((state) => state.isAdmin())
  return isAdmin ? <AdminDashboard /> : <EmployeeDashboard />
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <DashboardLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            
            {/* Dashboard route with role-based rendering */}
            <Route
              path="dashboard"
              element={
                <RoleBasedDashboard />
              }
            />
            
            <Route path="calendar" element={<CalendarView />} />
            <Route path="leave/new" element={<NewLeaveRequest />} />

            {/* Admin routes */}
            <Route
              path="users"
              element={
                <AdminRoute>
                  <UserManagement />
                </AdminRoute>
              }
            />

            <Route
              path="leave-balance"
              element={
                <AdminRoute>
                  <UserLeaveManagement />
                </AdminRoute>
              }
            />

            <Route
              path="settings"
              element={
                <AdminRoute>
                  <LeaveTypeManagement />
                </AdminRoute>
              }
            />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  )
}
