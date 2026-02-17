import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Clock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function SampleItinerary() {
  const { t } = useLanguage();
  
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="font-serif font-bold text-3xl md:text-4xl text-center mb-4">
          {t('sampleItinerary.title')}
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          {t('sampleItinerary.subtitle')}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-primary" />
                <h3 className="font-serif font-semibold text-lg">{t('sampleItinerary.morning')} (09:00-12:00)</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">{t('sampleItinerary.morningName')}</h4>
                      <p className="text-sm text-muted-foreground">{t('sampleItinerary.morningDesc')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-primary" />
                <h3 className="font-serif font-semibold text-lg">{t('sampleItinerary.afternoon')} (14:00-18:00)</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">{t('sampleItinerary.afternoonName')}</h4>
                      <p className="text-sm text-muted-foreground">{t('sampleItinerary.afternoonDesc')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-border md:col-span-2">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-primary" />
                <h3 className="font-serif font-semibold text-lg">{t('sampleItinerary.evening')} (19:00+)</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">{t('sampleItinerary.eveningName')}</h4>
                      <p className="text-sm text-muted-foreground">{t('sampleItinerary.eveningDesc')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
