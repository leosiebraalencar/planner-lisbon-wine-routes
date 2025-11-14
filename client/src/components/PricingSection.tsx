import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

const benefits = [
  "Roteiros personalizados por IA especializada",
  "Economia de horas de pesquisa e planejamento",
  "Acesso a dicas exclusivas e informações locais",
  "Sugestões de restaurantes e hospedagem",
  "Mapas e informações de contato",
  "Apoie nosso trabalho de curadoria"
];

export default function PricingSection() {
  return (
    <section className="py-16 md:py-24 bg-card">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="font-serif font-bold text-3xl md:text-4xl text-center mb-4">
          Pague o Que Achar Justo
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Acreditamos no valor que oferecemos. Escolha quanto quer pagar (mínimo $1 USD)
        </p>
        
        <Card className="border-border">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-serif font-semibold text-2xl mb-6">O que está incluído:</h3>
                <ul className="space-y-3">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex flex-col justify-center items-center text-center p-6 bg-background rounded-lg">
                <div className="mb-4">
                  <div className="text-sm text-muted-foreground mb-2">A partir de</div>
                  <div className="font-serif font-bold text-5xl text-primary">$1</div>
                  <div className="text-sm text-muted-foreground mt-1">USD</div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Você escolhe o valor após ver seu roteiro personalizado
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
