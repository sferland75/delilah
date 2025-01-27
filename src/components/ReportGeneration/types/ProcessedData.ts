export interface ProcessedTransfersData {
  valid: boolean;
  currentLevel: string;
  equipment: string[];
  recommendations: string[];
  riskFactors: string[];
  errors?: string[];
}

export interface ProcessedSymptomData {
  valid: boolean;
  symptoms: {
    name: string;
    severity: string;
    frequency: string;
    impact?: string;
    management?: string;
    location?: string;
    triggers?: string[];
  }[];
  patterns: {
    byLocation?: { [key: string]: string[] };
    byTrigger?: { [key: string]: string[] };
    byImpact?: { [key: string]: string[] };
  };
  errors?: string[];
}

export interface ProcessedROMData {
  valid: boolean;
  measurements: {
    joint: string;
    movement: string;
    active: number;
    passive: number;
    normal: number;
    painLevel?: number;
    endFeel?: string;
  }[];
  limitations: {
    joint: string;
    movement: string;
    limitation: string;
    impact: string;
  }[];
  recommendations: string[];
  errors?: string[];
}