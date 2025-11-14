import Hero from "@/components/Hero";
import ValueProposition from "@/components/ValueProposition";
import HowItWorks from "@/components/HowItWorks";
import SampleItinerary from "@/components/SampleItinerary";
import PricingSection from "@/components/PricingSection";
import Footer from "@/components/Footer";

interface LandingPageProps {
  onStartQuiz: () => void;
}

export default function LandingPage({ onStartQuiz }: LandingPageProps) {
  return (
    <div className="min-h-screen">
      <Hero onStartQuiz={onStartQuiz} />
      <ValueProposition />
      <HowItWorks />
      <SampleItinerary />
      <PricingSection />
      <Footer />
    </div>
  );
}
