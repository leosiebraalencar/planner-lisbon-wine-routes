import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import heroImage from "@assets/generated_images/Hero_vineyard_golden_hour_eac5587d.png";

interface HeroProps {
  onStartQuiz: () => void;
}

export default function Hero({ onStartQuiz }: HeroProps) {
  const { t } = useLanguage();
  const [, navigate] = useLocation();

  return (
    <section className="relative min-h-[calc(100vh-88px)] flex items-center justify-center">
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Vinhedos de Lisboa ao pôr do sol"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />
      </div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
        <h1 className="font-serif font-bold text-4xl md:text-6xl mb-6 leading-tight">
          {t('hero.title')}
        </h1>
        <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-white/95">
          {t('hero.subtitle')}
        </p>
        <Button
          size="lg"
          onClick={onStartQuiz}
          className="bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 px-8 py-6 text-lg font-semibold"
          data-testid="button-start-quiz"
        >
          {t('hero.cta')}
        </Button>
        <p className="mt-4">
          <button
            onClick={() => navigate('/pro')}
            className="text-white underline text-base bg-transparent border-none cursor-pointer"
            data-testid="button-hero-pro-cta"
          >
            {t('hero.proCta')}
          </button>
        </p>
      </div>
    </section>
  );
}
