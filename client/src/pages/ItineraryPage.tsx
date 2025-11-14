import { useState } from "react";
import Header from "@/components/Header";
import ItineraryDisplay from "@/components/ItineraryDisplay";
import Footer from "@/components/Footer";
import type { Itinerary } from "@shared/schema";

interface ItineraryPageProps {
  itinerary: Itinerary;
  onDownload: () => void;
}

export default function ItineraryPage({ itinerary, onDownload }: ItineraryPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="py-12 px-4">
        <ItineraryDisplay itinerary={itinerary} onDownload={onDownload} />
      </div>
      <Footer />
    </div>
  );
}
