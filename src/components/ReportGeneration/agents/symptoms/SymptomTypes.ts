export interface SymptomData {
  location?: string;
  painType?: string;
  severity: string;
  frequency: string;
  aggravating?: string;
  relieving?: string;
  impact?: string;
  management?: string;
}

export interface ProcessedSymptomData {
  physical: SymptomData[];
  cognitive: SymptomData[];
  emotional: SymptomData[];
  patterns: {
    timeOfDay?: string[];
    weather?: string[];
    activities?: string[];
  };
  overall: {
    mostSevere: string;
    mostFrequent: string;
    primaryLimitations: string[];
  };
}