import { Assessment } from '../../../../types/report';

export const narrativeTestData = {
    symptoms: {
        severity: ['mild', 'moderate', 'severe'],
        progression: ['improving', 'worsening', 'stable'],
        impact: ['minimal', 'moderate', 'significant'],
        frequency: ['occasional', 'intermittent', 'constant']
    },

    medications: {
        purposes: ['pain management', 'muscle relaxation', 'inflammation'],
        frequencies: ['as needed', 'daily', 'twice daily', 'at bedtime'],
        responses: ['good response', 'partial relief', 'minimal effect']
    },

    treatments: {
        types: ['physical therapy', 'occupational therapy', 'pain management'],
        frequencies: ['weekly', 'bi-weekly', 'monthly'],
        progress: ['improving', 'maintaining', 'plateaued']
    },

    functionalStatus: {
        levels: ['independent', 'modified independent', 'standby assistance', 'minimal assistance'],
        modifiers: ['with difficulty', 'with modifications', 'with adaptive equipment'],
        contexts: ['home environment', 'community', 'work setting']
    }
};

export const createNarrativeTestData = (overrides: Partial<Assessment> = {}): Assessment => ({
    id: 'test-assessment',
    date: '2025-01-27',
    demographics: {
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1980-01-01',
        gender: 'Male',
        occupation: 'Software Developer',
        employer: 'Tech Corp',
        householdMembers: [
            {
                relationship: 'Spouse',
                name: 'Jane Doe',
                notes: 'Primary caregiver'
            }
        ]
    },
    symptoms: {
        physical: [
            {
                location: 'Lower back',
                severity: 'moderate',
                frequency: 'constant',
                impact: 'significant',
                progression: 'improving'
            }
        ],
        aggravating: ['prolonged sitting', 'lifting'],
        relieving: ['position changes', 'rest']
    },
    medicalHistory: {
        currentTreatment: [
            {
                name: 'Dr. Smith',
                providerType: 'Physical Therapist',
                frequency: 'Weekly',
                focus: 'Lower back rehabilitation',
                progress: 'Improving'
            }
        ],
        medications: [
            {
                name: 'Ibuprofen',
                dosage: '400mg',
                frequency: 'As needed',
                purpose: 'Pain management'
            }
        ]
    },
    ...overrides
});

export const narrativeExpectationsForSection = {
    demographics: {
        includes: ['John Doe', '43-year-old', 'Male', 'Software Developer'],
        patterns: [/lives with/, /employed as/],
        clinicalTerms: ['caregiver']
    },
    
    medicalHistory: {
        includes: ['Dr. Smith', 'Physical Therapist', 'Ibuprofen'],
        patterns: [/treatment progression/, /medication regimen/],
        clinicalTerms: ['rehabilitation', 'management']
    },
    
    symptoms: {
        includes: ['Lower back', 'moderate', 'constant'],
        patterns: [/impact on function/, /reported symptoms/],
        clinicalTerms: ['progression', 'frequency']
    }
};