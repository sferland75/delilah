export type IndependenceLevel = 
  | 'independent'
  | 'modified_independent'
  | 'supervision'
  | 'minimal_assistance'
  | 'moderate_assistance'
  | 'maximal_assistance'
  | 'total_assistance'
  | 'not_applicable';

export interface Activity {
  notes?: string;
  independence?: IndependenceLevel;
}

export interface ADLSection {
  activity: string;
  notes: string;
  independence: IndependenceLevel;
}

export interface ADLSectionData {
  [key: string]: Activity;
}

export interface BasicADLData {
  bathing: {
    shower: Activity;
    grooming: Activity;
    oral_care: Activity;
    toileting: Activity;
  };
  dressing: {
    upper_body: Activity;
    lower_body: Activity;
    footwear: Activity;
  };
  feeding: {
    eating: Activity;
    setup: Activity;
    drinking: Activity;
  };
  transfers: {
    bed_transfer: Activity;
    toilet_transfer: Activity;
    shower_transfer: Activity;
    position_changes: Activity;
  };
}

export interface ProcessedADLData {
  sections: {
    bathing: ADLSection[];
    dressing: ADLSection[];
    feeding: ADLSection[];
    transfers: ADLSection[];
  };
  overallIndependence: IndependenceLevel;
  supportNeeds: {
    category: string;
    level: IndependenceLevel;
    rationale: string;
  }[];
  recommendedAssistance: {
    activity: string;
    type: string;
    frequency: string;
    rationale: string;
  }[];
}