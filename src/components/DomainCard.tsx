
import { useState } from "react";
import { Domain } from "@/lib/db";
import { getFavicon } from "@/lib/utils";
import { X } from "lucide-react";

interface DomainCardProps {
  domain: Domain;
  onDelete: (id: string) => void;
}

const DomainCard = ({ domain, onDelete }: DomainCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const faviconUrl = getFavicon(domain.domain);
  
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (window.confirm(`Are you sure you want to delete ${domain.domain}?`)) {
      onDelete(domain.id);
    }
  };
  
  const handleVisit = () => {
    window.open(`https://${domain.domain}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div 
      className="glass-card overflow-hidden group cursor-pointer hover:shadow-lg"
      onClick={handleVisit}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative p-5">
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleDelete}
            className="p-1 rounded-full hover:bg-gray-200 transition-colors"
            aria-label="Delete domain"
          >
            <X size={16} className="text-gray-500" />
          </button>
        </div>
        
        <div className="flex items-center">
          <div className="relative w-10 h-10 mr-3 rounded-full overflow-hidden bg-gray-100">
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse">
                <span className="text-lg font-medium text-gray-400">
                  {domain.domain.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <img
              src={faviconUrl}
              alt={domain.domain}
              className={`w-full h-full object-cover ${imageLoaded ? '' : 'opacity-0'}`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageLoaded(false)}
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-medium text-gray-900 truncate">
              {domain.domain}
            </h3>
            <div className="flex items-center mt-1">
              <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full">
                {domain.domain.split('.').pop()}
              </span>
            </div>
          </div>
        </div>
        
        <p className="mt-3 text-sm text-gray-600 line-clamp-3">
          {domain.description}
        </p>
        
        <div className={`mt-4 text-xs text-right text-gray-400 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          Click to visit site
        </div>
      </div>
    </div>
  );
};

export default DomainCard;
