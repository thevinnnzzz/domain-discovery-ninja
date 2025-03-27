
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
