import { ADLData, ADLActivity, IndependenceLevel, INDEPENDENCE_LEVELS } from '../ADLTypes';

// Re-export core types
export { ADLData, ADLActivity, IndependenceLevel, INDEPENDENCE_LEVELS };

// Export BasicADLData as an alias of ADLData for backward compatibility
export type BasicADLData = ADLData;

// Export Activity as an alias of ADLActivity for backward compatibility
export type Activity = ADLActivity;

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

// Risk patterns for ADL activities
export interface ADLRiskPattern {
  activity: string;
  level: IndependenceLevel;
  triggers: string[];
  implications: string[];
}

export interface IADLRiskPatterns {
  patterns: ADLRiskPattern[];
}

// Processed ADL data with analysis
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