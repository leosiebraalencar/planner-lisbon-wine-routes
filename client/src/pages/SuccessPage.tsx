import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProUpsellBanner from "@/components/ProUpsellBanner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Download, ArrowLeft, Heart, Share2 } from "lucide-react";
import { SiFacebook, SiX, SiLinkedin, SiWhatsapp } from "react-icons/si";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";

const DONATION_URL = import.meta.env.VITE_STRIPE_DONATION_URL || 'https://buy.stripe.com/donation';

export default function SuccessPage() {
  const [, setLocation] = useLocation();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [hasDownloaded, setHasDownloaded] = useState(false);

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
      
      setHasDownloaded(true);
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

  const handleDonation = (amount: number) => {
    window.open(`${DONATION_URL}?amount=${amount * 100}`, '_blank');
  };

  const shareUrl = 'https://guides.lisbonwineroutes.com';
  const shareText = t('success.shareText');

  const shareLinks = {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="py-12 px-4">
        <div className="w-full max-w-2xl mx-auto space-y-6">
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
            </CardContent>
          </Card>

          {(hasDownloaded || true) && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Heart className="w-5 h-5 text-red-500" />
                    {t('success.donateTitle')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {t('success.thankYou')}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => handleDonation(1)}
                      data-testid="button-donate-1"
                    >
                      €1
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => handleDonation(3)}
                      data-testid="button-donate-3"
                    >
                      €3
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => handleDonation(5)}
                      data-testid="button-donate-5"
                    >
                      €5
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => window.open(DONATION_URL, '_blank')}
                      data-testid="button-donate-other"
                    >
                      {t('success.otherAmount')}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Share2 className="w-5 h-5 text-primary" />
                    {t('success.shareTitle')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => window.open(shareLinks.whatsapp, '_blank')}
                      data-testid="button-share-whatsapp"
                    >
                      <SiWhatsapp className="w-5 h-5 text-green-600" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => window.open(shareLinks.facebook, '_blank')}
                      data-testid="button-share-facebook"
                    >
                      <SiFacebook className="w-5 h-5 text-blue-600" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => window.open(shareLinks.twitter, '_blank')}
                      data-testid="button-share-twitter"
                    >
                      <SiX className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => window.open(shareLinks.linkedin, '_blank')}
                      data-testid="button-share-linkedin"
                    >
                      <SiLinkedin className="w-5 h-5 text-blue-700" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          <ProUpsellBanner variant="card" />

          <div className="pt-6 border-t text-center">
            <p className="text-sm text-muted-foreground mb-2">
              {t('success.supportText')}
            </p>
            <a 
              href="mailto:contacto@lisbonwineroutes.com" 
              className="text-primary font-medium hover:underline"
              data-testid="link-contact-email"
            >
              contacto@lisbonwineroutes.com
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
