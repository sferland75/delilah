import { AgentOrchestrator } from './AgentOrchestrator';
import { mockContext, mockAssessmentData } from './testing/mockData';

describe('Report Generation System', () => {
  const orchestrator = new AgentOrchestrator(mockContext);

  it('successfully generates complete reports', async () => {
    const sections = await orchestrator.generateReport(mockAssessmentData);
    expect(sections.length).toBeGreaterThan(0);
    expect(sections.every(s => s.valid)).toBe(true);
  });
});