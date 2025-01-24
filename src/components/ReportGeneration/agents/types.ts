import type { Assessment } from '@/types';

export interface ReportAgent {
  process: (data: any) => any;
  validate?: (data: any) => boolean;
  format?: (data: any) => string;
}

export interface ReportSection {
  title: string;
  content: string | React.ReactNode;
  order: number;
  isValid: boolean;
  errors?: string[];
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