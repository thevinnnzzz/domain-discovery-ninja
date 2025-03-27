
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Validates if the input is a properly formatted domain name
 */
export function isValidDomain(domain: string): boolean {
  // Remove protocol if present (http://, https://, etc.)
  let domainWithoutProtocol = domain;
  if (domain.includes("://")) {
    domainWithoutProtocol = domain.split("://")[1];
  }
  
  // Remove path and query parameters if present
  if (domainWithoutProtocol.includes("/")) {
    domainWithoutProtocol = domainWithoutProtocol.split("/")[0];
  }
  
  // Basic domain pattern matching
  const domainPattern = /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
  return domainPattern.test(domainWithoutProtocol);
}

/**
 * Formats a domain by removing protocol and trailing slashes
 */
export function formatDomain(domain: string): string {
  // Remove protocol if present
  let formattedDomain = domain;
  if (domain.includes("://")) {
    formattedDomain = domain.split("://")[1];
  }
  
  // Remove trailing slashes
  while (formattedDomain.endsWith("/")) {
    formattedDomain = formattedDomain.slice(0, -1);
  }
  
  // Remove www. if present
  if (formattedDomain.startsWith("www.")) {
    formattedDomain = formattedDomain.substring(4);
  }
  
  return formattedDomain;
}

/**
 * Extracts the favicon for a domain
 */
export function getFavicon(domain: string): string {
  const formattedDomain = formatDomain(domain);
  return `https://www.google.com/s2/favicons?domain=${formattedDomain}&sz=64`;
}

/**
 * Generates a random ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

/**
 * Adds a staggered animation to items based on their index
 */
export function getStaggeredDelay(index: number): string {
  const baseDelay = 0.1;
  const delay = baseDelay + (index * 0.05);
  return `${delay}s`;
}

/**
 * Generates a random gradient for text or backgrounds
 */
export function getRandomGradient(): string {
  const gradients = [
    'linear-gradient(90deg, #4776E6 0%, #8E54E9 100%)',
    'linear-gradient(90deg, #00C9FF 0%, #92FE9D 100%)',
    'linear-gradient(90deg, #FF9A8B 0%, #FF6A88 55%, #FF99AC 100%)',
    'linear-gradient(90deg, #FEE140 0%, #FA709A 100%)',
    'linear-gradient(90deg, #667EEA 0%, #764BA2 100%)',
  ];
  
  return gradients[Math.floor(Math.random() * gradients.length)];
}
