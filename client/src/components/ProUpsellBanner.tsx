import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { Sparkles } from "lucide-react";

interface ProUpsellBannerProps {
  variant?: 'minimal' | 'card';
  className?: string;
}

export default function ProUpsellBanner({ variant = 'minimal', className = '' }: ProUpsellBannerProps) {
  const { t } = useLanguage();

  if (variant === 'card') {
    return (
      <div className={`bg-accent/10 border border-accent/20 rounded-md p-4 ${className}`}>
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-foreground/80">
              {t('proUpsell.message')}
            </p>
            <Link 
              href="/pro"
              className="text-sm text-accent hover:underline mt-2 inline-block"
              data-testid="link-compare-pro"
            >
              {t('proUpsell.compare')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`text-center py-3 ${className}`}>
      <p className="text-sm text-foreground/70">
        <Sparkles className="w-4 h-4 inline-block mr-1 text-accent" />
        {t('proUpsell.message')}
        {' '}
        <Link 
          href="/pro"
          className="text-accent hover:underline"
          data-testid="link-compare-pro"
        >
          {t('proUpsell.compare')}
        </Link>
      </p>
    </div>
  );
}
