import logoImage from "@assets/screenshot-1763139281462.png";
import { Compass } from "lucide-react";

interface HeaderProps {
  transparent?: boolean;
}

export default function Header({ transparent = false }: HeaderProps) {
  return (
    <header className={`${transparent ? 'absolute top-0 left-0 right-0 z-20' : 'border-b border-border'} py-4`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between">
          <a 
            href="/" 
            className="flex items-center gap-3"
            onClick={(e) => {
              e.preventDefault();
              window.location.reload();
            }}
            data-testid="link-logo"
          >
            <img 
              src={logoImage} 
              alt="Lisbon Wine Routes" 
              className="h-12 w-auto object-contain"
            />
          </a>
          
          <a
            href="https://lisbonwineroutes.com"
            target="_blank"
            rel="noopener noreferrer"
            className={`text-sm font-medium ${transparent ? 'text-white hover:text-white/80' : 'text-foreground hover:text-primary'} transition-colors`}
            data-testid="link-main-blog"
          >
            Visite o Blog
          </a>
        </div>
      </div>
    </header>
  );
}
