// Base test data with required fields
export const baseTestData = {
  id: "test-123",
  date: "2025-01-26"
};

// Updated mock data
export const mockAssessmentData = {
  ...baseTestData,
  demographics: {
    firstName: "John",
    lastName: "Doe",
    emergencyContact: {
      name: "Jane Doe",
      phone: "555-0123",
      relationship: "Spouse"
    }
  },
  functionalAssessment: {
    transfers: {
      bedMobility: "Independent",
      sitToStand: "Independent"
    },
    rangeOfMotion: {
      shoulder: [],
      cervical: []
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
  equipment: {
    current: []
  },
  environment: {},
  typicalDay: {}
};

// Sample symptom data
export const sampleSymptomData = {
  ...baseTestData,
  symptoms: {
    physical: [{
      symptom: "Pain",
      severity: "Moderate",
      frequency: "Daily",
      impact: "Affects sleep",
      management: "Medication",
      location: "Lower Back",
      description: "Dull ache",
      triggers: ["Prolonged sitting"]
    }],
    cognitive: [{
      symptom: "Memory issues",
      severity: "Mild",
      frequency: "Intermittent",
      impact: "Forgets appointments",
      management: "Calendar reminders"
    }],
    emotional: [{
      symptom: "Anxiety",
      severity: "Moderate",
      frequency: "Weekly",
      impact: "Social withdrawal",
      management: "Counseling"
    }]
  }
};

// ADL test data
export const sampleADLData = {
  ...baseTestData,
  functionalAssessment: {
    adl: {
      feeding: "Independent",
      bathing: "Modified Independent",
      dressing: "Independent",
      toileting: "Independent"
    }
  }
};

// Mobility test data
export const mockMobilityData = {
  ...baseTestData,
  functionalAssessment: {
    mobility: {
      walkingDistance: 100,
      assistiveDevices: ["Cane"],
      restrictions: ["No running"]
    },
    bergBalance: {
      totalScore: 45,
      items: {}
    }
  }
};

// Mock logger implementation
const noop = (_: string) => { /* no-op */ };

// Context for testing
export const mockContext = {
  logger: {
    log: noop,
    error: noop,
    warn: noop,
    info: noop
  },
  config: {
    detailLevel: "standard" as const
  }
};

// Helper to create mock context with overrides
export function createMockContext(overrides?: Partial<typeof mockContext>): typeof mockContext {
  return {
    ...mockContext,
    ...overrides,
    logger: {
      ...mockContext.logger,
      ...(overrides?.logger || {})
    },
    config: {
      ...mockContext.config,
      ...(overrides?.config || {})
    }
  };
}