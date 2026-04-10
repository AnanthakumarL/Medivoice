import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  LayoutDashboard,
  Users,
  Pill,
  ClipboardList,
  Brain,
  Calendar,
  FileText,
  Settings,
  HelpCircle,
  Bell,
  LogOut,
  Activity,
  Clock,
  AlertCircle,
  CheckCircle,
  User,
  MapPin,
  Timer,
  Stethoscope,
  Heart,
  Shield,
  TrendingUp,
  Camera,
  Upload,
  Search,
  Plus,
  Edit,
  Eye,
  RefreshCw,
  Mic,
  Download,
  Phone,
  Mail,
  Building2,
  UserCheck,
  Zap,
  TestTube,
  Clipboard,
  CheckSquare,
  AlertTriangle,
  Bed,
  Home,
  ArrowRight,
  X,
  ChevronRight
} from "lucide-react";

const StaffDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationsRef = useRef<HTMLDivElement | null>(null);

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

  // Close notifications dropdown on tab change
  useEffect(() => {
    setIsNotificationsOpen(false);
  }, [activeTab]);
  const [selectedTask, setSelectedTask] = useState(null);
  
  // New state for enhanced functionality
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientSearch, setPatientSearch] = useState("");
  const [showPatientDialog, setShowPatientDialog] = useState(false);
  const [showPatientRecord, setShowPatientRecord] = useState(false);
  const [showAddPatientDialog, setShowAddPatientDialog] = useState(false);
  const [patientRecordMode, setPatientRecordMode] = useState("view"); // "view" or "update"
  const [showShiftChangeDialog, setShowShiftChangeDialog] = useState(false);
  const [showLeaveRequestDialog, setShowLeaveRequestDialog] = useState(false);
  const [selectedShiftForChange, setSelectedShiftForChange] = useState(null);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState([]);

  // Working demo functionality for Staff Dashboard
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

  const staffActions = {
    administerMedication: (patient) => simulateProcessing(`Administering medication to ${patient?.name || 'patient'}`),
    updateVitals: () => simulateProcessing("Recording patient vital signs"),
    completeTask: (task) => {
      setSelectedTask(task);
      simulateProcessing(`Completing task: ${task?.title || 'task'}`);
    },
    emergencyResponse: () => simulateProcessing("Initiating emergency response protocol", 1000),
    patientHandoff: () => simulateProcessing("Processing patient handoff"),
    updateSchedule: () => simulateProcessing("Updating shift schedule"),
    documentCare: () => simulateProcessing("Documenting patient care"),
    requestSupplies: () => simulateProcessing("Requesting medical supplies"),
    clockInOut: () => simulateProcessing("Processing time clock entry"),
    sendReport: () => simulateProcessing("Sending shift report"),
    aiAssistance: () => simulateProcessing("MediVo AI analyzing patient care plan", 3000),
    exportData: () => simulateProcessing("Exporting care documentation"),
  };

  // Form states
  const [newPatientForm, setNewPatientForm] = useState({
    name: "",
    patientId: "",
    room: "",
    ward: "Cardiology",
    condition: "",
    age: "",
    gender: "Male",
    bloodType: "O+",
    allergies: "",
    admissionDate: ""
  });

  const [shiftChangeForm, setShiftChangeForm] = useState({
    currentShift: "",
    requestedShift: "",
    reason: ""
  });

  const [leaveRequestForm, setLeaveRequestForm] = useState({
    type: "Personal Leave",
    startDate: "",
    endDate: "",
    reason: ""
  });

  const [uploadForm, setUploadForm] = useState({
    description: "",
    patientName: "",
    patientId: "",
    imageFile: null
  });
  
  // Shift schedule state
  const [shiftSchedule, setShiftSchedule] = useState([
    {
      id: 1,
      day: "Monday",
      date: "2024-01-29",
      shift: "Morning",
      time: "7:00 AM - 3:00 PM",
      status: "Confirmed",
      notes: "Regular shift"
    },
    {
      id: 2,
      day: "Tuesday", 
      date: "2024-01-30",
      shift: "Evening",
      time: "3:00 PM - 11:00 PM",
      status: "Confirmed",
      notes: "Regular shift"
    },
    {
      id: 3,
      day: "Wednesday",
      date: "2024-01-31", 
      shift: "Night",
      time: "11:00 PM - 7:00 AM",
      status: "Confirmed",
      notes: "Regular shift"
    },
    {
      id: 4,
      day: "Thursday",
      date: "2024-02-01",
      shift: "Morning",
      time: "7:00 AM - 3:00 PM", 
      status: "Confirmed",
      notes: "Regular shift"
    },
    {
      id: 5,
      day: "Friday",
      date: "2024-02-02",
      shift: "Evening",
      time: "3:00 PM - 11:00 PM",
      status: "Confirmed",
      notes: "Regular shift"
    }
  ]);

  const [leaveRequests, setLeaveRequests] = useState([
    {
      id: 1,
      type: "Sick Leave",
      startDate: "2024-02-05",
      endDate: "2024-02-07",
      reason: "Medical appointment",
      status: "Pending",
      submittedDate: "2024-01-25"
    },
    {
      id: 2,
      type: "Personal Leave",
      startDate: "2024-02-15",
      endDate: "2024-02-16",
      reason: "Family event",
      status: "Approved",
      submittedDate: "2024-01-20"
    }
  ]);

  // Staff Profile Data
  const [staffProfile] = useState({
    name: "Sarah Johnson",
    role: "Senior Nurse",
    department: "Cardiology Ward",
    staffId: "ST-2024-001",
    shift: "Day Shift (7 AM - 7 PM)",
    phone: "+1 (555) 987-6543",
    email: "sarah.johnson@hospital.com",
    experience: "8 years",
    avatar: "/placeholder.svg"
  });

  // Enhanced Notifications (stateful, hydrates from localStorage if present)
  const [notifications, setNotifications] = useState(() => {
    try {
      const stored = localStorage.getItem('demo.staff.notifications');
      if (stored) return JSON.parse(stored);
    } catch {}
    return [
      { id: 1, type: "urgent", message: "Medication due for Patient #203 in Room 15A - Insulin injection", time: "5 min ago", patient: "John Smith", room: "15A" },
      { id: 2, type: "task", message: "New task assigned: Wound dressing for Patient #187", time: "15 min ago", patient: "Mary Davis", room: "12B" },
      { id: 3, type: "transfer", message: "Patient #156 scheduled for transfer to ICU at 3:00 PM", time: "30 min ago", patient: "Robert Wilson", room: "8C" },
      { id: 4, type: "success", message: "Patient #145 discharge completed successfully", time: "1 hour ago", patient: "Lisa Brown", room: "10A" },
      { id: 5, type: "admin", message: "Staff meeting scheduled for tomorrow at 9:00 AM", time: "2 hours ago" },
    ];
  });

  // Today's Statistics
  const [todayStats] = useState([
    { label: "Assigned Patients", value: "24", change: "+2", trend: "up", icon: Users, target: 30 },
    { label: "Pending Tasks", value: "8", change: "-3", trend: "down", icon: ClipboardList, target: 0 },
    { label: "Medications Given", value: "45", change: "+12", trend: "up", icon: Pill, target: 60 },
    { label: "Completed Reports", value: "6", change: "+2", trend: "up", icon: FileText, target: 10 },
  ]);

  // Chart Data for Dashboard
  const [chartData] = useState({
    patientTrends: [
      { month: "Jan", admitted: 45, discharged: 38, current: 24 },
      { month: "Feb", admitted: 52, discharged: 41, current: 28 },
      { month: "Mar", admitted: 48, discharged: 44, current: 26 },
      { month: "Apr", admitted: 55, discharged: 47, current: 30 },
      { month: "May", admitted: 50, discharged: 45, current: 27 },
      { month: "Jun", admitted: 58, discharged: 52, current: 32 }
    ],
    taskCompletion: [
      { day: "Mon", completed: 85, pending: 15 },
      { day: "Tue", completed: 92, pending: 8 },
      { day: "Wed", completed: 78, pending: 22 },
      { day: "Thu", completed: 88, pending: 12 },
      { day: "Fri", completed: 95, pending: 5 },
      { day: "Sat", completed: 82, pending: 18 },
      { day: "Sun", completed: 75, pending: 25 }
    ],
    medicationStats: [
      { type: "Given", count: 45, color: "bg-green-500" },
      { type: "Pending", count: 8, color: "bg-orange-500" },
      { type: "Missed", count: 2, color: "bg-red-500" }
    ]
  });

  // Enhanced Assigned Patients List with detailed records
  const [assignedPatients, setAssignedPatients] = useState([
    {
      id: 1,
      name: "John Smith",
      patientId: "P-2024-203",
      room: "15A",
      ward: "Cardiology",
      condition: "Post-surgery recovery",
      status: "Stable",
      admissionDate: "2024-01-20",
      nextMedication: "2:00 PM - Insulin",
      avatar: "/placeholder.svg",
      priority: "High",
      age: 65,
      gender: "Male",
      bloodType: "O+",
      allergies: ["Penicillin", "Sulfa drugs"],
      vitalSigns: {
        bloodPressure: "120/80",
        heartRate: "72",
        temperature: "98.6°F",
        oxygenSaturation: "98%"
      },
      medications: [
        { name: "Insulin", dosage: "10 units", frequency: "Twice daily", lastGiven: "8:00 AM" },
        { name: "Metformin", dosage: "500mg", frequency: "Twice daily", lastGiven: "8:00 AM" },
        { name: "Aspirin", dosage: "81mg", frequency: "Once daily", lastGiven: "8:00 AM" }
      ],
      tasks: [
        { id: 1, task: "Blood sugar monitoring", status: "Completed", time: "8:00 AM" },
        { id: 2, task: "Wound dressing change", status: "Pending", time: "2:00 PM" },
        { id: 3, task: "Vital signs check", status: "Pending", time: "4:00 PM" }
      ],
      notes: "Patient recovering well from cardiac surgery. Wound healing properly. No signs of infection."
    },
    {
      id: 2,
      name: "Mary Davis",
      patientId: "P-2024-187",
      room: "12B",
      ward: "Cardiology",
      condition: "Wound care",
      status: "Recovering",
      admissionDate: "2024-01-22",
      nextMedication: "3:30 PM - Antibiotics",
      avatar: "/placeholder.svg",
      priority: "Medium",
      age: 58,
      gender: "Female",
      bloodType: "A+",
      allergies: ["Latex"],
      vitalSigns: {
        bloodPressure: "118/78",
        heartRate: "68",
        temperature: "98.4°F",
        oxygenSaturation: "99%"
      },
      medications: [
        { name: "Amoxicillin", dosage: "500mg", frequency: "Three times daily", lastGiven: "8:00 AM" },
        { name: "Ibuprofen", dosage: "400mg", frequency: "As needed", lastGiven: "10:00 AM" }
      ],
      tasks: [
        { id: 1, task: "Wound dressing change", status: "Pending", time: "2:30 PM" },
        { id: 2, task: "Pain assessment", status: "Completed", time: "10:00 AM" },
        { id: 3, task: "Mobility assessment", status: "Pending", time: "3:00 PM" }
      ],
      notes: "Patient has surgical wound on left leg. Wound shows signs of healing. Patient reports mild pain."
    },
    {
      id: 3,
      name: "Robert Wilson",
      patientId: "P-2024-156",
      room: "8C",
      ward: "Cardiology",
      condition: "Heart monitoring",
      status: "Critical",
      admissionDate: "2024-01-18",
      nextMedication: "1:45 PM - Heart medication",
      avatar: "/placeholder.svg",
      priority: "Critical",
      age: 72,
      gender: "Male",
      bloodType: "B+",
      allergies: ["None known"],
      vitalSigns: {
        bloodPressure: "140/90",
        heartRate: "95",
        temperature: "99.2°F",
        oxygenSaturation: "94%"
      },
      medications: [
        { name: "Metoprolol", dosage: "25mg", frequency: "Twice daily", lastGiven: "8:00 AM" },
        { name: "Lisinopril", dosage: "10mg", frequency: "Once daily", lastGiven: "8:00 AM" },
        { name: "Furosemide", dosage: "20mg", frequency: "Once daily", lastGiven: "8:00 AM" }
      ],
      tasks: [
        { id: 1, task: "Continuous heart monitoring", status: "In Progress", time: "Ongoing" },
        { id: 2, task: "Blood pressure monitoring", status: "Completed", time: "12:00 PM" },
        { id: 3, task: "ECG monitoring", status: "In Progress", time: "Ongoing" }
      ],
      notes: "Patient with severe heart condition. Requires constant monitoring. Blood pressure elevated."
    },
  ]);

  // Enhanced Medication Schedule with status updates
  const [medicationSchedule, setMedicationSchedule] = useState([
    {
      id: 1,
      patient: "John Smith",
      patientId: "P-2024-203",
      room: "15A",
      medication: "Insulin",
      dosage: "10 units",
      time: "2:00 PM",
      status: "Pending",
      instructions: "Subcutaneous injection, check blood sugar first",
      prescribedBy: "Dr. Anderson"
    },
    {
      id: 2,
      patient: "Mary Davis",
      patientId: "P-2024-187",
      room: "12B",
      medication: "Amoxicillin",
      dosage: "500mg",
      time: "3:30 PM",
      status: "Pending",
      instructions: "Take with food, monitor for allergic reactions",
      prescribedBy: "Dr. Smith"
    },
    {
      id: 3,
      patient: "Robert Wilson",
      patientId: "P-2024-156",
      room: "8C",
      medication: "Metoprolol",
      dosage: "25mg",
      time: "1:45 PM",
      status: "Given",
      instructions: "Monitor blood pressure after administration",
      prescribedBy: "Dr. Johnson",
      givenBy: "Sarah Johnson",
      givenAt: "1:45 PM"
    },
  ]);

  // Enhanced Daily Tasks with status updates
  const [dailyTasks, setDailyTasks] = useState([
    {
      id: 1,
      task: "Wound dressing change",
      patient: "Mary Davis",
      patientId: "P-2024-187",
      room: "12B",
      priority: "High",
      assignedBy: "Dr. Smith",
      dueTime: "2:30 PM",
      status: "Pending",
      instructions: "Clean wound with saline, apply new dressing, document healing progress"
    },
    {
      id: 2,
      task: "Vital signs monitoring",
      patient: "John Smith",
      patientId: "P-2024-203",
      room: "15A",
      priority: "Medium",
      assignedBy: "Dr. Anderson",
      dueTime: "4:00 PM",
      status: "Pending",
      instructions: "Check BP, pulse, temperature every 2 hours"
    },
    {
      id: 3,
      task: "Patient transfer preparation",
      patient: "Robert Wilson",
      patientId: "P-2024-156",
      room: "8C",
      priority: "Critical",
      assignedBy: "Charge Nurse",
      dueTime: "3:00 PM",
      status: "In Progress",
      instructions: "Prepare patient for ICU transfer, gather all medical records"
    },
  ]);



  // Handler functions for enhanced functionality
  const handleViewPatientRecord = (patient) => {
    setSelectedPatient(patient);
    setPatientRecordMode("view");
    setShowPatientRecord(true);
  };

  const handleUpdatePatientRecord = (patient) => {
    setSelectedPatient(patient);
    setPatientRecordMode("update");
    setShowPatientRecord(true);
  };

  const handleUpdatePatientStatus = (patientId, newStatus) => {
    setAssignedPatients(prev => 
      prev.map(patient => 
        patient.id === patientId 
          ? { ...patient, status: newStatus }
          : patient
      )
    );
    setSelectedPatient(prev => prev ? { ...prev, status: newStatus } : null);
    toast({
      title: "Status Updated",
      description: `Patient status updated to ${newStatus}`,
    });
  };

  const handleUpdatePatientTask = (patientId, taskId, newStatus) => {
    setAssignedPatients(prev => 
      prev.map(patient => 
        patient.id === patientId 
          ? {
              ...patient,
              tasks: patient.tasks.map(task => 
                task.id === taskId 
                  ? { ...task, status: newStatus }
                  : task
              )
            }
          : patient
      )
    );
    setSelectedPatient(prev => 
      prev ? {
        ...prev,
        tasks: prev.tasks.map(task => 
          task.id === taskId 
            ? { ...task, status: newStatus }
            : task
        )
      } : null
    );
    toast({
      title: "Task Updated",
      description: `Task status updated to ${newStatus}`,
    });
  };

  // Patient progress reports state
  const [patientReports, setPatientReports] = useState([
    { 
      id: 1,
      patient: "John Smith", 
      room: "15A", 
      lastUpdate: "2 hours ago", 
      status: "Improving", 
      priority: "Normal",
      notes: "Patient showing good recovery progress"
    },
    { 
      id: 2,
      patient: "Mary Davis", 
      room: "12B", 
      lastUpdate: "4 hours ago", 
      status: "Stable", 
      priority: "High",
      notes: "Wound healing properly, no signs of infection"
    },
    { 
      id: 3,
      patient: "Robert Wilson", 
      room: "8C", 
      lastUpdate: "1 hour ago", 
      status: "Critical", 
      priority: "Critical",
      notes: "Requires constant monitoring, blood pressure elevated"
    },
  ]);

  const handleUpdatePatientReport = (reportId, newStatus) => {
    setPatientReports(prev => 
      prev.map(report => 
        report.id === reportId 
          ? { ...report, status: newStatus, lastUpdate: "Just now" }
          : report
      )
    );
    toast({
      title: "Report Updated",
      description: `Patient status updated to ${newStatus}`,
    });
  };

  const handleCreateNewReport = () => {
    const newReport = {
      id: patientReports.length + 1,
      patient: "New Patient",
      room: "TBD",
      lastUpdate: "Just now",
      status: "Stable",
      priority: "Normal",
      notes: "New patient report created"
    };
    setPatientReports(prev => [...prev, newReport]);
    toast({
      title: "New Report Created",
      description: "A new patient progress report has been created",
    });
  };

  const handleMarkMedicationGiven = (medicationId) => {
    setMedicationSchedule(prev => 
      prev.map(med => 
        med.id === medicationId 
          ? { 
              ...med, 
              status: "Given", 
              givenBy: staffProfile.name,
              givenAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          : med
      )
    );
    toast({
      title: "Medication Given",
      description: "Medication status updated successfully",
    });
  };

  const handleStartTask = (taskId) => {
    setDailyTasks(prev => 
      prev.map(task => 
        task.id === taskId 
          ? { ...task, status: "In Progress" }
          : task
      )
    );
    toast({
      title: "Task Started",
      description: "Task marked as in progress",
    });
  };

  const handleCompleteTask = (taskId) => {
    setDailyTasks(prev => 
      prev.map(task => 
        task.id === taskId 
          ? { ...task, status: "Completed" }
          : task
      )
    );
    toast({
      title: "Task Completed",
      description: "Task marked as completed",
    });
  };

  const handleAddPatient = () => {
    setShowAddPatientDialog(true);
  };

  const handleSubmitNewPatient = () => {
    const newPatient = {
      id: assignedPatients.length + 1,
      name: newPatientForm.name,
      patientId: newPatientForm.patientId,
      room: newPatientForm.room,
      ward: newPatientForm.ward,
      condition: newPatientForm.condition,
      status: "Stable",
      admissionDate: newPatientForm.admissionDate,
      nextMedication: "8:00 AM - TBD",
      avatar: "/placeholder.svg",
      priority: "Medium",
      age: parseInt(newPatientForm.age),
      gender: newPatientForm.gender,
      bloodType: newPatientForm.bloodType,
      allergies: newPatientForm.allergies ? newPatientForm.allergies.split(',').map(a => a.trim()) : [],
      vitalSigns: {
        bloodPressure: "120/80",
        heartRate: "72",
        temperature: "98.6°F",
        oxygenSaturation: "98%"
      },
      medications: [],
      tasks: [],
      notes: "New patient admitted"
    };

    setAssignedPatients(prev => [...prev, newPatient]);
    setShowAddPatientDialog(false);
    setNewPatientForm({
      name: "",
      patientId: "",
      room: "",
      ward: "Cardiology",
      condition: "",
      age: "",
      gender: "Male",
      bloodType: "O+",
      allergies: "",
      admissionDate: ""
    });
    toast({
      title: "Patient Added",
      description: "New patient has been added to your assigned patients list",
    });
  };

  const handleRequestShiftChange = (shiftId) => {
    const shift = shiftSchedule.find(s => s.id === shiftId);
    setSelectedShiftForChange(shift);
    setShiftChangeForm({
      currentShift: shift.shift,
      requestedShift: "",
      reason: ""
    });
    setShowShiftChangeDialog(true);
  };

  const handleSubmitShiftChange = () => {
    setShiftSchedule(prev => 
      prev.map(shift => 
        shift.id === selectedShiftForChange.id 
          ? { 
              ...shift, 
              status: "Change Requested",
              notes: `Requested change from ${shiftChangeForm.currentShift} to ${shiftChangeForm.requestedShift}. Reason: ${shiftChangeForm.reason}`
            }
          : shift
      )
    );
    setShowShiftChangeDialog(false);
    setSelectedShiftForChange(null);
    setShiftChangeForm({
      currentShift: "",
      requestedShift: "",
      reason: ""
    });
    toast({
      title: "Shift Change Requested",
      description: "Your shift change request has been submitted for approval",
    });
  };

  const handleNewLeaveRequest = () => {
    setLeaveRequestForm({
      type: "Personal Leave",
      startDate: "",
      endDate: "",
      reason: ""
    });
    setShowLeaveRequestDialog(true);
  };

  const handleSubmitLeaveRequest = () => {
    const newRequest = {
      id: leaveRequests.length + 1,
      type: leaveRequestForm.type,
      startDate: leaveRequestForm.startDate,
      endDate: leaveRequestForm.endDate,
      reason: leaveRequestForm.reason,
      status: "Pending",
      submittedDate: new Date().toISOString().split('T')[0]
    };
    
    setLeaveRequests(prev => [...prev, newRequest]);
    setShowLeaveRequestDialog(false);
    setLeaveRequestForm({
      type: "Personal Leave",
      startDate: "",
      endDate: "",
      reason: ""
    });
    toast({
      title: "Leave Request Submitted",
      description: "Your new leave request has been submitted for approval",
    });
  };

  const handleUploadDocument = () => {
    setShowUploadDialog(true);
  };

  const handleSubmitDocument = () => {
    if (!uploadForm.imageFile || !uploadForm.description || !uploadForm.patientName || !uploadForm.patientId) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields and select an image",
        variant: "destructive"
      });
      return;
    }

    const newDocument = {
      id: uploadedDocuments.length + 1,
      description: uploadForm.description,
      patientName: uploadForm.patientName,
      patientId: uploadForm.patientId,
      fileName: uploadForm.imageFile.name,
      uploadDate: new Date().toLocaleDateString(),
      uploadTime: new Date().toLocaleTimeString(),
      uploadedBy: staffProfile.name
    };

    setUploadedDocuments(prev => [newDocument, ...prev]);
    setShowUploadDialog(false);
    setUploadForm({
      description: "",
      patientName: "",
      patientId: "",
      imageFile: null
    });
    toast({
      title: "Document Uploaded",
      description: "Wound care document has been uploaded successfully",
    });
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setUploadForm(prev => ({ ...prev, imageFile: file }));
    } else {
      toast({
        title: "Invalid File",
        description: "Please select an image file",
        variant: "destructive"
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('demo.user');
    toast({
      title: "Logged out successfully",
      description: "You have been safely logged out of the staff system.",
    });
    navigate("/staff-login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50/30 to-green-100/20 flex">
      {/* Side Navigation - Fixed Height */}
      <div className="w-64 bg-white border-r border-green-200 shadow-lg flex flex-col fixed h-screen">
        {/* Logo/Brand */}
        <div className="p-4 border-b border-green-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800">MediVoice</h1>
              <p className="text-xs text-green-600">Staff Portal</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-3 overflow-y-auto">
          <div className="space-y-1">
            {[
              { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
              { id: "ai-chatbot", label: "AI Chatbot", icon: Brain },
              { id: "patients", label: "Patient List", icon: Users },
              { id: "medications", label: "Medication Schedule", icon: Pill },
              { id: "tasks", label: "Task Management", icon: ClipboardList },
              { id: "schedule", label: "Shift & Schedule", icon: Calendar },
              { id: "reports", label: "Reports & Updates", icon: FileText },
              { id: "profile", label: "Profile & Settings", icon: Settings },
              { id: "help", label: "Help & Support", icon: HelpCircle },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 text-sm ${
                  activeTab === item.id
                    ? "bg-green-100 text-green-700 border border-green-200 shadow-sm"
                    : "text-slate-600 hover:bg-green-50 hover:text-green-600"
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span className="font-medium text-sm">{item.label}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* User Profile in Sidebar */}
        <div className="p-3 border-t border-green-200">
          <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
            <Avatar className="h-8 w-8 ring-2 ring-green-400/40">
              <AvatarImage src="/placeholder.svg" alt="Staff" />
              <AvatarFallback className="bg-gradient-to-br from-green-500 to-green-600 text-white font-bold text-sm">
                SJ
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-semibold text-slate-800 text-sm">{staffProfile.name}</p>
              <p className="text-xs text-green-600">{staffProfile.role}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area - Adjusted for fixed sidebar */}
      <div className="flex-1 flex flex-col ml-64">
        {/* AI Chatbot Tab Content */}
        {activeTab === "ai-chatbot" && (
          <div className="p-6 text-sm"></div>
        )}
        {/* Top Navigation Bar */}
        <header className="bg-white border-b border-green-200 shadow-sm">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  {activeTab === "dashboard" && "Staff Dashboard"}
                  {activeTab === "patients" && "Patient Management"}
                  {activeTab === "medications" && "Medication Schedule"}
                  {activeTab === "tasks" && "Task Management"}
                  {activeTab === "medivo" && "MediVo AI"}
                  {activeTab === "schedule" && "Shift & Schedule"}
                  {activeTab === "reports" && "Reports & Updates"}
                  {activeTab === "profile" && "Profile & Settings"}
                  {activeTab === "help" && "Help & Support"}
                </h2>
                <p className="text-slate-600">Welcome back, {staffProfile.name} (ID: {staffProfile.staffId})</p>
              </div>
              
              {/* Top Right Actions */}
              <div className="flex items-center gap-3">
                {/* Notifications */}
                <div className="relative" ref={notificationsRef}>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsNotificationsOpen(prev => !prev)}
                    className="hover:bg-green-100 relative"
                  >
                    <Bell className="h-5 w-5 text-slate-600" />
                    {notifications.length > 0 && (
                      <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 min-w-[18px] h-4 rounded-full text-[10px] font-semibold bg-red-500 text-white animate-bounce">
                        {notifications.length}
                      </span>
                    )}
                  </Button>
                  {isNotificationsOpen && (
                    <div className="absolute right-0 mt-2 w-80 z-50 bg-white border border-green-200 rounded-lg shadow-xl">
                      <div className="p-3 border-b border-green-200 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Bell className="h-4 w-4 text-green-600" />
                          <span className="font-semibold text-slate-800 text-sm">Notifications</span>
                        </div>
                        {notifications.length > 0 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const sample = [
                                { id: Date.now(), type: "admin", message: "Shift meeting today at 4:00 PM", time: "Just now" }
                              ];
                              try {
                                localStorage.setItem('demo.staff.notifications', JSON.stringify(sample));
                              } catch {}
                              setNotifications(sample);
                              setIsNotificationsOpen(false);
                            }}
                            className="h-7 px-2 text-xs border-red-200 text-red-700 hover:bg-red-50"
                          >
                            Clear All
                          </Button>
                        )}
                      </div>
                      <div className="max-h-80 overflow-auto p-2">
                        {notifications.length === 0 ? (
                          <div className="p-6 text-sm text-center text-slate-500 text-sm">No notifications</div>
                        ) : (
                          notifications.map((n) => (
                            <div
                              key={n.id}
                              className={`p-3 mb-2 last:mb-0 rounded-md border ${
                                n.type === 'urgent'
                                  ? 'bg-red-50 border-red-200'
                                  : n.type === 'task'
                                  ? 'bg-orange-50 border-orange-200'
                                  : n.type === 'success'
                                  ? 'bg-green-50 border-green-200'
                                  : 'bg-blue-50 border-blue-200'
                              }`}
                            >
                              <div className="flex items-start gap-2">
                                <div className={`mt-1 w-2 h-2 rounded-full ${
                                  n.type === 'urgent' ? 'bg-red-500' : n.type === 'task' ? 'bg-orange-500' : n.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                                }`}></div>
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-slate-800">{n.message}</p>
                                  <p className="text-xs text-slate-600 mt-0.5">{n.time}</p>
                                  {n.patient && (
                                    <p className="text-xs text-slate-500 mt-1">Patient: {n.patient}{n.room ? ` • Room: ${n.room}` : ''}</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => setActiveTab("profile")}
                        className="hover:bg-green-100 hover:scale-[1.02] transition-all duration-300"
                      >
                        <User className="h-5 w-5 text-slate-600" />
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
                        size="icon"
                        onClick={handleLogout}
                        className="hover:bg-red-100 text-red-600"
                      >
                        <LogOut className="h-5 w-5" />
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
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
        {/* Dashboard Tab Content */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-white rounded-lg p-6 border border-green-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-800 mb-2">Staff Care Center</h2>
                  <p className="text-slate-600 font-medium">Comprehensive patient care and task management</p>
                  <div className="flex items-center gap-6 mt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-green-600 text-sm font-medium">On Duty</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse delay-500"></div>
                      <span className="text-orange-600 text-sm font-medium">Tasks Active</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse delay-1000"></div>
                      <span className="text-blue-600 text-sm font-medium">Patients Assigned</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center bg-green-100 rounded-xl p-4 border border-green-300 shadow-md">
                    <div className="text-3xl font-bold text-green-600">24</div>
                    <div className="text-xs text-green-700 font-medium">Assigned Patients</div>
                  </div>
                  <div className="text-center bg-orange-100 rounded-xl p-4 border border-orange-300 shadow-md">
                    <div className="text-3xl font-bold text-orange-600">8</div>
                    <div className="text-xs text-orange-700 font-medium">Pending Tasks</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {todayStats.map((stat, index) => (
                <Card key={index} className="border border-green-200/60 shadow-xl bg-white hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-500 hover:scale-[1.02] cursor-pointer group">
                  <CardContent className="p-6 text-sm">
                    <div className="flex items-center gap-4">
                      <div className="p-4 bg-gradient-to-br from-green-500 to-green-600 rounded-xl group-hover:scale-105 transition-transform shadow-lg">
                        <stat.icon className="h-7 w-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">{stat.label}</p>
                        <p className="text-3xl font-bold text-slate-800 mb-1">{stat.value}</p>
                        <div className="flex items-center gap-2">
                          {stat.trend === "up" && <TrendingUp className="h-4 w-4 text-green-600" />}
                          {stat.trend === "down" && <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />}
                          <span className={`text-sm font-semibold ${
                            stat.trend === "up" ? "text-green-600" : "text-red-500"
                          }`}>
                            {stat.change}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              {/* Patient Trends Chart */}
              <Card className="border border-green-200/60 shadow-xl bg-white">
                <CardHeader className="bg-gradient-to-r from-green-100/80 to-green-50/80 border-b border-green-200/60">
                  <CardTitle className="flex items-center gap-2 text-slate-800">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    Patient Trends (6 Months)
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 text-sm">
                  <div className="space-y-4">
                    {chartData.patientTrends.map((data, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-600 w-12">{data.month}</span>
                        <div className="flex-1 mx-4">
                          <div className="flex h-8 bg-gray-100 rounded-lg overflow-hidden">
                            <div 
                              className="bg-green-500 h-full flex items-center justify-center text-white text-xs font-medium"
                              style={{ width: `${(data.admitted / 60) * 100}%` }}
                            >
                              {data.admitted}
                            </div>
                            <div 
                              className="bg-blue-500 h-full flex items-center justify-center text-white text-xs font-medium"
                              style={{ width: `${(data.discharged / 60) * 100}%` }}
                            >
                              {data.discharged}
                            </div>
                            <div 
                              className="bg-orange-500 h-full flex items-center justify-center text-white text-xs font-medium"
                              style={{ width: `${(data.current / 60) * 100}%` }}
                            >
                              {data.current}
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-slate-500 w-20 text-right">
                          <div>Admitted: {data.admitted}</div>
                          <div>Discharged: {data.discharged}</div>
                          <div>Current: {data.current}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 mt-4 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded"></div>
                      <span>Admitted</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded"></div>
                      <span>Discharged</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-orange-500 rounded"></div>
                      <span>Current</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Task Completion Chart */}
              <Card className="border border-green-200/60 shadow-xl bg-white">
                <CardHeader className="bg-gradient-to-r from-green-100/80 to-green-50/80 border-b border-green-200/60">
                  <CardTitle className="flex items-center gap-2 text-slate-800">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Weekly Task Completion
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 text-sm">
                  <div className="space-y-4">
                    {chartData.taskCompletion.map((data, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-600 w-12">{data.day}</span>
                        <div className="flex-1 mx-4">
                          <div className="flex h-6 bg-gray-100 rounded-lg overflow-hidden">
                            <div 
                              className="bg-green-500 h-full"
                              style={{ width: `${data.completed}%` }}
                            ></div>
                            <div 
                              className="bg-orange-500 h-full"
                              style={{ width: `${data.pending}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="text-xs text-slate-500 w-20 text-right">
                          <div className="text-green-600">{data.completed}%</div>
                          <div className="text-orange-600">{data.pending}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 mt-4 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded"></div>
                      <span>Completed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-orange-500 rounded"></div>
                      <span>Pending</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
           
            {/* Four-Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Left Column - Assigned Patients */}
              <Card className="lg:col-span-2 border border-green-200/60 shadow-xl bg-white hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-500">
                <CardHeader className="bg-gradient-to-r from-green-100/80 to-green-50/80 border-b border-green-200/60">
                  <CardTitle className="flex items-center gap-3 text-base font-semibold text-slate-800">
                    <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    Assigned Patients
                  </CardTitle>
                  <CardDescription className="text-slate-600 font-medium">Patients under your care today</CardDescription>
                </CardHeader>
                <CardContent className="p-6 text-sm space-y-4">
                  {assignedPatients.slice(0, 3).map((patient) => (
                    <div key={patient.id} className="flex items-center gap-4 p-4 bg-green-50/80 rounded-xl hover:bg-green-100/80 hover:shadow-md transition-all duration-300 hover:scale-[1.01] border border-green-200/60 hover:border-green-400/60 cursor-pointer">
                      <Avatar className="h-12 w-12 ring-2 ring-green-400/40">
                        <AvatarImage src={patient.avatar} alt={patient.name} />
                        <AvatarFallback className="bg-gradient-to-br from-green-500 to-green-600 text-white font-bold">
                          {patient.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-bold text-slate-800">{patient.name}</p>
                          <Badge variant={patient.priority === 'Critical' ? 'destructive' : patient.priority === 'High' ? 'default' : 'secondary'} className="text-xs">
                            {patient.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600 font-medium">Room {patient.room} • {patient.condition}</p>
                        <p className="text-xs text-slate-500">{patient.nextMedication}</p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="hover:scale-105 hover:shadow-md transition-all duration-300 hover:bg-green-100 hover:border-green-400/60 text-green-600 border-green-300/60"
                        onClick={() => handleViewPatientRecord(patient)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button 
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                    onClick={() => setActiveTab("patients")}
                  >
                    View All Patients
                  </Button>
                </CardContent>
              </Card>

              {/* Middle Column - Daily Tasks */}
              <Card className="lg:col-span-2 border border-orange-200/60 shadow-xl bg-white hover:shadow-2xl hover:shadow-orange-500/20 transition-all duration-500">
                <CardHeader className="bg-gradient-to-r from-orange-100/80 to-orange-50/80 border-b border-orange-200/60">
                  <CardTitle className="flex items-center gap-3 text-base font-semibold text-slate-800">
                    <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg">
                      <ClipboardList className="h-6 w-6 text-white" />
                    </div>
                    Daily Tasks
                  </CardTitle>
                  <CardDescription className="text-slate-600 font-medium">Your assigned tasks for today</CardDescription>
                </CardHeader>
                <CardContent className="p-6 text-sm space-y-4">
                  {dailyTasks.slice(0, 3).map((task) => (
                    <div key={task.id} className={`p-4 rounded-xl border-l-4 transition-all duration-300 hover:scale-[1.01] hover:shadow-md cursor-pointer ${
                      task.priority === 'Critical'
                        ? 'border-l-red-500 bg-red-100/80 hover:bg-red-200/80'
                        : task.priority === 'High'
                        ? 'border-l-orange-500 bg-orange-100/80 hover:bg-orange-200/80'
                        : 'border-l-green-500 bg-green-100/80 hover:bg-green-200/80'
                    }`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-bold text-sm text-slate-800">{task.task}</p>
                          <p className="text-xs text-slate-600 font-medium mt-1">{task.patient} • Room {task.room}</p>
                          <p className="text-xs text-slate-500 mt-1">Due: {task.dueTime}</p>
                        </div>
                        <Badge variant={task.status === 'Pending' ? 'secondary' : 'default'} className="text-xs">
                          {task.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  <Button 
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
                    onClick={() => setActiveTab("tasks")}
                  >
                    View All Tasks
                  </Button>
                </CardContent>
              </Card>

              {/* Notifications card removed; available via header bell dropdown */}
            </div>
          </div>
        )}

        {/* Patient List Tab Content */}
        {activeTab === "patients" && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 border border-green-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Patient Management</h2>
                  <p className="text-slate-600 font-medium">Manage assigned patients and their care</p>
                </div>
                <div className="flex items-center gap-3">
                  <Button 
                    className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
                    onClick={() => handleAddPatient()}
                  >
                    <Plus className="h-4 w-4" />
                    Add Patient
                  </Button>
                </div>
              </div>
            </div>

            <Card className="border border-green-200/60 shadow-xl bg-white">
              <CardHeader className="bg-gradient-to-r from-green-100/80 to-green-50/80 border-b border-green-200/60">
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <Users className="h-5 w-5 text-green-600" />
                  Assigned Patients
                </CardTitle>
                <CardDescription className="text-slate-600">Patients under your care with room/ward details</CardDescription>
              </CardHeader>
              <CardContent className="p-6 text-sm">
                {/* Search Bar */}
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search patients by name, ID, room, or condition..."
                      value={patientSearch}
                      onChange={(e) => setPatientSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-green-200 rounded-lg focus:border-green-400 focus:ring-2 focus:ring-green-200 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  {assignedPatients
                    .filter(patient => 
                      patient.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
                      patient.patientId.toLowerCase().includes(patientSearch.toLowerCase()) ||
                      patient.room.toLowerCase().includes(patientSearch.toLowerCase()) ||
                      patient.condition.toLowerCase().includes(patientSearch.toLowerCase())
                    )
                    .map((patient) => (
                    <div key={patient.id} className="p-4 border border-green-200/60 rounded-lg hover:bg-green-50/80 hover:border-green-400/60 transition-all duration-300 hover:scale-[1.01] hover:shadow-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12 ring-2 ring-green-400/40">
                            <AvatarImage src={patient.avatar} alt={patient.name} />
                            <AvatarFallback className="bg-gradient-to-br from-green-500 to-green-600 text-white font-bold">
                              {patient.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="font-bold text-slate-800">{patient.name}</h3>
                              <Badge variant="outline" className="border-green-400/60 text-green-600">{patient.ward}</Badge>
                              <Badge variant={patient.status === 'Critical' ? 'destructive' : patient.status === 'Stable' ? 'default' : 'secondary'} className={patient.status === 'Stable' ? 'bg-green-100 text-green-700 border-green-300/60' : ''}>{patient.status}</Badge>
                            </div>
                            <p className="text-slate-600 mb-1">ID: {patient.patientId} • Room: {patient.room}</p>
                            <div className="flex items-center gap-4 text-sm text-slate-500">
                              <span>Condition: {patient.condition}</span>
                              <span>Admitted: {patient.admissionDate}</span>
                              <span>Next medication: {patient.nextMedication}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex items-center gap-2 hover:scale-105 hover:shadow-md transition-all duration-300 hover:bg-green-100 hover:border-green-400/60 text-green-600 border-green-300/60"
                            onClick={() => handleViewPatientRecord(patient)}
                          >
                            <Eye className="h-4 w-4" />
                            View Records
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex items-center gap-2 hover:scale-105 hover:shadow-md transition-all duration-300 hover:bg-orange-100 hover:border-orange-400/60 text-orange-600 border-orange-300/60"
                            onClick={() => handleUpdatePatientRecord(patient)}
                          >
                            <Edit className="h-4 w-4" />
                            Update
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

        {/* Medication Schedule Tab Content */}
        {activeTab === "medications" && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 border border-green-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Medication Schedule</h2>
                  <p className="text-slate-600 font-medium">Manage medication timing and dosage for patients</p>
                </div>
                <div className="flex items-center gap-3">
                  <Button className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-md hover:shadow-lg transition-all duration-300">
                    <RefreshCw className="h-4 w-4" />
                    Refresh Schedule
                  </Button>
                  <Button className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-md hover:shadow-lg transition-all duration-300">
                    <AlertTriangle className="h-4 w-4" />
                    Missed Doses
                  </Button>
                </div>
              </div>
            </div>

            <Card className="border border-green-200/60 shadow-xl bg-white">
              <CardHeader className="bg-gradient-to-r from-green-100/80 to-green-50/80 border-b border-green-200/60">
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <Pill className="h-5 w-5 text-green-600" />
                  Today's Medication Schedule
                </CardTitle>
                <CardDescription className="text-slate-600">Medicines to be given with timing and dosage</CardDescription>
              </CardHeader>
              <CardContent className="p-6 text-sm">
                <div className="space-y-4">
                  {medicationSchedule.map((medication) => (
                    <div key={medication.id} className={`p-4 border rounded-lg transition-all duration-300 hover:scale-[1.01] hover:shadow-lg ${
                      medication.status === 'Pending'
                        ? 'border-orange-200/60 bg-orange-50/80 hover:bg-orange-100/80'
                        : 'border-green-200/60 bg-green-50/80 hover:bg-green-100/80'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl ${
                            medication.status === 'Pending'
                              ? 'bg-orange-200 text-orange-700'
                              : 'bg-green-200 text-green-700'
                          }`}>
                            <Pill className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="font-bold text-slate-800">{medication.medication}</h3>
                              <Badge variant={medication.status === 'Pending' ? 'secondary' : 'default'} className={medication.status === 'Given' ? 'bg-green-100 text-green-700 border-green-300/60' : ''}>
                                {medication.status}
                              </Badge>
                            </div>
                            <p className="text-slate-600 mb-1">{medication.patient} • Room {medication.room} • {medication.dosage}</p>
                            <div className="flex items-center gap-4 text-sm text-slate-500">
                              <span>Time: {medication.time}</span>
                              <span>Prescribed by: {medication.prescribedBy}</span>
                              {medication.givenBy && <span>Given by: {medication.givenBy} at {medication.givenAt}</span>}
                            </div>
                            <p className="text-xs text-slate-500 mt-1 italic">{medication.instructions}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {medication.status === 'Pending' ? (
                            <>
                              <Button 
                                size="sm" 
                                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                                onClick={() => handleMarkMedicationGiven(medication.id)}
                              >
                                <CheckSquare className="h-4 w-4 mr-1" />
                                Mark Given
                              </Button>
                              <Button variant="outline" size="sm" className="text-orange-600 border-orange-300/60 hover:bg-orange-100">
                                <AlertTriangle className="h-4 w-4 mr-1" />
                                Report Issue
                              </Button>
                            </>
                          ) : (
                            <div className="text-center">
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 mb-2">
                                ✓ Done
                              </Badge>
                              <div className="text-xs text-slate-500">
                                Given by: {medication.givenBy}<br/>
                                At: {medication.givenAt}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Task Management Tab Content */}
        {activeTab === "tasks" && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 border border-green-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Task Management</h2>
                  <p className="text-slate-600 font-medium">View and manage daily assigned tasks</p>
                </div>
                <div className="flex items-center gap-3">
                  <Button className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-md hover:shadow-lg transition-all duration-300">
                    <Plus className="h-4 w-4" />
                    Request Task
                  </Button>
                  <Button className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-md hover:shadow-lg transition-all duration-300">
                    <RefreshCw className="h-4 w-4" />
                    Refresh Tasks
                  </Button>
                </div>
              </div>
            </div>

            <Card className="border border-orange-200/60 shadow-xl bg-white">
              <CardHeader className="bg-gradient-to-r from-orange-100/80 to-orange-50/80 border-b border-orange-200/60">
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <ClipboardList className="h-5 w-5 text-orange-600" />
                  Daily Assigned Tasks
                </CardTitle>
                <CardDescription className="text-slate-600">Tasks assigned by doctors and admin</CardDescription>
              </CardHeader>
              <CardContent className="p-6 text-sm">
                <div className="space-y-4">
                  {dailyTasks.map((task) => (
                    <div key={task.id} className={`p-4 border rounded-lg transition-all duration-300 hover:scale-[1.01] hover:shadow-lg ${
                      task.priority === 'Critical'
                        ? 'border-red-200/60 bg-red-50/80 hover:bg-red-100/80'
                        : task.priority === 'High'
                        ? 'border-orange-200/60 bg-orange-50/80 hover:bg-orange-100/80'
                        : 'border-green-200/60 bg-green-50/80 hover:bg-green-100/80'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl ${
                            task.priority === 'Critical'
                              ? 'bg-red-200 text-red-700'
                              : task.priority === 'High'
                              ? 'bg-orange-200 text-orange-700'
                              : 'bg-green-200 text-green-700'
                          }`}>
                            <ClipboardList className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="font-bold text-slate-800">{task.task}</h3>
                              <Badge variant={task.priority === 'Critical' ? 'destructive' : task.priority === 'High' ? 'default' : 'secondary'}>
                                {task.priority}
                              </Badge>
                              <Badge variant={task.status === 'Pending' ? 'secondary' : task.status === 'In Progress' ? 'default' : 'outline'} className={task.status === 'In Progress' ? 'bg-orange-100 text-orange-700 border-orange-300/60' : ''}>
                                {task.status}
                              </Badge>
                            </div>
                            <p className="text-slate-600 mb-1">{task.patient} • Room {task.room} • Due: {task.dueTime}</p>
                            <div className="flex items-center gap-4 text-sm text-slate-500">
                              <span>Assigned by: {task.assignedBy}</span>
                            </div>
                            <p className="text-xs text-slate-500 mt-1 italic">{task.instructions}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {task.status === 'Pending' ? (
                            <>
                              <Button 
                                size="sm" 
                                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                                onClick={() => handleStartTask(task.id)}
                              >
                                <CheckSquare className="h-4 w-4 mr-1" />
                                Start Task
                              </Button>
                              <Button variant="outline" size="sm" className="text-orange-600 border-orange-300/60 hover:bg-orange-100">
                                <AlertTriangle className="h-4 w-4 mr-1" />
                                Request Reassignment
                              </Button>
                            </>
                          ) : task.status === 'In Progress' ? (
                            <>
                              <Button 
                                size="sm" 
                                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
                                onClick={() => handleCompleteTask(task.id)}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Mark Complete
                              </Button>
                              <Button variant="outline" size="sm" className="text-red-600 border-red-300/60 hover:bg-red-100">
                                <AlertTriangle className="h-4 w-4 mr-1" />
                                Report Issue
                              </Button>
                            </>
                          ) : (
                            <div className="text-center">
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 mb-2">
                                ✓ Task Completed
                              </Badge>
                              <div className="text-xs text-slate-500">
                                Completed by: {staffProfile.name}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* MediVo AI Tab Content */}
        {activeTab === "medivo" && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 border border-green-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">MediVo AI Assistant</h2>
                  <p className="text-slate-600 font-medium">Voice-based task updates and medical assistance</p>
                </div>
                <div className="flex items-center gap-3">
                  <Button className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-md hover:shadow-lg transition-all duration-300">
                    <Mic className="h-4 w-4" />
                    Start Voice Session
                  </Button>
                  <Button className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-300">
                    <Search className="h-4 w-4" />
                    Search Instructions
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border border-green-200/60 shadow-xl bg-white">
                <CardHeader className="bg-gradient-to-r from-green-100/80 to-green-50/80 border-b border-green-200/60">
                  <CardTitle className="flex items-center gap-2 text-slate-800">
                    <Brain className="h-5 w-5 text-green-600" />
                    AI Features
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 text-sm space-y-4">
                  <div className="p-4 bg-green-50/80 rounded-lg border border-green-200/60">
                    <h3 className="font-bold text-slate-800 mb-2">Voice Task Updates</h3>
                    <p className="text-sm text-slate-600">Use voice commands to update patient notes and task status</p>
                  </div>
                  <div className="p-4 bg-blue-50/80 rounded-lg border border-blue-200/60">
                    <h3 className="font-bold text-slate-800 mb-2">Patient Instructions Search</h3>
                    <p className="text-sm text-slate-600">Search for patient-related instructions and protocols</p>
                  </div>
                  <div className="p-4 bg-orange-50/80 rounded-lg border border-orange-200/60">
                    <h3 className="font-bold text-slate-800 mb-2">Medical Terms Explanation</h3>
                    <p className="text-sm text-slate-600">Get explanations of medical terms and procedures</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-blue-200/60 shadow-xl bg-white">
                <CardHeader className="bg-gradient-to-r from-blue-100/80 to-blue-50/80 border-b border-blue-200/60">
                  <CardTitle className="flex items-center gap-2 text-slate-800">
                    <Mic className="h-5 w-5 text-blue-600" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 text-sm space-y-3">
                  <Button className="w-full justify-start bg-gradient-to-r from-green-100 to-green-200 hover:from-green-200 hover:to-green-300 text-green-700 border border-green-300/60">
                    <Mic className="h-4 w-4 mr-2" />
                    Record Patient Notes
                  </Button>
                  <Button className="w-full justify-start bg-gradient-to-r from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300 text-blue-700 border border-blue-300/60">
                    <Search className="h-4 w-4 mr-2" />
                    Search Medical Database
                  </Button>
                  <Button className="w-full justify-start bg-gradient-to-r from-orange-100 to-orange-200 hover:from-orange-200 hover:to-orange-300 text-orange-700 border border-orange-300/60">
                    <Brain className="h-4 w-4 mr-2" />
                    Explain Medical Term
                  </Button>
                  <Button className="w-full justify-start bg-gradient-to-r from-emerald-100 to-emerald-200 hover:from-emerald-200 hover:to-emerald-300 text-emerald-700 border border-emerald-300/60">
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Shift & Schedule Tab Content */}
        {activeTab === "schedule" && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 border border-green-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Shift & Schedule Management</h2>
                  <p className="text-slate-600 font-medium">Manage your work schedule and shift preferences</p>
                </div>

              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Current Schedule */}
              <Card className="border border-green-200/60 shadow-xl bg-white">
                <CardHeader className="bg-gradient-to-r from-green-100/80 to-green-50/80 border-b border-green-200/60">
                  <CardTitle className="flex items-center gap-2 text-slate-800">
                    <Calendar className="h-5 w-5 text-green-600" />
                    Current Week Schedule
                  </CardTitle>
                  <CardDescription className="text-slate-600">Your assigned shifts for this week</CardDescription>
                </CardHeader>
                <CardContent className="p-6 text-sm">
                  <div className="space-y-4">
                    {shiftSchedule.map((schedule) => (
                      <div key={schedule.id} className={`p-4 rounded-lg border transition-all duration-300 hover:scale-[1.01] hover:shadow-md ${
                        schedule.status === 'Off'
                          ? 'border-gray-200/60 bg-gray-50/80'
                          : schedule.status === 'Change Requested'
                          ? 'border-orange-200/60 bg-orange-50/80 hover:bg-orange-100/80'
                          : 'border-green-200/60 bg-green-50/80 hover:bg-green-100/80'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="font-bold text-slate-800">{schedule.day}</h3>
                              <span className="text-sm text-slate-600">{schedule.date}</span>
                              <Badge variant={
                                schedule.status === 'Off' ? 'secondary' : 
                                schedule.status === 'Change Requested' ? 'default' : 
                                'default'
                              } className={
                                schedule.status === 'Confirmed' ? 'bg-green-100 text-green-700 border-green-300/60' :
                                schedule.status === 'Change Requested' ? 'bg-orange-100 text-orange-700 border-orange-300/60' :
                                ''
                              }>
                                {schedule.status}
                              </Badge>
                            </div>
                            <p className="text-slate-600 text-sm">{schedule.shift}</p>
                            <p className="text-slate-500 text-xs">{schedule.time}</p>
                            {schedule.notes && <p className="text-slate-500 text-xs italic">{schedule.notes}</p>}
                          </div>
                          {schedule.status === 'Confirmed' && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-orange-600 border-orange-300/60 hover:bg-orange-100"
                              onClick={() => handleRequestShiftChange(schedule.id)}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Request Change
                            </Button>
                          )}
                          {schedule.status === 'Change Requested' && (
                            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                              Pending Approval
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Shift Preferences & Leave Requests */}
              <div className="space-y-6">
                <Card className="border border-orange-200/60 shadow-xl bg-white">
                  <CardHeader className="bg-gradient-to-r from-orange-100/80 to-orange-50/80 border-b border-orange-200/60">
                    <CardTitle className="flex items-center gap-2 text-slate-800">
                      <Clock className="h-5 w-5 text-orange-600" />
                      Shift Preferences
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 text-sm space-y-4">
                    <div className="p-4 bg-orange-50/80 rounded-lg border border-orange-200/60">
                      <h3 className="font-bold text-slate-800 mb-2">Preferred Shifts</h3>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2">
                          <input type="checkbox" checked className="rounded border-orange-300" />
                          <span className="text-sm text-slate-600">Day Shift (7 AM - 7 PM)</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" className="rounded border-orange-300" />
                          <span className="text-sm text-slate-600">Night Shift (7 PM - 7 AM)</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" className="rounded border-orange-300" />
                          <span className="text-sm text-slate-600">Weekend Shifts</span>
                        </label>
                      </div>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white">
                      Update Preferences
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border border-blue-200/60 shadow-xl bg-white">
                  <CardHeader className="bg-gradient-to-r from-blue-100/80 to-blue-50/80 border-b border-blue-200/60">
                    <CardTitle className="flex items-center gap-2 text-slate-800">
                      <Home className="h-5 w-5 text-blue-600" />
                      Leave Requests
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 text-sm space-y-4">
                    <div className="space-y-3">
                      {leaveRequests.map((leave) => (
                        <div key={leave.id} className="p-3 bg-blue-50/80 rounded-lg border border-blue-200/60">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-slate-800">{leave.type}</p>
                              <p className="text-sm text-slate-600">{leave.startDate} - {leave.endDate}</p>
                              <p className="text-xs text-slate-500">{leave.reason}</p>
                              <p className="text-xs text-slate-400">Submitted: {leave.submittedDate}</p>
                            </div>
                            <Badge variant={leave.status === 'Approved' ? 'default' : 'secondary'} className={leave.status === 'Approved' ? 'bg-green-100 text-green-700 border-green-300/60' : 'bg-yellow-100 text-yellow-700 border-yellow-300/60'}>
                              {leave.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button 
                      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                      onClick={handleNewLeaveRequest}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      New Leave Request
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* Reports & Updates Tab Content */}
        {activeTab === "reports" && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 border border-green-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Reports & Updates</h2>
                  <p className="text-slate-600 font-medium">Submit patient progress updates and upload care documentation</p>
                </div>
                <div className="flex items-center gap-3">
                  <Button className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-md hover:shadow-lg transition-all duration-300">
                    <FileText className="h-4 w-4" />
                    New Report
                  </Button>
                  <Button className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-300">
                    <Upload className="h-4 w-4" />
                    Upload Files
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Patient Progress Reports */}
              <Card className="border border-green-200/60 shadow-xl bg-white">
                <CardHeader className="bg-gradient-to-r from-green-100/80 to-green-50/80 border-b border-green-200/60">
                  <CardTitle className="flex items-center gap-2 text-slate-800">
                    <FileText className="h-5 w-5 text-green-600" />
                    Patient Progress Reports
                  </CardTitle>
                  <CardDescription className="text-slate-600">Submit updates to doctors</CardDescription>
                </CardHeader>
                <CardContent className="p-6 text-sm">
                  <div className="space-y-4">
                    {patientReports.map((report) => (
                      <div key={report.id} className={`p-4 rounded-lg border transition-all duration-300 hover:scale-[1.01] hover:shadow-md ${
                        report.priority === 'Critical'
                          ? 'border-red-200/60 bg-red-50/80 hover:bg-red-100/80'
                          : report.priority === 'High'
                          ? 'border-orange-200/60 bg-orange-50/80 hover:bg-orange-100/80'
                          : 'border-green-200/60 bg-green-50/80 hover:bg-green-100/80'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="font-bold text-slate-800">{report.patient}</h3>
                              <Badge variant={report.status === 'Critical' ? 'destructive' : report.status === 'Recovering' ? 'default' : 'secondary'}>
                                {report.status}
                              </Badge>
                            </div>
                            <p className="text-slate-600 text-sm">Room {report.room} • Status: {report.status}</p>
                            <p className="text-slate-500 text-xs">Last update: {report.lastUpdate}</p>
                            <p className="text-xs text-slate-500 italic">{report.notes}</p>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-green-600 border-green-300/60 hover:bg-green-100"
                            onClick={() => handleViewPatientRecord(assignedPatients.find(p => p.name === report.patient))}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                </CardContent>
              </Card>

              {/* File Upload & Documentation */}
              <div className="space-y-6">
                <Card className="border border-blue-200/60 shadow-xl bg-white">
                  <CardHeader className="bg-gradient-to-r from-blue-100/80 to-blue-50/80 border-b border-blue-200/60">
                    <CardTitle className="flex items-center gap-2 text-slate-800">
                      <Camera className="h-5 w-5 text-blue-600" />
                      Wound Care Documentation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 text-sm space-y-4">
                    <div className="p-4 bg-blue-50/80 rounded-lg border border-blue-200/60">
                      <h3 className="font-bold text-slate-800 mb-2">Photo Upload</h3>
                      <p className="text-sm text-slate-600 mb-3">Upload wound photos for monitoring progress</p>
                      <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center">
                        <Camera className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                        <p className="text-sm text-slate-600">Click to upload or drag and drop</p>
                        <p className="text-xs text-slate-500">PNG, JPG up to 10MB</p>
                      </div>
                    </div>
                    <Button 
                      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                      onClick={handleUploadDocument}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Documentation
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border border-orange-200/60 shadow-xl bg-white">
                  <CardHeader className="bg-gradient-to-r from-orange-100/80 to-orange-50/80 border-b border-orange-200/60">
                    <CardTitle className="flex items-center gap-2 text-slate-800">
                      <Download className="h-5 w-5 text-orange-600" />
                      Recent Uploads
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 text-sm space-y-3">
                    {uploadedDocuments.length === 0 ? (
                      <div className="text-center py-4">
                        <p className="text-slate-500 text-sm">No documents uploaded yet</p>
                      </div>
                    ) : (
                      uploadedDocuments.map((doc) => (
                        <div key={doc.id} className="p-3 bg-orange-50/80 rounded-lg border border-orange-200/60">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-slate-800 text-sm">{doc.description}</p>
                              <p className="text-xs text-slate-600">{doc.patientName} (ID: {doc.patientId})</p>
                              <p className="text-xs text-slate-500">{doc.uploadDate} at {doc.uploadTime}</p>
                              <p className="text-xs text-slate-400">File: {doc.fileName}</p>
                            </div>
                            <Button variant="outline" size="sm" className="text-orange-600 border-orange-300/60 hover:bg-orange-100">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* Profile & Settings Tab Content */}
        {activeTab === "profile" && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 border border-green-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Profile & Settings</h2>
                  <p className="text-slate-600 font-medium">Manage your personal information and preferences</p>
                </div>
                <div className="flex items-center gap-3">
                  <Button className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-md hover:shadow-lg transition-all duration-300">
                    <Edit className="h-4 w-4" />
                    Edit Profile
                  </Button>
                  <Button className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-md hover:shadow-lg transition-all duration-300">
                    <Download className="h-4 w-4" />
                    Export Data
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Personal Information */}
              <Card className="border border-green-200/60 shadow-xl bg-white">
                <CardHeader className="bg-gradient-to-r from-green-100/80 to-green-50/80 border-b border-green-200/60">
                  <CardTitle className="flex items-center gap-2 text-slate-800">
                    <User className="h-5 w-5 text-green-600" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 text-sm space-y-6">
                  <div className="flex items-center gap-4 mb-6">
                    <Avatar className="h-20 w-20 ring-4 ring-green-400/40">
                      <AvatarImage src={staffProfile.avatar} alt={staffProfile.name} />
                      <AvatarFallback className="bg-gradient-to-br from-green-500 to-green-600 text-white font-bold text-2xl">
                        {staffProfile.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-bold text-slate-800">{staffProfile.name}</h3>
                      <p className="text-slate-600">{staffProfile.role}</p>
                      <p className="text-sm text-slate-500">{staffProfile.department}</p>
                      <Button variant="outline" size="sm" className="mt-2 text-green-600 border-green-300/60 hover:bg-green-100">
                        <Camera className="h-4 w-4 mr-1" />
                        Change Photo
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-slate-600">First Name</label>
                        <input type="text" value="Sarah" className="w-full mt-1 p-2 border border-green-200 rounded-lg focus:border-green-400 focus:ring-2 focus:ring-green-200" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-600">Last Name</label>
                        <input type="text" value="Johnson" className="w-full mt-1 p-2 border border-green-200 rounded-lg focus:border-green-400 focus:ring-2 focus:ring-green-200" />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-slate-600">Staff ID</label>
                      <input type="text" value={staffProfile.staffId} disabled className="w-full mt-1 p-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500" />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-slate-600">Phone Number</label>
                      <input type="tel" value={staffProfile.phone} className="w-full mt-1 p-2 border border-green-200 rounded-lg focus:border-green-400 focus:ring-2 focus:ring-green-200" />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-slate-600">Email Address</label>
                      <input type="email" value={staffProfile.email} className="w-full mt-1 p-2 border border-green-200 rounded-lg focus:border-green-400 focus:ring-2 focus:ring-green-200" />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-slate-600">Department</label>
                      <select className="w-full mt-1 p-2 border border-green-200 rounded-lg focus:border-green-400 focus:ring-2 focus:ring-green-200">
                        <option>Cardiology Ward</option>
                        <option>Emergency Department</option>
                        <option>ICU</option>
                        <option>Pediatrics</option>
                        <option>Surgery</option>
                      </select>
                    </div>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white">
                    Save Changes
                  </Button>
                </CardContent>
              </Card>

              {/* Settings & Preferences */}
              <div className="space-y-6">
                <Card className="border border-blue-200/60 shadow-xl bg-white">
                  <CardHeader className="bg-gradient-to-r from-blue-100/80 to-blue-50/80 border-b border-blue-200/60">
                    <CardTitle className="flex items-center gap-2 text-slate-800">
                      <Settings className="h-5 w-5 text-blue-600" />
                      Account Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 text-sm space-y-4">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-slate-600">Current Password</label>
                        <input type="password" placeholder="Enter current password" className="w-full mt-1 p-2 border border-blue-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-200" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-600">New Password</label>
                        <input type="password" placeholder="Enter new password" className="w-full mt-1 p-2 border border-blue-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-200" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-600">Confirm New Password</label>
                        <input type="password" placeholder="Confirm new password" className="w-full mt-1 p-2 border border-blue-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-200" />
                      </div>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white">
                      <Shield className="h-4 w-4 mr-2" />
                      Update Password
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border border-orange-200/60 shadow-xl bg-white">
                  <CardHeader className="bg-gradient-to-r from-orange-100/80 to-orange-50/80 border-b border-orange-200/60">
                    <CardTitle className="flex items-center gap-2 text-slate-800">
                      <Bell className="h-5 w-5 text-orange-600" />
                      Notification Preferences
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 text-sm space-y-4">
                    <div className="space-y-3">
                      <label className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Email Notifications</span>
                        <input type="checkbox" checked className="rounded border-orange-300" />
                      </label>
                      <label className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">SMS Alerts</span>
                        <input type="checkbox" checked className="rounded border-orange-300" />
                      </label>
                      <label className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Push Notifications</span>
                        <input type="checkbox" className="rounded border-orange-300" />
                      </label>
                      <label className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Shift Reminders</span>
                        <input type="checkbox" checked className="rounded border-orange-300" />
                      </label>
                      <label className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Task Alerts</span>
                        <input type="checkbox" checked className="rounded border-orange-300" />
                      </label>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white">
                      Save Preferences
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border border-green-200/60 shadow-xl bg-white">
                  <CardHeader className="bg-gradient-to-r from-green-100/80 to-green-50/80 border-b border-green-200/60">
                    <CardTitle className="flex items-center gap-2 text-slate-800">
                      <Download className="h-5 w-5 text-green-600" />
                      Data & Privacy
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 text-sm space-y-3">
                    <Button className="w-full justify-start bg-gradient-to-r from-green-100 to-green-200 hover:from-green-200 hover:to-green-300 text-green-700 border border-green-300/60">
                      <Download className="h-4 w-4 mr-2" />
                      Download My Data
                    </Button>
                    <Button className="w-full justify-start bg-gradient-to-r from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300 text-blue-700 border border-blue-300/60">
                      <Shield className="h-4 w-4 mr-2" />
                      Privacy Settings
                    </Button>
                    <Button className="w-full justify-start bg-gradient-to-r from-red-100 to-red-200 hover:from-red-200 hover:to-red-300 text-red-700 border border-red-300/60">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Delete Account
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* Help & Support Tab Content */}
        {activeTab === "help" && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 border border-green-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Help & Support Center</h2>
                  <p className="text-slate-600 font-medium">Get assistance and access comprehensive support resources</p>
                </div>
                <div className="flex items-center gap-3">
                  <Button className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-300">
                    <Phone className="h-4 w-4" />
                    Emergency Contact
                  </Button>
                  <Button className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-md hover:shadow-lg transition-all duration-300">
                    <AlertTriangle className="h-4 w-4" />
                    Report Critical Issue
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Quick Help & FAQs */}
              <Card className="border border-blue-200/60 shadow-xl bg-white">
                <CardHeader className="bg-gradient-to-r from-blue-100/80 to-blue-50/80 border-b border-blue-200/60">
                  <CardTitle className="flex items-center gap-2 text-slate-800">
                    <HelpCircle className="h-5 w-5 text-blue-600" />
                    Frequently Asked Questions
                  </CardTitle>
                  <CardDescription className="text-slate-600">Common questions and quick solutions</CardDescription>
                </CardHeader>
                <CardContent className="p-6 text-sm space-y-4">
                  <div className="space-y-3">
                    {[
                      { question: "How do I update patient medication status?", category: "Medication Management" },
                      { question: "How to request shift changes?", category: "Schedule Management" },
                      { question: "How to upload patient care photos?", category: "Documentation" },
                      { question: "How to use MediVo AI voice commands?", category: "AI Assistant" },
                      { question: "How to report equipment issues?", category: "Technical Support" },
                    ].map((faq, index) => (
                      <div key={index} className="p-3 bg-blue-50/80 rounded-lg border border-blue-200/60 hover:bg-blue-100/80 transition-all duration-300 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-slate-800 text-sm">{faq.question}</p>
                            <p className="text-xs text-blue-600">{faq.category}</p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-blue-600" />
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white">
                    <FileText className="h-4 w-4 mr-2" />
                    View All FAQs
                  </Button>
                </CardContent>
              </Card>

              {/* Training & Resources */}
              <Card className="border border-green-200/60 shadow-xl bg-white">
                <CardHeader className="bg-gradient-to-r from-green-100/80 to-green-50/80 border-b border-green-200/60">
                  <CardTitle className="flex items-center gap-2 text-slate-800">
                    <Brain className="h-5 w-5 text-green-600" />
                    Training & Resources
                  </CardTitle>
                  <CardDescription className="text-slate-600">Educational content and training materials</CardDescription>
                </CardHeader>
                <CardContent className="p-6 text-sm space-y-4">
                  <Button className="w-full justify-start bg-gradient-to-r from-green-100 to-green-200 hover:from-green-200 hover:to-green-300 text-green-700 border border-green-300/60">
                    <Brain className="h-4 w-4 mr-2" />
                    Staff Training Videos
                  </Button>
                  <Button className="w-full justify-start bg-gradient-to-r from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300 text-blue-700 border border-blue-300/60">
                    <Clipboard className="h-4 w-4 mr-2" />
                    User Manual & Guides
                  </Button>
                  <Button className="w-full justify-start bg-gradient-to-r from-orange-100 to-orange-200 hover:from-orange-200 hover:to-orange-300 text-orange-700 border border-orange-300/60">
                    <TestTube className="h-4 w-4 mr-2" />
                    Medical Procedures Guide
                  </Button>
                  <Button className="w-full justify-start bg-gradient-to-r from-emerald-100 to-emerald-200 hover:from-emerald-200 hover:to-emerald-300 text-emerald-700 border border-emerald-300/60">
                    <Stethoscope className="h-4 w-4 mr-2" />
                    Equipment Usage Training
                  </Button>
                  <Button className="w-full justify-start bg-gradient-to-r from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300 text-blue-700 border border-blue-300/60">
                    <Shield className="h-4 w-4 mr-2" />
                    Safety Protocols
                  </Button>
                </CardContent>
              </Card>

              {/* Contact Support */}
              <Card className="border border-green-200/60 shadow-xl bg-white">
                <CardHeader className="bg-gradient-to-r from-green-100/80 to-green-50/80 border-b border-green-200/60">
                  <CardTitle className="flex items-center gap-2 text-slate-800">
                    <Phone className="h-5 w-5 text-green-600" />
                    Contact Information
                  </CardTitle>
                  <CardDescription className="text-slate-600">24/7 support and emergency contacts</CardDescription>
                </CardHeader>
                <CardContent className="p-6 text-sm space-y-4">
                  <div className="p-4 bg-red-50/80 rounded-lg border border-red-200/60">
                    <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      Emergency Support
                    </h3>
                    <p className="text-sm text-slate-600 mb-2">Critical system issues & patient emergencies</p>
                    <div className="flex items-center gap-2 text-sm text-red-600 font-medium">
                      <Phone className="h-4 w-4" />
                      <span>+1 (555) 911-HELP</span>
                    </div>
                  </div>

                  <div className="p-4 bg-green-50/80 rounded-lg border border-green-200/60">
                    <h3 className="font-bold text-slate-800 mb-2">Technical Support</h3>
                    <p className="text-sm text-slate-600 mb-2">Available 24/7 for system issues</p>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <Phone className="h-4 w-4" />
                        <span>+1 (555) 123-TECH</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <Mail className="h-4 w-4" />
                        <span>tech-support@hospital.com</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50/80 rounded-lg border border-blue-200/60">
                    <h3 className="font-bold text-slate-800 mb-2">Hospital Administration</h3>
                    <p className="text-sm text-slate-600 mb-2">For operational questions and HR support</p>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-blue-600">
                        <Phone className="h-4 w-4" />
                        <span>+1 (555) 123-ADMIN</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-blue-600">
                        <Mail className="h-4 w-4" />
                        <span>admin@hospital.com</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-blue-600">
                        <Building2 className="h-4 w-4" />
                        <span>Main Hospital Building, Floor 2</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Issue Reporting */}
              <Card className="border border-orange-200/60 shadow-xl bg-white">
                <CardHeader className="bg-gradient-to-r from-orange-100/80 to-orange-50/80 border-b border-orange-200/60">
                  <CardTitle className="flex items-center gap-2 text-slate-800">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    Report Issues
                  </CardTitle>
                  <CardDescription className="text-slate-600">Submit software or operational issues</CardDescription>
                </CardHeader>
                <CardContent className="p-6 text-sm space-y-4">
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-slate-600">Issue Type</label>
                      <select className="w-full mt-1 p-2 border border-orange-200 rounded-lg focus:border-orange-400 focus:ring-2 focus:ring-orange-200">
                        <option>Software Bug</option>
                        <option>Equipment Malfunction</option>
                        <option>System Performance</option>
                        <option>Data Sync Issue</option>
                        <option>Access Problem</option>
                        <option>Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-slate-600">Priority Level</label>
                      <select className="w-full mt-1 p-2 border border-orange-200 rounded-lg focus:border-orange-400 focus:ring-2 focus:ring-orange-200">
                        <option>Low - Minor inconvenience</option>
                        <option>Medium - Affects workflow</option>
                        <option>High - Significant impact</option>
                        <option>Critical - Patient safety concern</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-slate-600">Description</label>
                      <textarea
                        rows={4}
                        placeholder="Please describe the issue in detail..."
                        className="w-full mt-1 p-2 border border-orange-200 rounded-lg focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                      ></textarea>
                    </div>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Submit Issue Report
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
            )}

            {/* Add Patient Dialog */}
            <Dialog open={showAddPatientDialog} onOpenChange={setShowAddPatientDialog}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-slate-800">
                    <Plus className="h-5 w-5 text-green-600" />
                    Add New Patient
                  </DialogTitle>
                  <DialogDescription>
                    Enter patient information to add them to your assigned patients list
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-600">Patient Name</label>
                      <input
                        type="text"
                        value={newPatientForm.name}
                        onChange={(e) => setNewPatientForm(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full mt-1 p-2 border border-green-200 rounded-lg focus:border-green-400 focus:ring-2 focus:ring-green-200"
                        placeholder="Enter patient name"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600">Patient ID</label>
                      <input
                        type="text"
                        value={newPatientForm.patientId}
                        onChange={(e) => setNewPatientForm(prev => ({ ...prev, patientId: e.target.value }))}
                        className="w-full mt-1 p-2 border border-green-200 rounded-lg focus:border-green-400 focus:ring-2 focus:ring-green-200"
                        placeholder="P-2024-XXX"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600">Room Number</label>
                      <input
                        type="text"
                        value={newPatientForm.room}
                        onChange={(e) => setNewPatientForm(prev => ({ ...prev, room: e.target.value }))}
                        className="w-full mt-1 p-2 border border-green-200 rounded-lg focus:border-green-400 focus:ring-2 focus:ring-green-200"
                        placeholder="e.g., 15A"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600">Ward</label>
                      <select
                        value={newPatientForm.ward}
                        onChange={(e) => setNewPatientForm(prev => ({ ...prev, ward: e.target.value }))}
                        className="w-full mt-1 p-2 border border-green-200 rounded-lg focus:border-green-400 focus:ring-2 focus:ring-green-200"
                      >
                        <option value="Cardiology">Cardiology</option>
                        <option value="ICU">ICU</option>
                        <option value="Emergency">Emergency</option>
                        <option value="General">General</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600">Age</label>
                      <input
                        type="number"
                        value={newPatientForm.age}
                        onChange={(e) => setNewPatientForm(prev => ({ ...prev, age: e.target.value }))}
                        className="w-full mt-1 p-2 border border-green-200 rounded-lg focus:border-green-400 focus:ring-2 focus:ring-green-200"
                        placeholder="Age"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600">Gender</label>
                      <select
                        value={newPatientForm.gender}
                        onChange={(e) => setNewPatientForm(prev => ({ ...prev, gender: e.target.value }))}
                        className="w-full mt-1 p-2 border border-green-200 rounded-lg focus:border-green-400 focus:ring-2 focus:ring-green-200"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600">Blood Type</label>
                      <select
                        value={newPatientForm.bloodType}
                        onChange={(e) => setNewPatientForm(prev => ({ ...prev, bloodType: e.target.value }))}
                        className="w-full mt-1 p-2 border border-green-200 rounded-lg focus:border-green-400 focus:ring-2 focus:ring-green-200"
                      >
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600">Admission Date</label>
                      <input
                        type="date"
                        value={newPatientForm.admissionDate}
                        onChange={(e) => setNewPatientForm(prev => ({ ...prev, admissionDate: e.target.value }))}
                        className="w-full mt-1 p-2 border border-green-200 rounded-lg focus:border-green-400 focus:ring-2 focus:ring-green-200"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Medical Condition</label>
                    <input
                      type="text"
                      value={newPatientForm.condition}
                      onChange={(e) => setNewPatientForm(prev => ({ ...prev, condition: e.target.value }))}
                      className="w-full mt-1 p-2 border border-green-200 rounded-lg focus:border-green-400 focus:ring-2 focus:ring-green-200"
                      placeholder="e.g., Post-surgery recovery"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Allergies (comma-separated)</label>
                    <input
                      type="text"
                      value={newPatientForm.allergies}
                      onChange={(e) => setNewPatientForm(prev => ({ ...prev, allergies: e.target.value }))}
                      className="w-full mt-1 p-2 border border-green-200 rounded-lg focus:border-green-400 focus:ring-2 focus:ring-green-200"
                      placeholder="e.g., Penicillin, Latex"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <Button variant="outline" onClick={() => setShowAddPatientDialog(false)}>
                    Cancel
                  </Button>
                  <Button 
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                    onClick={handleSubmitNewPatient}
                  >
                    Add Patient
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Shift Change Request Dialog */}
            <Dialog open={showShiftChangeDialog} onOpenChange={setShowShiftChangeDialog}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-slate-800">
                    <Edit className="h-5 w-5 text-orange-600" />
                    Request Shift Change
                  </DialogTitle>
                  <DialogDescription>
                    Request a change to your scheduled shift
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-600">Current Shift</label>
                    <input
                      type="text"
                      value={shiftChangeForm.currentShift}
                      disabled
                      className="w-full mt-1 p-2 border border-gray-200 rounded-lg bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Requested Shift</label>
                    <select
                      value={shiftChangeForm.requestedShift}
                      onChange={(e) => setShiftChangeForm(prev => ({ ...prev, requestedShift: e.target.value }))}
                      className="w-full mt-1 p-2 border border-orange-200 rounded-lg focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                    >
                      <option value="">Select shift</option>
                      <option value="Morning">Morning (7:00 AM - 3:00 PM)</option>
                      <option value="Evening">Evening (3:00 PM - 11:00 PM)</option>
                      <option value="Night">Night (11:00 PM - 7:00 AM)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Reason for Change</label>
                    <textarea
                      value={shiftChangeForm.reason}
                      onChange={(e) => setShiftChangeForm(prev => ({ ...prev, reason: e.target.value }))}
                      rows={3}
                      className="w-full mt-1 p-2 border border-orange-200 rounded-lg focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                      placeholder="Please provide a reason for the shift change request..."
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <Button variant="outline" onClick={() => setShowShiftChangeDialog(false)}>
                    Cancel
                  </Button>
                  <Button 
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
                    onClick={handleSubmitShiftChange}
                  >
                    Submit Request
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Leave Request Dialog */}
            <Dialog open={showLeaveRequestDialog} onOpenChange={setShowLeaveRequestDialog}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-slate-800">
                    <Home className="h-5 w-5 text-blue-600" />
                    New Leave Request
                  </DialogTitle>
                  <DialogDescription>
                    Submit a new leave request for approval
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-600">Leave Type</label>
                    <div className="mt-1">
                      <Select value={leaveRequestForm.type || 'Personal Leave'} onValueChange={(v) => setLeaveRequestForm(prev => ({ ...prev, type: v }))}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select leave type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Personal Leave">Personal Leave</SelectItem>
                          <SelectItem value="Sick Leave">Sick Leave</SelectItem>
                          <SelectItem value="Vacation">Vacation</SelectItem>
                          <SelectItem value="Emergency">Emergency</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-600">Start Date</label>
                      <input
                        type="date"
                        value={leaveRequestForm.startDate}
                        onChange={(e) => setLeaveRequestForm(prev => ({ ...prev, startDate: e.target.value }))}
                        className="w-full mt-1 p-2 border border-blue-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600">End Date</label>
                      <input
                        type="date"
                        value={leaveRequestForm.endDate}
                        onChange={(e) => setLeaveRequestForm(prev => ({ ...prev, endDate: e.target.value }))}
                        className="w-full mt-1 p-2 border border-blue-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Reason</label>
                    <textarea
                      value={leaveRequestForm.reason}
                      onChange={(e) => setLeaveRequestForm(prev => ({ ...prev, reason: e.target.value }))}
                      rows={3}
                      className="w-full mt-1 p-2 border border-blue-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                      placeholder="Please provide a reason for your leave request..."
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <Button variant="outline" onClick={() => setShowLeaveRequestDialog(false)}>
                    Cancel
                  </Button>
                  <Button 
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                    onClick={handleSubmitLeaveRequest}
                  >
                    Submit Request
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Document Upload Dialog */}
            <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-slate-800">
                    <Upload className="h-5 w-5 text-blue-600" />
                    Upload Wound Care Document
                  </DialogTitle>
                  <DialogDescription>
                    Upload wound care photos with patient information
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-600">Description</label>
                    <textarea
                      value={uploadForm.description}
                      onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="w-full mt-1 p-2 border border-blue-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                      placeholder="Describe the wound care documentation..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-600">Patient Name</label>
                      <input
                        type="text"
                        value={uploadForm.patientName}
                        onChange={(e) => setUploadForm(prev => ({ ...prev, patientName: e.target.value }))}
                        className="w-full mt-1 p-2 border border-blue-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                        placeholder="Patient name"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600">Patient ID</label>
                      <input
                        type="text"
                        value={uploadForm.patientId}
                        onChange={(e) => setUploadForm(prev => ({ ...prev, patientId: e.target.value }))}
                        className="w-full mt-1 p-2 border border-blue-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                        placeholder="P-2024-XXX"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Select Image File</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="w-full mt-1 p-2 border border-blue-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                    />
                    {uploadForm.imageFile && (
                      <p className="text-xs text-green-600 mt-1">Selected: {uploadForm.imageFile.name}</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
                    Cancel
                  </Button>
                  <Button 
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                    onClick={handleSubmitDocument}
                  >
                    Upload Document
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Patient Record Dialog */}
            <Dialog open={showPatientRecord} onOpenChange={setShowPatientRecord}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-slate-800">
                    <User className="h-5 w-5 text-green-600" />
                    {selectedPatient?.name} - Patient Record
                  </DialogTitle>
                  <DialogDescription>
                    {patientRecordMode === "view" ? "View patient information and medical records" : "Update patient information and care notes"}
                  </DialogDescription>
                </DialogHeader>
                
                {selectedPatient && (
                  <div className="space-y-6">
                    {/* Patient Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="border border-green-200/60">
                        <CardHeader className="bg-gradient-to-r from-green-100/80 to-green-50/80 border-b border-green-200/60">
                          <CardTitle className="text-lg">Basic Information</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 space-y-3">
                          <div className="flex items-center gap-4 mb-4">
                            <Avatar className="h-16 w-16 ring-2 ring-green-400/40">
                              <AvatarImage src={selectedPatient.avatar} alt={selectedPatient.name} />
                              <AvatarFallback className="bg-gradient-to-br from-green-500 to-green-600 text-white font-bold text-lg">
                                {selectedPatient.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="text-xl font-bold text-slate-800">{selectedPatient.name}</h3>
                              <p className="text-slate-600">ID: {selectedPatient.patientId}</p>
                              <Badge variant={selectedPatient.status === 'Critical' ? 'destructive' : selectedPatient.status === 'Stable' ? 'default' : 'secondary'}>
                                {selectedPatient.status}
                              </Badge>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <span className="text-slate-500">Age:</span>
                              <p className="font-medium">{selectedPatient.age} years</p>
                            </div>
                            <div>
                              <span className="text-slate-500">Gender:</span>
                              <p className="font-medium">{selectedPatient.gender}</p>
                            </div>
                            <div>
                              <span className="text-slate-500">Blood Type:</span>
                              <p className="font-medium">{selectedPatient.bloodType}</p>
                            </div>
                            <div>
                              <span className="text-slate-500">Room:</span>
                              <p className="font-medium">{selectedPatient.room} ({selectedPatient.ward})</p>
                            </div>
                            <div className="col-span-2">
                              <span className="text-slate-500">Admitted:</span>
                              <p className="font-medium">{selectedPatient.admissionDate}</p>
                            </div>
                            <div className="col-span-2">
                              <span className="text-slate-500">Allergies:</span>
                              <p className="font-medium">{selectedPatient.allergies.length > 0 ? selectedPatient.allergies.join(', ') : 'None known'}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border border-blue-200/60">
                        <CardHeader className="bg-gradient-to-r from-blue-100/80 to-blue-50/80 border-b border-blue-200/60">
                          <CardTitle className="text-lg">Vital Signs</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 space-y-3">
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="p-3 bg-blue-50/80 rounded-lg">
                              <span className="text-slate-500">Blood Pressure</span>
                              <p className="font-bold text-lg text-slate-800">{selectedPatient.vitalSigns.bloodPressure}</p>
                            </div>
                            <div className="p-3 bg-blue-50/80 rounded-lg">
                              <span className="text-slate-500">Heart Rate</span>
                              <p className="font-bold text-lg text-slate-800">{selectedPatient.vitalSigns.heartRate} bpm</p>
                            </div>
                            <div className="p-3 bg-blue-50/80 rounded-lg">
                              <span className="text-slate-500">Temperature</span>
                              <p className="font-bold text-lg text-slate-800">{selectedPatient.vitalSigns.temperature}</p>
                            </div>
                            <div className="p-3 bg-blue-50/80 rounded-lg">
                              <span className="text-slate-500">Oxygen Sat.</span>
                              <p className="font-bold text-lg text-slate-800">{selectedPatient.vitalSigns.oxygenSaturation}</p>
                            </div>
                          </div>
                          {patientRecordMode === "update" && (
                            <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white">
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Update Vitals
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    </div>

                    {/* Medications */}
                    <Card className="border border-orange-200/60">
                      <CardHeader className="bg-gradient-to-r from-orange-100/80 to-orange-50/80 border-b border-orange-200/60">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Pill className="h-5 w-5 text-orange-600" />
                          Current Medications
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          {selectedPatient.medications.map((med, index) => (
                            <div key={index} className="p-3 bg-orange-50/80 rounded-lg border border-orange-200/60">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium text-slate-800">{med.name}</p>
                                  <p className="text-sm text-slate-600">{med.dosage} • {med.frequency}</p>
                                  <p className="text-xs text-slate-500">Last given: {med.lastGiven}</p>
                                </div>
                                {patientRecordMode === "update" && (
                                  <Button variant="outline" size="sm" className="text-orange-600 border-orange-300/60 hover:bg-orange-100">
                                    <CheckSquare className="h-4 w-4 mr-1" />
                                    Mark Given
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Tasks */}
                    <Card className="border border-green-200/60">
                      <CardHeader className="bg-gradient-to-r from-green-100/80 to-green-50/80 border-b border-green-200/60">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <ClipboardList className="h-5 w-5 text-green-600" />
                          Care Tasks
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          {selectedPatient.tasks.map((task) => (
                            <div key={task.id} className="p-3 bg-green-50/80 rounded-lg border border-green-200/60">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium text-slate-800">{task.task}</p>
                                  <p className="text-sm text-slate-600">Due: {task.time}</p>
                                  <Badge variant={task.status === 'Completed' ? 'default' : task.status === 'Pending' ? 'secondary' : 'outline'} className="mt-1">
                                    {task.status}
                                  </Badge>
                                </div>
                                {patientRecordMode === "update" && task.status !== 'Completed' && (
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="text-green-600 border-green-300/60 hover:bg-green-100"
                                    onClick={() => handleUpdatePatientTask(selectedPatient.id, task.id, 'Completed')}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Complete
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Notes */}
                    <Card className="border border-slate-200/60">
                      <CardHeader className="bg-gradient-to-r from-slate-100/80 to-slate-50/80 border-b border-slate-200/60">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <FileText className="h-5 w-5 text-slate-600" />
                          Care Notes
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4">
                        {patientRecordMode === "view" ? (
                          <div className="p-3 bg-slate-50/80 rounded-lg border border-slate-200/60">
                            <p className="text-slate-700">{selectedPatient.notes}</p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <textarea
                              rows={4}
                              defaultValue={selectedPatient.notes}
                              className="w-full p-3 border border-slate-200 rounded-lg focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                              placeholder="Update care notes..."
                            />
                            <Button className="bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white">
                              <FileText className="h-4 w-4 mr-2" />
                              Save Notes
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                )}

                <div className="flex justify-end gap-3 mt-6">
                  <Button variant="outline" onClick={() => setShowPatientRecord(false)}>
                    Close
                  </Button>
                  {patientRecordMode === "view" ? (
                    <Button 
                      className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
                      onClick={() => setPatientRecordMode("update")}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Record
                    </Button>
                  ) : (
                    <Button 
                      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                      onClick={() => setPatientRecordMode("view")}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Mode
                    </Button>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StaffDashboard;
