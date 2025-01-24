import { DocumentationAgent } from '../DocumentationAgent';
import { AgentContext } from '../types';
import type { Assessment } from '@/lib/validation/assessment-schema';

describe('DocumentationAgent', () => {
  const mockAssessment: Assessment = {
    demographics: {
      firstName: 'John',
      lastName: 'Doe',
      emergencyContact: {}
    },
    documentation: {
      medicalDocumentation: [
        {
          title: "Physiotherapy Assessment Report",
          date: "2024-12-15",
          type: "medical",
          notes: "Initial physiotherapy assessment revealing limited ROM in right shoulder. Patient reports 7/10 pain. Recommendations include gentle ROM exercises and hot packs."
        },
        {
          title: "Orthopedic Consultation",
          date: "2024-12-01",
          type: "medical",
          notes: "MRI shows rotator cuff tear. Conservative treatment recommended initially. Surgery may be considered if no improvement in 6 weeks."
        }
      ],
      legalDocumentation: [
        {
          title: "Insurance Assessment Report",
          date: "2024-11-30",
          type: "legal",
          notes: "Assessment for insurance purposes. Client meets criteria for temporary disability benefits."
        }
      ]
    },
    medicalHistory: {
      medications: [],
      treatments: []
    },
    typicalDay: {
      preAccident: { daily: { sleepSchedule: {}, routines: {} } },
      current: { daily: { sleepSchedule: {}, routines: {} } }
    },
    functionalAssessment: {
      rangeOfMotion: { measurements: [], generalNotes: '' },
      manualMuscleTesting: { grades: {}, generalNotes: '' },
      bergBalance: { items: {}, generalNotes: '', totalScore: 0 }
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

  let agent: DocumentationAgent;

  beforeEach(() => {
    agent = new DocumentationAgent(mockContext, 2);
  });

  describe('validation', () => {
    it('should validate valid documentation data', async () => {
      const result = await agent.validateData(mockAssessment);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should flag documents without dates', async () => {
      const invalidData = {
        ...mockAssessment,
        documentation: {
          ...mockAssessment.documentation,
          medicalDocumentation: [
            { title: "Incomplete Report", type: "medical", notes: "Missing date" }
          ]
        }
      };
      const result = await agent.validateData(invalidData);
      expect(result.warnings).toContain('Document "Incomplete Report" missing date');
    });
  });

  describe('processing', () => {
    it('should process and categorize documents correctly', async () => {
      const processed = await agent.processData(mockAssessment);
      expect(processed.medical.length).toBe(2);
      expect(processed.legal.length).toBe(1);
    });

    it('should extract key findings from medical documents', async () => {
      const processed = await agent.processData(mockAssessment);
      const findings = processed.keyFindings;
      expect(findings).toContain('Rotator cuff tear');
      expect(findings).toContain('Limited ROM in right shoulder');
    });

    it('should identify treatment recommendations', async () => {
      const processed = await agent.processData(mockAssessment);
      const recommendations = processed.recommendations;
      expect(recommendations).toContain('Gentle ROM exercises');
      expect(recommendations).toContain('Hot packs');
    });

    it('should extract temporal information', async () => {
      const processed = await agent.processData(mockAssessment);
      expect(processed.timeline.length).toBeGreaterThan(0);
      expect(processed.timeline[0].date).toBe('2024-12-15');
    });
  });

  describe('formatting', () => {
    it('should format brief output with key findings', async () => {
      const processed = await agent.processData(mockAssessment);
      const formatted = agent['formatByDetailLevel'](processed, 'brief');
      expect(formatted).toContain('Key Findings');
      expect(formatted).toContain('rotator cuff tear');
    });

    it('should format standard output with document summaries', async () => {
      const processed = await agent.processData(mockAssessment);
      const formatted = agent['formatByDetailLevel'](processed, 'standard');
      expect(formatted).toContain('Medical Documentation');
      expect(formatted).toContain('Physiotherapy Assessment');
      expect(formatted).toContain('Orthopedic Consultation');
    });

    it('should format detailed output with full analysis', async () => {
      const processed = await agent.processData(mockAssessment);
      const formatted = agent['formatByDetailLevel'](processed, 'detailed');
      expect(formatted).toContain('Treatment Recommendations');
      expect(formatted).toContain('Timeline of Care');
      expect(formatted).toContain('Legal Documentation');
    });
  });

  describe('section generation', () => {
    it('should generate valid section with document analysis', async () => {
      const section = await agent.generateSection(mockAssessment);
      expect(section.isValid).toBe(true);
      expect(section.title).toBe('Documentation');
      expect(section.content).toContain('Medical Documentation');
    });

    it('should handle missing documentation gracefully', async () => {
      const emptyData = {
        ...mockAssessment,
        documentation: {
          medicalDocumentation: [],
          legalDocumentation: []
        }
      };
      const section = await agent.generateSection(emptyData);
      expect(section.isValid).toBe(true);
      expect(section.warnings).toContain('No documentation provided for review');
    });
  });
});