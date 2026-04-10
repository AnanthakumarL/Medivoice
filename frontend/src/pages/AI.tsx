import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  Mic, 
  MicOff, 
  Send, 
  Calendar, 
  Pill, 
  Heart, 
  Activity, 
  Volume2,
  VolumeX,
  Clock,
  CheckCircle,
  ArrowLeft,
  Sparkles,
  Zap,
  Settings,
  MessageSquare,
  Stethoscope,
  TrendingUp,
  Shield,
  Star,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  Bell,
  FileText,
  Users,
  Target,
  Award,
  Lightbulb,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Info
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AI = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isListening, setIsListening] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      type: 'ai',
      message: "Hello! I'm MedVo AI, your intelligent health companion. I'm here to help you with medical analysis, appointment booking, medication reminders, and personalized health insights. How can I assist you today?",
      timestamp: new Date(),
      avatar: "🤖",
      isTyping: false
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [activeFeature, setActiveFeature] = useState('chat');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Enhanced mock data
  const [healthMetrics] = useState({
    bloodPressure: "120/80",
    heartRate: 72,
    temperature: 98.6,
    oxygenSaturation: 98,
    lastCheckup: "2024-01-15",
    healthScore: 85,
    sleepQuality: 7.5,
    stressLevel: 3
  });

  const [upcomingAppointments] = useState([
    {
      id: 1,
      doctor: "Dr. Sarah Smith",
      specialty: "Cardiology",
      date: "2024-01-20",
      time: "10:00 AM",
      type: "Follow-up",
      status: "confirmed",
      avatar: "/placeholder.svg"
    },
    {
      id: 2,
      doctor: "Dr. Michael Johnson",
      specialty: "General Medicine",
      date: "2024-01-25",
      time: "2:30 PM",
      type: "Annual Checkup",
      status: "pending",
      avatar: "/placeholder.svg"
    }
  ]);

  const [medications] = useState([
    {
      id: 1,
      name: "Lisinopril",
      dosage: "10mg",
      frequency: "Once daily",
      nextDose: "8:00 AM",
      taken: false,
      progress: 75
    },
    {
      id: 2,
      name: "Metformin",
      dosage: "500mg",
      frequency: "Twice daily",
      nextDose: "12:00 PM",
      taken: true,
      progress: 100
    }
  ]);

  const [healthInsights] = useState([
    {
      id: 1,
      type: "recommendation",
      title: "Exercise Recommendation",
      description: "Based on your recent lab results, consider adding 30 minutes of moderate exercise daily.",
      priority: "medium",
      icon: "🏃‍♂️",
      action: "View Plan"
    },
    {
      id: 2,
      type: "alert",
      title: "Medication Reminder",
      description: "Don't forget to take your Lisinopril at 8:00 AM today.",
      priority: "high",
      icon: "💊",
      action: "Set Reminder"
    },
    {
      id: 3,
      type: "insight",
      title: "Health Trend Analysis",
      description: "Your blood pressure has been stable over the past month. Keep up the good work!",
      priority: "low",
      icon: "📈",
      action: "View Report"
    }
  ]);

  const [aiFeatures] = useState([
    {
      id: 'chat',
      title: 'AI Chat',
      description: 'Intelligent health conversations',
      icon: MessageSquare,
      color: 'from-blue-500 to-cyan-500',
      active: true
    },
    {
      id: 'analysis',
      title: 'Health Analysis',
      description: 'Medical record insights',
      icon: Stethoscope,
      color: 'from-green-500 to-emerald-500',
      active: false
    },
    {
      id: 'reminders',
      title: 'Smart Reminders',
      description: 'Medication & appointment alerts',
      icon: Bell,
      color: 'from-orange-500 to-red-500',
      active: false
    },
    {
      id: 'booking',
      title: 'Auto Booking',
      description: 'Voice-powered appointments',
      icon: Calendar,
      color: 'from-purple-500 to-pink-500',
      active: false
    }
  ]);

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      message: inputMessage,
      timestamp: new Date(),
      avatar: "👤",
      isTyping: false
    };

    setChatMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsAnalyzing(true);

    // Simulate AI response with typing effect
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputMessage);
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        message: aiResponse,
        timestamp: new Date(),
        avatar: "🤖",
        isTyping: false
      };
      setChatMessages(prev => [...prev, aiMessage]);
      setIsAnalyzing(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string) => {
    const input = userInput.toLowerCase();
    
    if (input.includes('appointment') || input.includes('book')) {
      return "I can help you book an appointment! I see you have an upcoming appointment with Dr. Sarah Smith on January 20th. Would you like me to schedule a new appointment or reschedule the existing one? I can also analyze your medical history to suggest the best specialist for your needs.";
    } else if (input.includes('medication') || input.includes('medicine')) {
      return "I can see you have 2 medications scheduled. Lisinopril (10mg) is due at 8:00 AM and Metformin (500mg) at 12:00 PM. I can set up smart reminders, track your medication adherence, and alert you about potential interactions. Would you like me to help you manage your medication schedule?";
    } else if (input.includes('health') || input.includes('analysis')) {
      return "Based on your recent medical records, your health metrics look excellent! Your blood pressure is optimal (120/80), heart rate is stable at 72 BPM, and your overall health score is 85/100. I recommend continuing your current medication regimen and maintaining regular exercise. Would you like a detailed health report?";
    } else if (input.includes('reminder') || input.includes('remind')) {
      return "I'll set up intelligent reminders for you! I can remind you about medications, appointments, health checkups, and even suggest optimal times based on your daily routine. What specific reminders would you like me to configure?";
    } else {
      return "I understand you're asking about: '" + userInput + "'. As your AI health assistant, I can help with appointment booking, medication management, health analysis, personalized recommendations, and general health advice. I'm constantly learning from your health data to provide better insights. How else can I assist you today?";
    }
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      setIsListening(false);
      toast({
        title: "Voice recording stopped",
        description: "Voice input has been disabled.",
      });
    } else {
      setIsListening(true);
      toast({
        title: "Voice recording started",
        description: "Speak now, I'm listening...",
      });
      
      // Simulate voice input
      setTimeout(() => {
        setIsListening(false);
        setInputMessage("Book an appointment with a cardiologist");
        toast({
          title: "Voice input received",
          description: "I heard: 'Book an appointment with a cardiologist'",
        });
      }, 3000);
    }
  };

  const handleBookAppointment = () => {
    toast({
      title: "Appointment Booking",
      description: "I'm connecting you with available cardiologists. Please wait...",
    });
    
    setTimeout(() => {
      toast({
        title: "Appointment Scheduled!",
        description: "Your appointment with Dr. Sarah Smith has been booked for January 22nd at 2:00 PM.",
      });
    }, 2000);
  };

  const markMedicationTaken = (medicationId: number) => {
    toast({
      title: "Medication Logged",
      description: "Great job! I've recorded that you took your medication.",
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-500 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-500 bg-green-50 border-green-200';
      default: return 'text-gray-500 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Enhanced Header */}
      <div className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="flex items-center space-x-2 hover:bg-blue-50 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Brain className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse border-2 border-white"></div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    MedVo AI Assistant
                  </h1>
                  <p className="text-sm text-gray-600">Your Intelligent Health Companion</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-white/50 rounded-full px-4 py-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">AI Online</span>
              </div>
              <Button
                variant={voiceEnabled ? "default" : "outline"}
                size="sm"
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                <span>{voiceEnabled ? 'Voice On' : 'Voice Off'}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Feature Navigation */}
        <div className="mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {aiFeatures.map((feature) => (
              <Card 
                key={feature.id}
                className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                  activeFeature === feature.id 
                    ? 'ring-2 ring-blue-500 shadow-lg' 
                    : 'hover:shadow-md'
                }`}
                onClick={() => setActiveFeature(feature.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center`}>
                      <feature.icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">{feature.title}</h3>
                      <p className="text-xs text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main AI Chat Interface */}
          <div className="lg:col-span-3">
            <Card className="h-[700px] flex flex-col shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      <Brain className="h-7 w-7" />
                    </div>
                    <div>
                      <CardTitle className="text-white text-xl">AI Health Assistant</CardTitle>
                      <p className="text-blue-100 text-sm">Powered by advanced medical AI</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2 bg-white/20 rounded-full px-3 py-1 backdrop-blur-sm">
                      <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                      <span className="text-sm text-white">Active</span>
                    </div>
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                      <Settings className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col p-0">
                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-gray-50 to-white">
                  {chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-start space-x-3 max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        <Avatar className="w-10 h-10 ring-2 ring-white shadow-md">
                          <AvatarFallback className="text-sm bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                            {message.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`rounded-2xl px-5 py-3 shadow-sm ${
                          message.type === 'user' 
                            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' 
                            : 'bg-white text-gray-900 border border-gray-200'
                        }`}>
                          <p className="text-sm leading-relaxed">{message.message}</p>
                          <p className={`text-xs mt-2 ${
                            message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isAnalyzing && (
                    <div className="flex justify-start">
                      <div className="flex items-start space-x-3">
                        <Avatar className="w-10 h-10 ring-2 ring-white shadow-md">
                          <AvatarFallback className="text-sm bg-gradient-to-r from-blue-500 to-purple-500 text-white">🤖</AvatarFallback>
                        </Avatar>
                        <div className="bg-white rounded-2xl px-5 py-3 shadow-sm border border-gray-200">
                          <div className="flex items-center space-x-3">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                            </div>
                            <span className="text-sm text-gray-600 font-medium">AI is analyzing...</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Enhanced Input Area */}
                <div className="border-t border-gray-200 p-6 bg-white">
                  <div className="flex items-center space-x-4">
                    <Button
                      variant={isListening ? "destructive" : "outline"}
                      size="sm"
                      onClick={handleVoiceToggle}
                      className={`flex items-center space-x-2 transition-all ${
                        isListening 
                          ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
                          : 'hover:bg-blue-50 border-blue-200'
                      }`}
                    >
                      {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                      <span>{isListening ? 'Stop' : 'Voice'}</span>
                    </Button>
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Ask me anything about your health, medications, or appointments..."
                      className="flex-1 h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim() || isAnalyzing}
                      className="h-12 px-6 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Sidebar */}
          <div className="space-y-6">
            {/* Health Score Card */}
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-green-700">
                  <TrendingUp className="h-5 w-5" />
                  <span>Health Score</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">{healthMetrics.healthScore}</div>
                  <Progress value={healthMetrics.healthScore} className="h-3 mb-3" />
                  <p className="text-sm text-green-600 font-medium">Excellent Health Status</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  <span>Quick Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={handleBookAppointment}
                  className="w-full justify-start bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white h-12 rounded-xl shadow-md hover:shadow-lg transition-all"
                >
                  <Calendar className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Book Appointment</div>
                    <div className="text-xs opacity-90">AI-powered scheduling</div>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start h-12 rounded-xl border-blue-200 hover:bg-blue-50 transition-all"
                >
                  <Pill className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Medication Tracker</div>
                    <div className="text-xs text-gray-600">Smart reminders</div>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start h-12 rounded-xl border-purple-200 hover:bg-purple-50 transition-all"
                >
                  <Activity className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Health Analysis</div>
                    <div className="text-xs text-gray-600">AI insights</div>
                  </div>
                </Button>
              </CardContent>
            </Card>

            {/* Enhanced Health Metrics */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  <span>Vital Signs</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="text-2xl font-bold text-blue-600 mb-1">{healthMetrics.bloodPressure}</div>
                    <div className="text-xs text-blue-600 font-medium">Blood Pressure</div>
                    <div className="text-xs text-green-600 mt-1">✓ Normal</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200">
                    <div className="text-2xl font-bold text-green-600 mb-1">{healthMetrics.heartRate}</div>
                    <div className="text-xs text-green-600 font-medium">Heart Rate</div>
                    <div className="text-xs text-green-600 mt-1">✓ Optimal</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-xl border border-orange-200">
                    <div className="text-2xl font-bold text-orange-600 mb-1">{healthMetrics.temperature}°F</div>
                    <div className="text-xs text-orange-600 font-medium">Temperature</div>
                    <div className="text-xs text-green-600 mt-1">✓ Normal</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-200">
                    <div className="text-2xl font-bold text-purple-600 mb-1">{healthMetrics.oxygenSaturation}%</div>
                    <div className="text-xs text-purple-600 font-medium">Oxygen</div>
                    <div className="text-xs text-green-600 mt-1">✓ Excellent</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Upcoming Appointments */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  <span>Upcoming Appointments</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-blue-500 text-white text-sm">
                            {appointment.doctor.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-sm text-gray-900">{appointment.doctor}</p>
                          <p className="text-xs text-gray-600">{appointment.specialty}</p>
                        </div>
                      </div>
                      <Badge 
                        variant={appointment.status === 'confirmed' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {appointment.status}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-600">
                      <Clock className="h-3 w-3" />
                      <span>{appointment.date} at {appointment.time}</span>
                    </div>
                    <div className="mt-2">
                      <Badge variant="outline" className="text-xs">{appointment.type}</Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Enhanced Medications */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Pill className="h-5 w-5 text-green-500" />
                  <span>Today's Medications</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {medications.map((medication) => (
                  <div key={medication.id} className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-semibold text-sm text-gray-900">{medication.name}</p>
                        <p className="text-xs text-gray-600">{medication.dosage} - {medication.frequency}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {medication.taken ? (
                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="h-5 w-5 text-white" />
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => markMedicationTaken(medication.id)}
                            className="w-8 h-8 p-0 bg-blue-500 hover:bg-blue-600 rounded-full"
                          >
                            <CheckCircle className="h-4 w-4 text-white" />
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-xs text-gray-600">
                        <Clock className="h-3 w-3" />
                        <span>Next dose: {medication.nextDose}</span>
                      </div>
                      <Progress value={medication.progress} className="h-2" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Enhanced AI Insights */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Sparkles className="h-5 w-5 text-purple-500" />
                  <span>AI Insights</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {healthInsights.map((insight) => (
                  <div key={insight.id} className={`p-4 rounded-xl border transition-all hover:shadow-md ${getPriorityColor(insight.priority)}`}>
                    <div className="flex items-start space-x-3">
                      <span className="text-2xl">{insight.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-semibold text-sm">{insight.title}</p>
                          <Badge 
                            variant={insight.priority === 'high' ? 'destructive' : insight.priority === 'medium' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {insight.priority}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 mb-3 leading-relaxed">{insight.description}</p>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-xs h-7 px-3"
                        >
                          {insight.action}
                          <ChevronRight className="h-3 w-3 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AI;