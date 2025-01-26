import { SymptomIntegrationAgent } from '../SymptomIntegrationAgent';
import { mockContext, sampleSymptomData } from '../../../testing/mockData';

describe('SymptomIntegrationAgent', () => {
  const agent = new SymptomIntegrationAgent(mockContext);

  it('processes all symptom types correctly', async () => {
    const result = await agent.processData(sampleSymptomData);
    expect(result.valid).toBe(true);
    expect(result.symptoms.physical).toBeDefined();
    expect(result.symptoms.cognitive).toBeDefined();
    expect(result.symptoms.emotional).toBeDefined();
  });

  it('formats integrated report correctly', async () => {
    const section = await agent.generateSection(sampleSymptomData);
    expect(section.valid).toBe(true);
    expect(section.content).toContain('Physical Symptoms');
    expect(section.content).toContain('Lower Back');
    expect(section.content).toContain('Memory issues');
    expect(section.content).toContain('Anxiety');
  });
});