import { IndependenceLevel, Activity } from './ADLTypes';

export { IndependenceLevel }; // Re-export IndependenceLevel

export interface IADLSection {
  activity: string;
  notes: string;
  independence: IndependenceLevel;
  barriersIdentified?: string[];
  adaptationsUsed?: string[];
}

export interface IADLData {
  household: {
    cleaning: Activity;
    laundry: Activity;
    meal_prep: Activity;
    home_maintenance: Activity;
  };
  community: {
    transportation: Activity;
    shopping: Activity;
    money_management: Activity;
    communication: Activity;
  };
}

export interface ProcessedIADLData {
  sections: {
    household: IADLSection[];
    community: IADLSection[];
  };
  overallIndependence: IndependenceLevel;
  supportNeeds: {
    category: string;
    level: IndependenceLevel;
    barriers: string[];
    rationale: string;
  }[];
  recommendations: {
    activity: string;
    adaptation: string;
    supportType: string;
    frequency: string;
    rationale: string;
  }[];
  safetyConsiderations: {
    activity: string;
    risk: string;
    mitigation: string;
  }[];
}