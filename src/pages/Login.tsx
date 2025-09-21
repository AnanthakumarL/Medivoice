import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Eye,
  EyeOff,
  Stethoscope,
  Shield,
  Heart,
  Activity,
  Brain,
  UserCheck,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Frontend-only demo login
    const name = formData.email.split("@")[0] || "Patient";
    localStorage.setItem(
      "demo.user",
      JSON.stringify({ role: "patient", name, email: formData.email })
    );

    toast({
      title: "Welcome back!",
      description: "You have been successfully logged in (demo mode).",
    });

    navigate("/dashboard");
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Continuous Medical Background - Full Screen for Both Sides */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-green-900 to-teal-900">
        {/* Sophisticated Medical Pattern */}
        <div className="absolute inset-0 opacity-8">
          <svg
            className="w-full h-full"
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="medical-pattern"
                x="0"
                y="0"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                {/* Medical cross */}
                <path
                  d="M18 16h4v8h-4zM16 18h8v4h-8z"
                  fill="currentColor"
                  opacity="0.15"
                />
                {/* Heartbeat line */}
                <path
                  d="M2 20h6l2-4 2 8 2-8 2 4h6"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  fill="none"
                  opacity="0.1"
                />
                {/* Dots */}
                <circle
                  cx="8"
                  cy="8"
                  r="0.8"
                  fill="currentColor"
                  opacity="0.1"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="0.8"
                  fill="currentColor"
                  opacity="0.1"
                />
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
          <div
            className="absolute bottom-1/4 left-1/4 opacity-5 animate-pulse"
            style={{ animationDelay: "2s" }}
          >
            <Activity className="h-20 w-20 text-white transform -rotate-12" />
          </div>
          <div
            className="absolute top-1/2 right-1/2 opacity-5 animate-pulse"
            style={{ animationDelay: "4s" }}
          >
            <Brain className="h-16 w-16 text-white transform rotate-45" />
          </div>
          <div
            className="absolute top-3/4 right-1/3 opacity-5 animate-pulse"
            style={{ animationDelay: "6s" }}
          >
            <UserCheck className="h-18 w-18 text-white transform -rotate-6" />
          </div>
        </div>

        {/* Professional Grid Lines */}
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
          ></div>
        </div>

        {/* Subtle Texture Overlay */}
        <div
          className="absolute inset-0 opacity-3"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px),
                           radial-gradient(circle at 75% 75%, rgba(255,255,255,0.05) 1px, transparent 1px)`,
            backgroundSize: "40px 40px, 60px 60px",
          }}
        ></div>
      </div>

      {/* Professional Overlay with Depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/10" />

      {/* Subtle Animated Particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/20 rounded-full animate-ping"
          style={{ animationDelay: "0s", animationDuration: "4s" }}
        ></div>
        <div
          className="absolute top-3/4 right-1/3 w-1 h-1 bg-white/30 rounded-full animate-ping"
          style={{ animationDelay: "2s", animationDuration: "3s" }}
        ></div>
        <div
          className="absolute bottom-1/3 left-1/2 w-1.5 h-1.5 bg-white/25 rounded-full animate-ping"
          style={{ animationDelay: "1s", animationDuration: "5s" }}
        ></div>
      </div>

      {/* Overlay Content - Two Column Layout */}
      <div className="relative z-10 flex flex-row justify-center items-center min-h-screen text-white">
        {/* Left Side: Hero Content */}
  <div className="max-w-lg w-full flex-1" style={{ marginLeft: '3cm' }}>
          <div className="flex items-center gap-3 mb-8 justify-start">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <Stethoscope className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold">MediVoice</h1>
          </div>

          <h2 className="text-4xl font-bold mb-6 leading-tight text-left">
            Your Health Journey Starts Here
          </h2>

          <p className="text-xl mb-8 text-white/90 leading-relaxed text-left">
            Access your medical records, connect with healthcare providers,
            and manage your health with our intelligent AI assistant.
          </p>

          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-lg">
              <Shield className="h-6 w-6 text-emerald-400" />
              <div>
                <h3 className="font-semibold">Secure & Private</h3>
                <p className="text-sm text-white/80">
                  Your health data is protected with bank-level security
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-lg">
              <Heart className="h-6 w-6 text-green-400" />
              <div>
                <h3 className="font-semibold">AI-Powered Care</h3>
                <p className="text-sm text-white/80">
                  Get personalized health insights and reminders
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Login Card */}
        <div className="flex-1 flex justify-end" style={{ marginRight: '3cm' }}>
          <div className="mt-10 flex flex-col items-end w-full max-w-md">
            {/* Welcome Back Message */}
            <div className="mb-6 w-full text-center">
              <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
              <p className="text-white">Sign in to access your personal health dashboard</p>
            </div>
            <Card className="border-0 shadow-medium w-full max-w-md">
              <CardHeader className="space-y-1 pb-4">
                <CardTitle className="text-xl text-center">Patient Login</CardTitle>
                <CardDescription className="text-center">
                  Enter your credentials to continue
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                      className="h-11"
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
                        onChange={(e) =>
                          handleInputChange("password", e.target.value)
                        }
                        required
                        className="h-11 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-smooth"
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
                        Remember me
                      </Label>
                    </div>

                    <Link
                      to="/forgot-password"
                      className="text-sm text-emerald-400 hover:text-emerald-300 transition-smooth"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    variant="medical"
                    size="lg"
                    className="w-full"
                  >
                    Sign In
                  </Button>
                </form>

                <div className="mt-6 text-center text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="text-emerald-400 hover:text-emerald-300 transition-smooth font-medium"
                  >
                    Create account
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Terms and Policy */}
        <div className="absolute bottom-6 left-0 w-full text-center text-xs text-muted-foreground">
          <p>
            By signing in, you agree to our{" "}
            <Link to="/terms" className="text-emerald-400 hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-emerald-400 hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
