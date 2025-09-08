// Demo data for comprehensive role-based feature testing
import { DemoUserRole, DemoFeatureCategory, DemoStatus } from './enums';

// Demo data for comprehensive role-based feature testing
export const mockStore = {
  currentDemoMode: true,
  activeRole: "patient" as const,
  demoSession: {
    id: "demo-session-001",
    startTime: new Date().toISOString(),
    featuresUsed: []
  }
};

export const mockQuery = {
  demoFeatures: {
    patient: [
      { id: "p-1", name: "Book Appointments", status: "active" as const, description: "Schedule appointments with doctors" },
      { id: "p-2", name: "View Medical Records", status: "active" as const, description: "Access personal health records" },
      { id: "p-3", name: "Lab Results", status: "active" as const, description: "View test results and reports" },
      { id: "p-4", name: "Billing", status: "active" as const, description: "Manage payments and insurance" }
    ],
    doctor: [
      { id: "d-1", name: "Patient Management", status: "active" as const, description: "Manage patient appointments and records" },
      { id: "d-2", name: "Medical Records", status: "active" as const, description: "Update patient medical histories" },
      { id: "d-3", name: "Lab Orders", status: "active" as const, description: "Order and review lab tests" },
      { id: "d-4", name: "Prescriptions", status: "active" as const, description: "Manage patient medications" }
    ],
    admin: [
      { id: "a-1", name: "User Management", status: "active" as const, description: "Manage doctors, staff, and patients" },
      { id: "a-2", name: "System Analytics", status: "active" as const, description: "View hospital performance metrics" },
      { id: "a-3", name: "Financial Reports", status: "active" as const, description: "Monitor revenue and expenses" },
      { id: "a-4", name: "Staff Scheduling", status: "active" as const, description: "Manage staff schedules and assignments" }
    ],
    staff: [
      { id: "s-1", name: "Patient Check-in", status: "active" as const, description: "Register and check-in patients" },
      { id: "s-2", name: "Appointment Scheduling", status: "active" as const, description: "Schedule and manage appointments" },
      { id: "s-3", name: "Insurance Verification", status: "active" as const, description: "Verify patient insurance coverage" },
      { id: "s-4", name: "Medical Records", status: "active" as const, description: "Update patient information" }
    ],
    laboratory: [
      { id: "l-1", name: "Test Processing", status: "active" as const, description: "Process and analyze lab samples" },
      { id: "l-2", name: "Results Management", status: "active" as const, description: "Upload and manage test results" },
      { id: "l-3", name: "Quality Control", status: "active" as const, description: "Ensure test accuracy and compliance" },
      { id: "l-4", name: "Equipment Management", status: "active" as const, description: "Monitor lab equipment status" }
    ]
  }
};

export const mockRootProps = {
  demoRoles: [
    {
      role: "patient" as const,
      displayName: "Patient Portal",
      description: "Book appointments, view records, manage health",
      dashboardPath: "/dashboard",
      loginPath: "/login",
      color: "blue",
      icon: "user"
    },
    {
      role: "doctor" as const,
      displayName: "Doctor Portal", 
      description: "Manage patients, review records, prescribe treatments",
      dashboardPath: "/doctor-dashboard",
      loginPath: "/doctor-login", 
      color: "green",
      icon: "stethoscope"
    },
    {
      role: "admin" as const,
      displayName: "Admin Portal",
      description: "System management, analytics, user administration", 
      dashboardPath: "/admin-dashboard",
      loginPath: "/admin-login",
      color: "purple", 
      icon: "settings"
    },
    {
      role: "staff" as const,
      displayName: "Staff Portal",
      description: "Patient check-in, scheduling, administrative tasks",
      dashboardPath: "/staff-dashboard", 
      loginPath: "/staff-login",
      color: "orange",
      icon: "users"
    },
    {
      role: "laboratory" as const,
      displayName: "Laboratory Portal",
      description: "Test processing, results management, quality control",
      dashboardPath: "/laboratory-dashboard",
      loginPath: "/laboratory-login", 
      color: "teal",
      icon: "test-tube"
    }
  ]
};