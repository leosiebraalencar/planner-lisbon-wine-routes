import { ClipboardList, Sparkles, Eye, Download } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function HowItWorks() {
  const { t } = useLanguage();
  
  const steps = [
    {
      number: 1,
      icon: ClipboardList,
      key: "step1"
    },
    {
      number: 2,
      icon: Sparkles,
      key: "step2"
    },
    {
      number: 3,
      icon: Eye,
      key: "step3"
    },
    {
      number: 4,
      icon: Download,
      key: "step4"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-card">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="font-serif font-bold text-3xl md:text-4xl text-center mb-12">
          {t('howItWorks.title')}
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
                  <div className="text-sm font-semibold text-primary mb-2">{t(`howItWorks.${step.key}.label`)} {step.number}</div>
                  <h3 className="font-serif font-semibold text-lg mb-2">{t(`howItWorks.${step.key}.title`)}</h3>
                  <p className="text-sm text-muted-foreground">{t(`howItWorks.${step.key}.description`)}</p>
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
