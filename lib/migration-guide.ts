/**
 * Migration Guide - Simple search and content access
 */

import { readFile } from 'fs/promises';
import { join } from 'path';

interface SearchResult {
  title: string;
  content: string;
  relevance: number;
}

let guide: string | null = null;

async function getGuideContent(): Promise<string> {
  if (guide) {
    return guide;
  }
  
  const guidePath = join(process.cwd(), 'lib', 'source-material', 'migration-guide.md');
  guide = await readFile(guidePath, 'utf-8');
  return guide;
}

/**
 * Search the migration guide for relevant information
 * Returns granular subsections (h2, h3, h4) as separate results
 */
export async function searchGuide(query: string): Promise<SearchResult[]> {
  const content = await getGuideContent();
  const results: SearchResult[] = [];
  
  // Split by any heading level (##, ###, ####) - most granular approach
  // This regex splits before any line that starts with ## (2+ #s)
  const sections = content.split(/(?=^#{2,}\s)/m);
  
  const normalizedQuery = query.toLowerCase();
  const queryWords = normalizedQuery.split(/\s+/).filter(w => w.length > 2);
  
  for (const section of sections) {
    if (!section.trim()) continue;
    
    const lines = section.split('\n');
    const firstLine = lines[0] || '';
    
    // Extract the heading (with #s) and the title
    const headingMatch = firstLine.match(/^(#{2,})\s+(.+)$/);
    if (!headingMatch) continue;
    
    const headingLevel = headingMatch[1]; // ##, ###, or ####
    const title = headingMatch[2].trim();
    
    // Calculate relevance
    let relevance = 0;
    const sectionLower = section.toLowerCase();
    const titleLower = title.toLowerCase();
    
    // Exact phrase match in title (highest)
    if (titleLower.includes(normalizedQuery)) {
      relevance += 100;
    }
    
    // Word matches in title
    for (const word of queryWords) {
      if (titleLower.includes(word)) {
        relevance += 50;
      }
    }
    
    // Exact phrase match in content
    if (sectionLower.includes(normalizedQuery)) {
      relevance += 30;
    }
    
    // Word matches in content
    for (const word of queryWords) {
      const count = (sectionLower.match(new RegExp(word, 'g')) || []).length;
      relevance += count * 10;
    }
    
    if (relevance > 0) {
      results.push({
        title: `${headingLevel} ${title}`, // Include heading level in title
        content: section.trim(),
        relevance
      });
    }
  }
  
  // Sort by relevance
  results.sort((a, b) => b.relevance - a.relevance);
  
  return results;
}

/**
 * Get the full migration guide content
 */
export async function getFullGuide(): Promise<string> {
  return await getGuideContent();
}

// Data migration guide handling
let dataGuide: string | null = null;

async function getDataGuideContent(): Promise<string> {
  if (dataGuide) {
    return dataGuide;
  }

  const guidePath = join(process.cwd(), 'lib', 'source-material', 'migration-guide-data.md');
  dataGuide = await readFile(guidePath, 'utf-8');
  return dataGuide;
}

/**
 * Search the data migration guide for relevant information
 * Uses step-based search logic for linear/procedural guide
 */
export async function searchDataGuide(query: string): Promise<SearchResult[]> {
  const content = await getDataGuideContent();
  const results: SearchResult[] = [];

  // Split by Phase or Step markers - this is a linear guide
  // Match: "## Phase X:" or "### Step X:"
  const sections = content.split(/(?=^#{2,3}\s+(?:Phase|Step)\s+)/m);

  const normalizedQuery = query.toLowerCase();
  const queryWords = normalizedQuery.split(/\s+/).filter(w => w.length > 2);

  for (const section of sections) {
    if (!section.trim()) continue;

    const lines = section.split('\n');
    const firstLine = lines[0] || '';

    // Extract the heading
    const headingMatch = firstLine.match(/^(#{2,3})\s+(.+)$/);
    if (!headingMatch) continue;

    const headingLevel = headingMatch[1];
    const title = headingMatch[2].trim();

    // Calculate relevance for procedural content
    let relevance = 0;
    const sectionLower = section.toLowerCase();
    const titleLower = title.toLowerCase();

    // Exact phrase match in title (highest priority)
    if (titleLower.includes(normalizedQuery)) {
      relevance += 100;
    }

    // Word matches in title (high priority for steps)
    for (const word of queryWords) {
      if (titleLower.includes(word)) {
        relevance += 60; // Higher weight than code guide
      }
    }

    // Exact phrase match in content
    if (sectionLower.includes(normalizedQuery)) {
      relevance += 40; // Higher weight for procedural content
    }

    // Word matches in content (code examples, explanations)
    for (const word of queryWords) {
      const count = (sectionLower.match(new RegExp(word, 'g')) || []).length;
      relevance += count * 12; // Slightly higher weight for data guide
    }

    // Boost relevance for sections with code examples (contain ```)
    if (section.includes('```')) {
      relevance += 15;
    }

    if (relevance > 0) {
      results.push({
        title: `${headingLevel} ${title}`,
        content: section.trim(),
        relevance
      });
    }
  }

  // Sort by relevance
  results.sort((a, b) => b.relevance - a.relevance);

  return results;
}

/**
 * Get the full data migration guide content
 */
export async function getFullDataGuide(): Promise<string> {
  return await getDataGuideContent();
}

