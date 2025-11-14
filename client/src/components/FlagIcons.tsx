interface FlagProps {
  className?: string;
}

export function PortugalFlag({ className = "w-4 h-3" }: FlagProps) {
  return (
    <svg className={className} viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="400" fill="#060"/>
      <rect width="240" height="400" fill="#f00"/>
      <circle cx="240" cy="200" r="80" fill="#ff0" stroke="#00f" strokeWidth="8"/>
    </svg>
  );
}

export function UKFlag({ className = "w-4 h-3" }: FlagProps) {
  return (
    <svg className={className} viewBox="0 0 60 30" xmlns="http://www.w3.org/2000/svg">
      <clipPath id="t">
        <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/>
      </clipPath>
      <path d="M0,0 v30 h60 v-30 z" fill="#012169"/>
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
      <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#t)" stroke="#C8102E" strokeWidth="4"/>
      <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/>
      <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6"/>
    </svg>
  );
}

export function SpainFlag({ className = "w-4 h-3" }: FlagProps) {
  return (
    <svg className={className} viewBox="0 0 750 500" xmlns="http://www.w3.org/2000/svg">
      <rect width="750" height="500" fill="#c60b1e"/>
      <rect width="750" height="250" y="125" fill="#ffc400"/>
    </svg>
  );
}

export function GermanyFlag({ className = "w-4 h-3" }: FlagProps) {
  return (
    <svg className={className} viewBox="0 0 5 3" xmlns="http://www.w3.org/2000/svg">
      <rect width="5" height="3" fill="#000"/>
      <rect width="5" height="2" y="1" fill="#D00"/>
      <rect width="5" height="1" y="2" fill="#FFCE00"/>
    </svg>
  );
}
