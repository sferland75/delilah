import { EmotionalSymptomAgent } from '../EmotionalSymptomAgent';
import { createMockContext } from '../../../testing/mockContext';
import { AssessmentData } from '../../../types';

describe('EmotionalSymptomAgent', () => {
  let agent: EmotionalSymptomAgent;

  const mockSymptomData: AssessmentData = {
    id: 'test-123',
    date: '2025-01-26',
    symptoms: {
      emotional: [{
        symptom: 'Anxiety',
        severity: 'Moderate',
        frequency: 'Daily',
        impact: 'Social withdrawal',
        management: 'Deep breathing exercises',
        triggers: ['Crowded spaces', 'Work deadlines']
      }]
    }
  };

  beforeEach(() => {
    agent = new EmotionalSymptomAgent(createMockContext());
  });

  it('processes symptom data correctly', async () => {
    const result = await agent.processData(mockSymptomData);
    expect(result.valid).toBe(true);
    expect(result.symptoms[0].symptom).toBe('Anxiety');
    expect(result.symptoms[0].severity).toBe('Moderate');
  });

  it('formats output at different detail levels', async () => {
    const processed = await agent.processData(mockSymptomData);

    const brief = agent.getFormattedContent(processed, 'brief');
    expect(brief).toContain('Anxiety');
    expect(brief).toContain('Moderate');

    const standard = agent.getFormattedContent(processed, 'standard');
    expect(standard).toContain('Management: Deep breathing');
    expect(standard).toContain('Impact: Social withdrawal');

    const detailed = agent.getFormattedContent(processed, 'detailed');
    expect(detailed).toContain('Triggers:');
    expect(detailed).toContain('Crowded spaces');
  });

  it('handles empty data gracefully', async () => {
    const processed = await agent.processData({
      id: 'test-123',
      date: '2025-01-26',
      symptoms: { emotional: [] }
    });
    
    const formatted = agent.getFormattedContent(processed, 'standard');
    expect(formatted).toContain('No emotional symptoms reported');
    expect(formatted).not.toContain('undefined');
  });
});