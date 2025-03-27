
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

  useEffect(() => {
    loadDomains();
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
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
              Domain Discovery
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8 text-balance">
            Store, organize, and discover website domains with powerful search capabilities.
          </p>

          <div className="max-w-2xl mx-auto mb-12">
            <SearchBar onSearch={handleSearch} />
          </div>

          <button
            onClick={() => setIsFormOpen(true)}
            className="inline-flex items-center justify-center px-4 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors mb-12"
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
