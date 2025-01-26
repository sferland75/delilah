export interface TransferPattern {
  type: 'independent' | 'modified_independent' | 'minimal_assist' | 'moderate_assist' | 'maximum_assist';
  context: string;
  equipment?: string[];
  modifications?: string[];
  safety_concerns?: string[];
}

export interface TransferLocation {
  location: string;
  patterns: TransferPattern[];
  risks: string[];
}

export interface TransfersAgentOutput {
  transferStatus: {
    locations: TransferLocation[];
    generalPatterns: TransferPattern[];
    requiredEquipment: string[];
  };
  riskFactors: string[];
  recommendations: string[];
}