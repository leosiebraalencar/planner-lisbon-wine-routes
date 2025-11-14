import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import heroImage from "@assets/generated_images/Hero_vineyard_golden_hour_eac5587d.png";

interface HeroProps {
  onStartQuiz: () => void;
}

export default function Hero({ onStartQuiz }: HeroProps) {
  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center">
      <Header transparent />
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
          Descubra o Seu Roteiro Perfeito de Enoturismo em Lisboa
        </h1>
        <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-white/95">
          Responda algumas perguntas e receba um guia personalizado com as melhores vinícolas, degustações e experiências da região de Lisboa
        </p>
        <Button
          size="lg"
          onClick={onStartQuiz}
          className="bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 px-8 py-6 text-lg font-semibold"
          data-testid="button-start-quiz"
        >
          Criar Meu Roteiro Personalizado
        </Button>
        <p className="mt-6 text-sm text-white/80">
          Mais de 500 roteiros criados
        </p>
      </div>
    </section>
  );
}
