import { useState } from "react";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import QuizProgress from "@/components/QuizProgress";
import QuizQuestion from "@/components/QuizQuestion";
import ProUpsellBanner from "@/components/ProUpsellBanner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Users, User, UsersRound, Home, Plane, Train, Car, CircleDot } from "lucide-react";
import type { QuizResponse } from "@shared/schema";

interface QuizPageProps {
  onComplete: (data: QuizResponse) => void;
}

const TOTAL_STEPS = 6;

const preferences = [
  "Vinícolas históricas",
  "Degustações exclusivas",
  "Gastronomia local",
  "Paisagens e fotografia",
  "Experiências em família",
  "Tours guiados",
  "Produção sustentável",
  "Vinhos biodinâmicos"
];

export default function QuizPage({ onComplete }: QuizPageProps) {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<QuizResponse>>({
    duration: 3,
    budget: 'moderado',
    travelers: 'casal',
    preferences: [],
    specialRequests: ''
  });

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(formData as QuizResponse);
      setLocation('/itinerary');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canGoNext = () => {
    switch (currentStep) {
      case 1:
        return formData.duration !== undefined;
      case 2:
        return true;
      case 3:
        return formData.budget !== undefined;
      case 4:
        return formData.travelers !== undefined;
      case 5:
        return (formData.preferences?.length ?? 0) > 0;
      case 6:
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <QuizProgress currentStep={currentStep} totalSteps={TOTAL_STEPS} />
        
        {currentStep === 1 && (
          <QuizQuestion
            questionNumber={1}
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
              {[1, 2, 3, 4, 5, 6, 7].map((day) => (
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

        {currentStep === 2 && (
          <QuizQuestion
            questionNumber={2}
            totalQuestions={TOTAL_STEPS}
            question="Quando você pretende viajar?"
            onNext={handleNext}
            onBack={handleBack}
            canGoNext={canGoNext()}
            canGoBack={currentStep > 1}
          >
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Esta informação é opcional e nos ajuda a sugerir experiências sazonais
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start-date" className="mb-2 block">Data de Início</Label>
                  <input
                    id="start-date"
                    type="date"
                    className="w-full px-4 py-3 rounded-lg border border-input bg-background"
                    value={formData.startDate || ''}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
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
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    data-testid="input-end-date"
                  />
                </div>
              </div>
            </div>
          </QuizQuestion>
        )}

        {currentStep === 3 && (
          <QuizQuestion
            questionNumber={3}
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

        {currentStep === 4 && (
          <QuizQuestion
            questionNumber={4}
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
          </QuizQuestion>
        )}

        {currentStep === 5 && (
          <QuizQuestion
            questionNumber={5}
            totalQuestions={TOTAL_STEPS}
            question="O que você mais gosta em enoturismo?"
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

        {currentStep === 6 && (
          <QuizQuestion
            questionNumber={6}
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
