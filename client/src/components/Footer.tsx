import { Instagram, Mail } from "lucide-react";
import logoImage from "@assets/marca-lisbon-wine-routes-1_1763141966678.png";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="mb-4">
              <img 
                src={logoImage} 
                alt="Lisbon Wine Routes" 
                className="h-12 w-auto object-contain"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Descobrindo as melhores experiências de enoturismo em Lisboa
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Sobre</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="https://lisbonwineroutes.com/about" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="link-about"
                >
                  Sobre o Projeto
                </a>
              </li>
              <li>
                <a 
                  href="https://lisbonwineroutes.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="link-main-site"
                >
                  Blog Principal
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Rotas</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="https://lisbonwineroutes.com/category/rota-dos-vinhos/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Rota dos Vinhos Oeste
                </a>
              </li>
              <li>
                <a 
                  href="https://lisbonwineroutes.com/category/enoturismo-em-lisboa/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Enoturismo em Lisboa
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Contato</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a 
                  href="mailto:contacto@lisbonwineroutes.com"
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="link-email"
                >
                  <Mail className="w-4 h-4" />
                  contacto@lisbonwineroutes.com
                </a>
              </li>
              <li>
                <a 
                  href="https://www.instagram.com/lisbonwineroutes" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="link-instagram"
                >
                  <Instagram className="w-4 h-4" />
                  @lisbonwineroutes
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>© 2025 Lisbon Wine Routes. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
