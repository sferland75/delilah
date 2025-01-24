import { SymptomData } from '../agents/symptoms/SymptomTypes';

export const validateSymptomData = (data: any): boolean => {
  if (!data) return false;
  
  // Required fields
  if (!data.severity || !data.frequency) {
    return false;
  }

  // Validate severity values
  const validSeverities = ['None', 'Mild', 'Moderate', 'Severe', 'Very Severe'];
  if (!validSeverities.includes(data.severity)) {
    return false;
  }

  // Validate frequency values
  const validFrequencies = ['Rarely', 'Sometimes', 'Often', 'Most of the time', 'Constantly'];
  if (!validFrequencies.includes(data.frequency)) {
    return false;
  }

  return true;
};