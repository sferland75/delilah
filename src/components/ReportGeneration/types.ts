export interface AssessmentData {
  assessment: {
    demographics: Demographics;
    documentation?: Documentation;
    medicalHistory: MedicalHistory;
    functionalAssessment: FunctionalAssessment;
    symptoms: Symptoms;
    environmental?: Environmental;
    adl: ADL;
    care?: Care;
  };
}

// Demographics interfaces
export interface Demographics {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender?: string;
  phone?: string;
  email?: string;
  address?: string;
  emergencyContact?: EmergencyContact;
  maritalStatus?: string;
  numberOfChildren?: number;
  childrenDetails?: string;
  householdMembers?: HouseholdMember[];
}

export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

export interface HouseholdMember {
  name: string;
  relationship: string;
  notes?: string;
}

// Documentation interfaces
export interface Documentation {
  medicalDocumentation: MedicalDocument[];
  legalDocumentation: any[];
}

export interface MedicalDocument {
  provider: string;
  dateReviewed: string;
  type: string;
  summary: string;
}

// Medical History interfaces
export interface MedicalHistory {
  medications?: Medication[];
  allergies?: string[];
  treatments?: Treatment[];
  surgeries?: string;
  injury?: Injury;
  currentTreatment?: CurrentTreatment[];
  preExisting?: string;
  familyHistory?: string;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  purpose: string;
}

export interface Treatment {
  type: string;
  provider: string;
  frequency: string;
  notes?: string;
}

export interface Injury {
  position: string;
  circumstance: string;
  immediateResponse: string;
  subsequentCare: string;
}

export interface CurrentTreatment {
  providerType: string;
  name: string;
  startDate?: string;
  frequency: string;
  focus: string;
  progress?: string;
}

// Report Section interfaces
export interface ReportSection {
  title: string;
  type: ReportSectionType;
  orderNumber: number;
  content: string | StructuredContent;
  transition?: string;
}

export type ReportSectionType = 'structured' | 'narrative' | 'mixed' | 'physical_assessment' | 'functional_assessment' | 'medical_history' | 'symptoms' | 'recommendations';

export interface StructuredContent {
  [key: string]: any;
  clientTable?: TableContent;
  emergencyContactTable?: TableContent;
}

export interface TableContent {
  [key: string]: {
    label: string;
    value: string | object;
  };
}

// Agent Context interfaces
export interface AgentContext {
  config: AgentConfig;
  logger: Console;
}

export interface AgentConfig {
  detailLevel: 'brief' | 'standard' | 'detailed';
  includeMetrics: boolean;
  formatPreference: 'clinical' | 'plain';
}

// Functional Assessment interfaces (add other interfaces as needed)
export interface FunctionalAssessment {
  rangeOfMotion?: RangeOfMotion;
  manualMuscleTesting?: ManualMuscleTesting;
  posturalTolerances?: any;
  transfers?: any;
}

export interface RangeOfMotion {
  measurements: ROMeasurement[];
  generalNotes?: string;
}

export interface ROMeasurement {
  joint: string;
  movement: string;
  normalROM: string;
  left: ROMValue;
  right: ROMValue;
  painLeft: boolean;
  painRight: boolean;
  notes?: string;
}

export interface ROMValue {
  active: string;
  passive: string;
}

export interface ManualMuscleTesting {
  grades: {
    [key: string]: {
      [key: string]: {
        [key: string]: {
          left?: string;
          right?: string;
        };
      };
    };
  };
  generalNotes?: string;
}

// Add Symptoms, Environmental, ADL, and Care interfaces similarly
// (truncated for brevity but follow the same pattern)