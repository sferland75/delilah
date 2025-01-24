import { CognitiveSymptomAgent } from '../CognitiveSymptomAgent';
import { sampleSymptomData } from '../__fixtures__/sampleData';

describe('CognitiveSymptomAgent', () => {
  const mockContext = {
    options: { detailLevel: 'standard' }
  };
  
  const agent = new CognitiveSymptomAgent(mockContext as any);

  it('should process cognitive symptoms correctly', async () => {
    const result = await agent.processData(sampleSymptomData.symptoms.cognitive);
    
    expect(result).toHaveLength(3);
    expect(result[0]).toMatchObject({
      location: 'Memory',
      severity: 'Moderate',
      frequency: 'Constantly'
    });
  });

  it('should handle impact and management information', async () => {
    const result = await agent.processData(sampleSymptomData.symptoms.cognitive);
    
    const memory = result.find(s => s.location === 'Memory');
    expect(memory?.impact).toContain('forgetful');
    expect(memory?.impact).toContain('misplacing items');
    
    const problemSolving = result.find(s => s.location === 'Problem Solving');
    expect(problemSolving?.management).toBe('Wife challenges his thinking');
  });

  it('should format output appropriately', async () => {
    const result = await agent.processData(sampleSymptomData.symptoms.cognitive);
    const formatted = agent.format(result);
    
    // Should include all symptom types
    expect(formatted).toContain('Memory');
    expect(formatted).toContain('Attention');
    expect(formatted).toContain('Problem Solving');
    
    // Should include severity levels
    expect(formatted).toContain('Moderate');
    expect(formatted).toContain('Severe');
    
    // Should include frequencies
    expect(formatted).toContain('Constantly');
    expect(formatted).toContain('Sometimes');
  });
});