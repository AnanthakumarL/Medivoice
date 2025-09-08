import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Stethoscope, 
  Users, 
  FlaskConical, 
  Shield, 
  Hospital, 
  ArrowRight,
  UserCheck,
  Activity,
  Heart,
  Brain,
  Microscope,
  CalendarDays
} from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const userRoles = [
    {
      id: 'patient',
      title: 'Patient',
      description: 'Book appointments, view medical records, and manage your healthcare',
      icon: Heart,
      color: 'bg-gradient-to-br from-blue-500 to-blue-600',
      hoverColor: 'hover:from-blue-600 hover:to-blue-700',
      route: '/login',
      features: ['Book Appointments', 'View Reports', 'Track Health', 'Telemedicine']
    },
    {
      id: 'doctor',
      title: 'Doctor',
      description: 'Manage patients, view medical records, and provide consultations',
      icon: Stethoscope,
      color: 'bg-gradient-to-br from-green-500 to-green-600',
      hoverColor: 'hover:from-green-600 hover:to-green-700',
      route: '/doctor-login',
      features: ['Patient Management', 'Medical Records', 'AI Chatbot', 'Consultations']
    },
    {
      id: 'staff',
      title: 'Staff',
      description: 'Handle administrative tasks, manage schedules, and assist operations',
      icon: Users,
      color: 'bg-gradient-to-br from-purple-500 to-purple-600',
      hoverColor: 'hover:from-purple-600 hover:to-purple-700',
      route: '/staff-login',
      features: ['Schedule Management', 'Patient Registration', 'Billing', 'Reports']
    },
    {
      id: 'laboratory',
      title: 'Laboratory',
      description: 'Manage test requests, process samples, and generate lab reports',
      icon: FlaskConical,
      color: 'bg-gradient-to-br from-orange-500 to-orange-600',
      hoverColor: 'hover:from-orange-600 hover:to-orange-700',
      route: '/laboratory-login',
      features: ['Test Processing', 'Sample Management', 'Lab Reports', 'Quality Control']
    },
    {
      id: 'admin',
      title: 'Administrator',
      description: 'System administration, user management, and hospital oversight',
      icon: Shield,
      color: 'bg-gradient-to-br from-red-500 to-red-600',
      hoverColor: 'hover:from-red-600 hover:to-red-700',
      route: '/admin-login',
      features: ['User Management', 'System Settings', 'Analytics', 'Security']
    }
  ];

  const handleRoleSelect = (role: any) => {
    setSelectedRole(role.id);
    // Add a small delay for visual feedback
    setTimeout(() => {
      navigate(role.route);
    }, 200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-white border-b border-slate-200 shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-indigo-600/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                  <Hospital className="h-8 w-8 text-white" />
                </div>
                <div className="text-left">
                  <h1 className="text-3xl font-bold text-slate-900">MediVoice</h1>
                  <p className="text-sm text-slate-600">Healthcare Management System</p>
                </div>
              </div>
            </div>
            
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Welcome to Your Healthcare Portal
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
              Access your personalized dashboard based on your role. Choose your login type below to get started with comprehensive healthcare management.
            </p>
            
            {/* Key Features */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <Badge variant="secondary" className="px-3 py-1 flex items-center gap-1">
                <Activity className="h-3 w-3" />
                Real-time Monitoring
              </Badge>
              <Badge variant="secondary" className="px-3 py-1 flex items-center gap-1">
                <Brain className="h-3 w-3" />
                AI-Powered Insights
              </Badge>
              <Badge variant="secondary" className="px-3 py-1 flex items-center gap-1">
                <Microscope className="h-3 w-3" />
                Advanced Analytics
              </Badge>
              <Badge variant="secondary" className="px-3 py-1 flex items-center gap-1">
                <CalendarDays className="h-3 w-3" />
                Smart Scheduling
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Role Selection Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h3 className="text-2xl font-bold text-slate-900 mb-4">
            Select Your Role to Continue
          </h3>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Choose your access level to get redirected to your personalized dashboard with role-specific features and tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {userRoles.map((role) => {
            const IconComponent = role.icon;
            const isSelected = selectedRole === role.id;
            
            return (
              <Card 
                key={role.id}
                className={`relative overflow-hidden transition-all duration-300 cursor-pointer group border-2 ${
                  isSelected 
                    ? 'border-blue-500 shadow-lg scale-105' 
                    : 'border-slate-200 hover:border-slate-300 hover:shadow-md hover:scale-102'
                }`}
                onClick={() => handleRoleSelect(role)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-3 rounded-xl ${role.color} ${role.hoverColor} transition-all duration-300 shadow-lg group-hover:shadow-xl`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <ArrowRight className={`h-5 w-5 transition-all duration-300 ${
                      isSelected ? 'text-blue-600 translate-x-1' : 'text-slate-400 group-hover:text-slate-600 group-hover:translate-x-1'
                    }`} />
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-900 group-hover:text-slate-700">
                    {role.title}
                  </CardTitle>
                  <CardDescription className="text-slate-600 text-sm leading-relaxed">
                    {role.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                      Key Features
                    </p>
                    <div className="space-y-1">
                      {role.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-slate-600">
                          <UserCheck className="h-3 w-3 text-green-500" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Button 
                    className={`w-full mt-4 ${role.color} ${role.hoverColor} text-white transition-all duration-300 group-hover:shadow-lg`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRoleSelect(role);
                    }}
                  >
                    Continue as {role.title}
                    <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Demo Access */}
        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto border-dashed border-2 border-slate-300 bg-slate-50/50">
            <CardContent className="py-8">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl shadow-lg">
                  <Activity className="h-6 w-6 text-white" />
                </div>
              </div>
              <h4 className="text-lg font-semibold text-slate-900 mb-2">
                Explore Demo Features
              </h4>
              <p className="text-slate-600 mb-4">
                Want to see the system in action? Try our interactive demo to explore all features without logging in.
              </p>
              <Button 
                variant="outline" 
                onClick={() => navigate('/demo')}
                className="border-slate-300 hover:bg-slate-100"
              >
                View Demo
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg">
                <Hospital className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">MediVoice</p>
                <p className="text-xs text-slate-600">Healthcare Excellence</p>
              </div>
            </div>
            <div className="flex gap-6 text-sm text-slate-600">
              <button 
                onClick={() => navigate('/privacy')}
                className="hover:text-slate-900 transition-colors"
              >
                Privacy Policy
              </button>
              <button 
                onClick={() => navigate('/terms')}
                className="hover:text-slate-900 transition-colors"
              >
                Terms of Service
              </button>
              <span>© 2025 MediVoice. All rights reserved.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
