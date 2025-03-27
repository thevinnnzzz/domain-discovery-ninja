
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { getDomains, Domain } from "@/lib/db";
import SearchBar from "@/components/SearchBar";

interface HeaderProps {
  onSearch: (query: string) => void;
}

const Header = ({ onSearch }: HeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [domains, setDomains] = useState<Domain[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    // Load domains for search suggestions
    const loadDomains = () => {
      const allDomains = getDomains();
      setDomains(allDomains);
    };

    loadDomains();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <a href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-semibold animate-logo-text">
                <span className="vincent-text">Vincent</span>
                <span className="vault-text">Vault</span>
              </span>
            </a>
          </div>

          <div className="relative w-full max-w-md mx-4 hidden sm:block">
            <SearchBar 
              onSearch={onSearch}
              className="w-full"
              currentPlaceholder="Search domains or descriptions..."
              domains={domains}
            />
          </div>

          <div className="flex items-center">
            <button className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 cta-button">
              Add Domain
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
