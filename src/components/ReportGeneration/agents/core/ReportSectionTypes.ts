import { ReactNode } from 'react';

export enum ReportSectionType {
  STRUCTURED = 'structured',
  NARRATIVE = 'narrative',
  TABULAR = 'tabular',
  LIST = 'list',
  MIXED = 'mixed'
}

export interface SectionContent {
  content: string | ReactNode;
  type: ReportSectionType;
  metadata?: {
    author?: string;
    timestamp?: string;
    version?: string;
    status?: 'draft' | 'final';
  };
}

export interface ReportSection {
  orderNumber: number;
  title: string;
  type: ReportSectionType;
  content: SectionContent;
  valid: boolean;
  errors?: string[];
}

export interface SectionTemplate {
  brief: string;
  standard: string;
  detailed: string;
  formatters?: {
    [key: string]: (value: any) => string;
  };
}

export interface SectionConfig {
  type: ReportSectionType;
  order: number;
  title: string;
  template?: SectionTemplate;
  validation?: {
    required: string[];
    optional?: string[];
    custom?: (data: any) => boolean;
  };
}

export interface ReportStructure {
  title: string;
  sections: SectionConfig[];
  metadata?: {
    author: string;
    date: string;
    version: string;
    status: 'draft' | 'final';
  };
}