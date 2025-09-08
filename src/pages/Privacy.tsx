import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Privacy = () => {
  return (
    <div className="min-h-screen p-6 bg-background">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>This policy explains how MediVoice handles your data. This is placeholder content.</p>
            <p>We only collect information necessary to provide our services and protect your privacy.</p>
            <p>You may request access or deletion of your data as permitted by law.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Privacy;