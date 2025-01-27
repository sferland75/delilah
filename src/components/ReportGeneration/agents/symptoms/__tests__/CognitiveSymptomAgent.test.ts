import { CognitiveSymptomAgent } from '../CognitiveSymptomAgent';
import { createMockContext } from '../../../testing/mockContext';
import { Assessment } from '../../../../../types/report';
import { mockAssessmentData } from '../../../testing/mockData';
import { createTestSuite, runStandardTests } from '../../../testing/setup';

describe('CognitiveSymptomAgent', () => {
  const testData: Assessment = {
    ...mockAssessmentData,
    symptoms: {
      physical: [],
      cognitive: [
        {
          symptom: 'Memory issues',
          severity: 'Mild',
          frequency: 'Intermittent',
          impact: 'Forgets appointments',
          management: 'Calendar reminders',
          description: 'Short-term memory difficulties',
          triggers: ['Stress', 'Fatigue']
        }
      ],
      emotional: []
    }
  };

  const { agent, context } = createTestSuite(CognitiveSymptomAgent);

  it('processes symptom data correctly', async () => {
    const result = await agent.processData(testData);
    expect(result.valid).toBe(true);
    expect(result.data.symptoms).toBeDefined();
    expect(result.data.symptoms.length).toBe(1);
    expect(result.data.symptoms[0].symptom).toBe('Memory issues');
  });

  it('formats content at different detail levels', async () => {
    const processed = await agent.processData(testData);

    const formats = await runStandardTests({ agent, context, testData });
    
    // Brief format checks
    expect(formats.brief).toContain('Memory issues');
    expect(formats.brief).toContain('Mild');

    // Standard format checks
    expect(formats.standard).toContain('Intermittent');
    expect(formats.standard).toContain('Calendar reminders');

    // Detailed format checks
    expect(formats.detailed).toContain('Short-term memory difficulties');
    expect(formats.detailed).toContain('Stress');
    expect(formats.detailed).toContain('Fatigue');
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
    expect(formatted).toContain('No cognitive symptoms reported');
  });

  it('correctly identifies patterns in symptoms', async () => {
    const result = await agent.processData(testData);
    expect(result.data.patterns).toBeDefined();
    expect(result.data.patterns.triggers).toContain('Stress');
    expect(result.data.patterns.triggers).toContain('Fatigue');
  });
});