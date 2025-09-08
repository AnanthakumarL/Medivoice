import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  LayoutDashboard,
  TestTube,
  FileText,
  Settings,
  HelpCircle,
  Bell,
  LogOut,
  Activity,
  Clock,
  AlertCircle,
  CheckCircle,
  User,
  Search,
  Filter,
  Download,
  Upload,
  Calendar,
  BarChart3,
  Microscope,
  FlaskConical,
  Beaker,
  Clipboard,
  TrendingUp,
  Users,
  DollarSign,
  Timer,
  AlertTriangle,
  CheckCircle2,
  Eye,
  Bot,
  Edit,
  Plus,
  RefreshCw,
  Brain,
  Mic,
  Phone,
  Mail,
  Building2,
  Shield,
  CreditCard,
  Receipt,
  FileCheck,
  Zap,
  ArrowRight,
  MapPin,
  Stethoscope,
  Home,
  UserCheck,
  ClipboardList,
  XCircle,
  Loader2,
  Save,
  Send,
  X,
  ChevronRight
} from "lucide-react";

const LaboratoryDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [voiceRecording, setVoiceRecording] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Enhanced lab state management
  const [labState, setLabState] = useState({
    // Modal states
    showTestRequestModal: false,
    showSampleCollectionModal: false,
    showResultsModal: false,
    showPatientModal: false,
    showEquipmentModal: false,
    showSettingsModal: false,
    showVoiceRecordingModal: false,
    showFileUploadModal: false,
    showReportModal: false,
    showIssueModal: false,
    showNotificationsModal: false,
    
    // Selected items
    selectedTestRequest: null,
    selectedSample: null,
    selectedReport: null,
    
    // Form states
    recordingText: "",
    isUploading: false,
    
    // Filter states
    urgencyFilter: "all",
    statusFilter: "all",
    dateFilter: "all",
    
    // Processing states
    processingTest: false,
    collectingSample: false,
    processingSample: false,
    generatingReport: false,
    performingEquipmentCheck: false,
    checkingEquipment: false,
    updatingStatus: false,
    batchProcessing: false,
    savingSettings: false,
    
    // Notifications
    notifications: [
      {
        id: 1,
        type: "urgent",
        title: "Critical Test Results",
        message: "Patient ID: P-2024-156 - Blood glucose levels critically high (450 mg/dL)",
        time: "2 minutes ago",
        priority: "high",
        read: false,
        patient: "Sarah Johnson",
        testType: "Blood Glucose"
      },
      {
        id: 2,
        type: "reminder",
        title: "Equipment Calibration Due",
        message: "Hematology Analyzer requires daily calibration in 30 minutes",
        time: "15 minutes ago",
        priority: "medium",
        read: false,
        equipment: "Hematology Analyzer HM-3000"
      },
      {
        id: 3,
        type: "result",
        title: "Batch Processing Complete",
        message: "Successfully processed 45 samples from morning collection batch",
        time: "1 hour ago",
        priority: "low",
        read: true,
        batchId: "BATCH-2024-0901"
      },
      {
        id: 4,
        type: "alert",
        title: "Quality Control Failed",
        message: "Chemistry panel QC sample failed. Investigation required.",
        time: "2 hours ago",
        priority: "high",
        read: false,
        testType: "Chemistry Panel"
      },
      {
        id: 5,
        type: "info",
        title: "New Sample Received",
        message: "Stat order received for emergency department patient",
        time: "3 hours ago",
        priority: "medium",
        read: true,
        department: "Emergency"
      }
    ]
  });

  // Laboratory Profile Data (hydrate from demo user if present)
  const [labProfile] = useState(() => {
    const u = localStorage.getItem('demo.user');
    const user = u ? JSON.parse(u) : null;
    return {
      name: user?.role === 'lab' && user?.name ? user.name : "Dr. Michael Chen",
      role: "Chief Laboratory Technician",
      department: "Clinical Laboratory",
      labId: "LAB-2024-001",
      shift: "Day Shift (8 AM - 6 PM)",
      phone: "+1 (555) 123-4567",
      email: user?.role === 'lab' && user?.email ? user.email : "michael.chen@hospital.com",
      experience: "12 years",
      avatar: "/placeholder.svg"
    };
  });

  // Patient Records Data for Search
  const [patientRecords] = useState([
    {
      id: "P-2024-156",
      name: "Sarah Johnson",
      age: 34,
      gender: "Female",
      phone: "+1 (555) 123-4567",
      email: "sarah.johnson@email.com",
      address: "123 Main St, City, State 12345",
      bloodType: "O+",
      allergies: ["Penicillin", "Shellfish"],
      emergencyContact: "John Johnson - +1 (555) 987-6543",
      recentTests: [
        { test: "Complete Blood Count", date: "2024-01-22", status: "Completed", results: "Normal" },
        { test: "Glucose Test", date: "2024-01-15", status: "Completed", results: "95 mg/dL - Normal" },
        { test: "Cholesterol Panel", date: "2024-01-08", status: "Completed", results: "Total: 180 mg/dL - Normal" }
      ],
      lastVisit: "2024-01-22",
      doctor: "Dr. Emily Carter"
    },
    {
      id: "P-2024-142",
      name: "Robert Wilson",
      age: 45,
      gender: "Male",
      phone: "+1 (555) 234-5678",
      email: "robert.wilson@email.com",
      address: "456 Oak Ave, City, State 12345",
      bloodType: "A+",
      allergies: ["None known"],
      emergencyContact: "Mary Wilson - +1 (555) 876-5432",
      recentTests: [
        { test: "Lipid Panel", date: "2024-01-21", status: "Processing", results: "Pending" },
        { test: "Liver Function", date: "2024-01-14", status: "Completed", results: "Normal" },
        { test: "Kidney Function", date: "2024-01-07", status: "Completed", results: "Normal" }
      ],
      lastVisit: "2024-01-21",
      doctor: "Dr. James Rodriguez"
    },
    {
      id: "P-2024-134",
      name: "Emma Rodriguez",
      age: 28,
      gender: "Female",
      phone: "+1 (555) 345-6789",
      email: "emma.rodriguez@email.com",
      address: "789 Pine St, City, State 12345",
      bloodType: "B+",
      allergies: ["Latex"],
      emergencyContact: "Carlos Rodriguez - +1 (555) 765-4321",
      recentTests: [
        { test: "Thyroid Function", date: "2024-01-20", status: "Completed", results: "TSH: 2.1 mIU/L - Normal" },
        { test: "Vitamin D", date: "2024-01-13", status: "Completed", results: "32 ng/mL - Sufficient" },
        { test: "Iron Studies", date: "2024-01-06", status: "Completed", results: "Normal" }
      ],
      lastVisit: "2024-01-20",
      doctor: "Dr. Lisa Thompson"
    },
    {
      id: "P-2024-128",
      name: "Michael Chen",
      age: 52,
      gender: "Male",
      phone: "+1 (555) 456-7890",
      email: "michael.chen@email.com",
      address: "321 Elm St, City, State 12345",
      bloodType: "AB+",
      allergies: ["Aspirin"],
      emergencyContact: "Linda Chen - +1 (555) 654-3210",
      recentTests: [
        { test: "Cardiac Enzymes", date: "2024-01-19", status: "Completed", results: "Normal" },
        { test: "HbA1c", date: "2024-01-12", status: "Completed", results: "6.2% - Good control" },
        { test: "PSA", date: "2024-01-05", status: "Completed", results: "1.8 ng/mL - Normal" }
      ],
      lastVisit: "2024-01-19",
      doctor: "Dr. David Kim"
    },
    {
      id: "P-2024-119",
      name: "Jennifer Davis",
      age: 39,
      gender: "Female",
      phone: "+1 (555) 567-8901",
      email: "jennifer.davis@email.com",
      address: "654 Maple Dr, City, State 12345",
      bloodType: "O-",
      allergies: ["Iodine", "Sulfa drugs"],
      emergencyContact: "Mark Davis - +1 (555) 543-2109",
      recentTests: [
        { test: "Pregnancy Test", date: "2024-01-18", status: "Completed", results: "Positive" },
        { test: "Complete Metabolic Panel", date: "2024-01-11", status: "Completed", results: "Normal" },
        { test: "Urinalysis", date: "2024-01-04", status: "Completed", results: "Normal" }
      ],
      lastVisit: "2024-01-18",
      doctor: "Dr. Amanda Foster"
    }
  ]);

  // Search functionality
  const handlePatientSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }

    const filtered = patientRecords.filter(patient =>
      patient.name.toLowerCase().includes(query.toLowerCase()) ||
      patient.id.toLowerCase().includes(query.toLowerCase()) ||
      patient.phone.includes(query) ||
      patient.email.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(filtered);
  };

  // Working demo functionality
  const simulateUpload = async () => {
    setIsProcessing(true);
    setUploadProgress(0);
    toast({
      title: "Uploading Lab Results",
      description: "Processing file upload...",
    });

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      setUploadProgress(i);
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    setIsProcessing(false);
    setUploadProgress(0);
    toast({
      title: "Upload Complete!",
      description: "Lab results uploaded and processed successfully.",
    });
  };

  const simulateVoiceEntry = async () => {
    setVoiceRecording(true);
    setIsProcessing(true);
    toast({
      title: "Voice Recording Started",
      description: "Listening for dictation...",
    });

    await new Promise(resolve => setTimeout(resolve, 3000));

    setVoiceRecording(false);
    toast({
      title: "Processing Voice Data",
      description: "MediVo AI is transcribing your dictation...",
    });

    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsProcessing(false);
    toast({
      title: "Voice Entry Complete!",
      description: "Test results have been transcribed and saved.",
    });
  };

  const simulateProcessing = async (action, duration = 2000) => {
    setIsProcessing(true);
    toast({
      title: "Processing...",
      description: `${action} in progress...`,
    });

    await new Promise(resolve => setTimeout(resolve, duration));

    setIsProcessing(false);
    toast({
      title: "Success!",
      description: `${action} completed successfully.`,
    });
  };

  const workingActions = {
    // Test Request Actions
    acceptTestRequest: (requestId) => {
      setLabState(prev => ({ ...prev, processingTest: true }));
      
      // Find the test request details
      const testRequest = testRequests.find(req => req.id === requestId);
      
      setTimeout(() => {
        setLabState(prev => ({ ...prev, processingTest: false }));
        
        // Create new sample collection entry when test is accepted
        const newSampleCollection = {
          id: `SC-${Date.now()}`,
          patient: testRequest ? testRequest.patient : "Unknown Patient",
          patientId: testRequest ? testRequest.patientId : "Unknown ID",
          sampleType: testRequest ? testRequest.sampleType || "Blood" : "Blood",
          collectionDate: "Pending Collection",
          collectedBy: "TBD",
          status: "Pending Collection",
          volume: testRequest?.test === "Urine Analysis" ? "50ml" : "5ml",
          container: testRequest?.test === "Urine Analysis" ? "Sterile Cup" : "EDTA Tube",
          location: `Room ${Math.floor(Math.random() * 20) + 10}A`,
          testType: testRequest ? testRequest.test : "Unknown Test",
          urgency: testRequest ? testRequest.urgency : "Normal",
          requestId: requestId,
          doctor: testRequest ? testRequest.doctor : "Unknown Doctor",
          instructions: testRequest ? testRequest.instructions : "Standard collection"
        };
        
        // Add to sample collections 
        setSampleCollections(prev => [newSampleCollection, ...prev]);
        
        // Remove the accepted test request from test requests list
        setTestRequests(prev => prev.filter(req => req.id !== requestId));
        
        // Create ACCEPTED workflow with lab assignment
        const acceptedWorkflow = {
          requestId: requestId,
          status: "ACCEPTED & QUEUED",
          acceptedAt: new Date().toISOString(),
          patient: testRequest ? testRequest.patient : "Unknown Patient",
          test: testRequest ? testRequest.test : "Unknown Test",
          urgency: testRequest ? testRequest.urgency : "Normal",
          assignedTechnician: `Tech-${Math.floor(Math.random() * 100)}`,
          labStation: `Station-${Math.random() > 0.5 ? 'A' : 'B'}${Math.floor(Math.random() * 10)}`,
          queuePosition: Math.floor(Math.random() * 20) + 1,
          estimatedStart: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 min from now
          estimatedCompletion: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
          workflowSteps: [
            "âœ… Request Accepted",
            "ðŸ”„ Sample Collection (Pending)",
            "â³ Laboratory Analysis (Waiting)",
            "â³ Quality Control (Waiting)",
            "â³ Report Generation (Waiting)",
            "â³ Doctor Notification (Waiting)"
          ],
          priority: testRequest?.urgency === "Urgent" ? "HIGH" : "STANDARD",
          cost: testRequest?.test === "Complete Blood Count" ? "$45" : 
                testRequest?.test === "Liver Function Panel" ? "$85" : "$35"
        };
        
        // Download ACCEPTED workflow
        const blob = new Blob([JSON.stringify(acceptedWorkflow, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `ACCEPTED_Workflow_${requestId}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        // Navigate to sample collection tab to show the new entry
        setActiveTab("sample-collection");
        
        toast({
          title: "✅ TEST ACCEPTED & SAMPLE COLLECTION SCHEDULED",
          description: `${testRequest?.test} for ${testRequest?.patient} accepted. Check Sample Collection tab for collection details.`,
        });
        updateStats('processTest');
      }, 1500);
    },

    rejectTestRequest: (requestId, reason) => {
      setLabState(prev => ({ ...prev, processingTest: true }));
      
      // Find the test request details
      const testRequest = testRequests.find(req => req.id === requestId);
      
      setTimeout(() => {
        setLabState(prev => ({ ...prev, processingTest: false }));
        
        // Update test request status to rejected
        setTestRequests(prev => prev.map(req => 
          req.id === requestId 
            ? { ...req, status: "Rejected", rejectionReason: reason || "Quality concerns" }
            : req
        ));
        
        // Create rejection report
        const rejectionReport = {
          requestId: requestId,
          patient: testRequest?.patient,
          test: testRequest?.test,
          rejectedBy: labProfile.name,
          rejectedDate: new Date().toISOString(),
          reason: reason || "Quality concerns",
          status: "REJECTED"
        };
        
        // Download rejection report
        const blob = new Blob([JSON.stringify(rejectionReport, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Rejection_Report_${requestId}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        // Navigate to test requests tab to show rejection
        setActiveTab("test-requests");
        
        toast({
          title: "❌ TEST REQUEST REJECTED",
          description: `Test request ${requestId} for ${testRequest?.patient} has been rejected. Reason: ${reason || "Quality concerns"}`,
          variant: "destructive"
        });
      }, 1000);
    },

    assignTechnician: (requestId, techName) => {
      setLabState(prev => ({ ...prev, processingTest: true }));
      
      // Find the test request details
      const testRequest = testRequests.find(req => req.id === requestId);
      
      setTimeout(() => {
        setLabState(prev => ({ ...prev, processingTest: false }));
        
        // Update test request with assigned technician
        setTestRequests(prev => prev.map(req => 
          req.id === requestId 
            ? { ...req, assignedTechnician: techName || labProfile.name, status: "Assigned" }
            : req
        ));
        
        // Navigate to test requests tab to show assignment
        setActiveTab("test-requests");
        
        toast({
          title: "👨‍🔬 TECHNICIAN ASSIGNED",
          description: `${techName || labProfile.name} has been assigned to test request ${requestId} for ${testRequest?.patient}.`,
        });
      }, 1000);
    },

    viewTestDetails: (requestId) => {
      // Find the test request details
      const testRequest = testRequests.find(req => req.id === requestId);
      
      if (testRequest) {
        // Set the selected test request and open modal
        setLabState(prev => ({
          ...prev,
          selectedTestRequest: testRequest,
          showPatientModal: true
        }));
        
        // Show TEST REQUEST DETAILS
        
        // Show DOCTOR & DATE INFORMATION
        setTimeout(() => {
          toast({
            title: `ï¿½â€âš•ï¸ REQUESTING DOCTOR`,
            description: `Doctor: Dr. ${testRequest.doctor} | Request Date: ${testRequest.requestDate}`,
          });
        }, 3000);
        
        // Show SAMPLE & INSTRUCTIONS
        setTimeout(() => {
          const sampleType = testRequest.sampleType || (testRequest.test.includes("Urine") ? "Urine" : "Blood");
          const instructions = testRequest.instructions || "Standard laboratory procedures";
          
          toast({
            title: `ðŸ“‹ SAMPLE & INSTRUCTIONS`,
            description: `Sample Type: ${sampleType} | Instructions: ${instructions}`,
          });
        }, 4500);
        
        // Show CURRENT STATUS
        setTimeout(() => {
          const status = testRequest.status || "Pending";
          toast({
            title: `ðŸ“Š CURRENT STATUS`,
            description: `Status: ${status} | Request ID: ${requestId}`,
          });
        }, 6000);
        
        // Final summary
        // Modal will display all details - no toast notifications needed
        
      } else {
        toast({
          title: "Patient Not Found",
          description: `No patient details found for request ID: ${requestId}`,
          variant: "destructive"
        });
      }
    },

    viewSampleDetails: (sampleId) => {
      // Find the sample collection details
      const sample = sampleCollections.find(s => s.id === sampleId);
      
      if (sample) {
        // Set the selected sample and open modal
        setLabState(prev => ({
          ...prev,
          selectedSample: sample,
          showSampleCollectionModal: true
        }));
      } else {
        toast({
          title: "Sample Not Found",
          description: `No sample details found for sample ID: ${sampleId}`,
          variant: "destructive"
        });
      }
    },

    viewReportDetails: (reportId) => {
      // Find the lab report details
      const report = labReports.find(r => r.id === reportId);
      
      if (report) {
        // Set the selected report and open modal
        setLabState(prev => ({
          ...prev,
          selectedReport: report,
          showResultsModal: true
        }));
      } else {
        toast({
          title: "Report Not Found",
          description: `No report details found for report ID: ${reportId}`,
          variant: "destructive"
        });
      }
    },

    viewPatientRecord: (patientId) => {
      // Find the patient details
      const patient = searchResults.find(p => p.id === patientId);
      
      if (patient) {
        // Set the selected patient and open modal
        setLabState(prev => ({
          ...prev,
          selectedPatient: patient,
          showPatientModal: true
        }));
      } else {
        toast({
          title: "Patient Not Found",
          description: `No patient details found for patient ID: ${patientId}`,
          variant: "destructive"
        });
      }
    },

    // Sample Collection Actions
    collectSample: async () => {
      setLabState(prev => ({ ...prev, collectingSample: true }));
      
      setTimeout(() => {
        setLabState(prev => ({ ...prev, collectingSample: false }));
        
        // Generate sample collection barcode labels
        const sampleBarcodes = [
          `SAMPLE-${Date.now()}-001`,
          `SAMPLE-${Date.now()}-002`,
          `SAMPLE-${Date.now()}-003`
        ];
        
        const labelData = {
          generatedAt: new Date().toISOString(),
          collectionDate: new Date().toISOString().split('T')[0],
          sampleBarcodes: sampleBarcodes,
          collectionInstructions: [
            "Ensure patient fasting for 12 hours",
            "Use sterile collection tubes",
            "Label with patient name and DOB",
            "Store at room temperature",
            "Transport to lab within 2 hours"
          ],
          tubeTypes: {
            "Red Top": "Serum tests",
            "Purple Top": "Hematology",
            "Blue Top": "Coagulation studies"
          },
          collector: "Lab Technician",
          priority: "Standard"
        };
        
        // Download barcode labels
        const blob = new Blob([JSON.stringify(labelData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Sample_Collection_Labels_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        // Navigate to sample collection tab
        setActiveTab("sample-collection");
        
        toast({
          title: "Sample Collection Barcodes Generated",
          description: "Sample collection labels with barcodes downloaded. Ready for collection.",
        });
        updateStats('collectSample');
      }, 2000);
    },

    markSampleCollected: (sampleId) => {
      setLabState(prev => ({ ...prev, collectingSample: true }));
      
      // Find the sample details
      const sample = sampleCollections.find(s => s.id === sampleId);
      
      setTimeout(() => {
        setLabState(prev => ({ ...prev, collectingSample: false }));
        
        // Update sample status to collected
        setSampleCollections(prev => prev.map(s => 
          s.id === sampleId 
            ? { 
                ...s, 
                status: "Collected",
                collectionDate: new Date().toISOString().split('T')[0] + " " + new Date().toTimeString().split(' ')[0],
                collectedBy: labProfile.name
              }
            : s
        ));
        
        toast({
          title: "✅ SAMPLE COLLECTED",
          description: `Sample ${sampleId} for ${sample?.patient} has been collected successfully.`,
        });
        updateStats('collectSample');
      }, 1500);
    },

    editSampleDetails: (sampleId) => {
      // Find the sample details
      const sample = sampleCollections.find(s => s.id === sampleId);
      
      if (sample) {
        // If it's a new patient or walk-in patient, provide quick edit options
        if (sample.patient === "New Patient" || sample.patient === "Walk-in Patient") {
          const isWalkIn = sample.patient === "Walk-in Patient";
          const patientName = prompt(`Enter patient name:`, sample.patient);
          const patientId = prompt("Enter patient ID:", sample.patientId);
          const sampleType = prompt("Enter sample type (Blood/Urine/Other):", sample.sampleType);
          const testType = prompt(isWalkIn ? "Enter requested test:" : "Enter test type:", (sample as any).testType || "Blood Analysis");
          const doctor = prompt(isWalkIn ? "Self-referred or doctor name:" : "Enter requesting doctor:", (sample as any).doctor || (isWalkIn ? "Self/Walk-in" : "Dr. Assignment Needed"));
          
          if (patientName && patientId) {
            // Update the sample collection with new details
            setSampleCollections(prev => prev.map(s => 
              s.id === sampleId 
                ? { 
                    ...s, 
                    patient: patientName.trim(),
                    patientId: patientId.trim(),
                    sampleType: sampleType?.trim() || "Blood",
                    ...(testType && { testType: testType.trim() }),
                    ...(doctor && { doctor: doctor.trim() }),
                    instructions: "Updated collection details"
                  }
                : s
            ));
            
            toast({
              title: "✅ Sample Details Updated",
              description: `Sample collection details updated for ${patientName}`,
            });
          }
        } else {
          // For existing samples, open the modal for viewing
          setLabState(prev => ({
            ...prev,
            selectedSample: sample,
            showSampleCollectionModal: true
          }));
        }
      } else {
        toast({
          title: "Sample Not Found",
          description: `No sample details found for sample ID: ${sampleId}`,
          variant: "destructive"
        });
      }
    },

    processSample: (sampleId) => {
      setLabState(prev => ({ ...prev, processingSample: true }));
      
      // Find the sample details
      const sample = sampleCollections.find(s => s.id === sampleId);
      
      setTimeout(() => {
        setLabState(prev => ({ ...prev, processingSample: false }));
        
        // Update sample status to processing
        setSampleCollections(prev => prev.map(s => 
          s.id === sampleId 
            ? { 
                ...s, 
                status: "Processing",
                collectionDate: new Date().toISOString().split('T')[0] + " " + new Date().toTimeString().split(' ')[0],
                collectedBy: labProfile.name
              }
            : s
        ));
        
        // Create lab report entry when sample processing starts
        const newLabReport = {
          id: `LR-${Date.now()}`,
          patient: sample ? sample.patient : "Unknown Patient",
          patientId: sample ? sample.patientId : "Unknown ID",
          test: sample ? sample.sampleType + " Analysis" : "Unknown Test",
          completedDate: "In Progress",
          technician: labProfile.name,
          status: "Processing",
          results: "Analysis in progress...",
          doctor: "Unknown Doctor", // Sample collection doesn't have doctor info
          turnaroundTime: "Processing",
          urgency: "Normal" // Default urgency since not in sample collection
        };
        
        // Add to lab reports
        setLabReports(prev => [newLabReport, ...prev]);
        
        // Navigate to sample collection tab to show updated status
        setActiveTab("sample-collection");
        
        toast({
          title: "🔬 SAMPLE PROCESSING STARTED",
          description: `Sample ${sampleId} for ${sample?.patient} is now being analyzed. Lab report created.`,
        });
        updateStats('processTest');
      }, 2000);
    },

    // Results Actions
    uploadResults: () => {
      // Create file input for actual file upload
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.csv';
      input.multiple = true;
      
      input.onchange = (e) => {
        const files = (e.target as HTMLInputElement).files;
        if (files && files.length > 0) {
          setLabState(prev => ({ ...prev, isUploading: true }));
          setUploadProgress(0);
          
          const interval = setInterval(() => {
            setUploadProgress(prev => {
              const newProgress = prev + 10;
              if (newProgress >= 100) {
                clearInterval(interval);
                
                setLabState(prevState => ({ ...prevState, isUploading: false }));
                setUploadProgress(0);
                
                // Navigate to reports tab to show uploaded results
                setActiveTab("reports");
                
                toast({
                  title: "Results Uploaded Successfully",
                  description: `${files.length} file(s) uploaded. Check reports tab for details.`,
                });
                
                return 100;
              }
              return newProgress;
            });
          }, 200);
        }
      };
      
      input.click();
    },

    approveResults: (resultId) => {
      setLabState(prev => ({ ...prev, generatingReport: true }));
      
      // Find the lab report
      const report = labReports.find(r => r.id === resultId);
      
      setTimeout(() => {
        setLabState(prev => ({ ...prev, generatingReport: false }));
        
        // Update lab report status to approved and completed
        setLabReports(prev => prev.map(r => 
          r.id === resultId 
            ? { 
                ...r, 
                status: "Approved & Sent",
                completedDate: new Date().toISOString().split('T')[0] + " " + new Date().toTimeString().split(' ')[0],
                results: `${report?.test} - Normal findings, results within expected range`,
                turnaroundTime: `${Math.floor(Math.random() * 6) + 2} hours`
              }
            : r
        ));
        
        // Generate final report document
        const finalReport = {
          reportId: resultId,
          patient: report?.patient,
          patientId: report?.patientId,
          test: report?.test,
          results: `${report?.test} - Normal findings, results within expected range`,
          approvedBy: labProfile.name,
          approvedDate: new Date().toISOString(),
          doctor: report?.doctor,
          status: "APPROVED & RELEASED"
        };
        
        // Download final report
        const blob = new Blob([JSON.stringify(finalReport, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Final_Report_${resultId}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        // Navigate to reports tab
        setActiveTab("reports");
        
        toast({
          title: "✅ RESULTS APPROVED & SENT",
          description: `Lab results ${resultId} for ${report?.patient} have been approved and released to ${report?.doctor}.`,
        });
        updateStats('completeTest');
      }, 2000);
    },

    // Equipment Actions
    performEquipmentCheck: (equipmentId) => {
      toast({
        title: "Equipment Check Started",
        description: `Performing calibration check on ${equipmentId}...`,
      });
      
      setTimeout(() => {
        toast({
          title: "Equipment Check Complete",
          description: `${equipmentId} is functioning normally. Next check scheduled.`,
        });
      }, 3000);
    },

    // Patient Actions
    addNewPatient: () => {
      const newPatientId = `P-2024-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
      
      toast({
        title: "Patient Registration",
        description: `New patient registered with ID: ${newPatientId}.`,
      });
    },

    // Invoice Generation Actions
    generateInvoice: () => {
      const invoiceId = `INV-2024-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
      
      // Generate and download invoice
      setTimeout(() => {
        const invoiceData = {
          invoiceId: invoiceId,
          date: new Date().toISOString().split('T')[0],
          patient: "John Smith",
          patientId: "P-2024-203",
          tests: [
            { name: "Complete Blood Count", code: "CBC", price: 45.00 },
            { name: "Lipid Panel", code: "LP", price: 65.00 }
          ],
          subtotal: 110.00,
          tax: 11.00,
          total: 121.00,
          laboratory: "MediHub Laboratory"
        };
        
        const invoiceText = `
INVOICE: ${invoiceData.invoiceId}
Date: ${invoiceData.date}
Patient: ${invoiceData.patient} (${invoiceData.patientId})

Tests Performed:
${invoiceData.tests.map(test => `${test.name} (${test.code}): $${test.price}`).join('\n')}

Subtotal: $${invoiceData.subtotal}
Tax: $${invoiceData.tax}
Total: $${invoiceData.total}

Generated by: ${invoiceData.laboratory}
        `;
        
        const blob = new Blob([invoiceText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Invoice_${invoiceId}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        toast({
          title: "Invoice Generated & Downloaded",
          description: `Invoice ${invoiceId} has been generated and downloaded successfully.`,
        });
      }, 1500);
    },

    processPayment: () => {
      const paymentId = `PAY-${new Date().getTime()}`;
      
      setTimeout(() => {
        toast({
          title: "Payment Processed",
          description: `Payment ${paymentId} processed successfully. Receipt generated.`,
        });
      }, 2000);
    },
    
    createInvoice: () => {
      toast({
        title: "Creating Invoice",
        description: "Invoice creation initiated. Please complete patient and test details.",
      });
    },

    // Voice Recording Actions
    startVoiceRecording: () => {
      setLabState(prev => ({ 
        ...prev, 
        showVoiceRecordingModal: true,
        recordingText: ""
      }));
      setVoiceRecording(true);
      
      toast({
        title: "Voice Recording Started",
        description: "Listening for dictation...",
      });

      // Simulate real-time transcription
      const transcriptionTexts = [
        "Patient sample collected at current time.",
        "Blood sample appears normal in color and consistency.",
        "No clotting observed during collection process.",
        "Sample properly labeled and stored at appropriate temperature.",
        "Ready for processing in laboratory department."
      ];
      
      let textIndex = 0;
      const interval = setInterval(() => {
        if (textIndex < transcriptionTexts.length && voiceRecording) {
          setLabState(prev => ({ 
            ...prev, 
            recordingText: prev.recordingText + " " + transcriptionTexts[textIndex]
          }));
          textIndex++;
        } else {
          clearInterval(interval);
        }
      }, 1000);
    },

    stopVoiceRecording: () => {
      setVoiceRecording(false);
      
      toast({
        title: "Voice Note Saved",
        description: "Voice recording has been transcribed and saved to the record.",
      });
      
      setLabState(prev => ({ ...prev, showVoiceRecordingModal: false }));
    },

    // Report Actions
    generateReport: async () => {
      setLabState(prev => ({ ...prev, generatingReport: true }));
      
      setTimeout(() => {
        const reportId = `RPT-2024-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
        
        // Generate comprehensive lab report
        const labReport = `LABORATORY REPORT
Report ID: ${reportId}
Generated: ${new Date().toLocaleString()}
Technician: Dr. Michael Chen

DAILY SUMMARY:
- Tests Processed: 67
- Pending Tests: 24
- In Progress: 18
- Urgent Cases: 5

QUALITY METRICS:
- Sample Integrity: 98.5%
- Result Accuracy: 97.8%
- Turnaround Time: Average 2.3 hours

EQUIPMENT STATUS:
- Operational Equipment: 85%
- Maintenance Required: 2 units
- Calibration Due: 1 unit

RECOMMENDATIONS:
1. Schedule maintenance for Analyzer #2
2. Calibrate Microscope Station #7
3. Monitor turnaround times for urgent cases

Report generated by MediHub Laboratory Information System
        `;
        
        // Download the report
        const blob = new Blob([labReport], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Laboratory_Report_${reportId}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        setLabState(prev => ({ ...prev, generatingReport: false }));
        
        // Navigate to reports tab
        setActiveTab("reports");
        
        toast({
          title: "Report Generated & Downloaded",
          description: `Laboratory report ${reportId} generated successfully. Check reports tab for more options.`,
        });
        updateStats('completeTest');
      }, 2000);
    },

    sendReport: () => {
      // Navigate to reports tab
      setActiveTab("reports");
      
      toast({
        title: "Report Sent",
        description: "Laboratory report has been sent to attending physician via secure email.",
      });
    },

    // Settings Actions
    saveSettings: () => {
      // Navigate to profile tab
      setActiveTab("profile");
      
      toast({
        title: "Settings Saved",
        description: "Your laboratory settings have been updated successfully. Check profile tab for more options.",
      });
    },

    // Support Actions
    submitIssue: () => {
      const ticketId = `TKT-2024-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
      
      // Navigate to help tab
      setActiveTab("help");
      
      toast({
        title: "Support Ticket Created",
        description: `Support ticket ${ticketId} has been created. Check help tab to track progress.`,
      });
    },

    // Export Actions
    exportData: (dataType = "Laboratory", format = "PDF") => {
      toast({
        title: "Export Started",
        description: `Exporting ${dataType} data in ${format} format...`,
      });
      
      setTimeout(() => {
        // Create and download actual file
        const exportData = {
          exportDate: new Date().toISOString(),
          dataType: dataType,
          format: format,
          records: [
            { id: "TR-2024-001", patient: "John Smith", test: "Complete Blood Count", status: "Completed" },
            { id: "TR-2024-002", patient: "Mary Davis", test: "Liver Function Panel", status: "In Progress" },
            { id: "TR-2024-003", patient: "Robert Wilson", test: "Urine Analysis", status: "Pending" }
          ],
          totalRecords: 3,
          generatedBy: "Laboratory System",
          laboratory: "MediHub Laboratory"
        };
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `${dataType}_Export_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        // Navigate to reports tab
        setActiveTab("reports");
        
        toast({
          title: "Export Complete",
          description: `${dataType} data has been exported and downloaded. Check reports tab for more options.`,
        });
      }, 2000);
    },

    // Enhanced actions
    voiceEntry: simulateVoiceEntry,
    aiAnalysis: () => {
      // Navigate to AI assistant
      navigate('/laboratory-ai');
      toast({
        title: "Opening AI Assistant", 
        description: "Launching laboratory AI for data analysis and insights."
      });
    },
    equipmentCheck: () => {
      setLabState(prev => ({ ...prev, checkingEquipment: true }));
      
      setTimeout(() => {
        setLabState(prev => ({ ...prev, checkingEquipment: false }));
        
        // Generate equipment status report
        const equipmentStatus = [
          { name: "Automated Analyzer #1", status: "Operational", lastCheck: "2 hours ago" },
          { name: "Automated Analyzer #2", status: "Needs Calibration", lastCheck: "1 day ago" },
          { name: "Microscope Station #1", status: "Operational", lastCheck: "3 hours ago" },
          { name: "Centrifuge #1", status: "Low Maintenance Alert", lastCheck: "5 hours ago" }
        ];
        
        const statusReport = `EQUIPMENT STATUS REPORT
Generated: ${new Date().toLocaleString()}

${equipmentStatus.map(eq => `${eq.name}: ${eq.status} (Last Check: ${eq.lastCheck})`).join('\n')}

Total Equipment Checked: ${equipmentStatus.length}
Operational: ${equipmentStatus.filter(eq => eq.status === "Operational").length}
Needs Attention: ${equipmentStatus.filter(eq => eq.status !== "Operational").length}
        `;
        
        // Create downloadable report
        const blob = new Blob([statusReport], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Equipment_Status_${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        toast({
          title: "Equipment Check Complete",
          description: "Equipment diagnostics completed. Status report downloaded.",
        });
      }, 3000);
    },
    updateStatus: () => {
      setLabState(prev => ({ ...prev, updatingStatus: true }));
      
      setTimeout(() => {
        setLabState(prev => ({ ...prev, updatingStatus: false }));
        
        // Update sample statuses
        const updates = [
          "Sample PT-001: Moved from Collection to Processing",
          "Sample PT-002: Moved from Processing to Analysis", 
          "Sample PT-003: Analysis Complete - Results Available"
        ];
        
        // Navigate to sample collection tab to show updates
        setActiveTab("sample-collection");
        
        toast({
          title: "Status Updated",
          description: `${updates.length} sample statuses updated. Check sample collection tab for details.`,
        });
        
        // Update stats
        updateStats('completeTest');
      }, 2000);
    },
    newCollection: () => {
      // Create a new sample collection entry with default values
      const newSampleCollection = {
        id: `SC-${Date.now()}`,
        patient: "New Patient",
        patientId: `P-${Date.now()}`,
        sampleType: "Blood",
        collectionDate: "Pending Collection",
        collectedBy: "TBD",
        status: "Pending Collection",
        volume: "5ml",
        container: "EDTA Tube",
        location: `Room ${Math.floor(Math.random() * 20) + 10}A`,
        testType: "New Test",
        urgency: "Normal",
        doctor: "Dr. Assignment Needed",
        instructions: "Standard collection procedure - Please update patient details"
      };
      
      // Add to sample collections at the top
      setSampleCollections(prev => [newSampleCollection, ...prev]);
      
      // Set as selected sample and open modal for editing
      setLabState(prev => ({
        ...prev,
        selectedSample: newSampleCollection,
        showSampleCollectionModal: true
      }));
      
      // Navigate to sample collection tab
      setActiveTab("sample-collection");
      
      toast({
        title: "✅ New Sample Collection Created",
        description: "New sample collection entry created. Please update the patient details and sample information.",
      });
    },

    addWalkInPatient: () => {
      // Create a walk-in patient collection entry
      const walkInCollection = {
        id: `WI-${Date.now()}`,
        patient: "Walk-in Patient",
        patientId: `WI-${Date.now()}`,
        sampleType: "Blood",
        collectionDate: "Pending Collection",
        collectedBy: "TBD",
        status: "Pending Collection",
        volume: "5ml",
        container: "EDTA Tube",
        location: `Room ${Math.floor(Math.random() * 20) + 10}A`,
        testType: "Walk-in Test Request",
        urgency: "Normal",
        doctor: "Direct/Walk-in",
        instructions: "Walk-in patient - Please collect patient details and test requirements"
      };
      
      // Add to sample collections at the top
      setSampleCollections(prev => [walkInCollection, ...prev]);
      
      // Set as selected sample and open modal for editing
      setLabState(prev => ({
        ...prev,
        selectedSample: walkInCollection,
        showSampleCollectionModal: true
      }));
      
      // Navigate to sample collection tab
      setActiveTab("sample-collection");
      
      toast({
        title: "✅ Walk-in Patient Added",
        description: "Walk-in patient added to sample collection. Please update patient details and test requirements.",
      });
    },

    batchProcess: () => {
      setLabState(prev => ({ ...prev, batchProcessing: true }));
      
      setTimeout(() => {
        setLabState(prev => ({ ...prev, batchProcessing: false }));
        
        // Simulate batch processing of multiple samples
        const batchSamples = [
          { id: "BT-001", type: "Blood", patient: "John Smith", status: "Completed" },
          { id: "BT-002", type: "Urine", patient: "Mary Davis", status: "Completed" },
          { id: "BT-003", type: "Blood", patient: "Robert Wilson", status: "Completed" },
          { id: "BT-004", type: "Tissue", patient: "Lisa Brown", status: "Completed" }
        ];
        
        // Create batch report
        const batchReport = `BATCH PROCESSING REPORT
Date: ${new Date().toLocaleString()}
Batch ID: BATCH-${new Date().getTime()}

Samples Processed:
${batchSamples.map(sample => `${sample.id} - ${sample.type} - ${sample.patient} - ${sample.status}`).join('\n')}

Total Samples: ${batchSamples.length}
Success Rate: 100%
Processing Time: 3 minutes
        `;
        
        // Download batch report
        const blob = new Blob([batchReport], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Batch_Report_${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        // Navigate to sample collection tab
        setActiveTab("sample-collection");
        
        toast({
          title: "Batch Processing Complete",
          description: `${batchSamples.length} samples processed successfully. Report downloaded.`,
        });
        
        // Update completed tests count
        updateStats('completeTest');
      }, 3000);
    },
    orderTest: () => {
      setActiveTab("test-requests");
      toast({
        title: "New Test Order", 
        description: "Navigate to test requests tab to place new orders."
      });
    },
    viewRecord: () => {
      setActiveTab("patient-search");
      toast({
        title: "Patient Records", 
        description: "Navigate to patient search tab to view detailed records."
      });
    },
    processTest: async () => {
      setLabState(prev => ({ ...prev, processingTest: true }));
      
      // Create a new test request form
      const newTestId = `TEST-${Date.now()}`;
      
      setTimeout(() => {
        setLabState(prev => ({ ...prev, processingTest: false }));
        
        // Create new test request form data
        const newTestForm = {
          testId: newTestId,
          formType: "New Test Request",
          patientInfo: {
            name: "",
            age: "",
            gender: "",
            contactNumber: "",
            email: ""
          },
          testDetails: {
            testType: "",
            urgency: "Normal",
            clinicalNotes: "",
            requestingDoctor: "",
            expectedResults: ""
          },
          sampleRequirements: "",
          instructions: "Please fill out this form to create a new test request.",
          createdAt: new Date().toISOString()
        };
        
        // Download the new test request form
        const blob = new Blob([JSON.stringify(newTestForm, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `New_Test_Request_Form_${newTestId}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        // Navigate to test requests tab
        setActiveTab("test-requests");
        
        toast({
          title: "New Test Request Form Created",
          description: "Empty test request form downloaded. Fill and submit for processing.",
        });
        
        updateStats('processTest');
      }, 2000);
    },

    handleNotificationAction: async (notification) => {
      if (notification.type === 'urgent' || notification.type === 'alert') {
        if (notification.testType === 'Blood Glucose') {
          toast({ 
            title: "Critical Alert Acknowledged",
            description: "Contacting attending physician and preparing emergency protocols."
          });
          
          // Simulate urgent action
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          toast({
            title: "Emergency Response Initiated",
            description: "Dr. Martinez has been notified. Patient being transferred to ICU."
          });
        } else if (notification.testType === 'Chemistry Panel') {
          toast({
            title: "Quality Control Investigation",
            description: "Initiating QC failure protocol and re-running control samples."
          });
          
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          toast({
            title: "QC Investigation Complete",
            description: "Control samples re-run successfully. Equipment validated."
          });
        }
      } else if (notification.type === 'reminder') {
        if (notification.equipment) {
          toast({
            title: "Equipment Calibration Scheduled",
            description: "Maintenance technician has been notified for immediate calibration."
          });
          
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          toast({
            title: "Calibration In Progress",
            description: "Equipment calibration started. Expected completion in 15 minutes."
          });
        }
      }
    }
  };

  // Enhanced Laboratory Data with real-time updates
  const [todayStats, setTodayStats] = useState([
    { label: "Pending Tests", value: "24", change: "+6", trend: "up", icon: Clock, target: 30 },
    { label: "In Progress", value: "18", change: "+3", trend: "up", icon: Activity, target: 25 },
    { label: "Completed Today", value: "67", change: "+12", trend: "up", icon: CheckCircle, target: 80 },
    { label: "Urgent Cases", value: "5", change: "-2", trend: "down", icon: AlertTriangle, target: 0 },
  ]);

  // Function to update stats when actions are performed
  const updateStats = (action) => {
    setTodayStats(prev => prev.map(stat => {
      if (action === 'processTest' && stat.label === 'In Progress') {
        return { ...stat, value: String(parseInt(stat.value) + 1) };
      }
      if (action === 'completeTest' && stat.label === 'Completed Today') {
        return { ...stat, value: String(parseInt(stat.value) + 1) };
      }
      if (action === 'collectSample' && stat.label === 'Pending Tests') {
        return { ...stat, value: String(Math.max(0, parseInt(stat.value) - 1)) };
      }
      return stat;
    }));
  };

  // Test Requests Data - Made mutable to allow real-time updates
  const [testRequests, setTestRequests] = useState([
    {
      id: "TR-2024-001",
      patient: "John Smith",
      patientId: "P-2024-203",
      doctor: "Dr. Anderson",
      test: "Complete Blood Count",
      urgency: "High",
      status: "Pending",
      requestDate: "2024-01-22 09:30",
      sampleType: "Blood",
      instructions: "Fasting required, check for anemia"
    },
    {
      id: "TR-2024-002",
      patient: "Mary Davis",
      patientId: "P-2024-187",
      doctor: "Dr. Smith",
      test: "Liver Function Panel",
      urgency: "Urgent",
      status: "In Progress",
      requestDate: "2024-01-22 08:15",
      sampleType: "Blood",
      instructions: "Monitor liver enzymes, patient on medication"
    },
    {
      id: "TR-2024-003",
      patient: "Robert Wilson",
      patientId: "P-2024-156",
      doctor: "Dr. Johnson",
      test: "Urine Analysis",
      urgency: "Normal",
      status: "Completed",
      requestDate: "2024-01-22 07:45",
      sampleType: "Urine",
      instructions: "Check for UTI, routine screening"
    },
  ]);

  // Sample Collection Data - Made mutable to allow real-time updates
  const [sampleCollections, setSampleCollections] = useState([
    {
      id: "SC-2024-001",
      patient: "John Smith",
      patientId: "P-2024-203",
      sampleType: "Blood",
      collectionDate: "2024-01-22 10:00",
      collectedBy: "Sarah Johnson",
      status: "Collected",
      volume: "5ml",
      container: "EDTA Tube",
      location: "Room 15A"
    },
    {
      id: "SC-2024-002",
      patient: "Mary Davis",
      patientId: "P-2024-187",
      sampleType: "Blood",
      collectionDate: "2024-01-22 09:30",
      collectedBy: "Michael Chen",
      status: "Processing",
      volume: "10ml",
      container: "Serum Tube",
      location: "Room 12B"
    },
    {
      id: "SC-2024-003",
      patient: "Lisa Brown",
      patientId: "P-2024-145",
      sampleType: "Urine",
      collectionDate: "Pending",
      collectedBy: "TBD",
      status: "Pending",
      volume: "50ml",
      container: "Sterile Cup",
      location: "Room 10A"
    },
  ]);

  // Lab Reports Data - Made mutable to allow real-time updates
  const [labReports, setLabReports] = useState([
    {
      id: "LR-2024-001",
      patient: "Robert Wilson",
      patientId: "P-2024-156",
      test: "Urine Analysis",
      completedDate: "2024-01-22 11:30",
      technician: "Sarah Johnson",
      status: "Sent",
      results: "Normal findings, no abnormalities detected",
      doctor: "Dr. Johnson",
      turnaroundTime: "2 hours"
    },
    {
      id: "LR-2024-002",
      patient: "Emma Rodriguez",
      patientId: "P-2024-134",
      test: "Blood Chemistry Panel",
      completedDate: "2024-01-22 10:45",
      technician: "Michael Chen",
      status: "Ready",
      results: "Glucose elevated, recommend follow-up",
      doctor: "Dr. Anderson",
      turnaroundTime: "3 hours"
    },
  ]);

  const handleLogout = () => {
    toast({
      title: "Logged out successfully",
      description: "You have been safely logged out of the laboratory system.",
    });
    navigate("/laboratory-login");
  };

  // Handle MediVo AI click
  const handleMediVoAIClick = () => {
    navigate('/laboratory-ai');
    toast({
      title: "Opening Laboratory AI",
      description: "Launching dedicated laboratory AI assistant...",
    });
  };

  // Handle profile click
  const handleProfileClick = () => {
    setActiveTab("profile");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50/30 to-green-100/20 flex">
      {/* Side Navigation - Fixed Height */}
      <div className="w-64 bg-white border-r border-green-200 shadow-lg flex flex-col fixed h-screen">
        {/* Logo/Brand */}
        <div className="p-4 border-b border-green-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <TestTube className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800">MediVoice</h1>
              <p className="text-xs text-green-600">Laboratory Portal</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-3 overflow-y-auto">
          <div className="space-y-1">
            {[
              { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
              { id: "test-requests", label: "Test Requests", icon: TestTube },
              { id: "sample-collection", label: "Sample Collection", icon: FlaskConical },
              { id: "reports", label: "Reports", icon: FileText },
              { id: "patient-search", label: "Patient Search", icon: Search },
              { id: "ai-assistant", label: "AI Assistant", icon: Bot },
              { id: "profile", label: "Profile & Settings", icon: Settings },
              { id: "help", label: "Help & Support", icon: HelpCircle },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === "ai-assistant") {
                    navigate('/laboratory-ai');
                  } else {
                    setActiveTab(item.id);
                  }
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 text-sm ${
                  activeTab === item.id
                    ? "bg-green-100 text-green-700 border border-green-200 shadow-sm"
                    : "text-slate-600 hover:bg-green-50 hover:text-green-600"
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span className="font-medium">{item.label}</span>
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
            <Avatar className="h-8 w-8 ring-2 ring-green-400/40">
              <AvatarImage src="/placeholder.svg" alt="Lab Tech" />
              <AvatarFallback className="bg-gradient-to-br from-green-500 to-green-600 text-white font-bold text-sm">
                MC
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-left">
              <p className="font-semibold text-slate-800 text-sm">{labProfile.name}</p>
              <p className="text-xs text-blue-600">{labProfile.role}</p>
            </div>
          </button>
        </div>
      </div>

      {/* Main Content Area - Adjusted for fixed sidebar */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Top Navigation Bar */}
        <header className="bg-white border-b border-slate-200 shadow-sm">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  {activeTab === "dashboard" && "Laboratory Dashboard"}
                  {activeTab === "test-requests" && "Test Requests"}
                  {activeTab === "sample-collection" && "Sample Collection"}
                  {activeTab === "reports" && "Reports"}
                  {activeTab === "patient-search" && "Patient Search"}
                  {activeTab === "medivo" && "MediVo AI"}
                  {activeTab === "profile" && "Profile & Settings"}
                  {activeTab === "help" && "Help & Support"}
                </h2>
                <p className="text-slate-600">Welcome back, {labProfile.name} (ID: {labProfile.labId})</p>
              </div>

              {/* Top Right Actions */}
              <div className="flex items-center gap-3">
                {isProcessing && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span className="text-sm text-blue-600 font-medium">Processing...</span>
                  </div>
                )}

                <Button
                  onClick={workingActions.aiAnalysis}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md"
                  disabled={isProcessing}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  MediVo AI
                </Button>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleProfileClick}
                        className="hover:bg-green-100"
                      >
                        <User className="h-5 w-5 text-slate-600" />
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
                        className="relative hover:bg-green-100"
                        onClick={() => setLabState(prev => ({ ...prev, showNotificationsModal: true }))}
                      >
                        <Bell className="h-5 w-5 text-slate-600" />
                        {labState.notifications.filter(n => !n.read).length > 0 && (
                          <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse font-medium">
                            {labState.notifications.filter(n => !n.read).length}
                          </span>
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Lab Notifications ({labState.notifications.filter(n => !n.read).length} unread)</p>
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
                        <LogOut className="h-5 w-5 text-slate-600" />
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
          <>
            {/* Professional Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {todayStats.map((stat, index) => (
                <Card key={index} className="border border-green-200/60 shadow-xl bg-gradient-to-br from-white/95 to-green-50/95 hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-500 hover:scale-[1.03] hover:-translate-y-1 cursor-pointer group overflow-hidden backdrop-blur-sm hover:border-green-400/60">
                  <CardContent className="p-6 relative">
                    {/* Animated Background Elements */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-200/40 to-green-300/40 rounded-bl-3xl opacity-50 group-hover:opacity-80 transition-opacity"></div>
                    <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-green-100/40 to-transparent rounded-tr-3xl opacity-30 group-hover:opacity-60 transition-opacity"></div>

                    <div className="relative z-10">
                      {/* Icon and Value Section */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-gradient-to-br from-green-100 to-green-200 rounded-xl border border-green-300/50 group-hover:scale-110 transition-transform shadow-lg">
                          <stat.icon className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="text-right">
                          <p className="text-3xl font-bold text-slate-800 mb-1">{stat.value}</p>
                          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">{stat.label}</p>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-3">
                        <div className="w-full bg-green-100 rounded-full h-2 border border-green-200/50">
                          <div
                            className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${(parseInt(stat.value) / stat.target) * 100}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Target: {stat.target}</p>
                      </div>

                      {/* Trend Indicator */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {stat.trend === "up" && <TrendingUp className="h-4 w-4 text-green-600" />}
                          {stat.trend === "down" && <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />}
                          {stat.trend === "stable" && <Activity className="h-4 w-4 text-green-600" />}
                          <span className={`text-sm font-semibold ${
                            stat.trend === "up" ? "text-green-600" :
                            stat.trend === "down" ? "text-red-500" : "text-green-600"
                          }`}>
                            {stat.change}
                          </span>
                        </div>
                        <span className="text-xs text-slate-500">vs yesterday</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Full Width Recent Test Requests Section */}
            <Card className="mb-8 border border-green-200/60 shadow-xl bg-gradient-to-br from-white/95 to-green-50/95 hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-500 hover:scale-[1.005] hover:-translate-y-1 backdrop-blur-sm hover:border-green-400/60">
              <CardHeader className="bg-gradient-to-r from-green-100/80 to-green-100/80 border-b border-green-200/60">
                <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-800">
                  <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg">
                    <TestTube className="h-6 w-6 text-white" />
                  </div>
                  Recent Test Requests
                </CardTitle>
                <CardDescription className="text-slate-600 font-medium">Latest test requests from doctors - Full laboratory workflow management</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {testRequests.map((request) => (
                    <div key={request.id} className={`flex flex-col gap-4 p-5 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border cursor-pointer ${
                      request.urgency === 'Urgent'
                        ? 'border-red-200/60 bg-red-50/80 hover:bg-red-100/80'
                        : request.urgency === 'High'
                        ? 'border-orange-200/60 bg-orange-50/80 hover:bg-orange-100/80'
                        : 'border-green-200/60 bg-green-50/80 hover:bg-green-100/80'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className={`p-3 rounded-xl ${
                          request.urgency === 'Urgent'
                            ? 'bg-red-200 text-red-700'
                            : request.urgency === 'High'
                            ? 'bg-orange-200 text-orange-700'
                            : 'bg-green-200 text-green-700'
                        }`}>
                          <TestTube className="h-5 w-5" />
                        </div>
                        <Badge variant={request.urgency === 'Urgent' ? 'destructive' : request.urgency === 'High' ? 'default' : 'secondary'}>
                          {request.urgency}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="font-bold text-slate-800">{request.test}</p>
                        <p className="text-sm text-slate-600 font-medium">{request.patient}</p>
                        <p className="text-xs text-slate-500">Dr. {request.doctor}</p>
                        <p className="text-xs text-slate-500">{request.requestDate}</p>
                      </div>
                      
                      <div className="flex gap-2 mt-auto pt-3 border-t border-slate-200/60">
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="flex-1 text-xs h-8 border-green-300 text-green-700 hover:bg-green-100"
                          onClick={() => workingActions.acceptTestRequest(request.id)}
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Accept
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="flex-1 text-xs h-8 border-slate-300 text-slate-600 hover:bg-slate-100"
                          onClick={() => workingActions.viewTestDetails(request.id)}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-green-200/60">
                  <p className="text-sm text-slate-600">
                    Showing {testRequests.length} requests â€¢ 
                    <span className="text-red-600 font-medium ml-1">
                      {testRequests.filter(r => r.urgency === 'Urgent').length} urgent
                    </span>
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-green-300 text-green-700 hover:bg-green-100"
                    onClick={() => setActiveTab("test-requests")}
                  >
                    View All Requests
                    <ChevronRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Two-Column Layout for Sample Status and Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Sample Status */}
              <Card className="border border-green-200/60 shadow-xl bg-gradient-to-br from-white/95 to-green-50/95 hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-500 hover:scale-[1.01] hover:-translate-y-1 backdrop-blur-sm hover:border-green-400/60">
                <CardHeader className="bg-gradient-to-r from-green-100/80 to-green-200/80 border-b border-green-200/60">
                  <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-800">
                    <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg">
                      <FlaskConical className="h-6 w-6 text-white" />
                    </div>
                    Sample Status
                  </CardTitle>
                  <CardDescription className="text-slate-600 font-medium">Collection and processing status</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  {sampleCollections.slice(0, 3).map((sample) => (
                    <div key={sample.id} className={`p-4 rounded-xl border-l-4 transition-all duration-300 hover:scale-[1.01] hover:shadow-md cursor-pointer ${
                      sample.status === 'Collected'
                        ? 'border-l-green-500 bg-green-100/80 hover:bg-green-200/80'
                        : sample.status === 'Processing'
                        ? 'border-l-green-400 bg-green-50/80 hover:bg-green-100/80'
                        : 'border-l-green-300 bg-green-25/80 hover:bg-green-50/80'
                    }`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-bold text-sm text-slate-800">{sample.patient}</p>
                          <p className="text-xs text-slate-600 font-medium mt-1">{sample.sampleType} â€¢ {sample.volume}</p>
                          <p className="text-xs text-slate-500 mt-1">Collected by: {sample.collectedBy}</p>
                        </div>
                        <Badge variant={sample.status === 'Collected' ? 'default' : sample.status === 'Processing' ? 'secondary' : 'outline'} className={
                          sample.status === 'Collected' ? 'bg-green-100 text-green-700 border-green-300/60' :
                          sample.status === 'Processing' ? 'bg-green-50 text-green-600 border-green-200/60' : 'bg-green-25 text-green-500 border-green-100/60'
                        }>
                          {sample.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  <Button 
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                    onClick={() => setActiveTab("sample-collection")}
                  >
                    View All Samples
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Lab Actions */}
              <Card className="border border-green-200/60 shadow-xl bg-gradient-to-br from-white/95 to-green-50/95 hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-500 hover:scale-[1.01] hover:-translate-y-1 backdrop-blur-sm hover:border-green-400/60">
                <CardHeader className="bg-gradient-to-r from-green-100/80 to-green-200/80 border-b border-green-200/60">
                  <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-800">
                    <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg">
                      <Activity className="h-6 w-6 text-white" />
                    </div>
                    Quick Actions
                  </CardTitle>
                  <CardDescription className="text-slate-600 font-medium">Frequently used lab tools</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-3">
                  <Button
                    className="w-full justify-start bg-gradient-to-r from-green-100 to-green-200 hover:from-green-200 hover:to-green-300 text-green-800 border border-green-300/60 hover:border-green-400/80 hover:shadow-lg transition-all duration-300"
                    onClick={workingActions.processTest}
                    disabled={isProcessing}
                  >
                    <TestTube className="h-4 w-4 mr-2" />
                    {isProcessing ? "Processing..." : "Process New Test"}
                  </Button>
                  <Button
                    className="w-full justify-start bg-gradient-to-r from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300 text-blue-800 border border-blue-300/60 hover:border-blue-400/80 hover:shadow-lg transition-all duration-300"
                    onClick={workingActions.collectSample}
                    disabled={isProcessing}
                  >
                    <FlaskConical className="h-4 w-4 mr-2" />
                    {labState.collectingSample ? "Collecting..." : "Collect Sample"}
                  </Button>
                  <Button
                    className="w-full justify-start bg-gradient-to-r from-purple-100 to-purple-200 hover:from-purple-200 hover:to-purple-300 text-purple-800 border border-purple-300/60 hover:border-purple-400/80 hover:shadow-lg transition-all duration-300"
                    onClick={workingActions.uploadResults}
                    disabled={isProcessing}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    {labState.isUploading ? "Uploading..." : "Upload Results"}
                  </Button>
                  <Button
                    className="w-full justify-start bg-gradient-to-r from-orange-100 to-orange-200 hover:from-orange-200 hover:to-orange-300 text-orange-800 border border-orange-300/60 hover:border-orange-400/80 hover:shadow-lg transition-all duration-300"
                    onClick={workingActions.equipmentCheck}
                    disabled={isProcessing}
                  >
                    <Microscope className="h-4 w-4 mr-2" />
                    {labState.checkingEquipment ? "Checking..." : "Equipment Check"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* Test Requests Tab Content */}
        {activeTab === "test-requests" && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-white/95 to-slate-50/95 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 shadow-2xl shadow-slate-500/10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-slate-800">Test Request Management</h2>
                  <p className="text-slate-600 font-medium">Manage doctor requests and add walk-in patients directly</p>
                </div>
                <div className="flex items-center gap-3">
                  <Button 
                    className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
                    onClick={() => workingActions.addWalkInPatient()}
                    disabled={isProcessing}
                  >
                    <Plus className="h-4 w-4" />
                    Walk-in Patient
                  </Button>
                  <Button 
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
                    onClick={() => setActiveTab("patient-search")}
                  >
                    <Search className="h-4 w-4" />
                    Search Requests
                  </Button>
                  <Button 
                    className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-md hover:shadow-lg transition-all duration-300"
                    onClick={() => workingActions.exportData()}
                  >
                    <Filter className="h-4 w-4" />
                    Filter by Urgency
                  </Button>
                </div>
              </div>
            </div>

            <Card className="border border-slate-200/60 shadow-2xl bg-gradient-to-br from-white/95 to-slate-50/95 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-slate-100/80 to-slate-100/80 border-b border-slate-200/60">
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <TestTube className="h-5 w-5 text-blue-600" />
                  Laboratory Test Requests
                </CardTitle>
                <CardDescription className="text-slate-600">Requests from doctors and hospital admin</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {testRequests.map((request) => (
                    <div key={request.id} className={`p-4 border rounded-lg transition-all duration-300 hover:scale-[1.01] hover:shadow-lg ${
                      request.urgency === 'Urgent'
                        ? 'border-red-200/60 bg-red-50/80 hover:bg-red-100/80'
                        : request.urgency === 'High'
                        ? 'border-orange-200/60 bg-orange-50/80 hover:bg-orange-100/80'
                        : 'border-slate-200/60 bg-slate-50/80 hover:bg-slate-100/80'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl ${
                            request.urgency === 'Urgent'
                              ? 'bg-red-200 text-red-700'
                              : request.urgency === 'High'
                              ? 'bg-orange-200 text-orange-700'
                              : 'bg-slate-200 text-slate-700'
                          }`}>
                            <TestTube className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="font-bold text-slate-800">{request.test}</h3>
                              <Badge variant={request.urgency === 'Urgent' ? 'destructive' : request.urgency === 'High' ? 'default' : 'secondary'}>
                                {request.urgency}
                              </Badge>
                              <Badge variant={request.status === 'Pending' ? 'secondary' : request.status === 'In Progress' ? 'default' : 'outline'} className={request.status === 'Completed' ? 'bg-teal-100 text-teal-700 border-teal-300/60' : request.status === 'In Progress' ? 'bg-orange-100 text-orange-700 border-orange-300/60' : ''}>
                                {request.status}
                              </Badge>
                            </div>
                            <p className="text-slate-600 mb-1">Patient: {request.patient} (ID: {request.patientId})</p>
                            <div className="flex items-center gap-4 text-sm text-slate-500">
                              <span>Requested by: Dr. {request.doctor}</span>
                              <span>Sample: {request.sampleType}</span>
                              <span>Date: {request.requestDate}</span>
                            </div>
                            <p className="text-xs text-slate-500 mt-1 italic">{request.instructions}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {request.status === 'Pending' ? (
                            <>
                              <Button 
                                size="sm" 
                                className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white"
                                onClick={() => workingActions.acceptTestRequest(request.id)}
                                disabled={labState.processingTest || isProcessing}
                              >
                                {labState.processingTest ? (
                                  <>
                                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                    Processing...
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Accept
                                  </>
                                )}
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-red-600 border-red-300/60 hover:bg-red-100"
                                onClick={() => {
                                  const reason = prompt("Please provide a reason for rejection:");
                                  if (reason && reason.trim()) {
                                    workingActions.rejectTestRequest(request.id, reason);
                                  }
                                }}
                                disabled={isProcessing}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </>
                          ) : request.status === 'In Progress' ? (
                            <>
                              <Button 
                                size="sm" 
                                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
                                onClick={() => workingActions.updateStatus()}
                              >
                                <UserCheck className="h-4 w-4 mr-1" />
                                Assign Tech
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-blue-600 border-blue-300/60 hover:bg-blue-100"
                                onClick={() => workingActions.viewTestDetails(request.id)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View Details
                              </Button>
                            </>
                          ) : (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-teal-600 border-teal-300/60 hover:bg-teal-100"
                              onClick={() => workingActions.viewTestDetails(request.id)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View Results
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Sample Collection Tab Content */}
        {activeTab === "sample-collection" && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-white/95 to-green-50/95 backdrop-blur-sm rounded-2xl p-6 border border-green-200/60 shadow-2xl shadow-green-500/10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-slate-800">Sample Collection Management</h2>
                  <p className="text-slate-600 font-medium">Track and manage sample collection and processing</p>
                </div>
                <div className="flex items-center gap-3">
                  <Button 
                    className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
                    onClick={() => workingActions.newCollection()}
                    disabled={isProcessing}
                  >
                    <Plus className="h-4 w-4" />
                    New Collection
                  </Button>
                </div>
              </div>
            </div>

            <Card className="border border-green-200/60 shadow-2xl bg-gradient-to-br from-white/95 to-green-50/95 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-green-100/80 to-green-200/80 border-b border-green-200/60">
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <FlaskConical className="h-5 w-5 text-green-600" />
                  Sample Collection Tracking
                </CardTitle>
                <CardDescription className="text-slate-600">Track pending and completed sample collections</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {sampleCollections.map((sample) => (
                    <div key={sample.id} className={`p-4 border rounded-lg transition-all duration-300 hover:scale-[1.01] hover:shadow-lg ${
                      sample.status === 'Collected'
                        ? 'border-green-200/60 bg-green-50/80 hover:bg-green-100/80'
                        : sample.status === 'Processing'
                        ? 'border-green-300/60 bg-green-100/80 hover:bg-green-200/80'
                        : 'border-green-100/60 bg-green-25/80 hover:bg-green-50/80'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl ${
                            sample.status === 'Collected'
                              ? 'bg-green-200 text-green-700'
                              : sample.status === 'Processing'
                              ? 'bg-green-300 text-green-800'
                              : 'bg-green-100 text-green-600'
                          }`}>
                            <FlaskConical className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                {sample.patient}
                                {(sample.patient === "New Patient" || sample.patient === "Walk-in Patient") && (
                                  <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full border border-amber-200 font-medium">
                                    {sample.patient === "Walk-in Patient" ? "WALK-IN" : "NEEDS UPDATE"}
                                  </span>
                                )}
                              </h3>
                              <Badge variant={sample.status === 'Collected' ? 'default' : sample.status === 'Processing' ? 'secondary' : 'outline'} className={
                                sample.status === 'Collected' ? 'bg-green-100 text-green-700 border-green-300/60' :
                                sample.status === 'Processing' ? 'bg-green-200 text-green-800 border-green-400/60' : 'bg-green-50 text-green-600 border-green-200/60'
                              }>
                                {sample.status}
                              </Badge>
                            </div>
                            <p className="text-slate-600 mb-1">Sample: {sample.sampleType} â€¢ Volume: {sample.volume} â€¢ Container: {sample.container}</p>
                            <div className="flex items-center gap-4 text-sm text-slate-500">
                              <span>Patient ID: {sample.patientId}</span>
                              <span>Location: {sample.location}</span>
                              <span>Collected by: {sample.collectedBy}</span>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">Collection Date: {sample.collectionDate}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {sample.status === 'Pending' ? (
                            <>
                              <Button 
                                size="sm" 
                                className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white"
                                onClick={() => workingActions.markSampleCollected(sample.id)}
                                disabled={labState.collectingSample || isProcessing}
                              >
                                {labState.collectingSample ? (
                                  <>
                                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                    Collecting...
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Mark Collected
                                  </>
                                )}
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-orange-600 border-orange-300/60 hover:bg-orange-100"
                                onClick={() => workingActions.editSampleDetails(sample.id)}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit Details
                              </Button>
                            </>
                          ) : sample.status === 'Collected' ? (
                            <>
                              <Button 
                                size="sm" 
                                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
                                disabled={labState.processingSample}
                                onClick={() => workingActions.processSample(sample.id)}
                              >
                                {labState.processingSample ? (
                                  <>
                                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                    Processing...
                                  </>
                                ) : (
                                  <>
                                    <Activity className="h-4 w-4 mr-1" />
                                    Start Processing
                                  </>
                                )}
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-blue-600 border-blue-300/60 hover:bg-blue-100"
                                onClick={() => workingActions.viewSampleDetails(sample.id)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View Details
                              </Button>
                            </>
                          ) : (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-teal-600 border-teal-300/60 hover:bg-teal-100"
                              onClick={() => workingActions.viewSampleDetails(sample.id)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View Details
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Reports Tab Content */}
        {activeTab === "reports" && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-white/95 to-green-50/95 backdrop-blur-sm rounded-2xl p-6 border border-green-200/60 shadow-2xl shadow-green-500/10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-slate-800">Laboratory Reports & Results</h2>
                  <p className="text-slate-600 font-medium">Upload results and manage laboratory reports</p>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
                    onClick={() => setLabState(prev => ({ ...prev, showFileUploadModal: true }))}
                    disabled={isProcessing}
                  >
                    <Upload className="h-4 w-4" />
                    Upload Results
                  </Button>
                  <Button
                    className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
                    onClick={() => workingActions.startVoiceRecording()}
                    disabled={isProcessing || voiceRecording}
                  >
                    <Mic className="h-4 w-4" />
                    Voice Entry {voiceRecording && "ðŸŽ¤"}
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Lab Reports List */}
              <Card className="border border-green-200/60 shadow-xl bg-gradient-to-br from-white/95 to-green-50/95">
                <CardHeader className="bg-gradient-to-r from-green-100/80 to-green-200/80 border-b border-green-200/60">
                  <CardTitle className="flex items-center gap-2 text-slate-800">
                    <FileText className="h-5 w-5 text-green-600" />
                    Recent Lab Reports
                  </CardTitle>
                  <CardDescription className="text-slate-600">Completed and pending reports</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {labReports.map((report) => (
                      <div key={report.id} className={`p-4 rounded-lg border transition-all duration-300 hover:scale-[1.01] hover:shadow-md ${
                        report.status === 'Sent'
                          ? 'border-green-200/60 bg-green-50/80 hover:bg-green-100/80'
                          : 'border-green-300/60 bg-green-100/80 hover:bg-green-200/80'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="font-bold text-slate-800">{report.test}</h3>
                              <Badge variant={report.status === 'Sent' ? 'default' : 'secondary'} className={report.status === 'Sent' ? 'bg-green-100 text-green-700 border-green-300/60' : 'bg-green-200 text-green-800 border-green-400/60'}>
                                {report.status}
                              </Badge>
                            </div>
                            <p className="text-slate-600 text-sm">{report.patient} (ID: {report.patientId})</p>
                            <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                              <span>Completed: {report.completedDate}</span>
                              <span>Technician: {report.technician}</span>
                              <span>TAT: {report.turnaroundTime}</span>
                            </div>
                            <p className="text-xs text-slate-500 mt-1 italic">{report.results}</p>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-green-600 border-green-300/60 hover:bg-green-100"
                              onClick={() => workingActions.viewReportDetails(report.id)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            {report.status === 'Ready' && (
                              <Button 
                                size="sm" 
                                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                                onClick={() => workingActions.sendReport()}
                              >
                                <ArrowRight className="h-4 w-4 mr-1" />
                                Send
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button
                    className="w-full mt-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                    onClick={workingActions.generateReport}
                    disabled={isProcessing}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Report
                  </Button>
                </CardContent>
              </Card>

              {/* File Upload & Voice Entry */}
              <div className="space-y-6">
                <Card className="border border-purple-200/60 shadow-xl bg-gradient-to-br from-white/95 to-purple-50/95">
                  <CardHeader className="bg-gradient-to-r from-purple-100/80 to-violet-100/80 border-b border-purple-200/60">
                    <CardTitle className="flex items-center gap-2 text-slate-800">
                      <Upload className="h-5 w-5 text-purple-600" />
                      Upload Lab Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="p-4 bg-purple-50/80 rounded-lg border border-purple-200/60">
                      <h3 className="font-bold text-slate-800 mb-2">File Upload</h3>
                      <p className="text-sm text-slate-600 mb-3">Upload PDF reports, images, or structured data</p>
                      <div className="border-2 border-dashed border-purple-300 rounded-lg p-6 text-center">
                        <Upload className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                        <p className="text-sm text-slate-600">Click to upload or drag and drop</p>
                        <p className="text-xs text-slate-500">PDF, JPG, PNG, CSV up to 25MB</p>
                      </div>
                    </div>
                    <Button
                      className="w-full bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white"
                      onClick={workingActions.uploadResults}
                      disabled={isProcessing}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Results
                    </Button>
                    {uploadProgress > 0 && (
                      <div className="w-full bg-purple-200 rounded-full h-2 mt-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="border border-purple-200/60 shadow-xl bg-gradient-to-br from-white/95 to-purple-50/95">
                  <CardHeader className="bg-gradient-to-r from-purple-100/80 to-purple-200/80 border-b border-purple-200/60">
                    <CardTitle className="flex items-center gap-2 text-slate-800">
                      <Mic className="h-5 w-5 text-purple-600" />
                      Voice Data Entry
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="p-4 bg-purple-50/80 rounded-lg border border-purple-200/60">
                      <h3 className="font-bold text-slate-800 mb-2">MediVo AI Dictation</h3>
                      <p className="text-sm text-slate-600 mb-3">Use voice commands to enter test results directly</p>
                      <div className="flex items-center justify-center p-6 border-2 border-dashed border-purple-300 rounded-lg">
                        <div className="text-center">
                          <Mic className="h-12 w-12 text-purple-400 mx-auto mb-2" />
                          <p className="text-sm text-slate-600">Click to start voice dictation</p>
                        </div>
                      </div>
                    </div>
                    <Button
                      className={`w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white ${voiceRecording ? 'animate-pulse' : ''}`}
                      onClick={workingActions.voiceEntry}
                      disabled={isProcessing}
                    >
                      <Mic className="h-4 w-4 mr-2" />
                      {voiceRecording ? "ðŸŽ¤ Recording..." : "Start Voice Entry"}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* Patient Search Tab Content */}
        {activeTab === "patient-search" && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-white/95 to-green-50/95 backdrop-blur-sm rounded-2xl p-6 border border-green-200/60 shadow-2xl shadow-green-500/10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-slate-800">Patient Records Search</h2>
                  <p className="text-slate-600 font-medium">Search and view patient medical records and test history</p>
                </div>
                <div className="flex items-center gap-3">
                  <Button 
                    className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
                    onClick={() => workingActions.addNewPatient()}
                  >
                    <Plus className="h-4 w-4" />
                    Add New Patient
                  </Button>
                  <Button 
                    className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
                    onClick={() => workingActions.exportData("Patient Records", "CSV")}
                  >
                    <Download className="h-4 w-4" />
                    Export Records
                  </Button>
                </div>
              </div>
            </div>

            {/* Search Section */}
            <Card className="border border-green-200/60 shadow-xl bg-gradient-to-br from-white/95 to-green-50/95">
              <CardHeader className="bg-gradient-to-r from-green-100/80 to-green-200/80 border-b border-green-200/60">
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <Search className="h-5 w-5 text-green-600" />
                  Search Patient Records
                </CardTitle>
                <CardDescription className="text-slate-600">Find patients by name, ID, phone, or email</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex gap-4 mb-6">
                  <div className="flex-1">
                    <Input
                      placeholder="Search by patient name, ID, phone, or email..."
                      value={searchQuery}
                      onChange={(e) => handlePatientSearch(e.target.value)}
                      className="border-green-200 focus:border-green-400 focus:ring-green-200"
                    />
                  </div>
                  <Button 
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                    onClick={() => handlePatientSearch(searchQuery)}
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-green-200 text-green-600 hover:bg-green-50"
                    onClick={() => workingActions.exportData()}
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </div>

                {/* Search Results */}
                {searchQuery && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-slate-800">
                        Search Results ({searchResults.length} found)
                      </h3>
                      {searchResults.length > 0 && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-green-600 border-green-200"
                          onClick={() => workingActions.exportData()}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Export Results
                        </Button>
                      )}
                    </div>

                    {searchResults.length === 0 ? (
                      <div className="text-center py-8">
                        <Search className="h-12 w-12 text-green-300 mx-auto mb-3" />
                        <p className="text-slate-500">No patients found matching "{searchQuery}"</p>
                        <p className="text-sm text-slate-400 mt-1">Try searching by name, patient ID, phone, or email</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {searchResults.map((patient) => (
                          <Card key={patient.id} className="border border-green-200/60 bg-green-50/50 hover:bg-green-100/50 transition-all duration-300 hover:shadow-md">
                            <CardContent className="p-6">
                              <div className="flex items-start justify-between">
                                <div className="flex items-start gap-4">
                                  <div className="p-3 bg-green-200 rounded-xl">
                                    <User className="h-6 w-6 text-green-700" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                      <h3 className="text-lg font-bold text-slate-800">{patient.name}</h3>
                                      <Badge className="bg-green-100 text-green-700 border-green-300/60">
                                        {patient.id}
                                      </Badge>
                                      <Badge variant="outline" className="border-green-200 text-green-600">
                                        {patient.gender}, {patient.age}
                                      </Badge>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 text-sm text-slate-600 mb-3">
                                      <div>
                                        <p><strong>Phone:</strong> {patient.phone}</p>
                                        <p><strong>Email:</strong> {patient.email}</p>
                                        <p><strong>Blood Type:</strong> {patient.bloodType}</p>
                                      </div>
                                      <div>
                                        <p><strong>Last Visit:</strong> {patient.lastVisit}</p>
                                        <p><strong>Doctor:</strong> {patient.doctor}</p>
                                        <p><strong>Emergency Contact:</strong> {patient.emergencyContact}</p>
                                      </div>
                                    </div>
                                    <div className="mb-3">
                                      <p className="text-sm font-medium text-slate-700 mb-1">Recent Test History:</p>
                                      <div className="flex flex-wrap gap-2">
                                        {patient.recentTests.slice(0, 3).map((test, index) => (
                                          <Badge key={index} variant="outline" className={`text-xs ${
                                            test.status === 'Completed' ? 'border-blue-200 text-blue-600 bg-blue-50' :
                                            test.status === 'Processing' ? 'border-blue-300 text-blue-700 bg-blue-100' :
                                            'border-blue-100 text-blue-500 bg-blue-25'
                                          }`}>
                                            {test.test} - {test.status}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                    {patient.allergies.length > 0 && patient.allergies[0] !== "None known" && (
                                      <div className="p-2 bg-red-50 border border-red-200 rounded-lg">
                                        <p className="text-xs text-red-600">
                                          <strong>Allergies:</strong> {patient.allergies.join(", ")}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                  <Button
                                    size="sm"
                                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                                    onClick={() => {
                                      setSelectedPatient(patient);
                                      workingActions.viewPatientRecord(patient.id);
                                    }}
                                    disabled={isProcessing}
                                  >
                                    <Eye className="h-4 w-4 mr-1" />
                                    View Full Record
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-blue-600 border-blue-200 hover:bg-blue-50"
                                    onClick={workingActions.orderTest}
                                    disabled={isProcessing}
                                  >
                                    <TestTube className="h-4 w-4 mr-1" />
                                    Order Test
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-blue-600 border-blue-200 hover:bg-blue-50"
                                    onClick={workingActions.generateReport}
                                    disabled={isProcessing}
                                  >
                                    <FileText className="h-4 w-4 mr-1" />
                                    View Reports
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Recent Patients */}
                {!searchQuery && (
                  <div className="space-y-4">
                    <div className="mt-8">
                      <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Patients</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {patientRecords.slice(0, 4).map((patient) => (
                          <Card key={patient.id} className="border border-purple-200/60 bg-purple-50/30 hover:bg-purple-100/50 transition-all duration-300 cursor-pointer hover:shadow-md">
                            <CardContent className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-200 rounded-lg">
                                  <User className="h-5 w-5 text-purple-700" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-semibold text-slate-800">{patient.name}</h4>
                                    <Badge variant="outline" className="text-xs border-purple-200 text-purple-600">
                                      {patient.id}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-slate-600">Last visit: {patient.lastVisit}</p>
                                  <p className="text-xs text-blue-600">{patient.recentTests.length} recent tests</p>
                                </div>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="border-blue-200 text-blue-600 hover:bg-blue-50"
                                  onClick={() => {
                                    setSelectedPatient(patient);
                                    workingActions.viewPatientRecord(patient.id);
                                  }}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* MediVo AI Tab Content */}
        {activeTab === "medivo" && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-white/95 to-purple-50/95 backdrop-blur-sm rounded-2xl p-6 border border-purple-200/60 shadow-2xl shadow-purple-500/10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-slate-800">MediVo AI Laboratory Assistant</h2>
                  <p className="text-slate-600 font-medium">Voice-powered assistance for laboratory operations</p>
                </div>
                <div className="flex items-center gap-3">
                  <Button className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white shadow-md hover:shadow-lg transition-all duration-300">
                    <Mic className="h-4 w-4" />
                    Start Voice Session
                  </Button>
                  <Button 
                    className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-md hover:shadow-lg transition-all duration-300"
                    onClick={() => navigate('/ai')}
                  >
                    <Brain className="h-4 w-4" />
                    AI Templates
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Voice Commands */}
              <Card className="border border-purple-200/60 shadow-xl bg-gradient-to-br from-white/95 to-purple-50/95">
                <CardHeader className="bg-gradient-to-r from-purple-100/80 to-violet-100/80 border-b border-purple-200/60">
                  <CardTitle className="flex items-center gap-2 text-slate-800">
                    <Mic className="h-5 w-5 text-purple-600" />
                    Voice Data Entry
                  </CardTitle>
                  <CardDescription className="text-slate-600">Dictate test results and lab notes</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="p-6 bg-purple-50/80 rounded-lg border border-purple-200/60 text-center">
                    <Mic className="h-16 w-16 text-purple-400 mx-auto mb-4" />
                    <h3 className="font-bold text-slate-800 mb-2">Voice Dictation Ready</h3>
                    <p className="text-sm text-slate-600 mb-4">Click to start dictating test results</p>
                    <Button className="bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white">
                      <Mic className="h-4 w-4 mr-2" />
                      Start Dictation
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-slate-800">Sample Voice Commands:</h4>
                    <div className="space-y-1 text-sm text-slate-600">
                      <p>â€¢ "Record blood glucose level 120 mg/dL"</p>
                      <p>â€¢ "Patient hemoglobin 14.2 grams per deciliter"</p>
                      <p>â€¢ "White blood cell count 7500 per microliter"</p>
                      <p>â€¢ "Urine analysis shows no abnormalities"</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* AI Features */}
              <div className="space-y-6">
                <Card className="border border-purple-200/60 shadow-xl bg-gradient-to-br from-white/95 to-purple-50/95">
                  <CardHeader className="bg-gradient-to-r from-purple-100/80 to-purple-200/80 border-b border-purple-200/60">
                    <CardTitle className="flex items-center gap-2 text-slate-800">
                      <Brain className="h-5 w-5 text-purple-600" />
                      AI Search & Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <Button className="w-full justify-start bg-gradient-to-r from-purple-100 to-purple-200 hover:from-purple-200 hover:to-purple-300 text-purple-700 border border-purple-300/60">
                      <Search className="h-4 w-4 mr-2" />
                      Search Patient History
                    </Button>
                    <Button className="w-full justify-start bg-gradient-to-r from-purple-100 to-purple-200 hover:from-purple-200 hover:to-purple-300 text-purple-700 border border-purple-300/60">
                      <FileText className="h-4 w-4 mr-2" />
                      Find Similar Test Results
                    </Button>
                    <Button className="w-full justify-start bg-gradient-to-r from-purple-100 to-purple-200 hover:from-purple-200 hover:to-purple-300 text-purple-700 border border-purple-300/60">
                      <Clipboard className="h-4 w-4 mr-2" />
                      Generate Report Template
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border border-purple-200/60 shadow-xl bg-gradient-to-br from-white/95 to-purple-50/95">
                  <CardHeader className="bg-gradient-to-r from-purple-100/80 to-purple-200/80 border-b border-purple-200/60">
                    <CardTitle className="flex items-center gap-2 text-slate-800">
                      <Stethoscope className="h-5 w-5 text-purple-600" />
                      Medical Term Assistant
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="p-4 bg-purple-50/80 rounded-lg border border-purple-200/60">
                      <h3 className="font-bold text-slate-800 mb-2">Ask MediVo AI</h3>
                      <p className="text-sm text-slate-600 mb-3">Get explanations of medical terms and procedures</p>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Ask about medical terms..."
                          className="flex-1 p-2 border border-purple-200 rounded-lg focus:border-purple-400 focus:ring-2 focus:ring-purple-200"
                        />
                        <Button 
                          className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white"
                          onClick={() => navigate('/ai')}
                        >
                          <Brain className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* Profile & Settings Tab Content */}
        {activeTab === "profile" && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-white/95 to-green-50/95 backdrop-blur-sm rounded-2xl p-6 border border-green-200/60 shadow-2xl shadow-green-500/10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-slate-800">Laboratory Profile & Settings</h2>
                  <p className="text-slate-600 font-medium">Manage laboratory information and operational settings</p>
                </div>
                <div className="flex items-center gap-3">
                  <Button 
                    className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
                    onClick={() => workingActions.saveSettings()}
                  >
                    <Edit className="h-4 w-4" />
                    Edit Profile
                  </Button>
                  <Button 
                    className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-md hover:shadow-lg transition-all duration-300"
                    onClick={() => workingActions.exportData()}
                  >
                    <Download className="h-4 w-4" />
                    Export Settings
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Laboratory Information */}
              <Card className="border border-green-200/60 shadow-xl bg-gradient-to-br from-white/95 to-green-50/95">
                <CardHeader className="bg-gradient-to-r from-green-100/80 to-green-100/80 border-b border-green-200/60">
                  <CardTitle className="flex items-center gap-2 text-slate-800">
                    <Building2 className="h-5 w-5 text-green-600" />
                    Laboratory Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-600">Laboratory Name</label>
                    <input type="text" value="Central Medical Laboratory" className="w-full mt-1 p-2 border border-green-200 rounded-lg focus:border-green-400 focus:ring-2 focus:ring-green-200" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">License Number</label>
                    <input type="text" value="LAB-2024-001" className="w-full mt-1 p-2 border border-green-200 rounded-lg focus:border-green-400 focus:ring-2 focus:ring-green-200" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Contact Phone</label>
                    <input type="tel" value="+1 (555) 123-4567" className="w-full mt-1 p-2 border border-green-200 rounded-lg focus:border-green-400 focus:ring-2 focus:ring-green-200" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Email Address</label>
                    <input type="email" value="lab@hospital.com" className="w-full mt-1 p-2 border border-green-200 rounded-lg focus:border-green-400 focus:ring-2 focus:ring-green-200" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Address</label>
                    <textarea rows={3} value="123 Medical Center Drive, Healthcare District, City, State 12345" className="w-full mt-1 p-2 border border-green-200 rounded-lg focus:border-green-400 focus:ring-2 focus:ring-green-200"></textarea>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white">
                    Update Laboratory Info
                  </Button>
                </CardContent>
              </Card>

              {/* Operational Settings */}
              <div className="space-y-6">
                <Card className="border border-green-200/60 shadow-xl bg-gradient-to-br from-white/95 to-green-50/95">
                  <CardHeader className="bg-gradient-to-r from-green-100/80 to-green-200/80 border-b border-green-200/60">
                    <CardTitle className="flex items-center gap-2 text-slate-800">
                      <Clock className="h-5 w-5 text-green-600" />
                      Operational Hours
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div>
                      <label className="text-sm font-medium text-slate-600">Operating Hours</label>
                      <input type="text" value="Monday - Friday: 7:00 AM - 8:00 PM" className="w-full mt-1 p-2 border border-green-200 rounded-lg focus:border-green-400 focus:ring-2 focus:ring-green-200" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600">Weekend Hours</label>
                      <input type="text" value="Saturday: 8:00 AM - 4:00 PM" className="w-full mt-1 p-2 border border-green-200 rounded-lg focus:border-green-400 focus:ring-2 focus:ring-green-200" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600">Emergency Contact</label>
                      <input type="tel" value="+1 (555) 987-6543" className="w-full mt-1 p-2 border border-green-200 rounded-lg focus:border-green-400 focus:ring-2 focus:ring-green-200" />
                    </div>
                    <Button 
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                      onClick={() => workingActions.saveSettings()}
                    >
                      Save Hours
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border border-green-200/60 shadow-xl bg-gradient-to-br from-white/95 to-green-50/95">
                  <CardHeader className="bg-gradient-to-r from-green-100/80 to-green-200/80 border-b border-green-200/60">
                    <CardTitle className="flex items-center gap-2 text-slate-800">
                      <TestTube className="h-5 w-5 text-green-600" />
                      Available Tests & Pricing
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-teal-50/80 rounded-lg">
                        <span className="text-sm font-medium text-slate-800">Complete Blood Count</span>
                        <span className="text-sm text-teal-600 font-semibold">â‚¹8,500</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-teal-50/80 rounded-lg">
                        <span className="text-sm font-medium text-slate-800">Liver Function Panel</span>
                        <span className="text-sm text-teal-600 font-semibold">â‚¹12,000</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-teal-50/80 rounded-lg">
                        <span className="text-sm font-medium text-slate-800">Urine Analysis</span>
                        <span className="text-sm text-teal-600 font-semibold">â‚¹4,500</span>
                      </div>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      Manage Test Catalog
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* Help & Support Tab Content */}
        {activeTab === "help" && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-white/95 to-slate-50/95 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 shadow-2xl shadow-slate-500/10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-slate-800">Laboratory Help & Support</h2>
                  <p className="text-slate-600 font-medium">Get assistance and access support resources</p>
                </div>
                <div className="flex items-center gap-3">
                  <Button 
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
                    onClick={() => {
                      toast({
                        title: "Emergency Support Contacted",
                        description: "Emergency support team has been notified and will respond immediately.",
                      });
                    }}
                  >
                    <Phone className="h-4 w-4" />
                    Emergency Support
                  </Button>
                  <Button 
                    className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-md hover:shadow-lg transition-all duration-300"
                    onClick={() => workingActions.submitIssue()}
                  >
                    <AlertTriangle className="h-4 w-4" />
                    Report Issue
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* FAQ Section */}
              <Card className="border border-slate-200/60 shadow-xl bg-gradient-to-br from-white/95 to-slate-50/95">
                <CardHeader className="bg-gradient-to-r from-slate-100/80 to-slate-200/80 border-b border-slate-200/60">
                  <CardTitle className="flex items-center gap-2 text-slate-800">
                    <HelpCircle className="h-5 w-5 text-blue-600" />
                    Laboratory FAQs
                  </CardTitle>
                  <CardDescription className="text-slate-600">Common questions and solutions</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-3">
                    {[
                      { question: "How to upload lab results?", category: "Results Management" },
                      { question: "Managing urgent test requests", category: "Test Processing" },
                      { question: "Using MediVo AI for dictation", category: "AI Assistant" },
                      { question: "Sample collection procedures", category: "Sample Management" },
                      { question: "Billing and invoice generation", category: "Financial" },
                    ].map((faq, index) => (
                      <div key={index} className="p-3 bg-slate-50/80 rounded-lg border border-slate-200/60 hover:bg-slate-100/80 transition-all duration-300 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-slate-800 text-sm">{faq.question}</p>
                            <p className="text-xs text-blue-600">{faq.category}</p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-blue-600" />
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white">
                    <FileText className="h-4 w-4 mr-2" />
                    View All FAQs
                  </Button>
                </CardContent>
              </Card>

              {/* Contact Support */}
              <div className="space-y-6">
                <Card className="border border-slate-200/60 shadow-xl bg-gradient-to-br from-white/95 to-slate-50/95">
                  <CardHeader className="bg-gradient-to-r from-slate-100/80 to-slate-200/80 border-b border-slate-200/60">
                    <CardTitle className="flex items-center gap-2 text-slate-800">
                      <Phone className="h-5 w-5 text-blue-600" />
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="p-4 bg-red-50/80 rounded-lg border border-red-200/60">
                      <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        Emergency Lab Support
                      </h3>
                      <p className="text-sm text-slate-600 mb-2">Critical equipment failures & urgent issues</p>
                      <div className="flex items-center gap-2 text-sm text-red-600 font-medium">
                        <Phone className="h-4 w-4" />
                        <span>+1 (555) 911-LAB</span>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50/80 rounded-lg border border-slate-200/60">
                      <h3 className="font-bold text-slate-800 mb-2">Technical Support</h3>
                      <p className="text-sm text-slate-600 mb-2">System issues and software support</p>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-blue-600">
                          <Phone className="h-4 w-4" />
                          <span>+1 (555) 123-TECH</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-blue-600">
                          <Mail className="h-4 w-4" />
                          <span>lab-support@hospital.com</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50/80 rounded-lg border border-slate-200/60">
                      <h3 className="font-bold text-slate-800 mb-2">Hospital Administration</h3>
                      <p className="text-sm text-slate-600 mb-2">Administrative and operational support</p>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-blue-600">
                          <Phone className="h-4 w-4" />
                          <span>+1 (555) 123-ADMIN</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-blue-600">
                          <Building2 className="h-4 w-4" />
                          <span>Main Hospital Building, Floor 3</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-slate-200/60 shadow-xl bg-gradient-to-br from-white/95 to-slate-50/95">
                  <CardHeader className="bg-gradient-to-r from-slate-100/80 to-slate-200/80 border-b border-slate-200/60">
                    <CardTitle className="flex items-center gap-2 text-slate-800">
                      <AlertTriangle className="h-5 w-5 text-orange-600" />
                      Report Issues
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-slate-600">Issue Type</label>
                        <select className="w-full mt-1 p-2 border border-slate-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-200">
                          <option>Equipment Malfunction</option>
                          <option>Software Bug</option>
                          <option>Sample Processing Issue</option>
                          <option>System Performance</option>
                          <option>Data Sync Problem</option>
                          <option>Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-slate-600">Priority Level</label>
                        <select className="w-full mt-1 p-2 border border-slate-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-200">
                          <option>Low - Minor inconvenience</option>
                          <option>Medium - Affects workflow</option>
                          <option>High - Significant impact</option>
                          <option>Critical - Lab operations affected</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-slate-600">Description</label>
                        <textarea
                          rows={4}
                          placeholder="Please describe the issue in detail..."
                          className="w-full mt-1 p-2 border border-slate-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                        ></textarea>
                      </div>
                    </div>

                    <Button 
                      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                      onClick={() => workingActions.submitIssue()}
                    >
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Submit Issue Report
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
        </main>

        {/* File Upload Modal */}
        {labState.showFileUploadModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
              <div className="flex justify-between items-center p-6 border-b border-slate-200 bg-gradient-to-r from-green-50 to-green-100/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
                    <Upload className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">Upload Lab Results</h2>
                    <p className="text-sm text-slate-600">Upload test results and reports</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setLabState(prev => ({ ...prev, showFileUploadModal: false }))}
                  className="h-10 w-10 rounded-full hover:bg-white/80"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
                  <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600 mb-2">Drop files here or click to browse</p>
                  <p className="text-sm text-slate-500">Supports PDF, DOC, XLS, and image files</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.multiple = true;
                      input.accept = '.pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png';
                      input.onchange = (e) => {
                        const target = e.target as HTMLInputElement;
                        const files = Array.from(target.files || []);
                        if (files.length > 0) {
                          workingActions.uploadResults();
                          setLabState(prev => ({ ...prev, showFileUploadModal: false }));
                        }
                      };
                      input.click();
                    }}
                  >
                    Browse Files
                  </Button>
                </div>
                
                {labState.isUploading && (
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Patient ID</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                      placeholder="Enter patient ID"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Test Type</label>
                    <select className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm">
                      <option>Select test type</option>
                      <option>Complete Blood Count</option>
                      <option>Lipid Panel</option>
                      <option>Thyroid Panel</option>
                      <option>Liver Function</option>
                      <option>Kidney Function</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Additional Notes</label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm resize-none"
                    placeholder="Enter any additional notes about the results..."
                  ></textarea>
                </div>
                
                <div className="flex gap-3">
                  <Button
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                    onClick={() => {
                      workingActions.uploadResults();
                      setLabState(prev => ({ ...prev, showFileUploadModal: false }));
                    }}
                    disabled={labState.isUploading}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Results
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setLabState(prev => ({ ...prev, showFileUploadModal: false }))}
                    disabled={labState.isUploading}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Voice Recording Modal */}
        {labState.showVoiceRecordingModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
              <div className="flex justify-between items-center p-6 border-b border-slate-200 bg-gradient-to-r from-amber-50 to-amber-100/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-lg">
                    <Mic className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">Voice Recording</h2>
                    <p className="text-sm text-slate-600">Record voice notes for lab results</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setLabState(prev => ({ 
                    ...prev, 
                    showVoiceRecordingModal: false,
                    recordingText: ""
                  }))}
                  className="h-10 w-10 rounded-full hover:bg-white/80"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="p-6 space-y-6">
                {voiceRecording ? (
                  <div className="text-center space-y-6">
                    <div className="relative">
                      <div className="animate-pulse">
                        <div className="w-32 h-32 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                          <Mic className="h-16 w-16 text-white" />
                        </div>
                        <div className="absolute inset-0 w-32 h-32 bg-red-500/30 rounded-full mx-auto animate-ping"></div>
                      </div>
                      <p className="text-red-600 font-bold text-xl mt-6">Recording...</p>
                      <div className="flex items-center justify-center gap-2 mt-3">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce"></div>
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-slate-50 to-slate-100/50 p-6 rounded-xl border border-slate-200/60 text-left">
                      <div className="flex items-center gap-2 mb-3">
                        <FileText className="h-4 w-4 text-slate-600" />
                        <span className="text-sm font-medium text-slate-700">Live Transcription</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed min-h-[100px]">
                        {labState.recordingText}
                        <span className="animate-pulse inline-block ml-1 w-2 h-5 bg-blue-500"></span>
                      </p>
                    </div>
                    
                    <Button 
                      onClick={() => workingActions.stopVoiceRecording()}
                      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Save className="h-5 w-5 mr-2" />
                      Save Recording
                    </Button>
                  </div>
                ) : (
                  <div className="text-center space-y-6">
                    <div className="w-32 h-32 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center mx-auto shadow-lg">
                      <Mic className="h-16 w-16 text-slate-500" />
                    </div>
                    
                    <div>
                      <p className="text-slate-700 font-medium text-xl mb-3">Record Voice Notes</p>
                      <p className="text-slate-500 mb-6">Use voice dictation to add notes to lab results</p>
                      
                      <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 mb-6">
                        <p className="text-sm text-amber-800">
                          <strong>Tip:</strong> Speak clearly about test results, observations, and recommendations.
                        </p>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => workingActions.startVoiceRecording()}
                      className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Mic className="h-5 w-5 mr-3" />
                      Start Recording
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Notifications Modal */}
        {labState.showNotificationsModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="flex justify-between items-center p-6 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-blue-100/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                    <Bell className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">Laboratory Notifications</h2>
                    <p className="text-sm text-slate-600">
                      {labState.notifications.filter(n => !n.read).length} unread of {labState.notifications.length} total
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setLabState(prev => ({
                        ...prev,
                        notifications: prev.notifications.map(n => ({ ...n, read: true }))
                      }));
                      toast({ title: "All notifications marked as read" });
                    }}
                    className="text-xs"
                  >
                    Mark All Read
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setLabState(prev => ({ ...prev, showNotificationsModal: false }))}
                    className="h-10 w-10 rounded-full hover:bg-white/80"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                <div className="space-y-4">
                  {labState.notifications.map((notification) => (
                    <div 
                      key={notification.id}
                      className={`p-5 rounded-xl border transition-all hover:shadow-md cursor-pointer ${
                        !notification.read 
                          ? 'bg-blue-50 border-blue-200 hover:bg-blue-100' 
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                      }`}
                      onClick={() => {
                        setLabState(prev => ({
                          ...prev,
                          notifications: prev.notifications.map(n => 
                            n.id === notification.id ? { ...n, read: true } : n
                          )
                        }));
                      }}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-lg ${
                          notification.type === 'urgent' || notification.type === 'alert' 
                            ? 'bg-red-100 text-red-600' 
                            : notification.type === 'reminder' 
                            ? 'bg-orange-100 text-orange-600'
                            : notification.type === 'result'
                            ? 'bg-green-100 text-green-600'
                            : 'bg-blue-100 text-blue-600'
                        }`}>
                          {notification.type === 'urgent' || notification.type === 'alert' ? (
                            <AlertTriangle className="h-5 w-5" />
                          ) : notification.type === 'reminder' ? (
                            <Clock className="h-5 w-5" />
                          ) : notification.type === 'result' ? (
                            <CheckCircle className="h-5 w-5" />
                          ) : (
                            <Bell className="h-5 w-5" />
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-slate-800 mb-1">{notification.title}</h3>
                              <p className="text-sm text-slate-600 leading-relaxed">{notification.message}</p>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              <Badge 
                                variant={
                                  notification.priority === 'high' ? 'destructive' :
                                  notification.priority === 'medium' ? 'default' : 'secondary'
                                }
                                className="text-xs"
                              >
                                {notification.priority}
                              </Badge>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-xs text-slate-500">
                              <span>{notification.time}</span>
                              {notification.patient && (
                                <span>Patient: {notification.patient}</span>
                              )}
                              {notification.equipment && (
                                <span>Equipment: {notification.equipment}</span>
                              )}
                              {notification.testType && (
                                <span>Test: {notification.testType}</span>
                              )}
                              {notification.department && (
                                <span>Dept: {notification.department}</span>
                              )}
                              {notification.batchId && (
                                <span>Batch: {notification.batchId}</span>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-2">
                              {(notification.type === 'urgent' || notification.type === 'alert') && (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="text-xs h-7 px-3 border-red-200 text-red-600 hover:bg-red-50"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    workingActions.handleNotificationAction(notification);
                                  }}
                                >
                                  Take Action
                                </Button>
                              )}
                              {notification.type === 'reminder' && (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="text-xs h-7 px-3 border-orange-200 text-orange-600 hover:bg-orange-50"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    workingActions.handleNotificationAction(notification);
                                  }}
                                >
                                  Schedule
                                </Button>
                              )}
                              <Button 
                                size="sm" 
                                variant="ghost"
                                className="text-xs h-7 px-2 hover:bg-slate-200"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setLabState(prev => ({
                                    ...prev,
                                    notifications: prev.notifications.filter(n => n.id !== notification.id)
                                  }));
                                  toast({ title: "Notification dismissed" });
                                }}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {labState.notifications.length === 0 && (
                  <div className="text-center py-12">
                    <Bell className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-600 mb-2">No Notifications</h3>
                    <p className="text-slate-500">You're all caught up! No new notifications at this time.</p>
                  </div>
                )}
              </div>
              
              <div className="border-t border-slate-200 p-4 bg-slate-50">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-slate-600">
                    Last updated: {new Date().toLocaleTimeString()}
                  </div>
                  <div className="flex items-center gap-3">
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Simulate refresh
                        toast({ title: "Notifications refreshed" });
                      }}
                      className="flex items-center gap-2"
                    >
                      <RefreshCw className="h-3 w-3" />
                      Refresh
                    </Button>
                    <Button 
                      onClick={() => setLabState(prev => ({ ...prev, showNotificationsModal: false }))}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Patient Details Modal */}
      <Dialog open={labState.showPatientModal} onOpenChange={(open) => 
        setLabState(prev => ({ ...prev, showPatientModal: open }))
      }>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="flex items-center gap-3 text-2xl font-bold text-slate-800">
              <div className="p-2 bg-green-100 rounded-lg">
                <User className="h-6 w-6 text-green-600" />
              </div>
              Patient & Test Request Details
            </DialogTitle>
            <DialogDescription className="text-slate-600 text-base">
              Complete information about the patient and requested laboratory test
            </DialogDescription>
          </DialogHeader>
          
          {labState.selectedTestRequest && (
            <div className="space-y-6 py-6">
              
              {/* Main Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Patient Information Card */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-blue-600 rounded-lg">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-blue-800">Patient Information</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-blue-700 font-medium">Name:</span>
                      <span className="font-bold text-slate-800">{labState.selectedTestRequest.patient}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-700 font-medium">Patient ID:</span>
                      <span className="font-bold text-slate-800">{labState.selectedTestRequest.patientId || 'Not Assigned'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-700 font-medium">Status:</span>
                      <Badge variant="outline" className="bg-white">
                        {labState.selectedTestRequest.status || 'Pending'}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Test Request Card */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-green-600 rounded-lg">
                      <TestTube className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-green-800">Test Request</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-green-700 font-medium">Test Type:</span>
                      <span className="font-bold text-slate-800">{labState.selectedTestRequest.test}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-green-700 font-medium">Urgency:</span>
                      <Badge variant={
                        labState.selectedTestRequest.urgency === 'Urgent' ? 'destructive' : 
                        labState.selectedTestRequest.urgency === 'High' ? 'default' : 'secondary'
                      } className="font-semibold">
                        {labState.selectedTestRequest.urgency}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-green-700 font-medium">Request ID:</span>
                      <span className="font-bold text-slate-800 font-mono text-sm bg-white px-2 py-1 rounded">
                        {labState.selectedTestRequest.id}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Doctor Information */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-purple-600 rounded-lg">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-purple-800">Requesting Doctor</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex justify-between items-center">
                    <span className="text-purple-700 font-medium">Doctor:</span>
                    <span className="font-bold text-slate-800">Dr. {labState.selectedTestRequest.doctor}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-purple-700 font-medium">Request Date:</span>
                    <span className="font-bold text-slate-800">{labState.selectedTestRequest.requestDate}</span>
                  </div>
                </div>
              </div>

              {/* Sample Information */}
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-orange-600 rounded-lg">
                    <FlaskConical className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-orange-800">Sample & Instructions</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-orange-700 font-medium block mb-1">Sample Type:</span>
                    <span className="font-bold text-slate-800">
                      {labState.selectedTestRequest.sampleType || 
                       (labState.selectedTestRequest.test.includes("Urine") ? "Urine Sample" : "Blood Sample")}
                    </span>
                  </div>
                  <div>
                    <span className="text-orange-700 font-medium block mb-1">Instructions:</span>
                    <span className="font-bold text-slate-800">
                      {labState.selectedTestRequest.instructions || "Standard laboratory procedures"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6 border-t">
                <Button
                  onClick={() => {
                    workingActions.acceptTestRequest(labState.selectedTestRequest.id);
                    setLabState(prev => ({ ...prev, showPatientModal: false }));
                  }}
                  className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all"
                >
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Accept Test Request
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setLabState(prev => ({ ...prev, showPatientModal: false }))}
                  className="flex-1 border-2 border-slate-300 hover:border-slate-400 font-semibold py-3"
                >
                  <User className="h-5 w-5 mr-2" />
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Sample Collection Details Modal */}
      <Dialog open={labState.showSampleCollectionModal} onOpenChange={(open) => 
        setLabState(prev => ({ ...prev, showSampleCollectionModal: open }))
      }>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white to-green-50 border border-green-200">
          <DialogHeader className="pb-6 border-b border-green-200">
            <DialogTitle className="text-2xl font-bold text-green-800 flex items-center gap-2">
              <FlaskConical className="h-6 w-6" />
              {(labState.selectedSample?.patient === "New Patient" || labState.selectedSample?.patient === "Walk-in Patient") 
                ? (labState.selectedSample?.patient === "Walk-in Patient" ? "Walk-in Patient Registration" : "Create New Sample Collection")
                : "Sample Collection Details"}
            </DialogTitle>
            {(labState.selectedSample?.patient === "New Patient" || labState.selectedSample?.patient === "Walk-in Patient") && (
              <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-amber-800 text-sm font-medium flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  {labState.selectedSample?.patient === "Walk-in Patient" 
                    ? "Walk-in patient - Please collect patient details and test requirements"
                    : "Please update the patient information and sample details below"}
                </p>
              </div>
            )}
          </DialogHeader>
          
          {labState.selectedSample && (
            <div className="space-y-6">
              {/* Sample Overview */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-green-600 rounded-lg">
                    <TestTube className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-green-800">Sample Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="flex justify-between items-center">
                    <span className="text-green-700 font-medium">Sample ID:</span>
                    <span className="font-bold text-slate-800">{labState.selectedSample.id}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-green-700 font-medium">Patient:</span>
                    <span className="font-bold text-slate-800">{labState.selectedSample.patient}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-green-700 font-medium">Test Type:</span>
                    <span className="font-bold text-slate-800">{labState.selectedSample.test}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-green-700 font-medium">Status:</span>
                    <Badge variant={labState.selectedSample.status === 'Collected' ? 'default' : 'secondary'}>
                      {labState.selectedSample.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-green-700 font-medium">Collection Date:</span>
                    <span className="font-bold text-slate-800">{labState.selectedSample.collectionDate}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-green-700 font-medium">Technician:</span>
                    <span className="font-bold text-slate-800">{labState.selectedSample.technician}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6 border-t">
                {(labState.selectedSample?.patient === "New Patient" || labState.selectedSample?.patient === "Walk-in Patient") ? (
                  <>
                    <Button
                      onClick={() => {
                        // For now, just close the modal and let user edit from the main list
                        setLabState(prev => ({ ...prev, showSampleCollectionModal: false }));
                        toast({
                          title: labState.selectedSample?.patient === "Walk-in Patient" ? "Walk-in Patient Registered" : "Collection Created",
                          description: labState.selectedSample?.patient === "Walk-in Patient" 
                            ? "Walk-in patient registered. Please collect patient details and proceed with sample collection."
                            : "New sample collection created. You can edit details from the main list.",
                        });
                      }}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all"
                    >
                      <Save className="h-5 w-5 mr-2" />
                      {labState.selectedSample?.patient === "Walk-in Patient" ? "Register Patient" : "Save New Collection"}
                    </Button>
                  </>
                ) : labState.selectedSample?.status === 'Pending Collection' ? (
                  <>
                    <Button
                      onClick={() => {
                        workingActions.markSampleCollected(labState.selectedSample.id);
                        setLabState(prev => ({ ...prev, showSampleCollectionModal: false }));
                      }}
                      className="flex-1 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all"
                    >
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Mark as Collected
                    </Button>
                  </>
                ) : labState.selectedSample?.status === 'Collected' ? (
                  <>
                    <Button
                      onClick={() => {
                        workingActions.processSample(labState.selectedSample.id);
                        setLabState(prev => ({ ...prev, showSampleCollectionModal: false }));
                      }}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all"
                    >
                      <Microscope className="h-5 w-5 mr-2" />
                      Start Processing
                    </Button>
                  </>
                ) : labState.selectedSample?.status === 'Processing' ? (
                  <>
                    <Button
                      onClick={() => {
                        setActiveTab("reports");
                        setLabState(prev => ({ ...prev, showSampleCollectionModal: false }));
                      }}
                      className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all"
                    >
                      <FileText className="h-5 w-5 mr-2" />
                      View Lab Reports
                    </Button>
                  </>
                ) : (
                  <div className="flex-1"></div>
                )}
                
                <Button
                  variant="outline"
                  onClick={() => setLabState(prev => ({ ...prev, showSampleCollectionModal: false }))}
                  className="flex-1 border-2 border-slate-300 hover:border-slate-400 font-semibold py-3"
                >
                  <X className="h-5 w-5 mr-2" />
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Lab Results Details Modal */}
      <Dialog open={labState.showResultsModal} onOpenChange={(open) => 
        setLabState(prev => ({ ...prev, showResultsModal: open }))
      }>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white to-blue-50 border border-blue-200">
          <DialogHeader className="pb-6 border-b border-blue-200">
            <DialogTitle className="text-2xl font-bold text-blue-800 flex items-center gap-2">
              <FileText className="h-6 w-6" />
              Laboratory Results Details
            </DialogTitle>
          </DialogHeader>
          
          {labState.selectedReport && (
            <div className="space-y-6">
              {/* Report Overview */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-blue-600 rounded-lg">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-blue-800">Report Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-700 font-medium">Report ID:</span>
                    <span className="font-bold text-slate-800">{labState.selectedReport.id}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-700 font-medium">Patient:</span>
                    <span className="font-bold text-slate-800">{labState.selectedReport.patient}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-700 font-medium">Test:</span>
                    <span className="font-bold text-slate-800">{labState.selectedReport.test}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-700 font-medium">Status:</span>
                    <Badge variant={labState.selectedReport.status === 'Sent' ? 'default' : 'secondary'}>
                      {labState.selectedReport.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-700 font-medium">Completed:</span>
                    <span className="font-bold text-slate-800">{labState.selectedReport.completedDate}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-700 font-medium">Technician:</span>
                    <span className="font-bold text-slate-800">{labState.selectedReport.technician}</span>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-white rounded-lg border border-blue-200">
                  <span className="text-blue-700 font-medium block mb-2">Results:</span>
                  <p className="text-slate-800 font-medium">{labState.selectedReport.results}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6 border-t">
                <Button
                  onClick={() => {
                    workingActions.sendReport();
                    setLabState(prev => ({ ...prev, showResultsModal: false }));
                  }}
                  className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all"
                >
                  <Send className="h-5 w-5 mr-2" />
                  Send Report
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setLabState(prev => ({ ...prev, showResultsModal: false }))}
                  className="flex-1 border-2 border-slate-300 hover:border-slate-400 font-semibold py-3"
                >
                  <X className="h-5 w-5 mr-2" />
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LaboratoryDashboard;
