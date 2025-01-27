import { AgentOrchestrator } from '../AgentOrchestrator';
import { createMockContext } from '../testing/mockContext';
import { mockAssessmentData } from '../testing/mockData';
import { createTestSuite, expectValidAgentOutput } from '../testing/setup';
import { Assessment } from '../../../types/report';

describe('AgentOrchestrator', () => {
  const context = createMockContext();
  const orchestrator = new AgentOrchestrator(context);

  it('generates complete report', async () => {
    const sections = await orchestrator.generateReport(mockAssessmentData);
    expect(sections).toBeInstanceOf(Array);
    sections.forEach(section => {
      expect(section).toHaveProperty('content');
      expect(section).toHaveProperty('valid');
      expect(section.valid).toBe(true);
    });
  });

  it('handles empty data gracefully', async () => {
    const emptyData: Assessment = {
      ...mockAssessmentData,
      demographics: {},
      symptoms: {
        physical: [],
        cognitive: [],
        emotional: []
      }
    };
    const sections = await orchestrator.generateReport(emptyData);
    sections.forEach(section => {
      expect(section.valid).toBe(true);
      expect(typeof section.content).toBe('string');
    });
  });

  it('maintains correct section order', async () => {
    const sections = await orchestrator.generateReport(mockAssessmentData);
    const orderNumbers = sections.map(s => s.orderNumber);
    const sortedOrderNumbers = [...orderNumbers].sort((a, b) => a - b);
    expect(orderNumbers).toEqual(sortedOrderNumbers);
  });

  it('handles missing sections gracefully', async () => {
    const partialData: Assessment = {
      ...mockAssessmentData,
      medicalHistory: undefined as any
    };
    
    const sections = await orchestrator.generateReport(partialData);
    expect(sections.length).toBeGreaterThan(0);
    sections.forEach(section => {
      expect(section.valid).toBe(true);
      expect(section.content).toBeDefined();
    });
  });

  it('creates appropriate error messages for invalid data', async () => {
    const invalidData = {} as Assessment;
    const sections = await orchestrator.generateReport(invalidData);
    expect(sections.length).toBe(1);
    expect(sections[0].title).toBe('Assessment Summary');
    expect(sections[0].content).toContain('Assessment data is missing required fields');
  });

  it('processes all agent types', async () => {
    const sections = await orchestrator.generateReport(mockAssessmentData);
    const sectionTypes = new Set(sections.map(s => s.type));
    
    ['DEMOGRAPHICS', 'ADL', 'MEDICAL_HISTORY', 'SYMPTOMS'].forEach(type => {
      expect(sectionTypes.has(type)).toBe(true);
    });
  });
});