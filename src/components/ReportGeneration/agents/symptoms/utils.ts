export interface Symptom {
  location: string;
  severity: number | string;
  frequency: string;
  description: string;
  triggers?: string[];
  impact?: string;
  management?: string;
}

export const validateSymptomData = (symptom: any): boolean => {
  return (
    typeof symptom === 'object' &&
    typeof symptom.location === 'string' &&
    (typeof symptom.severity === 'number' || typeof symptom.severity === 'string') &&
    typeof symptom.frequency === 'string' &&
    typeof symptom.description === 'string'
  );
};