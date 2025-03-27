
import { useState, useEffect } from "react";
import { getDomains, searchDomains, Domain } from "@/lib/db";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import DomainList from "@/components/DomainList";
import DomainForm from "@/components/DomainForm";
import { Plus } from "lucide-react";

const Index = () => {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [typedText, setTypedText] = useState("");
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);

  const phrases = ["Store.", "Search.", "Discover Domains."];
  const placeholders = [
    "Search for a domain...",
    "Find your next idea...",
    "Explore web tools..."
  ];

  useEffect(() => {
    loadDomains();
    
    // Typing animation effect
    let currentPhraseIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    let typingSpeed = 150;
    
    const typeWriter = () => {
      const currentPhrase = phrases[currentPhraseIndex];
      
      if (isDeleting) {
        setTypedText(prev => prev.substring(0, prev.length - 1));
        typingSpeed = 75;
      } else {
        setTypedText(prev => currentPhrase.substring(0, prev.length + 1));
        typingSpeed = 150;
      }
      
      if (!isDeleting && typedText === currentPhrase) {
        // Pause at the end of typing
        typingSpeed = 2000;
        isDeleting = true;
      } else if (isDeleting && typedText === "") {
        isDeleting = false;
        currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
        typingSpeed = 500;
      }
      
      setTimeout(typeWriter, typingSpeed);
    };
    
    const typingTimeout = setTimeout(typeWriter, 1000);
    
    // Placeholder animation effect
    const placeholderInterval = setInterval(() => {
      setCurrentPlaceholderIndex(prev => (prev + 1) % placeholders.length);
    }, 3000);
    
    return () => {
      clearTimeout(typingTimeout);
      clearInterval(placeholderInterval);
    };
  }, []);

  const loadDomains = () => {
    setIsLoading(true);
    // In a real app, this would be an API call
    setTimeout(() => {
      const allDomains = getDomains();
      setDomains(allDomains);
      setIsLoading(false);
    }, 300);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      loadDomains();
    } else {
      const results = searchDomains(query);
      setDomains(results);
    }
  };

  const handleAdd = () => {
    loadDomains();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header onSearch={handleSearch} />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="py-12 md:py-16 lg:py-20 text-center animate-fade-in">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-4">
            <span className="logo-text animate-scale-in">
              <span className="vincent-text">Vincent</span>
              <span className="vault-text glitch-effect">Vault</span>
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8 text-balance dynamic-text">
            <span className="typewriter-text">{typedText}</span>
            <span className="typewriter-cursor">|</span>
          </p>

          <div className="max-w-2xl mx-auto mb-12">
            <SearchBar onSearch={handleSearch} currentPlaceholder={placeholders[currentPlaceholderIndex]} />
          </div>

          <button
            onClick={() => setIsFormOpen(true)}
            className="inline-flex items-center justify-center px-4 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors mb-12 cta-button"
          >
            <Plus size={20} className="mr-2" />
            Add Domain
          </button>

          {isLoading ? (
            <div className="py-12">
              <div className="flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-full border-2 border-transparent border-t-primary animate-spin mb-4"></div>
                <p className="text-gray-500">Loading domains...</p>
              </div>
            </div>
          ) : (
            <DomainList
              domains={domains}
              searchQuery={searchQuery}
              onUpdate={loadDomains}
            />
          )}
        </div>
      </main>

      {isFormOpen && (
        <DomainForm
          onAdd={handleAdd}
          onClose={() => setIsFormOpen(false)}
          isOpen={isFormOpen}
        />
      )}
    </div>
  );
};

export default Index;
