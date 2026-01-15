import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Check, X, Sparkles, Wine, MapPin, Clock, UtensilsCrossed, FileText, Lightbulb, Phone, CloudRain, Headphones } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertProRequestSchema, type InsertProRequest } from "@shared/schema";

const formSchema = insertProRequestSchema.extend({
  preferences: z.string().min(10, "Please provide more details about your preferences"),
}).omit({
  quizData: true,
  referrer: true,
});

type FormData = z.infer<typeof formSchema>;

const features = [
  { key: 'duration', icon: Clock },
  { key: 'wineries', icon: Wine },
  { key: 'map', icon: MapPin },
  { key: 'schedule', icon: Clock },
  { key: 'restaurants', icon: UtensilsCrossed },
  { key: 'pdf', icon: FileText },
  { key: 'insiderTips', icon: Lightbulb },
  { key: 'directContacts', icon: Phone },
  { key: 'planB', icon: CloudRain },
  { key: 'support', icon: Headphones },
];

export default function ProPage() {
  const { t } = useLanguage();
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      duration: '',
      preferences: '',
    },
  });

  const proRequestMutation = useMutation({
    mutationFn: async (data: InsertProRequest) => {
      const response = await apiRequest('/api/pro-request', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return response;
    },
    onSuccess: () => {
      toast({
        title: t('pro.formSuccess').split('!')[0] + '!',
        description: t('pro.formSuccess').split('!')[1] || '',
      });
      form.reset();
    },
    onError: (error) => {
      console.error('Error submitting pro request:', error);
      toast({
        title: "Error",
        description: t('pro.formError'),
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    const storedItinerary = sessionStorage.getItem('currentItinerary');
    const quizData = storedItinerary ? JSON.parse(storedItinerary).quizData : null;

    const proRequestData: InsertProRequest = {
      name: data.name || null,
      email: data.email || null,
      phone: data.phone || null,
      duration: data.duration || null,
      preferences: data.preferences,
      quizData: quizData || null,
      referrer: document.referrer || window.location.href,
    };

    proRequestMutation.mutate(proRequestData);
  };

  const renderValue = (value: string) => {
    if (value === 'Sim' || value === 'Yes' || value === 'Sí' || value === 'Ja') {
      return <Check className="w-5 h-5 text-green-600" />;
    }
    if (value === 'Não' || value === 'No' || value === 'Nein') {
      return <X className="w-5 h-5 text-muted-foreground" />;
    }
    return <span className="text-sm">{value}</span>;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full mb-4">
              <Sparkles className="w-5 h-5" />
              <span className="font-medium">{t('pro.title')}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              {t('pro.headline')}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('pro.description')}
            </p>
          </div>

          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-center">{t('pro.feature')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full" data-testid="table-comparison">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">{t('pro.feature')}</th>
                      <th className="text-center py-3 px-4 font-medium">{t('pro.free')}</th>
                      <th className="text-center py-3 px-4 font-medium bg-accent/5">{t('pro.premium')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {features.map(({ key, icon: Icon }) => (
                      <tr key={key} className="border-b last:border-0">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4 text-muted-foreground" />
                            <span>{t(`pro.features.${key}`)}</span>
                          </div>
                        </td>
                        <td className="text-center py-3 px-4">
                          {renderValue(t(`pro.freeValues.${key}`))}
                        </td>
                        <td className="text-center py-3 px-4 bg-accent/5">
                          {renderValue(t(`pro.premiumValues.${key}`))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-center">{t('pro.formTitle')}</CardTitle>
              <p className="text-center text-muted-foreground">{t('pro.formSubtitle')}</p>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('pro.formName')}</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('pro.formEmail')}</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} data-testid="input-email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('pro.formPhone')}</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-phone" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="duration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('pro.formDuration')}</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-duration" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="preferences"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('pro.formPreferences')}</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            rows={5}
                            placeholder={t('pro.formPreferencesPlaceholder')}
                            data-testid="textarea-preferences"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg"
                    disabled={proRequestMutation.isPending}
                    data-testid="button-submit-pro"
                  >
                    {proRequestMutation.isPending ? t('pro.formSubmitting') : t('pro.formSubmit')}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
