import { useLocation } from "wouter";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ValueProposition from "@/components/ValueProposition";
import HowItWorks from "@/components/HowItWorks";
import SampleItinerary from "@/components/SampleItinerary";
import PricingSection from "@/components/PricingSection";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import { useLanguage } from "@/contexts/LanguageContext";
import { getSeoData } from "@/lib/seoData";

export default function LandingPage() {
  const [, setLocation] = useLocation();
  const { language } = useLanguage();
  const seo = getSeoData('home', language);

  const handleStartQuiz = () => {
    setLocation('/quiz');
  };

  return (
    <div className="min-h-screen">
      <Seo {...seo} />
      <Header />
      <Hero onStartQuiz={handleStartQuiz} />
      <ValueProposition />
      <HowItWorks />
      <SampleItinerary />
      <PricingSection />
      <Footer />
    </div>
  );
}
