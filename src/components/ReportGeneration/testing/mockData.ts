import { Assessment, AgentContext } from '../../../types/report';

export const mockAssessmentData: Assessment = {
  id: 'test-123',
  date: '2025-01-26',
  demographics: {
    firstName: 'John',
    lastName: 'Doe',
    emergencyContact: {
      name: 'Jane Doe',
      phone: '555-0123',
      relationship: 'Spouse'
    }
  },
  functionalAssessment: {
    mobility: {
      walkingDistance: 100,
      assistiveDevices: ['Cane'],
      restrictions: ['No running']
    },
    bergBalance: {
      totalScore: 45,
      items: {}
    }
  },
  symptoms: {
    physical: [],
    cognitive: [],
    emotional: []
  },
  adl: {
    feeding: { independence: 'independent' },
    bathing: { independence: 'independent' },
    dressing: { independence: 'independent' },
    toileting: { independence: 'independent' },
    transfers: { independence: 'independent' }
  },
  environmental: {
    propertyType: 'house',
    rooms: [],
    safety: {
      hazards: [],
      recommendations: []
    }
  },
  documentation: {
    sources: [],
    gaps: [],
    reliability: 'good'
  },
  medicalHistory: {
    injury: {
      date: '',
      mechanism: '',
      diagnosis: [],
      impactAreas: []
    },
    treatments: [],
    medications: [],
    procedures: [],
    currentTreatment: []
  },
  typicalDay: {
    routines: {}
  },
  amaGuides: {
    activities: {
      self: {
        class: 1,
        description: '',
        limitations: []
      },
      life: {
        class: 1,
        description: '',
        limitations: []
      },
      travel: {
        class: 1,
        description: '',
        limitations: []
      }
    },
    impairments: {
      physical: [],
      mental: []
    }
  }
};

export const mockProcessedData = {
  valid: true,
  data: mockAssessmentData,
  errors: []
};