import logoImage from "@assets/marca-lisbon-wine-routes-1_1763141966678.png";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Language } from "@/lib/i18n";

const languages = [
  { code: 'PT' as Language, label: 'Português', flag: '🇵🇹' },
  { code: 'EN' as Language, label: 'English', flag: '🇬🇧' },
  { code: 'ES' as Language, label: 'Español', flag: '🇪🇸' },
  { code: 'DE' as Language, label: 'Deutsch', flag: '🇩🇪' }
];

export default function Header() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="bg-white py-4 md:py-6 border-b border-border">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <a
              href="https://lisbonwineroutes.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors inline-block"
              data-testid="link-main-blog"
            >
              {t('header.visitBlog')}
            </a>
          </div>
          
          <div className="flex-shrink-0">
            <a 
              href="/" 
              className="inline-block"
              onClick={(e) => {
                e.preventDefault();
                window.location.reload();
              }}
              data-testid="link-logo"
            >
              <img 
                src={logoImage} 
                alt="Lisbon Wine Routes" 
                className="h-12 md:h-16 w-auto object-contain"
              />
            </a>
          </div>
          
          <div className="flex-1 flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2" data-testid="button-language">
                  <span className="text-xl">{languages.find(l => l.code === language)?.flag}</span>
                  <span className="hidden sm:inline">{language}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    data-testid={`menuitem-language-${lang.code.toLowerCase()}`}
                    className="gap-2"
                  >
                    <span className="text-xl">{lang.flag}</span>
                    <span>{lang.label}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
