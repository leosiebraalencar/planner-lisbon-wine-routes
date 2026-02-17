import { useState } from "react";
import Header from "@/components/Header";
import ItineraryDisplay from "@/components/ItineraryDisplay";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import { getSeoData } from "@/lib/seoData";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, X } from "lucide-react";
import { STRIPE_DONATION_URL } from "@shared/affiliateLinks";
import type { Itinerary } from "@shared/schema";

interface ItineraryPageProps {
  itinerary: Itinerary;
}

const DONATION_URL = import.meta.env.VITE_STRIPE_DONATION_URL || STRIPE_DONATION_URL;

export default function ItineraryPage({ itinerary }: ItineraryPageProps) {
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDonationModal, setShowDonationModal] = useState(false);

  const handleDownload = async () => {
    setIsProcessing(true);
    try {
      const res = await apiRequest('POST', '/api/generate-free-pdf', itinerary);
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to generate PDF');
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'lisbon-wine-routes-itinerary.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({
        title: t('success.title'),
        description: t('itinerary.downloadSuccess'),
      });

      // Show donation modal after successful download
      setShowDonationModal(true);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast({
        title: "Error",
        description: "Failed to download PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDonation = () => {
    window.open(DONATION_URL, '_blank');
    setShowDonationModal(false);
  };

  const seo = getSeoData('itinerary', language);

  return (
    <div className="min-h-screen bg-background">
      <Seo {...seo} />
      <Header />
      <div className="py-12 px-4">
        <ItineraryDisplay itinerary={itinerary} onDownload={handleDownload} isDownloading={isProcessing} />
      </div>
      <Footer />

      {/* Donation Modal */}
      {showDonationModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <Card className="w-[90vw] max-w-xl animate-in fade-in zoom-in relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-[10px] top-[10px] z-10"
              onClick={() => setShowDonationModal(false)}
              data-testid="button-close-donation"
            >
              <X className="w-5 h-5" />
            </Button>
            <CardContent className="p-8 md:p-10">
              <div className="text-center mb-6">
                <Heart className="w-10 h-10 text-red-500 mx-auto mb-4" />
                <CardTitle className="text-2xl md:text-3xl font-serif mb-3">
                  {t('success.donateTitle')}
                </CardTitle>
              </div>
              <p className="text-muted-foreground text-center mb-8 text-base">
                {t('success.thankYou')}
              </p>
              <div className="flex flex-col gap-3">
                <Button 
                  size="lg"
                  onClick={handleDonation}
                  className="w-full text-base"
                  data-testid="button-donate"
                >
                  {t('success.donateButton')}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setShowDonationModal(false)}
                  className="w-full text-muted-foreground"
                  data-testid="button-skip-donation"
                >
                  {t('itinerary.maybeLater')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
