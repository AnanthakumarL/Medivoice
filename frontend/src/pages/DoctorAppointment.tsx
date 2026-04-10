import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  Star,
  Building2,
  ArrowLeft,
  CheckCircle2,
  User,
  FileText,
  Stethoscope,
  CreditCard,
  AlertCircle,
} from "lucide-react";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  hospital: string;
  rating: number;
  experience: number;
  fee: number;
  available: boolean;
  phone: string;
  email: string;
  address: string;
  photo: string;
  bio: string;
}

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

const DoctorAppointment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const doctor: Doctor = location.state?.doctor;

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [bookingData, setBookingData] = useState({
    appointmentType: "",
    reasonForVisit: "",
    symptoms: "",
    additionalNotes: "",
    patientName: "",
    patientPhone: "",
    patientEmail: "",
  });

  // Generate available dates (next 14 days)
  const [availableDates, setAvailableDates] = useState<string[]>([]);

  // Time slots for the selected date
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);

  useEffect(() => {
    // Generate next 14 days
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    setAvailableDates(dates);
    setSelectedDate(dates[0]);
  }, []);

  useEffect(() => {
    // Generate time slots when date is selected
    if (selectedDate) {
      const slots: TimeSlot[] = [
        { id: "1", time: "09:00 AM", available: true },
        { id: "2", time: "09:30 AM", available: true },
        { id: "3", time: "10:00 AM", available: false },
        { id: "4", time: "10:30 AM", available: true },
        { id: "5", time: "11:00 AM", available: true },
        { id: "6", time: "11:30 AM", available: true },
        { id: "7", time: "12:00 PM", available: false },
        { id: "8", time: "02:00 PM", available: true },
        { id: "9", time: "02:30 PM", available: true },
        { id: "10", time: "03:00 PM", available: true },
        { id: "11", time: "03:30 PM", available: false },
        { id: "12", time: "04:00 PM", available: true },
        { id: "13", time: "04:30 PM", available: true },
        { id: "14", time: "05:00 PM", available: true },
        { id: "15", time: "05:30 PM", available: true },
      ];
      setTimeSlots(slots);
    }
  }, [selectedDate]);

  useEffect(() => {
    // Load user data from localStorage
    const userStr = localStorage.getItem('auth.user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setBookingData(prev => ({
          ...prev,
          patientName: user.fullName || "",
          patientEmail: user.email || "",
          patientPhone: user.phoneNumber || "",
        }));
      } catch (e) {
        console.error("Error loading user data:", e);
      }
    }
  }, []);

  if (!doctor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Doctor Not Found</h2>
            <p className="text-slate-600 mb-6">Please select a doctor from the doctors list.</p>
            <Button onClick={() => navigate("/dashboard")} className="bg-green-600 hover:bg-green-700">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";
    
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const handleSlotSelect = (slot: TimeSlot) => {
    if (!slot.available) return;
    setSelectedSlot(slot);
    setShowBookingForm(true);
  };

  const handleInputChange = (field: string, value: string) => {
    setBookingData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmitBooking = async () => {
    // Validate form
    if (!bookingData.appointmentType || !bookingData.reasonForVisit || !bookingData.patientName || !bookingData.patientPhone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Submit appointment to backend
      const appointmentPayload = {
        patientName: bookingData.patientName,
        patientEmail: bookingData.patientEmail,
        patientPhone: bookingData.patientPhone,
        doctorId: doctor.id,
        doctorName: doctor.name,
        doctorSpecialty: doctor.specialty,
        hospital: doctor.hospital,
        appointmentDate: selectedDate,
        appointmentTime: selectedSlot?.time,
        appointmentType: bookingData.appointmentType,
        reasonForVisit: bookingData.reasonForVisit,
        symptoms: bookingData.symptoms,
        additionalNotes: bookingData.additionalNotes,
        consultationFee: doctor.fee,
        platformFee: 50,
        totalAmount: doctor.fee + 50
      };

      console.log('Booking appointment:', appointmentPayload);

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/appointments/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentPayload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to book appointment');
      }

      console.log('Appointment booked successfully:', data);

      toast({
        title: "Appointment Booked!",
        description: `Your appointment with ${doctor.name} is confirmed for ${formatDate(selectedDate)} at ${selectedSlot?.time}.`,
      });

      // Navigate back to dashboard and switch to appointments tab
      setTimeout(() => {
        navigate("/dashboard", { state: { activeTab: 'appointments' } });
      }, 2000);
    } catch (error: any) {
      console.error('Booking error:', error);
      toast({
        title: "Booking Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/dashboard")}
              className="hover:bg-slate-100"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Book Appointment</h1>
              <p className="text-sm text-slate-600">Schedule your consultation</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Doctor Information */}
          <div className="lg:col-span-1 space-y-6">
            {/* Doctor Profile Card */}
            <Card className="border-slate-200 shadow-lg">
              <CardContent className="p-6">
                <div className="text-center">
                  <Avatar className="h-32 w-32 mx-auto mb-4 ring-4 ring-green-100">
                    <AvatarImage src={doctor.photo} alt={doctor.name} />
                    <AvatarFallback className="bg-green-100 text-green-700 text-3xl">
                      {doctor.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <h2 className="text-2xl font-bold text-slate-800 mb-1">{doctor.name}</h2>
                  <p className="text-green-600 font-medium mb-2">{doctor.specialty}</p>
                  
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-semibold ml-1">{doctor.rating}</span>
                    </div>
                    <span className="text-slate-400">•</span>
                    <span className="text-sm text-slate-600">{doctor.experience} years exp</span>
                  </div>

                  <Badge className="bg-green-100 text-green-700 border-green-200">
                    Available for Consultation
                  </Badge>
                </div>

                <div className="mt-6 space-y-3 border-t border-slate-200 pt-6">
                  <div className="flex items-center gap-3 text-sm">
                    <Building2 className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-700">{doctor.hospital}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-700">{doctor.address}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-700">{doctor.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-700">{doctor.email}</span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Consultation Fee</span>
                    <span className="text-2xl font-bold text-green-600">₹{doctor.fee}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* About Doctor */}
            <Card className="border-slate-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">About Doctor</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 leading-relaxed">{doctor.bio}</p>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Booking Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Date Selection */}
            <Card className="border-slate-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-green-600" />
                  Select Date
                </CardTitle>
                <CardDescription>Choose your preferred appointment date</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {availableDates.map((date) => (
                    <button
                      key={date}
                      onClick={() => {
                        setSelectedDate(date);
                        setSelectedSlot(null);
                        setShowBookingForm(false);
                      }}
                      className={`p-3 rounded-lg border text-center transition-all ${
                        selectedDate === date
                          ? 'border-green-600 bg-green-50 text-green-700 font-semibold'
                          : 'border-slate-200 hover:border-green-300 hover:bg-green-50/50'
                      }`}
                    >
                      <div className="text-xs text-slate-500 mb-1">
                        {formatDate(date).split(',')[0]}
                      </div>
                      <div className="text-sm font-semibold">
                        {new Date(date).getDate()}
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Time Slots */}
            {selectedDate && (
              <Card className="border-slate-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-green-600" />
                    Available Time Slots
                  </CardTitle>
                  <CardDescription>Select your preferred time for {formatDate(selectedDate)}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot.id}
                        onClick={() => handleSlotSelect(slot)}
                        disabled={!slot.available}
                        className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                          selectedSlot?.id === slot.id
                            ? 'border-green-600 bg-green-600 text-white'
                            : slot.available
                            ? 'border-slate-200 hover:border-green-300 hover:bg-green-50 text-slate-700'
                            : 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Booking Form */}
            {showBookingForm && selectedSlot && (
              <Card className="border-green-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-green-600" />
                    Appointment Details
                  </CardTitle>
                  <CardDescription>Please provide your information and reason for visit</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Selected Date & Time Summary */}
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        <span className="font-semibold text-slate-800">Selected Slot</span>
                      </div>
                      <Badge className="bg-green-600 text-white">
                        {formatDate(selectedDate)} at {selectedSlot.time}
                      </Badge>
                    </div>
                  </div>

                  {/* Patient Information */}
                  <div className="space-y-4 border-t border-slate-200 pt-4">
                    <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Patient Information
                    </h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="patientName">Full Name *</Label>
                        <Input
                          id="patientName"
                          value={bookingData.patientName}
                          onChange={(e) => handleInputChange('patientName', e.target.value)}
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="patientPhone">Phone Number *</Label>
                        <Input
                          id="patientPhone"
                          value={bookingData.patientPhone}
                          onChange={(e) => handleInputChange('patientPhone', e.target.value)}
                          placeholder="Enter your phone number"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="patientEmail">Email Address</Label>
                      <Input
                        id="patientEmail"
                        type="email"
                        value={bookingData.patientEmail}
                        onChange={(e) => handleInputChange('patientEmail', e.target.value)}
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  {/* Appointment Information */}
                  <div className="space-y-4 border-t border-slate-200 pt-4">
                    <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                      <Stethoscope className="h-4 w-4" />
                      Appointment Information
                    </h3>

                    <div>
                      <Label htmlFor="appointmentType">Appointment Type *</Label>
                      <Select value={bookingData.appointmentType} onValueChange={(value) => handleInputChange('appointmentType', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select appointment type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="consultation">General Consultation</SelectItem>
                          <SelectItem value="followup">Follow-up Visit</SelectItem>
                          <SelectItem value="emergency">Emergency Consultation</SelectItem>
                          <SelectItem value="routine">Routine Checkup</SelectItem>
                          <SelectItem value="specialist">Specialist Consultation</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="reasonForVisit">Reason for Visit *</Label>
                      <Input
                        id="reasonForVisit"
                        value={bookingData.reasonForVisit}
                        onChange={(e) => handleInputChange('reasonForVisit', e.target.value)}
                        placeholder="Brief reason for your visit"
                      />
                    </div>

                    <div>
                      <Label htmlFor="symptoms">Symptoms (if any)</Label>
                      <Textarea
                        id="symptoms"
                        value={bookingData.symptoms}
                        onChange={(e) => handleInputChange('symptoms', e.target.value)}
                        placeholder="Describe your symptoms"
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="additionalNotes">Additional Notes</Label>
                      <Textarea
                        id="additionalNotes"
                        value={bookingData.additionalNotes}
                        onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                        placeholder="Any additional information for the doctor"
                        rows={3}
                      />
                    </div>
                  </div>

                  {/* Payment Summary */}
                  <div className="border-t border-slate-200 pt-4">
                    <div className="p-4 bg-slate-50 rounded-lg space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Consultation Fee</span>
                        <span className="font-semibold">₹{doctor.fee}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Platform Fee</span>
                        <span className="font-semibold">₹50</span>
                      </div>
                      <div className="border-t border-slate-300 pt-2 flex items-center justify-between">
                        <span className="font-semibold text-slate-800">Total Amount</span>
                        <span className="text-xl font-bold text-green-600">₹{doctor.fee + 50}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setShowBookingForm(false)}
                      className="flex-1"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSubmitBooking}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Confirming...
                        </>
                      ) : (
                        <>
                          <CreditCard className="h-4 w-4 mr-2" />
                          Confirm Booking
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorAppointment;
