import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  Clock, 
  Star, 
  MapPin, 
  Phone, 
  Mail,
  CheckCircle2,
  AlertCircle,
  Stethoscope,
  Building2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  hospital: string;
  rating: number;
  experience: number;
  fee: number;
  available: boolean;
  phone?: string;
  email?: string;
  address?: string;
  bio?: string;
}

interface AppointmentBookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  doctor: Doctor | null;
  onBookingSuccess: () => void;
}

interface TimeSlot {
  time: string;
  available: boolean;
  duration: number; // in minutes
}

interface AvailableSlot {
  date: string;
  slots: TimeSlot[];
}

const AppointmentBookingModal = ({ 
  open, 
  onOpenChange, 
  doctor, 
  onBookingSuccess 
}: AppointmentBookingModalProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedDuration, setSelectedDuration] = useState(30);
  const [appointmentType, setAppointmentType] = useState("consultation");
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [isBooking, setIsBooking] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const { toast } = useToast();

  const baseApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Generate available slots - will be enhanced to fetch from backend
  const generateFutureSlots = () => {
    const slots = [];
    const today = new Date();
    
    // Generate slots for the next 7 days
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      
      const dateString = date.toISOString().split('T')[0]; // Format: YYYY-MM-DD
      
      slots.push({
        date: dateString,
        slots: [
          { time: "09:00", available: true, duration: 30 },
          { time: "09:30", available: true, duration: 30 },
          { time: "10:00", available: true, duration: 30 },
          { time: "10:30", available: true, duration: 30 },
          { time: "11:00", available: true, duration: 30 },
          { time: "11:30", available: true, duration: 30 },
          { time: "12:00", available: true, duration: 30 },
          { time: "12:30", available: true, duration: 30 },
          { time: "14:00", available: true, duration: 30 },
          { time: "14:30", available: true, duration: 30 },
          { time: "15:00", available: true, duration: 30 },
          { time: "15:30", available: true, duration: 30 },
          { time: "16:00", available: true, duration: 30 },
          { time: "16:30", available: true, duration: 30 }
        ]
      });
    }
    
    return slots;
  };

  // Helper: convert ISO time to HH:MM (24h) for comparison with local slot list
  const isoToHHMM = (iso: string) => {
    const d = new Date(iso);
    const h = d.getHours().toString().padStart(2, '0');
    const m = d.getMinutes().toString().padStart(2, '0');
    return `${h}:${m}`;
  };

  // Update availability for a single date by merging backend data with local template slots
  const updateAvailabilityForDate = async (date: string) => {
    if (!doctor) return;
    try {
      setIsLoadingSlots(true);
      const token = localStorage.getItem('auth.token');
      const res = await fetch(`${baseApiUrl}/api/patient/available-slots/${doctor.id}/${date}` , {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!res.ok) {
        console.warn('Failed to fetch availability for', date, res.status);
        return; // keep optimistic default availability
      }
      const payload = await res.json();
      const backendAvailable: string[] = (payload.data?.availableSlots || []).map((s: any) => isoToHHMM(s.time));

      setAvailableSlots(prev => prev.map(day => {
        if (day.date !== date) return day;
        return {
          ...day,
          slots: day.slots.map(slot => ({
            ...slot,
            available: backendAvailable.includes(slot.time)
          }))
        };
      }));
    } catch (err) {
      console.error('Error updating availability for', date, err);
    } finally {
      setIsLoadingSlots(false);
    }
  };

  // Initialize slots and fetch real data when modal opens
  useEffect(() => {
    if (open && doctor) {
      const initSlots = generateFutureSlots();
      setAvailableSlots(initSlots);
      // Prefetch availability for all generated days once we enter step 2 later
    }
  }, [open, doctor]);

  // When entering step 2, fetch availability for each displayed date
  useEffect(() => {
    if (currentStep === 2 && doctor && availableSlots.length) {
      availableSlots.forEach(d => updateAvailabilityForDate(d.date));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!selectedDate || !selectedTime) {
        toast({
          title: "Missing Selection",
          description: "Please select both date and time.",
          variant: "destructive",
        });
        return;
      }
      setCurrentStep(3);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      onOpenChange(false);
    }
  };

  const handleTimeSlotSelect = (date: string, time: string, duration: number) => {
    setSelectedDate(date);
    setSelectedTime(time);
    setSelectedDuration(duration);
    // On-demand refresh in case this date was not yet synced (quick user navigation)
    updateAvailabilityForDate(date);
  };

  const handleBooking = async () => {
    if (!reason.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide a reason for your appointment.",
        variant: "destructive",
      });
      return;
    }

    setIsBooking(true);

    try {
      const token = localStorage.getItem("auth.token");
      const scheduledTime = new Date(`${selectedDate}T${selectedTime}`);
      const baseApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      
      // Step 1: Check availability first
      console.log("Checking availability for:", {
        doctor: doctor?.id,
        scheduledTime: scheduledTime.toISOString(),
        duration: selectedDuration,
      });

      const availabilityResponse = await fetch(`${baseApiUrl}/api/patient/check-availability`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          doctor: doctor?.id,
          scheduledTime: scheduledTime.toISOString(),
          duration: selectedDuration,
        }),
      });

      if (!availabilityResponse.ok) {
        const errorData = await availabilityResponse.json();
        throw new Error(errorData.message || "Failed to check availability");
      }

      const availabilityData = await availabilityResponse.json();
      console.log("Availability check result:", availabilityData);

      if (!availabilityData.data.available) {
        toast({
          title: "Time Slot Not Available",
          description: availabilityData.data.reason || "The selected time slot is not available. Please choose another time.",
          variant: "destructive",
        });
        setIsBooking(false);
        return;
      }

      // Step 2: If available, proceed with booking
      const apiUrl = `${baseApiUrl}/api/patient/appointments`;
      console.log("Booking appointment to:", apiUrl);
      console.log("Booking data:", {
        doctor: doctor?.id,
        scheduledTime: scheduledTime.toISOString(),
        appointmentType,
        reason,
        notes,
        duration: selectedDuration,
      });

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          doctor: doctor?.id,
          scheduledTime: scheduledTime.toISOString(),
          appointmentType,
          reason,
          notes,
          duration: selectedDuration,
        }),
      });

      console.log("Booking response status:", response.status);

      if (response.ok) {
        toast({
          title: "Appointment Booked Successfully!",
          description: `Your appointment with ${doctor?.name} has been confirmed for ${new Date(selectedDate).toLocaleDateString()} at ${selectedTime}.`,
        });

        // Refresh availability from backend for the booked date
        updateAvailabilityForDate(selectedDate);

        // Reset form and close modal
        setCurrentStep(1);
        setSelectedDate("");
        setSelectedTime("");
        setReason("");
        setNotes("");
        onOpenChange(false);
        onBookingSuccess();
        
      } else {
        let errorMessage = "Failed to book appointment";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // If response is not JSON, get text
          const errorText = await response.text();
          console.error("Non-JSON error response:", errorText);
          errorMessage = `Server error (${response.status}): ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      toast({
        title: "Booking Failed",
        description: error.message || "Failed to book appointment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsBooking(false);
    }
  };

  const resetModal = () => {
    setCurrentStep(1);
    setSelectedDate("");
    setSelectedTime("");
    setReason("");
    setNotes("");
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetModal();
    }
    onOpenChange(newOpen);
  };

  if (!doctor) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-green-600" />
            Book Appointment - Step {currentStep} of 3
          </DialogTitle>
          <DialogDescription>
            {currentStep === 1 && "Review doctor information"}
            {currentStep === 2 && "Select your preferred date and time"}
            {currentStep === 3 && "Provide appointment details"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Step 1: Doctor Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <Card className="border border-green-200/60 shadow-xl bg-gradient-to-br from-white/95 to-green-50/95">
                <CardHeader className="bg-gradient-to-r from-green-100/80 to-green-50/80 border-b border-green-200/60">
                  <CardTitle className="flex items-center gap-2">
                    <Stethoscope className="h-5 w-5 text-green-600" />
                    Doctor Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex items-start gap-6">
                    <Avatar className="h-20 w-20 ring-4 ring-green-400/40">
                      <AvatarImage src="/placeholder.svg" alt={doctor.name} />
                      <AvatarFallback className="bg-gradient-to-br from-green-500 to-green-600 text-white font-bold text-xl">
                        {doctor.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-slate-800 mb-2">{doctor.name}</h3>
                      <p className="text-green-600 font-semibold mb-2">{doctor.specialty}</p>
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="font-semibold">{doctor.rating}</span>
                        </div>
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-600">{doctor.experience} years experience</span>
                      </div>
                      <div className="space-y-2 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-slate-500" />
                          <span>{doctor.hospital}</span>
                        </div>
                        {doctor.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-slate-500" />
                            <span>{doctor.phone}</span>
                          </div>
                        )}
                        {doctor.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-slate-500" />
                            <span>{doctor.email}</span>
                          </div>
                        )}
                        {doctor.address && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-slate-500" />
                            <span>{doctor.address}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-slate-800">${doctor.fee}</div>
                      <div className="text-sm text-slate-500">Consultation Fee</div>
                      <Badge className="bg-green-100 text-green-700 border-green-200 mt-2">
                        Available
                      </Badge>
                    </div>
                  </div>
                  
                  {doctor.bio && (
                    <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                      <h4 className="font-semibold text-slate-800 mb-2">About</h4>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        {doctor.bio || `Dr. ${doctor.name.split(' ')[1]} is a highly experienced ${doctor.specialty.toLowerCase()} specialist with ${doctor.experience} years of practice. Known for providing comprehensive and compassionate care to patients.`}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 2: Date and Time Selection */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <Card className="border border-green-200/60 shadow-xl bg-white">
                <CardHeader className="bg-gradient-to-r from-green-100/80 to-green-50/80 border-b border-green-200/60">
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-green-600" />
                    Select Date & Time
                  </CardTitle>
                  <CardDescription>
                    Choose from available appointment slots
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {availableSlots.map((daySlot) => (
                      <div key={daySlot.date} className="space-y-3">
                        <h4 className="font-semibold text-slate-800 flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-green-600" />
                          {new Date(daySlot.date).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </h4>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                          {daySlot.slots.map((slot) => (
                            <Button
                              key={`${daySlot.date}-${slot.time}`}
                              variant={
                                selectedDate === daySlot.date && selectedTime === slot.time
                                  ? "default"
                                  : "outline"
                              }
                              size="sm"
                              disabled={!slot.available}
                              onClick={() => handleTimeSlotSelect(daySlot.date, slot.time, slot.duration)}
                              className={`h-auto py-2 px-3 flex flex-col items-center ${
                                selectedDate === daySlot.date && selectedTime === slot.time
                                  ? "bg-green-600 hover:bg-green-700 text-white"
                                  : slot.available
                                  ? "border-green-200 text-green-700 hover:bg-green-50"
                                  : "opacity-50 cursor-not-allowed"
                              }`}
                            >
                              <span className="font-semibold">{slot.time}</span>
                              <span className="text-xs opacity-80">{slot.duration}min</span>
                            </Button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {selectedDate && selectedTime && (
                    <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2 text-green-800">
                        <CheckCircle2 className="h-5 w-5" />
                        <span className="font-semibold">Selected Appointment</span>
                      </div>
                      <p className="text-green-700 mt-1">
                        {new Date(selectedDate).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })} at {selectedTime} ({selectedDuration} minutes)
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 3: Appointment Details */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <Card className="border border-green-200/60 shadow-xl bg-white">
                <CardHeader className="bg-gradient-to-r from-green-100/80 to-green-50/80 border-b border-green-200/60">
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-green-600" />
                    Appointment Details
                  </CardTitle>
                  <CardDescription>
                    Provide information about your visit
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="appointmentType">Appointment Type</Label>
                    <Select value={appointmentType} onValueChange={setAppointmentType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select appointment type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="consultation">General Consultation</SelectItem>
                        <SelectItem value="follow-up">Follow-up Visit</SelectItem>
                        <SelectItem value="check-up">Regular Check-up</SelectItem>
                        <SelectItem value="emergency">Emergency Consultation</SelectItem>
                        <SelectItem value="second-opinion">Second Opinion</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reason">Reason for Visit *</Label>
                    <Textarea
                      id="reason"
                      placeholder="Please describe your symptoms, concerns, or reason for this appointment..."
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="min-h-[100px] focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Any additional information, medications you're taking, or questions you'd like to discuss..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="min-h-[80px] focus:ring-green-500 focus:border-green-500"
                    />
                  </div>

                  {/* Appointment Summary */}
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-3">Appointment Summary</h4>
                    <div className="space-y-2 text-sm text-blue-700">
                      <div className="flex justify-between">
                        <span>Doctor:</span>
                        <span className="font-semibold">{doctor.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Date & Time:</span>
                        <span className="font-semibold">
                          {new Date(selectedDate).toLocaleDateString()} at {selectedTime}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Duration:</span>
                        <span className="font-semibold">{selectedDuration} minutes</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Type:</span>
                        <span className="font-semibold">{appointmentType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Consultation Fee:</span>
                        <span className="font-semibold">${doctor.fee}</span>
                      </div>
                    </div>
                  </div>

                  {/* Important Information */}
                  <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-amber-800">
                        <p className="font-semibold mb-2">Important Information:</p>
                        <ul className="space-y-1 text-amber-700">
                          <li>• Please arrive 15 minutes before your appointment time</li>
                          <li>• Bring your ID and insurance information</li>
                          <li>• For video calls, ensure stable internet connection</li>
                          <li>• Cancellation policy: 24 hours notice required</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleBack}
              className="border-green-200 text-green-700 hover:bg-green-50"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              {currentStep === 1 ? 'Cancel' : 'Previous'}
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
                disabled={!reason.trim() || isBooking}
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
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentBookingModal;
