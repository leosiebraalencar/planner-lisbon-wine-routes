import { Instagram, Mail } from "lucide-react";
import logoImage from "@assets/marca-lisbon-wine-routes-1_1763141966678.png";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();
  
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
              {t('footer.description')}
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">{t('footer.about')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="https://lisbonwineroutes.com/about" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="link-about"
                >
                  {t('footer.aboutProject')}
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
                  {t('footer.mainBlog')}
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">{t('footer.routes')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="https://lisbonwineroutes.com/category/rota-dos-vinhos/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t('footer.westRoute')}
                </a>
              </li>
              <li>
                <a 
                  href="https://lisbonwineroutes.com/category/enoturismo-em-lisboa/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t('footer.tourism')}
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">{t('footer.contact')}</h3>
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
          <p>© 2025 Lisbon Wine Routes. {t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  );
}
