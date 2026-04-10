// Minimal types for admin components - replace with real API calls
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastActive: string;
}

export interface AdminAppointment {
  id: string;
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  status: string;
  type: string;
}

export interface AdminFinancialData {
  totalRevenue: number;
  expenses: number;
  profit: number;
  trend: string;
}

export interface SystemMetric {
  label: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down' | 'neutral';
}

export interface DepartmentStat {
  name: string;
  patients: number;
  staff: number;
  utilization: number;
}

export interface RecentActivity {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  type: string;
}

// Mock data arrays - replace with API calls in production
export const adminNotifications: any[] = [];
export const adminUsers: AdminUser[] = [];
export const adminAppointments: AdminAppointment[] = [];
export const adminFinancialData: AdminFinancialData = {
  totalRevenue: 0,
  expenses: 0,
  profit: 0,
  trend: 'neutral'
};

export const adminSystemMetrics: SystemMetric[] = [
  { label: 'Server Uptime', value: '99.9%', change: '+0.1%', trend: 'up' },
  { label: 'Active Sessions', value: 248, change: '+12', trend: 'up' },
  { label: 'Response Time', value: '45ms', change: '-5ms', trend: 'up' },
  { label: 'Database Size', value: '2.4GB', change: '+120MB', trend: 'neutral' }
];

export const departmentStats: DepartmentStat[] = [
  { name: 'Emergency', patients: 45, staff: 12, utilization: 85 },
  { name: 'Surgery', patients: 23, staff: 18, utilization: 68 },
  { name: 'Pediatrics', patients: 67, staff: 15, utilization: 92 },
  { name: 'Cardiology', patients: 34, staff: 10, utilization: 75 }
];

export const recentActivities: RecentActivity[] = [
  { id: '1', action: 'New patient registered', user: 'Dr. Smith', timestamp: '2 min ago', type: 'info' },
  { id: '2', action: 'Appointment cancelled', user: 'Sarah Johnson', timestamp: '15 min ago', type: 'warning' },
  { id: '3', action: 'Lab results uploaded', user: 'Lab Tech', timestamp: '1 hour ago', type: 'success' },
  { id: '4', action: 'System backup completed', user: 'System', timestamp: '2 hours ago', type: 'info' }
];

// Legacy exports for backward compatibility
export const mockAdminUsers = adminUsers;
export const mockAdminAppointments = adminAppointments;
export const mockFinancialData = adminFinancialData;
