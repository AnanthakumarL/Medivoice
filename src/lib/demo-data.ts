// Centralized demo datasets for Doctors, Patients, and Laboratories
export type DemoDoctor = {
  id: string;
  name: string;
  specialty: string;
  hospital: string;
  phone: string;
  email: string;
  address: string;
  rating: number;
  experience: string;
  consultationFee: string;
  avatar: string;
  availableToday?: boolean;
  nextAvailable?: string;
};

export type DemoPatient = {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
  lastVisit?: string;
  condition?: string;
};

export type DemoLab = {
  id: string;
  name: string;
  department: string;
  contact: string;
  email: string;
};

export const demoDoctors: DemoDoctor[] = [
  {
    id: "doc-001",
    name: "Dr. Sarah Johnson",
    specialty: "Cardiology",
    hospital: "City Medical Center",
    phone: "+1 (555) 123-4567",
    email: "dr.sarah.johnson@citymedical.com",
    address: "123 Medical Plaza, Suite 200, City, State 12345",
    rating: 4.8,
    experience: "15 years",
    consultationFee: "$150",
    avatar: "/placeholder.svg",
    availableToday: true,
    nextAvailable: "Today, 2:00 PM",
  },
  {
    id: "doc-002",
    name: "Dr. Michael Chen",
    specialty: "General Medicine",
    hospital: "Downtown Clinic",
    phone: "+1 (555) 234-5678",
    email: "dr.michael.chen@downtownclinic.com",
    address: "456 Health Street, Downtown, State 12345",
    rating: 4.6,
    experience: "12 years",
    consultationFee: "$120",
    avatar: "/placeholder.svg",
    availableToday: true,
    nextAvailable: "Today, 10:00 AM",
  },
  {
    id: "doc-003",
    name: "Dr. Emily Davis",
    specialty: "Dermatology",
    hospital: "Skin Care Specialists",
    phone: "+1 (555) 345-6789",
    email: "dr.emily.davis@skincare.com",
    address: "789 Beauty Lane, Suite 100, City, State 12345",
    rating: 4.9,
    experience: "18 years",
    consultationFee: "$95",
    avatar: "/placeholder.svg",
    availableToday: false,
    nextAvailable: "Tomorrow, 9:00 AM",
  },
];

export const demoPatients: DemoPatient[] = [
  {
    id: "P-2024-001",
    name: "John Doe",
    age: 45,
    gender: "Male",
    phone: "+1 (555) 123-0000",
    email: "john.doe@email.com",
    lastVisit: "2024-01-15",
    condition: "Hypertension",
  },
  {
    id: "P-2024-002",
    name: "Sarah Johnson",
    age: 34,
    gender: "Female",
    phone: "+1 (555) 123-4567",
    email: "sarah.johnson@email.com",
    lastVisit: "2024-01-22",
    condition: "Routine Checkup",
  },
];

export const demoLabs: DemoLab[] = [
  {
    id: "LAB-2024-001",
    name: "Clinical Laboratory",
    department: "Hematology",
    contact: "+1 (555) 111-2222",
    email: "lab@hospital.com",
  },
  {
    id: "LAB-2024-002",
    name: "Diagnostic Center",
    department: "Biochemistry",
    contact: "+1 (555) 333-4444",
    email: "diagnostics@hospital.com",
  },
];