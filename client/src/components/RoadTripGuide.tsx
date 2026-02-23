import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Navigation, CheckCircle, AlertTriangle, Lightbulb, MapPin, FileText, Shield, Smartphone, CloudSun, Armchair, ExternalLink, Loader2, RefreshCw, Route } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { apiRequest } from "@/lib/queryClient";
import type { Itinerary, RoadTripGuide as RoadTripGuideType } from "@shared/schema";

interface RoadTripGuideProps {
  itinerary: Itinerary;
  onGuideGenerated: (guide: RoadTripGuideType) => void;
}

export default function RoadTripGuideSection({ itinerary, onGuideGenerated }: RoadTripGuideProps) {
  const { t, language } = useLanguage();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const guide = itinerary.roadTripGuide;

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const response = await apiRequest('POST', `/api/generate-road-trip-guide?lang=${language}`, itinerary);
      const data = await response.json();
      onGuideGenerated(data);
    } catch (err: any) {
      setError(err.message || t('itinerary.roadTripGuide.errorTitle'));
    } finally {
      setIsGenerating(false);
    }
  };

  if (!guide) {
    return (
      <Card className="border-border mb-8">
        <CardContent className="p-8 text-center">
          <Navigation className="w-10 h-10 text-primary mx-auto mb-4" />
          <h3 className="font-serif font-bold text-xl mb-3">
            {t('itinerary.roadTripGuide.title')}
          </h3>
          {isGenerating ? (
            <div className="space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
              <p className="text-muted-foreground">{t('itinerary.roadTripGuide.generating')}</p>
              <p className="text-sm text-muted-foreground">{t('itinerary.roadTripGuide.generatingSubtext')}</p>
            </div>
          ) : error ? (
            <div className="space-y-3">
              <p className="text-destructive">{error}</p>
              <Button onClick={handleGenerate} variant="outline" data-testid="button-retry-guide">
                <RefreshCw className="w-4 h-4 mr-2" />
                {t('itinerary.roadTripGuide.errorRetry')}
              </Button>
            </div>
          ) : (
            <Button onClick={handleGenerate} data-testid="button-generate-guide">
              <Route className="w-4 h-4 mr-2" />
              {t('itinerary.roadTripGuide.generateButton')}
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  const whatToBringCategories = [
    { key: 'documents', icon: FileText, items: guide.whatToBring.documents, label: t('itinerary.roadTripGuide.whatToBringDocuments') },
    { key: 'comfort', icon: Armchair, items: guide.whatToBring.comfort, label: t('itinerary.roadTripGuide.whatToBringComfort') },
    { key: 'safety', icon: Shield, items: guide.whatToBring.safety, label: t('itinerary.roadTripGuide.whatToBringSafety') },
    { key: 'technology', icon: Smartphone, items: guide.whatToBring.technology, label: t('itinerary.roadTripGuide.whatToBringTechnology') },
    { key: 'climate', icon: CloudSun, items: guide.whatToBring.climate, label: t('itinerary.roadTripGuide.whatToBringClimate') },
  ];

  return (
    <div className="space-y-6 mb-8">
      <div className="flex items-center gap-3 mb-2">
        <Navigation className="w-6 h-6 text-primary" />
        <h2 className="font-serif font-bold text-2xl">{t('itinerary.roadTripGuide.title')}</h2>
      </div>

      {guide.carPickupChecklist.length > 0 && (
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              {t('itinerary.roadTripGuide.carPickupChecklist')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {guide.carPickupChecklist.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 text-xs font-medium mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {guide.narratedBlocks.length > 0 && (
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Route className="w-5 h-5 text-primary" />
              {t('itinerary.roadTripGuide.narratedRoute')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full" defaultValue="block-0">
              {guide.narratedBlocks.map((block, idx) => (
                <AccordionItem key={idx} value={`block-${idx}`}>
                  <AccordionTrigger className="hover:no-underline" data-testid={`accordion-narrated-${idx}`}>
                    <span className="text-left font-medium">{block.title}</span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 pt-2">
                      <p className="text-sm leading-relaxed">{block.content}</p>
                      {block.tip && (
                        <div className="flex items-start gap-2 bg-blue-50 dark:bg-blue-950/30 p-3 rounded-md">
                          <Lightbulb className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase">{t('itinerary.roadTripGuide.tipLabel')}</span>
                            <p className="text-sm text-blue-800 dark:text-blue-200">{block.tip}</p>
                          </div>
                        </div>
                      )}
                      {block.alert && (
                        <div className="flex items-start gap-2 bg-amber-50 dark:bg-amber-950/30 p-3 rounded-md">
                          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="text-xs font-semibold text-amber-700 dark:text-amber-300 uppercase">{t('itinerary.roadTripGuide.alertLabel')}</span>
                            <p className="text-sm text-amber-800 dark:text-amber-200">{block.alert}</p>
                          </div>
                        </div>
                      )}
                      {block.suggestion && (
                        <div className="flex items-start gap-2 bg-green-50 dark:bg-green-950/30 p-3 rounded-md">
                          <MapPin className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="text-xs font-semibold text-green-700 dark:text-green-300 uppercase">{t('itinerary.roadTripGuide.suggestionLabel')}</span>
                            <p className="text-sm text-green-800 dark:text-green-200">{block.suggestion}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{t('itinerary.roadTripGuide.whatToBring')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {whatToBringCategories.map(({ key, icon: Icon, items, label }) => (
                items.length > 0 && (
                  <div key={key}>
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">{label}</span>
                    </div>
                    <ul className="space-y-1 pl-6">
                      {items.map((item, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground list-disc">{item}</li>
                      ))}
                    </ul>
                  </div>
                )
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{t('itinerary.roadTripGuide.drivingTips')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {guide.drivingTips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <Shield className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {guide.planB.length > 0 && (
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-primary" />
              {t('itinerary.roadTripGuide.planB')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {guide.planB.map((plan, idx) => (
                <div key={idx} className="bg-card p-4 rounded-lg border border-border">
                  <div className="font-medium text-sm mb-1">{plan.scenario}</div>
                  <p className="text-sm text-muted-foreground">{plan.solution}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {guide.googleMapsLinks.length > 0 && (
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              {t('itinerary.roadTripGuide.mapsTitle')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {guide.googleMapsLinks.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-card rounded-lg border border-border hover-elevate"
                  data-testid={`link-map-day-${link.dayNumber}`}
                >
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{link.label}</Badge>
                  </div>
                  <div className="flex items-center gap-1 text-primary text-sm font-medium">
                    {t('itinerary.roadTripGuide.openMap')} <ExternalLink className="w-3 h-3" />
                  </div>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {guide.summary && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{t('itinerary.roadTripGuide.summary')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed whitespace-pre-line">{guide.summary}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
