import { BaseAgent } from '../BaseAgent';
import { AgentContext, ProcessedData } from '../types';
import type { Assessment } from '@/lib/validation/assessment-schema';

class TestAgent extends BaseAgent {
  protected initializeValidationRules(): void {
    // Add a simple validation rule
    this.validationRules.set('demographics.firstName', (value: any) => typeof value === 'string');
  }

  protected getSectionKeys(): string[] {
    return ['test'];
  }

  async processData(data: any): Promise<ProcessedData> {
    return {
      test: data.demographics.firstName,
      metadata: {
        processedAt: new Date(),
        version: '1.0'
      }
    };
  }

  protected formatByDetailLevel(data: ProcessedData, _detailLevel: 'brief' | 'standard' | 'detailed'): string {
    return `Test: ${data.test}`;
  }
}

describe('BaseAgent', () => {
  const mockAssessment: Assessment = {
    demographics: {
      firstName: 'John',
      lastName: 'Doe',
      emergencyContact: {}
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
        generalNotes: ''  // Added missing field
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
    options: { detailLevel: 'standard' }
  };

  let agent: TestAgent;

  beforeEach(() => {
    agent = new TestAgent(mockContext, 1, 'Test Section', ['demographics.firstName']);
  });

  it('should validate data correctly', async () => {
    const result = await agent.validateData(mockAssessment);
    expect(result.isValid).toBe(true);
  });

  it('should generate a valid section', async () => {
    const section = await agent.generateSection(mockAssessment);
    expect(section.isValid).toBe(true);
    expect(section.title).toBe('Test Section');
  });
});