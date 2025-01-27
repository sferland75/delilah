import { Assessment } from '../../../types';

export const mockAssessmentData: Assessment = {
  id: 'test-assessment-001',
  date: '2025-01-27',
  demographics: {
    name: 'John Smith',
    dateOfBirth: '1980-01-01',
    gender: 'Male',
    occupation: 'Software Developer'
  },
  symptoms: {
    physical: [
      {
        symptom: 'Back Pain',
        severity: 'Moderate',
        frequency: 'Daily',
        impact: 'Limits sitting tolerance',
        management: 'Regular stretching',
        location: 'Lower back',
        triggers: ['Prolonged sitting', 'Heavy lifting']
      }
    ],
    cognitive: [
      {
        symptom: 'Difficulty Concentrating',
        severity: 'Mild',
        frequency: 'Intermittent',
        impact: 'Affects work performance',
        management: 'Regular breaks',
        notes: 'Worse in afternoons'
      }
    ]
  },
  functionalAssessment: {
    adl: {
      feeding: {
        assistanceLevel: 'Independent',
        equipment: []
      },
      bathing: {
        assistanceLevel: 'Modified Independent',
        equipment: ['Shower chair']
      }
    },
    iadl: {
      cleaning: {
        level: 'Modified Independent',
        equipment: ['Long-handled duster'],
        notes: 'Difficulty with overhead reaching'
      }
    }
  },
  environmental: {
    propertyType: 'Single story house',
    entranceType: 'No steps',
    hasStairs: false,
    rooms: [
      {
        name: 'Bathroom',
        hasStairs: false,
        hazards: ['Slippery floor'],
        recommendations: ['Install grab bars']
      }
    ]
  }
};