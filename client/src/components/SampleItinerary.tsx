import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Clock } from "lucide-react";

export default function SampleItinerary() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="font-serif font-bold text-3xl md:text-4xl text-center mb-4">
          Veja um Exemplo do Que Você Receberá
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Um roteiro detalhado com sugestões para cada período do dia
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-primary" />
                <h3 className="font-serif font-semibold text-lg">Manhã (09:00-12:00)</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Quinta do Gradil</h4>
                      <p className="text-sm text-muted-foreground">Visita guiada às vinhas e caves históricas com degustação de 3 vinhos premiados</p>
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
                <h3 className="font-serif font-semibold text-lg">Tarde (14:00-18:00)</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Adega Regional de Colares</h4>
                      <p className="text-sm text-muted-foreground">Degustação exclusiva do raro vinho de Ramisco em adega centenária</p>
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
                <h3 className="font-serif font-semibold text-lg">Noite (19:00+)</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Restaurante Adega das Gravatas</h4>
                      <p className="text-sm text-muted-foreground">Jantar com pratos típicos portugueses harmonizados com vinhos da região de Bucelas</p>
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
