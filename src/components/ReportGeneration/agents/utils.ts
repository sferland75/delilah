import { AgentContext, ReportSection } from './types';

export const validateData = (data: any, requiredFields: string[]): boolean => {
  if (!data) return false;
  return requiredFields.every(field => {
    const value = field.split('.').reduce((obj, key) => obj?.[key], data);
    return value !== undefined && value !== null;
  });
};

export const formatDate = (date: string | Date): string => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const severityScale = {
  None: 0,
  Mild: 1,
  Moderate: 2,
  Severe: 3,
  'Very Severe': 4
};

export const frequencyScale = {
  Rarely: 1,
  Sometimes: 2,
  Often: 3,
  'Most of the time': 4,
  Constantly: 5
};

export const sanitizeText = (text: string): string => {
  if (!text) return '';
  // Remove any potentially unsafe content
  return text
    .replace(/[<>]/g, '') // Remove HTML tags
    .trim();
};

export const createSection = (
  title: string,
  content: string | React.ReactNode,
  order: number,
  isValid: boolean = true,
  errors: string[] = []
): ReportSection => ({
  title,
  content,
  order,
  isValid,
  errors
});

export const mergeAgentResults = (
  sections: ReportSection[],
  options = { sortByOrder: true }
): ReportSection[] => {
  const merged = [...sections];
  if (options.sortByOrder) {
    merged.sort((a, b) => a.order - b.order);
  }
  return merged;
};