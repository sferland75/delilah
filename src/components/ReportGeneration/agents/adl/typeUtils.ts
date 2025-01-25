import { IndependenceLevel } from './ADLTypes';
import { Activity } from './ADLTypes';

export function ensureIndependenceLevel(level: IndependenceLevel | undefined): IndependenceLevel {
  return level || 'not_applicable';
}

export function ensureString(value: string | undefined): string {
  return value || '';
}

export function ensureActivity(activity: Activity): { 
  notes: string; 
  independence: IndependenceLevel 
} {
  return {
    notes: ensureString(activity.notes),
    independence: ensureIndependenceLevel(activity.independence)
  };
}