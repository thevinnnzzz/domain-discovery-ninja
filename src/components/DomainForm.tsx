
import { useState } from "react";
import { isValidDomain, formatDomain } from "@/lib/utils";
import { saveDomain, domainExists } from "@/lib/db";
import { X } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface DomainFormProps {
  onAdd: (domain: any) => void;
  onClose: () => void;
  isOpen: boolean;
}

const DomainForm = ({ onAdd, onClose, isOpen }: DomainFormProps) => {
  const [domain, setDomain] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate domain
    if (!domain.trim()) {
      setError("Domain is required");
      return;
    }

    if (!isValidDomain(domain)) {
      setError("Please enter a valid domain (e.g., example.com)");
      return;
    }

    // Validate description
    if (!description.trim()) {
      setError("Description is required");
      return;
    }

    const formattedDomain = formatDomain(domain);

    // Check if domain already exists
    if (domainExists(formattedDomain)) {
      setError("This domain already exists in your collection");
      return;
    }

    setIsLoading(true);

    try {
      // Save domain to storage
      const newDomain = saveDomain(formattedDomain, description);
      
      // Show success message
      toast({
        title: "Domain added",
        description: `${formattedDomain} has been added to your collection.`,
      });
      
      // Reset form
      setDomain("");
      setDescription("");
      
      // Notify parent component
      onAdd(newDomain);
      onClose();
    } catch (err) {
      setError("Failed to add domain. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in">
      <div className="w-full max-w-md glass-card p-6 animate-scale-in">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Add New Domain</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="domain"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Domain
              </label>
              <input
                id="domain"
                type="text"
                placeholder="e.g., example.com"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="w-full px-4 py-2 rounded-lg glass-input text-sm"
                disabled={isLoading}
              />
              <p className="mt-1 text-xs text-gray-500">
                Enter a valid domain name (e.g., example.com) or URL (https://example.com)
              </p>
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description
              </label>
              <textarea
                id="description"
                placeholder="What does this website do? Be descriptive for better search results."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 rounded-lg glass-input text-sm min-h-[100px]"
                disabled={isLoading}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary rounded-lg text-sm font-medium text-white hover:bg-primary/90 transition-colors disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? "Adding..." : "Add Domain"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DomainForm;
