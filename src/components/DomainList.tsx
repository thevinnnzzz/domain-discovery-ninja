
import { useMemo } from "react";
import { Domain, deleteDomain } from "@/lib/db";
import DomainCard from "./DomainCard";

interface DomainListProps {
  domains: Domain[];
  searchQuery: string;
  onUpdate: () => void;
}

const DomainList = ({ domains, searchQuery, onUpdate }: DomainListProps) => {
  const sortedDomains = useMemo(() => {
    return [...domains].sort((a, b) => b.createdAt - a.createdAt);
  }, [domains]);

  const handleDelete = (id: string) => {
    deleteDomain(id);
    onUpdate();
  };

  if (domains.length === 0 && searchQuery) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
          <Search className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">No results found</h3>
        <p className="text-gray-500 text-center max-w-md">
          We couldn't find any domains matching "{searchQuery}". Try different keywords or add a new domain.
        </p>
      </div>
    );
  }

  if (domains.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
          <PlusCircle className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">No domains added yet</h3>
        <p className="text-gray-500 text-center max-w-md">
          Start building your collection by adding your first domain.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
      {sortedDomains.map((domain) => (
        <DomainCard key={domain.id} domain={domain} onDelete={handleDelete} />
      ))}
    </div>
  );
};

import { Search, PlusCircle } from "lucide-react";

export default DomainList;
