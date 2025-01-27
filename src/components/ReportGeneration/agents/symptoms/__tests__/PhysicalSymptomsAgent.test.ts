import { PhysicalSymptomsAgent } from '../PhysicalSymptomsAgent';
import { createMockContext } from '../../../testing/mockContext';
import { Assessment } from '../../../../../types/report';
import { mockAssessmentData } from '../../../testing/mockData';

describe('PhysicalSymptomsAgent', () => {
  let agent: PhysicalSymptomsAgent;

  const testData: Assessment = {
    ...mockAssessmentData,
    symptoms: {
      physical: [
        {
          symptom: 'Pain',
          severity: 'Moderate',
          frequency: 'Daily',
          impact: 'Affects sleep',
          management: 'Medication',
          location: 'Lower Back',
          description: 'Dull ache',
          triggers: ['Prolonged sitting']
        }
      ],
      cognitive: [],
      emotional: []
    }
  };

  beforeEach(() => {
    agent = new PhysicalSymptomsAgent(createMockContext());
  });

  it('processes symptom data correctly', async () => {
    const result = await agent.processData(testData);
    expect(result.valid).toBe(true);
    expect(result.data.symptoms).toBeDefined();
    expect(result.data.symptoms.length).toBe(1);
  });

  it('formats content at different detail levels', async () => {
    const processed = await agent.processData(testData);

    const brief = await (agent as any).getFormattedContent(processed, 'brief');
    expect(brief).toContain('Pain');
    expect(brief).toContain('Lower Back');

    const standard = await (agent as any).getFormattedContent(processed, 'standard');
    expect(standard).toContain('Moderate');
    expect(standard).toContain('Daily');

    const detailed = await (agent as any).getFormattedContent(processed, 'detailed');
    expect(detailed).toContain('Dull ache');
    expect(detailed).toContain('Prolonged sitting');
  });

  it('handles empty symptoms gracefully', async () => {
    const emptyData = {
      ...testData,
      symptoms: {
        physical: [],
        cognitive: [],
        emotional: []
      }
    };

    const processed = await agent.processData(emptyData);
    const formatted = await (agent as any).getFormattedContent(processed, 'standard');
    expect(formatted).toContain('No physical symptoms reported');
  });
});