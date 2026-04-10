import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Stethoscope, UserCheck, Shield, Clock, Heart, Users, Clipboard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const StaffLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    staffId: "",
    password: "",
    rememberMe: false,
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Frontend-only demo login (staff)
    localStorage.setItem("demo.user", JSON.stringify({ role: "staff", name: formData.staffId || "Demo Staff", email: formData.staffId }));

    toast({
      title: "Welcome to MediVoice!",
      description: "You have been successfully logged in to your staff dashboard (demo mode).",
    });
    
    navigate("/staff-dashboard");
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Continuous Healthcare Background - Full Screen for Both Sides */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-violet-900 to-indigo-900" style={{
        background: 'linear-gradient(to bottom right, #5B2C87, #8A2BE2, #4B0082)'
      }}>
        {/* Sophisticated Healthcare Pattern */}
        <div className="absolute inset-0 opacity-8">
          <svg className="w-full h-full" viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="healthcare-pattern" x="0" y="0" width="36" height="36" patternUnits="userSpaceOnUse">
                <path d="M16 14h4v8h-4zM14 16h8v4h-8z" fill="currentColor" opacity="0.12"/>
                <rect x="10" y="8" width="16" height="20" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.08"/>
                <rect x="12" y="6" width="12" height="3" fill="currentColor" opacity="0.06"/>
                <path d="M12 14l2 2 4-4" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.1"/>
                <path d="M12 20l2 2 4-4" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.1"/>
                <circle cx="6" cy="6" r="0.8" fill="currentColor" opacity="0.08"/>
                <circle cx="30" cy="30" r="0.8" fill="currentColor" opacity="0.08"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#healthcare-pattern)" />
          </svg>
        </div>

        {/* Floating Healthcare Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/5 right-1/5 opacity-5 animate-pulse">
            <Users className="h-22 w-22 text-white transform rotate-6" />
          </div>
          <div className="absolute bottom-1/5 left-1/5 opacity-5 animate-pulse" style={{ animationDelay: '3s' }}>
            <Shield className="h-20 w-20 text-white transform -rotate-12" />
          </div>
          <div className="absolute top-2/3 right-1/3 opacity-5 animate-pulse" style={{ animationDelay: '1.5s' }}>
            <Clock className="h-16 w-16 text-white transform rotate-30" />
          </div>
          <div className="absolute top-1/3 left-1/2 opacity-5 animate-pulse" style={{ animationDelay: '4.5s' }}>
            <Clipboard className="h-18 w-18 text-white transform -rotate-15" />
          </div>
          <div className="absolute bottom-1/2 right-1/4 opacity-5 animate-pulse" style={{ animationDelay: '2s' }}>
            <Heart className="h-14 w-14 text-white transform rotate-12" />
          </div>
        </div>

        {/* Professional Grid Overlay */}
        <div className="absolute inset-0 opacity-4">
          <div className="w-full h-full" style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        {/* Sophisticated Texture Layer */}
        <div className="absolute inset-0 opacity-3" style={{
          backgroundImage: `radial-gradient(circle at 30% 20%, rgba(255,255,255,0.08) 1px, transparent 1px),
                           radial-gradient(circle at 70% 80%, rgba(255,255,255,0.04) 1px, transparent 1px)`,
          backgroundSize: '45px 45px, 65px 65px'
        }}></div>
      </div>

      {/* Professional Overlay with Depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 via-transparent to-primary/10" />

      {/* Subtle Animated Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-white/20 rounded-full animate-ping" style={{ animationDelay: '1s', animationDuration: '4s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-white/30 rounded-full animate-ping" style={{ animationDelay: '3s', animationDuration: '3s' }}></div>
        <div className="absolute top-2/3 left-1/4 w-1.5 h-1.5 bg-white/25 rounded-full animate-ping" style={{ animationDelay: '0.5s', animationDuration: '5s' }}></div>
        <div className="absolute bottom-1/2 right-1/2 w-1 h-1 bg-white/20 rounded-full animate-ping" style={{ animationDelay: '2.5s', animationDuration: '4s' }}></div>
      </div>

      {/* Overlay Content - Two Column Layout Restored */}
      <div className="relative z-10 flex min-h-screen flex-row items-center justify-center text-white">
        {/* Left Side: Hero Content */}
        <div className="hidden lg:flex flex-col justify-center p-12 text-white w-3/5">
          <div className="max-w-lg">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <Stethoscope className="h-8 w-8" />
              </div>
              <h1 className="text-3xl font-bold">MediVoice Staff</h1>
            </div>
            <h2 className="text-4xl font-bold mb-6 leading-tight">
              Empowering Healthcare Teams
            </h2>
            <p className="text-xl mb-8 text-white/90 leading-relaxed">
              Access patient information, manage medications, track tasks, and coordinate 
              care with our intelligent healthcare staff platform.
            </p>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/15 transition-all duration-300">
                <Users className="h-6 w-6 text-medical-secondary" />
                <div>
                  <h3 className="font-semibold">Patient Care Management</h3>
                  <p className="text-sm text-white/80">Efficiently manage patient care and medication schedules</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/15 transition-all duration-300">
                <Clock className="h-6 w-6 text-accent" />
                <div>
                  <h3 className="font-semibold">Smart Task Management</h3>
                  <p className="text-sm text-white/80">Organize daily tasks and shift schedules seamlessly</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/15 transition-all duration-300">
                <Shield className="h-6 w-6 text-medical-accent" />
                <div>
                  <h3 className="font-semibold">Secure Access</h3>
                  <p className="text-sm text-white/80">HIPAA-compliant platform with role-based permissions</p>
                </div>
              </div>
            </div>
            <div className="mt-8 p-4 bg-medical-accent/20 backdrop-blur-sm rounded-lg border border-medical-accent/30">
              <p className="text-sm text-white/90">
                <strong>Healthcare Staff Portal</strong><br />
                Designed for nurses, medical assistants, and healthcare support staff.
              </p>
            </div>
          </div>
        </div>
        {/* Right Side: Login Card */}
        <div className="w-full lg:w-2/5 flex items-center justify-center p-8">
          <div className="w-full max-w-md space-y-8">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="p-3 bg-medical-secondary/10 rounded-xl">
                  <Stethoscope className="h-8 w-8 text-medical-secondary" />
                </div>
                <h1 className="text-3xl font-bold text-foreground">MediVoice Staff</h1>
              </div>
            </div>
            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-bold text-foreground mb-2">Staff Portal</h2>
              <p className="text-muted-foreground">
                Sign in to access your healthcare staff dashboard
              </p>
            </div>
            <Card className="border-0 shadow-elegant bg-white/80 backdrop-blur-md relative z-10">
              <CardHeader className="space-y-1 pb-4">
                <CardTitle className="text-xl text-center text-medical-secondary">Healthcare Staff Login</CardTitle>
                <CardDescription className="text-center">
                  Enter your staff credentials to continue
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="staffId">Staff ID / Email</Label>
                    <Input
                      id="staffId"
                      type="text"
                      placeholder="Enter your staff ID or email"
                      value={formData.staffId}
                      onChange={(e) => handleInputChange("staffId", e.target.value)}
                      required
                      className="h-11 focus-visible:ring-medical-secondary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        required
                        className="h-11 pr-10 focus-visible:ring-medical-secondary"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-medical-secondary transition-smooth"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
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
                        Stay signed in
                      </Label>
                    </div>
                    <Link
                      to="/staff-forgot-password"
                      className="text-sm text-medical-secondary hover:text-medical-secondary/80 transition-smooth"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Button type="submit" variant="medical" size="lg" className="w-full">
                    Access Staff Dashboard
                  </Button>
                </form>
                <div className="mt-6 text-center">
                  <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                    <Link
                      to="/login"
                      className="text-medical-secondary hover:text-medical-secondary/80 transition-smooth font-medium"
                    >
                      Patient Portal
                    </Link>
                    <span className="text-muted-foreground/50">|</span>
                    <Link
                      to="/doctor-login"
                      className="text-medical-secondary hover:text-medical-secondary/80 transition-smooth font-medium"
                    >
                      Doctor Portal
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="text-center text-xs text-muted-foreground">
              <p>
                By signing in, you agree to our{" "}
                <Link to="/staff-terms" className="text-medical-secondary hover:underline">
                  Staff Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy-policy" className="text-medical-secondary hover:underline">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffLogin;