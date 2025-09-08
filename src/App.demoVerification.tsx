import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import theme from './theme/demoTheme';
import { DemoNavigationHub } from './components/demo/DemoNavigationHub';

// Import existing pages for demo verification
import Login from "./pages/Login";
import DoctorLogin from "./pages/DoctorLogin";
import StaffLogin from "./pages/StaffLogin";
import LaboratoryLogin from "./pages/LaboratoryLogin";
import Dashboard from "./pages/Dashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import LaboratoryDashboard from "./pages/LaboratoryDashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import Demo from "./pages/Demo";
import DoctorAIChatbot from "./pages/DoctorAIChatbot";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Main Demo Verification Hub */}
            <Route path="/" element={<DemoNavigationHub />} />
            <Route path="/demo-verification" element={<DemoNavigationHub />} />
            
            {/* Original Demo Page */}
            <Route path="/demo" element={<Demo />} />
            
            {/* Login Pages */}
            <Route path="/login" element={<Login />} />
            <Route path="/doctor-login" element={<DoctorLogin />} />
            <Route path="/staff-login" element={<StaffLogin />} />
            <Route path="/laboratory-login" element={<LaboratoryLogin />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            
            {/* Dashboard Pages */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
            <Route path="/doctor/ai-chatbot" element={<DoctorAIChatbot />} />
            <Route path="/staff-dashboard" element={<StaffDashboard />} />
            <Route path="/laboratory-dashboard" element={<LaboratoryDashboard />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            
            {/* Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;