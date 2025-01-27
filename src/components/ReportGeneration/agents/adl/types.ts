import { Assessment } from '../../../../types';

// Core ADL Types
export const INDEPENDENCE_LEVELS = {
  INDEPENDENT: 'independent',
  MODIFIED_INDEPENDENT: 'modified_independent',
  SUPERVISION: 'supervision',
  MINIMAL_ASSISTANCE: 'minimal_assistance',
  MODERATE_ASSISTANCE: 'moderate_assistance',
  MAXIMAL_ASSISTANCE: 'maximal_assistance',
  TOTAL_ASSISTANCE: 'total_assistance',
  NOT_APPLICABLE: 'not_applicable'
} as const;

export type IndependenceLevel = typeof INDEPENDENCE_LEVELS[keyof typeof INDEPENDENCE_LEVELS];

export interface Activity {
  assistanceLevel: IndependenceLevel;
  equipment?: string[];
  notes?: string;
}

export interface BasicADLData {
  feeding: Activity;
  bathing: Activity;
  dressing: Activity;
  toileting: Activity;
  transfers: Activity;
  ambulation: Activity;
}

// Common adaptation patterns
export const COMMON_ADAPTATIONS = {
  EQUIPMENT: 'equipment',
  SETUP: 'setup',
  TECHNIQUE: 'technique',
  ENVIRONMENT: 'environment'
} as const;

export type AdaptationType = typeof COMMON_ADAPTATIONS[keyof typeof COMMON_ADAPTATIONS];

// Level ordering for progression tracking
export const LEVEL_ORDER: IndependenceLevel[] = [
  INDEPENDENCE_LEVELS.INDEPENDENT,
  INDEPENDENCE_LEVELS.MODIFIED_INDEPENDENT,
  INDEPENDENCE_LEVELS.SUPERVISION,
  INDEPENDENCE_LEVELS.MINIMAL_ASSISTANCE,
  INDEPENDENCE_LEVELS.MODERATE_ASSISTANCE,
  INDEPENDENCE_LEVELS.MAXIMAL_ASSISTANCE,
  INDEPENDENCE_LEVELS.TOTAL_ASSISTANCE,
  INDEPENDENCE_LEVELS.NOT_APPLICABLE
];

// ADL analysis types
export interface ADLRiskPattern {
  activity: string;
  level: IndependenceLevel;
  triggers: string[];
  implications: string[];
}

export interface IADLRiskPatterns {
  patterns: ADLRiskPattern[];
}

export interface ProcessedADLData {
  basic: BasicADLData;
  analysis: {
    riskPatterns: ADLRiskPattern[];
    adaptations: {
      current: string[];
      recommended: string[];
    };
    progressionNotes: string[];
  };
}

// ADL section configuration
export interface ADLSectionConfig {
  includeRiskAnalysis: boolean;
  includeAdaptations: boolean;
  includeProgressionNotes: boolean;
  detailLevel: 'brief' | 'standard' | 'detailed';
}

// Data transformation interfaces
export interface ADLTransformation {
  from: IndependenceLevel;
  to: IndependenceLevel;
  date: string;
  notes?: string;
}

export interface ADLProgressionData {
  activity: string;
  transformations: ADLTransformation[];
  currentLevel: IndependenceLevel;
  trend: 'improving' | 'declining' | 'stable';
}

// Report output interfaces
export interface ADLReportOutput {
  valid: boolean;
  activities: BasicADLData;
  analysis?: {
    riskPatterns: ADLRiskPattern[];
    progressions: ADLProgressionData[];
    recommendations: string[];
  };
  errors?: string[];
}