import { useState } from "react";
import Header from "@/components/Header";
import ItineraryDisplay from "@/components/ItineraryDisplay";
import Footer from "@/components/Footer";
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
  const { t } = useLanguage();
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="py-12 px-4">
        <ItineraryDisplay itinerary={itinerary} onDownload={handleDownload} isDownloading={isProcessing} />
      </div>
      <Footer />

      {/* Donation Modal */}
      {showDonationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md animate-in fade-in zoom-in">
            <CardHeader className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2"
                onClick={() => setShowDonationModal(false)}
                data-testid="button-close-donation"
              >
                <X className="w-4 h-4" />
              </Button>
              <CardTitle className="flex items-center gap-2 text-lg pr-8">
                <Heart className="w-5 h-5 text-red-500" />
                {t('success.donateTitle')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {t('success.thankYou')}
              </p>
              <div className="flex flex-col gap-2">
                <Button 
                  onClick={handleDonation}
                  className="w-full"
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
