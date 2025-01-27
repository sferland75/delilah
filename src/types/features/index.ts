export interface FeatureFlags {
  enableNarrative: boolean;
  enableDetailedFormatting: boolean;
  enableContextualAnalysis: boolean;
}

export const DEFAULT_FEATURES: FeatureFlags = {
  enableNarrative: false,
  enableDetailedFormatting: true,
  enableContextualAnalysis: true,
};