import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Microscope, TestTube, FlaskConical, Shield, ArrowRight, Beaker, Activity, BarChart3, CheckCircle2, Zap, Heart, User, Lock, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LaboratoryLogin = () => {
  const [credentials, setCredentials] = useState({
    labId: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!credentials.labId || !credentials.password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    
    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);
      // Frontend-only demo login (lab)
      localStorage.setItem("demo.user", JSON.stringify({ role: "lab", name: "Demo Lab Tech", email: credentials.labId + "@lab.local" }));
      toast({
        title: "Login Successful",
        description: "Welcome to Laboratory Portal (demo mode)",
      });
      navigate('/laboratory-dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent"></div>
      </div>

      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Laboratory Information */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center p-12 text-white">
          <div className="max-w-lg">
            {/* Logo and Brand */}
            <div className="flex items-center gap-4 mb-8">
              <div className="p-4 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl shadow-2xl">
                <Microscope className="h-10 w-10 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">
                  MediVoice Lab
                </h1>
                <p className="text-emerald-200 text-lg">Laboratory Management System</p>
              </div>
            </div>

            {/* Welcome Message */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-4 leading-tight">
                Advanced Laboratory
                <span className="block bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  Management Portal
                </span>
              </h2>
              <p className="text-emerald-100 text-lg leading-relaxed">
                Streamline your laboratory operations with our comprehensive management system.
                Handle test requests, manage samples, generate reports, and ensure quality control.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                  <TestTube className="h-6 w-6 text-emerald-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Test Management</h3>
                  <p className="text-emerald-200 text-sm">Comprehensive test tracking and processing</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                  <FlaskConical className="h-6 w-6 text-teal-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Sample Tracking</h3>
                  <p className="text-emerald-200 text-sm">Real-time sample status and location</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                  <BarChart3 className="h-6 w-6 text-cyan-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">AI-Powered Reports</h3>
                  <p className="text-emerald-200 text-sm">Intelligent analysis and reporting</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                  <Shield className="h-6 w-6 text-purple-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Quality Assurance</h3>
                  <p className="text-emerald-200 text-sm">Automated quality control and compliance</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl shadow-2xl">
                  <Microscope className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-white">MediVoice Lab</h1>
              </div>
              <p className="text-emerald-200">Laboratory Management System</p>
            </div>

            <Card className="bg-white/95 backdrop-blur-xl border-0 shadow-2xl">
              <CardHeader className="space-y-1 text-center pb-8">
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="p-4 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl shadow-lg">
                      <Microscope className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center shadow-lg">
                      <TestTube className="w-3 h-3 text-white" />
                    </div>
                  </div>
                </div>
                <CardTitle className="text-3xl font-bold text-slate-800">Laboratory Portal</CardTitle>
                <CardDescription className="text-slate-600 text-base">
                  Access your laboratory management dashboard
                </CardDescription>

                {error && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </CardHeader>

              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="labId" className="text-slate-700 font-medium">
                      Laboratory ID
                    </Label>
                    <div className="relative">
                      <Beaker className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <Input
                        id="labId"
                        name="labId"
                        type="text"
                        placeholder="Enter your laboratory ID"
                        value={credentials.labId}
                        onChange={handleInputChange}
                        className="pl-10 h-12 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 transition-all duration-300"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-slate-700 font-medium">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={credentials.password}
                        onChange={handleInputChange}
                        className="pl-10 pr-12 h-12 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 transition-all duration-300"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-slate-100"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-slate-500" />
                        ) : (
                          <Eye className="h-4 w-4 text-slate-500" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Signing in...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        Access Lab Portal
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    )}
                  </Button>
                </form>

                {/* Laboratory Features */}
                <div className="pt-6 border-t border-slate-200">
                  <div className="text-center mb-4">
                    <h4 className="text-sm font-medium text-slate-700">Laboratory Features</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-slate-600">
                      <TestTube className="h-4 w-4 text-emerald-500" />
                      Test Management
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <FlaskConical className="h-4 w-4 text-teal-500" />
                      Sample Tracking
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Activity className="h-4 w-4 text-cyan-500" />
                      Real-time Monitoring
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <BarChart3 className="h-4 w-4 text-blue-500" />
                      AI Reporting
                    </div>
                  </div>
                </div>

                {/* Security Features */}
                <div className="pt-4 border-t border-slate-200">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-slate-600">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      Secure Access
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Zap className="h-4 w-4 text-yellow-500" />
                      Fast Processing
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Shield className="h-4 w-4 text-purple-500" />
                      Data Protection
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Heart className="h-4 w-4 text-red-500" />
                      24/7 Support
                    </div>
                  </div>
                </div>

                <div className="text-center text-sm text-slate-500 space-y-1">
                  <p className="font-medium">Laboratory Management Portal</p>
                  <p>Need help? Contact lab administrator</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaboratoryLogin;