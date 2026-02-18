import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Calendar, Download, DollarSign, ExternalLink, Car, Building2, Sparkles, UtensilsCrossed, Hotel, Compass, Mail } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Itinerary, Activity } from "@shared/schema";

function ActivityCard({ activity, periodLabel, t }: { activity: Activity; periodLabel: string; t: (key: string) => string }) {
  return (
    <div className="bg-card p-4 rounded-lg">
      <div className="font-medium mb-1">{activity.location}</div>
      {activity.address && (
        <div className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
          <MapPin className="w-3 h-3" />
          {activity.address}
        </div>
      )}
      <div className="text-sm text-muted-foreground mb-2">{activity.activity}</div>
      <p className="text-sm">{activity.description}</p>
      {activity.isTheFork && activity.theForkPromoCode && (
        <div className="mt-2 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-md p-2">
          <p className="text-xs font-medium text-green-800 dark:text-green-200">
            {t('itinerary.theForkPromoPrefix')}<span className="font-bold">{activity.theForkPromoCode}</span>{t('itinerary.theForkPromoSuffix')}
          </p>
        </div>
      )}
      <div className="flex items-center justify-between mt-2 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">{t('itinerary.durationLabel')}: {activity.duration}</span>
          {activity.price != null && activity.price > 0 && (
            <span className="text-sm font-medium" data-testid={`text-price-${periodLabel.toLowerCase()}`}>
              {t('itinerary.priceFrom')} €{activity.price.toFixed(2)}
            </span>
          )}
        </div>
        {activity.affiliateUrl && (
          <a
            href={activity.affiliateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary text-sm font-medium hover:underline flex items-center gap-1"
            data-testid={`link-book-${periodLabel.toLowerCase()}`}
          >
            {activity.isTheFork ? t('itinerary.bookOnTheFork') : t('itinerary.book')} <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  );
}

interface ItineraryDisplayProps {
  itinerary: Itinerary;
  onDownload: () => void;
  isDownloading?: boolean;
  customerName?: string;
}

export default function ItineraryDisplay({ itinerary, onDownload, isDownloading = false, customerName }: ItineraryDisplayProps) {
  const { t } = useLanguage();
  
  const greeting = customerName ? t('itinerary.greeting', { name: customerName }) : '';
  
  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="mb-8 text-center">
        {greeting && (
          <p className="font-serif text-2xl md:text-3xl mb-2 text-foreground" data-testid="text-itinerary-greeting">
            {greeting}
          </p>
        )}
        <h1 className="font-serif font-bold text-3xl md:text-4xl mb-4" data-testid="text-itinerary-title">
          {t('itinerary.title')}
        </h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-primary" />
              <div>
                <div className="text-sm text-muted-foreground">{t('itinerary.duration')}</div>
                <div className="font-semibold">{itinerary.days.length} {t('itinerary.days')}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <DollarSign className="w-5 h-5 text-primary" />
              <div>
                <div className="text-sm text-muted-foreground">{t('itinerary.budget')}</div>
                <div className="font-semibold capitalize">
                  {t(`itinerary.budgetTypes.${itinerary.quizData.budget}`)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-primary" />
              <div>
                <div className="text-sm text-muted-foreground">{t('itinerary.travelType')}</div>
                <div className="font-semibold capitalize">
                  {t(`itinerary.travelerTypes.${itinerary.quizData.travelers}`)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="border-border mb-8">
        <CardHeader>
          <CardTitle className="font-serif">{t('itinerary.highlights')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {itinerary.highlights.map((highlight, index) => (
              <Badge key={index} variant="secondary" className="text-sm">
                {highlight}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-border mb-8">
        <CardHeader>
          <CardTitle className="font-serif">{t('itinerary.dayByDay')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {itinerary.days.map((day) => (
              <AccordionItem key={day.day} value={`day-${day.day}`}>
                <AccordionTrigger className="hover:no-underline" data-testid={`accordion-day-${day.day}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                      {day.day}
                    </div>
                    <div className="text-left">
                      <div className="font-serif font-semibold">{t('itinerary.day')} {day.day}</div>
                      <div className="text-sm text-muted-foreground">{day.region}</div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-6 pt-4">
                    <div className="flex gap-4">
                      <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{t('itinerary.morning')}</h4>
                          <span className="text-sm text-muted-foreground">{day.morning.time}</span>
                        </div>
                        <ActivityCard activity={day.morning} periodLabel={`morning-day-${day.day}`} t={t} />
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{t('itinerary.afternoon')}</h4>
                          <span className="text-sm text-muted-foreground">{day.afternoon.time}</span>
                        </div>
                        <ActivityCard activity={day.afternoon} periodLabel={`afternoon-day-${day.day}`} t={t} />
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{t('itinerary.evening')}</h4>
                          <span className="text-sm text-muted-foreground">{day.evening.time}</span>
                        </div>
                        <ActivityCard activity={day.evening} periodLabel={`evening-day-${day.day}`} t={t} />
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {itinerary.recommendations.restaurants && itinerary.recommendations.restaurants.length > 0 && (
        <Card className="border-border mb-8">
          <CardHeader className="pb-3">
            <CardTitle className="font-serif flex items-center gap-2">
              <UtensilsCrossed className="w-5 h-5 text-primary" />
              {t('itinerary.recommendedRestaurants')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {itinerary.recommendations.restaurants.map((rest, idx) => (
                <div key={idx} className="bg-card p-4 rounded-lg border border-border">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div className="flex-1">
                      <div className="font-medium">{rest.name}</div>
                      {rest.address && (
                        <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" />
                          {rest.address}
                        </div>
                      )}
                      {rest.description && (
                        <p className="text-sm text-muted-foreground mt-1">{rest.description}</p>
                      )}
                      {rest.price != null && rest.price > 0 && (
                        <div className="text-sm font-medium mt-1">
                          {t('itinerary.averagePrice')}: €{rest.price.toFixed(2)}
                        </div>
                      )}
                    </div>
                    {rest.affiliateUrl && (
                      <a
                        href={rest.affiliateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary text-sm font-medium hover:underline flex items-center gap-1 flex-shrink-0"
                        data-testid={`link-restaurant-${idx}`}
                      >
                        {rest.isTheFork ? t('itinerary.bookOnTheFork') : t('itinerary.viewLink')} <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  {rest.isTheFork && rest.theForkPromoCode && (
                    <div className="mt-2 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-md p-2">
                      <p className="text-xs font-medium text-green-800 dark:text-green-200">
                        {t('itinerary.theForkPromoPrefix')}<span className="font-bold">{rest.theForkPromoCode}</span>{t('itinerary.theForkPromoSuffix')}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {(itinerary.recommendations.accommodation || itinerary.recommendations.carRental || (itinerary.recommendations.hotels && itinerary.recommendations.hotels.length > 0)) && (
        <div className="space-y-4 mb-8">
          {itinerary.recommendations.hotels && itinerary.recommendations.hotels.length > 0 && (
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="font-serif flex items-center gap-2">
                  <Hotel className="w-5 h-5 text-primary" />
                  {t('itinerary.suggestedHotels')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {itinerary.recommendations.hotels.map((hotel, idx) => (
                    <div key={idx} className="bg-card p-4 rounded-lg border border-border">
                      <div className="font-medium">{hotel.name}</div>
                      {hotel.description && (
                        <p className="text-sm text-muted-foreground mt-1">{hotel.description}</p>
                      )}
                      {hotel.budgetCategory && (
                        <Badge variant="secondary" className="mt-2">
                          {hotel.budgetCategory === 'low' ? t('itinerary.budgetTypes.economico') : hotel.budgetCategory === 'medium' ? t('itinerary.budgetTypes.moderado') : t('itinerary.budgetTypes.premium')}
                        </Badge>
                      )}
                      {hotel.affiliateUrl && (
                        <a
                          href={hotel.affiliateUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-primary text-sm font-medium hover:underline mt-2"
                          data-testid={`link-hotel-${idx}`}
                        >
                          {t('itinerary.bookNow')} <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {itinerary.recommendations.accommodation && (
              <Card className="border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-primary" />
                    {t('itinerary.accommodation')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="font-medium">{itinerary.recommendations.accommodation.name}</div>
                  {itinerary.recommendations.accommodation.address && (
                    <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" />
                      {itinerary.recommendations.accommodation.address}
                    </div>
                  )}
                  {itinerary.recommendations.accommodation.affiliateUrl && (
                    <a
                      href={itinerary.recommendations.accommodation.affiliateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-primary text-sm font-medium hover:underline mt-3"
                      data-testid="link-book-accommodation"
                    >
                      {t('itinerary.bookNow')} <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </CardContent>
              </Card>
            )}
            
            {itinerary.recommendations.carRental && (
              <Card className="border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Car className="w-5 h-5 text-primary" />
                    {t('itinerary.carRental')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="font-medium">{itinerary.recommendations.carRental.provider}</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t('itinerary.carRentalInfo')}
                  </p>
                  <a
                    href={itinerary.recommendations.carRental.affiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary text-sm font-medium hover:underline mt-3"
                    data-testid="link-book-car"
                  >
                    {t('itinerary.bookCar')} <ExternalLink className="w-3 h-3" />
                  </a>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
      
      {itinerary.quizData.wantsPrivateGuide && (
        <Card className="border-border mb-8">
          <CardHeader className="pb-3">
            <CardTitle className="font-serif flex items-center gap-2">
              <Compass className="w-5 h-5 text-primary" />
              {t('itinerary.guidedTours')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-card p-4 rounded-lg border border-border">
                <p className="text-sm mb-3">
                  {t('itinerary.guidedToursDescription')}
                </p>
                <a
                  href="https://gyg.me/PDKSl5qX"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-primary text-sm font-medium hover:underline"
                  data-testid="link-getyourguide"
                >
                  {t('itinerary.viewToursGetYourGuide')} <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="bg-card p-4 rounded-lg border border-border">
                <p className="text-sm mb-2">
                  {t('itinerary.exclusiveGuideText')}
                </p>
                <a
                  href="mailto:contacto@lisbonwineroutes.com"
                  className="inline-flex items-center gap-1 text-primary text-sm font-medium hover:underline"
                  data-testid="link-guide-contact"
                >
                  <Mail className="w-3 h-3" />
                  contacto@lisbonwineroutes.com
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-primary/20 bg-primary/5 mb-6">
        <CardContent className="p-8 text-center">
          <h3 className="font-serif font-bold text-2xl mb-4">
            {t('itinerary.liked')}
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            {t('itinerary.downloadInfo')}
          </p>
          <Button 
            size="lg" 
            onClick={onDownload}
            disabled={isDownloading}
            className="px-8"
            data-testid="button-download-itinerary"
          >
            <Download className="w-4 h-4 mr-2" />
            {isDownloading ? t('success.downloading') : t('itinerary.downloadButton')}
          </Button>
        </CardContent>
      </Card>
      
      <Card className="border-accent/20 bg-accent/5">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-accent" />
            <h4 className="font-semibold text-lg">{t('itinerary.proUpsellTitle')}</h4>
          </div>
          <p className="text-muted-foreground text-sm mb-4">
            {t('itinerary.proUpsellText')}
          </p>
          <a href="/pro">
            <Button 
              variant="default"
              data-testid="button-pro-upsell"
            >
              {t('itinerary.proUpsellButton')}
            </Button>
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
