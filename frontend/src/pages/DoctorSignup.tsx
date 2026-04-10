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
  UserPlus,
  Phone,
  Mail,
  User,
  Lock,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { authAPI, tokenHelper } from "@/lib/api";

interface FormData {
  name: string;
  phoneNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

interface FormErrors {
  name?: string;
  phoneNumber?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  agreeToTerms?: string;
}

const DoctorSignup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Validation functions
  const validateName = (name: string): string | undefined => {
    if (!name.trim()) return "Name is required";
    if (name.trim().length < 2) return "Name must be at least 2 characters";
    if (name.trim().length > 50) return "Name must be less than 50 characters";
    if (!/^[a-zA-Z\s]+$/.test(name.trim())) return "Name can only contain letters and spaces";
    return undefined;
  };

  const validatePhoneNumber = (phone: string): string | undefined => {
    if (!phone.trim()) return "Phone number is required";
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ""))) {
      return "Please enter a valid phone number";
    }
    return undefined;
  };

  const validateEmail = (email: string): string | undefined => {
    if (!email.trim()) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return undefined;
  };

  const validatePassword = (password: string): string | undefined => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    if (!/(?=.*[a-z])/.test(password)) return "Password must contain at least one lowercase letter";
    if (!/(?=.*[A-Z])/.test(password)) return "Password must contain at least one uppercase letter";
    if (!/(?=.*\d)/.test(password)) return "Password must contain at least one number";
    if (!/(?=.*[@$!%*?&])/.test(password)) return "Password must contain at least one special character";
    return undefined;
  };

  const validateConfirmPassword = (confirmPassword: string, password: string): string | undefined => {
    if (!confirmPassword) return "Please confirm your password";
    if (confirmPassword !== password) return "Passwords do not match";
    return undefined;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    newErrors.name = validateName(formData.name);
    newErrors.phoneNumber = validatePhoneNumber(formData.phoneNumber);
    newErrors.email = validateEmail(formData.email);
    newErrors.password = validatePassword(formData.password);
    newErrors.confirmPassword = validateConfirmPassword(formData.confirmPassword, formData.password);
    
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== undefined);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please correct the errors in the form.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const [firstName, ...lastNameParts] = formData.name.trim().split(' ');
      const lastName = lastNameParts.join(' ') || firstName;

      const registrationData = {
        firstName,
        lastName,
        email: formData.email.toLowerCase(),
        password: formData.password,
        phone: formData.phoneNumber,
        role: "doctor" as const
      };

      const response = await authAPI.register(registrationData);

      if (!response.success) {
        throw new Error(response.message || 'Registration failed');
      }

      // Store user data and token
      tokenHelper.setToken(response.data.token);
      localStorage.setItem('auth.user', JSON.stringify(response.data.user));

      toast({
        title: "Account Created Successfully!",
        description: `Welcome to MediVoice, Dr. ${response.data.user?.firstName}!`,
      });

      navigate("/doctor-dashboard");
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Continuous Medical Background - Same as Login Page */}
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
            <h1 className="text-3xl font-bold">MediVoice Pro</h1>
          </div>

          <h2 className="text-4xl font-bold mb-6 leading-tight text-left">
            Join Our Network of Professionals
          </h2>

          <p className="text-xl mb-8 text-white/90 leading-relaxed text-left">
            Create your professional account to manage your practice, connect with patients, and leverage our AI-powered tools.
          </p>

          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-lg">
              <Shield className="h-6 w-6 text-emerald-400" />
              <div>
                <h3 className="font-semibold">Secure Practice Management</h3>
                <p className="text-sm text-white/80">
                  Your professional information is protected with advanced encryption.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-lg">
              <Heart className="h-6 w-6 text-green-400" />
              <div>
                <h3 className="font-semibold">Enhanced Patient Care</h3>
                <p className="text-sm text-white/80">
                  Utilize AI tools to provide better care and streamline your workflow.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Registration Card */}
        <div className="flex-1 flex justify-end" style={{ marginRight: '3cm' }}>
          <div className="mt-10 flex flex-col items-end w-full max-w-md">
            {/* Welcome Message */}
            <div className="mb-6 w-full text-center">
              <h2 className="text-3xl font-bold text-white mb-2">Create Professional Account</h2>
              <p className="text-white">Join thousands of doctors using MediVoice Pro</p>
            </div>
            <Card className="border-0 shadow-medium w-full max-w-md">
              <CardHeader className="space-y-1 pb-4">
                <CardTitle className="text-xl text-center flex items-center justify-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  Doctor Registration
                </CardTitle>
                <CardDescription className="text-center">
                  Fill in your details to get started
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name Field */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className={`h-11 ${errors.name ? 'border-red-500' : ''}`}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500">{errors.name}</p>
                    )}
                  </div>

                  {/* Phone Number Field */}
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone Number
                    </Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                      className={`h-11 ${errors.phoneNumber ? 'border-red-500' : ''}`}
                    />
                    {errors.phoneNumber && (
                      <p className="text-sm text-red-500">{errors.phoneNumber}</p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className={`h-11 ${errors.email ? 'border-red-500' : ''}`}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500">{errors.email}</p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        className={`h-11 pr-10 ${errors.password ? 'border-red-500' : ''}`}
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
                    {errors.password && (
                      <p className="text-sm text-red-500">{errors.password}</p>
                    )}
                  </div>

                  {/* Confirm Password Field */}
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        className={`h-11 pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-smooth"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                    )}
                  </div>

                  {/* Terms and Conditions */}
                  <div className="space-y-2">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onCheckedChange={(checked) =>
                          handleInputChange("agreeToTerms", checked as boolean)
                        }
                        className={errors.agreeToTerms ? 'border-red-500' : ''}
                      />
                      <Label htmlFor="agreeToTerms" className="text-sm leading-5">
                        I agree to the{" "}
                        <Link
                          to="/terms"
                          className="text-emerald-400 hover:text-emerald-300 transition-smooth underline"
                        >
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link
                          to="/privacy"
                          className="text-emerald-400 hover:text-emerald-300 transition-smooth underline"
                        >
                          Privacy Policy
                        </Link>
                      </Label>
                    </div>
                    {errors.agreeToTerms && (
                      <p className="text-sm text-red-500">{errors.agreeToTerms}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    variant="medical"
                    size="lg"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Creating Account...
                      </div>
                    ) : (
                      "Create Professional Account"
                    )}
                  </Button>
                </form>

                <div className="mt-6 text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link
                    to="/doctor-login"
                    className="text-emerald-400 hover:text-emerald-300 transition-smooth font-medium"
                  >
                    Sign in here
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Terms and Policy */}
        <div className="absolute bottom-6 left-0 w-full text-center text-xs text-muted-foreground">
          <p>
            By creating an account, you agree to our{" "}
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

export default DoctorSignup;
