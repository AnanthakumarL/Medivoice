import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Download,
  FileText,
  TestTube,
  Heart,
  Activity,
  Pill,
  Calendar,
  User,
  Building2,
  Phone,
  Mail,
  MapPin,
  Clock,
  Share2,
  Printer
} from "lucide-react";

interface MedicalRecord {
  id: string;
  type: string;
  title: string;
  description: string;
  doctor: string;
  specialty: string;
  hospital?: string;
  date: string;
  results?: any;
  findings?: string;
  impression?: string;
  medications?: any[];
  notes?: string;
}

const ViewMedicalRecord = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [record, setRecord] = useState<MedicalRecord | null>(null);

  useEffect(() => {
    // Get record data from location state or fetch from API
    if (location.state?.record) {
      setRecord(location.state.record);
    } else {
      // If no record in state, redirect back
      navigate("/dashboard");
    }
  }, [location, navigate]);

  if (!record) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center">
        <p className="text-slate-600">Loading medical record...</p>
      </div>
    );
  }

  const getIconByType = () => {
    switch (record.type) {
      case 'blood-test':
        return <TestTube className="h-8 w-8 text-red-600" />;
      case 'prescription':
        return <Pill className="h-8 w-8 text-purple-600" />;
      case 'imaging':
        return <Activity className="h-8 w-8 text-blue-600" />;
      case 'ecg':
        return <Heart className="h-8 w-8 text-green-600" />;
      case 'consultation':
        return <FileText className="h-8 w-8 text-yellow-600" />;
      default:
        return <FileText className="h-8 w-8 text-slate-600" />;
    }
  };

  const getColorByType = () => {
    switch (record.type) {
      case 'blood-test':
        return 'red';
      case 'prescription':
        return 'purple';
      case 'imaging':
        return 'blue';
      case 'ecg':
        return 'green';
      case 'consultation':
        return 'yellow';
      default:
        return 'slate';
    }
  };

  const color = getColorByType();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-green-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/dashboard", { state: { activeTab: "records" } })}
                className="border-green-200 hover:bg-green-50"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Records
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Medical Record Details</h1>
                <p className="text-sm text-slate-600">View complete record information</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="border-blue-200 hover:bg-blue-50">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm" className="border-slate-200 hover:bg-slate-50">
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-6">
          {/* Record Header Card */}
          <Card className={`border border-${color}-200/60 shadow-2xl bg-white`}>
            <CardContent className="p-8">
              <div className="flex items-start gap-6">
                <div className={`p-4 bg-${color}-100 rounded-2xl`}>
                  {getIconByType()}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-3xl font-bold text-slate-800 mb-2">{record.title}</h2>
                      <p className="text-lg text-slate-600">{record.description}</p>
                    </div>
                    <Badge className={`bg-${color}-100 text-${color}-700 text-sm px-4 py-1`}>
                      {record.type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <User className="h-5 w-5 text-slate-400" />
                      <div>
                        <p className="text-xs text-slate-500">Doctor</p>
                        <p className="text-sm font-semibold text-slate-800">{record.doctor}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <Building2 className="h-5 w-5 text-slate-400" />
                      <div>
                        <p className="text-xs text-slate-500">Specialty</p>
                        <p className="text-sm font-semibold text-slate-800">{record.specialty}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <Calendar className="h-5 w-5 text-slate-400" />
                      <div>
                        <p className="text-xs text-slate-500">Date</p>
                        <p className="text-sm font-semibold text-slate-800">{record.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <Clock className="h-5 w-5 text-slate-400" />
                      <div>
                        <p className="text-xs text-slate-500">Status</p>
                        <p className="text-sm font-semibold text-green-700">Completed</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Section - For Blood Tests */}
          {record.results && (
            <Card className="border border-slate-200 shadow-xl bg-white">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold text-slate-800 mb-6">Test Results</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {Object.entries(record.results).map(([key, value]: [string, any]) => (
                    <div key={key} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <p className="text-sm text-slate-500 mb-2">{key}</p>
                      <p className="text-2xl font-bold text-slate-800 mb-2">{value.value}</p>
                      <Badge className={`${value.status === 'Normal' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {value.status}
                      </Badge>
                      {value.range && (
                        <p className="text-xs text-slate-500 mt-2">Normal Range: {value.range}</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Findings Section - For Imaging */}
          {record.findings && (
            <Card className="border border-slate-200 shadow-xl bg-white">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold text-slate-800 mb-4">Findings</h3>
                <div className={`p-6 bg-${color}-50 rounded-lg`}>
                  <p className="text-slate-700 leading-relaxed">{record.findings}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Impression Section */}
          {record.impression && (
            <Card className="border border-slate-200 shadow-xl bg-white">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold text-slate-800 mb-4">Impression</h3>
                <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-slate-700 leading-relaxed font-medium">{record.impression}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Medications Section - For Prescriptions */}
          {record.medications && record.medications.length > 0 && (
            <Card className="border border-slate-200 shadow-xl bg-white">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold text-slate-800 mb-6">Prescribed Medications</h3>
                <div className="space-y-4">
                  {record.medications.map((med: any, index: number) => (
                    <div key={index} className="p-5 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-lg font-semibold text-slate-800 mb-1">{med.name}</h4>
                          <p className="text-sm text-slate-600 mb-3">{med.dosage}</p>
                          <div className="flex gap-4 text-sm text-slate-700">
                            <span>📅 Duration: {med.duration}</span>
                            <span>🕐 {med.timing}</span>
                          </div>
                        </div>
                        <Badge className="bg-purple-100 text-purple-700">
                          {med.frequency}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notes Section */}
          {record.notes && (
            <Card className="border border-slate-200 shadow-xl bg-white">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold text-slate-800 mb-4">Additional Notes</h3>
                <div className="p-6 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-slate-700 leading-relaxed">{record.notes}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Hospital Information */}
          {record.hospital && (
            <Card className="border border-slate-200 shadow-xl bg-white">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold text-slate-800 mb-6">Hospital Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                    <Building2 className="h-6 w-6 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-500">Hospital Name</p>
                      <p className="text-sm font-semibold text-slate-800">{record.hospital}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                    <Phone className="h-6 w-6 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-500">Contact</p>
                      <p className="text-sm font-semibold text-slate-800">+91 44 2829 3333</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                    <Mail className="h-6 w-6 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-500">Email</p>
                      <p className="text-sm font-semibold text-slate-800">info@hospital.com</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default ViewMedicalRecord;
