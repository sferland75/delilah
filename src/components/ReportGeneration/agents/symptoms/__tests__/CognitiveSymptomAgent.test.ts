import { CognitiveSymptomAgent } from '../CognitiveSymptomAgent';
import { mockContext, sampleSymptomData } from '../../../testing/mockData';

describe('CognitiveSymptomAgent', () => {
  const agent = new CognitiveSymptomAgent(mockContext);

  it('processes cognitive symptoms correctly', async () => {
    const result = await agent.processData(sampleSymptomData);
    expect(result.valid).toBe(true);
    expect(result.symptoms[0]).toMatchObject({
      symptom: 'Memory issues',
      severity: 'Mild'
    });
  });

  it('formats symptoms appropriately', async () => {
    const result = await agent.processData(sampleSymptomData);
    
    const memory = result.symptoms.find(s => s.symptom === 'Memory issues');
    expect(memory).toBeDefined();
    expect(memory?.management).toBe('Calendar reminders');
  });

  it('generates a complete section', async () => {
    const section = await agent.generateSection(sampleSymptomData);
    expect(section.valid).toBe(true);
    expect(section.content).toContain('Cognitive Symptoms');
  });
});