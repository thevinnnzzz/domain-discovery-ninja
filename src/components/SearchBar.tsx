
import { useState, useEffect } from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  className?: string;
  currentPlaceholder?: string;
}

const SearchBar = ({ onSearch, className = "", currentPlaceholder = "Search for tools, websites, or functionality..." }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
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
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
    setIsTyping(false);
  };

  return (
    <div className={`w-full ${className}`}>
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
          />
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
