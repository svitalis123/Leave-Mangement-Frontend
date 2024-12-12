// src/services/api.ts
import axios from 'axios'
import { useAuthStore } from '@/store/authStore'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  console.log('API Request:', { 
    url: config.url, 
    token: token?.substring(0, 20) + '...' 
  })
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log('API Error:', {
      status: error.response?.status,
      url: error.config?.url,
      message: error.response?.data?.error
    })
    
    if (error.response?.status === 401) {
      const authStore = useAuthStore.getState()
      authStore.clearAuth()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authApi = {
  login: async (username: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { username, password })
      console.log('Login response:', response.data)
      return response.data
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  },
  register: async (username: string, email: string, password: string) => {
    const response = await api.post('/auth/register', { username, email, password });
    return response.data;
  },
};

export const employeeApi = {
  getLeaveRequests: async () => {
    const response = await api.get('/employee/leave-requests');
    return response.data;
  },
  createLeaveRequest: async (data: Omit<LeaveRequest, 'id' | 'user_id' | 'created_at' | 'status'>) => {
    const response = await api.post('/employee/leave-requests', data);
    return response.data;
  },
  getLeaveBalance: async () => {
    const response = await api.get('/employee/leave-balance');
    return response.data;
  },
  getNotifications: async () => {
    const response = await api.get('/employee/notifications');
    return response.data;
  },
};

export const adminApi = {
  getPendingUsers: async () => {
    const response = await api.get('/admin/users/pending');
    return response.data;
  },
  approveUser: async (userId: number) => {
    const response = await api.post(`/admin/users/${userId}/approve`);
    return response.data;
  },
  getLeaveTypes: async () => {
    const response = await api.get('/admin/leave-types');
    return response.data;
  },
  createLeaveType: async (data: Omit<LeaveType, 'id' | 'created_at'>) => {
    const response = await api.post('/admin/leave-types', data);
    return response.data;
  },
  getAllLeaveRequests: async () => {
    const response = await api.get('/admin/leave-requests');
    return response.data;
  },
  updateLeaveRequest: async (requestId: number, status: 'approved' | 'rejected') => {
    const response = await api.put(`/admin/leave-requests/${requestId}`, { status });
    return response.data;
  },
  getAllUsers: async (): Promise<User[]> => {
    const response = await api.get('/admin/users')
    return response.data
  },

  setLeaveBalance: async (data: {
    user_id: number
    leave_type_id: number
    balance: number
  }) => {
    const response = await api.post('/admin/leave-balance/set', data)
    return response.data
  },
};

export default api;