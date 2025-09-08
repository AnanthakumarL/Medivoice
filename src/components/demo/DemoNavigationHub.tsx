import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Stack, Typography, Divider } from '@mui/material';
import { DemoRoleCard } from './DemoRoleCard';
import { FeatureVerificationPanel } from './FeatureVerificationPanel';
import { mockQuery, mockRootProps } from '@/lib/demoVerificationMockData';

// Material-UI Icons
import BentoOutlinedIcon from '@mui/icons-material/BentoOutlined';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import RocketLaunchOutlinedIcon from '@mui/icons-material/RocketLaunchOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';

export const DemoNavigationHub: React.FC = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [verificationResults, setVerificationResults] = useState<Record<string, boolean>>({});

  // Mock feature testing functions
  const handleTestFeature = async (featureId: string, role: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    // Simulate 90% success rate for demo purposes
    const success = Math.random() > 0.1;
    console.log(`Testing feature ${featureId} for role ${role}: ${success ? 'PASS' : 'FAIL'}`);
    return success;
  };

  const handleVerifyAllFeatures = async (role: string): Promise<boolean> => {
    // Simulate comprehensive testing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Simulate high success rate for all features
    const success = Math.random() > 0.2;
    setVerificationResults(prev => ({ ...prev, [role]: success }));
    console.log(`Verifying all features for role ${role}: ${success ? 'PASS' : 'FAIL'}`);
    return success;
  };

  const handleTestFeatures = (role: string) => {
    setSelectedRole(selectedRole === role ? null : role);
  };

  const getTotalFeatures = () => {
    return Object.values(mockQuery.demoFeatures).reduce((total, features) => total + features.length, 0);
  };

  const getVerifiedRoles = () => {
    return Object.keys(verificationResults).filter(role => verificationResults[role]).length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/30 to-green-100/20 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-gradient-primary rounded-full text-white">
              <BentoOutlinedIcon sx={{ fontSize: 32 }} />
            </div>
            <div>
              <Typography variant="h3" component="h1" className="font-bold text-slate-800">
                MediHub Demo Center
              </Typography>
              <Typography variant="h6" className="text-slate-600">
                Verify All Routes & Features
              </Typography>
            </div>
          </div>
          
          {/* Overview Stats */}
          <Stack direction="row" spacing={4} justifyContent="center" className="mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{mockRootProps.demoRoles.length}</div>
              <div className="text-sm text-slate-600">User Roles</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{getTotalFeatures()}</div>
              <div className="text-sm text-slate-600">Total Features</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{getVerifiedRoles()}</div>
              <div className="text-sm text-slate-600">Verified Roles</div>
            </div>
          </Stack>
        </div>

        {/* Quick Actions */}
        <Card className="border-2 border-green-200 bg-gradient-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RocketLaunchOutlinedIcon className="text-green-600" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Jump directly to different parts of the system for testing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Stack direction="row" spacing={2} flexWrap="wrap">
              <Button 
                onClick={() => navigate('/demo')}
                variant="outline"
                size="sm"
              >
                Original Demo Page
              </Button>
              <Button 
                onClick={() => navigate('/dashboard')}
                variant="outline"
                size="sm"
              >
                Patient Dashboard
              </Button>
              <Button 
                onClick={() => navigate('/doctor-dashboard')}
                variant="outline"
                size="sm"
              >
                Doctor Dashboard
              </Button>
              <Button 
                onClick={() => navigate('/admin-dashboard')}
                variant="outline"
                size="sm"
              >
                Admin Dashboard
              </Button>
              <Button 
                onClick={() => navigate('/staff-dashboard')}
                variant="outline"
                size="sm"
              >
                Staff Dashboard
              </Button>
              <Button 
                onClick={() => navigate('/laboratory-dashboard')}
                variant="outline"
                size="sm"
              >
                Laboratory Dashboard
              </Button>
            </Stack>
          </CardContent>
        </Card>

        {/* Role Cards Grid */}
        <div>
          <Typography variant="h4" component="h2" className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <VerifiedOutlinedIcon className="text-green-600" />
            User Role Verification
          </Typography>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockRootProps.demoRoles.map((role) => (
              <DemoRoleCard
                key={role.role}
                role={role.role}
                displayName={role.displayName}
                description={role.description}
                dashboardPath={role.dashboardPath}
                loginPath={role.loginPath}
                color={role.color}
                features={mockQuery.demoFeatures[role.role as keyof typeof mockQuery.demoFeatures] || []}
                onTestFeatures={handleTestFeatures}
              />
            ))}
          </div>
        </div>

        {/* Feature Verification Panel */}
        {selectedRole && (
          <div>
            <Divider sx={{ my: 4 }} />
            <FeatureVerificationPanel
              role={selectedRole}
              features={mockQuery.demoFeatures[selectedRole as keyof typeof mockQuery.demoFeatures] || []}
              onTestFeature={handleTestFeature}
              onVerifyAllFeatures={handleVerifyAllFeatures}
            />
          </div>
        )}

        {/* System Status */}
        <Card className="border-2 border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AssessmentOutlinedIcon className="text-slate-600" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-lg font-bold text-green-600">✓ Routes</div>
                <div className="text-sm text-slate-600">All Configured</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-lg font-bold text-blue-600">✓ Auth</div>
                <div className="text-sm text-slate-600">Demo Mode Active</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-lg font-bold text-purple-600">✓ Data</div>
                <div className="text-sm text-slate-600">Mock Data Loaded</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-lg font-bold text-orange-600">✓ UI</div>
                <div className="text-sm text-slate-600">Components Ready</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};