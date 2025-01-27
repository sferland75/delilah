"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockContext = exports.mockMobilityData = exports.sampleADLData = exports.sampleSymptomData = exports.mockAssessmentData = exports.baseTestData = void 0;
exports.createMockContext = createMockContext;
// Base test data with required fields
exports.baseTestData = {
    id: "test-123",
    date: "2025-01-26"
};
// Updated mock data
exports.mockAssessmentData = {
    ...exports.baseTestData,
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
exports.sampleSymptomData = {
    ...exports.baseTestData,
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
exports.sampleADLData = {
    ...exports.baseTestData,
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
exports.mockMobilityData = {
    ...exports.baseTestData,
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
const noop = (_) => { };
// Context for testing
exports.mockContext = {
    logger: {
        log: noop,
        error: noop,
        warn: noop,
        info: noop
    },
    config: {
        detailLevel: "standard"
    }
};
// Helper to create mock context with overrides
function createMockContext(overrides) {
    return {
        ...exports.mockContext,
        ...overrides,
        logger: {
            ...exports.mockContext.logger,
            ...(overrides?.logger || {})
        },
        config: {
            ...exports.mockContext.config,
            ...(overrides?.config || {})
        }
    };
}
