import { useState } from "react";
import Header from "@/components/Header";
import ItineraryDisplay from "@/components/ItineraryDisplay";
import Footer from "@/components/Footer";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Itinerary } from "@shared/schema";

interface ItineraryPageProps {
  itinerary: Itinerary;
}

export default function ItineraryPage({ itinerary }: ItineraryPageProps) {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDownload = async () => {
    setIsProcessing(true);
    try {
      const res = await apiRequest('POST', '/api/create-checkout-session', itinerary);
      const data = await res.json() as { url: string };

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast({
        title: "Error",
        description: "Failed to create payment session. Please try again.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="py-12 px-4">
        <ItineraryDisplay itinerary={itinerary} onDownload={handleDownload} />
      </div>
      <Footer />
    </div>
  );
}
