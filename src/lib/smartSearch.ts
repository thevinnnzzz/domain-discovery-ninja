
import { Domain } from './db';

// Keywords and their synonyms for smart matching
const keywordSynonyms: Record<string, string[]> = {
  'image': ['photo', 'picture', 'img', 'pic', 'visual'],
  'generator': ['creator', 'maker', 'builder', 'tool', 'create', 'make', 'generate', 'build'],
  'editor': ['edit', 'modify', 'change', 'adjust', 'enhance'],
  'ai': ['artificial intelligence', 'machine learning', 'ml', 'automated', 'automatic', 'intelligent'],
  'website': ['site', 'web', 'webpage', 'page', 'online'],
  'video': ['clip', 'film', 'movie', 'animation'],
  'design': ['designer', 'designing', 'style', 'look', 'aesthetic'],
  'search': ['find', 'discover', 'lookup', 'browse', 'explore'],
  'tool': ['utility', 'app', 'application', 'service', 'platform', 'software']
};

// Common intents and their associated keywords
const intentKeywords: Record<string, string[]> = {
  'create_image': ['image generator', 'create image', 'make picture', 'generate photo', 'ai art', 'photo creator'],
  'edit_image': ['image editor', 'photo editing', 'picture enhancement', 'retouch photo', 'edit pictures'],
  'build_website': ['website builder', 'create site', 'web design', 'make website', 'site creator'],
  'video_editing': ['video editor', 'edit clips', 'movie maker', 'video creation', 'film editing'],
  'search_tool': ['search engine', 'finder', 'discovery tool', 'explore content', 'lookup service']
};

/**
 * Expands a search query with synonyms
 */
export function expandQuery(query: string): string[] {
  const words = query.toLowerCase().split(/\s+/);
  const expandedTerms: string[] = [...words];
  
  words.forEach(word => {
    // Look for synonyms for each word
    Object.entries(keywordSynonyms).forEach(([key, synonyms]) => {
      if (word === key || synonyms.includes(word)) {
        // Add the main keyword and all its synonyms except the original word
        expandedTerms.push(key);
        synonyms.forEach(synonym => {
          if (synonym !== word) {
            expandedTerms.push(synonym);
          }
        });
      }
    });
  });
  
  // Add potential intent-based keywords
  Object.entries(intentKeywords).forEach(([intent, keywords]) => {
    keywords.forEach(keyword => {
      // If the query contains all words in the intent keyword phrase
      const keywordWords = keyword.toLowerCase().split(/\s+/);
      if (keywordWords.every(word => 
          words.some(queryWord => queryWord.includes(word) || word.includes(queryWord)))) {
        // Add all keywords for this intent
        keywords.forEach(k => {
          if (!expandedTerms.includes(k)) {
            expandedTerms.push(k);
          }
        });
      }
    });
  });
  
  return [...new Set(expandedTerms)]; // Remove duplicates
}

/**
 * Calculates the relevance score between a domain and a search query
 */
export function calculateRelevance(domain: Domain, searchTerms: string[]): number {
  const { domain: domainName, description } = domain;
  const domainText = `${domainName} ${description}`.toLowerCase();
  
  let score = 0;
  
  // Exact match bonus
  searchTerms.forEach(term => {
    if (domainText.includes(term)) {
      score += 10;
      
      // Bonus points for matches in the domain name
      if (domainName.toLowerCase().includes(term)) {
        score += 5;
      }
      
      // Higher score for exact word matches (with word boundaries)
      const wordRegex = new RegExp(`\\b${term}\\b`, 'i');
      if (wordRegex.test(domainText)) {
        score += 5;
      }
    }
  });
  
  // Fuzzy matching for partial matches
  searchTerms.forEach(term => {
    if (term.length >= 3) {  // Only for terms with at least 3 characters
      // Count partial matches
      for (let i = 0; i < term.length - 2; i++) {
        const partial = term.substring(i, i + 3);
        if (domainText.includes(partial)) {
          score += 1;
        }
      }
    }
  });
  
  // Intent-based matching
  Object.entries(intentKeywords).forEach(([intent, keywords]) => {
    // Check if search terms match the intent keywords
    const intentMatched = keywords.some(keyword => 
      searchTerms.some(term => keyword.includes(term) || term.includes(keyword)));
      
    if (intentMatched) {
      // Check if domain matches the intent
      const domainMatchesIntent = keywords.some(keyword => domainText.includes(keyword));
      if (domainMatchesIntent) {
        score += 15; // Significant boost for intent match
      }
    }
  });
  
  return score;
}

/**
 * Performs a smart search on domains
 */
export function smartSearch(domains: Domain[], query: string): Domain[] {
  if (!query.trim()) return domains;
  
  // Expand the query with synonyms and intent-based keywords
  const expandedTerms = expandQuery(query.toLowerCase());
  
  // Calculate relevance score for each domain
  const scoredDomains = domains.map(domain => ({
    domain,
    score: calculateRelevance(domain, expandedTerms)
  }));
  
  // Filter domains with any relevance and sort by score
  return scoredDomains
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(item => item.domain);
}

/**
 * Provides auto-suggestions based on the query
 */
export function getSuggestions(domains: Domain[], query: string, limit = 5): Domain[] {
  if (!query.trim() || query.length < 2) return [];
  
  // Get smart search results
  const results = smartSearch(domains, query);
  
  // Return the top N results
  return results.slice(0, limit);
}
