import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Stack, LinearProgress } from '@mui/material';

// Material-UI Icons
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined';
import BugReportOutlinedIcon from '@mui/icons-material/BugReportOutlined';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';

interface Feature {
  id: string;
  name: string;
  status: string;
  description: string;
}

interface FeatureVerificationPanelProps {
  role: string;
  features: Feature[];
  onTestFeature: (featureId: string, role: string) => Promise<boolean>;
  onVerifyAllFeatures: (role: string) => Promise<boolean>;
}

export const FeatureVerificationPanel: React.FC<FeatureVerificationPanelProps> = ({
  role,
  features,
  onTestFeature,
  onVerifyAllFeatures,
}) => {
  const [testingFeatures, setTestingFeatures] = useState<Set<string>>(new Set());
  const [testResults, setTestResults] = useState<Record<string, boolean>>({});
  const [verifyingAll, setVerifyingAll] = useState(false);

  const handleTestFeature = async (featureId: string) => {
    setTestingFeatures(prev => new Set(prev).add(featureId));
    
    try {
      const result = await onTestFeature(featureId, role);
      setTestResults(prev => ({ ...prev, [featureId]: result }));
    } catch (error) {
      setTestResults(prev => ({ ...prev, [featureId]: false }));
    } finally {
      setTestingFeatures(prev => {
        const newSet = new Set(prev);
        newSet.delete(featureId);
        return newSet;
      });
    }
  };

  const handleVerifyAll = async () => {
    setVerifyingAll(true);
    
    try {
      const result = await onVerifyAllFeatures(role);
      // Set all features as tested with the overall result
      const allResults = features.reduce((acc, feature) => {
        acc[feature.id] = result;
        return acc;
      }, {} as Record<string, boolean>);
      setTestResults(allResults);
    } catch (error) {
      console.error('Failed to verify all features:', error);
    } finally {
      setVerifyingAll(false);
    }
  };

  const getFeatureStatusColor = (featureId: string) => {
    if (testingFeatures.has(featureId)) return 'text-yellow-600';
    if (testResults[featureId] === true) return 'text-green-600';
    if (testResults[featureId] === false) return 'text-red-600';
    return 'text-gray-400';
  };

  const getFeatureStatusIcon = (featureId: string) => {
    if (testingFeatures.has(featureId)) return RefreshOutlinedIcon;
    if (testResults[featureId] === true) return CheckCircleOutlinedIcon;
    if (testResults[featureId] === false) return BugReportOutlinedIcon;
    return PlayArrowOutlinedIcon;
  };

  const testedFeatures = Object.keys(testResults).length;
  const passedFeatures = Object.values(testResults).filter(Boolean).length;
  const progressPercentage = features.length > 0 ? (testedFeatures / features.length) * 100 : 0;

  return (
    <Card className="border-2 border-blue-200 bg-blue-50/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BugReportOutlinedIcon className="text-blue-600" />
          Feature Verification - {role.charAt(0).toUpperCase() + role.slice(1)}
        </CardTitle>
        <CardDescription>
          Test and verify all features are working correctly for this role
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress Overview */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Testing Progress</span>
            <span>{testedFeatures}/{features.length} tested</span>
          </div>
          <LinearProgress 
            variant="determinate" 
            value={progressPercentage}
            sx={{ height: 8, borderRadius: 4 }}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{passedFeatures} passed</span>
            <span>{testedFeatures - passedFeatures} failed</span>
          </div>
        </div>

        {/* Verify All Button */}
        <Button
          onClick={handleVerifyAll}
          disabled={verifyingAll}
          variant="default"
          className="w-full"
        >
          {verifyingAll ? (
            <>
              <RefreshOutlinedIcon sx={{ fontSize: 16, marginRight: 1 }} className="animate-spin" />
              Verifying All Features...
            </>
          ) : (
            <>
              <CheckCircleOutlinedIcon sx={{ fontSize: 16, marginRight: 1 }} />
              Verify All Features
            </>
          )}
        </Button>

        {/* Individual Feature Tests */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Individual Feature Tests:</h4>
          {features.map((feature) => {
            const StatusIcon = getFeatureStatusIcon(feature.id);
            const isTesting = testingFeatures.has(feature.id);
            
            return (
              <div key={feature.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                <div className="flex items-center gap-3">
                  <StatusIcon 
                    sx={{ fontSize: 20 }} 
                    className={`${getFeatureStatusColor(feature.id)} ${isTesting ? 'animate-spin' : ''}`}
                  />
                  <div>
                    <div className="font-medium text-sm">{feature.name}</div>
                    <div className="text-xs text-muted-foreground">{feature.description}</div>
                  </div>
                </div>
                
                <Stack direction="row" spacing={1} alignItems="center">
                  {testResults[feature.id] !== undefined && (
                    <Badge variant={testResults[feature.id] ? "default" : "destructive"}>
                      {testResults[feature.id] ? "Pass" : "Fail"}
                    </Badge>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleTestFeature(feature.id)}
                    disabled={isTesting}
                  >
                    {isTesting ? "Testing..." : "Test"}
                  </Button>
                </Stack>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};