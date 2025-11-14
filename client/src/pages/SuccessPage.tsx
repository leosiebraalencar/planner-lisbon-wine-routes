import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Download, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";

export default function SuccessPage() {
  const [, setLocation] = useLocation();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const session = params.get('session_id');
    setSessionId(session);
  }, []);

  const handleDownloadPDF = async () => {
    if (!sessionId) return;

    setIsDownloading(true);
    try {
      const response = await fetch(`/api/download-pdf/${sessionId}`);
      
      if (!response.ok) {
        const error = await response.json();
        console.error('Download error:', error);
        toast({
          title: "Download Error",
          description: error.error || 'Failed to download PDF. Please try again.',
          variant: "destructive",
        });
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'lisbon-wine-routes-itinerary.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Success",
        description: "Your itinerary has been downloaded successfully!",
      });
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast({
        title: "Download Error",
        description: 'Failed to download PDF. Please try again.',
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="py-12 px-4">
        <div className="w-full max-w-2xl mx-auto">
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="w-16 h-16 text-primary" />
              </div>
              <CardTitle className="font-serif text-3xl">
                {t('success.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-center text-muted-foreground">
                {t('success.message')}
              </p>
              
              <div className="flex flex-col gap-3">
                <Button 
                  size="lg" 
                  onClick={handleDownloadPDF}
                  disabled={!sessionId || isDownloading}
                  className="w-full"
                  data-testid="button-download-pdf"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {isDownloading ? t('success.downloading') : t('success.downloadButton')}
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => setLocation('/')}
                  className="w-full"
                  data-testid="button-back-home"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t('success.backHome')}
                </Button>
              </div>

              <div className="pt-6 border-t">
                <p className="text-sm text-muted-foreground text-center mb-2">
                  {t('success.supportText')}
                </p>
                <p className="text-center">
                  <a 
                    href="mailto:contacto@lisbonwineroutes.com" 
                    className="text-primary font-medium hover:underline"
                    data-testid="link-contact-email"
                  >
                    contacto@lisbonwineroutes.com
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}
