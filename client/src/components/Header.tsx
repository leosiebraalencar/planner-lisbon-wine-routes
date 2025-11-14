import { useState } from "react";
import logoImage from "@assets/marca-lisbon-wine-routes-1_1763141966678.png";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";

const languages = [
  { code: 'PT', label: 'Português' },
  { code: 'EN', label: 'English' },
  { code: 'ES', label: 'Español' },
  { code: 'DE', label: 'Deutsch' }
];

export default function Header() {
  const [currentLanguage, setCurrentLanguage] = useState('PT');

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
              Visite nosso blog
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
                  <Globe className="w-4 h-4" />
                  <span className="hidden sm:inline">{currentLanguage}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => {
                      setCurrentLanguage(lang.code);
                      console.log(`Language changed to: ${lang.code}`);
                    }}
                    data-testid={`menuitem-language-${lang.code.toLowerCase()}`}
                  >
                    {lang.code} - {lang.label}
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
