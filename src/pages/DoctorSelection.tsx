import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft, 
  Search, 
  Star, 
  MapPin, 
  Clock, 
  Phone, 
  Mail, 
  Stethoscope,
  Filter,
  X
} from "lucide-react";

interface Doctor {
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
  availableToday: boolean;
  nextAvailable: string;
}

const DoctorSelection = () => {
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("");
  const [hospitalFilter, setHospitalFilter] = useState("");

  // Doctors from demo store
  const [doctors] = useState<Doctor[]>(() => {
    try {
      const raw = localStorage.getItem('demo.doctors');
      if (raw) return JSON.parse(raw);
    } catch {}
    return [
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
      nextAvailable: "Today, 2:00 PM"
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
      nextAvailable: "Today, 10:00 AM"
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
      nextAvailable: "Tomorrow, 9:00 AM"
    },
    {
      id: "doc-004",
      name: "Dr. Robert Wilson",
      specialty: "Orthopedics",
      hospital: "Sports Medicine Center",
      phone: "+1 (555) 456-7890",
      email: "dr.robert.wilson@sportsmed.com",
      address: "321 Sports Avenue, City, State 12345",
      rating: 4.7,
      experience: "20 years",
      consultationFee: "$180",
      avatar: "/placeholder.svg",
      availableToday: true,
      nextAvailable: "Today, 3:00 PM"
    },
    {
      id: "doc-005",
      name: "Dr. Lisa Rodriguez",
      specialty: "Pediatrics",
      hospital: "Children's Hospital",
      phone: "+1 (555) 567-8901",
      email: "dr.lisa.rodriguez@childrenshospital.com",
      address: "654 Kids Street, City, State 12345",
      rating: 4.9,
      experience: "14 years",
      consultationFee: "$110",
      avatar: "/placeholder.svg",
      availableToday: true,
      nextAvailable: "Today, 1:00 PM"
    },
    {
      id: "doc-006",
      name: "Dr. James Thompson",
      specialty: "Neurology",
      hospital: "Neurological Institute",
      phone: "+1 (555) 678-9012",
      email: "dr.james.thompson@neuroinstitute.com",
      address: "987 Brain Street, City, State 12345",
      rating: 4.8,
      experience: "22 years",
      consultationFee: "$200",
      avatar: "/placeholder.svg",
      availableToday: false,
      nextAvailable: "Wednesday, 11:00 AM"
    }
  ];
  });

  const handleBack = () => {
    navigate(-1);
  };

  const handleSelectDoctor = (doctor: Doctor) => {
    navigate("/appointment-booking", { 
      state: { 
        selectedDoctor: doctor
      }
    });
  };

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = 
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.hospital.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSpecialty = !specialtyFilter || doctor.specialty === specialtyFilter;
    const matchesHospital = !hospitalFilter || doctor.hospital === hospitalFilter;
    
    return matchesSearch && matchesSpecialty && matchesHospital;
  });

  const specialties = [...new Set(doctors.map(doc => doc.specialty))];
  const hospitals = [...new Set(doctors.map(doc => doc.hospital))];

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
                <h1 className="text-2xl font-bold text-slate-800">Select a Doctor</h1>
                <p className="text-slate-600">Choose a healthcare provider for your appointment</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search and Filters */}
        <Card className="border border-green-200/60 shadow-xl bg-gradient-to-br from-white/95 to-green-50/95 mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search doctors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-green-200 focus:border-green-500 focus:ring-green-500"
                />
              </div>

              {/* Specialty Filter */}
              <div>
                <select
                  value={specialtyFilter}
                  onChange={(e) => setSpecialtyFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-green-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                >
                  <option value="">All Specialties</option>
                  {specialties.map((specialty) => (
                    <option key={specialty} value={specialty}>{specialty}</option>
                  ))}
                </select>
              </div>

              {/* Hospital Filter */}
              <div>
                <select
                  value={hospitalFilter}
                  onChange={(e) => setHospitalFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-green-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                >
                  <option value="">All Hospitals</option>
                  {hospitals.map((hospital) => (
                    <option key={hospital} value={hospital}>{hospital}</option>
                  ))}
                </select>
              </div>

              {/* Clear Filters */}
              {(searchQuery || specialtyFilter || hospitalFilter) && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setSpecialtyFilter("");
                    setHospitalFilter("");
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

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => (
            <Card 
              key={doctor.id} 
              className="border border-green-200/60 shadow-xl bg-gradient-to-br from-white/95 to-green-50/95 hover:shadow-2xl transition-all duration-300 cursor-pointer"
              onClick={() => handleSelectDoctor(doctor)}
            >
              <CardHeader className="bg-gradient-to-r from-green-100/80 to-green-50/80 border-b border-green-200/60">
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16 ring-2 ring-green-400/40">
                    <AvatarImage src={doctor.avatar} alt={doctor.name} />
                    <AvatarFallback className="bg-gradient-to-br from-green-500 to-green-600 text-white font-bold text-lg">
                      {doctor.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-lg text-slate-800">{doctor.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className="bg-green-100 text-green-700 border-green-200">
                        {doctor.specialty}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium text-slate-700">{doctor.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Stethoscope className="h-4 w-4 text-green-600" />
                      <span>{doctor.hospital}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <MapPin className="h-4 w-4 text-green-600" />
                      <span className="truncate">{doctor.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Clock className="h-4 w-4 text-green-600" />
                      <span>{doctor.experience} experience</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <span className="text-slate-600">Consultation Fee:</span>
                      <p className="font-semibold text-slate-800">{doctor.consultationFee}</p>
                    </div>
                    <Badge className={doctor.availableToday ? "bg-green-100 text-green-700 border-green-200" : "bg-yellow-100 text-yellow-700 border-yellow-200"}>
                      {doctor.availableToday ? "Available Today" : "Next Available"}
                    </Badge>
                  </div>

                  <div className="text-xs text-slate-500">
                    Next available: {doctor.nextAvailable}
                  </div>

                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectDoctor(doctor);
                    }}
                  >
                    Book Appointment
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredDoctors.length === 0 && (
          <Card className="border border-green-200/60 shadow-xl bg-gradient-to-br from-white/95 to-green-50/95">
            <CardContent className="p-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 bg-green-100 rounded-full">
                  <Stethoscope className="h-12 w-12 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">No doctors found</h3>
                  <p className="text-slate-600 mb-4">
                    Try adjusting your search or filter criteria
                  </p>
                  <Button
                    onClick={() => {
                      setSearchQuery("");
                      setSpecialtyFilter("");
                      setHospitalFilter("");
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Clear All Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DoctorSelection;
