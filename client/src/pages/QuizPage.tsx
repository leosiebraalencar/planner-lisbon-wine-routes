import { useState } from "react";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import QuizProgress from "@/components/QuizProgress";
import QuizQuestion from "@/components/QuizQuestion";
import ProUpsellBanner from "@/components/ProUpsellBanner";
import Seo from "@/components/Seo";
import { useLanguage } from "@/contexts/LanguageContext";
import { getSeoData } from "@/lib/seoData";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Users, User, UsersRound, Home, Plane, Train, Car, CircleDot, MapPin, Building2, Globe } from "lucide-react";
import type { QuizResponse } from "@shared/schema";
import { Switch } from "@/components/ui/switch";

interface QuizPageProps {
  onComplete: (data: QuizResponse) => void;
}

const TOTAL_STEPS = 14;

const languageOptionKeys = ['portugues', 'ingles', 'espanhol', 'frances', 'alemao'] as const;

export default function QuizPage({ onComplete }: QuizPageProps) {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const today = new Date().toISOString().split('T')[0];
  const [formData, setFormData] = useState<Partial<QuizResponse>>({
    customerName: '',
    duration: 3,
    startDate: today,
    budget: 'moderado',
    travelers: 'casal',
    groupSize: undefined,
    languagePreference: undefined,
    preferences: [],
    gastronomyStyle: [],
    hotelStyle: undefined,
    accommodationMobility: undefined,
    specialRequests: '',
    arrival: undefined,
    needsCarRental: undefined,
    wantsPrivateGuide: undefined,
    regionPreferences: [],
    hasAccommodation: undefined,
    accommodationPreference: undefined
  });

  const handleNext = () => {
    let nextStep = currentStep + 1;
    if (currentStep === 12 && formData.hasAccommodation) {
      nextStep = 14;
    }
    if (nextStep > TOTAL_STEPS) {
      onComplete(formData as QuizResponse);
      setLocation('/itinerary');
    } else {
      setCurrentStep(nextStep);
    }
  };

  const handleBack = () => {
    let prevStep = currentStep - 1;
    if (currentStep === 14 && formData.hasAccommodation) {
      prevStep = 12;
    }
    if (prevStep >= 1) {
      setCurrentStep(prevStep);
    }
  };

  const canGoNext = () => {
    switch (currentStep) {
      case 1:
        return !!formData.customerName && formData.customerName.trim().length > 0;
      case 2:
        return formData.duration !== undefined && formData.duration >= 1;
      case 3:
        return !!formData.startDate && !!formData.endDate;
      case 4:
        return formData.budget !== undefined;
      case 5:
        return formData.travelers !== undefined && (formData.travelers !== 'grupo' || (formData.groupSize !== undefined && formData.groupSize >= 3 && formData.groupSize <= 100));
      case 6:
        return formData.languagePreference !== undefined;
      case 7:
        return (formData.preferences?.length ?? 0) > 0;
      case 8:
        return (formData.regionPreferences?.length ?? 0) > 0;
      case 9:
        return formData.arrival !== undefined;
      case 10:
        return formData.needsCarRental !== undefined;
      case 11:
        return formData.wantsPrivateGuide !== undefined;
      case 12:
        return formData.hasAccommodation !== undefined;
      case 13:
        return formData.hasAccommodation || formData.accommodationPreference !== undefined;
      case 14:
        return true;
      default:
        return false;
    }
  };

  const { language, t } = useLanguage();
  const seo = getSeoData('quiz', language);

  const travelerOptions = [
    { value: 'sozinho', label: t('quiz.q4.alone'), icon: User },
    { value: 'casal', label: t('quiz.q4.couple'), icon: Users },
    { value: 'familia', label: t('quiz.q4.family'), icon: Home },
    { value: 'grupo', label: t('quiz.q4.group'), icon: UsersRound }
  ];

  const arrivalOptions = [
    { value: 'aviao', label: t('quiz.q6.options.aviao'), icon: Plane },
    { value: 'trem', label: t('quiz.q6.options.trem'), icon: Train },
    { value: 'carro', label: t('quiz.q6.options.carro'), icon: Car },
    { value: 'ja_em_lisboa', label: t('quiz.q6.options.ja_em_lisboa'), icon: MapPin },
    { value: 'outros', label: t('quiz.q6.options.outros'), icon: CircleDot },
  ];

  const preferenceKeys = [
    'tastings', 'traditionalGastronomy', 'internationalGastronomy', 'historic',
    'landscapes', 'family', 'biodynamic', 'tours',
    'modernHotels', 'rusticHotels', 'historicHotels',
    'singleLocation', 'multipleLocations'
  ];
  const preferences = preferenceKeys.map(key => ({
    key,
    label: t(`quiz.q5.preferences.${key}`)
  }));

  return (
    <div className="min-h-screen bg-background">
      <Seo {...seo} />
      <Header />
      <div className="py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <QuizProgress currentStep={currentStep} totalSteps={TOTAL_STEPS} />
        
        {currentStep === 1 && (
          <QuizQuestion
            questionNumber={1}
            totalQuestions={TOTAL_STEPS}
            question={t('quiz.q0.question')}
            onNext={handleNext}
            onBack={handleBack}
            canGoNext={canGoNext()}
            canGoBack={false}
          >
            <div className="space-y-4">
              <input
                type="text"
                className="w-full px-4 py-3 rounded-lg border border-input bg-background"
                placeholder={t('quiz.q0.placeholder')}
                value={formData.customerName || ''}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                data-testid="input-customer-name"
              />
            </div>
          </QuizQuestion>
        )}

        {currentStep === 2 && (
          <QuizQuestion
            questionNumber={2}
            totalQuestions={TOTAL_STEPS}
            question={t('quiz.q1.question')}
            onNext={handleNext}
            onBack={handleBack}
            canGoNext={canGoNext()}
            canGoBack={currentStep > 1}
          >
            <RadioGroup 
              value={formData.duration && formData.duration > 5 ? 'custom' : String(formData.duration)} 
              onValueChange={(value) => {
                if (value === 'custom') {
                  setFormData({ ...formData, duration: 6 });
                } else {
                  setFormData({ ...formData, duration: parseInt(value) });
                }
              }}
            >
              {[1, 2, 3, 4, 5].map((day) => (
                <div 
                  key={day} 
                  className="flex items-center space-x-3 p-4 rounded-lg border border-border hover-elevate active-elevate-2 cursor-pointer"
                  onClick={() => setFormData({ ...formData, duration: day })}
                >
                  <RadioGroupItem value={String(day)} id={`day-${day}`} data-testid={`radio-duration-${day}`} />
                  <Label htmlFor={`day-${day}`} className="cursor-pointer flex-1">
                    {day === 1 ? `1 ${t('quiz.q1.day')}` : `${day} ${t('quiz.q1.days')}`}
                  </Label>
                </div>
              ))}
              <div 
                className={`flex items-center space-x-3 p-4 rounded-lg border border-border hover-elevate active-elevate-2 cursor-pointer ${
                  formData.duration && formData.duration > 5 ? 'bg-primary/5 border-primary/20' : ''
                }`}
                onClick={() => setFormData({ ...formData, duration: formData.duration && formData.duration > 5 ? formData.duration : 6 })}
              >
                <RadioGroupItem value="custom" id="day-custom" data-testid="radio-duration-custom" />
                <Label htmlFor="day-custom" className="cursor-pointer flex-1">
                  {t('quiz.q1.moreThan5')}
                </Label>
              </div>
              {formData.duration && formData.duration > 5 && (
                <div className="mt-3 pl-4">
                  <Label htmlFor="custom-days" className="mb-2 block text-sm text-muted-foreground">
                    {t('quiz.q1.customDaysLabel')}
                  </Label>
                  <input
                    id="custom-days"
                    type="number"
                    min="6"
                    max="30"
                    className="w-32 rounded-lg border border-input bg-background min-h-9 text-sm px-3"
                    value={formData.duration}
                    onChange={(e) => {
                      const raw = e.target.value;
                      if (raw === '') {
                        setFormData({ ...formData, duration: undefined as any });
                        return;
                      }
                      const val = parseInt(raw);
                      if (!isNaN(val) && val >= 1) {
                        setFormData({ ...formData, duration: Math.min(Math.max(val, 6), 30) });
                      }
                    }}
                    onBlur={() => {
                      if (!formData.duration || formData.duration < 6) {
                        setFormData({ ...formData, duration: 6 });
                      }
                    }}
                    data-testid="input-custom-days"
                  />
                </div>
              )}
            </RadioGroup>
          </QuizQuestion>
        )}

        {currentStep === 3 && (
          <QuizQuestion
            questionNumber={3}
            totalQuestions={TOTAL_STEPS}
            question={t('quiz.q2.question')}
            onNext={handleNext}
            onBack={handleBack}
            canGoNext={canGoNext()}
            canGoBack={currentStep > 1}
          >
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {t('quiz.q2.info')}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start-date" className="mb-2 block">{t('quiz.q2.startDate')}</Label>
                  <input
                    id="start-date"
                    type="date"
                    className="w-full px-4 py-3 rounded-lg border border-input bg-background"
                    value={formData.startDate || ''}
                    min={today}
                    onChange={(e) => {
                      const newStart = e.target.value;
                      const updatedData: Partial<QuizResponse> = { ...formData, startDate: newStart };
                      if (formData.endDate && newStart > formData.endDate) {
                        updatedData.endDate = undefined;
                      }
                      setFormData(updatedData);
                    }}
                    data-testid="input-start-date"
                  />
                </div>
                <div>
                  <Label htmlFor="end-date" className="mb-2 block">{t('quiz.q2.endDate')}</Label>
                  <input
                    id="end-date"
                    type="date"
                    className="w-full px-4 py-3 rounded-lg border border-input bg-background"
                    value={formData.endDate || ''}
                    min={formData.startDate || today}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    data-testid="input-end-date"
                  />
                </div>
              </div>
            </div>
          </QuizQuestion>
        )}

        {currentStep === 4 && (
          <QuizQuestion
            questionNumber={4}
            totalQuestions={TOTAL_STEPS}
            question={t('quiz.q3.question')}
            onNext={handleNext}
            onBack={handleBack}
            canGoNext={canGoNext()}
            canGoBack={currentStep > 1}
          >
            <RadioGroup 
              value={formData.budget} 
              onValueChange={(value: any) => setFormData({ ...formData, budget: value })}
            >
              <div 
                className="flex items-start space-x-3 p-6 rounded-lg border border-border hover-elevate active-elevate-2 cursor-pointer"
                onClick={() => setFormData({ ...formData, budget: 'economico' })}
              >
                <RadioGroupItem value="economico" id="economico" data-testid="radio-budget-economico" />
                <div className="flex-1">
                  <Label htmlFor="economico" className="cursor-pointer font-semibold">
                    {t('quiz.q3.economic.title')}
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t('quiz.q3.economic.description')}
                  </p>
                </div>
              </div>
              
              <div 
                className="flex items-start space-x-3 p-6 rounded-lg border border-border hover-elevate active-elevate-2 cursor-pointer"
                onClick={() => setFormData({ ...formData, budget: 'moderado' })}
              >
                <RadioGroupItem value="moderado" id="moderado" data-testid="radio-budget-moderado" />
                <div className="flex-1">
                  <Label htmlFor="moderado" className="cursor-pointer font-semibold">
                    {t('quiz.q3.moderate.title')}
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t('quiz.q3.moderate.description')}
                  </p>
                </div>
              </div>
              
              <div 
                className="flex items-start space-x-3 p-6 rounded-lg border border-border hover-elevate active-elevate-2 cursor-pointer"
                onClick={() => setFormData({ ...formData, budget: 'premium' })}
              >
                <RadioGroupItem value="premium" id="premium" data-testid="radio-budget-premium" />
                <div className="flex-1">
                  <Label htmlFor="premium" className="cursor-pointer font-semibold">
                    {t('quiz.q3.premium.title')}
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t('quiz.q3.premium.description')}
                  </p>
                </div>
              </div>
            </RadioGroup>
          </QuizQuestion>
        )}

        {currentStep === 5 && (
          <QuizQuestion
            questionNumber={5}
            totalQuestions={TOTAL_STEPS}
            question={t('quiz.q4.question')}
            onNext={handleNext}
            onBack={handleBack}
            canGoNext={canGoNext()}
            canGoBack={currentStep > 1}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {travelerOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = formData.travelers === option.value;
                return (
                  <Card
                    key={option.value}
                    className={`cursor-pointer border-2 transition-colors hover-elevate active-elevate-2 ${
                      isSelected ? 'border-primary bg-primary/5' : 'border-border'
                    }`}
                    onClick={() => setFormData({ ...formData, travelers: option.value as any })}
                    data-testid={`card-travelers-${option.value}`}
                  >
                    <CardContent className="p-6 text-center">
                      <Icon className={`w-8 h-8 mx-auto mb-3 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                      <div className={`font-semibold ${isSelected ? 'text-primary' : ''}`}>
                        {option.label}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            {formData.travelers === 'grupo' && (
              <div className="mt-6 space-y-3">
                <Label>{t('quiz.q4.groupSizeLabel')}</Label>
                <input
                  type="number"
                  min={3}
                  max={100}
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background"
                  value={formData.groupSize || ''}
                  onChange={(e) => {
                    const val = e.target.value === '' ? undefined : parseInt(e.target.value);
                    setFormData({ ...formData, groupSize: val });
                  }}
                  data-testid="input-group-size"
                />
                {formData.groupSize !== undefined && formData.groupSize > 100 && (
                  <Card className="border-amber-500 bg-amber-50 dark:bg-amber-950 mt-4">
                    <CardContent className="p-4">
                      <p className="text-sm">{t('quiz.q4.groupSizeWarning')}</p>
                      <a href="mailto:contacto@lisbonwineroutes.com" className="text-primary font-semibold" data-testid="link-large-group-email">contacto@lisbonwineroutes.com</a>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </QuizQuestion>
        )}

        {currentStep === 6 && (
          <QuizQuestion
            questionNumber={6}
            totalQuestions={TOTAL_STEPS}
            question={t('quiz.q5lang.question')}
            onNext={handleNext}
            onBack={handleBack}
            canGoNext={canGoNext()}
            canGoBack={currentStep > 1}
          >
            <RadioGroup 
              value={formData.languagePreference} 
              onValueChange={(value: any) => setFormData({ ...formData, languagePreference: value })}
            >
              {languageOptionKeys.map((key) => (
                <div 
                  key={key}
                  className="flex items-center space-x-3 p-4 rounded-lg border border-border hover-elevate active-elevate-2 cursor-pointer"
                  onClick={() => setFormData({ ...formData, languagePreference: key as any })}
                >
                  <RadioGroupItem value={key} id={`lang-${key}`} data-testid={`radio-language-${key}`} />
                  <Label htmlFor={`lang-${key}`} className="cursor-pointer flex-1 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    {t(`quiz.q5lang.options.${key}`)}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </QuizQuestion>
        )}

        {currentStep === 7 && (
          <QuizQuestion
            questionNumber={7}
            totalQuestions={TOTAL_STEPS}
            question={t('quiz.q5.question')}
            onNext={handleNext}
            onBack={handleBack}
            canGoNext={canGoNext()}
            canGoBack={currentStep > 1}
          >
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground mb-4">
                {t('quiz.q5.info')}
              </p>
              {preferences.map((pref) => {
                const isChecked = formData.preferences?.includes(pref.key);
                return (
                  <div 
                    key={pref.key} 
                    className={`flex items-center space-x-3 p-4 rounded-lg border border-border hover-elevate active-elevate-2 cursor-pointer ${
                      isChecked ? 'bg-primary/5 border-primary/20' : ''
                    }`}
                    onClick={() => {
                      const current = formData.preferences || [];
                      const updated = current.includes(pref.key)
                        ? current.filter(p => p !== pref.key)
                        : [...current, pref.key];
                      setFormData({ ...formData, preferences: updated });
                    }}
                  >
                    <Checkbox 
                      id={pref.key} 
                      checked={isChecked}
                      onCheckedChange={(checked) => {
                        const current = formData.preferences || [];
                        const updated = checked
                          ? [...current, pref.key]
                          : current.filter(p => p !== pref.key);
                        setFormData({ ...formData, preferences: updated });
                      }}
                      data-testid={`checkbox-preference-${pref.key}`}
                    />
                    <Label htmlFor={pref.key} className="cursor-pointer flex-1">
                      {pref.label}
                    </Label>
                  </div>
                );
              })}
            </div>
          </QuizQuestion>
        )}

        {currentStep === 8 && (
          <QuizQuestion
            questionNumber={8}
            totalQuestions={TOTAL_STEPS}
            question={t('quiz.qRegion.question')}
            onNext={handleNext}
            onBack={handleBack}
            canGoNext={canGoNext()}
            canGoBack={currentStep > 1}
          >
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground mb-2">
                {t('quiz.qRegion.info')}
              </p>
              {(['oeste', 'setubal', 'oeiras', 'sintra', 'surprise'] as const).map((regionKey) => {
                const isSelected = formData.regionPreferences?.includes(regionKey) ?? false;
                const isSurprise = regionKey === 'surprise';
                const surpriseSelected = formData.regionPreferences?.includes('surprise') ?? false;
                return (
                  <div
                    key={regionKey}
                    className={`flex items-start space-x-3 p-5 rounded-lg border-2 cursor-pointer transition-colors hover-elevate active-elevate-2 ${
                      isSelected ? 'border-primary bg-primary/5' : 'border-border'
                    }`}
                    onClick={() => {
                      const current = formData.regionPreferences || [];
                      let updated: string[];
                      if (isSurprise) {
                        updated = isSelected ? [] : ['surprise'];
                      } else {
                        if (isSelected) {
                          updated = current.filter(r => r !== regionKey);
                        } else {
                          updated = [...current.filter(r => r !== 'surprise'), regionKey];
                        }
                      }
                      setFormData({ ...formData, regionPreferences: updated as any });
                    }}
                    data-testid={`card-region-${regionKey}`}
                  >
                    <Checkbox
                      id={`region-${regionKey}`}
                      checked={isSelected}
                      disabled={!isSurprise && surpriseSelected}
                      onCheckedChange={() => {}}
                      data-testid={`checkbox-region-${regionKey}`}
                    />
                    <div className="flex-1">
                      <Label htmlFor={`region-${regionKey}`} className="cursor-pointer font-semibold text-base">
                        {t(`quiz.qRegion.regions.${regionKey}.title`)}
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {t(`quiz.qRegion.regions.${regionKey}.description`)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </QuizQuestion>
        )}

        {currentStep === 9 && (
          <QuizQuestion
            questionNumber={9}
            totalQuestions={TOTAL_STEPS}
            question={t('quiz.q6.question')}
            onNext={handleNext}
            onBack={handleBack}
            canGoNext={canGoNext()}
            canGoBack={currentStep > 1}
          >
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {arrivalOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = formData.arrival === option.value;
                return (
                  <Card
                    key={option.value}
                    className={`cursor-pointer border-2 transition-colors hover-elevate active-elevate-2 ${
                      isSelected ? 'border-primary bg-primary/5' : 'border-border'
                    }`}
                    onClick={() => setFormData({ ...formData, arrival: option.value as any })}
                    data-testid={`card-arrival-${option.value}`}
                  >
                    <CardContent className="p-6 text-center">
                      <Icon className={`w-8 h-8 mx-auto mb-3 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                      <div className={`font-semibold ${isSelected ? 'text-primary' : ''}`}>
                        {option.label}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </QuizQuestion>
        )}

        {currentStep === 10 && (
          <QuizQuestion
            questionNumber={10}
            totalQuestions={TOTAL_STEPS}
            question={t('quiz.q7.question')}
            onNext={handleNext}
            onBack={handleBack}
            canGoNext={canGoNext()}
            canGoBack={currentStep > 1}
          >
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground mb-4">
                {t('quiz.q7.info')}
              </p>
              <div className="grid grid-cols-2 gap-4">
                <Card
                  className={`cursor-pointer border-2 transition-colors hover-elevate active-elevate-2 ${
                    formData.needsCarRental ? 'border-primary bg-primary/5' : 'border-border'
                  }`}
                  onClick={() => setFormData({ ...formData, needsCarRental: true })}
                  data-testid="card-car-rental-yes"
                >
                  <CardContent className="p-6 text-center">
                    <Car className={`w-8 h-8 mx-auto mb-3 ${formData.needsCarRental ? 'text-primary' : 'text-muted-foreground'}`} />
                    <div className={`font-semibold ${formData.needsCarRental ? 'text-primary' : ''}`}>
                      {t('quiz.q7.yes')}
                    </div>
                  </CardContent>
                </Card>
                <Card
                  className={`cursor-pointer border-2 transition-colors hover-elevate active-elevate-2 ${
                    formData.needsCarRental === false ? 'border-primary bg-primary/5' : 'border-border'
                  }`}
                  onClick={() => setFormData({ ...formData, needsCarRental: false })}
                  data-testid="card-car-rental-no"
                >
                  <CardContent className="p-6 text-center">
                    <CircleDot className={`w-8 h-8 mx-auto mb-3 ${formData.needsCarRental === false ? 'text-primary' : 'text-muted-foreground'}`} />
                    <div className={`font-semibold ${formData.needsCarRental === false ? 'text-primary' : ''}`}>
                      {t('quiz.q7.no')}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </QuizQuestion>
        )}

        {currentStep === 11 && (
          <QuizQuestion
            questionNumber={11}
            totalQuestions={TOTAL_STEPS}
            question={t('quiz.q8.question')}
            onNext={handleNext}
            onBack={handleBack}
            canGoNext={canGoNext()}
            canGoBack={currentStep > 1}
          >
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground mb-4">
                {t('quiz.q8.info')}
              </p>
              <div className="grid grid-cols-2 gap-4">
                <Card
                  className={`cursor-pointer border-2 transition-colors hover-elevate active-elevate-2 ${
                    formData.wantsPrivateGuide ? 'border-primary bg-primary/5' : 'border-border'
                  }`}
                  onClick={() => setFormData({ ...formData, wantsPrivateGuide: true })}
                  data-testid="card-guide-yes"
                >
                  <CardContent className="p-6 text-center">
                    <User className={`w-8 h-8 mx-auto mb-3 ${formData.wantsPrivateGuide ? 'text-primary' : 'text-muted-foreground'}`} />
                    <div className={`font-semibold ${formData.wantsPrivateGuide ? 'text-primary' : ''}`}>
                      {t('quiz.q8.yes')}
                    </div>
                  </CardContent>
                </Card>
                <Card
                  className={`cursor-pointer border-2 transition-colors hover-elevate active-elevate-2 ${
                    formData.wantsPrivateGuide === false ? 'border-primary bg-primary/5' : 'border-border'
                  }`}
                  onClick={() => setFormData({ ...formData, wantsPrivateGuide: false })}
                  data-testid="card-guide-no"
                >
                  <CardContent className="p-6 text-center">
                    <CircleDot className={`w-8 h-8 mx-auto mb-3 ${formData.wantsPrivateGuide === false ? 'text-primary' : 'text-muted-foreground'}`} />
                    <div className={`font-semibold ${formData.wantsPrivateGuide === false ? 'text-primary' : ''}`}>
                      {t('quiz.q8.no')}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </QuizQuestion>
        )}

        {currentStep === 12 && (
          <QuizQuestion
            questionNumber={12}
            totalQuestions={TOTAL_STEPS}
            question={t('quiz.q9.question')}
            onNext={handleNext}
            onBack={handleBack}
            canGoNext={canGoNext()}
            canGoBack={currentStep > 1}
          >
            <div className="grid grid-cols-2 gap-4">
              <Card
                className={`cursor-pointer border-2 transition-colors hover-elevate active-elevate-2 ${
                  formData.hasAccommodation ? 'border-primary bg-primary/5' : 'border-border'
                }`}
                onClick={() => setFormData({ ...formData, hasAccommodation: true })}
                data-testid="card-accommodation-yes"
              >
                <CardContent className="p-6 text-center">
                  <Building2 className={`w-8 h-8 mx-auto mb-3 ${formData.hasAccommodation ? 'text-primary' : 'text-muted-foreground'}`} />
                  <div className={`font-semibold ${formData.hasAccommodation ? 'text-primary' : ''}`}>
                    {t('quiz.q9.yes')}
                  </div>
                </CardContent>
              </Card>
              <Card
                className={`cursor-pointer border-2 transition-colors hover-elevate active-elevate-2 ${
                  formData.hasAccommodation === false ? 'border-primary bg-primary/5' : 'border-border'
                }`}
                onClick={() => setFormData({ ...formData, hasAccommodation: false })}
                data-testid="card-accommodation-no"
              >
                <CardContent className="p-6 text-center">
                  <CircleDot className={`w-8 h-8 mx-auto mb-3 ${formData.hasAccommodation === false ? 'text-primary' : 'text-muted-foreground'}`} />
                  <div className={`font-semibold ${formData.hasAccommodation === false ? 'text-primary' : ''}`}>
                    {t('quiz.q9.no')}
                  </div>
                </CardContent>
              </Card>
            </div>
          </QuizQuestion>
        )}

        {currentStep === 13 && !formData.hasAccommodation && (
          <QuizQuestion
            questionNumber={13}
            totalQuestions={TOTAL_STEPS}
            question={t('quiz.q10.question')}
            onNext={handleNext}
            onBack={handleBack}
            canGoNext={canGoNext()}
            canGoBack={currentStep > 1}
          >
            <div className="space-y-4">
              <RadioGroup 
                value={formData.accommodationPreference} 
                onValueChange={(value: any) => setFormData({ ...formData, accommodationPreference: value })}
              >
                <div 
                  className="flex items-start space-x-3 p-6 rounded-lg border border-border hover-elevate active-elevate-2 cursor-pointer"
                  onClick={() => setFormData({ ...formData, accommodationPreference: 'central_lisboa' })}
                >
                  <RadioGroupItem value="central_lisboa" id="central_lisboa" data-testid="radio-location-central" />
                  <div className="flex-1">
                    <Label htmlFor="central_lisboa" className="cursor-pointer font-semibold">
                      {t('quiz.q10.central.title')}
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {t('quiz.q10.central.description')}
                    </p>
                  </div>
                </div>
                
                <div 
                  className="flex items-start space-x-3 p-6 rounded-lg border border-border hover-elevate active-elevate-2 cursor-pointer"
                  onClick={() => setFormData({ ...formData, accommodationPreference: 'vinicolas_proximas' })}
                >
                  <RadioGroupItem value="vinicolas_proximas" id="vinicolas_proximas" data-testid="radio-location-wineries" />
                  <div className="flex-1">
                    <Label htmlFor="vinicolas_proximas" className="cursor-pointer font-semibold">
                      {t('quiz.q10.wineries.title')}
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {t('quiz.q10.wineries.description')}
                    </p>
                  </div>
                </div>
                
                <div 
                  className="flex items-start space-x-3 p-6 rounded-lg border border-border hover-elevate active-elevate-2 cursor-pointer"
                  onClick={() => setFormData({ ...formData, accommodationPreference: 'sugestao_equipa' })}
                >
                  <RadioGroupItem value="sugestao_equipa" id="sugestao_equipa" data-testid="radio-location-suggestions" />
                  <div className="flex-1">
                    <Label htmlFor="sugestao_equipa" className="cursor-pointer font-semibold">
                      {t('quiz.q10.openToSuggestions.title')}
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {t('quiz.q10.openToSuggestions.description')}
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </QuizQuestion>
        )}

        {currentStep === 14 && (
          <QuizQuestion
            questionNumber={14}
            totalQuestions={TOTAL_STEPS}
            question={t('quiz.q11.question')}
            onNext={handleNext}
            onBack={handleBack}
            canGoNext={canGoNext()}
            canGoBack={currentStep > 1}
          >
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {t('quiz.q11.info')}
              </p>
              <Textarea
                placeholder={t('quiz.q11.placeholder')}
                className="min-h-[120px]"
                value={formData.specialRequests || ''}
                onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                data-testid="textarea-special-requests"
              />
            </div>
          </QuizQuestion>
        )}

        <ProUpsellBanner className="mt-6" />
      </div>
      </div>
    </div>
  );
}
