
import { generateId } from './utils';
import { smartSearch } from './smartSearch';
import { enhanceSearchQuery, findRelevantDomains } from './openaiService';

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
 * Searches domains based on a query using smart search
 */
export function searchDomains(query: string): Domain[] {
  if (!query) return getDomains();
  
  const domains = getDomains();
  
  // Use the smartSearch function for intelligent searching
  return smartSearch(domains, query);
}

/**
 * Searches domains based on a query using ChatGPT-powered search
 */
export async function aiSearchDomains(query: string): Promise<Domain[]> {
  if (!query) return getDomains();
  
  const domains = getDomains();
  if (domains.length === 0) return [];
  
  try {
    // Get domain descriptions for context
    const descriptions = domains.map(d => d.description);
    
    // First approach: Enhance the search query with AI-generated terms
    const enhancedTerms = await enhanceSearchQuery(query, descriptions);
    let results = smartSearch(domains, enhancedTerms.join(' '));
    
    // If no results or very few, try the second approach
    if (results.length < 2) {
      // Second approach: Get AI to directly analyze and find relevant domains
      const relevantDomainIds = await findRelevantDomains(query, domains);
      
      // Map IDs back to domain objects
      const aiResults = relevantDomainIds
        .map(id => domains.find(d => d.id === id))
        .filter(Boolean) as Domain[];
      
      // Combine results, removing duplicates
      const combinedIds = new Set([...results.map(d => d.id), ...aiResults.map(d => d.id)]);
      results = Array.from(combinedIds)
        .map(id => domains.find(d => d.id === id))
        .filter(Boolean) as Domain[];
    }
    
    return results;
  } catch (error) {
    console.error('Error in AI search:', error);
    // Fallback to regular smart search
    return smartSearch(domains, query);
  }
}

/**
 * Checks if a domain already exists
 */
export function domainExists(domain: string): boolean {
  const domains = getDomains();
  const normalizedDomain = domain.toLowerCase();
  
  return domains.some(d => d.domain.toLowerCase() === normalizedDomain);
}
