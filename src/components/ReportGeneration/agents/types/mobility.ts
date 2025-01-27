export interface EquipmentData {
  current: string[];
  recommended?: string[];
}

export interface MobilityInput {
  walkingDistance?: number;
  assistiveDevices?: string[];
  restrictions?: string[];
  terrain?: string[];
  notes?: string;
}

export interface MobilityOutput {
  valid: boolean;
  mobility: {
    walkingDistance: number;
    assistiveDevices: string[];
    restrictions: string[];
    terrain: string[];
    notes?: string;
  };
  balance: {
    score?: number;
    riskLevel: 'low' | 'moderate' | 'high';
    concerns: string[];
  };
  safety: string[];
  recommendations: string[];
  errors?: string[];
}