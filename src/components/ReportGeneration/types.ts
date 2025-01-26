export interface AgentContext {
  logger: {
    log: (msg: string) => void;
    error: (msg: string) => void;
    warn: (msg: string) => void;
    info: (msg: string) => void;
  };
  config?: {
    detailLevel: "brief" | "standard" | "detailed";
  };
}

export interface AssessmentData {
  id: string;
  date: string;
  demographics?: Record<string, any>;
  functionalAssessment?: Record<string, any>;
  documentation?: {
    medicalDocumentation: Array<{
      title: string;
      date: string;
      type: string;
      summary?: string;
    }>;
    legalDocumentation: Array<{
      title: string;
      date: string;
      type: string;
      summary?: string;
    }>;
  };
  symptoms?: {
    physical?: Array<{
      symptom: string;
      severity: string;
      frequency: string;
      impact: string;
      management: string;
      location?: string;
      description?: string;
      triggers?: string[];
    }>;
    cognitive?: Array<{
      symptom: string;
      severity: string;
      frequency: string;
      impact: string;
      management: string;
    }>;
    emotional?: Array<{
      symptom: string;
      severity: string;
      frequency: string;
      impact: string;
      management: string;
    }>;
  };
  equipment?: {
    current: string[];
  };
  environment?: Record<string, any>;
  typicalDay?: Record<string, any>;
}

// Base interfaces
export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings?: string[];
}

export interface ProcessedData {
  valid: boolean;
  errors?: string[];
  data?: any;
}

export interface ReportSection {
  orderNumber: number;
  sectionName: string;
  title?: string;
  content: string;
  valid: boolean;
  errors?: string[];
}

// Agent-specific interfaces
export interface ROMOutput extends ProcessedData {
  joints?: Record<string, any>;
  patterns?: {
    unilateral: any[];
    painful: any[];
  };
  functional?: any;
  impact?: any;
}

export interface SymptomAgentOutput extends ProcessedData {
  symptoms: Array<{
    symptom: string;
    severity: string;
    frequency: string;
    impact: string;
    management: string;
    location?: string;
  }>;
}

export interface TransfersAgentOutput extends ProcessedData {
  transferStatus?: {
    locations: string[];
    requiredEquipment: string[];
  };
  riskFactors?: string[];
  recommendations?: string[];
}

export interface IADLOutput extends ProcessedData {
  activities: Record<string, {
    level: string;
    notes?: string;
  }>;
}