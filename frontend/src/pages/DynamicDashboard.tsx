import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import AppointmentBookingModal from "@/components/AppointmentBookingModal";
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
  MapPin,
  UserCheck,
  Eye,
  History,
  Wallet,
  Lock,
  Smartphone,
  X,
  Plus,
  Edit,
  ShoppingCart,
  IndianRupee,
  Trash2,
  Brain,
  Send,
  Loader2,
  Mic,
  Image,
  Paperclip,
} from "lucide-react";
import HealthMetricsChart from "@/components/charts/HealthMetricsChart";
import AppointmentTrendsChart from "@/components/charts/AppointmentTrendsChart";
import HealthScoreChart from "@/components/charts/HealthScoreChart";
import "./dynamic-dashboard.css";
interface PatientData {
  _id: string;
  patientId: string;
  medicalRecordNumber?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  bloodType?: string;
  emergencyContact?: {
    name?: string;
    relationship?: string;
    phone?: string;
  };
  status?: string;
  totalAppointments?: number;
  registrationDate?: string;
  userId?: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
  };
}

interface DashboardData {
  patient: PatientData;
  stats: {
    totalAppointments: number;
    completedAppointments: number;
    upcomingAppointments: number;
    totalPrescriptions: number;
  };
  upcomingAppointments: any[];
  recentAppointments: any[];
  recentPrescriptions: any[];
  recentMedicalRecords: any[];
}

const DynamicDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  
  // Doctors & Labs tab state
  const [doctorsTabView, setDoctorsTabView] = useState<'doctors' | 'hospitals' | 'labs'>('doctors');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecialty, setFilterSpecialty] = useState('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Medicine Shop & Cart state
  const [cart, setCart] = useState<Array<{id: string, name: string, price: number, quantity: number, image: string}>>([]);
  const [medicineSearchTerm, setMedicineSearchTerm] = useState('');
  const [medicineCategory, setMedicineCategory] = useState('all');

  // MediVoice Chatbot state
  const [chatMessages, setChatMessages] = useState<Array<{id: string, text: string, sender: 'user' | 'bot', timestamp: Date}>>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [showChatHistory, setShowChatHistory] = useState(false);
  const [chatHistorySessions, setChatHistorySessions] = useState<Array<{id: string, title: string, date: Date, messages: any[]}>>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<Array<{name: string, type: string, url: string}>>([]);
  const recognitionRef = useRef<any>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Mock health data for charts (will be replaced with real data later)
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

  // Fetch dashboard data from API
  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("auth.token");
      const userStr = localStorage.getItem("auth.user");
      
      if (!token || !userStr) {
        console.log("No token or user, redirecting to login");
        navigate("/login");
        return;
      }

      // Parse user data from localStorage
      let user;
      try {
        user = JSON.parse(userStr);
        console.log("Loaded user from localStorage:", user);
      } catch (e) {
        console.error("Failed to parse user data:", e);
        navigate("/login");
        return;
      }

      // For now, create mock dashboard data since backend endpoint needs updating
      // This will be replaced with real API call once backend is updated
      const mockDashboardData = {
        patient: {
          _id: '1',
          patientId: 'MV-2024-001',
          medicalRecordNumber: 'MRN-001',
          firstName: user.fullName?.split(' ')[0] || 'Patient',
          lastName: user.fullName?.split(' ').slice(1).join(' ') || '',
          email: user.email || '',
          phone: user.phoneNumber || '',
          dateOfBirth: '',
          gender: '',
          bloodType: 'Unknown',
          emergencyContact: {
            name: 'Not provided',
            relationship: '',
            phone: ''
          },
          status: 'active',
          totalAppointments: 0,
          registrationDate: new Date().toISOString(),
        },
        stats: {
          totalAppointments: 0,
          completedAppointments: 0,
          upcomingAppointments: 0,
          totalPrescriptions: 0,
        },
        upcomingAppointments: [],
        recentAppointments: [],
        recentPrescriptions: [],
        recentMedicalRecords: [],
      };

      console.log("Setting mock dashboard data:", mockDashboardData);
      setDashboardData(mockDashboardData);

      // Optionally try to fetch real data from backend (will fail gracefully)
      /* 
      const apiUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/patient/dashboard`;
      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDashboardData(data.data);
      }
      */
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Check location state for tab switching (e.g., after booking appointment)
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
      // Clear the location state after using it
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state]);

  const handleLogout = () => {
    localStorage.removeItem("auth.token");
    localStorage.removeItem("auth.user");
    navigate("/login");
  };

  const handleCancelAppointment = async (appointmentId) => {
    try {
      const token = localStorage.getItem("auth.token");
      const apiUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/patient/appointments/${appointmentId}/cancel`;

      const response = await fetch(apiUrl, {
        method: 'PATCH',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Appointment cancelled successfully.",
        });
        // Refresh appointments
        fetchAppointments();
        fetchDashboardData();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to cancel appointment');
      }
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      toast({
        title: "Error",
        description: error.message || "Could not cancel the appointment. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Fetch appointments from backend
  const fetchAppointments = async () => {
    try {
      const userStr = localStorage.getItem('auth.user');
      if (!userStr) {
        console.log('No user found, skipping appointments fetch');
        setAppointments([]);
        return;
      }

      const user = JSON.parse(userStr);
      const email = user.email;

      if (!email) {
        console.log('No email found in user data');
        setAppointments([]);
        return;
      }

      const apiUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/appointments/patient/${encodeURIComponent(email)}`;
      
      console.log("Fetching appointments from:", apiUrl);
      
      const response = await fetch(apiUrl, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("Appointments data:", data);
        setAppointments(data.data?.appointments || []);
      } else {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        // If no appointments exist yet, that's okay - just set empty array
        setAppointments([]);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      // For now, set empty appointments array if there's an error
      setAppointments([]);
    }
  };

  // Handle doctor selection for booking
  const handleBookAppointment = (doctor) => {
    // Navigate to dedicated appointment booking page
    navigate('/doctor-appointment', { state: { doctor } });
  };

  // AI Chatbot handlers - Pure API integration with Flask chatbot
  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessageText = chatInput;
    const userMessage = {
      id: Date.now().toString(),
      text: userMessageText,
      sender: 'user' as const,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsChatLoading(true);

    // Get user email for session management
    const userStr = localStorage.getItem("auth.user");
    let sessionId = 'default';
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        sessionId = user.email || 'default';
      } catch (e) {
        console.error('Failed to parse user data:', e);
      }
    }

    // Call the MediVoice AI Agent API (Groq + Gemini with auto-fallback)
    const CHATBOT_BASE = import.meta.env.VITE_CHATBOT_URL || 'http://127.0.0.1:8000';
    try {
      const response = await fetch(`${CHATBOT_BASE}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessageText,
          session_id: sessionId
        })
      });

      if (!response.ok) {
        throw new Error(`AI Agent returned status ${response.status}`);
      }

      const data = await response.json();
      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: data.response || 'Sorry, I could not generate a response.',
        sender: 'bot' as const,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error calling chatbot API:', error);
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        text: "⚠️ Could not reach the MediVoice AI Agent. Make sure it is running: `cd Agent && python api.py`. Error: " + (error instanceof Error ? error.message : 'Unknown error'),
        sender: 'bot' as const,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsChatLoading(false);
    }

  };

  const handleSaveChatHistory = () => {
    const session = {
      id: Date.now().toString(),
      title: chatMessages.find(m => m.sender === 'user')?.text.slice(0, 30) + '...' || 'Chat Session',
      date: new Date(),
      messages: [...chatMessages]
    };
    setChatHistorySessions(prev => [session, ...prev]);
    toast({
      title: "Chat Saved",
      description: "Your chat session has been saved to history."
    });
  };

  const handleLoadChatHistory = (session: any) => {
    setChatMessages(session.messages);
    setShowChatHistory(false);
    toast({
      title: "Chat Loaded",
      description: "Previous chat session loaded successfully."
    });
  };

  const handleNewChat = () => {
    setChatMessages([]);
    toast({
      title: "New Chat Started",
      description: "Started a fresh conversation. Ask me anything!"
    });
  };

  const handleVoiceInput = () => {
    // Stop if already recording
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast({
        title: "Not Supported",
        description: "Voice input is not supported in your browser. Try Chrome or Edge.",
        variant: "destructive",
      });
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognitionRef.current = recognition;

    recognition.onstart = () => {
      setIsRecording(true);
      setChatInput('');
      toast({ title: "🎙️ Listening...", description: "Speak now. I'm listening." });
    };

    recognition.onresult = (event: any) => {
      let interim = '';
      let final = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcript;
        } else {
          interim += transcript;
        }
      }
      // Show live interim text in input
      setChatInput(final || interim);
    };

    recognition.onend = () => {
      setIsRecording(false);
      recognitionRef.current = null;
      // Auto-send if we captured something
      setChatInput(prev => {
        if (prev.trim()) {
          // Trigger send after state update
          setTimeout(() => {
            const btn = document.getElementById('chatbot-send-btn') as HTMLButtonElement;
            btn?.click();
          }, 100);
        }
        return prev;
      });
    };

    recognition.onerror = (event: any) => {
      setIsRecording(false);
      recognitionRef.current = null;
      const msg = event.error === 'no-speech'
        ? 'No speech detected. Please try again.'
        : `Voice error: ${event.error}`;
      toast({ title: "Voice Error", description: msg, variant: "destructive" });
    };

    recognition.start();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        const fileUrl = URL.createObjectURL(file);
        setUploadedFiles(prev => [...prev, { name: file.name, type: 'image', url: fileUrl }]);
        toast({
          title: "Image Uploaded",
          description: `${file.name} ready to send`
        });
      } else {
        toast({
          title: "Invalid File",
          description: "Please upload an image file",
          variant: "destructive"
        });
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const fileUrl = URL.createObjectURL(file);
      setUploadedFiles(prev => [...prev, { name: file.name, type: 'file', url: fileUrl }]);
      toast({
        title: "File Uploaded",
        description: `${file.name} ready to send`
      });
    }
  };

  const removeUploadedFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Fetch doctors from backend
  const fetchDoctors = async () => {
    try {
      // Mock doctors data with 15+ doctors
      const mockDoctors = [
        {
          id: "1",
          name: "Dr. Sarah Johnson",
          specialty: "Cardiology",
          hospital: "City General Hospital",
          rating: 4.9,
          experience: 15,
          fee: 250,
          available: true,
          phone: "+1 (555) 101-2001",
          email: "s.johnson@citygeneral.com",
          address: "123 Medical Plaza, Suite 200, Chennai",
          photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400",
          bio: "Dr. Sarah Johnson is a highly experienced cardiologist specialist with 15 years of practice. Expert in interventional cardiology and heart disease management."
        },
        {
          id: "2",
          name: "Dr. Michael Chen",
          specialty: "Neurology",
          hospital: "Apollo Hospitals",
          rating: 4.8,
          experience: 12,
          fee: 300,
          available: true,
          phone: "+1 (555) 102-2002",
          email: "m.chen@apollo.com",
          address: "456 Brain Center, Apollo Main, Chennai",
          photo: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400",
          bio: "Dr. Michael Chen specializes in neurological disorders with 12 years of experience in treating complex brain conditions."
        },
        {
          id: "3",
          name: "Dr. Priya Patel",
          specialty: "Pediatrics",
          hospital: "Fortis Malar Hospital",
          rating: 4.9,
          experience: 10,
          fee: 200,
          available: true,
          phone: "+1 (555) 103-2003",
          email: "p.patel@fortis.com",
          address: "789 Children's Wing, Fortis, Chennai",
          photo: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400",
          bio: "Dr. Priya Patel is a compassionate pediatrician with 10 years of experience in child healthcare and immunization."
        },
        {
          id: "4",
          name: "Dr. James Wilson",
          specialty: "Orthopedics",
          hospital: "MIOT International",
          rating: 4.7,
          experience: 18,
          fee: 280,
          available: true,
          phone: "+1 (555) 104-2004",
          email: "j.wilson@miot.com",
          address: "321 Bone & Joint Center, MIOT, Chennai",
          photo: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400",
          bio: "Dr. James Wilson is an expert orthopedic surgeon with 18 years specializing in joint replacement and sports medicine."
        },
        {
          id: "5",
          name: "Dr. Aisha Rahman",
          specialty: "Dermatology",
          hospital: "Vijaya Hospital",
          rating: 4.8,
          experience: 8,
          fee: 180,
          available: true,
          phone: "+1 (555) 105-2005",
          email: "a.rahman@vijaya.com",
          address: "654 Skin Care Unit, Vijaya, Chennai",
          photo: "https://images.unsplash.com/photo-1638202993928-7267aad84c31?w=400",
          bio: "Dr. Aisha Rahman specializes in dermatology with 8 years of experience in skin disorders and cosmetic treatments."
        },
        {
          id: "6",
          name: "Dr. Robert Martinez",
          specialty: "Oncology",
          hospital: "Cancer Institute",
          rating: 4.9,
          experience: 20,
          fee: 350,
          available: true,
          phone: "+1 (555) 106-2006",
          email: "r.martinez@cancerinstitute.com",
          address: "987 Oncology Wing, Adyar, Chennai",
          photo: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400",
          bio: "Dr. Robert Martinez is a renowned oncologist with 20 years of experience in cancer treatment and chemotherapy."
        },
        {
          id: "7",
          name: "Dr. Lakshmi Krishnan",
          specialty: "Gynecology",
          hospital: "Sankara Nethralaya",
          rating: 4.7,
          experience: 14,
          fee: 220,
          available: true,
          phone: "+1 (555) 107-2007",
          email: "l.krishnan@sankara.com",
          address: "234 Women's Health, Sankara, Chennai",
          photo: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=400",
          bio: "Dr. Lakshmi Krishnan is an experienced gynecologist with 14 years in women's health and obstetrics."
        },
        {
          id: "8",
          name: "Dr. David Lee",
          specialty: "Pulmonology",
          hospital: "Global Hospital",
          rating: 4.6,
          experience: 11,
          fee: 240,
          available: true,
          phone: "+1 (555) 108-2008",
          email: "d.lee@global.com",
          address: "567 Respiratory Care, Global, Chennai",
          photo: "https://images.unsplash.com/photo-1643297654416-05795d62e39c?w=400",
          bio: "Dr. David Lee specializes in pulmonology with 11 years of experience in treating lung diseases and respiratory disorders."
        },
        {
          id: "9",
          name: "Dr. Kavya Reddy",
          specialty: "Endocrinology",
          hospital: "Kauvery Hospital",
          rating: 4.8,
          experience: 9,
          fee: 210,
          available: true,
          phone: "+1 (555) 109-2009",
          email: "k.reddy@kauvery.com",
          address: "890 Diabetes Center, Kauvery, Chennai",
          photo: "https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?w=400",
          bio: "Dr. Kavya Reddy is an endocrinologist with 9 years of experience in diabetes and hormonal disorder management."
        },
        {
          id: "10",
          name: "Dr. Thomas Anderson",
          specialty: "Gastroenterology",
          hospital: "Gleneagles Global",
          rating: 4.7,
          experience: 16,
          fee: 270,
          available: true,
          phone: "+1 (555) 110-2010",
          email: "t.anderson@gleneagles.com",
          address: "345 GI Center, Gleneagles, Chennai",
          photo: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400",
          bio: "Dr. Thomas Anderson specializes in gastroenterology with 16 years treating digestive system disorders."
        },
        {
          id: "11",
          name: "Dr. Ananya Sharma",
          specialty: "Ophthalmology",
          hospital: "Aravind Eye Hospital",
          rating: 4.9,
          experience: 13,
          fee: 190,
          available: true,
          phone: "+1 (555) 111-2011",
          email: "a.sharma@aravind.com",
          address: "678 Eye Care Center, Aravind, Chennai",
          photo: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=400",
          bio: "Dr. Ananya Sharma is an ophthalmologist with 13 years of experience in eye care and vision correction surgeries."
        },
        {
          id: "12",
          name: "Dr. Christopher Brown",
          specialty: "Urology",
          hospital: "VS Hospital",
          rating: 4.6,
          experience: 15,
          fee: 260,
          available: true,
          phone: "+1 (555) 112-2012",
          email: "c.brown@vshospital.com",
          address: "901 Urology Wing, VS Hospital, Chennai",
          photo: "https://images.unsplash.com/photo-1618498082410-b4aa22193b38?w=400",
          bio: "Dr. Christopher Brown is a urologist with 15 years of experience in urinary tract and kidney stone treatments."
        },
        {
          id: "13",
          name: "Dr. Meera Iyer",
          specialty: "Psychiatry",
          hospital: "Mind Care Institute",
          rating: 4.8,
          experience: 10,
          fee: 230,
          available: true,
          phone: "+1 (555) 113-2013",
          email: "m.iyer@mindcare.com",
          address: "234 Mental Health Center, Chennai",
          photo: "https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=400",
          bio: "Dr. Meera Iyer is a psychiatrist with 10 years of experience in mental health and behavioral disorders."
        },
        {
          id: "14",
          name: "Dr. Daniel Kim",
          specialty: "ENT",
          hospital: "Madras ENT Hospital",
          rating: 4.7,
          experience: 12,
          fee: 200,
          available: true,
          phone: "+1 (555) 114-2014",
          email: "d.kim@madrasent.com",
          address: "567 ENT Department, Madras ENT, Chennai",
          photo: "https://images.unsplash.com/photo-1612531386530-97286d97c2d9?w=400",
          bio: "Dr. Daniel Kim specializes in ENT with 12 years of experience in ear, nose, and throat disorders."
        },
        {
          id: "15",
          name: "Dr. Radha Venkatesh",
          specialty: "Rheumatology",
          hospital: "SIMS Hospital",
          rating: 4.6,
          experience: 11,
          fee: 220,
          available: true,
          phone: "+1 (555) 115-2015",
          email: "r.venkatesh@sims.com",
          address: "890 Arthritis Care, SIMS, Chennai",
          photo: "https://images.unsplash.com/photo-1623854767648-e7bb8009f0db?w=400",
          bio: "Dr. Radha Venkatesh is a rheumatologist with 11 years of experience in arthritis and autoimmune diseases."
        },
        {
          id: "16",
          name: "Dr. Steven White",
          specialty: "Nephrology",
          hospital: "Kidney Care Center",
          rating: 4.8,
          experience: 17,
          fee: 280,
          available: true,
          phone: "+1 (555) 116-2016",
          email: "s.white@kidneycare.com",
          address: "123 Dialysis Unit, Kidney Care, Chennai",
          photo: "https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=400",
          bio: "Dr. Steven White specializes in nephrology with 17 years treating kidney diseases and dialysis patients."
        },
        {
          id: "17",
          name: "Dr. Divya Nair",
          specialty: "Hematology",
          hospital: "Blood Bank Hospital",
          rating: 4.7,
          experience: 9,
          fee: 240,
          available: true,
          phone: "+1 (555) 117-2017",
          email: "d.nair@bloodbank.com",
          address: "456 Hematology Lab, Chennai",
          photo: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400",
          bio: "Dr. Divya Nair is a hematologist with 9 years of experience in blood disorders and transfusion medicine."
        },
        {
          id: "18",
          name: "Dr. Richard Taylor",
          specialty: "General Surgery",
          hospital: "Lifeline Hospital",
          rating: 4.9,
          experience: 19,
          fee: 300,
          available: true,
          phone: "+1 (555) 118-2018",
          email: "r.taylor@lifeline.com",
          address: "789 Surgical Wing, Lifeline, Chennai",
          photo: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400",
          bio: "Dr. Richard Taylor is a general surgeon with 19 years of experience in laparoscopic and minimally invasive surgeries."
        }
      ];

      console.log("Loading mock doctors data:", mockDoctors.length, "doctors");
      setDoctors(mockDoctors);

      // Optionally try to fetch real data from backend (will use mock if it fails)
      /*
      const token = localStorage.getItem("auth.token");
      const apiUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/patient/doctors`;
      
      const response = await fetch(apiUrl, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        const transformedDoctors = data.data?.doctors?.map(doctor => ({
          id: doctor._id,
          name: `Dr. ${doctor.userId?.firstName} ${doctor.userId?.lastName}`,
          specialty: doctor.specialty,
          hospital: doctor.hospital || "MediVoice Hospital",
          rating: doctor.rating?.average || 4.5,
          experience: doctor.experience || 10,
          fee: doctor.consultationFee || 200,
          available: true,
          phone: doctor.userId?.phone || "+1 (555) 123-4567",
          email: doctor.userId?.email,
          address: "123 Medical Plaza, Suite 200, City, ST 12345",
          photo: doctor.photo || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400",
          bio: `Dr. ${doctor.userId?.lastName} is a highly experienced ${doctor.specialty?.toLowerCase()} specialist with ${doctor.experience || 10} years of practice.`
        })) || [];
        
        setDoctors(transformedDoctors);
      }
      */
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  // Get hospitals data
  const getHospitalsData = () => {
    return [
      {
        id: "1",
        name: "Apollo Hospitals",
        type: "Multi-Specialty Hospital",
        location: "Greams Road, Chennai",
        departments: ["Cardiology", "Neurology", "Oncology", "Orthopedics", "Pediatrics"],
        rating: 4.8,
        beds: 500,
        emergencyService: true,
        phone: "+91 44 2829 3333",
        email: "info@apollohospitals.com",
        website: "www.apollohospitals.com",
        image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400",
        accreditation: ["NABH", "JCI"],
        facilities: ["24/7 Emergency", "ICU", "Blood Bank", "Pharmacy", "Diagnostic Center"]
      },
      {
        id: "2",
        name: "Fortis Malar Hospital",
        type: "Multi-Specialty Hospital",
        location: "Adyar, Chennai",
        departments: ["Cardiology", "Neurosurgery", "Gastroenterology", "Nephrology", "Pulmonology"],
        rating: 4.7,
        beds: 180,
        emergencyService: true,
        phone: "+91 44 4289 2222",
        email: "info@fortismalar.com",
        website: "www.fortishealthcare.com",
        image: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=400",
        accreditation: ["NABH", "ISO 9001"],
        facilities: ["Cardiac Cath Lab", "Transplant Center", "Dialysis Unit", "Radiology"]
      },
      {
        id: "3",
        name: "MIOT International",
        type: "Specialty Hospital",
        location: "Manapakkam, Chennai",
        departments: ["Orthopedics", "Joint Replacement", "Spine Surgery", "Sports Medicine"],
        rating: 4.9,
        beds: 250,
        emergencyService: true,
        phone: "+91 44 2249 2288",
        email: "enquiry@miotinternational.com",
        website: "www.miotinternational.com",
        image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400",
        accreditation: ["NABH", "JCI", "ISO 9001"],
        facilities: ["Advanced Surgery Suites", "Rehabilitation Center", "Pain Management"]
      },
      {
        id: "4",
        name: "Sankara Nethralaya",
        type: "Eye Hospital",
        location: "Nungambakkam, Chennai",
        departments: ["Ophthalmology", "Retina Clinic", "Glaucoma Center", "Cataract Surgery"],
        rating: 4.9,
        beds: 100,
        emergencyService: true,
        phone: "+91 44 2827 1616",
        email: "info@sankaranethralaya.org",
        website: "www.sankaranethralaya.org",
        image: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=400",
        accreditation: ["NABH"],
        facilities: ["Laser Center", "Vision Therapy", "Optical Shop", "Research Center"]
      },
      {
        id: "5",
        name: "Cancer Institute (WIA)",
        type: "Cancer Specialty Hospital",
        location: "Adyar, Chennai",
        departments: ["Medical Oncology", "Surgical Oncology", "Radiation Oncology", "Palliative Care"],
        rating: 4.8,
        beds: 200,
        emergencyService: true,
        phone: "+91 44 2441 0102",
        email: "info@cancerinstitutewia.org",
        website: "www.cancerinstitutewia.org",
        image: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=400",
        accreditation: ["NABH"],
        facilities: ["Chemotherapy", "Radiation Therapy", "PET-CT Scan", "Bone Marrow Transplant"]
      },
      {
        id: "6",
        name: "Vijaya Hospital",
        type: "Multi-Specialty Hospital",
        location: "Vadapalani, Chennai",
        departments: ["General Medicine", "Surgery", "Obstetrics", "Gynecology", "Dermatology"],
        rating: 4.6,
        beds: 300,
        emergencyService: true,
        phone: "+91 44 2361 2012",
        email: "info@vijayahospital.com",
        website: "www.vijayahospital.com",
        image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=400",
        accreditation: ["NABH"],
        facilities: ["Maternity Ward", "NICU", "Surgical ICU", "Day Care Center"]
      },
      {
        id: "7",
        name: "Gleneagles Global Health City",
        type: "Multi-Specialty Hospital",
        location: "Perumbakkam, Chennai",
        departments: ["Cardiology", "Neurology", "Liver Transplant", "Kidney Transplant", "BMT"],
        rating: 4.8,
        beds: 1000,
        emergencyService: true,
        phone: "+91 44 4444 5555",
        email: "info@gleneagles.com",
        website: "www.gleneagleshealth.com",
        image: "https://images.unsplash.com/photo-1519494140681-8b17d830a3ec?w=400",
        accreditation: ["NABH", "JCI"],
        facilities: ["Multi-Organ Transplant", "Robotic Surgery", "Advanced Imaging", "International Patient Services"]
      },
      {
        id: "8",
        name: "SIMS Hospital",
        type: "Multi-Specialty Hospital",
        location: "Vadapalani, Chennai",
        departments: ["Cardiology", "Gastroenterology", "Nephrology", "Orthopedics"],
        rating: 4.7,
        beds: 300,
        emergencyService: true,
        phone: "+91 44 4289 4289",
        email: "info@simshospitals.com",
        website: "www.simshospitals.com",
        image: "https://images.unsplash.com/photo-1596541223130-5d31a73fb6c6?w=400",
        accreditation: ["NABH"],
        facilities: ["Cath Lab", "Endoscopy", "Dialysis", "Critical Care"]
      }
    ];
  };

  // Get labs data
  const getLabsData = () => {
    return [
      {
        id: "1",
        name: "Thyrocare Technologies",
        type: "Diagnostic Laboratory",
        location: "Multiple locations across Chennai",
        services: ["Blood Tests", "Pathology", "Radiology", "Health Packages"],
        rating: 4.7,
        homeCollection: true,
        phone: "+91 44 2345 6789",
        email: "chennai@thyrocare.com",
        website: "www.thyrocare.com",
        image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=400",
        accreditation: ["NABL", "CAP"],
        testCategories: ["Hormone Tests", "Diabetes Panel", "Lipid Profile", "Liver Function", "Kidney Function"],
        reportTime: "24-48 hours",
        price: "Starting from ₹299"
      },
      {
        id: "2",
        name: "Dr. Lal PathLabs",
        type: "Diagnostic Laboratory",
        location: "Anna Nagar, T. Nagar, Adyar",
        services: ["Clinical Pathology", "Molecular Biology", "Microbiology", "Histopathology"],
        rating: 4.8,
        homeCollection: true,
        phone: "+91 44 3456 7890",
        email: "info@lalpathlabs.com",
        website: "www.lalpathlabs.com",
        image: "https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=400",
        accreditation: ["NABL", "CAP", "ISO 15189"],
        testCategories: ["CBC", "Thyroid Profile", "Vitamin Tests", "Cancer Markers", "Allergy Tests"],
        reportTime: "Same day for urgent tests",
        price: "Starting from ₹199"
      },
      {
        id: "3",
        name: "Metropolis Healthcare",
        type: "Diagnostic Laboratory",
        location: "Branches in major areas",
        services: ["Pathology", "Radiology", "Cardiology Tests", "Genetic Testing"],
        rating: 4.6,
        homeCollection: true,
        phone: "+91 44 4567 8901",
        email: "contact@metropolisindia.com",
        website: "www.metropolisindia.com",
        image: "https://images.unsplash.com/photo-1582560475093-ba66accbc424?w=400",
        accreditation: ["NABL", "CAP"],
        testCategories: ["Infectious Disease", "Wellness Packages", "Women's Health", "Cardiac Markers"],
        reportTime: "24 hours",
        price: "Starting from ₹349"
      },
      {
        id: "4",
        name: "SRL Diagnostics",
        type: "Diagnostic Laboratory",
        location: "OMR, Velachery, Mylapore",
        services: ["Routine Tests", "Specialized Tests", "Imaging", "Preventive Health Checkups"],
        rating: 4.7,
        homeCollection: true,
        phone: "+91 44 5678 9012",
        email: "srlchennai@srl.in",
        website: "www.srldiagnostics.in",
        image: "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=400",
        accreditation: ["NABL", "CAP", "ISO 15189"],
        testCategories: ["Genomics", "Oncology Tests", "Toxicology", "Neonatal Screening"],
        reportTime: "24-72 hours",
        price: "Starting from ₹249"
      },
      {
        id: "5",
        name: "Apollo Diagnostics",
        type: "Diagnostic & Imaging Center",
        location: "Greams Road, Anna Salai",
        services: ["X-Ray", "CT Scan", "MRI", "Ultrasound", "Lab Tests"],
        rating: 4.8,
        homeCollection: true,
        phone: "+91 44 6789 0123",
        email: "diagnostics@apollohospitals.com",
        website: "www.apollodiagnostics.in",
        image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=400",
        accreditation: ["NABL", "ISO 15189"],
        testCategories: ["Full Body Checkup", "Cardiac Screening", "Bone Density", "Mammography"],
        reportTime: "Same day to 48 hours",
        price: "Starting from ₹399"
      },
      {
        id: "6",
        name: "Neuberg Diagnostics",
        type: "Super Specialty Laboratory",
        location: "Nungambakkam, Chennai",
        services: ["Molecular Diagnostics", "Cytogenetics", "Flow Cytometry", "Immunohistochemistry"],
        rating: 4.9,
        homeCollection: true,
        phone: "+91 44 7890 1234",
        email: "chennai@neubergdiagnostics.com",
        website: "www.neubergdiagnostics.com",
        image: "https://images.unsplash.com/photo-1582719471137-c3967ffb1c42?w=400",
        accreditation: ["NABL", "CAP", "CLIA"],
        testCategories: ["Advanced Cancer Testing", "Genetic Disorders", "Prenatal Testing", "Rare Diseases"],
        reportTime: "3-7 days for specialized tests",
        price: "Starting from ₹499"
      },
      {
        id: "7",
        name: "Vijaya Diagnostics",
        type: "Diagnostic Laboratory",
        location: "Vadapalani, Chennai",
        services: ["Clinical Lab", "Radiology", "Cardiology Tests", "Health Packages"],
        rating: 4.6,
        homeCollection: true,
        phone: "+91 44 8901 2345",
        email: "info@vijayadiagnostic.com",
        website: "www.vijayadiagnostic.com",
        image: "https://images.unsplash.com/photo-1612349316228-5942a9b489c2?w=400",
        accreditation: ["NABL"],
        testCategories: ["Routine Blood Work", "Diabetes Management", "Antenatal Profile", "Senior Citizen Packages"],
        reportTime: "24 hours",
        price: "Starting from ₹199"
      },
      {
        id: "8",
        name: "Medall Diagnostics",
        type: "Diagnostic Center",
        location: "Multiple branches in Chennai",
        services: ["Laboratory", "Radiology", "Cardiology", "Preventive Healthcare"],
        rating: 4.5,
        homeCollection: true,
        phone: "+91 44 9012 3456",
        email: "support@medall.in",
        website: "www.medall.in",
        image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=400",
        accreditation: ["NABL", "ISO 15189"],
        testCategories: ["Infection Screening", "Organ Function Tests", "Tumor Markers", "Executive Health Checkup"],
        reportTime: "Same day to 48 hours",
        price: "Starting from ₹279"
      }
    ];
  };

  // Get filtered and searched data
  const getFilteredDoctors = () => {
    let filtered = doctors;
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(doctor => 
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.hospital.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply specialty filter
    if (filterSpecialty !== 'all') {
      filtered = filtered.filter(doctor => 
        doctor.specialty.toLowerCase() === filterSpecialty.toLowerCase()
      );
    }
    
    return filtered;
  };

  const getFilteredHospitals = () => {
    const hospitals = getHospitalsData();
    
    if (searchTerm) {
      return hospitals.filter(hospital => 
        hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hospital.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hospital.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hospital.departments.some(dept => dept.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    return hospitals;
  };

  const getFilteredLabs = () => {
    const labs = getLabsData();
    
    if (searchTerm) {
      return labs.filter(lab => 
        lab.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lab.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lab.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lab.services.some(service => service.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    return labs;
  };

  // Get unique specialties for filter
  const getSpecialties = () => {
    const specialties = Array.from(new Set(doctors.map(d => d.specialty)));
    return ['all', ...specialties.sort()];
  };

  // Get medicine products data
  const getMedicinesData = () => {
    return [
      {
        id: 'med-1',
        name: 'Paracetamol 500mg',
        genericName: 'Acetaminophen',
        manufacturer: 'PharmaCorp Ltd.',
        price: 45,
        mrp: 60,
        discount: 25,
        category: 'Pain Relief',
        description: 'Effective pain reliever and fever reducer for common aches and pains.',
        dosageForm: 'Tablet',
        strength: '500mg',
        packSize: '15 Tablets',
        prescription: false,
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop',
        rating: 4.5,
        inStock: true,
        uses: 'Headache, fever, body ache, dental pain',
        sideEffects: 'Nausea, allergic reactions (rare)',
        composition: 'Paracetamol 500mg'
      },
      {
        id: 'med-2',
        name: 'Amoxicillin 250mg',
        genericName: 'Amoxicillin',
        manufacturer: 'MediPharm Inc.',
        price: 180,
        mrp: 220,
        discount: 18,
        category: 'Antibiotics',
        description: 'Broad-spectrum antibiotic for bacterial infections.',
        dosageForm: 'Capsule',
        strength: '250mg',
        packSize: '10 Capsules',
        prescription: true,
        image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=300&fit=crop',
        rating: 4.7,
        inStock: true,
        uses: 'Bacterial infections, respiratory infections, urinary tract infections',
        sideEffects: 'Diarrhea, nausea, skin rash',
        composition: 'Amoxicillin Trihydrate 250mg'
      },
      {
        id: 'med-3',
        name: 'Cetrizine 10mg',
        genericName: 'Cetirizine',
        manufacturer: 'AllergyCare Ltd.',
        price: 35,
        mrp: 50,
        discount: 30,
        category: 'Allergy',
        description: 'Antihistamine for relief from allergic symptoms.',
        dosageForm: 'Tablet',
        strength: '10mg',
        packSize: '10 Tablets',
        prescription: false,
        image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&h=300&fit=crop',
        rating: 4.6,
        inStock: true,
        uses: 'Allergic rhinitis, hay fever, urticaria, itching',
        sideEffects: 'Drowsiness, dry mouth, headache',
        composition: 'Cetirizine Dihydrochloride 10mg'
      },
      {
        id: 'med-4',
        name: 'Metformin 500mg',
        genericName: 'Metformin',
        manufacturer: 'DiabeCare Pharma',
        price: 95,
        mrp: 120,
        discount: 21,
        category: 'Diabetes',
        description: 'First-line treatment for type 2 diabetes mellitus.',
        dosageForm: 'Tablet',
        strength: '500mg',
        packSize: '30 Tablets',
        prescription: true,
        image: 'https://images.unsplash.com/photo-1550572017-4814c5c3d024?w=400&h=300&fit=crop',
        rating: 4.4,
        inStock: true,
        uses: 'Type 2 diabetes, blood sugar control',
        sideEffects: 'Nausea, diarrhea, stomach upset',
        composition: 'Metformin Hydrochloride 500mg'
      },
      {
        id: 'med-5',
        name: 'Amlodipine 5mg',
        genericName: 'Amlodipine',
        manufacturer: 'CardioPharma Ltd.',
        price: 85,
        mrp: 110,
        discount: 23,
        category: 'Blood Pressure',
        description: 'Calcium channel blocker for hypertension and angina.',
        dosageForm: 'Tablet',
        strength: '5mg',
        packSize: '15 Tablets',
        prescription: true,
        image: 'https://images.unsplash.com/photo-1563213126-a4273aed2016?w=400&h=300&fit=crop',
        rating: 4.5,
        inStock: true,
        uses: 'High blood pressure, angina, coronary artery disease',
        sideEffects: 'Swelling of ankles, dizziness, flushing',
        composition: 'Amlodipine Besylate 5mg'
      },
      {
        id: 'med-6',
        name: 'Vitamin D3 1000IU',
        genericName: 'Cholecalciferol',
        manufacturer: 'NutriHealth Corp.',
        price: 120,
        mrp: 150,
        discount: 20,
        category: 'Vitamins',
        description: 'Essential vitamin for bone health and immunity.',
        dosageForm: 'Capsule',
        strength: '1000 IU',
        packSize: '30 Capsules',
        prescription: false,
        image: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=400&h=300&fit=crop',
        rating: 4.8,
        inStock: true,
        uses: 'Vitamin D deficiency, bone health, immunity boost',
        sideEffects: 'Rare: nausea, constipation, weakness',
        composition: 'Cholecalciferol 1000 IU'
      },
      {
        id: 'med-7',
        name: 'Omeprazole 20mg',
        genericName: 'Omeprazole',
        manufacturer: 'GastroCare Pharma',
        price: 75,
        mrp: 95,
        discount: 21,
        category: 'Digestive',
        description: 'Proton pump inhibitor for acid reflux and ulcers.',
        dosageForm: 'Capsule',
        strength: '20mg',
        packSize: '14 Capsules',
        prescription: true,
        image: 'https://images.unsplash.com/photo-1578496781379-7dcfb995293d?w=400&h=300&fit=crop',
        rating: 4.6,
        inStock: true,
        uses: 'GERD, acid reflux, stomach ulcers, heartburn',
        sideEffects: 'Headache, diarrhea, abdominal pain',
        composition: 'Omeprazole 20mg'
      },
      {
        id: 'med-8',
        name: 'Azithromycin 500mg',
        genericName: 'Azithromycin',
        manufacturer: 'MediPharm Inc.',
        price: 250,
        mrp: 300,
        discount: 17,
        category: 'Antibiotics',
        description: 'Macrolide antibiotic for respiratory infections.',
        dosageForm: 'Tablet',
        strength: '500mg',
        packSize: '3 Tablets',
        prescription: true,
        image: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=400&h=300&fit=crop',
        rating: 4.7,
        inStock: true,
        uses: 'Respiratory infections, ear infections, skin infections',
        sideEffects: 'Diarrhea, nausea, stomach pain',
        composition: 'Azithromycin Dihydrate 500mg'
      },
      {
        id: 'med-9',
        name: 'Aspirin 75mg',
        genericName: 'Acetylsalicylic Acid',
        manufacturer: 'CardioPharma Ltd.',
        price: 40,
        mrp: 55,
        discount: 27,
        category: 'Blood Thinner',
        description: 'Low-dose aspirin for cardiovascular protection.',
        dosageForm: 'Tablet',
        strength: '75mg',
        packSize: '30 Tablets',
        prescription: false,
        image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop',
        rating: 4.5,
        inStock: true,
        uses: 'Heart attack prevention, stroke prevention, blood clot prevention',
        sideEffects: 'Stomach irritation, bleeding tendency',
        composition: 'Acetylsalicylic Acid 75mg'
      },
      {
        id: 'med-10',
        name: 'Ibuprofen 400mg',
        genericName: 'Ibuprofen',
        manufacturer: 'PharmaCorp Ltd.',
        price: 55,
        mrp: 70,
        discount: 21,
        category: 'Pain Relief',
        description: 'NSAID for pain, inflammation, and fever.',
        dosageForm: 'Tablet',
        strength: '400mg',
        packSize: '15 Tablets',
        prescription: false,
        image: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=400&h=300&fit=crop',
        rating: 4.6,
        inStock: true,
        uses: 'Pain relief, inflammation, fever, arthritis',
        sideEffects: 'Stomach upset, nausea, heartburn',
        composition: 'Ibuprofen 400mg'
      },
      {
        id: 'med-11',
        name: 'Multivitamin Daily',
        genericName: 'Multivitamin',
        manufacturer: 'NutriHealth Corp.',
        price: 180,
        mrp: 220,
        discount: 18,
        category: 'Vitamins',
        description: 'Complete daily multivitamin with minerals.',
        dosageForm: 'Tablet',
        strength: 'Standard',
        packSize: '30 Tablets',
        prescription: false,
        image: 'https://images.unsplash.com/photo-1526835746352-0b9cb32b1e0f?w=400&h=300&fit=crop',
        rating: 4.7,
        inStock: true,
        uses: 'Daily nutritional supplement, immunity boost, energy',
        sideEffects: 'Rare: stomach upset, allergic reactions',
        composition: 'Vitamins A, B-Complex, C, D, E, Minerals'
      },
      {
        id: 'med-12',
        name: 'Atorvastatin 10mg',
        genericName: 'Atorvastatin',
        manufacturer: 'CardioPharma Ltd.',
        price: 110,
        mrp: 140,
        discount: 21,
        category: 'Cholesterol',
        description: 'Statin for cholesterol management.',
        dosageForm: 'Tablet',
        strength: '10mg',
        packSize: '15 Tablets',
        prescription: true,
        image: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=400&h=300&fit=crop',
        rating: 4.5,
        inStock: true,
        uses: 'High cholesterol, cardiovascular disease prevention',
        sideEffects: 'Muscle pain, liver enzyme elevation, headache',
        composition: 'Atorvastatin Calcium 10mg'
      },
      {
        id: 'med-13',
        name: 'Levothyroxine 50mcg',
        genericName: 'Levothyroxine',
        manufacturer: 'EndioCare Pharma',
        price: 90,
        mrp: 115,
        discount: 22,
        category: 'Thyroid',
        description: 'Thyroid hormone replacement therapy.',
        dosageForm: 'Tablet',
        strength: '50mcg',
        packSize: '30 Tablets',
        prescription: true,
        image: 'https://images.unsplash.com/photo-1550572017-4814c5c3d024?w=400&h=300&fit=crop',
        rating: 4.6,
        inStock: true,
        uses: 'Hypothyroidism, thyroid hormone deficiency',
        sideEffects: 'Weight loss, tremor, headache, nervousness',
        composition: 'Levothyroxine Sodium 50mcg'
      },
      {
        id: 'med-14',
        name: 'Montelukast 10mg',
        genericName: 'Montelukast',
        manufacturer: 'RespiroCare Ltd.',
        price: 160,
        mrp: 200,
        discount: 20,
        category: 'Respiratory',
        description: 'Leukotriene receptor antagonist for asthma.',
        dosageForm: 'Tablet',
        strength: '10mg',
        packSize: '10 Tablets',
        prescription: true,
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop',
        rating: 4.7,
        inStock: true,
        uses: 'Asthma, allergic rhinitis, exercise-induced bronchoconstriction',
        sideEffects: 'Headache, stomach pain, diarrhea',
        composition: 'Montelukast Sodium 10mg'
      },
      {
        id: 'med-15',
        name: 'Calcium Carbonate 500mg',
        genericName: 'Calcium Carbonate',
        manufacturer: 'NutriHealth Corp.',
        price: 70,
        mrp: 90,
        discount: 22,
        category: 'Vitamins',
        description: 'Calcium supplement for bone health.',
        dosageForm: 'Tablet',
        strength: '500mg',
        packSize: '30 Tablets',
        prescription: false,
        image: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=400&h=300&fit=crop',
        rating: 4.5,
        inStock: true,
        uses: 'Calcium deficiency, osteoporosis prevention, bone health',
        sideEffects: 'Constipation, bloating, gas',
        composition: 'Calcium Carbonate 500mg (200mg elemental calcium)'
      },
      {
        id: 'med-16',
        name: 'Diclofenac 50mg',
        genericName: 'Diclofenac',
        manufacturer: 'PharmaCorp Ltd.',
        price: 65,
        mrp: 85,
        discount: 24,
        category: 'Pain Relief',
        description: 'NSAID for pain and inflammation.',
        dosageForm: 'Tablet',
        strength: '50mg',
        packSize: '10 Tablets',
        prescription: true,
        image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&h=300&fit=crop',
        rating: 4.4,
        inStock: true,
        uses: 'Arthritis, joint pain, muscle pain, inflammation',
        sideEffects: 'Stomach upset, nausea, heartburn',
        composition: 'Diclofenac Sodium 50mg'
      },
      {
        id: 'med-17',
        name: 'Salbutamol Inhaler',
        genericName: 'Salbutamol',
        manufacturer: 'RespiroCare Ltd.',
        price: 280,
        mrp: 350,
        discount: 20,
        category: 'Respiratory',
        description: 'Fast-acting bronchodilator for asthma relief.',
        dosageForm: 'Inhaler',
        strength: '100mcg',
        packSize: '200 Doses',
        prescription: true,
        image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=300&fit=crop',
        rating: 4.8,
        inStock: true,
        uses: 'Asthma, COPD, bronchospasm, breathing difficulty',
        sideEffects: 'Tremor, headache, increased heart rate',
        composition: 'Salbutamol Sulfate 100mcg per actuation'
      },
      {
        id: 'med-18',
        name: 'Ranitidine 150mg',
        genericName: 'Ranitidine',
        manufacturer: 'GastroCare Pharma',
        price: 60,
        mrp: 80,
        discount: 25,
        category: 'Digestive',
        description: 'H2 blocker for acid reflux and ulcers.',
        dosageForm: 'Tablet',
        strength: '150mg',
        packSize: '10 Tablets',
        prescription: false,
        image: 'https://images.unsplash.com/photo-1578496781379-7dcfb995293d?w=400&h=300&fit=crop',
        rating: 4.5,
        inStock: true,
        uses: 'Heartburn, acid reflux, stomach ulcers, GERD',
        sideEffects: 'Headache, constipation, diarrhea',
        composition: 'Ranitidine Hydrochloride 150mg'
      },
      {
        id: 'med-19',
        name: 'Losartan 50mg',
        genericName: 'Losartan',
        manufacturer: 'CardioPharma Ltd.',
        price: 130,
        mrp: 165,
        discount: 21,
        category: 'Blood Pressure',
        description: 'ARB for hypertension and heart protection.',
        dosageForm: 'Tablet',
        strength: '50mg',
        packSize: '15 Tablets',
        prescription: true,
        image: 'https://images.unsplash.com/photo-1563213126-a4273aed2016?w=400&h=300&fit=crop',
        rating: 4.6,
        inStock: true,
        uses: 'High blood pressure, diabetic nephropathy, heart failure',
        sideEffects: 'Dizziness, fatigue, hyperkalemia',
        composition: 'Losartan Potassium 50mg'
      },
      {
        id: 'med-20',
        name: 'Clopidogrel 75mg',
        genericName: 'Clopidogrel',
        manufacturer: 'CardioPharma Ltd.',
        price: 85,
        mrp: 110,
        discount: 23,
        category: 'Blood Thinner',
        description: 'Antiplatelet agent for cardiovascular protection.',
        dosageForm: 'Tablet',
        strength: '75mg',
        packSize: '15 Tablets',
        prescription: true,
        image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop',
        rating: 4.7,
        inStock: true,
        uses: 'Heart attack prevention, stroke prevention, peripheral artery disease',
        sideEffects: 'Bleeding, bruising, stomach upset',
        composition: 'Clopidogrel Bisulfate 75mg'
      },
      {
        id: 'med-21',
        name: 'Loratadine 10mg',
        genericName: 'Loratadine',
        manufacturer: 'AllergyCare Ltd.',
        price: 42,
        mrp: 60,
        discount: 30,
        category: 'Allergy',
        description: 'Non-drowsy antihistamine for allergies.',
        dosageForm: 'Tablet',
        strength: '10mg',
        packSize: '10 Tablets',
        prescription: false,
        image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&h=300&fit=crop',
        rating: 4.6,
        inStock: true,
        uses: 'Seasonal allergies, hay fever, hives, itching',
        sideEffects: 'Mild headache, dry mouth (minimal)',
        composition: 'Loratadine 10mg'
      },
      {
        id: 'med-22',
        name: 'Insulin Glargine 100IU',
        genericName: 'Insulin Glargine',
        manufacturer: 'DiabeCare Pharma',
        price: 1200,
        mrp: 1500,
        discount: 20,
        category: 'Diabetes',
        description: 'Long-acting insulin for diabetes management.',
        dosageForm: 'Injection',
        strength: '100 IU/ml',
        packSize: '10ml Vial',
        prescription: true,
        image: 'https://images.unsplash.com/photo-1550572017-4814c5c3d024?w=400&h=300&fit=crop',
        rating: 4.8,
        inStock: true,
        uses: 'Type 1 and Type 2 diabetes, blood sugar control',
        sideEffects: 'Hypoglycemia, injection site reactions, weight gain',
        composition: 'Insulin Glargine 100 IU/ml'
      },
      {
        id: 'med-23',
        name: 'Probiotic Capsules',
        genericName: 'Lactobacillus Mix',
        manufacturer: 'GastroCare Pharma',
        price: 220,
        mrp: 280,
        discount: 21,
        category: 'Digestive',
        description: 'Probiotic supplement for gut health.',
        dosageForm: 'Capsule',
        strength: '5 Billion CFU',
        packSize: '30 Capsules',
        prescription: false,
        image: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=400&h=300&fit=crop',
        rating: 4.7,
        inStock: true,
        uses: 'Digestive health, immunity, antibiotic recovery',
        sideEffects: 'Rare: mild bloating, gas',
        composition: 'Lactobacillus acidophilus, Bifidobacterium'
      },
      {
        id: 'med-24',
        name: 'Fluticasone Nasal Spray',
        genericName: 'Fluticasone',
        manufacturer: 'AllergyCare Ltd.',
        price: 320,
        mrp: 400,
        discount: 20,
        category: 'Allergy',
        description: 'Corticosteroid nasal spray for allergic rhinitis.',
        dosageForm: 'Nasal Spray',
        strength: '50mcg',
        packSize: '120 Doses',
        prescription: true,
        image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=300&fit=crop',
        rating: 4.7,
        inStock: true,
        uses: 'Allergic rhinitis, nasal congestion, hay fever',
        sideEffects: 'Nosebleed, nasal irritation, headache',
        composition: 'Fluticasone Propionate 50mcg per spray'
      }
    ];
  };

  // Cart helper functions
  const addToCart = (medicine: any) => {
    const existingItem = cart.find(item => item.id === medicine.id);
    let updatedCart;
    
    if (existingItem) {
      updatedCart = cart.map(item => 
        item.id === medicine.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      toast({
        title: "Updated Cart",
        description: `${medicine.name} quantity increased`,
      });
    } else {
      updatedCart = [...cart, {
        id: medicine.id,
        name: medicine.name,
        price: medicine.price,
        quantity: 1,
        image: medicine.image,
        genericName: medicine.genericName,
        dosageForm: medicine.dosageForm,
        strength: medicine.strength,
        prescription: medicine.prescription
      }];
      toast({
        title: "Added to Cart",
        description: `${medicine.name} added to your cart`,
      });
    }
    
    setCart(updatedCart);
    localStorage.setItem('medicineCart', JSON.stringify(updatedCart));
  };

  const getCartCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getFilteredMedicines = () => {
    let medicines = getMedicinesData();

    if (medicineSearchTerm) {
      medicines = medicines.filter(med =>
        med.name.toLowerCase().includes(medicineSearchTerm.toLowerCase()) ||
        med.genericName.toLowerCase().includes(medicineSearchTerm.toLowerCase()) ||
        med.category.toLowerCase().includes(medicineSearchTerm.toLowerCase()) ||
        med.uses.toLowerCase().includes(medicineSearchTerm.toLowerCase())
      );
    }

    if (medicineCategory !== 'all') {
      medicines = medicines.filter(med => med.category === medicineCategory);
    }

    return medicines;
  };

  const getMedicineCategories = () => {
    const categories = Array.from(new Set(getMedicinesData().map(m => m.category)));
    return ['all', ...categories.sort()];
  };

  // Load appointments and doctors when component mounts
  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
    
    // Load cart from localStorage
    const savedCart = localStorage.getItem('medicineCart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    }
  }, []);

  // Refetch appointments when page becomes visible (user returns from booking)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchAppointments();
      }
    };

    const handleFocus = () => {
      fetchAppointments();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // Refetch appointments when appointments tab becomes active
  useEffect(() => {
    if (activeTab === 'appointments') {
      fetchAppointments();
    }
  }, [activeTab]);

  // Update stats whenever appointments change
  useEffect(() => {
    if (dashboardData && appointments) {
      const totalAppointments = appointments.length;
      const completedAppointments = appointments.filter(apt => apt.status === 'completed').length;
      const upcomingAppointments = appointments.filter(apt => 
        ['scheduled', 'confirmed'].includes(apt.status) && 
        new Date(apt.appointmentDate) >= new Date()
      ).length;

      setDashboardData(prev => ({
        ...prev!,
        stats: {
          ...prev!.stats,
          totalAppointments,
          completedAppointments,
          upcomingAppointments,
        }
      }));
    }
  }, [appointments]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-green-50/30 to-green-100/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your health dashboard...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-green-50/30 to-green-100/20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600">Failed to load dashboard data.</p>
          <Button onClick={fetchDashboardData} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const { patient, stats, upcomingAppointments, recentAppointments } = dashboardData;

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
              { id: "ai-chatbot", label: "MediVoice", icon: Brain },
              { id: "records", label: "Medical Records", icon: FileText },
              { id: "doctors", label: "Doctors & Labs", icon: Stethoscope },
              { id: "appointments", label: "Appointments", icon: Calendar },
              { id: "medicines", label: "Medicines", icon: Pill },
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
                {patient?.userId?.firstName?.charAt(0) || patient?.firstName?.charAt(0) || 'P'}
                {patient?.userId?.lastName?.charAt(0) || patient?.lastName?.charAt(0) || 'T'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-left">
              <p className="font-semibold text-slate-800 text-sm">
                {patient?.userId?.firstName || patient?.firstName || 'Patient'} {patient?.userId?.lastName || patient?.lastName || ''}
              </p>
              <p className="text-xs text-green-600">Patient</p>
            </div>
          </button>
        </div>
      </div>

      {/* Main Content Area - Adjusted for fixed sidebar */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Top Navigation Bar */}
        <header className="bg-white border-b border-green-200 shadow-sm">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  {activeTab === "dashboard" && "Health Dashboard"}
                  {activeTab === "ai-chatbot" && "MediVoice"}
                  {activeTab === "records" && "Medical Records"}
                  {activeTab === "doctors" && "Doctors & Labs"}
                  {activeTab === "appointments" && "Appointments"}
                  {activeTab === "medicines" && "Medicines"}
                  {activeTab === "payment" && "Payment & Billing"}
                  {activeTab === "profile" && "Profile & Settings"}
                  {activeTab === "help" && "Help & Support"}
                </h2>
                <p className="text-slate-600">
                  Welcome back, {patient?.userId?.firstName || patient?.firstName || 'Patient'} {patient?.userId?.lastName || patient?.lastName || ''} (ID: {patient?.medicalRecordNumber || patient?.patientId || 'N/A'})
                </p>
              </div>
              
              {/* Top Right Actions */}
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setActiveTab("profile")}
                  className="hover:bg-green-100"
                >
                  <User className="h-5 w-5 text-slate-600" />
                </Button>

                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={handleLogout}
                  className="hover:bg-red-100 text-red-600"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {/* MediVoice Tab Content */}
            {activeTab === "ai-chatbot" && (
              <div className="fixed inset-0 top-[5rem] left-64 right-0 bottom-0 flex flex-col bg-gradient-to-br from-white via-green-50/30 to-green-100/20">
                {/* Listening Animation Overlay */}
                {isRecording && (
                  <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md">
                    <div className="relative flex flex-col items-center">
                      {/* Pulsing Circles */}
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-40 h-40 bg-blue-400/20 rounded-full animate-ping"></div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-32 h-32 bg-blue-400/30 rounded-full animate-pulse"></div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-24 h-24 bg-blue-500/40 rounded-full animate-pulse dd-delay-05s"></div>
                        </div>
                        
                        {/* Center Icon */}
                        <div className="relative w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-2xl border-4 border-white/20">
                          <Mic className="h-12 w-12 text-white animate-pulse" />
                        </div>
                      </div>
                      
                      {/* Listening Text */}
                      <div className="mt-8 text-center">
                        <p className="text-white font-bold text-2xl mb-2 drop-shadow-lg">Listening...</p>
                        <p className="text-white/90 text-base mb-4 drop-shadow-md">Speak clearly into your microphone</p>
                        
                        {/* Sound Wave Bars */}
                        <div className="flex justify-center gap-1.5 mb-6">
                          <div className="w-1.5 h-8 bg-white rounded-full animate-bounce shadow-lg dd-delay-0ms"></div>
                          <div className="w-1.5 h-12 bg-white rounded-full animate-bounce shadow-lg dd-delay-150ms"></div>
                          <div className="w-1.5 h-16 bg-white rounded-full animate-bounce shadow-lg dd-delay-300ms"></div>
                          <div className="w-1.5 h-12 bg-white rounded-full animate-bounce shadow-lg dd-delay-450ms"></div>
                          <div className="w-1.5 h-8 bg-white rounded-full animate-bounce shadow-lg dd-delay-600ms"></div>
                        </div>

                        {/* Cancel Button */}
                        <Button
                          onClick={handleVoiceInput}
                          variant="outline"
                          className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50 backdrop-blur-sm shadow-xl px-8 py-3"
                          size="lg"
                        >
                          <X className="h-5 w-5 mr-2" />
                          Cancel Recording
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Chat Header */}
                <div className="flex-shrink-0 border-b border-blue-200/60 shadow-lg bg-gradient-to-r from-blue-50 to-white">
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                          <Brain className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-slate-800">AI Health Assistant</h3>
                          <p className="text-sm text-slate-600">Always here to help with your health questions</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleNewChat}
                          className="border-blue-200 hover:bg-blue-50"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          New Chat
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowChatHistory(!showChatHistory)}
                          className="border-blue-200 hover:bg-blue-50"
                        >
                          <History className="h-4 w-4 mr-1" />
                          History
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-1 flex gap-4 overflow-hidden p-4">
                  {/* Chat Messages Area */}
                  <div className="flex-1 bg-white border border-blue-200/60 shadow-xl rounded-lg flex flex-col">
                    {/* Messages Container */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {chatMessages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[70%] rounded-2xl p-4 ${
                                message.sender === 'user'
                                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                                  : 'bg-gradient-to-r from-slate-100 to-slate-50 text-slate-800 border border-slate-200'
                              }`}
                            >
                              {message.sender === 'bot' && (
                                <div className="flex items-center gap-2 mb-2">
                                  <Brain className="h-4 w-4 text-blue-600" />
                                  <span className="text-xs font-semibold text-blue-600">AI Assistant</span>
                                </div>
                              )}
                              <p className="text-sm leading-relaxed whitespace-pre-line">{message.text}</p>
                              <p className={`text-xs mt-2 ${message.sender === 'user' ? 'text-blue-100' : 'text-slate-500'}`}>
                                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </div>
                        ))}
                        
                        {isChatLoading && (
                          <div className="flex justify-start">
                            <div className="bg-gradient-to-r from-slate-100 to-slate-50 rounded-2xl p-4 border border-slate-200">
                              <div className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                                <span className="text-sm text-slate-600">AI is thinking...</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                    {/* Input Area - Fixed at bottom */}
                    <div className="flex-shrink-0 p-4 border-t border-slate-200 bg-slate-50">
                      {/* Uploaded Files Preview */}
                      {uploadedFiles.length > 0 && (
                        <div className="mb-3 flex flex-wrap gap-2">
                          {uploadedFiles.map((file, index) => (
                            <div key={index} className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
                              {file.type === 'image' ? (
                                <Image className="h-4 w-4 text-blue-600" />
                              ) : (
                                <Paperclip className="h-4 w-4 text-blue-600" />
                              )}
                              <span className="text-sm text-slate-700">{file.name}</span>
                              <button
                                onClick={() => removeUploadedFile(index)}
                                className="ml-2 text-red-500 hover:text-red-700"
                                aria-label="Remove uploaded file"
                                title="Remove uploaded file"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex gap-2">
                        {/* Image Upload Button */}
                        <label className="cursor-pointer" htmlFor="chatbot-image-upload">
                          <input
                            id="chatbot-image-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            title="Upload image"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            className="border-blue-200 hover:bg-blue-50"
                            aria-label="Upload image"
                            title="Upload image"
                          >
                            <Image className="h-4 w-4 text-blue-600" />
                          </Button>
                        </label>

                        {/* File Upload Button */}
                        <label className="cursor-pointer" htmlFor="chatbot-file-upload">
                          <input
                            id="chatbot-file-upload"
                            type="file"
                            onChange={handleFileUpload}
                            className="hidden"
                            title="Upload file"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            className="border-blue-200 hover:bg-blue-50"
                            aria-label="Upload file"
                            title="Upload file"
                          >
                            <Paperclip className="h-4 w-4 text-blue-600" />
                          </Button>
                        </label>

                        <Input
                          placeholder="Ask about symptoms, appointments, or health advice..."
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage();
                            }
                          }}
                          className="flex-1 border-blue-200 focus:border-blue-400"
                          disabled={isChatLoading}
                          aria-label="Chat message input"
                          title="Chat message input"
                        />
                        <Button
                          onClick={handleVoiceInput}
                          variant="outline"
                          type="button"
                          title={isRecording ? 'Stop recording' : 'Start voice input'}
                          className={`border-blue-200 transition-all ${
                            isRecording
                              ? 'bg-red-100 border-red-400 animate-pulse shadow-lg shadow-red-200'
                              : 'hover:bg-blue-50'
                          }`}
                        >
                          <Mic className={`h-4 w-4 ${isRecording ? 'text-red-600' : 'text-blue-600'}`} />
                        </Button>
                        <Button
                          id="chatbot-send-btn"
                          onClick={handleSendMessage}
                          disabled={!chatInput.trim() || isChatLoading}
                          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-slate-500 mt-2">
                        💡 Try asking: "I have a fever", "Book an appointment", "Show my reports"
                      </p>
                    </div>
                  </div>

                  {/* Chat History Sidebar */}
                  {showChatHistory && (
                    <Card className="w-80 border border-blue-200/60 shadow-xl bg-white">
                      <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b border-blue-200">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">Chat History</CardTitle>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowChatHistory(false)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4">
                        {chatHistorySessions.length === 0 ? (
                          <div className="text-center py-8">
                            <History className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                            <p className="text-sm text-slate-500">No saved chats yet</p>
                            <p className="text-xs text-slate-400 mt-1">Your saved conversations will appear here</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {chatHistorySessions.map((session) => (
                              <button
                                key={session.id}
                                onClick={() => handleLoadChatHistory(session)}
                                className="w-full text-left p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                              >
                                <p className="text-sm font-medium text-slate-800 truncate">
                                  {session.title}
                                </p>
                                <p className="text-xs text-slate-500 mt-1">
                                  {session.date.toLocaleDateString()} at {session.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                                <p className="text-xs text-slate-400 mt-1">
                                  {session.messages.length} messages
                                </p>
                              </button>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            )}

            {/* Dashboard Tab Content */}
            {activeTab === "dashboard" && (
              <div className="space-y-6">
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <Card className="border border-green-200/60 shadow-xl bg-white">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
                          <Calendar className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Total Appointments</p>
                          <p className="text-2xl font-bold text-slate-800">{stats?.totalAppointments || 0}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-green-200/60 shadow-xl bg-white">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                          <CheckCircle2 className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Completed</p>
                          <p className="text-2xl font-bold text-slate-800">{stats?.completedAppointments || 0}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-green-200/60 shadow-xl bg-white">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl">
                          <Clock className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Upcoming</p>
                          <p className="text-2xl font-bold text-slate-800">{stats?.upcomingAppointments || 0}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-green-200/60 shadow-xl bg-white">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
                          <Pill className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Prescriptions</p>
                          <p className="text-2xl font-bold text-slate-800">{stats?.totalPrescriptions || 0}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Health Charts - Empty State for New Patients */}
                {stats?.totalAppointments > 0 ? (
                  <>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                      <HealthScoreChart 
                        overallScore={healthScoreData?.overallScore || 0}
                        categories={healthScoreData?.categories || []}
                        title="Health Score Overview"
                        height={350}
                      />
                      <HealthMetricsChart 
                        data={healthMetricsData || []}
                        title="Vital Signs Trends"
                        height={350}
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-6 mb-8">
                      <AppointmentTrendsChart 
                        data={appointmentTrendsData || []}
                        title="Appointment History"
                        height={300}
                        type="bar"
                      />
                    </div>
                  </>
                ) : (
                  <Card className="border border-green-200/60 shadow-xl bg-white">
                    <CardContent className="p-8 text-center">
                      <Activity className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-slate-800 mb-2">Welcome to MediVoice!</h3>
                      <p className="text-slate-600 mb-6">
                        As a new patient, your health charts and appointment history will appear here after your first consultation.
                      </p>
                      <Button 
                        onClick={() => setActiveTab("doctors")}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Find a Doctor to Get Started
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* Upcoming Appointments */}
                {dashboardData.upcomingAppointments && dashboardData.upcomingAppointments.length > 0 ? (
                  <Card className="border border-green-200/60 shadow-xl bg-white">
                    <CardHeader className="bg-gradient-to-r from-green-100/80 to-green-50/80 border-b border-green-200/60">
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-green-600" />
                        Upcoming Appointments
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {dashboardData.upcomingAppointments.slice(0, 3).map((appointment) => (
                          <div key={appointment._id} className="p-4 bg-green-50 rounded-lg border border-green-200">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-semibold text-slate-800">
                                  Dr. {appointment.doctor?.userId?.firstName} {appointment.doctor?.userId?.lastName}
                                </h4>
                                <p className="text-sm text-green-600">{appointment.doctor?.specialty}</p>
                                <p className="text-sm text-slate-600">
                                  {new Date(appointment.scheduledTime).toLocaleDateString()} at{' '}
                                  {new Date(appointment.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                              <Badge variant="outline" className="border-green-200 text-green-700">
                                {appointment.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="border border-green-200/60 shadow-xl bg-white">
                    <CardContent className="p-8 text-center">
                      <Calendar className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-slate-800 mb-2">No Upcoming Appointments</h3>
                      <p className="text-slate-600 mb-6">
                        You don't have any scheduled appointments. Book your first consultation to get started.
                      </p>
                      <Button 
                        onClick={() => setActiveTab("doctors")}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Book an Appointment
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* Recent Appointments */}
                {dashboardData.recentAppointments && dashboardData.recentAppointments.length > 0 ? (
                  <Card className="border border-green-200/60 shadow-xl bg-white">
                    <CardHeader className="bg-gradient-to-r from-green-100/80 to-green-50/80 border-b border-green-200/60">
                      <CardTitle className="flex items-center gap-2">
                        <History className="h-5 w-5 text-green-600" />
                        Recent Medical Visits
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {dashboardData.recentAppointments.slice(0, 3).map((appointment) => (
                          <div key={appointment._id} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-semibold text-slate-800">
                                  Dr. {appointment.doctor?.userId?.firstName} {appointment.doctor?.userId?.lastName}
                                </h4>
                                <p className="text-sm text-blue-600">{appointment.doctor?.specialization}</p>
                                <p className="text-sm text-slate-600">
                                  {new Date(appointment.scheduledTime).toLocaleDateString()}
                                </p>
                              </div>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="border-blue-200 text-blue-700 hover:bg-blue-50"
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                View
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ) : null}
              </div>
            )}

            {/* Profile Tab Content */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-slate-800">Profile & Settings</h3>
                  {!isEditingProfile ? (
                    <Button onClick={() => setIsEditingProfile(true)} variant="outline" className="ml-4">
                      Edit
                    </Button>
                  ) : null}
                </div>

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
                          {patient?.userId?.firstName?.charAt(0) || patient?.firstName?.charAt(0) || 'P'}
                          {patient?.userId?.lastName?.charAt(0) || patient?.lastName?.charAt(0) || 'T'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        {!isEditingProfile ? (
                          <>
                            <h3 className="text-2xl font-bold text-slate-800 mb-2">
                              {patient.firstName} {patient.lastName}
                            </h3>
                            <p className="text-green-600 font-semibold mb-1">
                              Patient ID: {patient.patientId}
                            </p>
                            <Badge className="bg-green-100 text-green-700 border-green-200">Patient</Badge>
                          </>
                        ) : (
                          <div className="flex gap-2">
                            <input
                              className="border rounded px-2 py-1 text-lg font-bold w-[120px]"
                              value={patient.firstName}
                              onChange={e => setDashboardData(prev => prev ? { ...prev, patient: { ...prev.patient, firstName: e.target.value } } : prev)}
                              title="First name"
                              aria-label="First name"
                            />
                            <input
                              className="border rounded px-2 py-1 text-lg font-bold w-[120px]"
                              value={patient.lastName}
                              onChange={e => setDashboardData(prev => prev ? { ...prev, patient: { ...prev.patient, lastName: e.target.value } } : prev)}
                              title="Last name"
                              aria-label="Last name"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-semibold text-slate-700 mb-2 block">Email Address</label>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-600">{patient.email}</span>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-slate-700 mb-2 block">Phone Number</label>
                          {!isEditingProfile ? (
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-green-600" />
                              <span className="text-sm text-slate-600">{patient.phone}</span>
                            </div>
                          ) : (
                            <input
                              className="border rounded px-2 py-1 w-full"
                              value={patient.phone || ''}
                              onChange={e => setDashboardData(prev => prev ? { ...prev, patient: { ...prev.patient, phone: e.target.value } } : prev)}
                              placeholder="Enter phone number"
                            />
                          )}
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-slate-700 mb-2 block">Blood Type</label>
                          {!isEditingProfile ? (
                            <Badge variant="outline" className="border-red-200 text-red-700">
                              {patient.bloodType || 'Unknown'}
                            </Badge>
                          ) : (
                            <input
                              className="border rounded px-2 py-1 w-full"
                              value={patient.bloodType || ''}
                              onChange={e => setDashboardData(prev => prev ? { ...prev, patient: { ...prev.patient, bloodType: e.target.value } } : prev)}
                              placeholder="Enter blood type"
                            />
                          )}
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-semibold text-slate-700 mb-2 block">Emergency Contact Name</label>
                          {!isEditingProfile ? (
                            <span className="text-sm text-slate-600">{patient.emergencyContact?.name || ''}</span>
                          ) : (
                            <input
                              className="border rounded px-2 py-1 w-full"
                              value={patient.emergencyContact?.name || ''}
                              onChange={e => setDashboardData(prev => prev ? { ...prev, patient: { ...prev.patient, emergencyContact: { ...prev.patient.emergencyContact, name: e.target.value } } } : prev)}
                              placeholder="Enter emergency contact name"
                            />
                          )}
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-slate-700 mb-2 block">Emergency Contact Relationship</label>
                          {!isEditingProfile ? (
                            <span className="text-sm text-slate-600">{patient.emergencyContact?.relationship || ''}</span>
                          ) : (
                            <input
                              className="border rounded px-2 py-1 w-full"
                              value={patient.emergencyContact?.relationship || ''}
                              onChange={e => setDashboardData(prev => prev ? { ...prev, patient: { ...prev.patient, emergencyContact: { ...prev.patient.emergencyContact, relationship: e.target.value } } } : prev)}
                              placeholder="Enter relationship"
                            />
                          )}
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-slate-700 mb-2 block">Emergency Contact Phone</label>
                          {!isEditingProfile ? (
                            <span className="text-sm text-slate-600">{patient.emergencyContact?.phone || ''}</span>
                          ) : (
                            <input
                              className="border rounded px-2 py-1 w-full"
                              value={patient.emergencyContact?.phone || ''}
                              onChange={e => setDashboardData(prev => prev ? { ...prev, patient: { ...prev.patient, emergencyContact: { ...prev.patient.emergencyContact, phone: e.target.value } } } : prev)}
                              placeholder="Enter emergency contact phone"
                            />
                          )}
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-slate-700 mb-2 block">Status</label>
                          <Badge variant="outline" className="border-green-200 text-green-700">
                            {patient.status || 'Active'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    {isEditingProfile && (
                      <div className="flex gap-2 mt-8">
                        <Button
                          onClick={async () => {
                            try {
                              const token = localStorage.getItem("auth.token");
                              const apiUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/patient/profile`;
                              const updateData = {
                                firstName: patient.firstName,
                                lastName: patient.lastName,
                                phone: patient.phone,
                                bloodType: patient.bloodType,
                                emergencyContact: patient.emergencyContact
                              };
                              const response = await fetch(apiUrl, {
                                method: 'PATCH',
                                headers: {
                                  'Authorization': `Bearer ${token}`,
                                  'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(updateData)
                              });
                              if (!response.ok) throw new Error('Failed to update profile');
                              toast({ title: 'Profile updated!', description: 'Your profile was updated successfully.' });
                              setIsEditingProfile(false);
                            } catch (error) {
                              toast({ title: 'Error', description: 'Failed to update profile.', variant: 'destructive' });
                            }
                          }}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Save
                        </Button>
                        <Button onClick={() => setIsEditingProfile(false)} variant="outline">Cancel</Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Medical Records Tab Content */}
            {activeTab === "records" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-slate-800">Medical Records</h3>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Request Records
                  </Button>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="border border-blue-200/60 shadow-lg bg-gradient-to-br from-blue-50 to-white">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-blue-600" />
                        <div>
                          <p className="text-xs text-slate-600 font-medium">Total Records</p>
                          <p className="text-2xl font-bold text-slate-800">8</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border border-green-200/60 shadow-lg bg-gradient-to-br from-green-50 to-white">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <TestTube className="h-8 w-8 text-green-600" />
                        <div>
                          <p className="text-xs text-slate-600 font-medium">Lab Reports</p>
                          <p className="text-2xl font-bold text-slate-800">3</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border border-purple-200/60 shadow-lg bg-gradient-to-br from-purple-50 to-white">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Pill className="h-8 w-8 text-purple-600" />
                        <div>
                          <p className="text-xs text-slate-600 font-medium">Prescriptions</p>
                          <p className="text-2xl font-bold text-slate-800">4</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border border-orange-200/60 shadow-lg bg-gradient-to-br from-orange-50 to-white">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Activity className="h-8 w-8 text-orange-600" />
                        <div>
                          <p className="text-xs text-slate-600 font-medium">Vital Signs</p>
                          <p className="text-2xl font-bold text-slate-800">12</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Medical Records List */}
                <div className="space-y-4">
                  {/* Blood Test Report */}
                  <Card className="border border-green-200/60 shadow-xl bg-white hover:shadow-2xl transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-red-100 rounded-lg">
                            <TestTube className="h-6 w-6 text-red-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-slate-800 text-lg">Complete Blood Count (CBC)</h4>
                            <p className="text-sm text-slate-600 mt-1">Blood Test Report</p>
                            <div className="flex items-center gap-4 mt-2">
                              <div className="flex items-center gap-1 text-sm text-slate-600">
                                <User className="h-4 w-4" />
                                <span>Dr. Sarah Johnson • Cardiology</span>
                              </div>
                              <div className="flex items-center gap-1 text-sm text-slate-600">
                                <Calendar className="h-4 w-4" />
                                <span>Oct 15, 2024</span>
                              </div>
                            </div>
                            <div className="mt-3 grid grid-cols-3 gap-4">
                              <div className="bg-slate-50 p-2 rounded">
                                <p className="text-xs text-slate-500">Hemoglobin</p>
                                <p className="text-sm font-semibold text-slate-800">14.5 g/dL</p>
                                <Badge className="mt-1 bg-green-100 text-green-700 text-xs">Normal</Badge>
                              </div>
                              <div className="bg-slate-50 p-2 rounded">
                                <p className="text-xs text-slate-500">WBC Count</p>
                                <p className="text-sm font-semibold text-slate-800">7,500/μL</p>
                                <Badge className="mt-1 bg-green-100 text-green-700 text-xs">Normal</Badge>
                              </div>
                              <div className="bg-slate-50 p-2 rounded">
                                <p className="text-xs text-slate-500">Platelets</p>
                                <p className="text-sm font-semibold text-slate-800">250,000/μL</p>
                                <Badge className="mt-1 bg-green-100 text-green-700 text-xs">Normal</Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button size="sm" variant="outline" className="border-blue-200 hover:bg-blue-50">
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="border-green-200 hover:bg-green-50"
                            onClick={() => navigate("/view-medical-record", {
                              state: {
                                record: {
                                  id: '1',
                                  type: 'blood-test',
                                  title: 'Complete Blood Count (CBC)',
                                  description: 'Blood Test Report',
                                  doctor: 'Dr. Sarah Johnson',
                                  specialty: 'Cardiology',
                                  hospital: 'City General Hospital',
                                  date: 'Oct 15, 2024',
                                  results: {
                                    'Hemoglobin': { value: '14.5 g/dL', status: 'Normal', range: '12-16 g/dL' },
                                    'WBC Count': { value: '7,500/μL', status: 'Normal', range: '4,000-11,000/μL' },
                                    'Platelets': { value: '250,000/μL', status: 'Normal', range: '150,000-400,000/μL' },
                                    'RBC Count': { value: '5.2 million/μL', status: 'Normal', range: '4.5-5.5 million/μL' },
                                    'Hematocrit': { value: '42%', status: 'Normal', range: '37-47%' },
                                    'MCV': { value: '88 fL', status: 'Normal', range: '80-100 fL' }
                                  }
                                }
                              }
                            })}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Prescription */}
                  <Card className="border border-green-200/60 shadow-xl bg-white hover:shadow-2xl transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-purple-100 rounded-lg">
                            <Pill className="h-6 w-6 text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-slate-800 text-lg">Hypertension Medication</h4>
                            <p className="text-sm text-slate-600 mt-1">Prescription</p>
                            <div className="flex items-center gap-4 mt-2">
                              <div className="flex items-center gap-1 text-sm text-slate-600">
                                <User className="h-4 w-4" />
                                <span>Dr. Sarah Johnson • Cardiology</span>
                              </div>
                              <div className="flex items-center gap-1 text-sm text-slate-600">
                                <Calendar className="h-4 w-4" />
                                <span>Oct 20, 2024</span>
                              </div>
                            </div>
                            <div className="mt-3 space-y-2">
                              <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
                                <p className="text-sm font-semibold text-slate-800">Amlodipine 5mg</p>
                                <p className="text-xs text-slate-600 mt-1">1 tablet daily • Morning • 30 days</p>
                              </div>
                              <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
                                <p className="text-sm font-semibold text-slate-800">Atorvastatin 10mg</p>
                                <p className="text-xs text-slate-600 mt-1">1 tablet daily • Night • 30 days</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button size="sm" variant="outline" className="border-blue-200 hover:bg-blue-50">
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                          <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                            <Pill className="h-4 w-4 mr-1" />
                            Refill
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* X-Ray Report */}
                  <Card className="border border-green-200/60 shadow-xl bg-white hover:shadow-2xl transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-blue-100 rounded-lg">
                            <Activity className="h-6 w-6 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-slate-800 text-lg">Chest X-Ray</h4>
                            <p className="text-sm text-slate-600 mt-1">Imaging Report</p>
                            <div className="flex items-center gap-4 mt-2">
                              <div className="flex items-center gap-1 text-sm text-slate-600">
                                <User className="h-4 w-4" />
                                <span>Dr. Michael Chen • Radiology</span>
                              </div>
                              <div className="flex items-center gap-1 text-sm text-slate-600">
                                <Calendar className="h-4 w-4" />
                                <span>Sep 28, 2024</span>
                              </div>
                            </div>
                            <div className="mt-3 bg-blue-50 p-3 rounded-lg">
                              <p className="text-sm text-slate-700">
                                <span className="font-semibold">Findings:</span> Normal cardiac silhouette. Clear lung fields bilaterally. No pleural effusion or pneumothorax. Unremarkable bony structures.
                              </p>
                              <p className="text-sm text-slate-700 mt-2">
                                <span className="font-semibold">Impression:</span> Normal chest radiograph.
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button size="sm" variant="outline" className="border-blue-200 hover:bg-blue-50">
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="border-green-200 hover:bg-green-50"
                            onClick={() => navigate("/view-medical-record", {
                              state: {
                                record: {
                                  id: '2',
                                  type: 'imaging',
                                  title: 'Chest X-Ray',
                                  description: 'Imaging Report',
                                  doctor: 'Dr. Michael Chen',
                                  specialty: 'Radiology',
                                  hospital: 'Apollo Hospitals',
                                  date: 'Sep 28, 2024',
                                  findings: 'Normal cardiac silhouette. Clear lung fields bilaterally. No pleural effusion or pneumothorax. Unremarkable bony structures.',
                                  impression: 'Normal chest radiograph.'
                                }
                              }
                            })}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* ECG Report */}
                  <Card className="border border-green-200/60 shadow-xl bg-white hover:shadow-2xl transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-green-100 rounded-lg">
                            <Heart className="h-6 w-6 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-slate-800 text-lg">Electrocardiogram (ECG)</h4>
                            <p className="text-sm text-slate-600 mt-1">Cardiac Test</p>
                            <div className="flex items-center gap-4 mt-2">
                              <div className="flex items-center gap-1 text-sm text-slate-600">
                                <User className="h-4 w-4" />
                                <span>Dr. Sarah Johnson • Cardiology</span>
                              </div>
                              <div className="flex items-center gap-1 text-sm text-slate-600">
                                <Calendar className="h-4 w-4" />
                                <span>Oct 10, 2024</span>
                              </div>
                            </div>
                            <div className="mt-3 grid grid-cols-2 gap-3">
                              <div className="bg-slate-50 p-2 rounded">
                                <p className="text-xs text-slate-500">Heart Rate</p>
                                <p className="text-sm font-semibold text-slate-800">72 bpm</p>
                              </div>
                              <div className="bg-slate-50 p-2 rounded">
                                <p className="text-xs text-slate-500">Rhythm</p>
                                <p className="text-sm font-semibold text-slate-800">Normal Sinus</p>
                              </div>
                            </div>
                            <Badge className="mt-3 bg-green-100 text-green-700">Normal Study</Badge>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button size="sm" variant="outline" className="border-blue-200 hover:bg-blue-50">
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="border-green-200 hover:bg-green-50"
                            onClick={() => navigate("/view-medical-record", {
                              state: {
                                record: {
                                  id: '3',
                                  type: 'ecg',
                                  title: 'Electrocardiogram (ECG)',
                                  description: 'Cardiac Test',
                                  doctor: 'Dr. Sarah Johnson',
                                  specialty: 'Cardiology',
                                  hospital: 'City General Hospital',
                                  date: 'Oct 10, 2024',
                                  results: {
                                    'Heart Rate': { value: '72 bpm', status: 'Normal', range: '60-100 bpm' },
                                    'Rhythm': { value: 'Normal Sinus', status: 'Normal', range: 'Normal Sinus' },
                                    'PR Interval': { value: '160 ms', status: 'Normal', range: '120-200 ms' },
                                    'QRS Duration': { value: '90 ms', status: 'Normal', range: '80-120 ms' },
                                    'QT Interval': { value: '400 ms', status: 'Normal', range: '350-450 ms' }
                                  },
                                  impression: 'Normal sinus rhythm. No acute ST-T changes. No evidence of ischemia or infarction.'
                                }
                              }
                            })}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Consultation Notes */}
                  <Card className="border border-green-200/60 shadow-xl bg-white hover:shadow-2xl transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-yellow-100 rounded-lg">
                            <FileText className="h-6 w-6 text-yellow-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-slate-800 text-lg">General Checkup - Follow-up</h4>
                            <p className="text-sm text-slate-600 mt-1">Consultation Notes</p>
                            <div className="flex items-center gap-4 mt-2">
                              <div className="flex items-center gap-1 text-sm text-slate-600">
                                <User className="h-4 w-4" />
                                <span>Dr. Sarah Johnson • Cardiology</span>
                              </div>
                              <div className="flex items-center gap-1 text-sm text-slate-600">
                                <Calendar className="h-4 w-4" />
                                <span>Nov 5, 2024</span>
                              </div>
                            </div>
                            <div className="mt-3 bg-yellow-50 p-3 rounded-lg">
                              <p className="text-sm text-slate-700">
                                <span className="font-semibold">Chief Complaint:</span> Follow-up for hypertension management
                              </p>
                              <p className="text-sm text-slate-700 mt-2">
                                <span className="font-semibold">Assessment:</span> Blood pressure well controlled on current medication. Patient reports no side effects. Continue current regimen.
                              </p>
                              <p className="text-sm text-slate-700 mt-2">
                                <span className="font-semibold">Plan:</span> Continue Amlodipine 5mg daily. Follow-up in 3 months. Maintain healthy diet and regular exercise.
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button size="sm" variant="outline" className="border-blue-200 hover:bg-blue-50">
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="border-green-200 hover:bg-green-50"
                            onClick={() => navigate("/view-medical-record", {
                              state: {
                                record: {
                                  id: '4',
                                  type: 'consultation',
                                  title: 'General Checkup - Follow-up',
                                  description: 'Consultation Notes',
                                  doctor: 'Dr. Sarah Johnson',
                                  specialty: 'Cardiology',
                                  hospital: 'City General Hospital',
                                  date: 'Nov 5, 2024',
                                  findings: 'Chief Complaint: Follow-up for hypertension management',
                                  impression: 'Blood pressure well controlled on current medication. Patient reports no side effects. Continue current regimen.',
                                  notes: 'Plan: Continue Amlodipine 5mg daily. Follow-up in 3 months. Maintain healthy diet and regular exercise. Patient advised to monitor blood pressure at home twice daily. Continue low-sodium diet and regular walking 30 minutes daily.'
                                }
                              }
                            })}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Doctors & Labs Tab Content */}
            {activeTab === "doctors" && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-800">Doctors, Hospitals & Labs</h3>

                {/* View Tabs: Doctors, Hospitals, Labs */}
                <div className="flex gap-2 border-b border-slate-200">
                  <Button
                    variant={doctorsTabView === 'doctors' ? 'default' : 'ghost'}
                    onClick={() => {
                      setDoctorsTabView('doctors');
                      setSearchTerm('');
                      setFilterSpecialty('all');
                    }}
                    className={doctorsTabView === 'doctors' ? 'bg-green-600 hover:bg-green-700' : ''}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Doctors
                  </Button>
                  <Button
                    variant={doctorsTabView === 'hospitals' ? 'default' : 'ghost'}
                    onClick={() => {
                      setDoctorsTabView('hospitals');
                      setSearchTerm('');
                    }}
                    className={doctorsTabView === 'hospitals' ? 'bg-green-600 hover:bg-green-700' : ''}
                  >
                    <Building2 className="h-4 w-4 mr-2" />
                    Hospitals
                  </Button>
                  <Button
                    variant={doctorsTabView === 'labs' ? 'default' : 'ghost'}
                    onClick={() => {
                      setDoctorsTabView('labs');
                      setSearchTerm('');
                    }}
                    className={doctorsTabView === 'labs' ? 'bg-green-600 hover:bg-green-700' : ''}
                  >
                    <TestTube className="h-4 w-4 mr-2" />
                    Labs
                  </Button>
                </div>

                {/* Search and Filter */}
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <Search className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      placeholder={`Search ${doctorsTabView}...`}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  {doctorsTabView === 'doctors' && (
                    <div className="relative">
                      <Button 
                        variant="outline"
                        onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                      >
                        <Filter className="h-4 w-4 mr-2" />
                        {filterSpecialty === 'all' ? 'Filter' : filterSpecialty}
                      </Button>
                      {showFilterDropdown && (
                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-slate-200 z-50 max-h-96 overflow-y-auto">
                          {getSpecialties().map(specialty => (
                            <button
                              key={specialty}
                              onClick={() => {
                                setFilterSpecialty(specialty);
                                setShowFilterDropdown(false);
                              }}
                              className={`w-full text-left px-4 py-2 hover:bg-green-50 ${
                                filterSpecialty === specialty ? 'bg-green-100 text-green-700 font-semibold' : 'text-slate-700'
                              }`}
                            >
                              {specialty === 'all' ? 'All Specialties' : specialty}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Doctors View */}
                {doctorsTabView === 'doctors' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {getFilteredDoctors().length > 0 ? getFilteredDoctors().map((doctor, index) => (
                    <Card key={index} className="border border-slate-200 hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer">
                      <CardContent className="p-0">
                        {/* Doctor Image */}
                        <div className="relative bg-slate-50 aspect-[3/3.4] overflow-hidden">
                          <img 
                            src={doctor.photo || "/placeholder.svg"} 
                            alt={doctor.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <Badge 
                            className="absolute top-3 right-3 bg-green-600 text-white border-0"
                          >
                            {doctor.available ? "Available" : "Busy"}
                          </Badge>
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                            <div className="flex items-center text-white text-xs">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                              <span className="font-semibold">{doctor.rating}</span>
                              <span className="mx-2">•</span>
                              <span>{doctor.experience} years exp</span>
                            </div>
                          </div>
                        </div>

                        {/* Doctor Info */}
                        <div className="p-4">
                          <h4 className="font-semibold text-slate-900 text-base line-clamp-1 mb-1">
                            {doctor.name}
                          </h4>
                          <p className="text-sm text-green-600 font-medium mb-1">
                            {doctor.specialty}
                          </p>
                          <div className="flex items-center text-xs text-slate-600 mb-3">
                            <Building2 className="h-3 w-3 mr-1 text-slate-400" />
                            <span className="line-clamp-1">{doctor.hospital}</span>
                          </div>

                          {/* Price Section */}
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <span className="text-lg font-bold text-slate-900">₹{doctor.fee}</span>
                              <span className="text-xs text-slate-500 ml-1">/ visit</span>
                            </div>
                            <Badge variant="outline" className="text-xs border-green-200 text-green-700">
                              Consultation
                            </Badge>
                          </div>

                          {/* Book Button */}
                          <Button 
                            className="w-full bg-green-600 hover:bg-green-700 text-white"
                            disabled={!doctor.available}
                            onClick={() => handleBookAppointment(doctor)}
                          >
                            <Calendar className="h-4 w-4 mr-2" />
                            Book Now
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                    )) : (
                      <div className="col-span-full">
                        <Card className="border border-green-200/60 shadow-xl bg-white">
                          <CardContent className="p-8 text-center">
                            <Stethoscope className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-slate-800 mb-2">No Doctors Found</h3>
                            <p className="text-slate-600 mb-6">
                              {searchTerm || filterSpecialty !== 'all' 
                                ? 'Try adjusting your search or filter criteria.' 
                                : 'We\'re currently loading our available doctors. Please check back in a moment.'}
                            </p>
                            <Button 
                              onClick={() => {
                                setSearchTerm('');
                                setFilterSpecialty('all');
                                fetchDoctors();
                              }}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Refresh Doctors
                            </Button>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </div>
                )}

                {/* Hospitals View */}
                {doctorsTabView === 'hospitals' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {getFilteredHospitals().map((hospital) => (
                      <Card key={hospital.id} className="border border-slate-200 hover:shadow-xl transition-all duration-300 overflow-hidden">
                        <CardContent className="p-0">
                          {/* Hospital Image */}
                          <div className="relative h-48 overflow-hidden bg-slate-100">
                            <img 
                              src={hospital.image} 
                              alt={hospital.name}
                              className="w-full h-full object-cover"
                            />
                            {hospital.emergencyService && (
                              <Badge className="absolute top-3 right-3 bg-red-600 text-white border-0">
                                24/7 Emergency
                              </Badge>
                            )}
                          </div>

                          {/* Hospital Info */}
                          <div className="p-5">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h4 className="font-bold text-slate-900 text-lg mb-1">{hospital.name}</h4>
                                <p className="text-sm text-green-600 font-medium">{hospital.type}</p>
                              </div>
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="font-semibold text-slate-800">{hospital.rating}</span>
                              </div>
                            </div>

                            <div className="space-y-2 mb-4">
                              <div className="flex items-start gap-2 text-sm text-slate-600">
                                <MapPin className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                                <span>{hospital.location}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-slate-600">
                                <Phone className="h-4 w-4 text-slate-400 flex-shrink-0" />
                                <span>{hospital.phone}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-slate-600">
                                <Building2 className="h-4 w-4 text-slate-400 flex-shrink-0" />
                                <span>{hospital.beds} Beds</span>
                              </div>
                            </div>

                            {/* Departments */}
                            <div className="mb-4">
                              <p className="text-xs font-semibold text-slate-700 mb-2">Departments:</p>
                              <div className="flex flex-wrap gap-1">
                                {hospital.departments.slice(0, 3).map((dept, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs border-green-200 text-green-700">
                                    {dept}
                                  </Badge>
                                ))}
                                {hospital.departments.length > 3 && (
                                  <Badge variant="outline" className="text-xs border-slate-200 text-slate-600">
                                    +{hospital.departments.length - 3} more
                                  </Badge>
                                )}
                              </div>
                            </div>

                            {/* Accreditation */}
                            <div className="mb-4">
                              <p className="text-xs font-semibold text-slate-700 mb-2">Accreditation:</p>
                              <div className="flex gap-2">
                                {hospital.accreditation.map((acc, idx) => (
                                  <Badge key={idx} className="bg-blue-100 text-blue-700 text-xs">
                                    {acc}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                              <Button 
                                className="flex-1 bg-green-600 hover:bg-green-700"
                                onClick={() => {
                                  setActiveTab('appointments');
                                  toast({
                                    title: "Opening Appointments",
                                    description: `Book an appointment at ${hospital.name}`
                                  });
                                }}
                              >
                                <Calendar className="h-4 w-4 mr-2" />
                                Book Appointment
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Labs View */}
                {doctorsTabView === 'labs' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {getFilteredLabs().map((lab) => (
                      <Card key={lab.id} className="border border-slate-200 hover:shadow-xl transition-all duration-300 overflow-hidden">
                        <CardContent className="p-0">
                          {/* Lab Image */}
                          <div className="relative h-48 overflow-hidden bg-slate-100">
                            <img 
                              src={lab.image} 
                              alt={lab.name}
                              className="w-full h-full object-cover"
                            />
                            {lab.homeCollection && (
                              <Badge className="absolute top-3 right-3 bg-purple-600 text-white border-0">
                                Home Collection
                              </Badge>
                            )}
                          </div>

                          {/* Lab Info */}
                          <div className="p-5">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h4 className="font-bold text-slate-900 text-lg mb-1">{lab.name}</h4>
                                <p className="text-sm text-purple-600 font-medium">{lab.type}</p>
                              </div>
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="font-semibold text-slate-800">{lab.rating}</span>
                              </div>
                            </div>

                            <div className="space-y-2 mb-4">
                              <div className="flex items-start gap-2 text-sm text-slate-600">
                                <MapPin className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                                <span>{lab.location}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-slate-600">
                                <Phone className="h-4 w-4 text-slate-400 flex-shrink-0" />
                                <span>{lab.phone}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-slate-600">
                                <Clock className="h-4 w-4 text-slate-400 flex-shrink-0" />
                                <span>Reports: {lab.reportTime}</span>
                              </div>
                            </div>

                            {/* Test Categories */}
                            <div className="mb-4">
                              <p className="text-xs font-semibold text-slate-700 mb-2">Test Categories:</p>
                              <div className="flex flex-wrap gap-1">
                                {lab.testCategories.slice(0, 3).map((category, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs border-purple-200 text-purple-700">
                                    {category}
                                  </Badge>
                                ))}
                                {lab.testCategories.length > 3 && (
                                  <Badge variant="outline" className="text-xs border-slate-200 text-slate-600">
                                    +{lab.testCategories.length - 3} more
                                  </Badge>
                                )}
                              </div>
                            </div>

                            {/* Accreditation */}
                            <div className="mb-4">
                              <p className="text-xs font-semibold text-slate-700 mb-2">Accreditation:</p>
                              <div className="flex gap-2">
                                {lab.accreditation.map((acc, idx) => (
                                  <Badge key={idx} className="bg-blue-100 text-blue-700 text-xs">
                                    {acc}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            {/* Price */}
                            <div className="mb-4 p-3 bg-green-50 rounded-lg">
                              <p className="text-sm font-semibold text-green-700">{lab.price}</p>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                              <Button 
                                className="flex-1 bg-purple-600 hover:bg-purple-700"
                                onClick={() => {
                                  setActiveTab('appointments');
                                  toast({
                                    title: "Opening Appointments",
                                    description: `Book a test at ${lab.name}`
                                  });
                                }}
                              >
                                <TestTube className="h-4 w-4 mr-2" />
                                Book Test
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Appointments Tab Content */}
            {activeTab === "appointments" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-slate-800">My Appointments</h3>
                  <Button 
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => setActiveTab("doctors")}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Book Appointment
                  </Button>
                </div>

                {/* Appointments Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Upcoming Appointments */}
                  <Card className="border-l-4 border-l-blue-500 shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600 mb-1">Upcoming</p>
                          <h3 className="text-3xl font-bold text-slate-800">
                            {appointments.filter(apt => 
                              ['scheduled', 'confirmed'].includes(apt.status) && 
                              new Date(apt.appointmentDate) >= new Date()
                            ).length}
                          </h3>
                        </div>
                        <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <Clock className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Completed Appointments */}
                  <Card className="border-l-4 border-l-green-500 shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600 mb-1">Completed</p>
                          <h3 className="text-3xl font-bold text-slate-800">
                            {appointments.filter(apt => apt.status === 'completed').length}
                          </h3>
                        </div>
                        <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCircle2 className="h-6 w-6 text-green-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Cancelled Appointments */}
                  <Card className="border-l-4 border-l-red-500 shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600 mb-1">Cancelled</p>
                          <h3 className="text-3xl font-bold text-slate-800">
                            {appointments.filter(apt => apt.status === 'cancelled').length}
                          </h3>
                        </div>
                        <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                          <X className="h-6 w-6 text-red-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Appointments List */}
                {appointments.length > 0 ? (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-slate-800">All Appointments</h4>
                    {appointments.map((appointment) => (
                      <Card key={appointment.id || appointment._id} className="border border-green-200/60 shadow-xl bg-white hover:shadow-2xl transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <Avatar className="h-14 w-14 ring-2 ring-green-100">
                                <AvatarImage src="/placeholder.svg" alt={appointment.doctorName} />
                                <AvatarFallback className="bg-green-100 text-green-700 text-lg font-semibold">
                                  {appointment.doctorName?.split(' ').map(n => n[0]).join('') || 'DR'}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-semibold text-slate-800 text-lg">
                                  {appointment.doctorName}
                                </h4>
                                <p className="text-sm text-green-600 font-medium">{appointment.doctorSpecialty}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Building2 className="h-3.5 w-3.5 text-slate-400" />
                                  <p className="text-sm text-slate-600">{appointment.hospital}</p>
                                </div>
                                <div className="flex items-center gap-4 mt-2">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                                    <p className="text-sm text-slate-600">
                                      {new Date(appointment.appointmentDate).toLocaleDateString('en-US', { 
                                        weekday: 'short', 
                                        year: 'numeric', 
                                        month: 'short', 
                                        day: 'numeric' 
                                      })}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                                    <p className="text-sm text-slate-600">{appointment.appointmentTime}</p>
                                  </div>
                                </div>
                                <p className="text-xs text-slate-500 mt-1">
                                  <span className="font-medium">Reason:</span> {appointment.reasonForVisit}
                                </p>
                              </div>
                            </div>
                            <div className="text-right flex flex-col items-end space-y-2">
                              <Badge 
                                className={
                                  appointment.status === 'scheduled' ? "bg-blue-100 text-blue-700 border-blue-200" :
                                  appointment.status === 'confirmed' ? "bg-green-100 text-green-700 border-green-200" :
                                  appointment.status === 'completed' ? "bg-gray-100 text-gray-700 border-gray-200" :
                                  "bg-red-100 text-red-700 border-red-200"
                                }
                              >
                                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                              </Badge>
                              <div className="mt-2">
                                <p className="text-xs text-slate-500">Consultation Fee</p>
                                <p className="text-lg font-bold text-green-600">₹{appointment.consultationFee || appointment.totalAmount}</p>
                              </div>
                              <div className="flex gap-2 mt-2">
                                <Button size="sm" variant="outline" className="border-slate-300 hover:bg-slate-100">
                                  <Eye className="h-4 w-4 mr-1" /> View
                                </Button>
                                {(appointment.status === 'scheduled' || appointment.status === 'confirmed') && (
                                  <Button 
                                    size="sm" 
                                    variant="destructive" 
                                    className="bg-red-600 hover:bg-red-700"
                                    onClick={() => {
                                      if (window.confirm('Are you sure you want to cancel this appointment?')) {
                                        // Handle cancel appointment
                                        toast({
                                          title: "Appointment Cancelled",
                                          description: "Your appointment has been cancelled.",
                                        });
                                      }
                                    }}
                                  >
                                    <X className="h-4 w-4 mr-1" /> Cancel
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="border border-green-200/60 shadow-xl bg-white">
                    <CardContent className="p-8 text-center">
                      <Calendar className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-slate-800 mb-2">No Appointments Scheduled</h3>
                      <p className="text-slate-600 mb-6">
                        You haven't booked any appointments yet. Start by finding a doctor that suits your needs.
                      </p>
                      <Button 
                        onClick={() => setActiveTab("doctors")}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Find a Doctor
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Medicines Tab Content */}
            {activeTab === "medicines" && (
              <div className="space-y-6">
                {/* Header with Cart */}
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-slate-800">Medicine Shop</h3>
                  <div className="flex items-center gap-4">
                    <Button 
                      variant="outline" 
                      className="relative border-green-200 hover:bg-green-50"
                      onClick={() => navigate('/cart')}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Cart
                      {getCartCount() > 0 && (
                        <Badge className="absolute -top-2 -right-2 bg-red-600 text-white h-5 w-5 flex items-center justify-center p-0 text-xs">
                          {getCartCount()}
                        </Badge>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Search and Filters */}
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search medicines by name, category, or condition..."
                      value={medicineSearchTerm}
                      onChange={(e) => setMedicineSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex gap-2">
                    <label htmlFor="medicine-category" className="sr-only">Filter medicines by category</label>
                    <select
                      id="medicine-category"
                      value={medicineCategory}
                      onChange={(e) => setMedicineCategory(e.target.value)}
                      className="px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent min-w-[180px]"
                      title="Filter medicines by category"
                      aria-label="Filter medicines by category"
                    >
                      <option value="all">All Categories</option>
                      {getMedicineCategories().filter(c => c !== 'all').map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Medicines Grid */}
                {getFilteredMedicines().length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {getFilteredMedicines().map((medicine) => (
                      <Card 
                        key={medicine.id} 
                        className="group border border-slate-200 hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden"
                        onClick={() => {
                          navigate('/view-medicine', { state: { medicine } });
                        }}
                      >
                        <CardContent className="p-0">
                          {/* Medicine Image */}
                          <div className="relative h-48 overflow-hidden bg-slate-100">
                            <img 
                              src={medicine.image} 
                              alt={medicine.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            {medicine.discount > 0 && (
                              <Badge className="absolute top-3 left-3 bg-red-600 text-white border-0">
                                {medicine.discount}% OFF
                              </Badge>
                            )}
                            {medicine.prescription && (
                              <Badge className="absolute top-3 right-3 bg-blue-600 text-white border-0 text-xs">
                                Rx Required
                              </Badge>
                            )}
                            {!medicine.inStock && (
                              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                <Badge className="bg-red-600 text-white">Out of Stock</Badge>
                              </div>
                            )}
                          </div>

                          {/* Medicine Info */}
                          <div className="p-4">
                            <div className="mb-3">
                              <h4 className="font-bold text-slate-900 text-base line-clamp-2 mb-1">
                                {medicine.name}
                              </h4>
                              <p className="text-xs text-slate-600">{medicine.genericName}</p>
                              <p className="text-xs text-green-600 font-medium mt-1">{medicine.category}</p>
                            </div>

                            {/* Rating */}
                            <div className="flex items-center gap-1 mb-3">
                              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-semibold text-slate-800">{medicine.rating}</span>
                              <span className="text-xs text-slate-500 ml-1">({medicine.packSize})</span>
                            </div>

                            {/* Price Section */}
                            <div className="mb-3">
                              <div className="flex items-center gap-2">
                                <span className="text-xl font-bold text-slate-900">₹{medicine.price}</span>
                                {medicine.discount > 0 && (
                                  <span className="text-sm text-slate-400 line-through">₹{medicine.mrp}</span>
                                )}
                              </div>
                              <p className="text-xs text-slate-500 mt-0.5">{medicine.dosageForm} • {medicine.strength}</p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                              <Button 
                                size="sm"
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                                disabled={!medicine.inStock}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  addToCart(medicine);
                                }}
                              >
                                <ShoppingCart className="h-3.5 w-3.5 mr-1" />
                                Add to Cart
                              </Button>
                              <Button 
                                size="sm"
                                variant="outline"
                                className="px-3 border-green-200 hover:bg-green-50"
                                disabled={!medicine.inStock}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate('/view-medicine', { state: { medicine, buyNow: true } });
                                }}
                              >
                                <Zap className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="border border-green-200/60 shadow-xl bg-white">
                    <CardContent className="p-8 text-center">
                      <Pill className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-slate-800 mb-2">No Medicines Found</h3>
                      <p className="text-slate-600 mb-6">
                        {medicineSearchTerm || medicineCategory !== 'all' 
                          ? 'Try adjusting your search or filter criteria.' 
                          : 'No medicines available at the moment.'}
                      </p>
                      <Button 
                        onClick={() => {
                          setMedicineSearchTerm('');
                          setMedicineCategory('all');
                        }}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Clear Filters
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Payment & Billing Tab Content */}
            {activeTab === "payment" && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-800">Payment & Billing</h3>



                {/* Payment Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="border border-green-200/60 shadow-xl bg-white">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
                          <Wallet className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Total Spent</p>
                          <p className="text-2xl font-bold text-slate-800">₹0.00</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-green-200/60 shadow-xl bg-white">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                          <Receipt className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Pending Bills</p>
                          <p className="text-2xl font-bold text-slate-800">₹0.00</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-green-200/60 shadow-xl bg-white">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
                          <CreditCard className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Payment Methods</p>
                          <p className="text-2xl font-bold text-slate-800">0</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Empty State */}
                <Card className="border border-green-200/60 shadow-xl bg-white">
                  <CardContent className="p-8 text-center">
                    <CreditCard className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">No Payment History</h3>
                    <p className="text-slate-600 mb-6">
                      Your payment history and billing information will appear here after your first appointment.
                    </p>
                    <Button className="bg-green-600 hover:bg-green-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Payment Method
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Help & Support Tab Content */}
            {activeTab === "help" && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-800">Help & Support</h3>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="border border-green-200/60 shadow-xl bg-white hover:shadow-2xl transition-shadow cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <MessageCircle className="h-8 w-8 text-green-600 mx-auto mb-3" />
                      <h4 className="font-semibold text-slate-800 mb-2">Live Chat</h4>
                      <p className="text-sm text-slate-600">Get instant help from our support team</p>
                    </CardContent>
                  </Card>

                  <Card className="border border-green-200/60 shadow-xl bg-white hover:shadow-2xl transition-shadow cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <Phone className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                      <h4 className="font-semibold text-slate-800 mb-2">Call Support</h4>
                      <p className="text-sm text-slate-600">Speak directly with our team</p>
                    </CardContent>
                  </Card>

                  <Card className="border border-green-200/60 shadow-xl bg-white hover:shadow-2xl transition-shadow cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <Mail className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                      <h4 className="font-semibold text-slate-800 mb-2">Email Us</h4>
                      <p className="text-sm text-slate-600">Send us your questions via email</p>
                    </CardContent>
                  </Card>

                  <Card className="border border-green-200/60 shadow-xl bg-white hover:shadow-2xl transition-shadow cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <HelpCircle className="h-8 w-8 text-orange-600 mx-auto mb-3" />
                      <h4 className="font-semibold text-slate-800 mb-2">FAQ</h4>
                      <p className="text-sm text-slate-600">Find answers to common questions</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Contact Information */}
                <Card className="border border-green-200/60 shadow-xl bg-white">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Phone className="h-5 w-5 text-green-600" />
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-slate-800 mb-2">Emergency Support</h4>
                        <p className="text-slate-600">24/7 Emergency Line</p>
                        <p className="font-semibold text-green-600">+1 (555) 911-HELP</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-800 mb-2">General Support</h4>
                        <p className="text-slate-600">Mon-Fri, 8AM-6PM EST</p>
                        <p className="font-semibold text-blue-600">+1 (555) 123-CARE</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* FAQ Section */}
                <Card className="border border-green-200/60 shadow-xl bg-white">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <HelpCircle className="h-5 w-5 text-green-600" />
                      Frequently Asked Questions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      {
                        question: "How do I book my first appointment?",
                        answer: "Go to the 'Doctors & Labs' tab, search for a doctor, and click 'Book Now'."
                      },
                      {
                        question: "How can I access my medical records?",
                        answer: "Visit the 'Medical Records' tab to view all your consultation history and reports."
                      },
                      {
                        question: "What payment methods do you accept?",
                        answer: "We accept all major credit cards, debit cards, and health insurance plans."
                      },
                      {
                        question: "How do I update my profile information?",
                        answer: "Go to 'Profile & Settings' to update your personal and medical information."
                      }
                    ].map((faq, index) => (
                      <div key={index} className="border-b border-slate-200 pb-4 last:border-b-0">
                        <h5 className="font-semibold text-slate-800 mb-2">{faq.question}</h5>
                        <p className="text-slate-600 text-sm">{faq.answer}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Appointment Booking Modal */}
      <AppointmentBookingModal
        open={bookingModalOpen}
        onOpenChange={setBookingModalOpen}
        doctor={selectedDoctor}
        onBookingSuccess={async () => {
          await fetchAppointments();
          await fetchDashboardData();
          await fetchDoctors();
          setActiveTab("appointments");
        }}
      />
    </div>
  );
};

export default DynamicDashboard;
