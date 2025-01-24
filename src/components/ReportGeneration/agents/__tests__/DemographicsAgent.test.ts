import { DemographicsAgent } from '../DemographicsAgent';
import { AgentContext } from '../types';
import type { Assessment } from '@/lib/validation/assessment-schema';

describe('DemographicsAgent', () => {
  const mockAssessment: Assessment = {
    demographics: {
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1980-01-01',
      gender: 'male',
      phone: '(123) 456-7890',
      email: 'john.doe@example.com',
      address: '123 Main St',
      maritalStatus: 'married',
      numberOfChildren: 2,
      childrenDetails: 'Two adult children',
      emergencyContact: {
        name: 'Jane Doe',
        phone: '(098) 765-4321',
        relationship: 'Wife'
      },
      householdMembers: [
        {
          name: 'Jane Doe',
          relationship: 'Wife',
          notes: 'Primary caregiver'
        }
      ]
    },
    documentation: {
      medicalDocumentation: [],
      legalDocumentation: []
    },
    medicalHistory: {
      medications: [],
      treatments: []
    },
    typicalDay: {
      preAccident: {
        daily: {
          sleepSchedule: {},
          routines: {}
        }
      },
      current: {
        daily: {
          sleepSchedule: {},
          routines: {}
        }
      }
    },
    functionalAssessment: {
      rangeOfMotion: {
        measurements: [],
        generalNotes: ''
      },
      manualMuscleTesting: {
        grades: {},
        generalNotes: ''
      },
      bergBalance: {
        items: {},
        generalNotes: '',
        totalScore: 0
      }
    },
    symptoms: {
      physical: [],
      cognitive: [],
      emotional: [],
      generalNotes: ''
    },
    environmental: {
      propertyOverview: {
        recommendedModifications: [],
        identifiedHazards: []
      },
      rooms: [],
      exterior: [],
      safety: {
        hazards: [],
        recommendations: []
      }
    }
  };

  const mockContext: AgentContext = {
    assessment: mockAssessment,
    options: {
      detailLevel: 'standard'
    }
  };

  let agent: DemographicsAgent;

  beforeEach(() => {
    agent = new DemographicsAgent(mockContext, 1);
  });

  describe('validation', () => {
    it('should validate valid data', async () => {
      const result = await agent.validateData(mockAssessment);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail validation with missing required fields', async () => {
      const invalidData: Assessment = {
        ...mockAssessment,
        demographics: {
          ...mockAssessment.demographics,
          firstName: undefined,
          lastName: undefined,
          emergencyContact: {}
        }
      };
      const result = await agent.validateData(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Required fields missing');
    });

    it('should validate email format', async () => {
      const invalidData: Assessment = {
        ...mockAssessment,
        demographics: {
          ...mockAssessment.demographics,
          email: 'invalid-email'
        }
      };
      const result = await agent.validateData(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid value for demographics.email');
    });
  });

  describe('processing', () => {
    it('should process valid data correctly', async () => {
      const processed = await agent.processData(mockAssessment);
      expect(processed.personalInfo.fullName).toBe('John Doe');
      expect(processed.personalInfo.contact.email).toBe('john.doe@example.com');
      expect(processed.familyStatus.children.count).toBe(2);
    });

    it('should handle missing optional fields', async () => {
      const minimalData: Assessment = {
        ...mockAssessment,
        demographics: {
          firstName: 'John',
          lastName: 'Doe',
          dateOfBirth: '1980-01-01',
          gender: 'male',
          emergencyContact: {}
        }
      };
      const processed = await agent.processData(minimalData);
      expect(processed.personalInfo.fullName).toBe('John Doe');
      expect(processed.personalInfo.contact.email).toBe('');
      expect(processed.familyStatus.children.count).toBe(0);
    });
  });

  describe('formatting', () => {
    it('should format brief output correctly', async () => {
      const processed = await agent.processData(mockAssessment);
      const formatted = agent['formatByDetailLevel'](processed, 'brief');
      expect(formatted).toContain('John Doe');
      expect(formatted).toContain('male');
    });

    it('should format standard output with contact information', async () => {
      const processed = await agent.processData(mockAssessment);
      const formatted = agent['formatByDetailLevel'](processed, 'standard');
      expect(formatted).toContain('Contact Information');
      expect(formatted).toContain('john.doe@example.com');
      expect(formatted).toContain('(123) 456-7890');
    });

    it('should format detailed output with household members', async () => {
      const processed = await agent.processData(mockAssessment);
      const formatted = agent['formatByDetailLevel'](processed, 'detailed');
      expect(formatted).toContain('Household Members');
      expect(formatted).toContain('Jane Doe');
      expect(formatted).toContain('Primary caregiver');
    });

    it('should handle empty household members in detailed format', async () => {
      const dataWithoutHousehold: Assessment = {
        ...mockAssessment,
        demographics: {
          ...mockAssessment.demographics,
          householdMembers: []
        }
      };
      const processed = await agent.processData(dataWithoutHousehold);
      const formatted = agent['formatByDetailLevel'](processed, 'detailed');
      expect(formatted).toContain('Household Members');
      expect(formatted).not.toContain('Primary caregiver');
    });
  });

  describe('section generation', () => {
    it('should generate a valid section with all information', async () => {
      const section = await agent.generateSection(mockAssessment);
      expect(section.isValid).toBe(true);
      expect(section.title).toBe('Demographics');
      expect(section.content).toContain('John Doe');
      expect(section.errors).toHaveLength(0);
    });

    it('should handle errors in section generation', async () => {
      const invalidData: Assessment = {
        ...mockAssessment,
        demographics: {
          emergencyContact: {}
        }
      };
      const section = await agent.generateSection(invalidData);
      expect(section.isValid).toBe(false);
      expect(section.errors?.length).toBeGreaterThan(0);
    });
  });
});