import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Terms = () => {
  return (
    <div className="min-h-screen p-6 bg-background">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Terms of Service</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>These terms govern your use of the MediVoice application. This is placeholder content.</p>
            <p>By using the app, you agree to comply with applicable laws and respect patient privacy.</p>
            <p>We may update these terms. Continued use constitutes acceptance of the updated terms.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Terms;