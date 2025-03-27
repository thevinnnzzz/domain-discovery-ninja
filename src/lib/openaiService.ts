
/**
 * Service for OpenAI API integration to power smart search
 */

// API key for OpenAI
const OPENAI_API_KEY = "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";

/**
 * Analyzes a search query and returns enhanced search terms using ChatGPT
 */
export async function enhanceSearchQuery(
  query: string, 
  domainDescriptions: string[]
): Promise<string[]> {
  try {
    const systemPrompt = `
      You are an AI assistant that helps users find relevant domains based on their search queries.
      Your task is to analyze the user's search query and return an array of search terms that would help find relevant domains.
      Include synonyms, related concepts, and alternative phrasings.
      Keep your response concise and focused on extracting search terms.
      Format your response as a JSON array of strings with no explanation.
    `;

    const userPrompt = `
      User search query: "${query}"
      
      Available domain descriptions to search through:
      ${domainDescriptions.join('\n')}
      
      Based on this query, provide an array of search terms that would help find the most relevant domains.
      Include the original query terms, synonyms, related concepts, and alternative phrasings.
      Return ONLY a JSON array of strings.
    `;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.3,
        max_tokens: 150,
      }),
    });

    if (!response.ok) {
      console.error("OpenAI API error:", await response.text());
      return [query]; // Fall back to original query
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    try {
      // Parse the JSON response
      const enhancedTerms = JSON.parse(content);
      return Array.isArray(enhancedTerms) ? enhancedTerms : [query];
    } catch (e) {
      console.error("Failed to parse OpenAI response:", e);
      return [query]; // Fall back to original query
    }
  } catch (error) {
    console.error("Error enhancing search query:", error);
    return [query]; // Fall back to original query
  }
}

/**
 * Analyzes domain descriptions and returns the most relevant domains for a search query
 */
export async function findRelevantDomains(
  query: string,
  domains: { id: string; domain: string; description: string }[]
): Promise<string[]> {
  try {
    const systemPrompt = `
      You are an AI assistant that helps users find relevant domains based on their search queries.
      Your task is to analyze the user's search query and return the IDs of the most relevant domains.
      Base your analysis on semantic meaning, not just exact keyword matches.
      Format your response as a JSON array of domain IDs with no explanation.
    `;

    const domainsInfo = domains.map(d => 
      `ID: ${d.id}, Domain: ${d.domain}, Description: ${d.description}`
    ).join('\n');

    const userPrompt = `
      User search query: "${query}"
      
      Available domains:
      ${domainsInfo}
      
      Analyze the semantic meaning of the query and find the most relevant domains.
      Consider synonyms, related concepts, and the intent behind the search.
      Return ONLY a JSON array of the most relevant domain IDs, with no explanation.
      Limit to maximum 5 domains, ordered by relevance.
    `;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.3,
        max_tokens: 150,
      }),
    });

    if (!response.ok) {
      console.error("OpenAI API error:", await response.text());
      return []; // Return empty array on error
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    try {
      // Parse the JSON response
      const relevantDomainIds = JSON.parse(content);
      return Array.isArray(relevantDomainIds) ? relevantDomainIds : [];
    } catch (e) {
      console.error("Failed to parse OpenAI response:", e);
      return []; // Return empty array on error
    }
  } catch (error) {
    console.error("Error finding relevant domains:", error);
    return []; // Return empty array on error
  }
}
