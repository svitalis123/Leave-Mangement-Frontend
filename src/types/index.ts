// src/types/index.ts
export interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'employee';
  is_approved: boolean;
  created_at: string;
}

export interface LeaveType {
  id: number;
  name: string;
  description: string;
  default_allocation: number;
  requires_balance: boolean;
  created_at: string;
}

export interface LeaveRequest {
  id: number;
  user_id: number;
  leave_type_id: number;
  leave_type_name: string;
  start_date: string;
  end_date: string;
  status: 'pending' | 'approved' | 'rejected';
  reason: string;
  created_at: string;
}

export interface LeaveBalance {
  id: number;
  user_id: number;
  leave_type_id: number;
  leave_type_name: string;
  balance: number;
  updated_at: string;
}

export interface Notification {
  id: number;
  user_id: number;
  message: string;
  is_read: boolean;
  created_at: string;
}
