import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User, 
  Stethoscope, 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  CheckCircle2, 
  AlertCircle,
  Search,
  Filter,
  Plus,
  Video,
  Eye,
  MessageCircle,
  X,
  ChevronDown,
  ChevronUp,
  Clock3,
  FileText,
  Zap,
  Star,
  AlertTriangle,
  Info
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Appointment {
  id: string;
  doctor: string;
  specialty: string;
  hospital: string;
  date: string;
  time: string;
  type: "in-person" | "video" | "phone";
  reason: string;
  status: "confirmed" | "completed" | "cancelled" | "rescheduled";
  cost: string;
  notes?: string;
  doctorAvatar: string;
  doctorPhone: string;
  doctorEmail: string;
  doctorAddress: string;
  doctorRating: number;
}

const Appointments = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState<"upcoming" | "previous">("upcoming");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [expandedAppointment, setExpandedAppointment] = useState<string | null>(null);

  // Sample appointments data - in real app, this would come from API
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    try {
      const raw = localStorage.getItem('demo.appointments');
      if (raw) return JSON.parse(raw);
    } catch {}
    return [
      {
        id: "apt-001",
        doctor: "Dr. Sarah Johnson",
        specialty: "Cardiology",
        hospital: "City Medical Center",
        date: "2024-02-15",
        time: "2:00 PM",
        type: "in-person",
        reason: "Follow-up consultation for cardiac health",
        status: "confirmed",
        cost: "₹15,000",
        notes: "Please bring your recent lab results and medication list.",
        doctorAvatar: "/placeholder.svg",
        doctorPhone: "+1 (555) 123-4567",
        doctorEmail: "dr.sarah.johnson@citymedical.com",
        doctorAddress: "123 Medical Plaza, Suite 200, City, State 12345",
        doctorRating: 4.8
      },
      {
        id: "apt-002",
        doctor: "Dr. Michael Chen",
        specialty: "General Medicine",
        hospital: "Downtown Clinic",
        date: "2024-02-20",
        time: "10:00 AM",
        type: "video",
        reason: "Annual physical examination",
        status: "confirmed",
        cost: "$120",
        notes: "Video consultation - ensure stable internet connection.",
        doctorAvatar: "/placeholder.svg",
        doctorPhone: "+1 (555) 234-5678",
        doctorEmail: "dr.michael.chen@downtownclinic.com",
        doctorAddress: "456 Health Street, Downtown, State 12345",
        doctorRating: 4.6
      },
      {
        id: "apt-003",
        doctor: "Dr. Emily Davis",
        specialty: "Dermatology",
        hospital: "Skin Care Specialists",
        date: "2024-01-15",
        time: "3:00 PM",
        type: "in-person",
        reason: "Skin screening and mole check",
        status: "completed",
        cost: "$95",
        notes: "Appointment completed successfully. No concerns found.",
        doctorAvatar: "/placeholder.svg",
        doctorPhone: "+1 (555) 345-6789",
        doctorEmail: "dr.emily.davis@skincare.com",
        doctorAddress: "789 Beauty Lane, Suite 100, City, State 12345",
        doctorRating: 4.9
      },
      {
        id: "apt-004",
        doctor: "Dr. Robert Wilson",
        specialty: "Orthopedics",
        hospital: "Sports Medicine Center",
        date: "2024-01-10",
        time: "11:00 AM",
        type: "in-person",
        reason: "Knee pain evaluation",
        status: "completed",
        cost: "$180",
        notes: "Diagnosis: Mild knee strain. Recommended rest and physical therapy.",
        doctorAvatar: "/placeholder.svg",
        doctorPhone: "+1 (555) 456-7890",
        doctorEmail: "dr.robert.wilson@sportsmed.com",
        doctorAddress: "321 Sports Avenue, City, State 12345",
        doctorRating: 4.7
      }
    ];
  });

  // Add new appointment if coming from booking page
  useEffect(() => {
    if (location.state?.newAppointment) {
      const newAppt = location.state.newAppointment;
      
      // Check if appointment already exists in localStorage (to prevent duplicates)
      const existingAppointments = JSON.parse(localStorage.getItem('demo.appointments') || '[]');
      const appointmentExists = existingAppointments.some((apt: Appointment) => 
        apt.doctor === newAppt.doctor && 
        apt.date === newAppt.date && 
        apt.time === newAppt.time
      );
      
      if (appointmentExists) {
        console.log("Appointment already exists, skipping duplicate creation");
        // Just refresh the appointments from localStorage
        setAppointments(existingAppointments);
        return;
      }
      
      const newAppointment: Appointment = {
        id: `apt-${Date.now()}`,
        doctor: newAppt.doctor,
        specialty: newAppt.specialty,
        hospital: newAppt.hospital || "City Medical Center", // Use provided hospital or default
        date: newAppt.date,
        time: newAppt.time,
        type: newAppt.type,
        reason: newAppt.reason,
        status: newAppt.status,
        cost: newAppt.cost || "₹15,000", // Use provided cost or default
        doctorAvatar: "/placeholder.svg",
        doctorPhone: newAppt.doctorPhone || "+1 (555) 123-4567",
        doctorEmail: newAppt.doctorEmail || "doctor@hospital.com",
        doctorAddress: newAppt.doctorAddress || "123 Medical Plaza, City, State 12345",
        doctorRating: newAppt.doctorRating || 4.8
      };
      
      console.log("Adding new appointment:", newAppointment);
      console.log("Is upcoming?", isUpcoming(newAppointment.date));
      
      setAppointments(prev => {
        const exists = prev.some(apt => apt.id === newAppointment.id);
        const updated = exists ? prev : [newAppointment, ...prev];
        localStorage.setItem('demo.appointments', JSON.stringify(updated));
        
        // Dispatch custom event to notify other components
        window.dispatchEvent(new CustomEvent('appointmentUpdated', { 
          detail: { appointments: updated } 
        }));
        
        return updated;
      });
    }
  }, [location.state, navigate]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleBookNew = () => {
    navigate("/doctor-selection");
  };

  const handleCancelAppointment = (appointmentId: string) => {
    setAppointments(prev => {
      const updated = prev.map(apt => 
        apt.id === appointmentId 
          ? { ...apt, status: "cancelled" as const }
          : apt
      );
      localStorage.setItem('demo.appointments', JSON.stringify(updated));
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('appointmentUpdated', { 
        detail: { appointments: updated } 
      }));
      
      return updated;
    });
    
    toast({
      title: "Appointment Cancelled",
      description: "Your appointment has been cancelled successfully.",
    });
  };

  const handleReschedule = (appointmentId: string) => {
    // In real app, this would navigate to rescheduling page
    toast({
      title: "Reschedule Appointment",
      description: "Redirecting to rescheduling page...",
    });
  };

  const handleViewDetails = (appointmentId: string) => {
    setExpandedAppointment(expandedAppointment === appointmentId ? null : appointmentId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-700 border-green-200";
      case "completed":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      case "rescheduled":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-4 w-4" />;
      case "phone":
        return <Phone className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "video":
        return "Video Call";
      case "phone":
        return "Phone Call";
      default:
        return "In-Person";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const isUpcoming = (dateString: string) => {
    // Ensure proper date parsing
    const appointmentDate = new Date(dateString + 'T00:00:00'); // Add time to ensure proper parsing
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    appointmentDate.setHours(0, 0, 0, 0); // Normalize appointment date to start of day
    
    console.log("Checking if upcoming:", {
      dateString,
      appointmentDate: appointmentDate.toISOString(),
      today: today.toISOString(),
      isUpcoming: appointmentDate >= today
    });
    
    return appointmentDate >= today;
  };

  const isCompleted = (status: string) => {
    return status === "completed";
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = 
      appointment.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.hospital.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.reason.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = !statusFilter || appointment.status === statusFilter;
    const matchesType = !typeFilter || appointment.type === typeFilter;
    const matchesTab = activeTab === "upcoming" ? isUpcoming(appointment.date) : isCompleted(appointment.status);
    
    return matchesSearch && matchesStatus && matchesType && matchesTab;
  });

  const upcomingAppointments = appointments.filter(apt => isUpcoming(apt.date));
  const previousAppointments = appointments.filter(apt => isCompleted(apt.status));

  // Debug: Log appointments whenever they change
  useEffect(() => {
    console.log("All appointments:", appointments);
    console.log("Upcoming appointments:", upcomingAppointments);
    console.log("Previous appointments:", previousAppointments);
  }, [appointments, upcomingAppointments, previousAppointments]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50/30 to-green-100/20">
      {/* Header */}
      <div className="bg-white border-b border-green-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBack}
                className="hover:bg-green-100"
              >
                <ArrowLeft className="h-5 w-5 text-green-600" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">My Appointments</h1>
                <p className="text-slate-600">Manage your healthcare appointments</p>
              </div>
            </div>
            
            <Button
              onClick={handleBookNew}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Book New Appointment
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-1 bg-white rounded-lg border border-green-200 p-1">
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === "upcoming"
                  ? "bg-green-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-800 hover:bg-green-50"
              }`}
            >
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Upcoming ({upcomingAppointments.length})
              </div>
            </button>
            <button
              onClick={() => setActiveTab("previous")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === "previous"
                  ? "bg-green-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-800 hover:bg-green-50"
              }`}
            >
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Previous ({previousAppointments.length})
              </div>
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="border border-green-200/60 shadow-xl bg-gradient-to-br from-white/95 to-green-50/95 mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search appointments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Status Filter */}
              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                >
                  <option value="">All Statuses</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="rescheduled">Rescheduled</option>
                </select>
              </div>

              {/* Type Filter */}
              <div>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                >
                  <option value="">All Types</option>
                  <option value="in-person">In-Person</option>
                  <option value="video">Video Call</option>
                  <option value="phone">Phone Call</option>
                </select>
              </div>

              {/* Clear Filters */}
              {(searchQuery || statusFilter || typeFilter) && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("");
                    setTypeFilter("");
                  }}
                  className="border-green-200 text-green-700 hover:bg-green-50"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Appointments List */}
        <div className="space-y-4">
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((appointment) => (
              <Card key={appointment.id} className="border border-green-200/60 shadow-xl bg-gradient-to-br from-white/95 to-green-50/95 hover:shadow-2xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <Avatar className="h-16 w-16 ring-2 ring-green-400/40">
                        <AvatarImage src={appointment.doctorAvatar} alt={appointment.doctor} />
                        <AvatarFallback className="bg-gradient-to-br from-green-500 to-green-600 text-white font-bold text-lg">
                          {appointment.doctor.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-xl font-bold text-slate-800">{appointment.doctor}</h3>
                            <div className="flex items-center gap-3 mt-1">
                              <Badge className="bg-green-100 text-green-700 border-green-200">
                                {appointment.specialty}
                              </Badge>
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                <span className="text-sm font-medium text-slate-700">{appointment.doctorRating}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <Badge className={getStatusColor(appointment.status)}>
                              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                            </Badge>
                            <p className="text-sm text-slate-600 mt-1">{appointment.cost}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center gap-2 text-slate-600">
                            <Building2 className="h-4 w-4 text-green-600" />
                            <span>{appointment.hospital}</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-600">
                            <Calendar className="h-4 w-4 text-green-600" />
                            <span>{formatDate(appointment.date)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-600">
                            <Clock className="h-4 w-4 text-green-600" />
                            <span>{appointment.time}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            {getTypeIcon(appointment.type)}
                            <span className="text-sm text-slate-600">{getTypeLabel(appointment.type)}</span>
                          </div>
                          <span className="text-slate-400">•</span>
                          <span className="text-sm text-slate-600">{appointment.reason}</span>
                        </div>

                        {/* Expanded Details */}
                        {expandedAppointment === appointment.id && (
                          <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-3">
                                <h4 className="font-semibold text-slate-800">Doctor Contact Information</h4>
                                <div className="space-y-2 text-sm">
                                  <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-green-600" />
                                    <span>{appointment.doctorPhone}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-green-600" />
                                    <span>{appointment.doctorEmail}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-green-600" />
                                    <span className="truncate">{appointment.doctorAddress}</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="space-y-3">
                                <h4 className="font-semibold text-slate-800">Appointment Details</h4>
                                {appointment.notes && (
                                  <div className="text-sm text-slate-700 bg-white p-3 rounded border">
                                    <strong>Notes:</strong> {appointment.notes}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(appointment.id)}
                        className="border-green-200 text-green-700 hover:bg-green-50"
                      >
                        {expandedAppointment === appointment.id ? (
                          <>
                            <ChevronUp className="h-4 w-4 mr-1" />
                            Less
                          </>
                        ) : (
                          <>
                            <Eye className="h-4 w-4 mr-1" />
                            Details
                          </>
                        )}
                      </Button>

                      {appointment.status === "confirmed" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleReschedule(appointment.id)}
                            className="border-blue-200 text-blue-700 hover:bg-blue-50"
                          >
                            <Clock className="h-4 w-4 mr-1" />
                            Reschedule
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCancelAppointment(appointment.id)}
                            className="border-red-200 text-red-700 hover:bg-red-50"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Cancel
                          </Button>
                        </>
                      )}

                      {appointment.status === "confirmed" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-green-200 text-green-700 hover:bg-green-50"
                        >
                          <MessageCircle className="h-4 w-4 mr-1" />
                          Message
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="border border-green-200/60 shadow-xl bg-gradient-to-br from-white/95 to-green-50/95">
              <CardContent className="p-12 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="p-4 bg-green-100 rounded-full">
                    <Calendar className="h-12 w-12 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">
                      {searchQuery || statusFilter || typeFilter 
                        ? "No appointments found" 
                        : `No ${activeTab} appointments`}
                    </h3>
                    <p className="text-slate-600 mb-4">
                      {searchQuery || statusFilter || typeFilter 
                        ? "Try adjusting your search or filter criteria"
                        : activeTab === "upcoming" 
                          ? "You don't have any upcoming appointments scheduled"
                          : "You don't have any previous appointments"}
                    </p>
                    {activeTab === "upcoming" && (
                      <Button
                        onClick={handleBookNew}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Book Your First Appointment
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Appointments;
