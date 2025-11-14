import logoImage from "@assets/marca-lisbon-wine-routes-1_1763141599781.png";

export default function Header() {
  return (
    <header className="bg-white py-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-center">
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
              className="h-16 md:h-20 w-auto object-contain"
            />
          </a>
        </div>
      </div>
    </header>
  );
}
