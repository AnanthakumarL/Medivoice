import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Calendar,
  FileText,
  DollarSign,
  Settings,
  HelpCircle,
  Bell,
  LogOut,
  Activity,
  TrendingUp,
  CheckCircle,
  User,
  Shield,
  Zap,
  Home,
  UserPlus,
  Plus,
  Download,
  Upload,
  RefreshCw,
  AlertTriangle,
  Brain
} from "lucide-react";

// Import new admin components
import { AdminStatsCards } from '@/components/admin/AdminStatsCards';
import { AdminUserManagement } from '@/components/admin/AdminUserManagement';
import { AdminAppointments } from '@/components/admin/AdminAppointments';
import { AdminFinancialOverview } from '@/components/admin/AdminFinancialOverview';
import { AdminModals } from '@/components/admin/AdminModals';
import { AdminNotifications } from '@/components/admin/AdminNotifications';

// Import mock data
import { 
  adminUsers, 
  adminAppointments, 
  adminFinancialData, 
  adminSystemMetrics,
  departmentStats,
  recentActivities,
  adminNotifications
} from '@/lib/adminMockData';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isProcessing, setIsProcessing] = useState(false);

  // Modal states
  const [modals, setModals] = useState({
    showAddUserModal: false,
    showEditUserModal: false,
    showViewUserModal: false,
    showDeleteUserModal: false,
    showScheduleModal: false,
    showReportModal: false,
    showSettingsModal: false,
    showAIInsightsModal: false,
    showNotificationsModal: false,
  });

  // Selected user for edit/view/delete
  const [selectedUser, setSelectedUser] = useState<any>(null);

  // Data states for dynamic updates
  const [users, setUsers] = useState(adminUsers);
  const [appointments, setAppointments] = useState(adminAppointments);
  const [notifications, setNotifications] = useState(adminNotifications);

  // Admin Profile Data
  const [adminProfile] = useState({
    name: "Dr. Sarah Williams",
    role: "Hospital Administrator",
    department: "Administration",
    adminId: "ADMIN-2024-001",
    phone: "+1 (555) 123-4567",
    email: "sarah.williams@hospital.com",
    experience: "15 years",
    avatar: "/placeholder.svg"
  });

  // Modal handlers
  const openModal = (modalName: string) => {
    setModals(prev => ({ ...prev, [modalName]: true }));
  };

  const closeModal = (modalName: string) => {
    setModals(prev => ({ ...prev, [modalName]: false }));
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('demo.user');
    toast({
      title: "Logged out successfully",
      description: "You have been safely logged out of your admin account.",
    });
    navigate("/admin-login");
  };

  // Enhanced action handlers with real functionality
  const handleModalSubmit = (modalType: string, data: any) => {
    setIsProcessing(true);
    
    setTimeout(() => {
      switch (modalType) {
        case 'addUser':
          const newUser = {
            id: `user-${Date.now()}`,
            name: data.name,
            email: data.email,
            phone: data.phone,
            role: data.role,
            department: data.department,
            status: 'active' as const,
            joinDate: new Date().toISOString().split('T')[0],
            avatar: '/placeholder.svg',
            experience: data.experience,
            specialization: data.specialization
          };
          setUsers(prev => [newUser, ...prev]);
          toast({
            title: "User Added Successfully",
            description: `${data.name} has been added to the system.`,
          });
          break;

        case 'schedule':
          const newAppointment = {
            id: `apt-${Date.now()}`,
            patientName: data.patientName,
            doctorName: data.doctorName,
            date: data.date,
            time: data.time,
            type: data.type as 'consultation' | 'follow-up' | 'emergency' | 'surgery',
            status: 'scheduled' as const,
            department: data.department || 'General'
          };
          setAppointments(prev => [newAppointment, ...prev]);
          toast({
            title: "Appointment Scheduled",
            description: `Appointment for ${data.patientName} has been scheduled.`,
          });
          break;

        case 'report':
          toast({
            title: "Report Generated",
            description: `${data.reportType} report for ${data.dateRange} is being generated.`,
          });
          // Simulate report download
          setTimeout(() => {
            const link = document.createElement('a');
            link.href = 'data:text/plain;charset=utf-8,Sample Report Content';
            link.download = `${data.reportType}-${data.dateRange}.${data.format}`;
            link.click();
            toast({
              title: "Report Ready",
              description: "Your report has been downloaded successfully.",
            });
          }, 2000);
          break;

        case 'settings':
          toast({
            title: "Settings Updated",
            description: "System settings have been saved successfully.",
          });
          break;
      }
      setIsProcessing(false);
    }, 1500);
  };

  const handleAddUser = () => openModal('showAddUserModal');
  
  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    openModal('showEditUserModal');
  };

  const handleDeleteUser = (userId: string) => {
    const userToDelete = users.find(user => user.id === userId);
    setSelectedUser(userToDelete);
    openModal('showDeleteUserModal');
  };

  const handleViewUser = (user: any) => {
    setSelectedUser(user);
    openModal('showViewUserModal');
  };

  const confirmDeleteUser = () => {
    if (selectedUser) {
      setUsers(prev => prev.filter(user => user.id !== selectedUser.id));
      toast({
        title: "User Deleted",
        description: `${selectedUser.name} has been removed from the system.`,
        variant: "destructive"
      });
      closeModal('showDeleteUserModal');
      setSelectedUser(null);
    }
  };

  const handleSaveUser = (userData: any) => {
    if (selectedUser) {
      // Edit existing user
      setUsers(prev => prev.map(user => 
        user.id === selectedUser.id 
          ? { ...user, ...userData }
          : user
      ));
      toast({
        title: "User Updated",
        description: `${userData.name}'s information has been updated.`,
      });
      closeModal('showEditUserModal');
    } else {
      // Add new user
      const newUser = {
        ...userData,
        id: `user-${Date.now()}`,
        status: 'active'
      };
      setUsers(prev => [...prev, newUser]);
      toast({
        title: "User Added",
        description: `${userData.name} has been added to the system.`,
      });
      closeModal('showAddUserModal');
    }
    setSelectedUser(null);
  };

  const handleScheduleAppointment = () => openModal('showScheduleModal');

  const handleUpdateAppointment = (appointmentId: string, status: string) => {
    setAppointments(prev => 
      prev.map(apt => 
        apt.id === appointmentId 
          ? { ...apt, status: status as 'scheduled' | 'completed' | 'cancelled' | 'in-progress' }
          : apt
      )
    );
    toast({
      title: "Appointment Updated",
      description: `Appointment ${appointmentId} status changed to ${status}.`,
    });
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      default:
        toast({
          title: "Quick Action",
          description: `${action} executed successfully.`,
        });
    }
  };

  const handleNotificationAction = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, read: true }
          : notif
      )
    );
  };

  const handleDeleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
  };

  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50/30 to-green-100/20 flex">
      {/* Side Navigation - Fixed Height */}
      <div className="w-64 bg-white border-r border-green-200 shadow-lg flex flex-col fixed h-screen">
        {/* Logo/Brand */}
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800">MediVoice</h1>
              <p className="text-xs text-green-600">Admin Portal</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-3 overflow-y-auto">
          <div className="space-y-1">
            {[
              { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
              { id: "ai-chatbot", label: "AI Chatbot", icon: Brain },
              { id: "users", label: "User Management", icon: UserCheck },
              { id: "appointments", label: "Appointments", icon: Calendar },
              { id: "settings", label: "System Settings", icon: Settings },
              { id: "help", label: "Help & Support", icon: HelpCircle },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 text-sm ${
                  activeTab === item.id
                    ? "bg-green-100 text-green-700 border border-green-200 shadow-sm"
                    : "text-slate-600 hover:bg-green-50 hover:text-green-700"
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span className="font-medium text-sm">{item.label}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* User Profile in Sidebar */}
        <div className="p-3 border-t border-green-200">
          <button
            onClick={() => setActiveTab("profile")}
            className="w-full flex items-center gap-2 p-2 bg-green-50 rounded-lg hover:bg-green-100 transition-all duration-200 cursor-pointer"
          >
            <Avatar className="h-8 w-8 ring-2 ring-slate-400/40">
              <AvatarImage src="/placeholder.svg" alt="Admin" />
              <AvatarFallback className="bg-gradient-to-br from-green-500 to-green-600 text-white font-bold text-sm">
                SW
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-left">
              <p className="font-semibold text-slate-800 text-sm">{adminProfile.name}</p>
              <p className="text-xs text-slate-600">{adminProfile.role}</p>
            </div>
          </button>
        </div>
      </div>

      {/* Main Content Area - Adjusted for fixed sidebar */}
      <div className="flex-1 flex flex-col ml-64">
        {/* AI Chatbot Tab Content */}
        {activeTab === "ai-chatbot" && (
          <div className="p-6"></div>
        )}
        {/* Top Navigation Bar */}
        <header className="bg-white border-b border-green-200 shadow-sm">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  {activeTab === "dashboard" && "Admin Dashboard"}
                  {activeTab === "users" && "User Management"}
                  {activeTab === "appointments" && "Appointment Management"}
                  {activeTab === "settings" && "System Settings"}
                  {activeTab === "help" && "Help & Support"}
                </h2>
                <p className="text-green-700">Welcome back, {adminProfile.name} (ID: {adminProfile.adminId})</p>
              </div>

              {/* Top Right Actions */}
              <div className="flex items-center gap-3">
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setActiveTab("profile")}
                        className="hover:bg-green-100"
                      >
                        <User className="h-5 w-5 text-green-700" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Profile Settings</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openModal('showNotificationsModal')}
                        className="relative hover:bg-green-100"
                      >
                        <Bell className="h-5 w-5 text-green-700" />
                        {unreadNotifications > 0 && (
                          <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                            {unreadNotifications}
                          </span>
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Admin Notifications ({unreadNotifications} unread)</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleLogout}
                        className="hover:bg-red-100 hover:text-red-600"
                      >
                        <LogOut className="h-5 w-5 text-green-700" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Logout</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Dashboard Tab Content */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card className="border border-green-200/60 shadow-lg">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common administrative tasks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button
                      className="h-20 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                      onClick={handleAddUser}
                      disabled={isProcessing}
                    >
                      <UserPlus className="h-5 w-5 mr-2" />
                      Add User
                    </Button>
                    <Button
                      className="h-20 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                      onClick={handleScheduleAppointment}
                      disabled={isProcessing}
                    >
                      <Calendar className="h-5 w-5 mr-2" />
                      Schedule Appointment
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activities */}
              <Card className="border border-green-200/60 shadow-lg">
                <CardHeader>
                  <CardTitle>Recent Activities</CardTitle>
                  <CardDescription>Latest system activities and updates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.slice(0, 5).map((activity) => (
                      <div key={activity.id} className="flex items-center gap-4 p-3 bg-green-50 rounded-lg">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <div className="flex-1">
                          <p className="text-sm text-slate-800">
                            {activity.message}
                          </p>
                          <p className="text-xs text-slate-500">
                            {new Date(activity.timestamp).toLocaleString()} • {activity.user}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* User Management Tab */}
          {activeTab === "users" && (
            <AdminUserManagement
              users={users}
              onAddUser={handleAddUser}
              onEditUser={handleEditUser}
              onDeleteUser={handleDeleteUser}
              onViewUser={handleViewUser}
            />
          )}

          {/* Appointments Tab */}
          {activeTab === "appointments" && (
            <AdminAppointments
              appointments={appointments}
              onScheduleAppointment={handleScheduleAppointment}
              onUpdateAppointment={handleUpdateAppointment}
            />
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <Card className="border border-slate-200/60 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-slate-600" />
                  System Settings
                </CardTitle>
                <CardDescription>Configure system preferences and security</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => openModal('showSettingsModal')}
                  className="bg-gradient-to-r from-slate-600 to-slate-700"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Open Settings Panel
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Other tabs placeholder */}
          {!["dashboard", "users", "appointments", "financial", "reports", "settings"].includes(activeTab) && (
            <div className="text-center py-20">
              <h3 className="text-2xl font-bold text-slate-800 mb-4">
                {activeTab === "help" && "Help & Support"}
                {activeTab === "profile" && "Profile Settings"}
              </h3>
              <p className="text-slate-600">
                This section is under development with sample data integration.
              </p>
            </div>
          )}
        </main>
      </div>

      {/* All Modals */}
      <AdminModals
        modals={modals}
        onCloseModal={closeModal}
        onSubmit={handleModalSubmit}
      />

      {/* Notifications Modal */}
      <AdminNotifications
        isOpen={modals.showNotificationsModal}
        onClose={() => closeModal('showNotificationsModal')}
        onMarkAsRead={handleNotificationAction}
        onDeleteNotification={handleDeleteNotification}
      />
    </div>
  );
};

export default AdminDashboard;