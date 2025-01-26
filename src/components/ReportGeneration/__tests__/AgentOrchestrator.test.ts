import { AgentOrchestrator } from '../AgentOrchestrator';
import { mockContext, mockAssessmentData } from '../testing/mockData';
import { AssessmentData } from '../types';

describe('AgentOrchestrator', () => {
  const orchestrator = new AgentOrchestrator(mockContext);

  it('generates complete report', async () => {
    const sections = await orchestrator.generateReport(mockAssessmentData);
    expect(sections).toBeInstanceOf(Array);
    sections.forEach(section => {
      expect(section).toHaveProperty('content');
      expect(section).toHaveProperty('valid');
    });
  });

  it('handles empty data gracefully', async () => {
    const emptyData: AssessmentData = {
      id: "test-123",
      date: "2025-01-26"
    };
    const sections = await orchestrator.generateReport(emptyData);
    sections.forEach(section => {
      expect(section.valid).toBe(true);
      expect(typeof section.content).toBe('string');
    });
  });
});