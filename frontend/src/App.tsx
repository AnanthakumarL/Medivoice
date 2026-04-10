import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import DoctorLogin from "./pages/DoctorLogin";
import StaffLogin from "./pages/StaffLogin";
import LaboratoryLogin from "./pages/LaboratoryLogin";
import Dashboard from "./pages/Dashboard";
import DynamicDashboard from "./pages/DynamicDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import LaboratoryDashboard from "./pages/LaboratoryDashboard";
import LaboratoryAI from "./pages/LaboratoryAI";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import TreatmentReport from "./pages/TreatmentReport";
import AppointmentBooking from "./pages/AppointmentBooking";
import Appointments from "./pages/Appointments";
import DoctorSelection from "./pages/DoctorSelection";
import DoctorAppointment from "./pages/DoctorAppointment";
import ForgotPassword from "./pages/ForgotPassword";
import Register from "./pages/Register";
import DoctorSignup from "./pages/DoctorSignup";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import AI from "./pages/AI";
import DoctorAIChatbot from "./pages/DoctorAIChatbot";
import ViewMedicalRecord from "./pages/ViewMedicalRecord";
import ViewMedicine from "./pages/ViewMedicine";
import Cart from "./pages/Cart";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/doctor-login" element={<DoctorLogin />} />
          <Route path="/staff-login" element={<StaffLogin />} />
          <Route path="/laboratory-login" element={<LaboratoryLogin />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DynamicDashboard />
            </ProtectedRoute>
          } />
          <Route path="/doctor-dashboard" element={
            <DoctorDashboard />
          } />
          <Route path="/doctor/ai-chatbot" element={
            <DoctorAIChatbot />
          } />
          <Route path="/staff-dashboard" element={
            <StaffDashboard />
          } />
          <Route path="/laboratory-dashboard" element={
            <LaboratoryDashboard />
          } />
          <Route path="/laboratory-ai" element={
            <LaboratoryAI />
          } />
          <Route path="/admin-dashboard" element={
            <AdminDashboard />
          } />
          <Route path="/treatment-report" element={<TreatmentReport />} />
          <Route path="/appointment-booking" element={<AppointmentBooking />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/doctor-selection" element={<DoctorSelection />} />
          <Route path="/view-medical-record" element={<ViewMedicalRecord />} />
          <Route path="/view-medicine" element={<ViewMedicine />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/doctor-appointment" element={
            <ProtectedRoute>
              <DoctorAppointment />
            </ProtectedRoute>
          } />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/register" element={<Register />} />
          <Route path="/doctor-signup" element={<DoctorSignup />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/ai" element={<AI />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
