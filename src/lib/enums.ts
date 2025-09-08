// Demo user roles and feature categories
export enum DemoUserRole {
  PATIENT = "patient",
  DOCTOR = "doctor", 
  ADMIN = "admin",
  STAFF = "staff",
  LABORATORY = "lab"
}

export enum DemoFeatureCategory {
  APPOINTMENTS = "appointments",
  MEDICAL_RECORDS = "medical_records",
  LAB_RESULTS = "lab_results", 
  BILLING = "billing",
  COMMUNICATION = "communication",
  MANAGEMENT = "management",
  REPORTS = "reports",
  NOTIFICATIONS = "notifications"
}

export enum DemoStatus {
  ACTIVE = "active",
  COMPLETED = "completed", 
  PENDING = "pending",
  CANCELLED = "cancelled"
}