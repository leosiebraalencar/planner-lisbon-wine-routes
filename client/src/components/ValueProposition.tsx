import { Sparkles, Award, Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ValueProposition() {
  const { t } = useLanguage();
  
  const features = [
    {
      icon: Sparkles,
      titleKey: "valueProposition.personalized.title",
      descKey: "valueProposition.personalized.description"
    },
    {
      icon: Award,
      titleKey: "valueProposition.curated.title",
      descKey: "valueProposition.curated.description"
    },
    {
      icon: Download,
      titleKey: "valueProposition.instant.title",
      descKey: "valueProposition.instant.description"
    }
  ];

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
                  <h3 className="font-serif font-semibold text-xl mb-3">{t(feature.titleKey)}</h3>
                  <p className="text-muted-foreground">{t(feature.descKey)}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
