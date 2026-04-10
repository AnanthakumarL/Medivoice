import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  ChevronLeft,
  ChevronRight,
  Star,
  Clock3,
  FileText,
  MessageCircle,
  Video,
  Zap
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DoctorInfo {
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
  availableSlots: Array<{
    date: string;
    slots: Array<{
      time: string;
      available: boolean;
      type: "in-person" | "video" | "phone";
    }>;
  }>;
}

const AppointmentBooking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Get doctor info from location state or use sample data
  const [doctorInfo] = useState<DoctorInfo>(() => {
    const selectedDoctor = location.state?.selectedDoctor;
    if (selectedDoctor) {
      return {
        id: selectedDoctor.id,
        name: selectedDoctor.name,
        specialty: selectedDoctor.specialty,
        hospital: selectedDoctor.hospital,
        phone: selectedDoctor.phone,
        email: selectedDoctor.email,
        address: selectedDoctor.address,
        rating: selectedDoctor.rating,
        experience: selectedDoctor.experience,
        consultationFee: selectedDoctor.consultationFee,
        avatar: selectedDoctor.avatar,
        availableSlots: [
          {
            date: "2024-02-15",
            slots: [
              { time: "9:00 AM", available: true, type: "in-person" },
              { time: "10:00 AM", available: true, type: "video" },
              { time: "11:00 AM", available: false, type: "in-person" },
              { time: "2:00 PM", available: true, type: "phone" },
              { time: "3:00 PM", available: true, type: "in-person" },
              { time: "4:00 PM", available: true, type: "video" }
            ]
          },
          {
            date: "2024-02-16",
            slots: [
              { time: "9:00 AM", available: true, type: "in-person" },
              { time: "10:00 AM", available: true, type: "video" },
              { time: "11:00 AM", available: true, type: "in-person" },
              { time: "2:00 PM", available: true, type: "phone" },
              { time: "3:00 PM", available: false, type: "in-person" },
              { time: "4:00 PM", available: true, type: "video" }
            ]
          },
          {
            date: "2024-02-19",
            slots: [
              { time: "9:00 AM", available: true, type: "in-person" },
              { time: "10:00 AM", available: true, type: "video" },
              { time: "11:00 AM", available: true, type: "in-person" },
              { time: "2:00 PM", available: true, type: "phone" },
              { time: "3:00 PM", available: true, type: "in-person" },
              { time: "4:00 PM", available: true, type: "video" }
            ]
          }
        ]
      };
    }
    
    // Default doctor info if none selected
    return {
      id: "doc-001",
      name: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      hospital: "City Medical Center",
      phone: "+1 (555) 123-4567",
      email: "dr.sarah.johnson@citymedical.com",
      address: "123 Medical Plaza, Suite 200, City, State 12345",
      rating: 4.8,
      experience: "15 years",
      consultationFee: "$150",
      avatar: "/placeholder.svg",
      availableSlots: [
        {
          date: "2024-02-15",
          slots: [
            { time: "9:00 AM", available: true, type: "in-person" },
            { time: "10:00 AM", available: true, type: "video" },
            { time: "11:00 AM", available: false, type: "in-person" },
            { time: "2:00 PM", available: true, type: "phone" },
            { time: "3:00 PM", available: true, type: "in-person" },
            { time: "4:00 PM", available: true, type: "video" }
          ]
        },
        {
          date: "2024-02-16",
          slots: [
            { time: "9:00 AM", available: true, type: "in-person" },
            { time: "10:00 AM", available: true, type: "video" },
            { time: "11:00 AM", available: true, type: "in-person" },
            { time: "2:00 PM", available: true, type: "phone" },
            { time: "3:00 PM", available: false, type: "in-person" },
            { time: "4:00 PM", available: true, type: "video" }
          ]
        },
        {
          date: "2024-02-19",
          slots: [
            { time: "9:00 AM", available: true, type: "in-person" },
            { time: "10:00 AM", available: true, type: "video" },
            { time: "11:00 AM", available: true, type: "in-person" },
            { time: "2:00 PM", available: true, type: "phone" },
            { time: "3:00 PM", available: true, type: "in-person" },
            { time: "4:00 PM", available: true, type: "video" }
          ]
        }
      ]
    };
  });

  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedType, setSelectedType] = useState<"in-person" | "video" | "phone">("in-person");
  const [appointmentReason, setAppointmentReason] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [isBooking, setIsBooking] = useState(false);

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate(-1);
    }
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedTime("");
    setSelectedType("in-person");
  };

  const handleTimeSelect = (time: string, type: "in-person" | "video" | "phone") => {
    setSelectedTime(time);
    setSelectedType(type);
  };

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime || !appointmentReason) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsBooking(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    toast({
      title: "Appointment Booked Successfully!",
      description: `Your appointment with ${doctorInfo.name} has been confirmed for ${selectedDate} at ${selectedTime}. You can view it in your dashboard.`,
    });

    // Add notification to demo store
    const newNotification = {
      id: Date.now(),
      message: `Appointment booked successfully with ${doctorInfo.name} for ${formatDate(selectedDate)} at ${selectedTime}`,
      urgent: false,
      time: "Just now",
      type: "appointment"
    };
    
    const existingNotifications = JSON.parse(localStorage.getItem('demo.notifications') || '[]');
    const updatedNotifications = [newNotification, ...existingNotifications].slice(0, 20);
    localStorage.setItem('demo.notifications', JSON.stringify(updatedNotifications));

    // Create new appointment object
    const newAppointment = {
      id: `apt-${Date.now()}`,
      doctor: doctorInfo.name,
      specialty: doctorInfo.specialty,
      hospital: doctorInfo.hospital,
      date: selectedDate,
      time: selectedTime,
      type: selectedType,
      reason: appointmentReason,
      status: "confirmed",
      cost: doctorInfo.consultationFee,
      doctorAvatar: "/placeholder.svg",
      doctorPhone: doctorInfo.phone,
      doctorEmail: doctorInfo.email,
      doctorAddress: doctorInfo.address,
      doctorRating: doctorInfo.rating
    };

    // Save to localStorage immediately
    try {
      const existingAppointments = JSON.parse(localStorage.getItem('demo.appointments') || '[]');
      const updatedAppointments = [newAppointment, ...existingAppointments];
      localStorage.setItem('demo.appointments', JSON.stringify(updatedAppointments));
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('appointmentUpdated', { 
        detail: { appointments: updatedAppointments } 
      }));
      
      console.log('Appointment saved to localStorage:', newAppointment);
    } catch (error) {
      console.error('Error saving appointment to localStorage:', error);
    }

    // Set flag to auto-switch to appointments tab in dashboard
    sessionStorage.setItem('justBookedAppointment', 'true');

    // Navigate back to dashboard to show the new appointment
    navigate("/dashboard", { 
      state: { 
        newAppointment: {
          doctor: doctorInfo.name,
          specialty: doctorInfo.specialty,
          hospital: doctorInfo.hospital,
          date: selectedDate,
          time: selectedTime,
          type: selectedType,
          reason: appointmentReason,
          status: "confirmed",
          cost: doctorInfo.consultationFee,
          doctorPhone: doctorInfo.phone,
          doctorEmail: doctorInfo.email,
          doctorAddress: doctorInfo.address,
          doctorRating: doctorInfo.rating
        }
      }
    });
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
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getAvailableSlotsForDate = (date: string) => {
    return doctorInfo.availableSlots.find(slot => slot.date === date)?.slots || [];
  };

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
                <h1 className="text-2xl font-bold text-slate-800">Book Appointment</h1>
                <p className="text-slate-600">Schedule your consultation with {doctorInfo.name}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="text-sm text-slate-500">Step {currentStep} of 3</div>
              <div className="flex gap-1">
                {[1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className={`w-3 h-3 rounded-full ${
                      step <= currentStep ? 'bg-green-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Booking Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Doctor Information */}
            {currentStep === 1 && (
              <Card className="border border-green-200/60 shadow-xl bg-gradient-to-br from-white/95 to-green-50/95">
                <CardHeader className="bg-gradient-to-r from-green-100/80 to-green-50/80 border-b border-green-200/60">
                  <CardTitle className="flex items-center gap-2 text-slate-800">
                    <Stethoscope className="h-5 w-5 text-green-600" />
                    Doctor Information
                  </CardTitle>
                  <CardDescription>
                    Review doctor details and select appointment type
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex items-start gap-6">
                    <Avatar className="h-24 w-24 ring-4 ring-green-400/40">
                      <AvatarImage src={doctorInfo.avatar} alt={doctorInfo.name} />
                      <AvatarFallback className="bg-gradient-to-br from-green-500 to-green-600 text-white font-bold text-3xl">
                        {doctorInfo.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 space-y-4">
                      <div>
                        <h2 className="text-2xl font-bold text-slate-800">{doctorInfo.name}</h2>
                        <div className="flex items-center gap-3 mt-2">
                          <Badge className="bg-green-100 text-green-700 border-green-200">
                            {doctorInfo.specialty}
                          </Badge>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-medium text-slate-700">{doctorInfo.rating}</span>
                          </div>
                          <span className="text-sm text-slate-600">({doctorInfo.experience} experience)</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Building2 className="h-4 w-4 text-green-600" />
                          <span>{doctorInfo.hospital}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Phone className="h-4 w-4 text-green-600" />
                          <span>{doctorInfo.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Mail className="h-4 w-4 text-green-600" />
                          <span>{doctorInfo.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <MapPin className="h-4 w-4 text-green-600" />
                          <span className="truncate">{doctorInfo.address}</span>
                        </div>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock3 className="h-4 w-4 text-blue-600" />
                          <span className="font-semibold text-blue-800">Consultation Fee</span>
                        </div>
                        <p className="text-blue-700">{doctorInfo.consultationFee} per consultation</p>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-800">Appointment Type</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { type: "in-person", label: "In-Person Visit", description: "Visit the doctor at the clinic", icon: User, color: "green" },
                        { type: "video", label: "Video Consultation", description: "Meet via video call", icon: Video, color: "blue" },
                        { type: "phone", label: "Phone Consultation", description: "Consult over the phone", icon: Phone, color: "purple" }
                      ].map((option) => (
                        <div
                          key={option.type}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                            selectedType === option.type
                              ? `border-${option.color}-500 bg-${option.color}-50`
                              : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                          onClick={() => setSelectedType(option.type as any)}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg bg-${option.color}-100`}>
                              <option.icon className={`h-5 w-5 text-${option.color}-600`} />
                            </div>
                            <div>
                              <h4 className="font-semibold text-slate-800">{option.label}</h4>
                              <p className="text-sm text-slate-600">{option.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Date and Time Selection */}
            {currentStep === 2 && (
              <Card className="border border-green-200/60 shadow-xl bg-gradient-to-br from-white/95 to-green-50/95">
                <CardHeader className="bg-gradient-r from-green-100/80 to-green-50/80 border-b border-green-200/60">
                  <CardTitle className="flex items-center gap-2 text-slate-800">
                    <Calendar className="h-5 w-5 text-green-600" />
                    Select Date & Time
                  </CardTitle>
                  <CardDescription>
                    Choose your preferred appointment slot
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {/* Date Selection */}
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800 mb-4">Available Dates</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {doctorInfo.availableSlots.map((dateSlot) => (
                          <div
                            key={dateSlot.date}
                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                              selectedDate === dateSlot.date
                                ? 'border-green-500 bg-green-50'
                                : 'border-gray-200 bg-white hover:border-gray-300'
                            }`}
                            onClick={() => handleDateSelect(dateSlot.date)}
                          >
                            <div className="text-center">
                              <div className="text-lg font-bold text-slate-800">
                                {formatDate(dateSlot.date)}
                              </div>
                              <div className="text-sm text-slate-600">
                                {dateSlot.slots.filter(slot => slot.available).length} slots available
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Time Selection */}
                    {selectedDate && (
                      <div>
                        <h3 className="text-lg font-semibold text-slate-800 mb-4">
                          Available Times for {formatDate(selectedDate)}
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {getAvailableSlotsForDate(selectedDate)
                            .filter(slot => slot.available)
                            .map((slot, index) => (
                              <div
                                key={index}
                                className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                                  selectedTime === slot.time && selectedType === slot.type
                                    ? 'border-green-500 bg-green-50'
                                    : 'border-gray-200 bg-white hover:border-gray-300'
                                }`}
                                onClick={() => handleTimeSelect(slot.time, slot.type)}
                              >
                                <div className="text-center">
                                  <div className="text-lg font-bold text-slate-800">{slot.time}</div>
                                  <div className="flex items-center justify-center gap-1 mt-1">
                                    {getTypeIcon(slot.type)}
                                    <span className="text-xs text-slate-600">{getTypeLabel(slot.type)}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Appointment Details */}
            {currentStep === 3 && (
              <Card className="border border-green-200/60 shadow-xl bg-gradient-to-br from-white/95 to-green-50/95">
                <CardHeader className="bg-gradient-r from-green-100/80 to-green-50/80 border-b border-green-200/60">
                  <CardTitle className="flex items-center gap-2 text-slate-800">
                    <FileText className="h-5 w-5 text-green-600" />
                    Appointment Details
                  </CardTitle>
                  <CardDescription>
                    Provide reason and additional information
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {/* Appointment Summary */}
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <h3 className="font-semibold text-green-800 mb-3">Appointment Summary</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-green-700">Doctor:</span>
                          <p className="font-medium text-green-800">{doctorInfo.name}</p>
                        </div>
                        <div>
                          <span className="text-green-700">Date:</span>
                          <p className="font-medium text-green-800">{formatDate(selectedDate)}</p>
                        </div>
                        <div>
                          <span className="text-green-700">Time:</span>
                          <p className="font-medium text-green-800">{selectedTime}</p>
                        </div>
                        <div>
                          <span className="text-green-700">Type:</span>
                          <p className="font-medium text-green-800">{getTypeLabel(selectedType)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Reason for Visit */}
                    <div className="space-y-2">
                      <Label htmlFor="reason" className="text-sm font-semibold text-slate-700">
                        Reason for Visit <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="reason"
                        placeholder="Please describe the reason for your appointment..."
                        value={appointmentReason}
                        onChange={(e) => setAppointmentReason(e.target.value)}
                        className="min-h-[100px] border-green-200 focus:border-green-500 focus:ring-green-500"
                        required
                      />
                    </div>

                    {/* Additional Notes */}
                    <div className="space-y-2">
                      <Label htmlFor="notes" className="text-sm font-semibold text-slate-700">
                        Additional Notes (Optional)
                      </Label>
                      <Textarea
                        id="notes"
                        placeholder="Any additional information you'd like to share..."
                        value={additionalNotes}
                        onChange={(e) => setAdditionalNotes(e.target.value)}
                        className="min-h-[100px] border-green-200 focus:border-green-500 focus:ring-green-500"
                      />
                    </div>

                    {/* Terms and Conditions */}
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-blue-800">
                          <p className="font-semibold mb-2">Important Information:</p>
                          <ul className="space-y-1 text-blue-700">
                            <li>• Please arrive 15 minutes before your appointment time</li>
                            <li>• Bring your ID and insurance information</li>
                            <li>• For video calls, ensure stable internet connection</li>
                            <li>• Cancellation policy: 24 hours notice required</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={handleBack}
                className="border-green-200 text-green-700 hover:bg-green-50"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                {currentStep === 1 ? 'Back' : 'Previous'}
              </Button>

              {currentStep < 3 ? (
                <Button
                  onClick={handleNext}
                  disabled={currentStep === 2 && (!selectedDate || !selectedTime)}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleBooking}
                  disabled={!appointmentReason || isBooking}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {isBooking ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Booking...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Confirm Booking
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="border border-green-200/60 shadow-xl bg-gradient-to-br from-white/95 to-green-50/95">
              <CardHeader className="bg-gradient-r from-green-100/80 to-green-50/80 border-b border-green-200/60">
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <Zap className="h-5 w-5 text-green-600" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start border-green-200 text-green-700 hover:bg-green-50">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Message Doctor
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-green-200 text-green-700 hover:bg-green-50">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Office
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-green-200 text-green-700 hover:bg-green-50">
                    <MapPin className="h-4 w-4 mr-2" />
                    Get Directions
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Doctor Schedule */}
            <Card className="border border-green-200/60 shadow-xl bg-gradient-to-br from-white/95 to-green-50/95">
              <CardHeader className="bg-gradient-r from-green-100/80 to-green-50/80 border-b border-green-200/60">
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <Clock className="h-5 w-5 text-green-600" />
                  Office Hours
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Monday - Friday</span>
                    <span className="font-medium text-slate-800">9:00 AM - 5:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Saturday</span>
                    <span className="font-medium text-slate-800">9:00 AM - 1:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Sunday</span>
                    <span className="font-medium text-slate-800">Closed</span>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="text-center">
                  <p className="text-sm text-slate-600 mb-2">Emergency Contact</p>
                  <p className="text-sm font-medium text-slate-800">+1 (555) 911-0000</p>
                </div>
              </CardContent>
            </Card>

            {/* Insurance & Payment */}
            <Card className="border border-green-200/60 shadow-xl bg-gradient-to-br from-white/95 to-green-50/95">
              <CardHeader className="bg-gradient-r from-green-100/80 to-green-50/80 border-b border-green-200/60">
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <FileText className="h-5 w-5 text-green-600" />
                  Insurance & Payment
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Consultation Fee</span>
                    <span className="font-medium text-slate-800">{doctorInfo.consultationFee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Insurance Accepted</span>
                    <span className="font-medium text-slate-800">Yes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Payment Methods</span>
                    <span className="font-medium text-slate-800">All Major Cards</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentBooking;
