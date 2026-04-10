import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Download, 
  FileText as Print, 
  Share2, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  Stethoscope, 
  Pill, 
  Activity, 
  Heart, 
  Thermometer, 
  Weight,
  FileText,
  Clock,
  User,
  Building2,
  AlertTriangle,
  CheckCircle2,
  Eye,
  Brain,
  TestTube,
  Receipt,
  Zap
} from "lucide-react";

interface TreatmentReportData {
  id: number;
  doctor: string;
  specialty: string;
  date: string;
  summary: string;
  hospital: string;
  cost: string;
  diagnosis: string;
  symptoms: string[];
  treatment: string[];
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
  }>;
  vitals: {
    bloodPressure: string;
    heartRate: string;
    temperature: string;
    weight: string;
    height: string;
  };
  labResults: Array<{
    test: string;
    result: string;
    normalRange: string;
    status: "normal" | "abnormal" | "critical";
  }>;
  followUp: string;
  notes: string;
  attachments: Array<{
    name: string;
    type: string;
    size: string;
  }>;
}

const TreatmentReport = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Sample treatment report data - in real app, this would come from props or API
  const [treatmentReport] = useState<TreatmentReportData>({
    id: 1,
    doctor: "Dr. Sarah Johnson",
    specialty: "Cardiology",
    date: "January 15, 2024",
    summary: "Routine cardiac checkup - All parameters normal",
    hospital: "City Medical Center",
    cost: "₹15,000",
    diagnosis: "Normal cardiac function, no significant abnormalities detected",
    symptoms: [
      "Patient reported occasional mild chest discomfort during exercise",
      "No shortness of breath or palpitations",
      "No family history of cardiac disease"
    ],
    treatment: [
      "Comprehensive cardiac examination performed",
      "ECG and echocardiogram conducted",
      "Blood pressure monitoring over 24 hours",
      "Lifestyle modification recommendations provided"
    ],
    medications: [
      {
        name: "Aspirin",
        dosage: "81mg",
        frequency: "Once daily",
        duration: "Long-term",
        instructions: "Take with food to prevent stomach upset"
      },
      {
        name: "Vitamin D3",
        dosage: "1000 IU",
        frequency: "Once daily",
        duration: "3 months",
        instructions: "Take in the morning with breakfast"
      }
    ],
    vitals: {
      bloodPressure: "120/80 mmHg",
      heartRate: "72 bpm",
      temperature: "98.6°F",
      weight: "165 lbs",
      height: "5'10\""
    },
    labResults: [
      {
        test: "Complete Blood Count",
        result: "Normal",
        normalRange: "4.5-11.0 x10³/μL",
        status: "normal"
      },
      {
        test: "Lipid Panel",
        result: "Total Cholesterol: 180 mg/dL",
        normalRange: "<200 mg/dL",
        status: "normal"
      },
      {
        test: "Troponin I",
        result: "<0.01 ng/mL",
        normalRange: "<0.04 ng/mL",
        status: "normal"
      }
    ],
    followUp: "Follow-up appointment scheduled for April 15, 2024",
    notes: "Patient shows excellent cardiac health. Continue current exercise routine and maintain healthy diet. Schedule annual checkup for next year.",
    attachments: [
      { name: "ECG_Report.pdf", type: "PDF", size: "2.3 MB" },
      { name: "Echocardiogram_Images.zip", type: "ZIP", size: "15.7 MB" },
      { name: "Blood_Test_Results.pdf", type: "PDF", size: "1.8 MB" }
    ]
  });

  const handleBack = () => {
    navigate(-1);
  };

  const handleDownload = () => {
    // In real app, this would trigger PDF download
    console.log("Downloading treatment report...");
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    // In real app, this would open share dialog
    console.log("Sharing treatment report...");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal":
        return "bg-green-100 text-green-700 border-green-200";
      case "abnormal":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "critical":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50/30 to-green-100/20">
      {/* Header */}
      <div className="bg-white border-b border-green-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBack}
                className="hover:bg-green-100"
              >
                <ArrowLeft className="h-5 w-5 text-green-600" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Treatment Report</h1>
                <p className="text-slate-600">Detailed medical consultation summary</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handleDownload}
                className="border-green-200 text-green-700 hover:bg-green-50"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button
                variant="outline"
                onClick={handlePrint}
                className="border-green-200 text-green-700 hover:bg-green-50"
              >
                <Print className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button
                variant="outline"
                onClick={handleShare}
                className="border-green-200 text-green-700 hover:bg-green-50"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Report Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Report Header */}
            <Card className="border border-green-200/60 shadow-xl bg-gradient-to-br from-white/95 to-green-50/95">
              <CardHeader className="bg-gradient-to-r from-green-100/80 to-green-50/80 border-b border-green-200/60">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl text-slate-800">Cardiac Consultation Report</CardTitle>
                    <CardDescription className="text-slate-600">
                      {treatmentReport.date} • {treatmentReport.hospital}
                    </CardDescription>
                  </div>
                  <Badge className="bg-green-100 text-green-700 border-green-200 text-sm px-3 py-1">
                    Completed
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-slate-800 mb-2">Primary Diagnosis</h3>
                      <p className="text-slate-700 bg-green-50 p-3 rounded-lg border border-green-200">
                        {treatmentReport.diagnosis}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-slate-800 mb-2">Treatment Summary</h3>
                      <div className="space-y-2">
                        {treatmentReport.treatment.map((item, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-slate-700 text-sm">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-slate-800 mb-2">Symptoms Reported</h3>
                      <div className="space-y-2">
                        {treatmentReport.symptoms.map((symptom, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                            <span className="text-slate-700 text-sm">{symptom}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-slate-800 mb-2">Follow-up Plan</h3>
                      <p className="text-slate-700 bg-blue-50 p-3 rounded-lg border border-blue-200">
                        {treatmentReport.followUp}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Vital Signs */}
            <Card className="border border-green-200/60 shadow-xl bg-gradient-to-br from-white/95 to-green-50/95">
              <CardHeader className="bg-gradient-to-r from-green-100/80 to-green-50/80 border-b border-green-200/60">
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <Activity className="h-5 w-5 text-green-600" />
                  Vital Signs
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                    <Heart className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-slate-600">Blood Pressure</p>
                    <p className="text-lg font-bold text-slate-800">{treatmentReport.vitals.bloodPressure}</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <Activity className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-slate-600">Heart Rate</p>
                    <p className="text-lg font-bold text-slate-800">{treatmentReport.vitals.heartRate}</p>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <Thermometer className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-slate-600">Temperature</p>
                    <p className="text-lg font-bold text-slate-800">{treatmentReport.vitals.temperature}</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <Weight className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-slate-600">Weight</p>
                    <p className="text-lg font-bold text-slate-800">{treatmentReport.vitals.weight}</p>
                  </div>
                  <div className="text-center p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                    <User className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-slate-600">Height</p>
                    <p className="text-lg font-bold text-slate-800">{treatmentReport.vitals.height}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lab Results */}
            <Card className="border border-green-200/60 shadow-xl bg-gradient-to-br from-white/95 to-green-50/95">
              <CardHeader className="bg-gradient-to-r from-green-100/80 to-green-50/80 border-b border-green-200/60">
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <TestTube className="h-5 w-5 text-green-600" />
                  Laboratory Results
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {treatmentReport.labResults.map((result, index) => (
                    <div key={index} className="p-4 bg-white rounded-lg border border-green-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-slate-800">{result.test}</h4>
                          <p className="text-sm text-slate-600">Result: {result.result}</p>
                          <p className="text-xs text-slate-500">Normal Range: {result.normalRange}</p>
                        </div>
                        <Badge className={getStatusColor(result.status)}>
                          {result.status.charAt(0).toUpperCase() + result.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Medications */}
            <Card className="border border-green-200/60 shadow-xl bg-gradient-to-br from-white/95 to-green-50/95">
              <CardHeader className="bg-gradient-to-r from-green-100/80 to-green-50/80 border-b border-green-200/60">
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <Pill className="h-5 w-5 text-green-600" />
                  Prescribed Medications
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {treatmentReport.medications.map((med, index) => (
                    <div key={index} className="p-4 bg-white rounded-lg border border-green-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-800">{med.name}</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2 text-sm">
                            <div>
                              <span className="text-slate-600">Dosage:</span>
                              <p className="font-medium text-slate-800">{med.dosage}</p>
                            </div>
                            <div>
                              <span className="text-slate-600">Frequency:</span>
                              <p className="font-medium text-slate-800">{med.frequency}</p>
                            </div>
                            <div>
                              <span className="text-slate-600">Duration:</span>
                              <p className="font-medium text-slate-800">{med.duration}</p>
                            </div>
                            <div>
                              <span className="text-slate-600">Instructions:</span>
                              <p className="font-medium text-slate-800">{med.instructions}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Attachments */}
            <Card className="border border-green-200/60 shadow-xl bg-gradient-to-br from-white/95 to-green-50/95">
              <CardHeader className="bg-gradient-to-r from-green-100/80 to-green-50/80 border-b border-green-200/60">
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <FileText className="h-5 w-5 text-green-600" />
                  Attachments & Reports
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {treatmentReport.attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-green-200">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <FileText className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">{file.name}</p>
                          <p className="text-sm text-slate-600">{file.type} • {file.size}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="border-green-200 text-green-700 hover:bg-green-50">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Clinical Notes */}
            <Card className="border border-green-200/60 shadow-xl bg-gradient-to-br from-white/95 to-green-50/95">
              <CardHeader className="bg-gradient-to-r from-green-100/80 to-green-50/80 border-b border-green-200/60">
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <Brain className="h-5 w-5 text-green-600" />
                  Clinical Notes
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-slate-700 leading-relaxed">{treatmentReport.notes}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Doctor Information */}
            <Card className="border border-green-200/60 shadow-xl bg-gradient-to-br from-white/95 to-green-50/95">
              <CardHeader className="bg-gradient-to-r from-green-100/80 to-green-50/80 border-b border-green-200/60">
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <Stethoscope className="h-5 w-5 text-green-600" />
                  Treating Physician
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <Avatar className="h-20 w-20 mx-auto ring-4 ring-green-400/40">
                    <AvatarImage src="/placeholder.svg" alt="Doctor" />
                    <AvatarFallback className="bg-gradient-to-br from-green-500 to-green-600 text-white font-bold text-2xl">
                      SJ
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-lg font-bold text-slate-800 mt-3">{treatmentReport.doctor}</h3>
                  <Badge className="bg-green-100 text-green-700 border-green-200 mt-1">
                    {treatmentReport.specialty}
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Building2 className="h-4 w-4 text-green-600" />
                    <span>{treatmentReport.hospital}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar className="h-4 w-4 text-green-600" />
                    <span>Consultation: {treatmentReport.date}</span>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-3">
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                    <Phone className="h-4 w-4 mr-2" />
                    Contact Doctor
                  </Button>
                  <Button variant="outline" className="w-full border-green-200 text-green-700 hover:bg-green-50">
                    <Calendar className="h-4 w-4 mr-2" />
                    Book Follow-up
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Cost Information */}
            <Card className="border border-green-200/60 shadow-xl bg-gradient-to-br from-white/95 to-green-50/95">
              <CardHeader className="bg-gradient-to-r from-green-100/80 to-green-50/80 border-b border-green-200/60">
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <Receipt className="h-5 w-5 text-green-600" />
                  Cost Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Consultation Fee</span>
                    <span className="font-semibold text-slate-800">$120</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Diagnostic Tests</span>
                    <span className="font-semibold text-slate-800">$30</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span className="text-slate-800">Total</span>
                    <span className="text-green-600">{treatmentReport.cost}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border border-green-200/60 shadow-xl bg-gradient-to-br from-white/95 to-green-50/95">
              <CardHeader className="bg-gradient-to-r from-green-100/80 to-green-50/80 border-b border-green-200/60">
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <Zap className="h-5 w-5 text-green-600" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start border-green-200 text-green-700 hover:bg-green-50">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Follow-up
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-green-200 text-green-700 hover:bg-green-50">
                    <Pill className="h-4 w-4 mr-2" />
                    Refill Prescription
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-green-200 text-green-700 hover:bg-green-50">
                    <TestTube className="h-4 w-4 mr-2" />
                    Order Lab Tests
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-green-200 text-green-700 hover:bg-green-50">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreatmentReport;
