import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Stethoscope, UserCheck, Brain, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { authAPI, tokenHelper } from "@/lib/api";

const DoctorLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await authAPI.login({
        email: formData.email,
        password: formData.password,
      });

      if (response.success && response.data.user.role === 'doctor') {
        tokenHelper.setToken(response.data.token);
        localStorage.setItem('auth.user', JSON.stringify(response.data.user));
        toast({
          title: "Welcome Doctor!",
          description: "You have been successfully logged in.",
        });
        navigate("/doctor-dashboard");
      } else {
        throw new Error(response.message || "Login failed or you are not a doctor.");
      }
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Continuous Medical Background - Full Screen for Both Sides */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-green-900 to-teal-900">
        {/* Sophisticated Medical Pattern */}
        <div className="absolute inset-0 opacity-8">
          <svg className="w-full h-full" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="medical-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M18 16h4v8h-4zM16 18h8v4h-8z" fill="currentColor" opacity="0.15"/>
                <path d="M2 20h6l2-4 2 8 2-8 2 4h6" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.1"/>
                <circle cx="8" cy="8" r="0.8" fill="currentColor" opacity="0.1"/>
                <circle cx="32" cy="32" r="0.8" fill="currentColor" opacity="0.1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#medical-pattern)" />
          </svg>
        </div>

        {/* Floating Medical Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 right-1/4 opacity-5 animate-pulse">
            <Stethoscope className="h-24 w-24 text-white transform rotate-12" />
          </div>
          <div className="absolute bottom-1/4 left-1/4 opacity-5 animate-pulse" style={{ animationDelay: '2s' }}>
            <Activity className="h-20 w-20 text-white transform -rotate-12" />
          </div>
          <div className="absolute top-1/2 right-1/2 opacity-5 animate-pulse" style={{ animationDelay: '4s' }}>
            <Brain className="h-16 w-16 text-white transform rotate-45" />
          </div>
          <div className="absolute top-3/4 right-1/3 opacity-5 animate-pulse" style={{ animationDelay: '6s' }}>
            <UserCheck className="h-18 w-18 text-white transform -rotate-6" />
          </div>
        </div>

        {/* Professional Grid Lines */}
        <div className="absolute inset-0 opacity-4">
          <div className="w-full h-full" style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}></div>
        </div>

        {/* Subtle Texture Overlay */}
        <div className="absolute inset-0 opacity-3" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px),
                         radial-gradient(circle at 75% 75%, rgba(255,255,255,0.05) 1px, transparent 1px)`,
          backgroundSize: '40px 40px, 60px 60px'
        }}></div>
      </div>

      {/* Professional Overlay with Depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/10" />

      {/* Subtle Animated Particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/20 rounded-full animate-ping" style={{ animationDelay: '0s', animationDuration: '4s' }}></div>
        <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-white/30 rounded-full animate-ping" style={{ animationDelay: '2s', animationDuration: '3s' }}></div>
        <div className="absolute bottom-1/3 left-1/2 w-1.5 h-1.5 bg-white/25 rounded-full animate-ping" style={{ animationDelay: '1s', animationDuration: '5s' }}></div>
      </div>

      {/* Overlay Content - Two Column Layout */}
      <div className="relative z-10 flex min-h-screen flex-row items-center justify-center text-white">
        {/* Left Side: Hero Content */}
        <div className="hidden lg:flex flex-col justify-center p-12 text-white w-3/5">
          <div className="max-w-lg">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <Stethoscope className="h-8 w-8" />
              </div>
              <h1 className="text-3xl font-bold">MediVoice Pro</h1>
            </div>
            <h2 className="text-4xl font-bold mb-6 leading-tight">
              Advanced Medical Platform for Healthcare Professionals
            </h2>
            <p className="text-xl mb-8 text-white/90 leading-relaxed">
              Access patient records, manage appointments, and leverage AI-powered insights 
              to provide exceptional healthcare with our intelligent medical assistant.
            </p>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/15 transition-all duration-300">
                <UserCheck className="h-6 w-6 text-medical-secondary" />
                <div>
                  <h3 className="font-semibold">Professional Access</h3>
                  <p className="text-sm text-white/80">Secure access to patient records and medical data</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/15 transition-all duration-300">
                <Brain className="h-6 w-6 text-accent" />
                <div>
                  <h3 className="font-semibold">AI Medical Assistant</h3>
                  <p className="text-sm text-white/80">Voice-powered documentation and intelligent insights</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/15 transition-all duration-300">
                <Activity className="h-6 w-6 text-medical-accent" />
                <div>
                  <h3 className="font-semibold">Real-time Analytics</h3>
                  <p className="text-sm text-white/80">Track patient progress and treatment outcomes</p>
                </div>
              </div>
            </div>
            <div className="mt-8 p-4 bg-medical-accent/20 backdrop-blur-sm rounded-lg border border-medical-accent/30">
              <p className="text-sm text-white/90">
                <strong>Medical Professional Access Only</strong><br />
                This portal is exclusively for licensed healthcare providers and medical staff.
              </p>
            </div>
          </div>
        </div>
        {/* Right Side: Login Card */}
        <div className="w-full lg:w-2/5 flex items-center justify-center p-8">
          <div className="login-card w-full max-w-md">
            <Card className="w-full max-w-md shadow-lg border border-slate-200 bg-white/80 backdrop-blur-md relative z-10 py-4" style={{ marginTop: '4cm' }}>
              <CardHeader className="space-y-2 text-center pb-2">
                <CardTitle className="text-2xl font-bold text-foreground">Doctor Portal</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Sign in to access your medical practice dashboard
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6 py-4 space-y-4">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Medical Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="doctor@hospital.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                      className="h-11 rounded-lg border px-3 focus-visible:ring-medical-primary"
                    />
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="password">Secure Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your secure password"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        required
                        className="h-11 rounded-lg border px-3 pr-10 focus-visible:ring-medical-primary"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-medical-primary transition-smooth"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Remember + Forgot */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remember"
                        checked={formData.rememberMe}
                        onCheckedChange={(checked) => 
                          handleInputChange("rememberMe", checked as boolean)
                        }
                      />
                      <Label htmlFor="remember" className="text-sm">
                        Keep me signed in
                      </Label>
                    </div>
                    <Link
                      to="/doctor-forgot-password"
                      className="text-sm text-medical-primary hover:text-medical-primary/80 transition-smooth"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  {/* Submit */}
                  <Button type="submit" variant="medical" size="lg" className="w-full rounded-lg shadow-sm hover:shadow-md transition-all">
                    Access Medical Dashboard
                  </Button>
                </form>

                {/* Links Below */}
                <div className="pt-4 text-center text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Link
                    to="/doctor-signup"
                    className="text-medical-primary hover:text-medical-primary/80 transition-smooth font-medium"
                  >
                    Register here
                  </Link>
                </div>

                <div className="pt-4 border-t text-center">
                  <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                    <Link
                      to="/login"
                      className="text-medical-primary hover:text-medical-primary/80 transition-smooth font-medium"
                    >
                      Patient Portal
                    </Link>
                    <span className="text-muted-foreground/50">|</span>
                    <Link
                      to="/admin-login"
                      className="text-medical-primary hover:text-medical-primary/80 transition-smooth font-medium"
                    >
                      Admin Access
                    </Link>
                  </div>
                </div>

                {/* Terms */}
                <div className="text-center text-xs text-muted-foreground mt-4">
                  <p>
                    By signing in, you agree to our{" "}
                    <Link to="/medical-terms" className="text-medical-primary hover:underline">
                      Medical Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link to="/hipaa-privacy" className="text-medical-primary hover:underline">
                      HIPAA Privacy Policy
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorLogin;
