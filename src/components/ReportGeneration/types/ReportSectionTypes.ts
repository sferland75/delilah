import type { ReactNode } from 'react';

export enum ReportSectionType {
  STRUCTURED = 'structured',
  NARRATIVE = 'narrative',
  MIXED = 'mixed'
}

export interface SectionContent {
  type: ReportSectionType;
  order: number;
  title: string;
  content: string | ReactNode;
  subsections?: SectionContent[];
}

export interface ReportSection {
  type: ReportSectionType;
  order: number;
  title: string;
  content?: string | ReactNode;
  subsections?: ReportSection[];
}