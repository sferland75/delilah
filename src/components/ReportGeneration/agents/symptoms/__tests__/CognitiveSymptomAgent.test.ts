import { CognitiveSymptomAgent } from '../CognitiveSymptomAgent';
import { createMockContext } from '../../../testing/mockContext';
import { AssessmentData } from '../../../types';

describe('CognitiveSymptomAgent', () => {
  let agent: CognitiveSymptomAgent;

  const mockSymptomData: AssessmentData = {
    id: 'test-123',
    date: '2025-01-26',
    symptoms: {
      cognitive: [{
        symptom: 'Memory loss',
        severity: 'Mild',
        frequency: 'Daily',
        impact: 'Forgets appointments',
        management: 'Calendar reminders'
      }]
    }
  };

  beforeEach(() => {
    agent = new CognitiveSymptomAgent(createMockContext());
  });

  it('processes symptom data correctly', async () => {
    const result = await agent.processData(mockSymptomData);
    expect(result.valid).toBe(true);
    expect(result.symptoms[0].symptom).toBe('Memory loss');
    expect(result.symptoms[0].severity).toBe('Mild');
  });

  it('formats output at different detail levels', async () => {
    const processed = await agent.processData(mockSymptomData);

    const brief = agent.getFormattedContent(processed, 'brief');
    expect(brief).toContain('Memory loss');
    expect(brief).toContain('Mild');

    const standard = agent.getFormattedContent(processed, 'standard');
    expect(standard).toContain('Management: Calendar reminders');
    expect(standard).toContain('Impact: Forgets appointments');

    const detailed = agent.getFormattedContent(processed, 'detailed');
    expect(detailed).toContain('Frequency: Daily');
    expect(detailed).toContain('Severity: Mild');
  });

  it('handles empty data gracefully', async () => {
    const processed = await agent.processData({
      id: 'test-123',
      date: '2025-01-26',
      symptoms: { cognitive: [] }
    });
    
    const formatted = agent.getFormattedContent(processed, 'standard');
    expect(formatted).toContain('No cognitive symptoms reported');
    expect(formatted).not.toContain('undefined');
  });
});