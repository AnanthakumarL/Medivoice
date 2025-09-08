import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import {
  Stethoscope,
  Users,
  Calendar,
  FileText,
  Brain,
  TestTube,
  Settings,
  HelpCircle,
  Bell,
  LogOut,
  Activity,
  TrendingUp,
  Search,
  Mic,
  Upload,
  Download,
  Edit,
  Eye,
  Plus,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Timer,
  Building2,
  User,
  Zap,
  X,
  Pill,
  Heart,
  Thermometer,
  Clock,
  ExternalLink,
  Phone,
  Mail,
  MessageSquare,
  Calculator,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Grid,
  List,
  Copy,
  Trash2,
  Save,
  MoreHorizontal,
  BarChart3
} from "lucide-react";

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState(() => {
    // Initialize activeTab directly from location state to prevent flash
    if (location.state?.tab && ['dashboard', 'critical', 'patients', 'appointments', 'reports', 'profile', 'help'].includes(location.state.tab)) {
      return location.state.tab;
    }
    // Check URL parameters as fallback
    const urlParams = new URLSearchParams(location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam && ['critical', 'patients', 'appointments', 'reports', 'profile', 'help'].includes(tabParam)) {
      return tabParam;
    }
    return "dashboard";
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientSearch, setPatientSearch] = useState("");
  const [labResultsSearch, setLabResultsSearch] = useState("");
  const [labFilter, setLabFilter] = useState("all");
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationsRef = useRef<HTMLDivElement | null>(null);

  // Doctor Profile Data (hydrate from demo user if present)
  const [doctorProfile] = useState(() => {
    const u = localStorage.getItem('demo.user');
    const user = u ? JSON.parse(u) : null;
    return {
      name: user?.role === 'doctor' && user?.name ? user.name : "Dr. Sarah Smith",
      specialization: "Cardiology",
      department: "Cardiovascular Medicine",
      licenseNumber: "MD-12345",
      experience: "15 years",
      phone: "+1 (555) 123-4567",
      email: user?.role === 'doctor' && user?.email ? user.email : "dr.sarah.smith@hospital.com",
      consultationHours: "9:00 AM - 5:00 PM",
      avatar: "/placeholder.svg"
    };
  });

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('demo.user');
    toast({
      title: "Logged out successfully",
      description: "You have been safely logged out of your account.",
    });
    navigate("/doctor-login");
  };

  // Handle profile click
  const handleProfileClick = () => {
    setActiveTab("profile");
  };

  // Working demo functionality for Doctor Dashboard
  const simulateProcessing = async (action, duration = 2000) => {
    setIsProcessing(true);
    toast({
      title: "Processing...",
      description: `${action} in progress...`,
    });

    await new Promise(resolve => setTimeout(resolve, duration));

    setIsProcessing(false);
    toast({
      title: "Success!",
      description: `${action} completed successfully.`,
    });
  };

  // Demo state for realistic functionality
  const [demoState, setDemoState] = useState({
    showPatientModal: false,
    showScheduleModal: false,
    showLabResultsModal: false,
    showVoiceRecordingModal: false,
    showMedicalSearchModal: false,
    selectedPatientData: null,
    searchResults: [],
    voiceRecording: false,
    recordingText: "",
    showPatientSearch: false,
    showNewAppointment: false,
    showRescheduleAppointment: false,
    selectedAppointmentForReschedule: null,
    showPrescriptionModal: false,
    showLabOrderModal: false,
    showProfileModal: false,
    showAlertsModal: false,
    showTimeSlotModal: false,
    showNotificationModal: false,
    showFAQModal: false,
    showReportIssueModal: false,
    showAIConsultModal: false,
    showAddPatientModal: false,
    showPatientUpdateModal: false,
    showPatientVoiceUpdateModal: false,
    showPatientUpdateOptionsModal: false,
    selectedPatientForUpdate: null,
  });

  // Calendar state management
  const [calendarState, setCalendarState] = useState({
    currentDate: new Date(2024, 0, 1), // January 2024
    viewMode: 'month', // 'month' or 'list'
    selectedDate: null,
    appointments: {
      '2024-01-01': [
        { id: 1, time: '9:00 AM', title: 'Checkup', patient: 'John Doe', type: 'checkup' },
        { id: 2, time: '2:00 PM', title: 'Surgery', patient: 'Jane Smith', type: 'surgery' }
      ],
      '2024-01-04': [
        { id: 3, time: '9:00 AM', title: 'Checkup', patient: 'Bob Johnson', type: 'checkup' },
        { id: 4, time: '2:00 PM', title: 'Surgery', patient: 'Alice Williams', type: 'surgery' }
      ],
      '2024-01-07': [
        { id: 5, time: '9:00 AM', title: 'Checkup', patient: 'Charlie Brown', type: 'checkup' },
        { id: 6, time: '2:00 PM', title: 'Surgery', patient: 'Diana Prince', type: 'surgery' }
      ],
      '2024-01-10': [
        { id: 7, time: '9:00 AM', title: 'Checkup', patient: 'Tom Wilson', type: 'checkup' },
        { id: 8, time: '2:00 PM', title: 'Surgery', patient: 'Sarah Davis', type: 'surgery' }
      ],
      '2024-01-13': [
        { id: 9, time: '9:00 AM', title: 'Checkup', patient: 'Mike Chen', type: 'checkup' },
        { id: 10, time: '2:00 PM', title: 'Surgery', patient: 'Lisa Wang', type: 'surgery' }
      ],
      '2024-01-16': [
        { id: 11, time: '9:00 AM', title: 'Checkup', patient: 'David Kim', type: 'checkup' },
        { id: 12, time: '2:00 PM', title: 'Surgery', patient: 'Emily Taylor', type: 'surgery' }
      ],
      '2024-01-19': [
        { id: 13, time: '9:00 AM', title: 'Checkup', patient: 'Chris Lee', type: 'checkup' },
        { id: 14, time: '2:00 PM', title: 'Surgery', patient: 'Anna Martinez', type: 'surgery' }
      ],
      '2024-01-22': [
        { id: 15, time: '9:00 AM', title: 'Checkup', patient: 'Kevin Park', type: 'checkup' },
        { id: 16, time: '2:00 PM', title: 'Surgery', patient: 'Rachel Green', type: 'surgery' }
      ],
      '2024-01-25': [
        { id: 17, time: '9:00 AM', title: 'Checkup', patient: 'Steven Adams', type: 'checkup' },
        { id: 18, time: '2:00 PM', title: 'Surgery', patient: 'Maria Garcia', type: 'surgery' }
      ],
      '2024-01-28': [
        { id: 19, time: '9:00 AM', title: 'Checkup', patient: 'Jason White', type: 'checkup' },
        { id: 20, time: '2:00 PM', title: 'Surgery', patient: 'Jennifer Lee', type: 'surgery' }
      ],
      '2024-01-31': [
        { id: 21, time: '9:00 AM', title: 'Checkup', patient: 'Michael Brown', type: 'checkup' },
        { id: 22, time: '2:00 PM', title: 'Surgery', patient: 'Jessica Wilson', type: 'surgery' }
      ]
    }
  });

  // New appointment form state
  const [appointmentForm, setAppointmentForm] = useState({
    patient: '',
    patientName: '',
    date: '',
    time: '9:00 AM',
    type: 'consultation',
    reason: ''
  });

  const [availablePatients] = useState([
    { id: 1, name: 'Sarah Johnson', patientId: 'P-2024-001' },
    { id: 2, name: 'Michael Chen', patientId: 'P-2024-002' },
    { id: 3, name: 'Emma Wilson', patientId: 'P-2024-003' },
    { id: 4, name: 'David Brown', patientId: 'P-2024-004' },
    { id: 5, name: 'Lisa Anderson', patientId: 'P-2024-005' },
    { id: 6, name: 'James Miller', patientId: 'P-2024-006' }
  ]);

  const [availableTimeSlots] = useState([
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM'
  ]);

  const resetAppointmentForm = () => {
    setAppointmentForm({
      patient: '',
      patientName: '',
      date: '',
      time: '9:00 AM',
      type: 'consultation',
      reason: ''
    });
  };

  const handleAppointmentSubmit = () => {
    if (!appointmentForm.patient || !appointmentForm.date || !appointmentForm.time) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields (Patient, Date, Time).",
        variant: "destructive"
      });
      return;
    }

    const selectedPatient = availablePatients.find(p => p.id.toString() === appointmentForm.patient);
    if (!selectedPatient) return;

    // Generate new appointment ID
    const newId = Math.max(...Object.values(calendarState.appointments).flat().map(a => a.id)) + 1;

    // Create new appointment object
    const newAppointment = {
      id: newId,
      time: appointmentForm.time,
      title: appointmentForm.type.charAt(0).toUpperCase() + appointmentForm.type.slice(1),
      patient: selectedPatient.name,
      type: appointmentForm.type,
      reason: appointmentForm.reason
    };

    // Add appointment to calendar
    const dateKey = appointmentForm.date;
    setCalendarState(prev => ({
      ...prev,
      appointments: {
        ...prev.appointments,
        [dateKey]: [...(prev.appointments[dateKey] || []), newAppointment]
      }
    }));

    closeModal('showNewAppointment');
    resetAppointmentForm();
    
    toast({
      title: "Appointment Scheduled!",
      description: `${appointmentForm.type} for ${selectedPatient.name} scheduled for ${new Date(appointmentForm.date).toLocaleDateString()} at ${appointmentForm.time}.`
    });
  };

  // Calendar navigation functions
  const navigateMonth = (direction) => {
    setCalendarState(prev => {
      const newDate = new Date(prev.currentDate);
      newDate.setMonth(newDate.getMonth() + direction);
      return { ...prev, currentDate: newDate };
    });
  };

  const goToToday = () => {
    setCalendarState(prev => ({
      ...prev,
      currentDate: new Date()
    }));
  };

  const setViewMode = (mode) => {
    setCalendarState(prev => ({ ...prev, viewMode: mode }));
  };

  const getDateKey = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const getAppointmentsForDate = (date) => {
    const dateKey = getDateKey(date);
    return calendarState.appointments[dateKey] || [];
  };

  const deleteAppointment = (appointmentId) => {
    setCalendarState(prev => {
      const newAppointments = { ...prev.appointments };
      Object.keys(newAppointments).forEach(dateKey => {
        newAppointments[dateKey] = newAppointments[dateKey].filter(apt => apt.id !== appointmentId);
        if (newAppointments[dateKey].length === 0) {
          delete newAppointments[dateKey];
        }
      });
      return { ...prev, appointments: newAppointments };
    });
  };

  // Enhanced demo actions with realistic workflows
  const showPatientDetails = (patient) => {
    setDemoState(prev => ({
      ...prev,
      showPatientModal: true,
      selectedPatientData: {
        name: patient.name || "John Doe",
        id: "P-2024-001",
        age: 45,
        condition: "Hypertension",
        lastVisit: "2024-01-15",
        medications: ["Lisinopril 10mg", "Metformin 500mg"],
        vitals: { bp: "140/90", hr: "78", temp: "98.6°F" },
        notes: "Patient reports feeling better with current medication regimen."
      }
    }));
  };

  const showScheduleAppointment = () => {
    resetAppointmentForm();
    setDemoState(prev => ({ ...prev, showNewAppointment: true }));
  };

  const showRescheduleAppointment = (appointment) => {
    setDemoState(prev => ({ 
      ...prev, 
      showRescheduleAppointment: true,
      selectedAppointmentForReschedule: appointment
    }));
  };

  const showVoiceRecording = () => {
    setDemoState(prev => ({ ...prev, showVoiceRecordingModal: true }));
    // Simulate voice recording
    setTimeout(() => {
      setDemoState(prev => ({ ...prev, voiceRecording: true }));
      let text = "";
      const phrases = [
        "Patient presents with chest pain...",
        "Vital signs are stable...",
        "Recommending ECG and blood work...",
        "Follow up in 2 weeks..."
      ];

      phrases.forEach((phrase, index) => {
        setTimeout(() => {
          text += phrase + " ";
          setDemoState(prev => ({ ...prev, recordingText: text }));
        }, (index + 1) * 1000);
      });

      setTimeout(() => {
        setDemoState(prev => ({ ...prev, voiceRecording: false }));
      }, 5000);
    }, 500);
  };

  const showMedicalSearch = () => {
    setDemoState(prev => ({ ...prev, showMedicalSearchModal: true }));
    // Simulate search results
    setTimeout(() => {
      setDemoState(prev => ({
        ...prev,
        searchResults: [
          { title: "Hypertension Treatment Guidelines", type: "Protocol", relevance: "95%" },
          { title: "ACE Inhibitor Drug Interactions", type: "Drug Info", relevance: "87%" },
          { title: "Cardiovascular Risk Assessment", type: "Tool", relevance: "82%" },
        ]
      }));
    }, 1500);
  };

  const showPatientSearch = () => {
    setDemoState(prev => ({ ...prev, showPatientSearch: true }));
  };

  const closeModal = (modalName) => {
    setDemoState(prev => ({ ...prev, [modalName]: false }));
  };

  // Additional demo functions
  const showPrescriptionModal = () => {
    setDemoState(prev => ({ ...prev, showPrescriptionModal: true }));
  };

  const showLabOrderModal = () => {
    setDemoState(prev => ({ ...prev, showLabOrderModal: true }));
  };

  const showProfileModal = () => {
    setDemoState(prev => ({ ...prev, showProfileModal: true }));
  };

  const showScheduleView = () => {
    setDemoState(prev => ({ ...prev, showScheduleModal: true }));
  };

  const showAlertsModal = () => {
    setDemoState(prev => ({ ...prev, showAlertsModal: true }));
  };

  const showAIConsultModal = () => {
    setDemoState(prev => ({ ...prev, showAIConsultModal: true }));
  };

  const showTimeSlotModal = () => {
    setDemoState(prev => ({ ...prev, showTimeSlotModal: true }));
  };

  const showNotificationModal = () => {
    setDemoState(prev => ({ ...prev, showNotificationModal: true }));
  };

  const showFAQModal = () => {
    setDemoState(prev => ({ ...prev, showFAQModal: true }));
  };

  const showReportIssueModal = () => {
    setDemoState(prev => ({ ...prev, showReportIssueModal: true }));
  };

  const showAddPatientModal = () => {
    setDemoState(prev => ({ ...prev, showAddPatientModal: true }));
  };

  // Quick success modals for less complex actions
  const showSuccessModal = (title, message) => {
    toast({
      title: title,
      description: message,
    });
  };

  const doctorActions = {
    viewPatient: (patient) => showPatientDetails(patient),
    prescribeMedication: () => showPrescriptionModal(),
    orderLabTest: () => showLabOrderModal(),
    scheduleAppointment: () => showScheduleAppointment(),
    rescheduleAppointment: (appointment) => showRescheduleAppointment(appointment),
    updateDiagnosis: () => toast({ title: "Success!", description: "Patient diagnosis updated successfully." }),
    sendReport: () => toast({ title: "Success!", description: "Report sent to patient successfully." }),
    voiceDictation: () => showVoiceRecording(),
    aiConsultation: () => showAIConsultModal(),
    exportRecords: () => toast({ title: "Success!", description: "Patient records exported successfully." }),
    emergencyAlert: () => toast({ title: "Alert Sent!", description: "Emergency alert sent to medical team." }),
    dischargePatient: () => toast({ title: "Success!", description: "Patient discharge processed successfully." }),
    requestConsult: () => toast({ title: "Success!", description: "Specialist consultation requested." }),
    searchPatients: () => showPatientSearch(),
    medicalSearch: () => showMedicalSearch(),
  };

  // Enhanced Notifications
  const [notifications, setNotifications] = useState([
    { id: 1, type: "urgent", message: "Critical lab results for Patient #12457 - Immediate attention required", time: "5 min ago", patient: "John Doe" },
    { id: 2, type: "info", message: "New patient record added - Sarah Johnson", time: "15 min ago", patient: "Sarah Johnson" },
    { id: 3, type: "lab", message: "Lab results ready for review - 3 patients", time: "30 min ago", count: 3 },
    { id: 4, type: "appointment", message: "Appointment rescheduled - Michael Chen", time: "1 hour ago", patient: "Michael Chen" },
    { id: 5, type: "success", message: "Patient discharge summary completed", time: "2 hours ago", patient: "Emma Wilson" },
  ]);

  // Close notifications dropdown on outside click / ESC / tab change
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsNotificationsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);
  useEffect(() => { setIsNotificationsOpen(false); }, [activeTab]);

  // Also handle initial URL parameters on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam && ['critical', 'patients', 'appointments', 'reports', 'profile', 'help'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, []);

  // Today's Statistics
  const [todayStats] = useState([
    { label: "Patients Seen", value: "12", change: "+3", trend: "up", icon: Users, target: 15 },
    { label: "Pending Reports", value: "5", change: "-2", trend: "down", icon: FileText, target: 0 },
    { label: "Scheduled Appointments", value: "8", change: "0", trend: "stable", icon: Calendar, target: 10 },
    { label: "Lab Results Reviewed", value: "15", change: "+7", trend: "up", icon: TestTube, target: 20 },
  ]);

  // Patient List with Access Control
  const [patientList, setPatientList] = useState([
    { 
      id: 1, 
      name: "Sarah Johnson", 
      patientId: "P-2024-001", 
      condition: "Hypertension", 
      type: "Outpatient", 
      appointmentDate: "2024-01-26",
      accessUntil: "2024-01-26",
      status: "Active",
      lastVisit: "2024-01-15",
      avatar: "/placeholder.svg",
      notes: "Patient responding well to medication",
      diagnosis: "Essential Hypertension - Stage 2",
      medication: "Lisinopril 10mg daily"
    },
    { 
      id: 2, 
      name: "Michael Chen", 
      patientId: "P-2024-002", 
      condition: "Diabetes Type 2", 
      type: "Inpatient", 
      admissionDate: "2024-01-20",
      accessUntil: "2024-02-05",
      status: "Admitted",
      room: "ICU-204",
      avatar: "/placeholder.svg",
      notes: "Blood glucose levels stabilizing",
      diagnosis: "Type 2 Diabetes Mellitus with complications",
      medication: "Metformin 1000mg twice daily"
    },
    { 
      id: 3, 
      name: "Emma Wilson", 
      patientId: "P-2024-003", 
      condition: "Regular Checkup", 
      type: "Outpatient", 
      appointmentDate: "2024-01-26",
      accessUntil: "2024-01-26",
      status: "Scheduled",
      lastVisit: "2023-12-15",
      avatar: "/placeholder.svg",
      notes: "Annual wellness visit",
      diagnosis: "Routine health maintenance",
      medication: "Multivitamin daily"
    },
  ]);

  // Appointments with Management Features
  const [appointments] = useState([
    { 
      id: 1, 
      patient: "Sarah Johnson", 
      patientId: "P-2024-001",
      time: "9:00 AM", 
      duration: "30 min",
      type: "Follow-up", 
      condition: "Hypertension", 
      status: "Confirmed",
      notes: "Blood pressure monitoring",
      avatar: "/placeholder.svg" 
    },
    { 
      id: 2, 
      patient: "Michael Chen", 
      patientId: "P-2024-002",
      time: "10:00 AM", 
      duration: "45 min",
      type: "Consultation", 
      condition: "Diabetes", 
      status: "Confirmed",
      notes: "Medication adjustment",
      avatar: "/placeholder.svg" 
    },
    { 
      id: 3, 
      patient: "Emma Wilson", 
      patientId: "P-2024-003",
      time: "11:00 AM", 
      duration: "30 min",
      type: "Check-up", 
      condition: "Regular", 
      status: "Pending",
      notes: "Annual physical",
      avatar: "/placeholder.svg" 
    },
    { 
      id: 4, 
      patient: "David Brown", 
      patientId: "P-2024-004",
      time: "2:00 PM", 
      duration: "60 min",
      type: "Emergency", 
      condition: "Chest Pain", 
      status: "Urgent",
      notes: "Immediate attention required",
      avatar: "/placeholder.svg" 
    },
  ]);

  // Lab Results Management
  const [labResults, setLabResults] = useState([
    {
      id: 1,
      patient: "Sarah Johnson",
      patientId: "P-2024-001",
      testType: "Blood Panel",
      date: "2024-01-25",
      status: "Ready for Review",
      priority: "Normal",
      results: "Cholesterol: 180 mg/dL, Glucose: 95 mg/dL",
      technician: "Lab Tech A",
      detailedResults: {
        cholesterol: { value: 180, unit: "mg/dL", normal: "< 200", status: "Normal" },
        glucose: { value: 95, unit: "mg/dL", normal: "70-100", status: "Normal" },
        triglycerides: { value: 120, unit: "mg/dL", normal: "< 150", status: "Normal" },
        hdl: { value: 55, unit: "mg/dL", normal: "> 40", status: "Normal" }
      },
      voiceNotes: []
    },
    {
      id: 2,
      patient: "Michael Chen",
      patientId: "P-2024-002",
      testType: "HbA1c",
      date: "2024-01-25",
      status: "Critical",
      priority: "High",
      results: "HbA1c: 9.2% (Critical)",
      technician: "Lab Tech B",
      detailedResults: {
        hba1c: { value: 9.2, unit: "%", normal: "< 7.0", status: "Critical" },
        glucose: { value: 280, unit: "mg/dL", normal: "70-100", status: "High" }
      },
      voiceNotes: []
    },
    {
      id: 3,
      patient: "Emma Wilson",
      patientId: "P-2024-003",
      testType: "Complete Blood Count",
      date: "2024-01-24",
      status: "Approved",
      priority: "Normal",
      results: "All values within normal range",
      technician: "Lab Tech C",
      detailedResults: {
        wbc: { value: 6.5, unit: "K/μL", normal: "4.0-11.0", status: "Normal" },
        rbc: { value: 4.2, unit: "M/μL", normal: "3.8-5.1", status: "Normal" },
        hemoglobin: { value: 13.5, unit: "g/dL", normal: "11.7-15.5", status: "Normal" },
        hematocrit: { value: 40.2, unit: "%", normal: "35-45", status: "Normal" }
      },
      voiceNotes: [
        { id: 1, text: "Patient shows good recovery from previous anemia", timestamp: "2024-01-24 10:30 AM" }
      ]
    },
  ]);

  const [selectedLabResult, setSelectedLabResult] = useState<any>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-blue-100/20 flex">
        {/* Side Navigation - Fixed Height */}
        <div className="w-64 bg-gradient-to-b from-blue-50 to-blue-100/50 border-r border-blue-200/60 shadow-2xl flex flex-col fixed h-screen backdrop-blur-sm">
        {/* Logo/Brand */}
        <div className="p-5 border-b border-blue-200/60 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
              <Stethoscope className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent truncate">MediVoice</h1>
              <p className="text-xs text-blue-600 font-medium">Doctor Portal</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-2">
            {[
              { id: "dashboard", label: "Dashboard", icon: Activity },
              { id: "critical", label: "Critical Alerts", icon: AlertTriangle },
              { id: "patients", label: "Patient List", icon: Users },
              { id: "appointments", label: "Appointments", icon: Calendar },
              { id: "ai-chatbot", label: "AI Chatbot", icon: Brain },
              { id: "reports", label: "Lab Results", icon: TestTube },
              { id: "profile", label: "Profile & Settings", icon: Settings },
              { id: "help", label: "Help & Support", icon: HelpCircle },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => item.id === 'ai-chatbot' ? navigate('/doctor/ai-chatbot') : setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-left transition-all duration-300 text-sm font-medium group hover:scale-[1.02] hover:shadow-lg ${
                  activeTab === item.id
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 border border-blue-400/30"
                    : "text-slate-700 hover:bg-gradient-to-r hover:from-white/90 hover:to-blue-50/90 hover:text-blue-700 hover:shadow-md hover:border-blue-200/60 border border-transparent"
                }`}
              >
                <item.icon className={`h-5 w-5 transition-all duration-300 ${activeTab === item.id ? 'scale-110 text-blue-100' : 'group-hover:scale-110 group-hover:text-blue-600'}`} />
                <span className="font-medium transition-colors duration-300">{item.label}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* User Profile in Sidebar */}
        <div className="p-4 border-t border-blue-200/60 bg-white/80 backdrop-blur-sm">
          <button
            onClick={() => setActiveTab("profile")}
            className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl hover:from-blue-100 hover:to-indigo-100 transition-all duration-300 cursor-pointer group shadow-md hover:shadow-lg"
          >
            <Avatar className="h-10 w-10 ring-2 ring-blue-400/40 shadow-lg">
              <AvatarImage src="/placeholder.svg" alt="Doctor" />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-sm">
                DS
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-left">
              <p className="font-semibold text-slate-800 text-sm group-hover:text-blue-700 transition-colors">{doctorProfile.name}</p>
              <p className="text-xs text-blue-600">{doctorProfile.specialization}</p>
            </div>
          </button>
        </div>
      </div>

      {/* Main Content Area - Adjusted for fixed sidebar */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Top Navigation Bar */}
        <header className="relative bg-gradient-to-r from-white via-blue-50/30 to-white border-b border-blue-200/60 shadow-lg backdrop-blur-sm z-[1000]">
          <div className="px-8 py-5">
            <div className="flex items-center justify-between min-h-[60px]">
              <div className="flex-1">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-blue-800 bg-clip-text text-transparent leading-tight">
                  {activeTab === "dashboard" && "Doctor Dashboard"}
                  {activeTab === "critical" && "Critical Alerts"}
                  {activeTab === "patients" && "Patient Management"}
                  {activeTab === "appointments" && "Appointments"}
                  {activeTab === "reports" && "Lab Results"}
                  {activeTab === "profile" && "Profile & Settings"}
                  {activeTab === "help" && "Help & Support"}
                </h2>
                <p className="text-slate-600 font-medium mt-1">Welcome back, {doctorProfile.name} • License: {doctorProfile.licenseNumber}</p>
              </div>

              {/* Top Right Actions */}
              <div className="flex items-center justify-end gap-4">
                {/* Notifications */}
                <div className="relative flex items-center z-[1000]" ref={notificationsRef}>
                  <Button
                    variant="ghost"
                    size="icon-lg"
                    onClick={() => setIsNotificationsOpen(prev => !prev)}
                    className="hover:bg-blue-100/80 relative rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group z-[1001]"
                  >
                    <Bell className="h-6 w-6 text-slate-600 group-hover:text-blue-600 transition-colors duration-300" />
                    {notifications.length > 0 && (
                      <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 min-w-[20px] h-5 rounded-full text-[10px] font-bold bg-gradient-to-r from-red-500 to-red-600 text-white animate-pulse shadow-lg group-hover:from-red-600 group-hover:to-red-700 transition-all duration-300">
                        {notifications.length}
                      </span>
                    )}
                  </Button>
                  {isNotificationsOpen && (
                    <div className="absolute top-full right-0 mt-2 w-80 z-dropdown bg-white/95 backdrop-blur-lg border border-blue-200/60 rounded-xl shadow-2xl">
                      {/* Arrow indicator */}
                      <div className="absolute -top-2 right-4 w-4 h-4 bg-white/95 border-l border-t border-blue-200/60 transform rotate-45 z-dropdown"></div>
                      
                      <div className="relative p-4 border-b border-blue-200/60 flex items-center justify-between bg-gradient-to-r from-blue-50/80 to-indigo-50/80 rounded-t-xl">
                        <div className="flex items-center gap-2">
                          <Bell className="h-5 w-5 text-blue-600" />
                          <span className="font-semibold text-slate-800">Notifications</span>
                        </div>
                        {notifications.length > 0 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const sample = [
                                { id: Date.now(), type: 'info', message: 'No new notifications', time: 'Just now', patient: 'System' }
                              ];
                              setNotifications(sample);
                              setIsNotificationsOpen(false);
                            }}
                            className="h-8 px-3 text-xs border-red-200/60 text-red-700 hover:bg-red-50 hover:border-red-300 rounded-lg transition-all duration-300 hover:shadow-sm hover:scale-[1.02] z-10"
                          >
                            Clear All
                          </Button>
                        )}
                      </div>
                      <div className="max-h-80 overflow-auto p-4 rounded-b-xl">
                        {notifications.length === 0 ? (
                          <div className="p-6 text-center">
                            <Bell className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                            <p className="text-slate-500 font-medium">No new notifications</p>
                            <p className="text-slate-400 text-sm">You're all caught up!</p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {notifications.map((n) => (
                              <div
                                key={n.id}
                                className={`p-3 rounded-lg border transition-all duration-300 hover:shadow-md cursor-pointer hover:scale-[1.01] group ${
                                  n.type === 'urgent'
                                    ? 'bg-gradient-to-r from-red-50 to-red-100/50 border-red-200/60 hover:from-red-100 hover:to-red-200/60 hover:border-red-300/70'
                                    : n.type === 'lab'
                                    ? 'bg-gradient-to-r from-blue-50 to-blue-100/50 border-blue-200/60 hover:from-blue-100 hover:to-blue-200/60 hover:border-blue-300/70'
                                    : n.type === 'appointment'
                                    ? 'bg-gradient-to-r from-blue-50 to-blue-100/50 border-blue-200/60 hover:from-blue-100 hover:to-blue-200/60 hover:border-blue-300/70'
                                    : 'bg-gradient-to-r from-slate-50 to-slate-100/50 border-slate-200/60 hover:from-slate-100 hover:to-slate-200/60 hover:border-slate-300/70'
                                }`}
                              >
                                <div className="flex items-start gap-3">
                                  <div className={`mt-1 w-3 h-3 rounded-full shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:shadow-md ${
                                    n.type === 'urgent' ? 'bg-red-500 group-hover:bg-red-600' : 
                                    n.type === 'lab' ? 'bg-blue-500 group-hover:bg-blue-600' : 
                                    n.type === 'appointment' ? 'bg-blue-500 group-hover:bg-blue-600' : 'bg-slate-400 group-hover:bg-slate-500'
                                  }`}></div>
                                  <div className="flex-1">
                                    <p className="text-sm font-medium text-slate-800 leading-relaxed group-hover:text-slate-900 transition-colors">{n.message}</p>
                                    <div className="flex items-center justify-between mt-2">
                                      <p className="text-xs text-slate-500 font-medium group-hover:text-slate-600 transition-colors">{n.time}</p>
                                      {n.patient && (
                                        <span className="text-xs bg-white/70 text-slate-600 px-2 py-1 rounded-full border border-slate-200/60 group-hover:bg-white group-hover:shadow-sm transition-all duration-300">
                                          {n.patient}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                {isProcessing && (
                  <div className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span className="text-sm text-blue-600 font-medium">Processing...</span>
                  </div>
                )}

                {/* Replace MediVo AI button to navigate to standalone page */}
                <Button
                  onClick={() => navigate("/doctor/ai-chatbot")}
                  className="bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 hover:from-blue-600 hover:via-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3 rounded-xl font-medium hover:scale-[1.02] z-10"
                  disabled={isProcessing}
                >
                  <Zap className="h-5 w-5 mr-2" />
                  MediVo AI
                </Button>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon-lg"
                        onClick={handleProfileClick}
                        className="hover:bg-blue-100 hover:scale-[1.02] transition-all duration-300 rounded-full shadow-sm hover:shadow-md group z-10"
                      >
                        <User className="h-5 w-5 text-slate-600 group-hover:text-blue-600 transition-colors duration-300" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Profile Settings</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon-lg"
                        onClick={handleLogout}
                        className="hover:bg-red-100 hover:text-red-600 hover:scale-[1.02] transition-all duration-300 rounded-full shadow-sm hover:shadow-md group z-10"
                      >
                        <LogOut className="h-5 w-5 text-slate-600 group-hover:text-red-600 transition-colors duration-300" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Logout</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Dashboard Tab Content */}
          {activeTab === "dashboard" && (
            <>
              {/* Two-Column Layout after removing in-page Critical Alerts */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Left Column - Today's Schedule */}
                <Card className="lg:col-span-2 border border-blue-200/60 shadow-xl bg-gradient-to-br from-white via-blue-50/20 to-white hover:shadow-2xl transition-all duration-500 hover:scale-[1.005] rounded-2xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-blue-100/90 via-indigo-50/80 to-blue-100/90 border-b border-blue-200/60 p-6">
                    <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-800">
                      <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                        <Calendar className="h-6 w-6 text-white" />
                      </div>
                      Today's Schedule
                    </CardTitle>
                    <CardDescription className="text-slate-600 font-medium ml-14">Patient consultations and procedures</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    {appointments.slice(0, 3).map((appointment) => (
                      <div key={appointment.id} className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50/90 to-indigo-50/70 rounded-xl hover:from-blue-100/90 hover:to-indigo-100/80 hover:shadow-md transition-all duration-300 border border-blue-200/40 cursor-pointer group hover:scale-[1.005] hover:border-blue-300/60">
                        <div className="text-center min-w-[60px] bg-white rounded-lg p-2 shadow-sm group-hover:shadow-md transition-all duration-300">
                          <p className="text-sm font-bold text-blue-600 group-hover:text-blue-700 transition-colors">{appointment.time}</p>
                          <p className="text-xs text-blue-500 group-hover:text-blue-600 transition-colors">{appointment.duration}</p>
                        </div>
                        <Avatar className="h-10 w-10 ring-2 ring-blue-400/40 shadow-md group-hover:ring-blue-500/60 group-hover:shadow-lg transition-all duration-300">
                          <AvatarImage src={appointment.avatar} alt={appointment.patient} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-sm group-hover:from-blue-600 group-hover:to-indigo-700 transition-all duration-300">
                            {appointment.patient.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-slate-800 group-hover:text-slate-900 transition-colors">{appointment.patient}</p>
                            <Badge variant={appointment.status === 'Urgent' ? 'destructive' : 'secondary'} className="text-xs rounded-full px-3 transition-all duration-300 group-hover:shadow-sm">
                              {appointment.type}
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-600 group-hover:text-slate-700 transition-colors">{appointment.condition}</p>
                          <p className="text-xs text-slate-500 group-hover:text-slate-600 transition-colors">{appointment.notes}</p>
                        </div>
                      </div>
                    ))}
                    <Button
                      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.01] rounded-xl font-medium z-10"
                      onClick={showScheduleView}
                      disabled={isProcessing}
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      View Full Schedule
                    </Button>
                  </CardContent>
                </Card>

                {/* Right Column - Quick Actions */}
                <Card className="border border-blue-200/60 shadow-lg bg-gradient-to-br from-white/95 to-blue-50/95 hover:shadow-xl transition-all duration-300">
                  <CardHeader className="bg-gradient-to-r from-blue-100/80 to-blue-50/80 border-b border-blue-200/60">
                    <CardTitle className="flex items-center gap-2 text-lg font-bold text-slate-800">
                      <Zap className="h-5 w-5 text-blue-600" />
                      Quick Actions
                    </CardTitle>
                    <CardDescription className="text-slate-600">Frequently used tools and shortcuts</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <Button
                      variant="outline"
                      className="w-full justify-start border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 transition-all duration-300 rounded-xl py-3"
                      onClick={doctorActions.scheduleAppointment}
                      disabled={isProcessing}
                    >
                      <Calendar className="h-4 w-4 mr-3" />
                      New Appointment
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full justify-start border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 transition-all duration-300 rounded-xl py-3"
                      onClick={doctorActions.searchPatients}
                      disabled={isProcessing}
                    >
                      <Users className="h-4 w-4 mr-3" />
                      Find Patient
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full justify-start border-amber-300 text-amber-700 hover:bg-amber-50 hover:border-amber-400 transition-all duration-300 rounded-xl py-3"
                      onClick={doctorActions.prescribeMedication}
                      disabled={isProcessing}
                    >
                      <Pill className="h-4 w-4 mr-3" />
                      Write Prescription
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full justify-start border-teal-300 text-teal-700 hover:bg-teal-50 hover:border-teal-400 transition-all duration-300 rounded-xl py-3"
                      onClick={doctorActions.orderLabTest}
                      disabled={isProcessing}
                    >
                      <TestTube className="h-4 w-4 mr-3" />
                      Order Lab Test
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </>
          )}

          {/* Patient List Tab Content */}
          {activeTab === "patients" && (
            <div className="space-y-6">
              <Card className="border border-blue-200/60 shadow-lg bg-gradient-to-br from-white/95 to-blue-50/95">
                <CardHeader className="bg-gradient-to-r from-blue-100/80 to-blue-50/80 border-b border-blue-200/60">
                  <CardTitle className="flex items-center gap-2 text-slate-800">
                    <Users className="h-5 w-5 text-blue-600" />
                    Active Patients
                  </CardTitle>
                  <CardDescription className="text-slate-600">Patients with current access permissions</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="mb-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search patients by name or ID..."
                        value={patientSearch}
                        onChange={(e) => setPatientSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-blue-200 rounded-full focus:border-blue-400 focus:ring-2 focus:ring-blue-200 focus:outline-none hover:border-blue-300 hover:shadow-md transition-all duration-300"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    {patientList
                      .filter(p => p.name.toLowerCase().includes(patientSearch.toLowerCase()) || p.patientId.toLowerCase().includes(patientSearch.toLowerCase()))
                      .map((patient) => (
                      <div key={patient.id} className="p-4 border border-blue-200/60 rounded-xl bg-white hover:shadow-md hover:shadow-blue-500/10 transition-all duration-300 hover:scale-[1.005] hover:border-blue-300/70 cursor-pointer group">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Avatar className="h-10 w-10 ring-2 ring-blue-400/40 group-hover:ring-blue-500/60 group-hover:shadow-md transition-all duration-300">
                              <AvatarImage src={patient.avatar} alt={patient.name} />
                              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold group-hover:from-blue-600 group-hover:to-blue-700 transition-all duration-300">
                                {patient.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold text-slate-800 group-hover:text-slate-900 transition-colors duration-300">{patient.name}</p>
                              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 group-hover:text-slate-700 transition-colors duration-300 mt-0.5">
                                <span>ID: {patient.patientId}</span>
                                <span className="hidden sm:inline">{patient.condition}</span>
                                <span className="hidden sm:inline">Last visit: {patient.lastVisit}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge className={`${patient.type === 'Outpatient' ? 'bg-blue-100 text-blue-700 group-hover:bg-blue-200' : 'bg-slate-100 text-slate-700 group-hover:bg-slate-200'} border-0 transition-all duration-300`}>{patient.type}</Badge>
                            <Badge className={`${patient.status === 'Active' ? 'bg-green-100 text-green-700 group-hover:bg-green-200' : 'bg-slate-100 text-slate-700 group-hover:bg-slate-200'} border-0 transition-all duration-300`}>{patient.status}</Badge>
                            <Button
                              variant="link"
                              size="sm"
                              className="text-blue-600 hover:text-blue-700 px-1 hover:bg-blue-50 rounded-lg transition-all duration-300"
                              onClick={() => doctorActions.viewPatient(patient)}
                              disabled={isProcessing}
                            >
                              View Records
                            </Button>
                            <Button
                              variant="link"
                              size="sm"
                              className="text-green-600 hover:text-green-700 px-1 hover:bg-green-50 rounded-lg transition-all duration-300"
                              onClick={() => {
                                setDemoState(prev => ({ 
                                  ...prev, 
                                  selectedPatientForUpdate: patient,
                                  showPatientUpdateOptionsModal: true 
                                }));
                              }}
                              disabled={isProcessing}
                            >
                              Update
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-slate-600 hover:text-slate-700 px-1 hover:bg-slate-100 rounded-lg transition-all duration-300 hover:scale-110"
                              onClick={doctorActions.exportRecords}
                              disabled={isProcessing}
                              title="Export Record"
                            >
                              <Download className="h-4 w-4 transition-transform duration-300" />
                            </Button>
                          </div>
                        </div>
                      </div>
                     ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Patient Records Tab Content */}
          {activeTab === "records" && null}

          {/* Critical Alerts Tab */}
          {activeTab === "critical" && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg p-6 border border-red-200 shadow-sm">
                <h3 className="text-2xl font-bold text-red-700">Critical Alerts</h3>
                <p className="text-slate-600">Urgent notifications requiring immediate attention</p>
              </div>

              <Card className="border border-red-200/60 shadow-xl bg-gradient-to-br from-white/95 to-red-50/95">
                <CardHeader className="bg-gradient-to-r from-red-100/80 to-red-50/80 border-b border-red-200/60">
                  <CardTitle className="flex items-center gap-2 text-slate-800">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    High Priority Alerts
                  </CardTitle>
                  <CardDescription className="text-slate-600">Includes critical labs, patient deterioration, and urgent tasks</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    {notifications
                      .filter(n => n.type === 'urgent' || n.type === 'lab')
                      .map((n) => (
                        <div key={n.id} className={`p-4 rounded-lg border-l-4 ${n.type === 'urgent' ? 'border-l-red-600 bg-red-50' : 'border-l-blue-600 bg-blue-50'}`}>
                          <div className="flex items-start gap-3">
                            {n.type === 'urgent' ? <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" /> : <TestTube className="h-4 w-4 text-blue-600 mt-0.5" />}
                            <div className="flex-1">
                              <p className="text-sm font-medium text-slate-800">{n.message}</p>
                              <p className="text-xs text-slate-600 mt-1">{n.time}</p>
                            </div>
                          </div>
                        </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Appointments Tab Content */}
          {activeTab === "appointments" && (
            <div className="space-y-6">
              <Card className="border border-blue-200/60 shadow-lg bg-gradient-to-br from-white/95 to-blue-50/95">
                <CardHeader className="bg-gradient-to-r from-blue-100/80 to-blue-50/80 border-b border-blue-200/60">
                  <CardTitle className="flex items-center gap-2 text-slate-800">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    Today's Appointments
                  </CardTitle>
                  <CardDescription className="text-slate-600">Manage your daily appointment schedule</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search by patient name, time, or ID..."
                        value={patientSearch}
                        onChange={(e) => setPatientSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-blue-200 rounded-full focus:border-blue-400 focus:ring-2 focus:ring-blue-200 focus:outline-none hover:border-blue-300 hover:shadow-md transition-all duration-300"
                      />
                    </div>
                    <Button
                      className="ml-4 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white hover:scale-[1.02] transition-all duration-300 hover:shadow-lg z-10"
                      onClick={doctorActions.scheduleAppointment}
                      disabled={isProcessing}
                    >
                      <Plus className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />
                      New Appointment
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {appointments
                      .filter(appointment => {
                        const searchLower = patientSearch.toLowerCase();
                        return (
                          appointment.patient.toLowerCase().includes(searchLower) ||
                          appointment.time.toLowerCase().includes(searchLower) ||
                          String(appointment.id).toLowerCase().includes(searchLower)
                        );
                      })
                      .map((appointment) => (
                      <div key={appointment.id} className="p-4 border border-blue-200/60 rounded-xl bg-white hover:shadow-md hover:shadow-blue-500/10 transition-all duration-300 hover:scale-[1.005] hover:border-blue-300/70 cursor-pointer group z-10">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="text-center min-w-[60px] group-hover:scale-105 transition-transform duration-300">
                              <div className="text-lg font-bold text-slate-800 group-hover:text-slate-900 transition-colors duration-300">{appointment.time}</div>
                              <div className="text-xs text-slate-600 group-hover:text-slate-700 transition-colors duration-300">{appointment.duration}</div>
                            </div>
                            <Avatar className="h-10 w-10 ring-2 ring-blue-400/40 group-hover:ring-blue-500/60 group-hover:shadow-md transition-all duration-300">
                              <AvatarImage src={appointment.avatar} alt={appointment.patient} />
                              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold group-hover:from-blue-600 group-hover:to-blue-700 transition-all duration-300">
                                {appointment.patient.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold text-slate-800 group-hover:text-slate-900 transition-colors duration-300">{appointment.patient}</p>
                              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 group-hover:text-slate-700 transition-colors duration-300 mt-0.5">
                                <span>ID: {appointment.patientId}</span>
                                <span className="hidden sm:inline">{appointment.condition}</span>
                                <span className="hidden sm:inline">Notes: {appointment.notes}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge className={`${appointment.type === 'Follow-up' ? 'bg-blue-100 text-blue-700 group-hover:bg-blue-200' : appointment.type === 'Consultation' ? 'bg-slate-100 text-slate-700 group-hover:bg-slate-200' : appointment.type === 'Check-up' ? 'bg-green-100 text-green-700 group-hover:bg-green-200' : 'bg-red-100 text-red-700 group-hover:bg-red-200'} border-0 transition-all duration-300`}>{appointment.type}</Badge>
                            <Badge className={`${appointment.status === 'Confirmed' ? 'bg-green-100 text-green-700 group-hover:bg-green-200' : appointment.status === 'Pending' ? 'bg-yellow-100 text-yellow-700 group-hover:bg-yellow-200' : 'bg-red-100 text-red-700 group-hover:bg-red-200'} border-0 transition-all duration-300`}>{appointment.status}</Badge>
                            <Button
                              variant="link"
                              size="sm"
                              className="text-blue-600 hover:text-blue-700 px-1 hover:bg-blue-50 rounded-lg transition-all duration-300"
                              onClick={() => doctorActions.viewPatient({ name: appointment.patient })}
                              disabled={isProcessing}
                            >
                              View Details
                            </Button>
                            <Button
                              variant="link"
                              size="sm"
                              className="text-green-600 hover:text-green-700 px-1 hover:bg-green-50 rounded-lg transition-all duration-300"
                              onClick={() => doctorActions.rescheduleAppointment(appointment)}
                              disabled={isProcessing}
                            >
                              Reschedule
                            </Button>
                          </div>
                        </div>
                      </div>
                     ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* MediVo AI Tab Content - Removed as it's now a separate page */}

          {/* Lab Results Tab Content */}
          {activeTab === "reports" && (
            <div className="space-y-6">
              {/* Search Bar Section - Following Patient Management Pattern */}
              <div className="bg-gradient-to-r from-white/95 to-blue-50/95 backdrop-blur-sm rounded-xl p-4 border border-blue-200/60 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search lab results by patient name, test type, or status..."
                        value={labResultsSearch}
                        onChange={(e) => setLabResultsSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-blue-200 rounded-full focus:border-blue-400 focus:ring-2 focus:ring-blue-200 focus:outline-none hover:border-blue-300 hover:shadow-md transition-all duration-300"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <select
                          value={labFilter}
                          onChange={(e) => setLabFilter(e.target.value)}
                          className="w-full min-w-[180px] px-4 py-3 pl-12 pr-10 border border-slate-300/50 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all duration-300 bg-gradient-to-r from-white to-blue-50/30 backdrop-blur-sm text-sm font-medium shadow-lg hover:shadow-xl appearance-none cursor-pointer"
                        >
                          <option value="all">All Results</option>
                          <option value="Critical">Critical</option>
                          <option value="Ready for Review">Ready for Review</option>
                          <option value="Approved">Approved</option>
                        </select>
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
                          </svg>
                        </div>
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      className="border-blue-300 text-blue-600 hover:bg-blue-50"
                      onClick={() => toast({ title: "Refreshed!", description: "Lab results updated with latest data." })}
                      disabled={isProcessing}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </Button>
                  </div>
                </div>
              </div>

              {/* Lab Results Cards */}
              <div className="space-y-4">
                {labResults
                  .filter(result => {
                    const matchesFilter = labFilter === 'all' || result.status === labFilter;
                    const searchLower = labResultsSearch.toLowerCase();
                    const matchesSearch = 
                      result.patient.toLowerCase().includes(searchLower) ||
                      result.patientId.toLowerCase().includes(searchLower) ||
                      result.testType.toLowerCase().includes(searchLower) ||
                      result.status.toLowerCase().includes(searchLower);
                    return matchesFilter && matchesSearch;
                  })
                  .map((result) => (
                    <Card key={result.id} className="border-slate-200 shadow-sm hover:shadow-md transition-all duration-200">
                      <div className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                {result.patient.split(' ').map(n => n[0]).join('')}
                              </div>
                            </Avatar>
                            <div className="flex-1">
                              <div className="font-semibold text-slate-800">{result.patient}</div>
                              <div className="text-sm text-slate-600">{result.testType} • {result.date}</div>
                              <div className="text-xs text-slate-500 mt-1">
                                ID: {result.patientId} • Tech: {result.technician}
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge 
                                variant="secondary"
                                className={
                                  result.status === 'Critical' ? 'bg-red-100 text-red-700 border-red-200' :
                                  result.status === 'Pending' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                                  'bg-green-100 text-green-700 border-green-200'
                                }
                              >
                                {result.status}
                              </Badge>
                              {result.priority === 'High' && (
                                <div className="mt-1">
                                  <Badge variant="destructive" className="text-xs">
                                    HIGH PRIORITY
                                  </Badge>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedLabResult(result);
                                setDemoState(prev => ({ ...prev, showLabResultsModal: true }));
                              }}
                              className="border-blue-300 text-blue-600 hover:bg-blue-50"
                              disabled={isProcessing}
                            >
                              <FileText className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            {result.status !== 'Approved' && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedLabResult(result);
                                    setDemoState(prev => ({ ...prev, showVoiceRecordingModal: true }));
                                  }}
                                  className="border-amber-300 text-amber-600 hover:bg-amber-50"
                                  disabled={isProcessing}
                                >
                                  <Mic className="h-4 w-4 mr-1" />
                                  Voice Note
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    setLabResults(prev => prev.map(lab => 
                                      lab.id === result.id 
                                        ? { ...lab, status: "Approved" }
                                        : lab
                                    ));
                                    toast({ 
                                      title: "Results Approved!", 
                                      description: `Lab results for ${result.patient} have been approved and patient notified.` 
                                    });
                                  }}
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                  disabled={isProcessing}
                                >
                                  <CheckCircle2 className="h-4 w-4 mr-1" />
                                  Approve
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                
                {/* Empty State */}
                {labResults.filter(result => {
                  const matchesFilter = labFilter === 'all' || result.status === labFilter;
                  const searchLower = labResultsSearch.toLowerCase();
                  const matchesSearch = 
                    result.patient.toLowerCase().includes(searchLower) ||
                    result.patientId.toLowerCase().includes(searchLower) ||
                    result.testType.toLowerCase().includes(searchLower) ||
                    result.status.toLowerCase().includes(searchLower);
                  return matchesFilter && matchesSearch;
                }).length === 0 && (
                  <Card className="border-dashed border-slate-300">
                    <div className="p-8 text-center">
                      <TestTube className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-slate-600 mb-2">
                        {labResultsSearch || labFilter !== 'all' ? 'No results found' : 'No lab results available'}
                      </h3>
                      <p className="text-slate-500">
                        {labResultsSearch || labFilter !== 'all'
                          ? 'Try adjusting your search or filter criteria'
                          : 'Lab results will appear here when available'
                        }
                      </p>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          )}

          {/* Profile Tab Content */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              {/* Search Bar Section - Following Patient Management Pattern */}
              <div className="bg-gradient-to-r from-white/95 to-blue-50/95 backdrop-blur-sm rounded-xl p-4 border border-blue-200/60 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search settings, preferences, or profile information..."
                        value={patientSearch}
                        onChange={(e) => setPatientSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-blue-200 rounded-full focus:border-blue-400 focus:ring-2 focus:ring-blue-200 focus:outline-none hover:border-blue-300 hover:shadow-md transition-all duration-300"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      className="border-blue-300 text-blue-600 hover:bg-blue-50"
                      onClick={() => toast({ title: "Profile Synced", description: "Your profile has been synchronized with the hospital database." })}
                      disabled={isProcessing}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Sync Profile
                    </Button>
                    <Button
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={showProfileModal}
                      disabled={isProcessing}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </div>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-slate-800">Profile & Settings</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border border-slate-200 shadow-lg bg-white">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Stethoscope className="h-5 w-5 text-blue-600" />
                      Professional Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-slate-700">Full Name</label>
                      <p className="text-slate-800 font-medium">{doctorProfile.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700">Specialization</label>
                      <p className="text-slate-800">{doctorProfile.specialization}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700">Department</label>
                      <p className="text-slate-800">{doctorProfile.department}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700">License Number</label>
                      <p className="text-slate-800">{doctorProfile.licenseNumber}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700">Consultation Hours</label>
                      <p className="text-slate-800">{doctorProfile.consultationHours}</p>
                    </div>
                    <Button
                      className="w-full"
                      onClick={showProfileModal}
                      disabled={isProcessing}
                    >
                      Update Profile
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border border-blue-200/60 shadow-lg bg-white">
                  <CardHeader className="bg-gradient-to-r from-blue-100/80 to-blue-50/80 border-b border-blue-200/60">
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5 text-blue-600" />
                      Settings & Preferences
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <Button
                      variant="outline"
                      className="w-full justify-start border-blue-300 text-blue-600 hover:bg-blue-50"
                      onClick={showTimeSlotModal}
                      disabled={isProcessing}
                    >
                      <Timer className="h-4 w-4 mr-2" />
                      Manage Time Slots
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start border-blue-300 text-blue-600 hover:bg-blue-50"
                      onClick={showNotificationModal}
                      disabled={isProcessing}
                    >
                      <Bell className="h-4 w-4 mr-2" />
                      Notification Settings
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start border-blue-300 text-blue-600 hover:bg-blue-50"
                      onClick={() => toast({ title: "Settings Updated!", description: "Department settings configured successfully." })}
                      disabled={isProcessing}
                    >
                      <Building2 className="h-4 w-4 mr-2" />
                      Department Settings
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Help Tab Content */}
          {activeTab === "help" && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-white/95 to-blue-50/95 backdrop-blur-sm rounded-xl p-6 border border-blue-200/60 shadow-lg">
                <h3 className="text-2xl font-bold text-slate-800">Help & Support</h3>
                <p className="text-slate-600">Get assistance and access resources</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border border-blue-200/60 shadow-lg bg-white hover:shadow-xl transition-shadow">
                  <CardHeader className="bg-gradient-to-r from-blue-100/80 to-blue-50/80 border-b border-blue-200/60">
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-blue-600" />
                      Hospital Admin
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <p className="text-slate-600 mb-4">Contact hospital administration for technical issues</p>
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => toast({ title: "Message Sent!", description: "Your message has been sent to hospital administration." })}
                      disabled={isProcessing}
                    >
                      Contact Admin
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border border-blue-200/60 shadow-lg bg-white hover:shadow-xl transition-shadow">
                  <CardHeader className="bg-gradient-to-r from-blue-100/80 to-blue-50/80 border-b border-blue-200/60">
                    <CardTitle className="flex items-center gap-2">
                      <HelpCircle className="h-5 w-5 text-blue-600" />
                      Doctor FAQs
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <p className="text-slate-600 mb-4">Access frequently asked questions for doctors</p>
                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={showFAQModal}
                      disabled={isProcessing}
                    >
                      View FAQs
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border border-blue-200/60 shadow-lg bg-white hover:shadow-xl transition-shadow">
                  <CardHeader className="bg-gradient-to-r from-blue-100/80 to-blue-50/80 border-b border-blue-200/60">
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-orange-600" />
                      Report Issues
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <p className="text-slate-600 mb-4">Report errors or missing patient data</p>
                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={showReportIssueModal}
                      disabled={isProcessing}
                    >
                      Report Issue
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* AI Chatbot Tab Content - Removed as it's now a separate page */}
        </main>
      </div>

      {/* Demo Modals */}
      {/* Patient Details Modal */}
      {demoState.showPatientModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-slate-200/60 bg-gradient-to-r from-blue-50/80 to-indigo-50/80">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">Patient Details</h2>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => closeModal('showPatientModal')}
                className="h-10 w-10 rounded-full hover:bg-white/80"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            {demoState.selectedPatientData && (
              <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-xl border border-blue-200/60">
                      <label className="font-semibold text-slate-700 text-sm">Full Name</label>
                      <p className="text-lg font-medium text-slate-800">{demoState.selectedPatientData.name}</p>
                    </div>
                    <div className="p-4 bg-gradient-to-r from-slate-50 to-slate-100/50 rounded-xl border border-slate-200/60">
                      <label className="font-semibold text-slate-700 text-sm">Patient ID</label>
                      <p className="text-lg font-medium text-slate-800">{demoState.selectedPatientData.id}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-green-50 to-green-100/50 rounded-xl border border-green-200/60">
                      <label className="font-semibold text-slate-700 text-sm">Age</label>
                      <p className="text-lg font-medium text-slate-800">{demoState.selectedPatientData.age} years</p>
                    </div>
                    <div className="p-4 bg-gradient-to-r from-orange-50 to-orange-100/50 rounded-xl border border-orange-200/60">
                      <label className="font-semibold text-slate-700 text-sm">Condition</label>
                      <p className="text-lg font-medium text-slate-800">{demoState.selectedPatientData.condition}</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-5 bg-gradient-to-r from-purple-50 to-purple-100/50 rounded-xl border border-purple-200/60">
                  <label className="font-semibold text-slate-700 text-sm mb-3 block">Current Medications</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {demoState.selectedPatientData.medications.map((med, index) => (
                      <div key={index} className="flex items-center gap-2 p-3 bg-white/70 rounded-lg border border-purple-200/40">
                        <Pill className="h-4 w-4 text-purple-600" />
                        <span className="font-medium text-slate-700">{med}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="p-5 bg-gradient-to-r from-teal-50 to-teal-100/50 rounded-xl border border-teal-200/60">
                  <label className="font-semibold text-slate-700 text-sm mb-4 block">Latest Vitals</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-white/80 rounded-lg border border-teal-200/40 text-center">
                      <Heart className="h-6 w-6 text-teal-600 mx-auto mb-2" />
                      <span className="text-xs text-slate-600 block">Blood Pressure</span>
                      <p className="text-xl font-bold text-slate-800">{demoState.selectedPatientData.vitals.bp}</p>
                    </div>
                    <div className="p-4 bg-white/80 rounded-lg border border-teal-200/40 text-center">
                      <Activity className="h-6 w-6 text-teal-600 mx-auto mb-2" />
                      <span className="text-xs text-slate-600 block">Heart Rate</span>
                      <p className="text-xl font-bold text-slate-800">{demoState.selectedPatientData.vitals.hr} BPM</p>
                    </div>
                    <div className="p-4 bg-white/80 rounded-lg border border-teal-200/40 text-center">
                      <Thermometer className="h-6 w-6 text-teal-600 mx-auto mb-2" />
                      <span className="text-xs text-slate-600 block">Temperature</span>
                      <p className="text-xl font-bold text-slate-800">{demoState.selectedPatientData.vitals.temp}</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-5 bg-gradient-to-r from-amber-50 to-amber-100/50 rounded-xl border border-amber-200/60">
                  <label className="font-semibold text-slate-700 text-sm mb-3 block">Clinical Notes</label>
                  <div className="p-4 bg-white/80 rounded-lg border border-amber-200/40">
                    <p className="text-slate-700 leading-relaxed">{demoState.selectedPatientData.notes}</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-200/60">
                  <Button
                    className="flex-1 min-w-[150px] bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg"
                    onClick={() => toast({ title: "Success!", description: "Patient record updated successfully." })}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Update Record
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 min-w-[150px] border-green-300 text-green-700 hover:bg-green-50"
                    onClick={() => {
                      closeModal('showPatientModal');
                      showPrescriptionModal();
                    }}
                  >
                    <Pill className="h-4 w-4 mr-2" />
                    Prescribe Medication
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 min-w-[150px] border-purple-300 text-purple-700 hover:bg-purple-50"
                    onClick={() => {
                      closeModal('showPatientModal');
                      showLabOrderModal();
                    }}
                  >
                    <TestTube className="h-4 w-4 mr-2" />
                    Order Lab Test
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Schedule Modal */}
      {demoState.showScheduleModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-slate-200/60 bg-gradient-to-r from-blue-50/80 to-indigo-50/80">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">Full Schedule</h2>
                  <p className="text-slate-600">Manage your weekly appointments and tasks</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToToday}
                  className="border-blue-300 text-blue-600 hover:bg-blue-50"
                >
                  <Clock className="h-4 w-4 mr-1" />
                  Today
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => closeModal('showScheduleModal')}
                  className="h-10 w-10 rounded-full hover:bg-white/80"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {/* Search Bar Section - Following Patient Management Pattern */}
              <div className="mb-6 bg-gradient-to-r from-white/95 to-blue-50/95 backdrop-blur-sm rounded-xl p-4 border border-blue-200/60 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search appointments by patient name, time, or type..."
                        value={patientSearch}
                        onChange={(e) => setPatientSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-blue-200 rounded-full focus:border-blue-400 focus:ring-2 focus:ring-blue-200 focus:outline-none hover:border-blue-300 hover:shadow-md transition-all duration-300"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigateMonth(-1)}
                        className="border-slate-300 hover:bg-slate-50"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="text-sm font-medium text-slate-700 min-w-[120px] text-center">
                        {calendarState.currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigateMonth(1)}
                        className="border-slate-300 hover:bg-slate-50"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex bg-slate-100 rounded-lg p-1">
                      <Button
                        variant={calendarState.viewMode === 'month' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('month')}
                        className="text-xs"
                      >
                        <Grid className="h-4 w-4 mr-1" />
                        Month
                      </Button>
                      <Button
                        variant={calendarState.viewMode === 'list' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('list')}
                        className="text-xs"
                      >
                        <List className="h-4 w-4 mr-1" />
                        List
                      </Button>
                    </div>
                    <Button
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => {
                        closeModal('showScheduleModal');
                        showScheduleAppointment();
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      New Appointment
                    </Button>
                  </div>
                </div>
              </div>

              {/* Calendar View */}
              {calendarState.viewMode === 'month' ? (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                  {/* Days of Week Header */}
                  <div className="grid grid-cols-7 border-b border-slate-200">
                    {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
                      <div key={day} className="p-3 text-center font-semibold text-slate-600 text-sm bg-slate-50">
                        {day}
                      </div>
                    ))}
                  </div>
                  
                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7">
                    {(() => {
                      const year = calendarState.currentDate.getFullYear();
                      const month = calendarState.currentDate.getMonth();
                      const firstDay = new Date(year, month, 1);
                      const lastDay = new Date(year, month + 1, 0);
                      const startDate = new Date(firstDay);
                      startDate.setDate(startDate.getDate() - firstDay.getDay());
                      
                      const days = [];
                      for (let i = 0; i < 42; i++) {
                        const currentDate = new Date(startDate);
                        currentDate.setDate(startDate.getDate() + i);
                        days.push(currentDate);
                      }
                      
                      return days.map((date, index) => {
                        const isCurrentMonth = date.getMonth() === month;
                        const isToday = date.toDateString() === new Date().toDateString();
                        const dayAppointments = getAppointmentsForDate(date);
                        const filteredAppointments = dayAppointments.filter(apt => 
                          apt.patient.toLowerCase().includes(patientSearch.toLowerCase()) ||
                          apt.time.toLowerCase().includes(patientSearch.toLowerCase()) ||
                          apt.title.toLowerCase().includes(patientSearch.toLowerCase()) ||
                          apt.type.toLowerCase().includes(patientSearch.toLowerCase())
                        );
                        
                        return (
                          <div
                            key={index}
                            className={`min-h-[120px] p-2 border-r border-b border-slate-200 ${
                              isCurrentMonth ? 'bg-white' : 'bg-slate-50'
                            } ${isToday ? 'bg-blue-50 border-blue-200' : ''} hover:bg-slate-50 transition-colors cursor-pointer`}
                            onClick={() => setCalendarState(prev => ({ ...prev, selectedDate: date }))}
                          >
                            <div className={`text-sm font-medium mb-2 ${
                              isCurrentMonth ? 'text-slate-800' : 'text-slate-400'
                            } ${isToday ? 'text-blue-600 font-bold' : ''}`}>
                              {date.getDate()}
                            </div>
                            
                            <div className="space-y-1">
                              {filteredAppointments.slice(0, 3).map((apt) => (
                                <div
                                  key={apt.id}
                                  className={`text-xs p-1 rounded truncate ${
                                    apt.type === 'surgery' 
                                      ? 'bg-red-100 text-red-700 border-l-2 border-red-400'
                                      : apt.type === 'checkup'
                                      ? 'bg-blue-100 text-blue-700 border-l-2 border-blue-400'
                                      : 'bg-green-100 text-green-700 border-l-2 border-green-400'
                                  }`}
                                  title={`${apt.time} - ${apt.patient}`}
                                >
                                  {apt.time} {apt.patient}
                                </div>
                              ))}
                              {filteredAppointments.length > 3 && (
                                <div className="text-xs text-slate-500 font-medium">
                                  +{filteredAppointments.length - 3} more
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>
              ) : (
                /* List View */
                <div className="space-y-4">
                  {(() => {
                    const year = calendarState.currentDate.getFullYear();
                    const month = calendarState.currentDate.getMonth();
                    const daysInMonth = new Date(year, month + 1, 0).getDate();
                    const days = [];
                    
                    for (let day = 1; day <= daysInMonth; day++) {
                      const date = new Date(year, month, day);
                      const dayAppointments = getAppointmentsForDate(date);
                      const filteredAppointments = dayAppointments.filter(apt => 
                        apt.patient.toLowerCase().includes(patientSearch.toLowerCase()) ||
                        apt.time.toLowerCase().includes(patientSearch.toLowerCase()) ||
                        apt.title.toLowerCase().includes(patientSearch.toLowerCase()) ||
                        apt.type.toLowerCase().includes(patientSearch.toLowerCase())
                      );
                      if (filteredAppointments.length > 0) {
                        days.push({ date, appointments: filteredAppointments });
                      }
                    }
                    
                    return days.map(({ date, appointments }) => (
                      <Card key={date.toISOString()} className="border border-slate-200 shadow-sm">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg font-bold text-slate-800">
                              {date.toLocaleDateString('en-US', { 
                                weekday: 'long', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </CardTitle>
                            <Badge variant="secondary" className="text-xs">
                              {appointments.length} appointment{appointments.length !== 1 ? 's' : ''}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="grid gap-3">
                            {appointments.map((apt) => (
                              <div
                                key={apt.id}
                                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors group"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="text-center min-w-[60px]">
                                    <div className="text-sm font-bold text-slate-800">{apt.time}</div>
                                  </div>
                                  <div className="flex-1">
                                    <div className="font-semibold text-slate-800">{apt.patient}</div>
                                    <div className="text-sm text-slate-600">{apt.title}</div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-blue-600 hover:bg-blue-50"
                                    onClick={() => {
                                      toast({
                                        title: "Edit Appointment",
                                        description: `Editing appointment for ${apt.patient}`
                                      });
                                    }}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-red-600 hover:bg-red-50"
                                    onClick={() => {
                                      deleteAppointment(apt.id);
                                      toast({
                                        title: "Appointment Deleted",
                                        description: `Appointment with ${apt.patient} has been removed`
                                      });
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ));
                  })()}
                  
                  {(() => {
                    const year = calendarState.currentDate.getFullYear();
                    const month = calendarState.currentDate.getMonth();
                    const daysInMonth = new Date(year, month + 1, 0).getDate();
                    let hasFilteredAppointments = false;
                    let hasAnyAppointments = false;
                    
                    for (let day = 1; day <= daysInMonth; day++) {
                      const date = new Date(year, month, day);
                      const dayAppointments = getAppointmentsForDate(date);
                      if (dayAppointments.length > 0) {
                        hasAnyAppointments = true;
                        const filteredAppointments = dayAppointments.filter(apt => 
                          apt.patient.toLowerCase().includes(patientSearch.toLowerCase()) ||
                          apt.time.toLowerCase().includes(patientSearch.toLowerCase()) ||
                          apt.title.toLowerCase().includes(patientSearch.toLowerCase()) ||
                          apt.type.toLowerCase().includes(patientSearch.toLowerCase())
                        );
                        if (filteredAppointments.length > 0) {
                          hasFilteredAppointments = true;
                          break;
                        }
                      }
                    }
                    
                    if (!hasFilteredAppointments) {
                      return (
                        <Card className="border-dashed border-slate-300">
                          <div className="p-8 text-center">
                            <Calendar className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-slate-600 mb-2">
                              {patientSearch && hasAnyAppointments ? 'No appointments found' : 'No appointments scheduled'}
                            </h3>
                            <p className="text-slate-500">
                              {patientSearch && hasAnyAppointments
                                ? `No appointments match "${patientSearch}"`
                                : 'Schedule your first appointment to get started'
                              }
                            </p>
                          </div>
                        </Card>
                      );
                    }
                    return null;
                  })()}
                </div>
              )}
              
              {/* Selected Date Details */}
              {calendarState.selectedDate && (
                <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <h4 className="font-bold text-slate-800 mb-3">
                    {calendarState.selectedDate.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </h4>
                  <div className="grid gap-2">
                    {getAppointmentsForDate(calendarState.selectedDate).map((apt) => (
                      <div
                        key={apt.id}
                        className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-blue-800">{apt.time}</span>
                          <span className="text-slate-700">{apt.patient} - {apt.title}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-blue-600 hover:bg-blue-50"
                            onClick={() => {
                              closeModal('showScheduleModal');
                              showRescheduleAppointment(apt);
                            }}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </div>
                    ))}
                    {getAppointmentsForDate(calendarState.selectedDate).length === 0 && (
                      <p className="text-slate-500 text-center py-4">No appointments on this date</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Voice Recording Modal */}
      {demoState.showVoiceRecordingModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200/60">
            <div className="flex justify-between items-center p-6 border-b border-slate-200/60 bg-gradient-to-r from-amber-50/80 to-orange-50/80">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-lg">
                  <Mic className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Voice Note</h2>
                  {selectedLabResult && (
                    <p className="text-sm text-slate-600">
                      {selectedLabResult.patient} - {selectedLabResult.testType}
                    </p>
                  )}
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => closeModal('showVoiceRecordingModal')}
                className="h-10 w-10 rounded-full hover:bg-white/80"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="p-8">
              {demoState.voiceRecording ? (
                <div className="text-center space-y-6">
                  <div className="relative">
                    <div className="animate-pulse">
                      <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                        <Mic className="h-12 w-12 text-white" />
                      </div>
                      <div className="absolute inset-0 w-24 h-24 bg-red-500/30 rounded-full mx-auto animate-ping"></div>
                    </div>
                    <p className="text-red-600 font-bold text-lg mt-4">Recording...</p>
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-slate-50 to-slate-100/50 p-6 rounded-xl border border-slate-200/60 text-left">
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="h-4 w-4 text-slate-600" />
                      <span className="text-sm font-medium text-slate-700">Live Transcription</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed min-h-[60px]">
                      {selectedLabResult && selectedLabResult.status === 'Critical' ? 
                        "Patient shows elevated HbA1c levels requiring immediate attention. Recommend follow-up with endocrinologist and medication adjustment." :
                        "All values within normal range. Patient shows good health indicators."
                      }
                      <span className="animate-pulse inline-block ml-1 w-2 h-5 bg-blue-500"></span>
                    </p>
                  </div>
                  <Button 
                    onClick={() => {
                      const newNote = {
                        id: Date.now(),
                        text: selectedLabResult && selectedLabResult.status === 'Critical' ? 
                          "Patient shows elevated HbA1c levels requiring immediate attention. Recommend follow-up with endocrinologist and medication adjustment." :
                          "All values within normal range. Patient shows good health indicators.",
                        timestamp: new Date().toLocaleString()
                      };
                      
                      if (selectedLabResult) {
                        setLabResults(prev => prev.map(lab => 
                          lab.id === selectedLabResult.id 
                            ? { ...lab, voiceNotes: [...(lab.voiceNotes || []), newNote] }
                            : lab
                        ));
                        setSelectedLabResult(prev => ({
                          ...prev,
                          voiceNotes: [...(prev.voiceNotes || []), newNote]
                        }));
                      }
                      
                      setDemoState(prev => ({ 
                        ...prev, 
                        voiceRecording: false,
                        showVoiceRecordingModal: false 
                      }));
                      
                      toast({ 
                        title: "Voice Note Saved", 
                        description: `Voice note added to ${selectedLabResult?.patient}'s lab results.` 
                      });
                    }}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 rounded-xl"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Voice Note
                  </Button>
                </div>
              ) : (
                <div className="text-center space-y-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center mx-auto shadow-lg">
                    <Mic className="h-12 w-12 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-slate-700 font-medium text-lg mb-2">Record Voice Note</p>
                    <p className="text-slate-500">Record your observations and notes for this lab result</p>
                    {selectedLabResult && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-800 font-medium">
                          Recording note for: {selectedLabResult.testType}
                        </p>
                      </div>
                    )}
                  </div>
                  <Button 
                    onClick={showVoiceRecording} 
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Mic className="h-5 w-5 mr-2" />
                    Start Recording
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Medical Search Modal */}
      {demoState.showMedicalSearchModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-slate-200/60 bg-gradient-to-r from-blue-50/80 to-indigo-50/80">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                  <Search className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">Medical Database Search</h2>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => closeModal('showMedicalSearchModal')}
                className="h-10 w-10 rounded-full hover:bg-white/80"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search medical database, drugs, protocols..."
                    className="w-full pl-12 pr-4 py-4 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                    defaultValue="Hypertension treatment"
                  />
                </div>
                <Button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg">
                  <Search className="h-5 w-5 mr-2" />
                  Search
                </Button>
              </div>
              
              {demoState.searchResults.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <h3 className="font-bold text-slate-800 text-lg">Search Results</h3>
                    <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                      {demoState.searchResults.length} results
                    </span>
                  </div>
                  {demoState.searchResults.map((result, index) => (
                    <div key={index} className="p-5 border border-slate-200/60 rounded-xl hover:shadow-lg transition-all duration-300 cursor-pointer group bg-gradient-to-r from-white to-slate-50/30">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`p-2 rounded-lg ${
                              result.type === 'Protocol' ? 'bg-blue-100' :
                              result.type === 'Drug Info' ? 'bg-green-100' :
                              'bg-purple-100'
                            }`}>
                              {result.type === 'Protocol' ? <FileText className="h-4 w-4 text-blue-600" /> :
                               result.type === 'Drug Info' ? <Pill className="h-4 w-4 text-green-600" /> :
                               <TestTube className="h-4 w-4 text-purple-600" />}
                            </div>
                            <h4 className="font-bold text-blue-700 text-lg group-hover:text-blue-800 transition-colors">{result.title}</h4>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className={`text-sm px-3 py-1 rounded-full font-medium ${
                              result.type === 'Protocol' ? 'bg-blue-100 text-blue-700' :
                              result.type === 'Drug Info' ? 'bg-green-100 text-green-700' :
                              'bg-purple-100 text-purple-700'
                            }`}>
                              {result.type}
                            </span>
                            <span className="text-sm text-slate-500">Updated recently</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                            {result.relevance}
                          </span>
                          <p className="text-xs text-slate-500">Relevance</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Clock className="h-3 w-3" />
                          <span>Last reviewed: 2 days ago</span>
                        </div>
                        <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
                          <ExternalLink className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Patient Search Modal */}
      {demoState.showPatientSearch && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 px-8 py-6 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Search className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Patient Search</h2>
                    <p className="text-blue-100 text-sm">Find and select patient records</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => closeModal('showPatientSearch')}
                  className="text-white hover:bg-white/20 rounded-xl h-10 w-10 p-0"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-8">
              <div className="space-y-6">
                {/* Search Bar */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
                  <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search by name, Patient ID, phone number, or email..."
                        className="w-full pl-12 pr-4 py-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm text-lg"
                      />
                    </div>
                    <Button 
                      className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex-shrink-0"
                    >
                      <Search className="h-5 w-5 mr-2" />
                      Search
                    </Button>
                  </div>
                </div>

                {/* Recent Patients */}
                <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 p-6 rounded-2xl border border-slate-200">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-slate-600 rounded-xl">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800">Recent Patients</h3>
                  </div>
                  
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {[
                      { name: "John Doe", id: "P-2024-001", lastVisit: "2024-01-15", status: "Regular" },
                      { name: "Jane Smith", id: "P-2024-002", lastVisit: "2024-01-14", status: "Follow-up" },
                      { name: "Bob Johnson", id: "P-2024-003", lastVisit: "2024-01-13", status: "New Patient" },
                      { name: "Alice Williams", id: "P-2024-004", lastVisit: "2024-01-12", status: "Regular" },
                      { name: "Charlie Brown", id: "P-2024-005", lastVisit: "2024-01-11", status: "Follow-up" },
                      { name: "Diana Prince", id: "P-2024-006", lastVisit: "2024-01-10", status: "New Patient" },
                      { name: "Edward Norton", id: "P-2024-007", lastVisit: "2024-01-09", status: "Regular" },
                      { name: "Fiona Green", id: "P-2024-008", lastVisit: "2024-01-08", status: "Follow-up" },
                    ].map((patient, index) => (
                      <div 
                        key={index} 
                        className="bg-white border border-slate-200 rounded-xl p-4 hover:bg-blue-50 hover:border-blue-200 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md"
                        onClick={() => {
                          closeModal('showPatientSearch');
                          showPatientDetails(patient);
                        }}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-4">
                            <div className="p-2 bg-blue-100 rounded-xl">
                              <User className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-slate-800">{patient.name}</p>
                              <p className="text-sm text-slate-600">{patient.id}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-slate-700">Last visit: {patient.lastVisit}</p>
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                              patient.status === 'New Patient' ? 'bg-green-100 text-green-700' :
                              patient.status === 'Follow-up' ? 'bg-amber-100 text-amber-700' :
                              'bg-blue-100 text-blue-700'
                            }`}>
                              {patient.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Fixed Action Buttons */}
            <div className="flex-shrink-0 px-8 py-6 border-t border-slate-200 bg-white">
              <div className="flex items-center justify-end gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => closeModal('showPatientSearch')}
                  className="px-8 py-3 rounded-xl border-slate-300 hover:bg-slate-50"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={() => {
                    closeModal('showPatientSearch');
                    // Open Add Patient Modal
                    toast({
                      title: "Add New Patient",
                      description: "Patient not found? You can add a new patient to the system.",
                    });
                  }}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Patient
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Appointment Modal */}
      {demoState.showNewAppointment && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-slate-200/60 bg-gradient-to-r from-green-50/80 to-emerald-50/80">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">Schedule New Appointment</h2>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => closeModal('showNewAppointment')}
                className="h-10 w-10 rounded-full hover:bg-white/80"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-xl border border-blue-200/60">
                    <label className="font-semibold text-slate-700 text-sm block mb-2">Patient *</label>
                    <div className="relative">
                      <select 
                        className="w-full px-4 py-3 pl-12 pr-10 border border-blue-300/50 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all duration-300 bg-gradient-to-r from-white to-blue-50/50 backdrop-blur-sm font-medium shadow-lg hover:shadow-xl appearance-none cursor-pointer"
                        value={appointmentForm.patient}
                      onChange={(e) => {
                        const selectedPatient = availablePatients.find(p => p.id.toString() === e.target.value);
                        setAppointmentForm(prev => ({
                          ...prev,
                          patient: e.target.value,
                          patientName: selectedPatient ? selectedPatient.name : ''
                        }));
                      }}
                    >
                      <option value="">Select Patient</option>
                      {availablePatients.map(patient => (
                        <option key={patient.id} value={patient.id}>
                          {patient.name} ({patient.patientId})
                        </option>
                      ))}
                    </select>
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-r from-green-50 to-green-100/50 rounded-xl border border-green-200/60">
                    <label className="font-semibold text-slate-700 text-sm block mb-2">Date *</label>
                    <input 
                      type="date" 
                      className="w-full p-3 border border-green-300/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white/80"
                      value={appointmentForm.date}
                      onChange={(e) => setAppointmentForm(prev => ({...prev, date: e.target.value}))}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100/50 rounded-xl border border-purple-200/60">
                    <label className="font-semibold text-slate-700 text-sm block mb-2">Time *</label>
                    <div className="relative">
                      <select 
                        className="w-full px-4 py-3 pl-12 pr-10 border border-purple-300/50 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all duration-300 bg-gradient-to-r from-white to-purple-50/50 backdrop-blur-sm font-medium shadow-lg hover:shadow-xl appearance-none cursor-pointer"
                        value={appointmentForm.time}
                      onChange={(e) => setAppointmentForm(prev => ({...prev, time: e.target.value}))}
                    >
                      {availableTimeSlots.map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-r from-orange-50 to-orange-100/50 rounded-xl border border-orange-200/60">
                    <label className="font-semibold text-slate-700 text-sm block mb-2">Type</label>
                    <div className="relative">
                      <select 
                        className="w-full px-4 py-3 pl-12 pr-10 border border-orange-300/50 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-orange-400 transition-all duration-300 bg-gradient-to-r from-white to-orange-50/50 backdrop-blur-sm font-medium shadow-lg hover:shadow-xl appearance-none cursor-pointer"
                        value={appointmentForm.type}
                      onChange={(e) => setAppointmentForm(prev => ({...prev, type: e.target.value}))}
                    >
                      <option value="consultation">Consultation</option>
                      <option value="follow-up">Follow-up</option>
                      <option value="checkup">Check-up</option>
                      <option value="surgery">Surgery</option>
                      <option value="emergency">Emergency</option>
                    </select>
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-slate-50 to-slate-100/50 rounded-xl border border-slate-200/60">
                <label className="font-semibold text-slate-700 text-sm block mb-2">Reason for Visit</label>
                <textarea 
                  className="w-full p-3 border border-slate-300/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 resize-none bg-white/80" 
                  rows={3} 
                  placeholder="Describe the reason for this appointment..."
                  value={appointmentForm.reason}
                  onChange={(e) => setAppointmentForm(prev => ({...prev, reason: e.target.value}))}
                ></textarea>
              </div>
              
              <div className="flex gap-3 pt-4 border-t border-slate-200/60">
                <Button 
                  className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={handleAppointmentSubmit}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Appointment
                </Button>
                <Button 
                  variant="outline" 
                  className="px-8 py-3 rounded-xl border-slate-300 hover:bg-slate-50 font-medium"
                  onClick={() => {
                    closeModal('showNewAppointment');
                    resetAppointmentForm();
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Appointment Modal */}
      {demoState.showRescheduleAppointment && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-slate-200/60 bg-gradient-to-r from-amber-50/80 to-orange-50/80">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">Reschedule Appointment</h2>
                  {demoState.selectedAppointmentForReschedule && (
                    <p className="text-sm text-slate-600">Current: {demoState.selectedAppointmentForReschedule.patient} - {demoState.selectedAppointmentForReschedule.time}</p>
                  )}
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setDemoState(prev => ({ ...prev, showRescheduleAppointment: false, selectedAppointmentForReschedule: null }))}
                className="h-10 w-10 rounded-full hover:bg-white/80"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 p-4 rounded-xl border border-blue-200/60 mb-6">
                <h3 className="font-semibold text-slate-800 mb-2">Current Appointment Details</h3>
                {demoState.selectedAppointmentForReschedule && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-slate-600">Patient:</span>
                      <p className="font-medium text-slate-800">{demoState.selectedAppointmentForReschedule.patient}</p>
                    </div>
                    <div>
                      <span className="text-slate-600">Time:</span>
                      <p className="font-medium text-slate-800">{demoState.selectedAppointmentForReschedule.time}</p>
                    </div>
                    <div>
                      <span className="text-slate-600">Type:</span>
                      <p className="font-medium text-slate-800">{demoState.selectedAppointmentForReschedule.type}</p>
                    </div>
                    <div>
                      <span className="text-slate-600">Duration:</span>
                      <p className="font-medium text-slate-800">{demoState.selectedAppointmentForReschedule.duration}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-green-50 to-green-100/50 rounded-xl border border-green-200/60">
                    <label className="font-semibold text-slate-700 text-sm block mb-2">New Date *</label>
                    <input 
                      type="date"
                      className="w-full p-3 border border-green-300/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white/80"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  
                  <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100/50 rounded-xl border border-purple-200/60">
                    <label className="font-semibold text-slate-700 text-sm block mb-2">New Time *</label>
                    <select className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm">
                      <option>9:00 AM</option>
                      <option>10:00 AM</option>
                      <option>11:00 AM</option>
                      <option>1:00 PM</option>
                      <option>2:00 PM</option>
                      <option>3:00 PM</option>
                      <option>4:00 PM</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-xl border border-blue-200/60">
                    <label className="font-semibold text-slate-700 text-sm block mb-2">Reason for Reschedule</label>
                    <select className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm">
                      <option>Select reason...</option>
                      <option>Doctor unavailable</option>
                      <option>Patient request</option>
                      <option>Emergency case priority</option>
                      <option>Equipment maintenance</option>
                      <option>Other</option>
                    </select>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-r from-slate-50 to-slate-100/50 rounded-xl border border-slate-200/60">
                    <label className="font-semibold text-slate-700 text-sm block mb-2">Additional Notes</label>
                    <textarea 
                      className="w-full p-3 border border-slate-300/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 bg-white/80 resize-none"
                      rows={3}
                      placeholder="Any additional notes or instructions for the rescheduled appointment..."
                    ></textarea>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-end gap-4 pt-6 border-t border-slate-200/60">
                <Button
                  variant="outline"
                  onClick={() => setDemoState(prev => ({ ...prev, showRescheduleAppointment: false, selectedAppointmentForReschedule: null }))}
                  className="px-8 py-3 rounded-xl border-slate-300 hover:bg-slate-50"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    toast({ 
                      title: "Appointment Rescheduled!", 
                      description: "Patient has been notified of the new appointment time." 
                    });
                    setDemoState(prev => ({ ...prev, showRescheduleAppointment: false, selectedAppointmentForReschedule: null }));
                  }}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Reschedule Appointment
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Prescription Modal */}
      {demoState.showPrescriptionModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-slate-200/60 bg-gradient-to-r from-green-50/80 to-emerald-50/80">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
                  <Pill className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">Create Prescription</h2>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => closeModal('showPrescriptionModal')}
                className="h-10 w-10 rounded-full hover:bg-white/80"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Patient</label>
                  <div className="relative">
                    <select className="w-full px-4 py-3 pl-12 pr-10 border border-blue-300/50 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all duration-300 bg-gradient-to-r from-white to-blue-50/30 backdrop-blur-sm font-medium shadow-lg hover:shadow-xl appearance-none cursor-pointer">
                      <option>John Doe (P-2024-001)</option>
                      <option>Jane Smith (P-2024-002)</option>
                      <option>Michael Chen (P-2024-003)</option>
                    </select>
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Medication</label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input 
                      type="text" 
                      className="w-full pl-12 pr-4 py-4 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg" 
                      placeholder="Search medication (e.g., Lisinopril, Metformin)..." 
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Dosage</label>
                    <input 
                      type="text" 
                      className="w-full p-4 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg" 
                      placeholder="e.g., 10mg, 500mg" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Frequency</label>
                    <div className="relative">
                      <select className="w-full px-4 py-3 pl-12 pr-10 border border-green-300/50 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-green-400 transition-all duration-300 bg-gradient-to-r from-white to-green-50/30 backdrop-blur-sm font-medium shadow-lg hover:shadow-xl appearance-none cursor-pointer">
                        <option>Once daily</option>
                        <option>Twice daily</option>
                        <option>Three times daily</option>
                        <option>Four times daily</option>
                        <option>As needed</option>
                      </select>
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Duration</label>
                    <input 
                      type="text" 
                      className="w-full p-4 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg" 
                      placeholder="e.g., 30 days, 2 weeks" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Quantity</label>
                    <input 
                      type="number" 
                      className="w-full p-4 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg" 
                      placeholder="e.g., 30, 60" 
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Special Instructions</label>
                  <textarea 
                    className="w-full p-4 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none text-lg" 
                    rows={4} 
                    placeholder="Special instructions for the patient (e.g., take with food, avoid alcohol)..."
                  ></textarea>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-xl border border-blue-200/60">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold text-blue-800">Drug Interaction Check</span>
                  </div>
                  <p className="text-sm text-blue-700">No known interactions with current medications.</p>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4 border-t border-slate-200/60">
                <Button
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() => {
                    closeModal('showPrescriptionModal');
                    toast({ title: "Success!", description: "Prescription created and sent to pharmacy." });
                  }}
                >
                  <Pill className="h-5 w-5 mr-2" />
                  Create Prescription
                </Button>
                <Button 
                  variant="outline" 
                  className="px-8 py-4 rounded-xl border-slate-300 text-slate-700 hover:bg-slate-50"
                  onClick={() => closeModal('showPrescriptionModal')}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lab Order Modal */}
      {demoState.showLabOrderModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-slate-200/60 bg-gradient-to-r from-purple-50/80 to-indigo-50/80">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
                  <TestTube className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">Order Lab Test</h2>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => closeModal('showLabOrderModal')}
                className="h-10 w-10 rounded-full hover:bg-white/80"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Patient</label>
                <select className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm">
                  <option>John Doe (P-2024-001)</option>
                  <option>Jane Smith (P-2024-002)</option>
                  <option>Michael Chen (P-2024-003)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">Test Type</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {['Complete Blood Count (CBC)', 'Basic Metabolic Panel', 'Lipid Panel', 'Thyroid Function', 'Urinalysis', 'Liver Function Tests'].map((test, index) => (
                    <label key={index} className="flex items-center p-4 border border-slate-200 rounded-xl hover:bg-purple-50 hover:border-purple-300 transition-all duration-200 cursor-pointer group">
                      <input type="checkbox" className="mr-3 w-5 h-5 text-purple-600 border-2 border-slate-300 rounded focus:ring-purple-500 focus:ring-2" />
                      <div className="flex items-center gap-2">
                        <TestTube className="h-4 w-4 text-purple-600 group-hover:scale-110 transition-transform" />
                        <span className="font-medium text-slate-700 group-hover:text-purple-700">{test}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Priority</label>
                  <select className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm">
                    <option>Routine</option>
                    <option>Urgent</option>
                    <option>STAT</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Expected Date</label>
                  <input 
                    type="date" 
                    className="w-full p-4 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-lg"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Clinical Notes</label>
                <textarea 
                  className="w-full p-4 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none text-lg" 
                  rows={4} 
                  placeholder="Clinical indication for tests, patient symptoms, relevant history..."
                ></textarea>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-amber-50 to-amber-100/50 rounded-xl border border-amber-200/60">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-amber-600" />
                  <span className="font-semibold text-amber-800">Estimated Processing Time</span>
                </div>
                <p className="text-sm text-amber-700">Most routine tests: 24-48 hours • STAT orders: 2-4 hours</p>
              </div>
              
              <div className="flex gap-3 pt-4 border-t border-slate-200/60">
                <Button
                  className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() => {
                    closeModal('showLabOrderModal');
                    toast({ title: "Success!", description: "Lab tests ordered successfully. Lab notified." });
                  }}
                >
                  <TestTube className="h-5 w-5 mr-2" />
                  Order Tests
                </Button>
                <Button 
                  variant="outline" 
                  className="px-8 py-4 rounded-xl border-slate-300 text-slate-700 hover:bg-slate-50"
                  onClick={() => closeModal('showLabOrderModal')}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Consultation Modal */}
      {demoState.showAIConsultModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-slate-200/60 bg-gradient-to-r from-blue-50/80 to-indigo-50/80">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">MediVo AI Consultation</h2>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => closeModal('showAIConsultModal')}
                className="h-10 w-10 rounded-full hover:bg-white/80"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="p-5 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-xl border border-blue-200/60">
                <div className="flex items-center gap-3 mb-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <h3 className="font-bold text-blue-800 text-lg">AI Analysis in Progress...</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-blue-700">
                    <Activity className="h-4 w-4" />
                    <span>Analyzing patient symptoms and medical history...</span>
                  </div>
                  <div className="bg-white/80 p-4 rounded-xl border border-blue-200/40">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-semibold text-slate-700">Patient:</span>
                        <p className="text-slate-800">John Doe, 45 years old</p>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-700">Chief Complaint:</span>
                        <p className="text-slate-800">Chest pain and shortness of breath</p>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-700">Vitals:</span>
                        <p className="text-slate-800">BP 140/90, HR 78, Temp 98.6°F</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-5 bg-gradient-to-r from-green-50 to-green-100/50 rounded-xl border border-green-200/60">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                  <h3 className="font-bold text-green-800 text-lg">AI Recommendations</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    'Consider ECG to rule out cardiac causes',
                    'Order cardiac enzymes (Troponin, CK-MB)',
                    'Chest X-ray to evaluate pulmonary causes',
                    'Monitor blood pressure - consider antihypertensive therapy'
                  ].map((rec, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-white/70 rounded-lg border border-green-200/40">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <span className="text-sm text-slate-700 leading-relaxed">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="p-5 bg-gradient-to-r from-amber-50 to-amber-100/50 rounded-xl border border-amber-200/60">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="h-6 w-6 text-amber-600" />
                  <h3 className="font-bold text-amber-800 text-lg">Risk Assessment</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-white/80 rounded-xl border border-amber-200/40">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Heart className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-xl font-bold text-amber-700">Medium</div>
                    <div className="text-sm text-amber-600">Cardiac Risk</div>
                  </div>
                  <div className="text-center p-4 bg-white/80 rounded-xl border border-green-200/40">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <CheckCircle2 className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-xl font-bold text-green-700">Low</div>
                    <div className="text-sm text-green-600">Immediate Danger</div>
                  </div>
                  <div className="text-center p-4 bg-white/80 rounded-xl border border-blue-200/40">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-xl font-bold text-blue-700">High</div>
                    <div className="text-sm text-blue-600">Follow-up Priority</div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-200/60">
                <Button
                  className="flex-1 min-w-[150px] bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg"
                  onClick={() => {
                    closeModal('showAIConsultModal');
                    toast({ title: "AI Recommendations Accepted!", description: "Treatment plan updated with AI suggestions." });
                  }}
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Accept Recommendations
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 min-w-[150px] border-blue-300 text-blue-700 hover:bg-blue-50"
                  onClick={() => toast({ title: "Plan Modified!", description: "Treatment plan customized successfully." })}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Modify Plan
                </Button>
                <Button 
                  variant="outline" 
                  className="px-8 py-3 rounded-xl border-slate-300 text-slate-700 hover:bg-slate-50"
                  onClick={() => closeModal('showAIConsultModal')}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Critical Alerts Modal */}
      {demoState.showAlertsModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-red-50 to-orange-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-600 rounded-xl">
                  <AlertTriangle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Critical Alerts & Notifications</h2>
                  <p className="text-slate-600 text-sm">Review and respond to urgent patient alerts</p>
                </div>
              </div>
              <Button variant="ghost" onClick={() => closeModal('showAlertsModal')}>×</Button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="space-y-4">
                {[
                  { 
                    type: 'urgent', 
                    message: 'Emergency admission - Room 204 needs immediate consultation', 
                    time: '12 min ago',
                    details: 'Patient in respiratory distress, vitals declining.',
                    patient: 'Emergency Patient (E-2024-008)'
                  },
                  { 
                    type: 'warning', 
                    message: 'Medication interaction alert for Patient Jane Smith', 
                    time: '1 hour ago',
                    details: 'Potential drug interaction between prescribed medications.',
                    patient: 'Jane Smith (P-2024-002)'
                  },
                  { 
                    type: 'info', 
                    message: 'New lab results available for review', 
                    time: '2 hours ago',
                    details: 'Routine blood work results ready for multiple patients.',
                    patient: 'Multiple Patients'
                  },
                ].map((alert, index) => {
                  const getAlertConfig = (type: string) => {
                    switch(type) {
                      case 'critical':
                        return {
                          bg: 'bg-gradient-to-br from-red-50 to-red-100/50',
                          border: 'border-red-200',
                          iconBg: 'bg-red-600',
                          textColor: 'text-red-800',
                          icon: AlertTriangle,
                          timeColor: 'text-red-600'
                        };
                      case 'urgent':
                        return {
                          bg: 'bg-gradient-to-br from-orange-50 to-orange-100/50',
                          border: 'border-orange-200',
                          iconBg: 'bg-orange-600',
                          textColor: 'text-orange-800',
                          icon: AlertTriangle,
                          timeColor: 'text-orange-600'
                        };
                      case 'warning':
                        return {
                          bg: 'bg-gradient-to-br from-amber-50 to-amber-100/50',
                          border: 'border-amber-200',
                          iconBg: 'bg-amber-600',
                          textColor: 'text-amber-800',
                          icon: AlertTriangle,
                          timeColor: 'text-amber-600'
                        };
                      default:
                        return {
                          bg: 'bg-gradient-to-br from-blue-50 to-blue-100/50',
                          border: 'border-blue-200',
                          iconBg: 'bg-blue-600',
                          textColor: 'text-blue-800',
                          icon: Bell,
                          timeColor: 'text-blue-600'
                        };
                    }
                  };

                  const config = getAlertConfig(alert.type);
                  const IconComponent = config.icon;

                  return (
                    <div key={index} className={`${config.bg} border ${config.border} rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200`}>
                      <div className="flex items-start gap-4">
                        <div className={`p-3 ${config.iconBg} rounded-xl shadow-lg`}>
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        
                        <div className="flex-1 space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className={`font-semibold ${config.textColor} text-lg`}>{alert.message}</h3>
                              <p className="text-slate-600 mt-1">{alert.details}</p>
                              <p className="text-sm text-slate-500 mt-2">
                                <span className="font-medium">Patient:</span> {alert.patient}
                              </p>
                            </div>
                            <div className="text-right">
                              <span className={`text-sm font-medium ${config.timeColor}`}>{alert.time}</span>
                            </div>
                          </div>
                          
                          <div className="flex gap-3">
                            <Button 
                              size="sm" 
                              className={`${config.iconBg} hover:opacity-90 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200`}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                            {alert.type === 'critical' || alert.type === 'urgent' ? (
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="border-slate-300 rounded-xl hover:bg-slate-50"
                              >
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                Mark as Resolved
                              </Button>
                            ) : (
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="border-slate-300 rounded-xl hover:bg-slate-50"
                              >
                                Dismiss
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Alert Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-200">
                <div className="bg-gradient-to-br from-red-50 to-red-100/50 p-4 rounded-xl border border-red-200">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">1</div>
                    <div className="text-sm text-red-700">Critical</div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 p-4 rounded-xl border border-orange-200">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">1</div>
                    <div className="text-sm text-orange-700">Urgent</div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 p-4 rounded-xl border border-amber-200">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-amber-600">1</div>
                    <div className="text-sm text-amber-700">Warning</div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-4 rounded-xl border border-blue-200">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">1</div>
                    <div className="text-sm text-blue-700">Info</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-4 mt-6 pt-4 border-t border-slate-200">
                <Button 
                  variant="outline" 
                  onClick={() => closeModal('showAlertsModal')}
                  className="px-8 py-3 rounded-xl border-slate-300 hover:bg-slate-50"
                >
                  Close
                </Button>
                <Button 
                  onClick={() => {
                    toast({
                      title: "All Alerts Marked as Read",
                      description: "All alerts have been marked as read and archived.",
                    });
                  }}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Mark All as Read
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {demoState.showProfileModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-600 via-slate-700 to-slate-800 px-8 py-6 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Update Profile</h2>
                    <p className="text-slate-100 text-sm">Manage your professional information</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => closeModal('showProfileModal')}
                  className="text-white hover:bg-white/20 rounded-xl h-10 w-10 p-0"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-8">
                <div className="space-y-6">
                {/* Professional Information */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-600 rounded-xl">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800">Professional Information</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Full Name *</label>
                        <input 
                          type="text" 
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm" 
                          defaultValue="Dr. Sarah Smith" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Specialization *</label>
                        <input 
                          type="text" 
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm" 
                          defaultValue="Cardiology" 
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Department *</label>
                        <select className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm">
                          <option>Cardiology</option>
                          <option>Internal Medicine</option>
                          <option>Emergency Medicine</option>
                          <option>Pediatrics</option>
                          <option>Surgery</option>
                          <option>Radiology</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">License Number *</label>
                        <input 
                          type="text" 
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm" 
                          defaultValue="MD-12345" 
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-green-600 rounded-xl">
                      <Phone className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800">Contact Information</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number *</label>
                        <input 
                          type="text" 
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm" 
                          defaultValue="(555) 123-4567" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Email Address *</label>
                        <input 
                          type="email" 
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm" 
                          defaultValue="sarah.smith@medihub.com" 
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Office Address</label>
                      <textarea 
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm resize-none" 
                        rows={3}
                        defaultValue="MediHub Medical Center, Floor 3, Room 302&#10;123 Healthcare Blvd, Medical District&#10;New York, NY 10001"
                      ></textarea>
                    </div>
                  </div>
                </div>

                {/* Security Settings */}
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-2xl border border-amber-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-amber-600 rounded-xl">
                      <Settings className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800">Security & Preferences</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Two-Factor Authentication</label>
                        <select className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm">
                          <option>Enabled</option>
                          <option>Disabled</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Session Timeout</label>
                        <select className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm">
                          <option>15 minutes</option>
                          <option>30 minutes</option>
                          <option>1 hour</option>
                          <option>2 hours</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-4 pt-6 border-t border-slate-200">
                  <Button 
                    variant="outline" 
                    onClick={() => closeModal('showProfileModal')}
                    className="px-8 py-3 rounded-xl border-slate-300 hover:bg-slate-50"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      closeModal('showProfileModal');
                      toast({ title: "Profile Updated!", description: "Your profile changes have been saved successfully." });
                    }}
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
      )}

      {/* Time Slot Modal */}
      {demoState.showTimeSlotModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 px-6 py-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Manage Time Slots</h2>
                    <p className="text-blue-100 text-sm">Configure your availability schedule</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => closeModal('showTimeSlotModal')}
                  className="text-white hover:bg-white/20 rounded-xl h-10 w-10 p-0"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">Working Days</label>
                <div className="space-y-3">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, index) => (
                    <label key={index} className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="mr-3 h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500" 
                        defaultChecked={index < 5} 
                      />
                      <span className="text-slate-700 font-medium">{day}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Start Time</label>
                  <input 
                    type="time" 
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    defaultValue="09:00" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">End Time</label>
                  <input 
                    type="time" 
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    defaultValue="17:00" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Appointment Duration</label>
                <select className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm">
                  <option>15 minutes</option>
                  <option>30 minutes</option>
                  <option>45 minutes</option>
                  <option>60 minutes</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                  onClick={() => {
                    closeModal('showTimeSlotModal');
                    toast({ title: "Schedule Saved!", description: "Your availability schedule has been updated." });
                  }}
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Save Schedule
                </Button>
                <Button 
                  variant="outline" 
                  className="px-6 py-3 rounded-xl border-slate-300 hover:bg-slate-50"
                  onClick={() => closeModal('showTimeSlotModal')}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FAQ Modal */}
      {demoState.showFAQModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 px-8 py-6 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <HelpCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Doctor FAQs</h2>
                    <p className="text-indigo-100 text-sm">Frequently asked questions and help</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => closeModal('showFAQModal')}
                  className="text-white hover:bg-white/20 rounded-xl h-10 w-10 p-0"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-8">
                <div className="space-y-6">
                  {[
                    {
                      question: "How do I access patient records?",
                      answer: "Navigate to Patient List in the sidebar, then click 'View Records' for any patient. You can also use the search function to find specific patients."
                    },
                    {
                      question: "How do I prescribe medications?",
                      answer: "Click on 'Prescribe Medication' from the patient details page or use the quick actions menu. Fill in the medication details, dosage, and instructions."
                    },
                    {
                      question: "How do I order lab tests?",
                      answer: "Use the 'Order Lab Test' button from patient records or quick actions. Select the required tests and add clinical notes for the lab technicians."
                    },
                    {
                      question: "How do I use MediVo AI?",
                      answer: "Click the MediVo AI button to access AI-powered diagnostic assistance, medical research, and voice dictation features."
                    },
                    {
                      question: "How do I manage my schedule?",
                      answer: "Use the Appointments section to view, schedule, and manage patient appointments. You can also set your availability in Profile & Settings."
                    }
                  ].map((faq, index) => (
                    <div key={index} className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-2xl border border-indigo-100 hover:border-indigo-200 transition-all duration-200">
                      <h3 className="font-semibold text-slate-800 mb-3 text-lg flex items-center gap-2">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                        {faq.question}
                      </h3>
                      <p className="text-slate-600 leading-relaxed pl-4">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Report Issue Modal */}
      {demoState.showReportIssueModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 px-8 py-6 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <AlertTriangle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Report Issue</h2>
                    <p className="text-red-100 text-sm">Submit a technical support request</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => closeModal('showReportIssueModal')}
                  className="text-white hover:bg-white/20 rounded-xl h-10 w-10 p-0"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-8">
                <div className="space-y-6">
                  {/* Issue Details */}
                  <div className="bg-gradient-to-br from-red-50 to-orange-50 p-6 rounded-2xl border border-red-100">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-red-600 rounded-xl">
                        <Settings className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-800">Issue Details</h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Issue Type *</label>
                          <select className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm">
                            <option>Technical Issue</option>
                            <option>Patient Data Error</option>
                            <option>System Bug</option>
                            <option>Feature Request</option>
                            <option>Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Priority *</label>
                          <select className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm">
                            <option>Low</option>
                            <option>Medium</option>
                            <option>High</option>
                            <option>Critical</option>
                          </select>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Subject *</label>
                        <input 
                          type="text" 
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm" 
                          placeholder="Brief description of the issue" 
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Description *</label>
                        <textarea 
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm resize-none" 
                          rows={4}
                          placeholder="Detailed description of the issue, steps to reproduce, etc."
                        ></textarea>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Attach Screenshot</label>
                        <input 
                          type="file" 
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-red-50 file:text-red-700 hover:file:bg-red-100" 
                          accept="image/*" 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-4 pt-6 border-t border-slate-200">
                    <Button 
                      variant="outline" 
                      onClick={() => closeModal('showReportIssueModal')}
                      className="px-8 py-3 rounded-xl border-slate-300 hover:bg-slate-50"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => {
                        closeModal('showReportIssueModal');
                        toast({ title: "Report Submitted!", description: "Your issue report has been sent to IT support." });
                      }}
                      className="px-8 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Submit Report
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification Settings Modal */}
      {demoState.showNotificationModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 px-8 py-6 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Bell className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Notification Settings</h2>
                    <p className="text-blue-100 text-sm">Manage your alert preferences</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => closeModal('showNotificationModal')}
                  className="text-white hover:bg-white/20 rounded-xl h-10 w-10 p-0"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-8">
                <div className="space-y-6">
                  {/* Email Notifications */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-blue-600 rounded-xl">
                        <Mail className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-800">Email Notifications</h3>
                    </div>
                    
                    <div className="space-y-4">
                      {[
                        'New patient appointments',
                        'Lab results available',
                        'Critical alerts',
                        'System updates',
                        'Schedule changes'
                      ].map((item, index) => (
                        <label key={index} className="flex items-center gap-3 p-3 bg-white/80 rounded-xl hover:bg-white transition-all duration-200 cursor-pointer group">
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 focus:ring-2" 
                            defaultChecked={index < 3} 
                          />
                          <span className="text-slate-700 font-medium group-hover:text-blue-700 transition-colors">{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* SMS Notifications */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-green-600 rounded-xl">
                        <MessageSquare className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-800">SMS Notifications</h3>
                    </div>
                    
                    <div className="space-y-4">
                      {[
                        'Emergency alerts only',
                        'Critical lab results',
                        'Appointment reminders'
                      ].map((item, index) => (
                        <label key={index} className="flex items-center gap-3 p-3 bg-white/80 rounded-xl hover:bg-white transition-all duration-200 cursor-pointer group">
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 text-green-600 border-slate-300 rounded focus:ring-green-500 focus:ring-2" 
                            defaultChecked={index === 0} 
                          />
                          <span className="text-slate-700 font-medium group-hover:text-green-700 transition-colors">{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Notification Frequency */}
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-2xl border border-amber-100">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-amber-600 rounded-xl">
                        <Clock className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-800">Notification Frequency</h3>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Delivery Schedule</label>
                      <select className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm">
                        <option>Immediate</option>
                        <option>Every 15 minutes</option>
                        <option>Every hour</option>
                        <option>Daily digest</option>
                      </select>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-4 pt-6 border-t border-slate-200">
                    <Button 
                      variant="outline" 
                      onClick={() => closeModal('showNotificationModal')}
                      className="px-8 py-3 rounded-xl border-slate-300 hover:bg-slate-50"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => {
                        closeModal('showNotificationModal');
                        toast({ title: "Settings Saved!", description: "Your notification preferences have been updated." });
                      }}
                      className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Save Settings
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Patient Modal */}
      {demoState.showAddPatientModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Add New Patient</h2>
                    <p className="text-blue-100 text-sm">Register a new patient in the system</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => closeModal('showAddPatientModal')}
                  className="text-white hover:bg-white/20 rounded-xl h-10 w-10 p-0"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 overflow-y-auto max-h-[calc(95vh-120px)]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Personal Information Section */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-blue-600 rounded-xl">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-800">Personal Information</h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">First Name *</label>
                          <input 
                            type="text" 
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm" 
                            placeholder="Enter first name" 
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Last Name *</label>
                          <input 
                            type="text" 
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm" 
                            placeholder="Enter last name" 
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Date of Birth *</label>
                          <input 
                            type="date" 
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm" 
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Gender *</label>
                          <select className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm">
                            <option>Select Gender</option>
                            <option>Male</option>
                            <option>Female</option>
                            <option>Other</option>
                            <option>Prefer not to say</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information Section */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-green-600 rounded-xl">
                        <Phone className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-800">Contact Information</h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number *</label>
                          <input 
                            type="tel" 
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm" 
                            placeholder="(555) 123-4567" 
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                          <input 
                            type="email" 
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm" 
                            placeholder="patient@email.com" 
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Home Address</label>
                        <textarea 
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm resize-none" 
                          rows={3} 
                          placeholder="Enter complete address including street, city, state, and ZIP code"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Emergency & Medical Information Section */}
                <div className="space-y-6">
                  
                  {/* Emergency Contact Section */}
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-2xl border border-amber-100">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-amber-600 rounded-xl">
                        <AlertTriangle className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-800">Emergency Contact</h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Contact Name *</label>
                        <input 
                          type="text" 
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm" 
                          placeholder="Full name of emergency contact" 
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number *</label>
                          <input 
                            type="tel" 
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm" 
                            placeholder="(555) 123-4567" 
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Relationship</label>
                          <select className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm">
                            <option>Select relationship</option>
                            <option>Spouse</option>
                            <option>Parent</option>
                            <option>Child</option>
                            <option>Sibling</option>
                            <option>Friend</option>
                            <option>Other</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Insurance Information Section */}
                  <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-2xl border border-purple-100">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-purple-600 rounded-xl">
                        <FileText className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-800">Insurance Information</h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Insurance Provider</label>
                        <input 
                          type="text" 
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm" 
                          placeholder="e.g., Blue Cross Blue Shield, Aetna, Cigna" 
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Policy Number</label>
                          <input 
                            type="text" 
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm" 
                            placeholder="Policy/Member ID" 
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Group Number</label>
                          <input 
                            type="text" 
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm" 
                            placeholder="Group/Plan ID" 
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Medical History Section */}
                  <div className="bg-gradient-to-br from-red-50 to-pink-50 p-6 rounded-2xl border border-red-100">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-red-600 rounded-xl">
                        <Heart className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-800">Medical Information</h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Known Allergies</label>
                        <textarea 
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm resize-none" 
                          rows={2} 
                          placeholder="Drug allergies, food allergies, environmental allergies..."
                        ></textarea>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Chronic Conditions</label>
                        <textarea 
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm resize-none" 
                          rows={2} 
                          placeholder="Diabetes, hypertension, asthma, heart conditions..."
                        ></textarea>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Current Medications</label>
                        <textarea 
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm resize-none" 
                          rows={3} 
                          placeholder="List current medications with dosages and frequency..."
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-slate-200">
                <Button 
                  variant="outline" 
                  onClick={() => closeModal('showAddPatientModal')}
                  className="px-8 py-3 rounded-xl border-slate-300 hover:bg-slate-50"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={() => {
                    closeModal('showAddPatientModal');
                    toast({
                      title: "Patient Added Successfully!",
                      description: "New patient has been registered in the system and is ready for appointments.",
                    });
                  }}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Add Patient
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lab Results Detail Modal */}
      {demoState.showLabResultsModal && selectedLabResult && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 px-8 py-6 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <TestTube className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Lab Results Detail</h2>
                    <p className="text-blue-100 text-sm">{selectedLabResult.patient} - {selectedLabResult.testType}</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => closeModal('showLabResultsModal')}
                  className="text-white hover:bg-white/20 rounded-xl h-10 w-10 p-0"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8">
              <div className="space-y-6">
                {/* Patient Info */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-slate-600 font-medium">Patient ID</p>
                      <p className="text-lg font-semibold text-slate-800">{selectedLabResult.patientId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 font-medium">Test Date</p>
                      <p className="text-lg font-semibold text-slate-800">{selectedLabResult.date}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 font-medium">Technician</p>
                      <p className="text-lg font-semibold text-slate-800">{selectedLabResult.technician}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 font-medium">Status</p>
                      <Badge variant={
                        selectedLabResult.status === 'Critical' ? 'destructive' : 
                        selectedLabResult.status === 'Approved' ? 'secondary' : 'default'
                      }>
                        {selectedLabResult.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Detailed Results */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    Detailed Results
                  </h3>
                  <div className="space-y-4">
                    {Object.entries(selectedLabResult.detailedResults).map(([key, data]: [string, any]) => (
                      <div key={key} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                        <div className="flex-1">
                          <p className="font-medium text-slate-800 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                          <p className="text-sm text-slate-600">Normal: {data.normal}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-slate-800">
                            {data.value} {data.unit}
                          </p>
                          <Badge variant={
                            data.status === 'Critical' ? 'destructive' : 
                            data.status === 'High' ? 'destructive' :
                            data.status === 'Low' ? 'secondary' : 'secondary'
                          }>
                            {data.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Voice Notes */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <Mic className="h-5 w-5 text-amber-600" />
                    Voice Notes
                  </h3>
                  {selectedLabResult.voiceNotes && selectedLabResult.voiceNotes.length > 0 ? (
                    <div className="space-y-3">
                      {selectedLabResult.voiceNotes.map((note) => (
                        <div key={note.id} className="p-4 bg-amber-50 rounded-xl border-l-4 border-amber-400">
                          <p className="text-slate-800">{note.text}</p>
                          <p className="text-sm text-slate-600 mt-1">{note.timestamp}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-500 italic">No voice notes recorded for this result.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-slate-50 px-8 py-4 flex-shrink-0 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={() => closeModal('showLabResultsModal')}
                  className="border-slate-300 text-slate-600 hover:bg-slate-100"
                >
                  Close
                </Button>
                <div className="flex items-center gap-3">
                  {selectedLabResult.status !== 'Approved' && (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setDemoState(prev => ({ ...prev, showVoiceRecordingModal: true }));
                        }}
                        className="border-amber-300 text-amber-600 hover:bg-amber-50"
                      >
                        <Mic className="h-4 w-4 mr-2" />
                        Add Voice Note
                      </Button>
                      <Button
                        onClick={() => {
                          setLabResults(prev => prev.map(lab => 
                            lab.id === selectedLabResult.id 
                              ? { ...lab, status: "Approved" }
                              : lab
                          ));
                          setSelectedLabResult(prev => ({ ...prev, status: "Approved" }));
                          toast({ 
                            title: "Results Approved!", 
                            description: `Lab results for ${selectedLabResult.patient} have been approved and patient notified.` 
                          });
                          closeModal('showLabResultsModal');
                        }}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Approve Results
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Patient Update Options Modal */}
      {demoState.showPatientUpdateOptionsModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="flex justify-between items-center p-6 border-b border-slate-200/60 bg-gradient-to-r from-green-50/80 to-emerald-50/80">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Update Patient</h2>
                  {demoState.selectedPatientForUpdate && (
                    <p className="text-sm text-slate-600">{demoState.selectedPatientForUpdate.name}</p>
                  )}
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setDemoState(prev => ({ 
                  ...prev, 
                  showPatientUpdateOptionsModal: false,
                  selectedPatientForUpdate: null
                }))}
                className="h-10 w-10 rounded-full hover:bg-white/80"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="p-6 space-y-4">
              <p className="text-slate-600 text-center mb-6">Choose how you would like to update this patient's information:</p>
              
              <Button
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => {
                  setDemoState(prev => ({ 
                    ...prev, 
                    showPatientUpdateOptionsModal: false,
                    showPatientUpdateModal: true
                  }));
                }}
              >
                <Edit className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div>Text Update</div>
                  <div className="text-sm text-blue-100">Update using forms and text input</div>
                </div>
              </Button>
              
              <Button
                variant="outline"
                className="w-full border-amber-300 text-amber-700 hover:bg-amber-50 py-4 rounded-xl transition-all duration-300"
                onClick={() => {
                  setDemoState(prev => ({ 
                    ...prev, 
                    showPatientUpdateOptionsModal: false,
                    showPatientVoiceUpdateModal: true
                  }));
                }}
              >
                <Mic className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div>Voice Update</div>
                  <div className="text-sm text-amber-600">Update using voice dictation</div>
                </div>
              </Button>
              
              <Button
                variant="outline"
                className="w-full mt-4 border-slate-300 text-slate-600 hover:bg-slate-50"
                onClick={() => setDemoState(prev => ({ 
                  ...prev, 
                  showPatientUpdateOptionsModal: false,
                  selectedPatientForUpdate: null
                }))}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Patient Text Update Modal */}
      {demoState.showPatientUpdateModal && demoState.selectedPatientForUpdate && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-slate-200/60 bg-gradient-to-r from-blue-50/80 to-indigo-50/80">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                  <Edit className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">Update Patient Information</h2>
                  <p className="text-sm text-slate-600">{demoState.selectedPatientForUpdate.name} - {demoState.selectedPatientForUpdate.patientId}</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setDemoState(prev => ({ 
                  ...prev, 
                  showPatientUpdateModal: false,
                  selectedPatientForUpdate: null
                }))}
                className="h-10 w-10 rounded-full hover:bg-white/80"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Current Diagnosis */}
                <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-xl border border-blue-200/60">
                  <label className="font-semibold text-slate-700 text-sm block mb-2">Current Diagnosis</label>
                  <textarea 
                    className="w-full p-3 border border-blue-300/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 resize-none"
                    rows={3}
                    defaultValue={demoState.selectedPatientForUpdate.diagnosis || demoState.selectedPatientForUpdate.condition}
                  ></textarea>
                </div>
                
                {/* Treatment Plan */}
                <div className="p-4 bg-gradient-to-r from-green-50 to-green-100/50 rounded-xl border border-green-200/60">
                  <label className="font-semibold text-slate-700 text-sm block mb-2">Treatment Plan</label>
                  <textarea 
                    className="w-full p-3 border border-green-300/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white/80 resize-none"
                    rows={3}
                    placeholder="Update treatment plan and recommendations..."
                  ></textarea>
                </div>
                
                {/* Current Medications */}
                <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100/50 rounded-xl border border-purple-200/60">
                  <label className="font-semibold text-slate-700 text-sm block mb-2">Current Medications</label>
                  <textarea 
                    className="w-full p-3 border border-purple-300/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/80 resize-none"
                    rows={3}
                    defaultValue={demoState.selectedPatientForUpdate.medication || "Update current medications..."}
                  ></textarea>
                </div>
                
                {/* Patient Status */}
                <div className="p-4 bg-gradient-to-r from-amber-50 to-amber-100/50 rounded-xl border border-amber-200/60">
                  <label className="font-semibold text-slate-700 text-sm block mb-2">Patient Status</label>
                  <select className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm">
                    <option value="Active" selected={demoState.selectedPatientForUpdate.status === 'Active'}>Active</option>
                    <option value="Admitted" selected={demoState.selectedPatientForUpdate.status === 'Admitted'}>Admitted</option>
                    <option value="Scheduled" selected={demoState.selectedPatientForUpdate.status === 'Scheduled'}>Scheduled</option>
                    <option value="Discharged">Discharged</option>
                    <option value="Follow-up Required">Follow-up Required</option>
                  </select>
                </div>
              </div>
              
              {/* Clinical Notes */}
              <div className="p-4 bg-gradient-to-r from-slate-50 to-slate-100/50 rounded-xl border border-slate-200/60">
                <label className="font-semibold text-slate-700 text-sm block mb-2">Clinical Notes</label>
                <textarea 
                  className="w-full p-3 border border-slate-300/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 bg-white/80 resize-none"
                  rows={4}
                  defaultValue={demoState.selectedPatientForUpdate.notes || "Add clinical observations and notes..."}
                ></textarea>
              </div>
              
              {/* Vitals Update */}
              <div className="p-4 bg-gradient-to-r from-teal-50 to-teal-100/50 rounded-xl border border-teal-200/60">
                <label className="font-semibold text-slate-700 text-sm block mb-3">Update Vitals</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs text-slate-600 block mb-1">Blood Pressure</label>
                    <input 
                      type="text" 
                      className="w-full p-2 border border-teal-300/60 rounded-lg focus:ring-2 focus:ring-teal-500 bg-white/80"
                      placeholder="120/80"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-600 block mb-1">Heart Rate (BPM)</label>
                    <input 
                      type="number" 
                      className="w-full p-2 border border-teal-300/60 rounded-lg focus:ring-2 focus:ring-teal-500 bg-white/80"
                      placeholder="72"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-600 block mb-1">Temperature (°F)</label>
                    <input 
                      type="number" 
                      step="0.1" 
                      className="w-full p-2 border border-teal-300/60 rounded-lg focus:ring-2 focus:ring-teal-500 bg-white/80"
                      placeholder="98.6"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4 border-t border-slate-200/60">
                <Button
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() => {
                    // Update the patient in the list
                    setPatientList(prev => prev.map(p => 
                      p.id === demoState.selectedPatientForUpdate.id 
                        ? { ...p, notes: "Updated via text input - " + new Date().toLocaleDateString() }
                        : p
                    ));
                    
                    setDemoState(prev => ({ 
                      ...prev, 
                      showPatientUpdateModal: false,
                      selectedPatientForUpdate: null
                    }));
                    
                    toast({ 
                      title: "Patient Updated!", 
                      description: `${demoState.selectedPatientForUpdate.name}'s information has been updated successfully.` 
                    });
                  }}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Updates
                </Button>
                <Button 
                  variant="outline" 
                  className="px-8 py-3 rounded-xl border-slate-300 hover:bg-slate-50 font-medium"
                  onClick={() => setDemoState(prev => ({ 
                    ...prev, 
                    showPatientUpdateModal: false,
                    selectedPatientForUpdate: null
                  }))}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Patient Voice Update Modal */}
      {demoState.showPatientVoiceUpdateModal && demoState.selectedPatientForUpdate && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-slate-200/60 bg-gradient-to-r from-amber-50/80 to-orange-50/80">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-lg">
                  <Mic className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">Voice Update</h2>
                  <p className="text-sm text-slate-600">{demoState.selectedPatientForUpdate.name} - {demoState.selectedPatientForUpdate.patientId}</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setDemoState(prev => ({ 
                  ...prev, 
                  showPatientVoiceUpdateModal: false,
                  selectedPatientForUpdate: null
                }))}
                className="h-10 w-10 rounded-full hover:bg-white/80"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {demoState.voiceRecording ? (
                <div className="text-center space-y-6">
                  <div className="relative">
                    <div className="animate-pulse">
                      <div className="w-32 h-32 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                        <Mic className="h-16 w-16 text-white" />
                      </div>
                      <div className="absolute inset-0 w-32 h-32 bg-red-500/30 rounded-full mx-auto animate-ping"></div>
                    </div>
                    <p className="text-red-600 font-bold text-xl mt-6">Recording Patient Update...</p>
                    <div className="flex items-center justify-center gap-2 mt-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce"></div>
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-slate-50 to-slate-100/50 p-6 rounded-xl border border-slate-200/60 text-left">
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="h-4 w-4 text-slate-600" />
                      <span className="text-sm font-medium text-slate-700">Live Transcription</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed min-h-[100px]">
                      Patient shows improvement in blood pressure control. Current medication regimen appears effective. Recommend continuing current treatment plan with follow-up in 2 weeks. Patient reports good adherence to medications and diet modifications. No adverse effects noted.
                      <span className="animate-pulse inline-block ml-1 w-2 h-5 bg-blue-500"></span>
                    </p>
                  </div>
                  
                  <Button 
                    onClick={() => {
                      // Update the patient in the list
                      setPatientList(prev => prev.map(p => 
                        p.id === demoState.selectedPatientForUpdate.id 
                          ? { 
                              ...p, 
                              notes: "Updated via voice input - Patient shows improvement in blood pressure control. Continuing current treatment plan.",
                              lastVisit: new Date().toISOString().split('T')[0]
                            } as any
                          : p
                      ));
                      
                      setDemoState(prev => ({ 
                        ...prev, 
                        voiceRecording: false,
                        showPatientVoiceUpdateModal: false,
                        selectedPatientForUpdate: null
                      }));
                      
                      toast({ 
                        title: "Voice Update Saved!", 
                        description: `${demoState.selectedPatientForUpdate.name}'s information has been updated via voice dictation.` 
                      });
                    }}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Save className="h-5 w-5 mr-2" />
                    Save Voice Update
                  </Button>
                </div>
              ) : (
                <div className="text-center space-y-6">
                  <div className="w-32 h-32 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center mx-auto shadow-lg">
                    <Mic className="h-16 w-16 text-slate-500" />
                  </div>
                  
                  <div>
                    <p className="text-slate-700 font-medium text-xl mb-3">Record Patient Update</p>
                    <p className="text-slate-500 mb-4">Use voice dictation to update patient information</p>
                    
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 p-4 rounded-xl border border-blue-200/60 mb-6">
                      <h4 className="font-semibold text-blue-800 mb-2">Current Patient:</h4>
                      <div className="text-sm text-blue-700">
                        <p><strong>Name:</strong> {demoState.selectedPatientForUpdate.name}</p>
                        <p><strong>Condition:</strong> {demoState.selectedPatientForUpdate.condition}</p>
                        <p><strong>Status:</strong> {demoState.selectedPatientForUpdate.status}</p>
                      </div>
                    </div>
                    
                    <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 mb-6">
                      <p className="text-sm text-amber-800">
                        <strong>Tip:</strong> Speak clearly about diagnosis updates, treatment changes, medication adjustments, and clinical observations.
                      </p>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => {
                      setDemoState(prev => ({ ...prev, voiceRecording: true }));
                      // Simulate stopping recording after 5 seconds
                      setTimeout(() => {
                        setDemoState(prev => ({ ...prev, voiceRecording: false }));
                      }, 5000);
                    }}
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Mic className="h-5 w-5 mr-3" />
                    Start Voice Recording
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="w-full border-slate-300 text-slate-600 hover:bg-slate-50 py-3 rounded-xl"
                    onClick={() => setDemoState(prev => ({ 
                      ...prev, 
                      showPatientVoiceUpdateModal: false,
                      selectedPatientForUpdate: null
                    }))}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
