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

const TOTAL_STEPS = 13;

const preferences = [
  "Degustações e vinhos exclusivos",
  "Gastronomia portuguesa tradicional",
  "Gastronomia internacional e fusion",
  "Experiências em vinícolas históricas",
  "Paisagens, natureza e fotografia",
  "Experiências em família com crianças",
  "Vinhos biodinâmicos e sustentáveis",
  "Tours guiados com sommelier",
  "Hotéis modernos e contemporâneos",
  "Hotéis rústicos e rurais",
  "Hotéis históricos e palacetes",
  "Ficar num único local durante toda a viagem",
  "Explorar diferentes locais e mudar de hotel",
];

const arrivalOptions = [
  { value: 'aviao', label: 'Avião', icon: Plane },
  { value: 'trem', label: 'Trem', icon: Train },
  { value: 'carro', label: 'Carro próprio', icon: Car },
  { value: 'ja_em_lisboa', label: 'Já em Lisboa', icon: MapPin },
  { value: 'outros', label: 'Outros', icon: CircleDot },
];

const languageOptions = [
  { value: 'portugues', label: 'Português' },
  { value: 'ingles', label: 'Inglês' },
  { value: 'espanhol', label: 'Espanhol' },
  { value: 'frances', label: 'Francês' },
  { value: 'alemao', label: 'Alemão' },
];

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
    hasAccommodation: undefined,
    accommodationPreference: undefined
  });

  const handleNext = () => {
    let nextStep = currentStep + 1;
    if (currentStep === 11 && formData.hasAccommodation) {
      nextStep = 13;
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
    if (currentStep === 13 && formData.hasAccommodation) {
      prevStep = 11;
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
        return formData.duration !== undefined;
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
        return formData.arrival !== undefined;
      case 9:
        return formData.needsCarRental !== undefined;
      case 10:
        return formData.wantsPrivateGuide !== undefined;
      case 11:
        return formData.hasAccommodation !== undefined;
      case 12:
        return formData.hasAccommodation || formData.accommodationPreference !== undefined;
      case 13:
        return true;
      default:
        return false;
    }
  };

  const travelerOptions = [
    { value: 'sozinho', label: 'Sozinho(a)', icon: User },
    { value: 'casal', label: 'Em Casal', icon: Users },
    { value: 'familia', label: 'Em Família', icon: Home },
    { value: 'grupo', label: 'Em Grupo', icon: UsersRound }
  ];

  const { language, t } = useLanguage();
  const seo = getSeoData('quiz', language);

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
            question="Quantos dias durará sua viagem?"
            onNext={handleNext}
            onBack={handleBack}
            canGoNext={canGoNext()}
            canGoBack={currentStep > 1}
          >
            <RadioGroup 
              value={String(formData.duration)} 
              onValueChange={(value) => setFormData({ ...formData, duration: parseInt(value) })}
            >
              {[1, 2, 3, 4, 5].map((day) => (
                <div 
                  key={day} 
                  className="flex items-center space-x-3 p-4 rounded-lg border border-border hover-elevate active-elevate-2 cursor-pointer"
                  onClick={() => setFormData({ ...formData, duration: day })}
                >
                  <RadioGroupItem value={String(day)} id={`day-${day}`} data-testid={`radio-duration-${day}`} />
                  <Label htmlFor={`day-${day}`} className="cursor-pointer flex-1">
                    {day === 1 ? '1 dia' : `${day} dias`}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </QuizQuestion>
        )}

        {currentStep === 3 && (
          <QuizQuestion
            questionNumber={3}
            totalQuestions={TOTAL_STEPS}
            question="Quando você pretende viajar?"
            onNext={handleNext}
            onBack={handleBack}
            canGoNext={canGoNext()}
            canGoBack={currentStep > 1}
          >
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Selecione as datas da sua viagem
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start-date" className="mb-2 block">Data de Início</Label>
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
                  <Label htmlFor="end-date" className="mb-2 block">Data de Término</Label>
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
            question="Qual é o seu orçamento?"
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
                    Econômico
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Adegas familiares, degustações simples, restaurantes locais
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
                    Moderado
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Quintas renomadas, tours guiados, harmonizações gastronômicas
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
                    Premium
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Experiências exclusivas, vinhos raros, restaurantes com estrela Michelin
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
            question="Como você vai viajar?"
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
                <Label>Quantas pessoas no grupo?</Label>
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
                      <p className="text-sm">Para grupos superiores a 100 pessoas, aconselhamos entrar em contacto com:</p>
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
            question="Qual idioma de preferência para as experiências?"
            onNext={handleNext}
            onBack={handleBack}
            canGoNext={canGoNext()}
            canGoBack={currentStep > 1}
          >
            <RadioGroup 
              value={formData.languagePreference} 
              onValueChange={(value: any) => setFormData({ ...formData, languagePreference: value })}
            >
              {languageOptions.map((option) => (
                <div 
                  key={option.value}
                  className="flex items-center space-x-3 p-4 rounded-lg border border-border hover-elevate active-elevate-2 cursor-pointer"
                  onClick={() => setFormData({ ...formData, languagePreference: option.value as any })}
                >
                  <RadioGroupItem value={option.value} id={`lang-${option.value}`} data-testid={`radio-language-${option.value}`} />
                  <Label htmlFor={`lang-${option.value}`} className="cursor-pointer flex-1 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    {option.label}
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
            question="O que você mais procura na sua viagem?"
            onNext={handleNext}
            onBack={handleBack}
            canGoNext={canGoNext()}
            canGoBack={currentStep > 1}
          >
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground mb-4">
                Selecione todas as opções que lhe interessam
              </p>
              {preferences.map((pref) => {
                const isChecked = formData.preferences?.includes(pref);
                return (
                  <div 
                    key={pref} 
                    className={`flex items-center space-x-3 p-4 rounded-lg border border-border hover-elevate active-elevate-2 cursor-pointer ${
                      isChecked ? 'bg-primary/5 border-primary/20' : ''
                    }`}
                    onClick={() => {
                      const current = formData.preferences || [];
                      const updated = current.includes(pref)
                        ? current.filter(p => p !== pref)
                        : [...current, pref];
                      setFormData({ ...formData, preferences: updated });
                    }}
                  >
                    <Checkbox 
                      id={pref} 
                      checked={isChecked}
                      onCheckedChange={(checked) => {
                        const current = formData.preferences || [];
                        const updated = checked
                          ? [...current, pref]
                          : current.filter(p => p !== pref);
                        setFormData({ ...formData, preferences: updated });
                      }}
                      data-testid={`checkbox-preference-${pref.toLowerCase().replace(/\s+/g, '-')}`}
                    />
                    <Label htmlFor={pref} className="cursor-pointer flex-1">
                      {pref}
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
            question="Como você vai chegar a Lisboa?"
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

        {currentStep === 9 && (
          <QuizQuestion
            questionNumber={9}
            totalQuestions={TOTAL_STEPS}
            question="Precisa de aluguel de carro?"
            onNext={handleNext}
            onBack={handleBack}
            canGoNext={canGoNext()}
            canGoBack={currentStep > 1}
          >
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground mb-4">
                Recomendamos carro para visitar as vinícolas com mais flexibilidade
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
                      Sim, preciso
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
                      Não preciso
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </QuizQuestion>
        )}

        {currentStep === 10 && (
          <QuizQuestion
            questionNumber={10}
            totalQuestions={TOTAL_STEPS}
            question="Gostaria de um guia privado?"
            onNext={handleNext}
            onBack={handleBack}
            canGoNext={canGoNext()}
            canGoBack={currentStep > 1}
          >
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground mb-4">
                Um guia especializado pode enriquecer sua experiência com conhecimentos locais
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
                      Sim, quero
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
                      Não preciso
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
            question="Já tem alojamento reservado?"
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
                    Sim, já tenho
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
                    Preciso de sugestões
                  </div>
                </CardContent>
              </Card>
            </div>
          </QuizQuestion>
        )}

        {currentStep === 12 && !formData.hasAccommodation && (
          <QuizQuestion
            questionNumber={12}
            totalQuestions={TOTAL_STEPS}
            question="Onde prefere se hospedar?"
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
                      Centro de Lisboa
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Ideal para explorar a cidade e fazer day-trips às vinícolas
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
                      Perto das Vinícolas
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Mergulhe na experiência enoturística com hotéis em quintas
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </QuizQuestion>
        )}

        {currentStep === 13 && (
          <QuizQuestion
            questionNumber={13}
            totalQuestions={TOTAL_STEPS}
            question="Alguma preferência especial?"
            onNext={handleNext}
            onBack={handleBack}
            canGoNext={canGoNext()}
            canGoBack={currentStep > 1}
          >
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Compartilhe qualquer informação adicional que possa nos ajudar a personalizar seu roteiro
              </p>
              <Textarea
                placeholder="Ex: Preferência por vinhos tintos, restrições alimentares, interesse em vinhos orgânicos..."
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
