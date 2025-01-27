import { PhysicalSymptomsAgent } from '../PhysicalSymptomsAgent';
import { createMockContext } from '../../../testing/mockContext';
import { AssessmentData } from '../../../types';

describe('PhysicalSymptomsAgent', () => {
  let agent: PhysicalSymptomsAgent;

  const mockSymptomData: AssessmentData = {
    id: 'test-123',
    date: '2025-01-26',
    symptoms: {
      physical: [{
        symptom: 'Pain',
        severity: 'Moderate',
        frequency: 'Daily',
        impact: 'Limits mobility',
        management: 'Pain medication',
        location: 'Lower back',
        description: 'Dull ache',
        triggers: ['Prolonged sitting', 'Bending']
      }]
    }
  };

  beforeEach(() => {
    agent = new PhysicalSymptomsAgent(createMockContext());
  });

  it('processes symptom data correctly', async () => {
    const result = await agent.processData(mockSymptomData);
    expect(result.valid).toBe(true);
    expect(result.symptoms[0].symptom).toBe('Pain');
    expect(result.symptoms[0].location).toBe('Lower back');
  });

  it('formats output at different detail levels', async () => {
    const processed = await agent.processData(mockSymptomData);

    const brief = agent.getFormattedContent(processed, 'brief');
    expect(brief).toContain('Pain');
    expect(brief).toContain('Lower back');

    const standard = agent.getFormattedContent(processed, 'standard');
    expect(standard).toContain('Management: Pain medication');
    expect(standard).toContain('Location: Lower back');

    const detailed = agent.getFormattedContent(processed, 'detailed');
    expect(detailed).toContain('Description: Dull ache');
    expect(detailed).toContain('Triggers:');
    expect(detailed).toContain('Prolonged sitting');
  });

  it('handles empty data gracefully', async () => {
    const processed = await agent.processData({
      id: 'test-123',
      date: '2025-01-26',
      symptoms: { physical: [] }
    });
    
    const formatted = agent.getFormattedContent(processed, 'standard');
    expect(formatted).toContain('No physical symptoms reported');
    expect(formatted).not.toContain('undefined');
  });
});