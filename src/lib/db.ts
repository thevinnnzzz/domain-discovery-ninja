
import { generateId } from './utils';

export interface Domain {
  id: string;
  domain: string;
  description: string;
  createdAt: number;
}

const STORAGE_KEY = 'domain-discovery-ninja-data';

/**
 * Saves a domain to local storage
 */
export function saveDomain(domain: string, description: string): Domain {
  const domains = getDomains();
  
  const newDomain: Domain = {
    id: generateId(),
    domain,
    description,
    createdAt: Date.now(),
  };
  
  domains.push(newDomain);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(domains));
  
  return newDomain;
}

/**
 * Retrieves all domains from local storage
 */
export function getDomains(): Domain[] {
  const storedData = localStorage.getItem(STORAGE_KEY);
  if (!storedData) return [];
  
  try {
    return JSON.parse(storedData);
  } catch (error) {
    console.error('Error parsing domains data:', error);
    return [];
  }
}

/**
 * Deletes a domain from local storage
 */
export function deleteDomain(id: string): void {
  const domains = getDomains();
  const filteredDomains = domains.filter(domain => domain.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredDomains));
}

/**
 * Searches domains based on a query
 */
export function searchDomains(query: string): Domain[] {
  if (!query) return getDomains();
  
  const domains = getDomains();
  const lowerQuery = query.toLowerCase();
  
  return domains.filter(domain => {
    return (
      domain.domain.toLowerCase().includes(lowerQuery) ||
      domain.description.toLowerCase().includes(lowerQuery)
    );
  });
}

/**
 * Checks if a domain already exists
 */
export function domainExists(domain: string): boolean {
  const domains = getDomains();
  const normalizedDomain = domain.toLowerCase();
  
  return domains.some(d => d.domain.toLowerCase() === normalizedDomain);
}
