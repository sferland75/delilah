import { EmotionalSymptomAgent } from '../EmotionalSymptomAgent';
import { mockContext, sampleSymptomData } from '../../../testing/mockData';

describe('EmotionalSymptomAgent', () => {
  const agent = new EmotionalSymptomAgent(mockContext);

  it('processes emotional symptoms correctly', async () => {
    const result = await agent.processData(sampleSymptomData);
    expect(result.valid).toBe(true);
    expect(result.symptoms[0]).toMatchObject({
      symptom: 'Anxiety',
      severity: 'Moderate'
    });
  });

  it('formats emotional symptoms appropriately', async () => {
    const result = await agent.processData(sampleSymptomData);
    
    const anxiety = result.symptoms[0];
    expect(anxiety.frequency).toBe('Weekly');
    expect(anxiety.management).toBe('Counseling');
  });

  it('handles severity levels correctly', async () => {
    const result = await agent.processData(sampleSymptomData);
    expect(result.symptoms[0].severity).toBe('Moderate');
  });

  it('generates a complete section', async () => {
    const section = await agent.generateSection(sampleSymptomData);
    expect(section.valid).toBe(true);
    expect(section.content).toContain('Emotional Symptoms');
  });
});