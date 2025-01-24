import { EmotionalSymptomAgent } from '../EmotionalSymptomAgent';
import { sampleSymptomData } from '../__fixtures__/sampleData';

describe('EmotionalSymptomAgent', () => {
  const mockContext = {
    options: { detailLevel: 'standard' }
  };
  
  const agent = new EmotionalSymptomAgent(mockContext as any);

  it('should process emotional symptoms correctly', async () => {
    const result = await agent.processData(sampleSymptomData.symptoms.emotional);
    
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      location: 'Irritability',
      severity: 'Severe',
      frequency: 'Rarely'
    });
  });

  it('should handle impact and management information', async () => {
    const result = await agent.processData(sampleSymptomData.symptoms.emotional);
    
    const irritability = result[0];
    expect(irritability.impact).toContain('intense agitation');
    expect(irritability.impact).toContain('triggered when driving');
    expect(irritability.management).toContain('Wife is able to calm him down');
  });

  it('should analyze emotional patterns', async () => {
    const result = await agent.processData(sampleSymptomData.symptoms.emotional);
    const patterns = (agent as any).analyzeEmotionalPatterns(result);
    
    expect(patterns).toContainEqual('Significant irritability affecting interpersonal relationships');
  });

  it('should format output appropriately', async () => {
    const result = await agent.processData(sampleSymptomData.symptoms.emotional);
    const formatted = agent.format(result);
    
    // Should include symptom
    expect(formatted).toContain('Irritability');
    
    // Should include severity
    expect(formatted).toContain('Severe');
    
    // Should include frequency
    expect(formatted).toContain('Rarely');
  });
});