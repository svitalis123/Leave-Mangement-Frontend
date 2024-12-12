// src/components/layouts/DashboardLayout.tsx
import { useAuthStore } from '@/store/authStore'
import { useNotificationStore } from '@/store/notificationStore'
import { useState } from 'react'
import { Link, useNavigate, Outlet } from 'react-router-dom' // Add Outlet import
import { Button } from '@/components/ui/Button'
import { Bell, Calendar, ClipboardList, Home, LogOut, Settings, Users } from 'lucide-react'

export function DashboardLayout() {
  const { user, clearAuth, isAdmin } = useAuthStore()
  const { notifications } = useNotificationStore()
  const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const unreadNotifications = notifications.filter((n) => !n.is_read)

  const handleLogout = () => {
    clearAuth()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed left-0 top-0 z-40 h-screen w-64 transform transition-transform ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex h-full flex-col border-r bg-card px-3 py-4">
            <div className="mb-8 flex items-center px-3">
              <h1 className="text-xl font-bold">Leave Management</h1>
            </div>
            
            <nav className="flex-1 space-y-2">
              <Link
                to="/dashboard"
                className="flex items-center rounded-lg px-3 py-2 text-gray-600 hover:bg-gray-100"
              >
                <Home className="mr-2 h-5 w-5" />
                Dashboard
              </Link>
              
              <Link
                to="/calendar"
                className="flex items-center rounded-lg px-3 py-2 text-gray-600 hover:bg-gray-100"
              >
                <Calendar className="mr-2 h-5 w-5" />
                Calendar
              </Link>

              {isAdmin() && (
                <>
                  <Link
                    to="/users"
                    className="flex items-center rounded-lg px-3 py-2 text-gray-600 hover:bg-gray-100"
                  >
                    <Users className="mr-2 h-5 w-5" />
                    Users
                  </Link>
                  <Link
                    to="/leave-balance"
                    className="flex items-center rounded-lg px-3 py-2 text-gray-600 hover:bg-gray-100"
                  >
                    <ClipboardList className="mr-2 h-5 w-5" />
                    Leave Balance
                  </Link>
                  <Link
                    to="/settings"
                    className="flex items-center rounded-lg px-3 py-2 text-gray-600 hover:bg-gray-100"
                  >
                    <Settings className="mr-2 h-5 w-5" />
                    Settings
                  </Link>
                </>
              )}
            </nav>

            <div className="border-t pt-4">
              <div className="px-3 py-2">
                <div className="flex items-center">
                  <div className="ml-3">
                    <p className="text-sm font-medium">{user?.username}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-5 w-5" />
                Logout
              </Button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className={`flex-1 ${isSidebarOpen ? 'ml-64' : ''}`}>
          <header className="sticky top-0 z-30 border-b bg-background">
            <div className="flex h-16 items-center px-4">
              <Button
                variant="ghost"
                size="icon"
                className="mr-2"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                <span className="sr-only">Toggle sidebar</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </Button>
              
              <div className="ml-auto flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  onClick={() => navigate('/notifications')}
                >
                  <Bell className="h-5 w-5" />
                  {unreadNotifications.length > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                      {unreadNotifications.length}
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </header>

          <main className="flex-1 p-6">
            <Outlet /> {/* This is where nested routes will be rendered */}
          </main>
        </div>
      </div>
    </div>
  )
}