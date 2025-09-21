import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Shield,
  Eye,
  EyeOff,
  Building2,
  Users,
  BarChart3,
  Lock,
  User,
  ArrowRight,
  CheckCircle2,
  Zap,
  Heart,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      if (formData.username && formData.password) {
        localStorage.setItem(
          "demo.user",
          JSON.stringify({
            role: "admin",
            name: formData.username || "Admin",
          })
        );
        toast({
          title: "Login Successful",
          description: "Welcome to Hospital Admin Dashboard (demo mode)",
        });
        navigate("/admin-dashboard");
      } else {
        toast({
          title: "Login Failed",
          description: "Please enter valid credentials",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        {/* Pattern */}
        <div className="absolute inset-0 opacity-8">
          <svg
            className="w-full h-full"
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="admin-pattern"
                x="0"
                y="0"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <rect
                  x="10"
                  y="10"
                  width="20"
                  height="20"
                  fill="currentColor"
                  opacity="0.06"
                />
                <circle
                  cx="20"
                  cy="20"
                  r="8"
                  fill="currentColor"
                  opacity="0.08"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#admin-pattern)" />
          </svg>
        </div>

        {/* Floating icons */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 right-1/4 opacity-5 animate-pulse">
            <Building2 className="h-24 w-24 text-white rotate-12" />
          </div>
          <div
            className="absolute bottom-1/4 left-1/4 opacity-5 animate-pulse"
            style={{ animationDelay: "2s" }}
          >
            <Users className="h-20 w-20 text-white -rotate-12" />
          </div>
          <div
            className="absolute top-1/2 right-1/2 opacity-5 animate-pulse"
            style={{ animationDelay: "4s" }}
          >
            <BarChart3 className="h-16 w-16 text-white rotate-45" />
          </div>
          <div
            className="absolute top-3/4 right-1/3 opacity-5 animate-pulse"
            style={{ animationDelay: "6s" }}
          >
            <Shield className="h-18 w-18 text-white -rotate-6" />
          </div>
        </div>

        {/* Grid lines */}
        <div className="absolute inset-0 opacity-4">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)
              `,
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        {/* Texture overlay */}
        <div
          className="absolute inset-0 opacity-3"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px),
                           radial-gradient(circle at 75% 75%, rgba(255,255,255,0.05) 1px, transparent 1px)`,
            backgroundSize: "40px 40px, 60px 60px",
          }}
        />
      </div>

      {/* Overlay tint */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-transparent to-cyan-400/10" />

      {/* Particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/20 rounded-full animate-ping"
          style={{ animationDelay: "0s", animationDuration: "4s" }}
        />
        <div
          className="absolute top-3/4 right-1/3 w-1 h-1 bg-white/30 rounded-full animate-ping"
          style={{ animationDelay: "2s", animationDuration: "3s" }}
        />
        <div
          className="absolute bottom-1/3 left-1/2 w-1.5 h-1.5 bg-white/25 rounded-full animate-ping"
          style={{ animationDelay: "1s", animationDuration: "5s" }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-row items-center justify-center text-white">
        {/* Left Side */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center p-12 text-white">
          <div className="max-w-lg">
            {/* Logo */}
            <div className="flex items-center gap-4 mb-8">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-2xl">
                <Building2 className="h-10 w-10 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  MediVoice Pro
                </h1>
                <p className="text-blue-200 text-lg">Hospital Management System</p>
              </div>
            </div>

            {/* Welcome */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-4 leading-tight">
                Welcome to the
                <span className="block bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Administrative Portal
                </span>
              </h2>
              <p className="text-blue-100 text-lg leading-relaxed">
                Manage your hospital operations with our comprehensive
                administrative dashboard. Access patient records, staff
                management, financial reports, and more.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                  <Users className="h-6 w-6 text-blue-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">
                    Staff & Patient Management
                  </h3>
                  <p className="text-blue-200 text-sm">
                    Comprehensive management tools
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                  <BarChart3 className="h-6 w-6 text-green-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">
                    Analytics & Reports
                  </h3>
                  <p className="text-blue-200 text-sm">
                    Real-time insights and reporting
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                  <Shield className="h-6 w-6 text-purple-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Secure & Compliant</h3>
                  <p className="text-blue-200 text-sm">HIPAA compliant security</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-2xl">
                  <Building2 className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-white">MediVoice Pro</h1>
              </div>
              <p className="text-blue-200">Hospital Management System</p>
            </div>

            {/* Card */}
            <Card className="bg-white/95 backdrop-blur-xl border-0 shadow-2xl">
              <CardHeader className="space-y-1 text-center pb-8">
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-lg">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                </div>
                <CardTitle className="text-3xl font-bold text-slate-800">
                  Admin Portal
                </CardTitle>
                <CardDescription className="text-slate-600 text-base">
                  Sign in to access the hospital management dashboard
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Username */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="username"
                      className="text-slate-700 font-medium"
                    >
                      Admin Username
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <Input
                        id="username"
                        name="username"
                        type="text"
                        placeholder="Enter your admin username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="pl-10 h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300"
                        required
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="text-slate-700 font-medium"
                    >
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="pl-10 pr-12 h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-slate-100"
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

                  {/* Submit */}
                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Signing in...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        Access Dashboard
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    )}
                  </Button>
                </form>

                {/* Security Features */}
                <div className="pt-6 border-t border-slate-200">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-slate-600">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      Secure Login
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Zap className="h-4 w-4 text-blue-500" />
                      Fast Access
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Shield className="h-4 w-4 text-purple-500" />
                      HIPAA Compliant
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Heart className="h-4 w-4 text-red-500" />
                      24/7 Support
                    </div>
                  </div>
                </div>

                <div className="text-center text-sm text-slate-500 space-y-1">
                  <p className="font-medium">Hospital Administration Portal</p>
                  <p>For technical support, contact IT department</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
