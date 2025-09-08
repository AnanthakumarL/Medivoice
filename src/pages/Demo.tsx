import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { demoDoctors, demoPatients, demoLabs } from "@/lib/demo-data";
import { Stethoscope, Users, TestTube, ArrowRight } from "lucide-react";

const Demo = () => {
  const navigate = useNavigate();

  const bookWithDoctor = (id: string) => {
    const doc = demoDoctors.find(d => d.id === id);
    if (!doc) return;
    // Reuse DoctorSelection -> AppointmentBooking flow
    navigate("/appointment-booking", { state: { selectedDoctor: doc } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50/30 to-green-100/20 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Demo Center</h1>
            <p className="text-slate-600">Explore the app using preloaded demo doctors, patients, and labs.</p>
          </div>
          <Button onClick={() => navigate("/dashboard")} variant="outline">Go to Patient Dashboard</Button>
        </div>

        {/* Doctors */}
        <Card className="border border-green-200/60 shadow-xl bg-gradient-to-br from-white/95 to-green-50/95">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Stethoscope className="h-5 w-5 text-green-600"/> Doctors</CardTitle>
            <CardDescription>Click Book to jump into the booking flow with demo data.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {demoDoctors.map(doc => (
              <Card key={doc.id} className="border-green-200/60">
                <CardHeader>
                  <CardTitle className="text-lg">{doc.name}</CardTitle>
                  <CardDescription>{doc.hospital}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Badge className="bg-green-100 text-green-700 border-green-200">{doc.specialty}</Badge>
                  <div className="text-sm text-slate-600">Fee: {doc.consultationFee}</div>
                  <div className="text-sm text-slate-600">Rating: {doc.rating}</div>
                  <Button onClick={() => bookWithDoctor(doc.id)} className="w-full mt-2">
                    Book <ArrowRight className="h-4 w-4 ml-2"/>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>

        {/* Patients */}
        <Card className="border border-green-200/60 shadow-xl bg-gradient-to-br from-white/95 to-green-50/95">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5 text-green-600"/> Patients</CardTitle>
            <CardDescription>Demo patients you can reference in dashboards.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {demoPatients.map(p => (
              <Card key={p.id} className="border-green-200/60">
                <CardHeader>
                  <CardTitle className="text-lg">{p.name}</CardTitle>
                  <CardDescription>{p.id}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-slate-600">
                  <div>Age: {p.age} • {p.gender}</div>
                  <div>Condition: {p.condition}</div>
                  <div>Last Visit: {p.lastVisit}</div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>

        {/* Laboratories */}
        <Card className="border border-green-200/60 shadow-xl bg-gradient-to-br from-white/95 to-green-50/95">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><TestTube className="h-5 w-5 text-green-600"/> Laboratories</CardTitle>
            <CardDescription>Reference labs for lab dashboards and results.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {demoLabs.map(l => (
              <Card key={l.id} className="border-green-200/60">
                <CardHeader>
                  <CardTitle className="text-lg">{l.name}</CardTitle>
                  <CardDescription>{l.department}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-slate-600">
                  <div>Contact: {l.contact}</div>
                  <div>Email: {l.email}</div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Demo;