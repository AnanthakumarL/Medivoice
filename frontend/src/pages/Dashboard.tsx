import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import {
  Bell,
  Calendar,
  FileText,
  Pill,
  User,
  Heart,
  Activity,
  Clock,
  MessageCircle,
  ChevronRight,
  ChevronDown,
  AlertTriangle,
  CheckCircle2,
  LogOut,
  TrendingUp,
  Zap,
  Shield,
  Star,
  CreditCard,
  Settings,
  HelpCircle,
  Search,
  Filter,
  Download,
  Phone,
  Mail,
  Stethoscope,
  Building2,
  TestTube,
  Receipt,
  UserCheck,
  Lock,
  Smartphone,
  Eye,
  History,
  Wallet,
  MapPin,
  X,
  Brain
} from "lucide-react";
import HealthMetricsChart from "@/components/charts/HealthMetricsChart";
import AppointmentTrendsChart from "@/components/charts/AppointmentTrendsChart";
import HealthScoreChart from "@/components/charts/HealthScoreChart";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const { toast } = useToast();

  // Patient Profile Data (hydrate from auth user or demo user)
  const [patientProfile, setPatientProfile] = useState(() => {
    // First check for real authenticated user
    const authUserStr = localStorage.getItem('auth.user');
    if (authUserStr) {
      try {
        const authUser = JSON.parse(authUserStr);
        return {
          name: authUser.fullName || "User",
          patientId: "MV-2024-001",
          photo: "/placeholder.svg",
          phone: authUser.phoneNumber || "+1 (555) 123-4567",
          email: authUser.email || "user@email.com",
          address: "123 Main St, City, State 12345",
          emergencyContact: "Emergency Contact - +1 (555) 987-6543",
          insurance: "Blue Cross Blue Shield - Policy #BC123456"
        };
      } catch (e) {
        console.error('Error parsing auth user:', e);
      }
    }
    
    // Fall back to demo user
    const demoUserStr = localStorage.getItem('demo.user');
    const user = demoUserStr ? JSON.parse(demoUserStr) : null;
    return {
      name: user?.name || "John Doe",
      patientId: "MV-2024-001",
      photo: "/placeholder.svg",
      phone: "+1 (555) 123-4567",
      email: user?.email || "john.doe@email.com",
      address: "123 Main St, City, State 12345",
      emergencyContact: "Jane Doe - +1 (555) 987-6543",
      insurance: "Blue Cross Blue Shield - Policy #BC123456"
    };
  });

  const [activeTab, setActiveTab] = useState("dashboard");
  const [notifications, setNotifications] = useState(() => {
    const stored = localStorage.getItem('demo.notifications');
    if (stored) return JSON.parse(stored);
    return [
      { id: 1, message: "Appointment reminder: Dr. Johnson tomorrow at 2:00 PM", urgent: true, time: "2 hours ago", type: "reminder" },
      { id: 2, message: "Lab results are now available", urgent: false, time: "1 day ago", type: "lab" },
      { id: 3, message: "Time to take your afternoon medication", urgent: true, time: "30 minutes ago", type: "medication" },
      { id: 4, message: "Health checkup due next month", urgent: false, time: "3 days ago", type: "reminder" }
    ];
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
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
  const [editableProfile, setEditableProfile] = useState(patientProfile);

  // Chart data for Medical Records
  const [healthMetricsData] = useState([
    { date: "2024-01-01", heartRate: 72, bloodPressureSystolic: 120, bloodPressureDiastolic: 80, weight: 175 },
    { date: "2024-01-15", heartRate: 75, bloodPressureSystolic: 118, bloodPressureDiastolic: 78, weight: 173 },
    { date: "2024-02-01", heartRate: 70, bloodPressureSystolic: 122, bloodPressureDiastolic: 82, weight: 172 },
    { date: "2024-02-15", heartRate: 68, bloodPressureSystolic: 115, bloodPressureDiastolic: 75, weight: 170 },
    { date: "2024-03-01", heartRate: 72, bloodPressureSystolic: 120, bloodPressureDiastolic: 80, weight: 171 },
    { date: "2024-03-15", heartRate: 74, bloodPressureSystolic: 125, bloodPressureDiastolic: 85, weight: 173 }
  ]);

  const [appointmentTrendsData] = useState([
    { month: "Jan", scheduled: 3, completed: 2, cancelled: 1, upcoming: 1 },
    { month: "Feb", scheduled: 4, completed: 3, cancelled: 0, upcoming: 1 },
    { month: "Mar", scheduled: 2, completed: 2, cancelled: 0, upcoming: 0 },
    { month: "Apr", scheduled: 5, completed: 4, cancelled: 1, upcoming: 0 },
    { month: "May", scheduled: 3, completed: 2, cancelled: 0, upcoming: 1 },
    { month: "Jun", scheduled: 4, completed: 3, cancelled: 1, upcoming: 0 }
  ]);

  const [healthScoreData] = useState({
    overallScore: 87,
    categories: [
      { name: "Cardiovascular", value: 92, fill: "hsl(142, 76%, 36%)" },
      { name: "Respiratory", value: 88, fill: "hsl(142, 69%, 58%)" },
      { name: "Metabolic", value: 85, fill: "hsl(120, 60%, 50%)" },
      { name: "Mental Health", value: 90, fill: "hsl(200, 70%, 50%)" },
      { name: "Physical Activity", value: 82, fill: "hsl(45, 93%, 47%)" }
    ]
  });

  // Appointments state - sync with localStorage
  const [appointments, setAppointments] = useState(() => {
    try {
      const stored = localStorage.getItem('demo.appointments');
      if (stored) return JSON.parse(stored);
    } catch {}
    // Get current date and add some future dates
    const today = new Date();
    const futureDate1 = new Date(today);
    futureDate1.setDate(today.getDate() + 7); // 1 week from now
    const futureDate2 = new Date(today);
    futureDate2.setDate(today.getDate() + 14); // 2 weeks from now
    
    return [
      {
        id: "apt-001",
        doctor: "Dr. Sarah Johnson",
        specialty: "Cardiology",
        hospital: "City Medical Center",
        date: futureDate1.toISOString().split('T')[0], // Format as YYYY-MM-DD
        time: "2:00 PM",
        type: "in-person",
        reason: "Follow-up consultation for cardiac health",
        status: "confirmed",
        cost: "$150"
      },
      {
        id: "apt-002",
        doctor: "Dr. Michael Chen",
        specialty: "General Medicine",
        hospital: "Downtown Clinic",
        date: futureDate2.toISOString().split('T')[0], // Format as YYYY-MM-DD
        time: "10:00 AM",
        type: "video",
        reason: "Annual checkup",
        status: "confirmed",
        cost: "$120"
      }
    ];
  });

  // Update appointments when localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const stored = localStorage.getItem('demo.appointments');
        if (stored) {
          const newAppointments = JSON.parse(stored);
          console.log('Storage change detected, updating appointments:', newAppointments);
          setAppointments(newAppointments);
        }
      } catch (error) {
        console.error('Error parsing appointments from localStorage:', error);
      }
    };

    // Check for updates every 500ms (for same-tab updates)
    const interval = setInterval(() => {
      try {
        const stored = localStorage.getItem('demo.appointments');
        if (stored) {
          const newAppointments = JSON.parse(stored);
          setAppointments(prev => {
            // Only update if the data has actually changed
            if (JSON.stringify(prev) !== JSON.stringify(newAppointments)) {
              console.log('Appointments updated from localStorage:', newAppointments);
              return newAppointments;
            }
            return prev;
          });
        }
      } catch (error) {
        console.error('Error checking appointments from localStorage:', error);
      }
    }, 500);

    // Also listen for custom events (for same-tab updates)
    const handleAppointmentUpdate = () => {
      console.log('Custom appointment update event received');
      handleStorageChange();
    };

    // Listen for page focus to refresh appointments when user returns to dashboard
    const handlePageFocus = () => {
      console.log('Page focused, refreshing appointments');
      handleStorageChange();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('appointmentUpdated', handleAppointmentUpdate);
    window.addEventListener('focus', handlePageFocus);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('appointmentUpdated', handleAppointmentUpdate);
      window.removeEventListener('focus', handlePageFocus);
      clearInterval(interval);
    };
  }, []);

  // Helper function to check if appointment is upcoming
  const isUpcoming = (dateString: string) => {
    try {
      const appointmentDate = new Date(dateString);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      appointmentDate.setHours(0, 0, 0, 0);
      
      // Check if the date is valid
      if (isNaN(appointmentDate.getTime())) {
        console.warn('Invalid date format:', dateString);
        return false;
      }
      
      return appointmentDate >= today;
    } catch (error) {
      console.error('Error parsing date:', dateString, error);
      return false;
    }
  };

  // Filter appointments with debugging
  const upcomingAppointments = appointments.filter(apt => {
    const isUpcomingDate = isUpcoming(apt.date);
    const isConfirmed = apt.status === 'confirmed';
    console.log(`Appointment ${apt.id}: date=${apt.date}, isUpcoming=${isUpcomingDate}, status=${apt.status}, isConfirmed=${isConfirmed}`);
    return isUpcomingDate && isConfirmed;
  });
  
  const completedAppointments = appointments.filter(apt => 
    apt.status === 'completed'
  );

  // Debug logging
  console.log('All appointments:', appointments);
  console.log('Upcoming appointments:', upcomingAppointments);
  console.log('Completed appointments:', completedAppointments);

  // Force refresh appointments function
  const refreshAppointments = () => {
    try {
      const stored = localStorage.getItem('demo.appointments');
      if (stored) {
        const newAppointments = JSON.parse(stored);
        console.log('Force refreshing appointments:', newAppointments);
        setAppointments(newAppointments);
      }
    } catch (error) {
      console.error('Error refreshing appointments:', error);
    }
  };

  // Initialize localStorage if it doesn't exist and refresh on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('demo.appointments');
      if (!stored) {
        // Initialize with default appointments
        const defaultAppointments = [
          {
            id: "apt-001",
            doctor: "Dr. Sarah Johnson",
            specialty: "Cardiology",
            hospital: "City Medical Center",
            date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            time: "2:00 PM",
            type: "in-person",
            reason: "Follow-up consultation for cardiac health",
            status: "confirmed",
            cost: "₹15,000"
          },
          {
            id: "apt-002",
            doctor: "Dr. Michael Chen",
            specialty: "General Medicine",
            hospital: "Downtown Clinic",
            date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            time: "10:00 AM",
            type: "video",
            reason: "Annual checkup",
            status: "confirmed",
            cost: "₹12,000"
          }
        ];
        localStorage.setItem('demo.appointments', JSON.stringify(defaultAppointments));
        setAppointments(defaultAppointments);
        console.log('Initialized localStorage with default appointments');
      } else {
        // Refresh appointments from localStorage on mount
        const appointments = JSON.parse(stored);
        setAppointments(appointments);
        console.log('Refreshed appointments from localStorage on mount:', appointments);
      }
    } catch (error) {
      console.error('Error initializing appointments:', error);
    }
  }, []);

  // Handle new appointment from navigation state and auto-switch to appointments tab
  useEffect(() => {
    // Check if we just came from booking an appointment
    const hasNewAppointment = sessionStorage.getItem('justBookedAppointment');
    if (hasNewAppointment) {
      setActiveTab('appointments');
      sessionStorage.removeItem('justBookedAppointment');
      console.log('Auto-switched to appointments tab due to new booking');
      
      // Show success toast
      toast({
        title: "New Appointment Added!",
        description: "Your appointment has been successfully added to your upcoming appointments.",
      });
    }
  }, []);

  // Working demo functionality for Patient Dashboard
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

  const patientActions = {
    bookAppointment: (doctor) => {
      setSelectedDoctor(doctor);
      simulateProcessing(`Booking appointment with ${doctor?.name || 'doctor'}`);
    },
    cancelAppointment: () => simulateProcessing("Cancelling appointment"),
    rescheduleAppointment: () => simulateProcessing("Rescheduling appointment"),
    viewMedicalRecord: () => simulateProcessing("Loading medical records"),
    downloadReport: () => simulateProcessing("Downloading medical report"),
    payBill: () => simulateProcessing("Processing payment"),
    requestPrescription: () => simulateProcessing("Requesting prescription refill"),
    emergencyCall: () => simulateProcessing("Connecting to emergency services", 1000),
    updateProfile: () => simulateProcessing("Updating profile information"),
    uploadDocument: () => simulateProcessing("Uploading medical document"),
    chatWithDoctor: () => simulateProcessing("Connecting to doctor chat"),
    scheduleLabTest: () => simulateProcessing("Scheduling laboratory test"),
  };

  // Medication Schedule State
  const [medicationSchedule, setMedicationSchedule] = useState([
    { name: "Metformin", time: "8:00 AM", dosage: "500mg", taken: true },
    { name: "Lisinopril", time: "8:00 AM", dosage: "10mg", taken: true },
    { name: "Vitamin D", time: "2:00 PM", dosage: "1000 IU", taken: false },
    { name: "Omega-3", time: "6:00 PM", dosage: "1000mg", taken: false }
  ]);

  // Listen for localStorage changes to update notifications
  useEffect(() => {
    const handleStorageChange = () => {
      const storedNotifications = localStorage.getItem('demo.notifications');
      if (storedNotifications) {
        setNotifications(JSON.parse(storedNotifications));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Update notifications on component mount
  useEffect(() => {
    const storedNotifications = localStorage.getItem('demo.notifications');
    if (storedNotifications) {
      setNotifications(JSON.parse(storedNotifications));
    }
  }, []);

  // Handler function to mark medication as taken
  const handleTakeMedication = (index) => {
    setMedicationSchedule(prev => 
      prev.map((med, i) => 
        i === index ? { ...med, taken: true } : med
      )
    );
  };

  // Handler functions for quick actions
  const handleLabResultsClick = () => {
    setActiveTab("doctors");
  };

  const handleCallDoctorClick = () => {
    setActiveTab("doctors");
  };



  const handleDownloadRecordsClick = () => {
    setActiveTab("records");
  };

  // Search states
  const [dashboardVisitsSearch, setDashboardVisitsSearch] = useState("");
  const [recordsSearch, setRecordsSearch] = useState("");
  const [doctorsSearch, setDoctorsSearch] = useState("");
  const [labResultsSearch, setLabResultsSearch] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("");

  // Navigation handlers
  const handleProfileClick = () => {
    setActiveTab("profile");
  };

  const handleLogout = () => {
    localStorage.removeItem('demo.user');
    navigate("/login");
  };

  // Profile editing handlers
  const handleEditProfile = () => {
    setIsEditingProfile(true);
    setEditableProfile(patientProfile);
  };

  const handleSaveProfile = () => {
    setPatientProfile(editableProfile);
    setIsEditingProfile(false);
  };

  const handleCancelEdit = () => {
    setEditableProfile(patientProfile);
    setIsEditingProfile(false);
  };

  const handleProfileChange = (field: string, value: string) => {
    setEditableProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };





  // Additional data for missing cards

  const recentVisits = [
    {
      id: 1,
      doctor: "Dr. Sarah Johnson",
      specialty: "Cardiology",
      date: "Jan 15, 2024",
      summary: "Routine cardiac checkup - All parameters normal",
      hospital: "City Medical Center",
      cost: "$150"
    },
    {
      id: 2,
      doctor: "Dr. Michael Chen",
      specialty: "General Medicine",
      date: "Dec 20, 2023",
      summary: "Annual physical examination - Excellent health",
      hospital: "Downtown Clinic",
      cost: "$120"
    },
    {
      id: 3,
      doctor: "Dr. Emily Davis",
      specialty: "Dermatology",
      date: "Nov 10, 2023",
      summary: "Skin screening - No concerns found",
      hospital: "Skin Care Specialists",
      cost: "$95"
    }
  ];

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
              <p className="text-xs text-green-600">Patient Portal</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-3 overflow-y-auto">
          <div className="space-y-1">
            {[
              { id: "dashboard", label: "Dashboard", icon: Activity },
              { id: "ai-chatbot", label: "AI Chatbot", icon: Brain },
              { id: "records", label: "Medical Records", icon: FileText },
              { id: "doctors", label: "Doctors & Labs", icon: Stethoscope },
              { id: "appointments", label: "Appointments", icon: Calendar },
              { id: "payment", label: "Payment & Billing", icon: CreditCard },
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
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* User Profile in Sidebar */}
        <div className="p-3 border-t border-green-200">
          <button
            onClick={() => setActiveTab("profile")}
            className="w-full flex items-center gap-2 p-2 bg-green-50 rounded-lg hover:bg-green-100 transition-all duration-200 cursor-pointer"
          >
            <Avatar className="h-8 w-8 ring-2 ring-green-400/40">
              <AvatarImage src="/placeholder.svg" alt="Patient" />
              <AvatarFallback className="bg-gradient-to-br from-green-500 to-green-600 text-white font-bold text-sm">
                JD
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-left">
              <p className="font-semibold text-slate-800 text-sm">John Doe</p>
              <p className="text-xs text-green-600">Premium Member</p>
            </div>
          </button>
        </div>
      </div>

      {/* Main Content Area - Adjusted for fixed sidebar */}
      <div className="flex-1 flex flex-col ml-64">
        {/* AI Chatbot Tab Content */}
        {activeTab === "ai-chatbot" && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-white/95 to-blue-50/95 backdrop-blur-sm rounded-2xl p-8 border border-blue-200/60 shadow-2xl shadow-blue-500/10">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Brain className="h-10 w-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-slate-800 mb-4">AI Chatbot</h2>
                <p className="text-slate-600 font-medium mb-6">Your intelligent healthcare assistant is ready to help</p>
                <div className="bg-blue-50/80 rounded-xl p-6 border border-blue-200/60">
                  <p className="text-slate-700 text-lg">Coming Soon...</p>
                  <p className="text-slate-600 mt-2">The AI Chatbot feature is currently being developed to provide you with personalized health insights and assistance.</p>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Top Navigation Bar */}
        <header className="bg-white border-b border-green-200 shadow-sm">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  {activeTab === "dashboard" && "Health Dashboard"}
                  {activeTab === "ai-chatbot" && "AI Chatbot"}
                  {activeTab === "records" && "Medical Records"}
                  {activeTab === "doctors" && "Doctors & Labs"}
                  {activeTab === "appointments" && "Appointments"}
                  {activeTab === "payment" && "Payment & Billing"}
                  {activeTab === "profile" && "Profile & Settings"}
                  {activeTab === "help" && "Help & Support"}
                </h2>
                <p className="text-slate-600">Welcome back, John Doe (ID: P-2024-001)</p>
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
                              localStorage.removeItem('demo.notifications');
                              setNotifications([]);
                            }}
                            className="h-7 px-2 text-xs border-red-200 text-red-700 hover:bg-red-50"
                          >
                            Clear All
                          </Button>
                        )}
                      </div>
                      <div className="max-h-80 overflow-auto p-2">
                        {notifications.length === 0 ? (
                          <div className="p-6 text-center text-slate-500 text-sm">No notifications</div>
                        ) : (
                          notifications.map((n) => (
                            <div
                              key={n.id}
                              className={`p-3 mb-2 last:mb-0 rounded-md border ${
                                n.urgent
                                  ? 'bg-red-50 border-red-200'
                                  : n.type === 'appointment'
                                  ? 'bg-green-50 border-green-200'
                                  : 'bg-blue-50 border-blue-200'
                              }`}
                            >
                              <div className="flex items-start gap-2">
                                <div className={`mt-1 w-2 h-2 rounded-full ${n.urgent ? 'bg-red-500' : n.type === 'appointment' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-slate-800">{n.message}</p>
                                  <p className="text-xs text-slate-600 mt-0.5">{n.time}</p>
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
                        onClick={handleProfileClick}
                        className="hover:bg-green-100"
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
                {/* Quick Stats */}
                <div className="bg-white rounded-lg p-6 border border-green-200 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">3</div>
                      <div className="text-xs text-slate-600">Active Meds</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">1</div>
                      <div className="text-xs text-slate-600">Upcoming</div>
                    </div>
                  </div>
                </div>

                {/* Professional Health Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <HealthScoreChart 
                    overallScore={healthScoreData.overallScore}
                    categories={healthScoreData.categories}
                    title="Health Score Overview"
                    height={350}
                  />
                  <HealthMetricsChart 
                    data={healthMetricsData}
                    title="Vital Signs Trends"
                    height={350}
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 mb-8">
                  <AppointmentTrendsChart 
                    data={appointmentTrendsData}
                    title="Appointment History"
                    height={300}
                    type="bar"
                  />
                </div>

                {/* Enhanced Health Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="border border-green-200/60 shadow-xl bg-white hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-500 hover:scale-[1.02] cursor-pointer group">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="p-4 bg-gradient-to-br from-green-500 to-green-600 rounded-xl group-hover:scale-105 transition-transform shadow-lg">
                          <Heart className="h-7 w-7 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Heart Rate</p>
                          <p className="text-3xl font-bold text-slate-800 mb-1">72 <span className="text-lg text-slate-600">BPM</span></p>
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-semibold text-green-600">Normal Range</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-green-200/60 shadow-xl bg-white hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-500 hover:scale-[1.02] cursor-pointer group">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="p-4 bg-gradient-to-br from-green-500 to-green-600 rounded-xl group-hover:scale-105 transition-transform shadow-lg">
                          <Activity className="h-7 w-7 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Blood Pressure</p>
                          <p className="text-3xl font-bold text-slate-800 mb-1">120/80 <span className="text-lg text-slate-600">mmHg</span></p>
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-semibold text-green-600">Optimal</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-green-200/60 shadow-xl bg-white hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-500 hover:scale-[1.02] cursor-pointer group">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="p-4 bg-gradient-to-br from-green-500 to-green-600 rounded-xl group-hover:scale-105 transition-transform shadow-lg">
                          <Calendar className="h-7 w-7 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Next Appointment</p>
                          <p className="text-2xl font-bold text-slate-800 mb-1">Tomorrow</p>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-semibold text-green-600">2:00 PM</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Additional Dashboard Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                  {/* Medication Schedule Card */}
                  <Card className="border border-green-200/60 shadow-xl bg-white hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-500">
                    <CardHeader className="bg-gradient-to-r from-green-100/80 to-green-50/80 border-b border-green-200/60">
                      <CardTitle className="flex items-center gap-2">
                        <Pill className="h-5 w-5 text-green-600" />
                        Today's Medication Schedule
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-3">
                        {medicationSchedule.map((med, index) => (
                          <div key={index} className={`flex items-center justify-between p-3 rounded-lg border ${
                            med.taken ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'
                          }`}>
                            <div className="flex items-center gap-3">
                              <div className={`w-3 h-3 rounded-full ${med.taken ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                              <div>
                                <p className="font-semibold text-slate-800">{med.name}</p>
                                <p className="text-sm text-slate-600">{med.dosage} at {med.time}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {med.taken ? (
                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                              ) : (
                                <Button 
                                  size="sm" 
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                  onClick={() => handleTakeMedication(index)}
                                >
                                  Take Now
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quick Actions moved up next to Medication */}
                  {/* Quick Actions Card */}
                  <Card className="border border-green-200/60 shadow-xl bg-white hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-500">
                    <CardHeader className="bg-gradient-to-r from-green-100/80 to-green-50/80 border-b border-green-200/60">
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-green-600" />
                        Quick Actions
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          className="flex flex-col items-center justify-center gap-2 h-20 bg-green-100 hover:bg-green-200 text-green-700 border border-green-300 hover:scale-[1.01] transition-all duration-300"
                          onClick={() => patientActions.bookAppointment(null)}
                          disabled={isProcessing}
                        >
                          <Calendar className="h-5 w-5" />
                          <span className="text-sm">Book Appointment</span>
                        </Button>
                        <Button 
                          className="flex flex-col items-center justify-center gap-2 h-20 bg-blue-100 hover:bg-blue-200 text-blue-700 border border-blue-300 hover:scale-[1.01] transition-all duration-300"
                          onClick={handleLabResultsClick}
                        >
                          <TestTube className="h-5 w-5" />
                          <span className="text-sm">Lab Results</span>
                        </Button>
                        <Button className="flex flex-col items-center justify-center gap-2 h-20 bg-green-100 hover:bg-green-200 text-green-700 border border-green-300 hover:scale-[1.01] transition-all duration-300">
                          <Pill className="h-5 w-5" />
                          <span className="text-sm">Refill Prescription</span>
                        </Button>
                        <Button
                          onClick={() => setActiveTab("ai-chatbot")}
                          className="flex flex-col items-center justify-center gap-2 h-20 bg-blue-100 hover:bg-blue-200 text-blue-700 border border-blue-300 hover:scale-[1.01] transition-all duration-300"
                        >
                          <Brain className="h-5 w-5" />
                          <span className="text-sm">AI Chatbot</span>
                        </Button>
                        <Button 
                          className="flex flex-col items-center justify-center gap-2 h-20 bg-blue-100 hover:bg-blue-200 text-blue-700 border border-blue-300 hover:scale-[1.01] transition-all duration-300"
                          onClick={handleCallDoctorClick}
                        >
                          <Phone className="h-5 w-5" />
                          <span className="text-sm">Call Doctor</span>
                        </Button>
                        <Button 
                          className="flex flex-col items-center justify-center gap-2 h-20 bg-green-100 hover:bg-green-200 text-green-700 border border-green-300 hover:scale-[1.01] transition-all duration-300"
                          onClick={handleDownloadRecordsClick}
                        >
                          <Download className="h-5 w-5" />
                          <span className="text-sm">Download Records</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                  {/* Recent Medical Visits Card */}
                  <Card className="border border-green-200/60 shadow-xl bg-white hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-500 lg:col-span-2">
                    <CardHeader className="bg-gradient-to-r from-green-100/80 to-green-50/80 border-b border-green-200/60">
                      <CardTitle className="flex items-center gap-2">
                        <History className="h-5 w-5 text-green-600" />
                        Recent Medical Visits
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      {/* Search Input */}
                      <div className="mb-4">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <input
                            type="text"
                            placeholder="Search by doctor name..."
                            value={dashboardVisitsSearch}
                            onChange={(e) => setDashboardVisitsSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        {recentVisits
                          .filter(visit =>
                            visit.doctor.toLowerCase().includes(dashboardVisitsSearch.toLowerCase())
                          )
                          .slice(0, 3)
                          .map((visit) => (
                            <div key={visit.id} className="p-3 bg-green-50 rounded-lg border border-green-200">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-semibold text-slate-800">{visit.doctor}</h4>
                                  <p className="text-sm text-green-600">{visit.specialty}</p>
                                  <p className="text-sm text-slate-600">{visit.date}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-semibold text-slate-800">{visit.cost}</p>
                                                                  <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="mt-1 border-green-200 text-green-700 hover:bg-green-50"
                                  onClick={() => navigate("/treatment-report")}
                                >
                                  <Eye className="h-3 w-3 mr-1" />
                                  View
                                </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        {recentVisits.filter(visit =>
                          visit.doctor.toLowerCase().includes(dashboardVisitsSearch.toLowerCase())
                        ).length === 0 && dashboardVisitsSearch && (
                          <div className="text-center py-4 text-slate-500">
                            No visits found for "{dashboardVisitsSearch}"
                          </div>
                        )}
                      </div>
                      <Button variant="outline" className="w-full mt-4 border-green-200 text-green-700 hover:bg-green-50">
                        View All Visits
                      </Button>
                    </CardContent>
                  </Card>

                  
                </div>
              </div>
            )}

            {/* Payment Tab Content */}
            {activeTab === "payment" && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-800">Payment & Billing</h3>

                {/* Payment Summary & Analytics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <Card className="border border-green-200/60 shadow-xl bg-gradient-to-br from-white/95 to-green-50/95">
                    <CardHeader className="bg-gradient-to-r from-green-100/80 to-green-50/80 border-b border-green-200/60">
                      <CardTitle className="flex items-center gap-2">
                        <Wallet className="h-5 w-5 text-green-600" />
                        Payment Summary & Analytics
                      </CardTitle>
                      <CardDescription className="text-slate-600">
                        Comprehensive overview of your financial health metrics
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                          <span className="font-medium text-slate-700">Total Paid This Year</span>
                          <span className="font-bold text-green-600 text-lg">₹2,45,000</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-green-200">
                          <span className="font-medium text-slate-700">Outstanding Balance</span>
                          <span className="font-bold text-slate-800 text-lg">₹12,500</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                          <span className="font-medium text-slate-700">Next Payment Due</span>
                          <span className="font-bold text-green-600 text-lg">₹8,500</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                          <span className="font-medium text-slate-700">Average Monthly Cost</span>
                          <span className="font-bold text-blue-600 text-lg">₹20,400</span>
                        </div>
                      </div>

                      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-2">💡 Financial Insights:</h4>
                        <ul className="text-sm text-blue-700 space-y-1">
                          <li>• Your healthcare spending is 15% below average</li>
                          <li>• Payment completion rate: 98.5% (Excellent!)</li>
                          <li>• Recommended budget: $250/month for healthcare</li>
                          <li>• Insurance coverage: 85% of total costs</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Current Subscription Plan Card */}
                  <Card className="border border-green-200/60 shadow-xl bg-gradient-to-br from-white/95 to-green-50/95">
                    <CardHeader className="bg-gradient-to-r from-green-100/80 to-green-50/80 border-b border-green-200/60">
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-green-600" />
                        Current Subscription Plan
                      </CardTitle>
                      <CardDescription className="text-slate-600">
                        Your active healthcare plan details and benefits
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                          <h3 className="text-2xl font-bold text-green-700 mb-1">Premium Health Plan</h3>
                          <p className="text-green-600 font-semibold">Active Since: January 2024</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-3 bg-white rounded-lg border border-green-200">
                            <div className="text-lg font-bold text-slate-800">₹8,500</div>
                            <div className="text-sm text-slate-600">Monthly Fee</div>
                          </div>
                          <div className="text-center p-3 bg-white rounded-lg border border-green-200">
                            <div className="text-lg font-bold text-green-600">85%</div>
                            <div className="text-sm text-slate-600">Coverage</div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-semibold text-slate-800">Plan Benefits:</h4>
                          <div className="space-y-1 text-sm text-slate-700">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                              <span>Unlimited doctor consultations</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                              <span>Free annual health checkup</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                              <span>24/7 MediVo AI support</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                              <span>Prescription delivery service</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                              <span>Emergency care coverage</span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold text-blue-800">Next Billing Date</h4>
                              <p className="text-sm text-blue-700">February 15, 2024</p>
                            </div>
                            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                              Manage Plan
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Available Subscriptions Card */}
                <Card className="border border-green-200/60 shadow-xl bg-gradient-to-br from-white/95 to-green-50/95 mt-6">
                  <CardHeader className="bg-gradient-to-r from-green-100/80 to-green-50/80 border-b border-green-200/60">
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-green-600" />
                      Available Subscription Plans
                    </CardTitle>
                    <CardDescription className="text-slate-600">
                      Upgrade or change your healthcare plan
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Basic Plan */}
                      <div className="p-4 border border-gray-200 rounded-lg bg-white">
                        <div className="text-center mb-4">
                          <h3 className="text-lg font-bold text-slate-800">Basic Plan</h3>
                          <p className="text-2xl font-bold text-slate-600 mt-2">₹4,500<span className="text-sm">/month</span></p>
                        </div>
                        <ul className="space-y-2 text-sm text-slate-600 mb-4">
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <span>Basic consultations</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <span>Emergency care</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <span>Basic lab tests</span>
                          </li>
                        </ul>
                        <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50">
                          Select Plan
                        </Button>
                      </div>

                      {/* Premium Plan - Current */}
                      <div className="p-4 border-2 border-green-500 rounded-lg bg-green-50 relative">
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <Badge className="bg-green-600 text-white">Current Plan</Badge>
                        </div>
                        <div className="text-center mb-4 mt-2">
                          <h3 className="text-lg font-bold text-green-800">Premium Plan</h3>
                          <p className="text-2xl font-bold text-green-600 mt-2">₹8,500<span className="text-sm">/month</span></p>
                        </div>
                        <ul className="space-y-2 text-sm text-slate-700 mb-4">
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <span>Unlimited consultations</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <span>24/7 MediVo AI support</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <span>Free annual checkup</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <span>Prescription delivery</span>
                          </li>
                        </ul>
                        <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                          Current Plan
                        </Button>
                      </div>

                      {/* Elite Plan */}
                      <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                        <div className="text-center mb-4">
                          <h3 className="text-lg font-bold text-blue-800">Elite Plan</h3>
                          <p className="text-2xl font-bold text-blue-600 mt-2">₹15,000<span className="text-sm">/month</span></p>
                        </div>
                        <ul className="space-y-2 text-sm text-slate-700 mb-4">
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-blue-600" />
                            <span>Everything in Premium</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-blue-600" />
                            <span>Specialist consultations</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-blue-600" />
                            <span>Advanced diagnostics</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-blue-600" />
                            <span>Personal health coach</span>
                          </li>
                        </ul>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                          Upgrade Now
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Profile Tab Content */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-slate-800">Profile & Settings</h3>
                  {!isEditingProfile ? (
                    <Button onClick={handleEditProfile} className="bg-green-600 hover:bg-green-700 text-white">
                      <Settings className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button onClick={handleSaveProfile} className="bg-green-600 hover:bg-green-700 text-white">
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                      <Button onClick={handleCancelEdit} variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 mb-8">
                  <div className="xl:col-span-3">
                    <Card className="border border-green-200/60 shadow-xl bg-gradient-to-br from-white/95 to-green-50/95">
                      <CardHeader className="bg-gradient-to-r from-green-100/80 to-green-50/80 border-b border-green-200/60">
                        <CardTitle className="flex items-center gap-2">
                          <User className="h-5 w-5 text-green-600" />
                          Patient Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-6 mb-6">
                          <Avatar className="h-20 w-20 ring-4 ring-green-400/40 shadow-lg shadow-green-500/20">
                            <AvatarImage src="/placeholder.svg" alt="Patient" />
                            <AvatarFallback className="bg-gradient-to-br from-green-500 to-green-600 text-white font-bold text-2xl">
                              {(isEditingProfile ? editableProfile.name : patientProfile.name).split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            {isEditingProfile ? (
                              <div className="space-y-3">
                                <input
                                  type="text"
                                  value={editableProfile.name}
                                  onChange={(e) => handleProfileChange('name', e.target.value)}
                                  className="text-2xl font-bold text-slate-800 bg-white border border-green-200 rounded-lg px-3 py-2 w-full"
                                  placeholder="Full Name"
                                />
                                <p className="text-green-600 font-semibold">Patient ID: {patientProfile.patientId}</p>
                                <Badge className="bg-green-100 text-green-700 border-green-200">Premium Member</Badge>
                              </div>
                            ) : (
                              <div>
                                <h3 className="text-2xl font-bold text-slate-800 mb-2">{patientProfile.name}</h3>
                                <p className="text-green-600 font-semibold mb-1">Patient ID: {patientProfile.patientId}</p>
                                <Badge className="bg-green-100 text-green-700 border-green-200">Premium Member</Badge>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-semibold text-slate-700 mb-2 block">Phone Number</label>
                              {isEditingProfile ? (
                                <input
                                  type="tel"
                                  value={editableProfile.phone}
                                  onChange={(e) => handleProfileChange('phone', e.target.value)}
                                  className="w-full px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                  placeholder="Phone Number"
                                />
                              ) : (
                                <div className="flex items-center gap-2">
                                  <Phone className="h-4 w-4 text-green-600" />
                                  <span className="text-sm text-slate-600">{patientProfile.phone}</span>
                                </div>
                              )}
                            </div>

                            <div>
                              <label className="text-sm font-semibold text-slate-700 mb-2 block">Email Address</label>
                              {isEditingProfile ? (
                                <input
                                  type="email"
                                  value={editableProfile.email}
                                  onChange={(e) => handleProfileChange('email', e.target.value)}
                                  className="w-full px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                  placeholder="Email Address"
                                />
                              ) : (
                                <div className="flex items-center gap-2">
                                  <Mail className="h-4 w-4 text-green-600" />
                                  <span className="text-sm text-slate-600">{patientProfile.email}</span>
                                </div>
                              )}
                            </div>

                            <div>
                              <label className="text-sm font-semibold text-slate-700 mb-2 block">Address</label>
                              {isEditingProfile ? (
                                <textarea
                                  value={editableProfile.address}
                                  onChange={(e) => handleProfileChange('address', e.target.value)}
                                  className="w-full px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                  placeholder="Address"
                                  rows={2}
                                />
                              ) : (
                                <div className="flex items-start gap-2">
                                  <MapPin className="h-4 w-4 text-green-600 mt-0.5" />
                                  <span className="text-sm text-slate-600">{patientProfile.address}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-semibold text-slate-700 mb-2 block">Insurance Information</label>
                              {isEditingProfile ? (
                                <textarea
                                  value={editableProfile.insurance}
                                  onChange={(e) => handleProfileChange('insurance', e.target.value)}
                                  className="w-full px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                  placeholder="Insurance Information"
                                  rows={2}
                                />
                              ) : (
                                <div className="flex items-start gap-2">
                                  <Shield className="h-4 w-4 text-green-600 mt-0.5" />
                                  <span className="text-sm text-slate-600">{patientProfile.insurance}</span>
                                </div>
                              )}
                            </div>

                            <div>
                              <label className="text-sm font-semibold text-slate-700 mb-2 block">Emergency Contact</label>
                              {isEditingProfile ? (
                                <input
                                  type="text"
                                  value={editableProfile.emergencyContact}
                                  onChange={(e) => handleProfileChange('emergencyContact', e.target.value)}
                                  className="w-full px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                  placeholder="Emergency Contact"
                                />
                              ) : (
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4 text-green-600" />
                                  <span className="text-sm text-slate-600">{patientProfile.emergencyContact}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="xl:col-span-2">
                    <div className="border border-green-200 rounded-lg p-4 bg-white">
                      <h3 className="text-lg font-semibold mb-4">Current Health Score</h3>
                      <div className="h-[400px] flex items-center justify-center bg-green-50 rounded-lg">
                        <div className="text-center">
                          <div className="text-6xl font-bold text-green-600 mb-4">87%</div>
                          <p className="text-green-700 text-lg mb-6">Excellent Health Status</p>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div className="text-center p-3 bg-white rounded-lg">
                              <div className="font-bold text-green-600">92%</div>
                              <div>Mental Health</div>
                            </div>
                            <div className="text-center p-3 bg-white rounded-lg">
                              <div className="font-bold text-green-600">88%</div>
                              <div>Nutrition</div>
                            </div>
                            <div className="text-center p-3 bg-white rounded-lg">
                              <div className="font-bold text-green-600">82%</div>
                              <div>Physical Activity</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Medical Records Tab Content */}
            {activeTab === "records" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-slate-800">Medical Records</h3>
                </div>

                {/* Professional Medical Records Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-8">
                  <HealthMetricsChart 
                    data={healthMetricsData}
                    title="Health Metrics Trends"
                    height={300}
                  />
                </div>

                <Card className="border border-green-200/60 shadow-xl bg-gradient-to-br from-white/95 to-green-50/95">
                  <CardHeader className="bg-gradient-to-r from-green-100/80 to-green-50/80 border-b border-green-200/60">
                    <CardTitle className="flex items-center gap-2">
                      <History className="h-5 w-5 text-green-600" />
                      Treatment History
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    {/* Search and Filter Controls */}
                    <div className="mb-6 space-y-4">
                      {/* Search Input */}
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Search treatment history by doctor, specialty, or summary..."
                          value={recordsSearch}
                          onChange={(e) => setRecordsSearch(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>

                      {/* Specialty Filter */}
                      <div className="flex items-center gap-3">
                        <Filter className="h-4 w-4 text-slate-600" />
                        <Select value={specialtyFilter || 'all'} onValueChange={(v) => setSpecialtyFilter(v === 'all' ? '' : v)}>
                          <SelectTrigger className="w-[220px]">
                            <SelectValue placeholder="All Specialties" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Specialties</SelectItem>
                            <SelectItem value="Cardiology">Cardiology</SelectItem>
                            <SelectItem value="General Medicine">General Medicine</SelectItem>
                            <SelectItem value="Dermatology">Dermatology</SelectItem>
                            <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                            <SelectItem value="Neurology">Neurology</SelectItem>
                          </SelectContent>
                        </Select>
                        {specialtyFilter && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSpecialtyFilter("")}
                            className="text-slate-600 hover:text-slate-800"
                          >
                            <X className="h-3 w-3 mr-1" />
                            Clear Filter
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      {[
                        {
                          id: 1,
                          doctor: "Dr. Sarah Johnson",
                          specialty: "Cardiology",
                          date: "Jan 15, 2024",
                          summary: "Routine cardiac checkup - All parameters normal",
                          hospital: "City Medical Center",
                          cost: "₹15,000"
                        },
                        {
                          id: 2,
                          doctor: "Dr. Michael Chen",
                          specialty: "General Medicine",
                          date: "Dec 20, 2023",
                          summary: "Annual physical examination - Excellent health",
                          hospital: "Downtown Clinic",
                          cost: "₹12,000"
                        },
                        {
                          id: 3,
                          doctor: "Dr. Emily Davis",
                          specialty: "Dermatology",
                          date: "Nov 10, 2023",
                          summary: "Skin screening - No concerns found",
                          hospital: "Skin Care Specialists",
                          cost: "₹9,500"
                        }
                      ]
                      .filter(visit => {
                        const matchesSearch = visit.doctor.toLowerCase().includes(recordsSearch.toLowerCase()) ||
                                            visit.specialty.toLowerCase().includes(recordsSearch.toLowerCase()) ||
                                            visit.summary.toLowerCase().includes(recordsSearch.toLowerCase());
                        const matchesSpecialty = !specialtyFilter || visit.specialty === specialtyFilter;
                        return matchesSearch && matchesSpecialty;
                      })
                      .map((visit) => (
                        <div key={visit.id} className="p-4 border border-green-200 rounded-lg hover:bg-green-50 transition-all duration-300 hover:shadow-md">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="font-bold text-slate-800">{visit.doctor}</h4>
                                <Badge variant="outline" className="border-green-200 text-green-700">{visit.specialty}</Badge>
                                <span className="text-sm text-slate-600">{visit.date}</span>
                              </div>
                              <p className="text-slate-700 mb-2">{visit.summary}</p>
                              <div className="flex items-center gap-4 text-sm text-slate-600">
                                <span>📍 {visit.hospital}</span>
                                <span>💰 {visit.cost}</span>
                              </div>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex items-center gap-2 border-green-200 text-green-700 hover:bg-green-50"
                              onClick={() => navigate("/treatment-report")}
                            >
                              <Eye className="h-4 w-4" />
                              View Details
                            </Button>
                          </div>
                        </div>
                      ))}
                      {[
                        {
                          id: 1,
                          doctor: "Dr. Sarah Johnson",
                          specialty: "Cardiology",
                          date: "Jan 15, 2024",
                          summary: "Routine cardiac checkup - All parameters normal",
                          hospital: "City Medical Center",
                          cost: "₹15,000"
                        },
                        {
                          id: 2,
                          doctor: "Dr. Michael Chen",
                          specialty: "General Medicine",
                          date: "Dec 20, 2023",
                          summary: "Annual physical examination - Excellent health",
                          hospital: "Downtown Clinic",
                          cost: "₹12,000"
                        },
                        {
                          id: 3,
                          doctor: "Dr. Emily Davis",
                          specialty: "Dermatology",
                          date: "Nov 10, 2023",
                          summary: "Skin screening - No concerns found",
                          hospital: "Skin Care Specialists",
                          cost: "₹9,500"
                        }
                      ].filter(visit => {
                        const matchesSearch = visit.doctor.toLowerCase().includes(recordsSearch.toLowerCase()) ||
                                            visit.specialty.toLowerCase().includes(recordsSearch.toLowerCase()) ||
                                            visit.summary.toLowerCase().includes(recordsSearch.toLowerCase());
                        const matchesSpecialty = !specialtyFilter || visit.specialty === specialtyFilter;
                        return matchesSearch && matchesSpecialty;
                      }).length === 0 && (recordsSearch || specialtyFilter) && (
                        <div className="text-center py-8 text-slate-500">
                          <Search className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                          <p>No treatment history found</p>
                          {recordsSearch && <p className="text-sm mt-1">Search: "{recordsSearch}"</p>}
                          {specialtyFilter && <p className="text-sm mt-1">Specialty: {specialtyFilter}</p>}
                          <p className="text-sm mt-2">Try adjusting your search or filter criteria</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}



            {/* Doctors & Labs Tab Content */}
            {activeTab === "doctors" && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-800">Doctors & Labs</h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* My Doctors */}
                  <Card className="border border-green-200/60 shadow-xl bg-gradient-to-br from-white/95 to-green-50/95">
                    <CardHeader className="bg-gradient-to-r from-green-100/80 to-green-50/80 border-b border-green-200/60">
                      <CardTitle className="flex items-center gap-2">
                        <Stethoscope className="h-5 w-5 text-green-600" />
                        My Doctors
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      {/* Search Input for Doctors */}
                      <div className="mb-4">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <input
                            type="text"
                            placeholder="Search doctors by name or specialty..."
                            value={doctorsSearch}
                            onChange={(e) => setDoctorsSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        {[
                          {
                            name: "Dr. Sarah Johnson",
                            specialty: "Cardiologist",
                            hospital: "City Medical Center",
                            phone: "+1 (555) 123-4567",
                            nextAppointment: "Feb 15, 2024"
                          },
                          {
                            name: "Dr. Michael Chen",
                            specialty: "General Practitioner",
                            hospital: "Downtown Clinic",
                            phone: "+1 (555) 234-5678",
                            nextAppointment: "Mar 1, 2024"
                          },
                          {
                            name: "Dr. Emily Davis",
                            specialty: "Dermatologist",
                            hospital: "Skin Care Specialists",
                            phone: "+1 (555) 345-6789",
                            nextAppointment: "Apr 10, 2024"
                          }
                        ]
                        .filter(doctor =>
                          doctor.name.toLowerCase().includes(doctorsSearch.toLowerCase()) ||
                          doctor.specialty.toLowerCase().includes(doctorsSearch.toLowerCase())
                        )
                        .map((doctor, index) => (
                          <div key={index} className="p-4 bg-white rounded-lg border border-green-200 hover:shadow-md transition-all duration-300">
                            <div className="flex items-center gap-4">
                              <Avatar className="h-12 w-12 ring-2 ring-green-400/40">
                                <AvatarFallback className="bg-gradient-to-br from-green-500 to-green-600 text-white font-bold">
                                  {doctor.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <h4 className="font-bold text-slate-800">{doctor.name}</h4>
                                <p className="text-green-600 font-semibold">{doctor.specialty}</p>
                                <p className="text-sm text-slate-600">{doctor.hospital}</p>
                                <p className="text-sm text-slate-600">Next: {doctor.nextAppointment}</p>
                              </div>
                              <div className="flex flex-col gap-2">
                                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                                  <Phone className="h-4 w-4 mr-1" />
                                  Call
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="border-green-200 text-green-700 hover:bg-green-50"
                                  onClick={() => navigate("/appointment-booking")}
                                >
                                  <Calendar className="h-4 w-4 mr-1" />
                                  Book
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                        {[
                          {
                            name: "Dr. Sarah Johnson",
                            specialty: "Cardiologist",
                            hospital: "City Medical Center",
                            phone: "+1 (555) 123-4567",
                            nextAppointment: "Feb 15, 2024"
                          },
                          {
                            name: "Dr. Michael Chen",
                            specialty: "General Practitioner",
                            hospital: "Downtown Clinic",
                            phone: "+1 (555) 234-5678",
                            nextAppointment: "Mar 1, 2024"
                          },
                          {
                            name: "Dr. Emily Davis",
                            specialty: "Dermatologist",
                            hospital: "Skin Care Specialists",
                            phone: "+1 (555) 345-6789",
                            nextAppointment: "Apr 10, 2024"
                          }
                        ].filter(doctor =>
                          doctor.name.toLowerCase().includes(doctorsSearch.toLowerCase()) ||
                          doctor.specialty.toLowerCase().includes(doctorsSearch.toLowerCase())
                        ).length === 0 && doctorsSearch && (
                          <div className="text-center py-4 text-slate-500">
                            <Search className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                            <p>No doctors found for "{doctorsSearch}"</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Lab Results */}
                  <Card className="border border-green-200/60 shadow-xl bg-gradient-to-br from-white/95 to-green-50/95">
                    <CardHeader className="bg-gradient-to-r from-green-100/80 to-green-50/80 border-b border-green-200/60">
                      <CardTitle className="flex items-center gap-2">
                        <TestTube className="h-5 w-5 text-green-600" />
                        Recent Lab Results
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      {/* Search Input for Lab Results */}
                      <div className="mb-4">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <input
                            type="text"
                            placeholder="Search lab results by test name or doctor..."
                            value={labResultsSearch}
                            onChange={(e) => setLabResultsSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        {[
                          {
                            test: "Complete Blood Count",
                            date: "Jan 20, 2024",
                            status: "Normal",
                            doctor: "Dr. Sarah Johnson"
                          },
                          {
                            test: "Lipid Panel",
                            date: "Jan 15, 2024",
                            status: "Excellent",
                            doctor: "Dr. Sarah Johnson"
                          },
                          {
                            test: "Thyroid Function",
                            date: "Dec 28, 2023",
                            status: "Normal",
                            doctor: "Dr. Michael Chen"
                          },
                          {
                            test: "Vitamin D Level",
                            date: "Dec 15, 2023",
                            status: "Low",
                            doctor: "Dr. Michael Chen"
                          }
                        ]
                        .filter(result =>
                          result.test.toLowerCase().includes(labResultsSearch.toLowerCase()) ||
                          result.doctor.toLowerCase().includes(labResultsSearch.toLowerCase())
                        )
                        .map((result, index) => (
                          <div key={index} className="p-4 bg-white rounded-lg border border-green-200 hover:shadow-md transition-all duration-300">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-bold text-slate-800">{result.test}</h4>
                                <p className="text-sm text-slate-600">By {result.doctor}</p>
                                <p className="text-sm text-slate-600">{result.date}</p>
                              </div>
                              <div className="text-right">
                                <Badge
                                  className={`${
                                    result.status === "Normal" || result.status === "Excellent"
                                      ? "bg-green-100 text-green-700 border-green-200"
                                      : "bg-yellow-100 text-yellow-700 border-yellow-200"
                                  }`}
                                >
                                  {result.status}
                                </Badge>
                                <Button size="sm" variant="outline" className="mt-2 border-green-200 text-green-700 hover:bg-green-50">
                                  <Download className="h-4 w-4 mr-1" />
                                  Download
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                        {[
                          {
                            test: "Complete Blood Count",
                            date: "Jan 20, 2024",
                            status: "Normal",
                            doctor: "Dr. Sarah Johnson"
                          },
                          {
                            test: "Lipid Panel",
                            date: "Jan 15, 2024",
                            status: "Excellent",
                            doctor: "Dr. Sarah Johnson"
                          },
                          {
                            test: "Thyroid Function",
                            date: "Dec 28, 2023",
                            status: "Normal",
                            doctor: "Dr. Michael Chen"
                          },
                          {
                            test: "Vitamin D Level",
                            date: "Dec 15, 2023",
                            status: "Low",
                            doctor: "Dr. Michael Chen"
                          }
                        ].filter(result =>
                          result.test.toLowerCase().includes(labResultsSearch.toLowerCase()) ||
                          result.doctor.toLowerCase().includes(labResultsSearch.toLowerCase())
                        ).length === 0 && labResultsSearch && (
                          <div className="text-center py-4 text-slate-500">
                            <Search className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                            <p>No lab results found for "{labResultsSearch}"</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Appointments Tab Content */}
            {activeTab === "appointments" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-slate-800">My Appointments</h3>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => navigate("/appointments")}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      View All Appointments
                    </Button>
                  </div>
                </div>

                

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Upcoming Appointments */}
                  <Card className="border border-green-200/60 shadow-xl bg-gradient-to-br from-white/95 to-green-50/95">
                    <CardHeader className="bg-gradient-to-r from-green-100/80 to-green-50/80 border-b border-green-200/60">
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-green-600" />
                        Upcoming Appointments
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {upcomingAppointments.length > 0 ? (
                          upcomingAppointments.slice(0, 3).map((apt) => (
                            <div key={apt.id} className="p-3 bg-white rounded-lg border border-green-200">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-semibold text-slate-800">{apt.doctor}</h4>
                                  <p className="text-sm text-green-600">{apt.specialty}</p>
                                  <p className="text-sm text-slate-600">{new Date(apt.date).toLocaleDateString()} at {apt.time}</p>
                                </div>
                                <div className="text-right">
                                  <Badge className="bg-green-100 text-green-700 border-green-200">
                                    {apt.type === "video" ? "Video Call" : apt.type === "phone" ? "Phone Call" : "In-Person"}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8 text-slate-500">
                            <Calendar className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                            <p>No upcoming appointments</p>
                            <p className="text-sm">Book an appointment to get started</p>
                          </div>
                        )}
                      </div>
                      <Button 
                        variant="outline" 
                        className="w-full mt-4 border-green-200 text-green-700 hover:bg-green-50"
                        onClick={() => navigate("/appointments")}
                      >
                        View All Upcoming
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Recent Completed */}
                  <Card className="border border-green-200/60 shadow-xl bg-gradient-to-br from-white/95 to-green-50/95">
                    <CardHeader className="bg-gradient-to-r from-green-100/80 to-green-50/80 border-b border-green-200/60">
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        Recent Completed
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {completedAppointments.length > 0 ? (
                          completedAppointments.slice(0, 3).map((apt) => (
                            <div key={apt.id} className="p-3 bg-white rounded-lg border border-green-200">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-semibold text-slate-800">{apt.doctor}</h4>
                                  <p className="text-sm text-green-600">{apt.specialty}</p>
                                  <p className="text-sm text-slate-600">{new Date(apt.date).toLocaleDateString()}</p>
                                </div>
                                <div className="text-right">
                                  <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                                    Completed
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8 text-slate-500">
                            <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                            <p>No completed appointments</p>
                            <p className="text-sm">Your completed visits will appear here</p>
                          </div>
                        )}
                      </div>
                      <Button 
                        variant="outline" 
                        className="w-full mt-4 border-green-200 text-green-700 hover:bg-green-50"
                        onClick={() => navigate("/appointments")}
                      >
                        View All Previous
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Help & Support Tab Content */}
            {activeTab === "help" && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-800">Help & Support</h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Contact Support */}
                  <Card className="border border-green-200/60 shadow-xl bg-gradient-to-br from-white/95 to-green-50/95">
                    <CardHeader className="bg-gradient-to-r from-green-100/80 to-green-50/80 border-b border-green-200/60">
                      <CardTitle className="flex items-center gap-2">
                        <HelpCircle className="h-5 w-5 text-green-600" />
                        Contact Support
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <Button className="w-full justify-start bg-green-100 hover:bg-green-200 text-green-700 border border-green-300">
                          <Phone className="h-4 w-4 mr-2" />
                          Call Support: +1 (555) MEDIVO
                        </Button>
                        <Button className="w-full justify-start bg-blue-100 hover:bg-blue-200 text-blue-700 border border-blue-300">
                          <Mail className="h-4 w-4 mr-2" />
                          Email: support@medivoice.com
                        </Button>
                        <Button className="w-full justify-start bg-green-100 hover:bg-green-200 text-green-700 border border-green-300">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Live Chat (24/7)
                        </Button>
                        <Button className="w-full justify-start bg-blue-100 hover:bg-blue-200 text-blue-700 border border-blue-300">
                          <Zap className="h-4 w-4 mr-2" />
                          Ask MediVo AI
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* FAQ */}
                  <Card className="border border-green-200/60 shadow-xl bg-gradient-to-br from-white/95 to-green-50/95">
                    <CardHeader className="bg-gradient-to-r from-green-100/80 to-green-50/80 border-b border-green-200/60">
                      <CardTitle className="flex items-center gap-2">
                        <HelpCircle className="h-5 w-5 text-green-600" />
                        Frequently Asked Questions
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {[
                          {
                            question: "How do I schedule an appointment?",
                            answer: "You can schedule appointments through the Doctors & Labs section or by calling your doctor directly."
                          },
                          {
                            question: "How do I access my lab results?",
                            answer: "Lab results are available in the Doctors & Labs section once they're processed by your healthcare provider."
                          },
                          {
                            question: "How do I update my payment information?",
                            answer: "Go to Payment & Billing section and click on 'Manage Plan' to update your payment details."
                          },
                          {
                            question: "How do I contact my doctor?",
                            answer: "You can call your doctor directly using the contact information in the Doctors & Labs section."
                          }
                        ].map((faq, index) => (
                          <div key={index} className="p-4 bg-white rounded-lg border border-green-200">
                            <h4 className="font-bold text-slate-800 mb-2">{faq.question}</h4>
                            <p className="text-sm text-slate-600">{faq.answer}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
