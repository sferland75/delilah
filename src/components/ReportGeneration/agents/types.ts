import type { Assessment } from '@/types';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface ProcessedData {
  [key: string]: any;
  metadata?: {
    processedAt: Date;
    version: string;
  };
}

export interface ReportAgent {
  validateData: (data: any) => Promise<ValidationResult>;
  processData: (data: any) => Promise<ProcessedData>;
  format: (data: ProcessedData) => string;
  generateSection: (data: any) => Promise<ReportSection>;
}

export interface ReportSection {
  title: string;
  content: string | React.ReactNode;
  order: number;
  isValid: boolean;
  errors?: string[];
  warnings?: string[];
}

export interface AgentContext {
  assessment: Assessment;
  template?: string;
  options?: {
    includeAppendices?: boolean;
    formatType?: 'plain' | 'markdown' | 'html';
    detailLevel?: 'brief' | 'standard' | 'detailed';
  };
}

export enum DetailLevel {
  Brief = 'brief',
  Standard = 'standard',
  Detailed = 'detailed'
}

export type ValidationRule = (value: any) => boolean;