import { Sparkles, Award, Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Sparkles,
    title: "Personalizado para Você",
    description: "Roteiros únicos baseados em suas preferências, orçamento e tempo disponível"
  },
  {
    icon: Award,
    title: "Curadoria Especializada",
    description: "Seleção cuidadosa das melhores vinícolas, restaurantes e experiências de Lisboa"
  },
  {
    icon: Download,
    title: "Baixe Instantaneamente",
    description: "Receba seu guia completo em PDF pronto para usar na sua viagem"
  }
];

export default function ValueProposition() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="border-border">
                <CardContent className="p-8">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-serif font-semibold text-xl mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
