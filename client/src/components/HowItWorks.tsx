import { ClipboardList, Sparkles, Eye, Download } from "lucide-react";

const steps = [
  {
    number: 1,
    icon: ClipboardList,
    title: "Responda ao Quiz",
    description: "Conte-nos sobre sua viagem, preferências e orçamento"
  },
  {
    number: 2,
    icon: Sparkles,
    title: "IA Gera Roteiro",
    description: "Nossa IA cria um roteiro personalizado só para você"
  },
  {
    number: 3,
    icon: Eye,
    title: "Revise Sugestões",
    description: "Veja seu roteiro detalhado dia a dia"
  },
  {
    number: 4,
    icon: Download,
    title: "Baixe seu Guia",
    description: "Faça o download do PDF e aproveite sua viagem"
  }
];

export default function HowItWorks() {
  return (
    <section className="py-16 md:py-24 bg-card">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="font-serif font-bold text-3xl md:text-4xl text-center mb-12">
          Como Funciona
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mb-4">
                    <Icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <div className="text-sm font-semibold text-primary mb-2">Passo {step.number}</div>
                  <h3 className="font-serif font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
                
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-border -z-10" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
