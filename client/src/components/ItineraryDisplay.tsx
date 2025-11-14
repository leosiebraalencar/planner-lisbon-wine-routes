import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Calendar, Download, DollarSign } from "lucide-react";
import type { Itinerary } from "@shared/schema";

interface ItineraryDisplayProps {
  itinerary: Itinerary;
  onDownload: () => void;
}

export default function ItineraryDisplay({ itinerary, onDownload }: ItineraryDisplayProps) {
  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="font-serif font-bold text-3xl md:text-4xl mb-4">
          Seu Roteiro Personalizado de Enoturismo
        </h1>
        <p className="text-muted-foreground">
          Um guia completo criado especialmente para você
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-primary" />
              <div>
                <div className="text-sm text-muted-foreground">Duração</div>
                <div className="font-semibold">{itinerary.days.length} dias</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <DollarSign className="w-5 h-5 text-primary" />
              <div>
                <div className="text-sm text-muted-foreground">Orçamento</div>
                <div className="font-semibold capitalize">{itinerary.quizData.budget}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-primary" />
              <div>
                <div className="text-sm text-muted-foreground">Tipo de Viagem</div>
                <div className="font-semibold capitalize">{itinerary.quizData.travelers}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="border-border mb-8">
        <CardHeader>
          <CardTitle className="font-serif">Destaques do Roteiro</CardTitle>
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
          <CardTitle className="font-serif">Roteiro Dia a Dia</CardTitle>
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
                      <div className="font-serif font-semibold">Dia {day.day}</div>
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
                          <h4 className="font-semibold">Manhã</h4>
                          <span className="text-sm text-muted-foreground">{day.morning.time}</span>
                        </div>
                        <div className="bg-card p-4 rounded-lg">
                          <div className="font-medium mb-1">{day.morning.location}</div>
                          <div className="text-sm text-muted-foreground mb-2">{day.morning.activity}</div>
                          <p className="text-sm">{day.morning.description}</p>
                          <div className="text-sm text-muted-foreground mt-2">Duração: {day.morning.duration}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">Tarde</h4>
                          <span className="text-sm text-muted-foreground">{day.afternoon.time}</span>
                        </div>
                        <div className="bg-card p-4 rounded-lg">
                          <div className="font-medium mb-1">{day.afternoon.location}</div>
                          <div className="text-sm text-muted-foreground mb-2">{day.afternoon.activity}</div>
                          <p className="text-sm">{day.afternoon.description}</p>
                          <div className="text-sm text-muted-foreground mt-2">Duração: {day.afternoon.duration}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">Noite</h4>
                          <span className="text-sm text-muted-foreground">{day.evening.time}</span>
                        </div>
                        <div className="bg-card p-4 rounded-lg">
                          <div className="font-medium mb-1">{day.evening.location}</div>
                          <div className="text-sm text-muted-foreground mb-2">{day.evening.activity}</div>
                          <p className="text-sm">{day.evening.description}</p>
                          <div className="text-sm text-muted-foreground mt-2">Duração: {day.evening.duration}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
      
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-8 text-center">
          <h3 className="font-serif font-bold text-2xl mb-4">
            Gostou do Seu Roteiro?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Faça o download do guia completo em PDF com todas as informações, mapas e contatos. 
            Pague o que achar justo (mínimo $1 USD).
          </p>
          <Button 
            size="lg" 
            onClick={onDownload}
            className="px-8"
            data-testid="button-download-itinerary"
          >
            <Download className="w-4 h-4 mr-2" />
            Baixar Roteiro Completo (PDF)
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
