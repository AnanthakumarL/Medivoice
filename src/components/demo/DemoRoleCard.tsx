import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Stack } from '@mui/material';
import { demoStore } from '@/lib/demo-store';

// Material-UI Icons
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined';
import LocalHospitalOutlinedIcon from '@mui/icons-material/LocalHospitalOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import Groups2OutlinedIcon from '@mui/icons-material/Groups2Outlined';
import ScienceOutlinedIcon from '@mui/icons-material/ScienceOutlined';
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';

interface DemoRoleCardProps {
  role: string;
  displayName: string;
  description: string;
  dashboardPath: string;
  loginPath: string;
  color: string;
  features: Array<{
    id: string;
    name: string;
    status: string;
    description: string;
  }>;
  onTestFeatures: (role: string) => void;
}

const roleIcons = {
  patient: PeopleOutlineOutlinedIcon,
  doctor: LocalHospitalOutlinedIcon,
  admin: SettingsOutlinedIcon,
  staff: Groups2OutlinedIcon,
  laboratory: ScienceOutlinedIcon,
};

const roleColors = {
  blue: 'text-blue-600 bg-blue-50 border-blue-200',
  green: 'text-green-600 bg-green-50 border-green-200',
  purple: 'text-purple-600 bg-purple-50 border-purple-200',
  orange: 'text-orange-600 bg-orange-50 border-orange-200',
  teal: 'text-teal-600 bg-teal-50 border-teal-200',
};

export const DemoRoleCard: React.FC<DemoRoleCardProps> = ({
  role,
  displayName,
  description,
  dashboardPath,
  loginPath,
  color,
  features,
  onTestFeatures,
}) => {
  const navigate = useNavigate();
  const IconComponent = roleIcons[role as keyof typeof roleIcons] || PeopleOutlineOutlinedIcon;
  const colorClass = roleColors[color as keyof typeof roleColors] || roleColors.blue;

  const handleLoginAsRole = () => {
    // Set demo user for the role
    const userData = {
      role: role,
      name: `Demo ${displayName.split(' ')[0]}`,
      email: `demo.${role}@medihub.com`
    };
    demoStore.setCurrentUser(userData);
    navigate(dashboardPath);
  };

  const handleGoToLogin = () => {
    navigate(loginPath);
  };

  const activeFeatures = features.filter(f => f.status === 'active').length;
  const totalFeatures = features.length;

  return (
    <Card className={`transition-all duration-300 hover:shadow-lg hover:scale-105 border-2 ${colorClass}`}>
      <CardHeader>
        <Stack direction="row" spacing={2} alignItems="center">
          <div className={`p-3 rounded-full ${colorClass}`}>
            <IconComponent sx={{ fontSize: 32 }} />
          </div>
          <div>
            <CardTitle className="text-xl">{displayName}</CardTitle>
            <CardDescription className="text-sm">{description}</CardDescription>
          </div>
        </Stack>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Feature Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Features Ready:</span>
          <Badge variant="secondary" className={colorClass}>
            {activeFeatures}/{totalFeatures}
          </Badge>
        </div>

        {/* Feature List Preview */}
        <div className="space-y-2">
          {features.slice(0, 3).map((feature) => (
            <div key={feature.id} className="flex items-center gap-2 text-sm">
              <CheckCircleOutlinedIcon sx={{ fontSize: 16 }} className="text-green-500" />
              <span>{feature.name}</span>
            </div>
          ))}
          {features.length > 3 && (
            <div className="text-xs text-muted-foreground">
              +{features.length - 3} more features
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <Stack spacing={2}>
          <Button 
            onClick={handleLoginAsRole}
            className="w-full"
            variant="default"
          >
            <PlayArrowOutlinedIcon sx={{ fontSize: 16, marginRight: 1 }} />
            Login as {displayName.split(' ')[0]}
          </Button>
          
          <Stack direction="row" spacing={2}>
            <Button 
              onClick={handleGoToLogin}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              Go to Login
            </Button>
            <Button 
              onClick={() => onTestFeatures(role)}
              variant="secondary"
              size="sm"
              className="flex-1"
            >
              Test Features
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};