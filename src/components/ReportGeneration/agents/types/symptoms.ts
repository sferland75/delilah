interface BaseSymptom {
  symptom: string;
  severity: string;
  frequency: string;
  impact?: string;
  management?: string;
  notes?: string;
  triggers?: string[];
}

export interface PhysicalSymptom extends BaseSymptom {
  location?: string;
  description?: string;
}

export interface CognitiveSymptom extends BaseSymptom {
  // Additional cognitive-specific fields can be added here
}

export interface EmotionalSymptom extends BaseSymptom {
  // Additional emotional-specific fields can be added here
}

export interface SymptomOutput {
  valid: boolean;
  symptoms: BaseSymptom[];
  errors?: string[];
}

export interface PhysicalSymptomOutput extends SymptomOutput {
  symptoms: PhysicalSymptom[];
}

export interface CognitiveSymptomOutput extends SymptomOutput {
  symptoms: CognitiveSymptom[];
}

export interface EmotionalSymptomOutput extends SymptomOutput {
  symptoms: EmotionalSymptom[];
}

export interface SymptomInput {
  physical?: PhysicalSymptom[];
  cognitive?: CognitiveSymptom[];
  emotional?: EmotionalSymptom[];
}