import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Stethoscope, 
  UserCheck, 
  Users, 
  Microscope, 
  Shield, 
  ChevronRight,
  Activity,
  Heart,
  Brain,
  Zap,
  Clock,
  Award,
  Globe,
  Phone,
  Mail,
  MapPin
} from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const roleCards = [
    {
      role: "Patient",
      title: "Patient Portal",
      description: "Access your medical records, book appointments, and manage your healthcare journey",
      icon: Heart,
      color: "from-blue-500 to-cyan-500",
      route: "/login",
      features: ["Medical Records", "Appointment Booking", "Prescription Management", "Test Results"]
    },
    {
      role: "Doctor",
      title: "Doctor Dashboard",
      description: "Manage patients, access AI diagnostics, and streamline your medical practice",
      icon: Stethoscope,
      color: "from-green-500 to-emerald-500",
      route: "/doctor-login",
      features: ["Patient Management", "AI Diagnostics", "Treatment Plans", "Medical Records"]
    },
    {
      role: "Staff",
      title: "Medical Staff",
      description: "Coordinate patient care, manage schedules, and support medical operations",
      icon: UserCheck,
      color: "from-purple-500 to-violet-500",
      route: "/staff-login",
      features: ["Patient Coordination", "Schedule Management", "Medical Support", "Care Planning"]
    },
    {
      role: "Laboratory",
      title: "Laboratory Portal",
      description: "Process samples, generate reports, and manage laboratory operations efficiently",
      icon: Microscope,
      color: "from-orange-500 to-red-500",
      route: "/laboratory-login",
      features: ["Sample Processing", "Test Reports", "Quality Control", "Lab Management"]
    },
    {
      role: "Administrator",
      title: "Admin Dashboard",
      description: "Oversee hospital operations, manage users, and access comprehensive analytics",
      icon: Shield,
      color: "from-slate-600 to-slate-700",
      route: "/admin-login",
      features: ["User Management", "System Analytics", "Hospital Operations", "Financial Overview"]
    }
  ];

  const systemFeatures = [
    {
      icon: Brain,
      title: "AI-Powered Diagnostics",
      description: "Advanced artificial intelligence assists in medical diagnosis and treatment recommendations"
    },
    {
      icon: Activity,
      title: "Real-time Monitoring",
      description: "Live patient data tracking and instant alerts for critical health changes"
    },
    {
      icon: Zap,
      title: "Fast & Efficient",
      description: "Streamlined workflows that reduce waiting times and improve patient care"
    },
    {
      icon: Award,
      title: "Quality Assured",
      description: "Certified medical standards with comprehensive audit trails and compliance"
    }
  ];

  const handleRoleSelection = (route: string) => {
    navigate(route);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  MediVoice
                </h1>
                <p className="text-sm text-slate-600">Healthcare Management System</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate("/demo")}
                className="text-slate-600 hover:text-blue-600"
              >
                Try Demo
              </Button>
              <Button 
                onClick={() => navigate("/register")}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <Badge className="mb-6 bg-blue-100 text-blue-700 border-blue-200 px-4 py-2">
            Next-Generation Healthcare Platform
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent leading-tight">
            Welcome to MediVoice
          </h1>
          <p className="text-xl text-slate-600 mb-8 leading-relaxed">
            Your comprehensive healthcare management solution. Connect patients, doctors, staff, and administrators 
            in one unified platform with AI-powered diagnostics and seamless workflow management.
          </p>
          
          <div className="flex items-center justify-center gap-6 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-green-500" />
              <span>24/7 Available</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-500" />
              <span>HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-purple-500" />
              <span>Multi-Platform</span>
            </div>
          </div>
        </div>

        {/* Role Selection Cards */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-4 text-slate-800">
            Choose Your Access Portal
          </h2>
          <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
            Select your role to access the appropriate dashboard with features tailored to your healthcare responsibilities.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {roleCards.map((card) => (
              <Card 
                key={card.role}
                className="group hover:shadow-2xl transition-all duration-300 cursor-pointer border-slate-200 hover:border-slate-300 bg-white/70 backdrop-blur-sm overflow-hidden"
                onClick={() => handleRoleSelection(card.route)}
              >
                <CardHeader className="pb-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <card.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-slate-800 group-hover:text-slate-900">
                    {card.title}
                  </CardTitle>
                  <CardDescription className="text-slate-600 group-hover:text-slate-700">
                    {card.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-6">
                    {card.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-slate-600">
                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    className={`w-full bg-gradient-to-r ${card.color} hover:shadow-lg transition-all duration-300 group-hover:scale-105`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRoleSelection(card.route);
                    }}
                  >
                    Access {card.role} Portal
                    <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-800">
            Why Choose MediVoice?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {systemFeatures.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-slate-800">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Demo Section */}
        <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
          <CardContent className="text-center py-12">
            <h3 className="text-2xl font-bold mb-4 text-slate-800">
              Experience MediVoice Today
            </h3>
            <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
              Not sure which portal you need? Try our interactive demo to explore all features 
              and see how MediVoice can transform your healthcare workflow.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate("/demo")}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-lg px-8"
              >
                Try Interactive Demo
              </Button>
              <Button 
                onClick={() => navigate("/register")}
                variant="outline"
                size="lg"
                className="text-lg px-8 border-blue-300 text-blue-700 hover:bg-blue-50"
              >
                Create Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Heart className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-bold">MediVoice</h3>
              </div>
              <p className="text-slate-400">
                Transforming healthcare with intelligent technology and seamless user experiences.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Access</h4>
              <div className="space-y-2">
                <button onClick={() => navigate("/login")} className="block text-slate-400 hover:text-white transition-colors">Patient Portal</button>
                <button onClick={() => navigate("/doctor-login")} className="block text-slate-400 hover:text-white transition-colors">Doctor Login</button>
                <button onClick={() => navigate("/admin-login")} className="block text-slate-400 hover:text-white transition-colors">Admin Dashboard</button>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <div className="space-y-2">
                <button onClick={() => navigate("/help")} className="block text-slate-400 hover:text-white transition-colors">Help Center</button>
                <button onClick={() => navigate("/terms")} className="block text-slate-400 hover:text-white transition-colors">Terms of Service</button>
                <button onClick={() => navigate("/privacy")} className="block text-slate-400 hover:text-white transition-colors">Privacy Policy</button>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-slate-400">
                  <Phone className="h-4 w-4" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Mail className="h-4 w-4" />
                  <span>support@medivoice.com</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <MapPin className="h-4 w-4" />
                  <span>Healthcare District</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-700 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2025 MediVoice Healthcare Management System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
