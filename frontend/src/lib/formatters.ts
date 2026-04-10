import { DemoUserRole, DemoFeatureCategory, DemoStatus } from './enums';

export const formatDemoRole = (role: DemoUserRole): string => {
  const roleLabels = {
    [DemoUserRole.PATIENT]: "Patient",
    [DemoUserRole.DOCTOR]: "Doctor", 
    [DemoUserRole.ADMIN]: "Administrator",
    [DemoUserRole.STAFF]: "Staff Member",
    [DemoUserRole.LABORATORY]: "Laboratory Technician"
  };
  return roleLabels[role] || role;
};

export const formatDemoFeature = (feature: DemoFeatureCategory): string => {
  const featureLabels = {
    [DemoFeatureCategory.APPOINTMENTS]: "Appointments",
    [DemoFeatureCategory.MEDICAL_RECORDS]: "Medical Records",
    [DemoFeatureCategory.LAB_RESULTS]: "Lab Results",
    [DemoFeatureCategory.BILLING]: "Billing & Payments", 
    [DemoFeatureCategory.COMMUNICATION]: "Communication",
    [DemoFeatureCategory.MANAGEMENT]: "Management",
    [DemoFeatureCategory.REPORTS]: "Reports & Analytics",
    [DemoFeatureCategory.NOTIFICATIONS]: "Notifications"
  };
  return featureLabels[feature] || feature;
};

export const formatDemoStatus = (status: DemoStatus): string => {
  const statusLabels = {
    [DemoStatus.ACTIVE]: "Active",
    [DemoStatus.COMPLETED]: "Completed",
    [DemoStatus.PENDING]: "Pending", 
    [DemoStatus.CANCELLED]: "Cancelled"
  };
  return statusLabels[status] || status;
};