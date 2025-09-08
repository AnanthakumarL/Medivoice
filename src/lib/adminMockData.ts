// Comprehensive mock data for Admin Dashboard
import { demoDoctors, demoPatients, demoLabs } from './demo-data';

export interface AdminUser {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'pending';
  joinDate: string;
  avatar: string;
  specialization?: string;
  experience?: string;
  rating?: number;
}

export interface AdminAppointment {
  id: string;
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  type: 'consultation' | 'follow-up' | 'emergency' | 'surgery';
  status: 'scheduled' | 'completed' | 'cancelled' | 'in-progress';
  department: string;
}

export interface AdminFinancialData {
  totalRevenue: number;
  monthlyRevenue: number;
  pendingPayments: number;
  insuranceClaims: number;
  expenses: number;
  profit: number;
}

export interface AdminSystemMetrics {
  totalUsers: number;
  activeUsers: number;
  systemUptime: string;
  storageUsed: number;
  storageTotal: number;
  dailyVisits: number;
}

// Enhanced Admin Users (Doctors + Staff + Lab Technicians)
export const adminUsers: AdminUser[] = [
  // Doctors from existing demo data
  ...demoDoctors.map(doctor => ({
    id: doctor.id,
    name: doctor.name,
    role: 'Doctor',
    department: doctor.specialty,
    email: doctor.email,
    phone: doctor.phone,
    status: 'active' as const,
    joinDate: '2023-01-15',
    avatar: doctor.avatar,
    specialization: doctor.specialty,
    experience: doctor.experience,
    rating: doctor.rating
  })),
  
  // Additional Staff Members
  {
    id: 'staff-001',
    name: 'Jennifer Martinez',
    role: 'Head Nurse',
    department: 'Emergency',
    email: 'jennifer.martinez@hospital.com',
    phone: '+1 (555) 234-5678',
    status: 'active',
    joinDate: '2022-03-20',
    avatar: '/placeholder.svg',
    experience: '12 years'
  },
  {
    id: 'staff-002',
    name: 'Robert Kim',
    role: 'Pharmacist',
    department: 'Pharmacy',
    email: 'robert.kim@hospital.com',
    phone: '+1 (555) 345-6789',
    status: 'active',
    joinDate: '2023-06-10',
    avatar: '/placeholder.svg',
    experience: '8 years'
  },
  {
    id: 'staff-003',
    name: 'Lisa Thompson',
    role: 'Lab Technician',
    department: 'Laboratory',
    email: 'lisa.thompson@hospital.com',
    phone: '+1 (555) 456-7890',
    status: 'active',
    joinDate: '2023-02-14',
    avatar: '/placeholder.svg',
    experience: '6 years'
  },
  {
    id: 'staff-004',
    name: 'Michael Brown',
    role: 'Receptionist',
    department: 'Front Desk',
    email: 'michael.brown@hospital.com',
    phone: '+1 (555) 567-8901',
    status: 'active',
    joinDate: '2023-08-01',
    avatar: '/placeholder.svg',
    experience: '3 years'
  },
  {
    id: 'staff-005',
    name: 'Sarah Wilson',
    role: 'IT Support',
    department: 'Information Technology',
    email: 'sarah.wilson@hospital.com',
    phone: '+1 (555) 678-9012',
    status: 'pending',
    joinDate: '2024-01-15',
    avatar: '/placeholder.svg',
    experience: '5 years'
  }
];

// Enhanced Appointments Data
export const adminAppointments: AdminAppointment[] = [
  {
    id: 'apt-001',
    patientName: 'John Doe',
    doctorName: 'Dr. Sarah Johnson',
    date: '2024-01-25',
    time: '09:00',
    type: 'consultation',
    status: 'scheduled',
    department: 'Cardiology'
  },
  {
    id: 'apt-002',
    patientName: 'Sarah Johnson',
    doctorName: 'Dr. Michael Chen',
    date: '2024-01-25',
    time: '10:30',
    type: 'follow-up',
    status: 'completed',
    department: 'General Medicine'
  },
  {
    id: 'apt-003',
    patientName: 'Robert Smith',
    doctorName: 'Dr. Emily Davis',
    date: '2024-01-25',
    time: '14:00',
    type: 'consultation',
    status: 'in-progress',
    department: 'Dermatology'
  },
  {
    id: 'apt-004',
    patientName: 'Maria Garcia',
    doctorName: 'Dr. Sarah Johnson',
    date: '2024-01-25',
    time: '15:30',
    type: 'emergency',
    status: 'scheduled',
    department: 'Cardiology'
  },
  {
    id: 'apt-005',
    patientName: 'David Wilson',
    doctorName: 'Dr. Michael Chen',
    date: '2024-01-26',
    time: '11:00',
    type: 'surgery',
    status: 'scheduled',
    department: 'General Medicine'
  }
];

// Financial Data
export const adminFinancialData: AdminFinancialData = {
  totalRevenue: 2450000,
  monthlyRevenue: 185000,
  pendingPayments: 45000,
  insuranceClaims: 125000,
  expenses: 95000,
  profit: 90000
};

// System Metrics
export const adminSystemMetrics: AdminSystemMetrics = {
  totalUsers: 1247,
  activeUsers: 892,
  systemUptime: '99.8%',
  storageUsed: 750,
  storageTotal: 1000,
  dailyVisits: 2341
};

// Department Statistics
export const departmentStats = [
  { name: 'Emergency', patients: 45, staff: 12, utilization: 85 },
  { name: 'Cardiology', patients: 23, staff: 8, utilization: 72 },
  { name: 'General Medicine', patients: 67, staff: 15, utilization: 90 },
  { name: 'Dermatology', patients: 18, staff: 5, utilization: 65 },
  { name: 'Laboratory', patients: 89, staff: 10, utilization: 78 },
  { name: 'Pharmacy', patients: 156, staff: 6, utilization: 95 }
];

// Recent Activities
export const recentActivities = [
  {
    id: 'act-001',
    type: 'user_added',
    message: 'New doctor Dr. Amanda Foster added to Cardiology',
    timestamp: '2024-01-25T10:30:00Z',
    user: 'Admin'
  },
  {
    id: 'act-002',
    type: 'appointment_scheduled',
    message: 'Emergency appointment scheduled for Maria Garcia',
    timestamp: '2024-01-25T09:15:00Z',
    user: 'Jennifer Martinez'
  },
  {
    id: 'act-003',
    type: 'system_backup',
    message: 'Daily system backup completed successfully',
    timestamp: '2024-01-25T02:00:00Z',
    user: 'System'
  },
  {
    id: 'act-004',
    type: 'payment_processed',
    message: 'Insurance claim of $12,500 processed',
    timestamp: '2024-01-24T16:45:00Z',
    user: 'Finance Team'
  },
  {
    id: 'act-005',
    type: 'report_generated',
    message: 'Monthly financial report generated',
    timestamp: '2024-01-24T14:20:00Z',
    user: 'Admin'
  }
];

// Notifications for Admin
export const adminNotifications = [
  {
    id: 'notif-001',
    type: 'urgent',
    title: 'System Maintenance Required',
    message: 'Database optimization scheduled for tonight at 2:00 AM',
    timestamp: '2024-01-25T08:00:00Z',
    read: false
  },
  {
    id: 'notif-002',
    type: 'info',
    title: 'New Staff Member',
    message: 'Sarah Wilson has been added to IT Support team',
    timestamp: '2024-01-25T07:30:00Z',
    read: false
  },
  {
    id: 'notif-003',
    type: 'warning',
    title: 'Storage Space Low',
    message: 'Server storage is 75% full. Consider upgrading.',
    timestamp: '2024-01-24T18:00:00Z',
    read: true
  },
  {
    id: 'notif-004',
    type: 'success',
    title: 'Backup Completed',
    message: 'Daily backup completed successfully',
    timestamp: '2024-01-24T02:00:00Z',
    read: true
  },
  {
    id: 'notif-005',
    type: 'info',
    title: 'Monthly Report Ready',
    message: 'January financial report is ready for review',
    timestamp: '2024-01-23T16:00:00Z',
    read: true
  }
];

// Chart Data for Analytics
export const monthlyRevenueData = [
  { month: 'Jan', revenue: 185000, expenses: 95000, profit: 90000 },
  { month: 'Feb', revenue: 195000, expenses: 98000, profit: 97000 },
  { month: 'Mar', revenue: 210000, expenses: 105000, profit: 105000 },
  { month: 'Apr', revenue: 225000, expenses: 110000, profit: 115000 },
  { month: 'May', revenue: 240000, expenses: 115000, profit: 125000 },
  { month: 'Jun', revenue: 255000, expenses: 120000, profit: 135000 }
];

export const patientFlowData = [
  { time: '08:00', patients: 12 },
  { time: '09:00', patients: 25 },
  { time: '10:00', patients: 45 },
  { time: '11:00', patients: 38 },
  { time: '12:00', patients: 28 },
  { time: '13:00', patients: 22 },
  { time: '14:00', patients: 35 },
  { time: '15:00', patients: 42 },
  { time: '16:00', patients: 38 },
  { time: '17:00', patients: 25 },
  { time: '18:00', patients: 15 }
];