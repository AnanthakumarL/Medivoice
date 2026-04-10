import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserPlus, Calendar, FileText, Settings, Brain, Download, Upload, Shield, Zap, AlertTriangle, CheckCircle, Clock, TrendingUp, Eye, Edit, Trash2, Star, Mail, Phone, MapPin, User } from 'lucide-react';

interface AdminModalsProps {
  modals: {
    showAddUserModal: boolean;
    showEditUserModal: boolean;
    showViewUserModal: boolean;
    showDeleteUserModal: boolean;
    showScheduleModal: boolean;
    showReportModal: boolean;
    showSettingsModal: boolean;
    showAIInsightsModal: boolean;
    showNotificationsModal: boolean;
  };
  selectedUser?: any;
  onCloseModal: (modalName: string) => void;
  onSubmit: (modalName: string, data: any) => void;
  onConfirmDelete?: () => void;
  onSaveUser?: (userData: any) => void;
}

export const AdminModals: React.FC<AdminModalsProps> = ({ 
  modals, 
  selectedUser, 
  onCloseModal, 
  onSubmit, 
  onConfirmDelete, 
  onSaveUser 
}) => {
  const [addUserForm, setAddUserForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    department: '',
    experience: '',
    specialization: ''
  });

  const [editUserForm, setEditUserForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    department: '',
    experience: '',
    specialization: ''
  });

  // Initialize edit form when selectedUser changes
  useEffect(() => {
    if (selectedUser) {
      setEditUserForm({
        name: selectedUser.name || '',
        email: selectedUser.email || '',
        phone: selectedUser.phone || '',
        role: selectedUser.role || '',
        department: selectedUser.department || '',
        experience: selectedUser.experience || '',
        specialization: selectedUser.specialization || ''
      });
    }
  }, [selectedUser]);

  const [scheduleForm, setScheduleForm] = useState({
    patientName: '',
    doctorName: '',
    date: '',
    time: '',
    type: '',
    department: '',
    notes: ''
  });

  const [reportForm, setReportForm] = useState({
    reportType: '',
    dateRange: '',
    department: '',
    includeCharts: true,
    includeDetails: true,
    format: 'pdf'
  });

  const [systemSettings, setSystemSettings] = useState({
    autoBackup: true,
    emailNotifications: true,
    smsAlerts: false,
    maintenanceMode: false,
    dataRetention: '12',
    maxUsers: '1000',
    sessionTimeout: '30'
  });

  const handleScheduleSubmit = () => {
    onSubmit('schedule', scheduleForm);
    setScheduleForm({
      patientName: '',
      doctorName: '',
      date: '',
      time: '',
      type: '',
      department: '',
      notes: ''
    });
    onCloseModal('showScheduleModal');
  };

  const handleReportSubmit = () => {
    onSubmit('report', reportForm);
    onCloseModal('showReportModal');
  };

  const handleSettingsSubmit = () => {
    onSubmit('settings', systemSettings);
    onCloseModal('showSettingsModal');
  };

  const handleEditUserSubmit = () => {
    if (onSaveUser) {
      onSaveUser(editUserForm);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'doctor': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'head nurse': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'pharmacist': return 'bg-green-100 text-green-700 border-green-200';
      case 'lab technician': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 border-green-200';
      case 'inactive': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <>
      {/* View User Details Modal */}
      <Dialog open={modals.showViewUserModal} onOpenChange={() => onCloseModal('showViewUserModal')}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-blue-600" />
              User Details
            </DialogTitle>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-6">
              {/* User Header */}
              <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
                  <AvatarFallback className="bg-gradient-to-br from-slate-600 to-slate-700 text-white text-lg">
                    {selectedUser.name?.split(' ').map((n: string) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-slate-800">{selectedUser.name}</h3>
                  <p className="text-sm text-slate-600 mb-2">ID: {selectedUser.id}</p>
                  <div className="flex items-center gap-2">
                    <Badge className={getRoleColor(selectedUser.role)}>
                      {selectedUser.role}
                    </Badge>
                    <Badge className={getStatusColor(selectedUser.status)}>
                      {selectedUser.status}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* User Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-slate-500" />
                      <span className="text-sm">{selectedUser.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-slate-500" />
                      <span className="text-sm">{selectedUser.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-slate-500" />
                      <span className="text-sm">{selectedUser.department}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Professional Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-xs text-slate-500">Experience</Label>
                      <p className="text-sm font-medium">{selectedUser.experience || 'N/A'}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-slate-500">Specialization</Label>
                      <p className="text-sm font-medium">{selectedUser.specialization || 'N/A'}</p>
                    </div>
                    {selectedUser.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{selectedUser.rating}</span>
                        <span className="text-xs text-slate-500">rating</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => onCloseModal('showViewUserModal')}>
              Close
            </Button>
            <Button onClick={() => {
              onCloseModal('showViewUserModal');
              if (selectedUser) {
                setEditUserForm({
                  name: selectedUser.name || '',
                  email: selectedUser.email || '',
                  phone: selectedUser.phone || '',
                  role: selectedUser.role || '',
                  department: selectedUser.department || '',
                  experience: selectedUser.experience || '',
                  specialization: selectedUser.specialization || ''
                });
                onCloseModal('showViewUserModal');
                setTimeout(() => onCloseModal('showEditUserModal'), 100);
              }
            }}>
              <Edit className="h-4 w-4 mr-2" />
              Edit User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Modal */}
      <Dialog open={modals.showEditUserModal} onOpenChange={() => onCloseModal('showEditUserModal')}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5 text-blue-600" />
              Edit User
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic">Basic Information</TabsTrigger>
                <TabsTrigger value="professional">Professional Details</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="editName">Full Name *</Label>
                    <Input
                      id="editName"
                      placeholder="Enter full name"
                      value={editUserForm.name}
                      onChange={(e) => setEditUserForm({...editUserForm, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editEmail">Email Address *</Label>
                    <Input
                      id="editEmail"
                      type="email"
                      placeholder="Enter email address"
                      value={editUserForm.email}
                      onChange={(e) => setEditUserForm({...editUserForm, email: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="editPhone">Phone Number *</Label>
                    <Input
                      id="editPhone"
                      placeholder="Enter phone number"
                      value={editUserForm.phone}
                      onChange={(e) => setEditUserForm({...editUserForm, phone: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editRole">Role *</Label>
                    <Select value={editUserForm.role} onValueChange={(value) => setEditUserForm({...editUserForm, role: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Doctor">Doctor</SelectItem>
                        <SelectItem value="Head Nurse">Head Nurse</SelectItem>
                        <SelectItem value="Pharmacist">Pharmacist</SelectItem>
                        <SelectItem value="Lab Technician">Lab Technician</SelectItem>
                        <SelectItem value="Receptionist">Receptionist</SelectItem>
                        <SelectItem value="IT Support">IT Support</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="professional" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="editDepartment">Department *</Label>
                    <Select value={editUserForm.department} onValueChange={(value) => setEditUserForm({...editUserForm, department: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cardiology">Cardiology</SelectItem>
                        <SelectItem value="Emergency">Emergency</SelectItem>
                        <SelectItem value="General Medicine">General Medicine</SelectItem>
                        <SelectItem value="Dermatology">Dermatology</SelectItem>
                        <SelectItem value="Laboratory">Laboratory</SelectItem>
                        <SelectItem value="Pharmacy">Pharmacy</SelectItem>
                        <SelectItem value="Administration">Administration</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editExperience">Experience (Years)</Label>
                    <Input
                      id="editExperience"
                      placeholder="Enter years of experience"
                      value={editUserForm.experience}
                      onChange={(e) => setEditUserForm({...editUserForm, experience: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="editSpecialization">Specialization</Label>
                  <Input
                    id="editSpecialization"
                    placeholder="Enter specialization (for doctors)"
                    value={editUserForm.specialization}
                    onChange={(e) => setEditUserForm({...editUserForm, specialization: e.target.value})}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => onCloseModal('showEditUserModal')}>
              Cancel
            </Button>
            <Button onClick={handleEditUserSubmit} disabled={!editUserForm.name || !editUserForm.email || !editUserForm.role}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Confirmation Modal */}
      <Dialog open={modals.showDeleteUserModal} onOpenChange={() => onCloseModal('showDeleteUserModal')}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="h-5 w-5" />
              Delete User
            </DialogTitle>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-4">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
                    <AvatarFallback className="bg-red-600 text-white">
                      {selectedUser.name?.split(' ').map((n: string) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-red-800">{selectedUser.name}</p>
                    <p className="text-sm text-red-600">{selectedUser.role} - {selectedUser.department}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-800">Warning</p>
                    <p className="text-sm text-yellow-700">
                      This action cannot be undone. All user data, access permissions, and associated records will be permanently removed.
                    </p>
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-slate-600">
                Are you sure you want to delete this user? Type the user's name to confirm:
              </p>
              
              <Input
                placeholder={`Type "${selectedUser.name}" to confirm`}
                className="border-red-200 focus:border-red-400"
              />
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => onCloseModal('showDeleteUserModal')}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                if (onConfirmDelete) {
                  onConfirmDelete();
                }
              }}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add User Modal */}
      <Dialog open={modals.showAddUserModal} onOpenChange={() => onCloseModal('showAddUserModal')}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-blue-600" />
              Add New User
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic">Basic Information</TabsTrigger>
                <TabsTrigger value="professional">Professional Details</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      placeholder="Enter full name"
                      value={addUserForm.name}
                      onChange={(e) => setAddUserForm({...addUserForm, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter email address"
                      value={addUserForm.email}
                      onChange={(e) => setAddUserForm({...addUserForm, email: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      placeholder="Enter phone number"
                      value={addUserForm.phone}
                      onChange={(e) => setAddUserForm({...addUserForm, phone: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role *</Label>
                    <Select value={addUserForm.role} onValueChange={(value) => setAddUserForm({...addUserForm, role: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Doctor">Doctor</SelectItem>
                        <SelectItem value="Head Nurse">Head Nurse</SelectItem>
                        <SelectItem value="Pharmacist">Pharmacist</SelectItem>
                        <SelectItem value="Lab Technician">Lab Technician</SelectItem>
                        <SelectItem value="Receptionist">Receptionist</SelectItem>
                        <SelectItem value="IT Support">IT Support</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="professional" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="department">Department *</Label>
                    <Select value={addUserForm.department} onValueChange={(value) => setAddUserForm({...addUserForm, department: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cardiology">Cardiology</SelectItem>
                        <SelectItem value="Emergency">Emergency</SelectItem>
                        <SelectItem value="General Medicine">General Medicine</SelectItem>
                        <SelectItem value="Dermatology">Dermatology</SelectItem>
                        <SelectItem value="Laboratory">Laboratory</SelectItem>
                        <SelectItem value="Pharmacy">Pharmacy</SelectItem>
                        <SelectItem value="Administration">Administration</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experience">Experience (Years)</Label>
                    <Input
                      id="experience"
                      placeholder="Enter years of experience"
                      value={addUserForm.experience}
                      onChange={(e) => setAddUserForm({...addUserForm, experience: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="specialization">Specialization</Label>
                  <Input
                    id="specialization"
                    placeholder="Enter specialization (for doctors)"
                    value={addUserForm.specialization}
                    onChange={(e) => setAddUserForm({...addUserForm, specialization: e.target.value})}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => onCloseModal('showAddUserModal')}>
              Cancel
            </Button>
            <Button onClick={() => {
              if (onSaveUser) {
                onSaveUser(addUserForm);
                setAddUserForm({
                  name: '',
                  email: '',
                  phone: '',
                  role: '',
                  department: '',
                  experience: '',
                  specialization: ''
                });
              }
            }} disabled={!addUserForm.name || !addUserForm.email || !addUserForm.role}>
              Add User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};