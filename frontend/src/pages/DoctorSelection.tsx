import { useEffect, useState } from "react";
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
import { api } from "@/lib/api";

interface Doctor {
  _id: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar: string;
  };
  specialty: string;
  availability: {
    day: string;
    startTime: string;
    endTime: string;
  }[];
  consultationFee: number;
  experience: number;
  qualifications: string[];
  hospital: string;
  bio: string;
  rating: number;
  nextAvailable: string;
  availableToday: boolean;
}

const DoctorSelection = () => {
  const navigate = useNavigate();
  
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("");
  const [hospitalFilter, setHospitalFilter] = useState("");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await api.get('/doctors');
        setDoctors(response.data);
      } catch (error) {
        console.error("Failed to fetch doctors:", error);
        // Optionally, set some error state to show in the UI
      }
    };

    fetchDoctors();
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  const handleSelectDoctor = (doctor: Doctor) => {
    navigate("/appointment-booking", { 
      state: { 
        selectedDoctor: {
          ...doctor,
          // The backend sends the full user object, but the booking page might expect a simpler structure.
          // We'll pass the full doctor object and adapt the booking page if needed.
          id: doctor._id,
          name: `${doctor.userId.firstName} ${doctor.userId.lastName}`,
          avatar: doctor.userId.avatar,
        }
      }
    });
  };

  const filteredDoctors = doctors.filter(doctor => {
    const fullName = `${doctor.userId.firstName} ${doctor.userId.lastName}`;
    const matchesSearch = 
      fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
              key={doctor._id} 
              className="border border-green-200/60 shadow-xl bg-gradient-to-br from-white/95 to-green-50/95 hover:shadow-2xl transition-all duration-300 cursor-pointer"
              onClick={() => handleSelectDoctor(doctor)}
            >
              <CardHeader className="bg-gradient-to-r from-green-100/80 to-green-50/80 border-b border-green-200/60">
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16 ring-2 ring-green-400/40">
                    <AvatarImage src={doctor.userId.avatar} alt={`${doctor.userId.firstName} ${doctor.userId.lastName}`} />
                    <AvatarFallback className="bg-gradient-to-br from-green-500 to-green-600 text-white font-bold text-lg">
                      {`${doctor.userId.firstName[0]}${doctor.userId.lastName[0]}`}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-lg text-slate-800">{`${doctor.userId.firstName} ${doctor.userId.lastName}`}</CardTitle>
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
                      <span className="truncate">{doctor.bio}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Clock className="h-4 w-4 text-green-600" />
                      <span>{doctor.experience} years experience</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <span className="text-slate-600">Consultation Fee:</span>
                      <p className="font-semibold text-slate-800">${doctor.consultationFee}</p>
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
