
import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { Domain } from "@/lib/db";
import { getSuggestions } from "@/lib/smartSearch";

interface SearchBarProps {
  onSearch: (query: string) => void;
  className?: string;
  currentPlaceholder?: string;
  domains?: Domain[];
  onSelectSuggestion?: (domain: Domain) => void;
}

const SearchBar = ({ 
  onSearch, 
  className = "", 
  currentPlaceholder = "Search for tools, websites, or functionality...",
  domains = [],
  onSelectSuggestion
}: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState<Domain[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionRef = useRef<HTMLDivElement>(null);
  
  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Update suggestions as user types
  useEffect(() => {
    if (query.trim().length > 1 && domains.length > 0) {
      const newSuggestions = getSuggestions(domains, query);
      setSuggestions(newSuggestions);
      setShowSuggestions(newSuggestions.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query, domains]);
  
  // Handle debounced search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query !== "") {
        onSearch(query);
        setIsTyping(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query, onSearch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsTyping(true);
    
    // If query is empty, immediately search to show all results
    if (e.target.value === "") {
      onSearch("");
      setIsTyping(false);
      setShowSuggestions(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
    setIsTyping(false);
    setShowSuggestions(false);
  };
  
  const handleSuggestionClick = (domain: Domain) => {
    if (onSelectSuggestion) {
      onSelectSuggestion(domain);
    } else {
      // If no selection handler provided, just search for the domain name
      setQuery(domain.domain);
      onSearch(domain.domain);
    }
    setShowSuggestions(false);
  };

  return (
    <div className={`w-full ${className}`} ref={suggestionRef}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search
            className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors ${
              isTyping ? "text-primary" : "text-gray-400"
            }`}
            size={20}
          />
          <input
            type="text"
            placeholder={currentPlaceholder}
            value={query}
            onChange={handleChange}
            className="w-full py-3 pl-12 pr-4 glass-input rounded-2xl text-base shadow-sm transition-all duration-300 focus:shadow-md animated-placeholder"
            onFocus={() => query.trim().length > 1 && suggestions.length > 0 && setShowSuggestions(true)}
          />
        </div>
        
        {/* Auto-suggestions dropdown */}
        {showSuggestions && (
          <div className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-100 max-h-60 overflow-y-auto">
            {suggestions.map((domain, index) => (
              <div 
                key={domain.id}
                className="px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors flex items-center"
                onClick={() => handleSuggestionClick(domain)}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="w-8 h-8 mr-3 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                  <span className="text-lg font-medium text-gray-400">
                    {domain.domain.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">{domain.domain}</p>
                  <p className="text-xs text-gray-500 truncate">{domain.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchBar;
