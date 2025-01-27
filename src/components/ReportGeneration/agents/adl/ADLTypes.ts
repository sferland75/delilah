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

export interface ADLActivity {
  assistanceLevel: IndependenceLevel;
  equipment?: string[];
  notes?: string;
}

export interface ADLData {
  feeding: ADLActivity;
  bathing: ADLActivity;
  dressing: ADLActivity;
  toileting: ADLActivity;
  transfers: ADLActivity;
  ambulation: ADLActivity;
}