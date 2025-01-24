import { SymptomIntegrationAgent } from '../SymptomIntegrationAgent';
import { sampleSymptomData } from '../__fixtures__/sampleData';

describe('SymptomIntegrationAgent', () => {
  const mockContext = {
    options: { detailLevel: 'standard' }
  };
  
  const agent = new SymptomIntegrationAgent(mockContext as any);

  it('should process all symptom types', async () => {
    const result = await agent.processData(sampleSymptomData);
    
    // Check structure
    expect(result.physical).toBeDefined();
    expect(result.cognitive).toBeDefined();
    expect(result.emotional).toBeDefined();
    expect(result.patterns).toBeDefined();
    expect(result.overall).toBeDefined();

    // Check physical symptoms
    expect(result.physical).toHaveLength(3);
    expect(result.physical[0].location).toBe('Right hip/Groin');

    // Check cognitive symptoms
    expect(result.cognitive).toHaveLength(3);
    expect(result.cognitive[0].location).toBe('Memory');

    // Check emotional symptoms
    expect(result.emotional).toHaveLength(1);
    expect(result.emotional[0].location).toBe('Irritability');
  });

  it('should identify patterns correctly', async () => {
    const result = await agent.processData(sampleSymptomData);
    
    // Activity patterns should identify lifting and movement triggers
    expect(result.patterns.activities).toContainEqual(expect.stringMatching(/activity-dependent/i));
    
    // Check severe symptoms
    const severeSymptoms = result.physical.filter(s => s.severity === 'Severe' || s.severity === 'Very Severe');
    expect(severeSymptoms.length).toBeGreaterThan(0);
  });

  it('should identify primary limitations', async () => {
    const result = await agent.processData(sampleSymptomData);
    
    const limitations = result.overall.primaryLimitations;
    
    // Should identify physical limitations
    expect(limitations).toContainEqual('Significant physical functional restrictions');
    
    // Should identify cognitive limitations
    expect(limitations).toContainEqual('Memory and attention deficits affecting daily function');
    
    // Should identify emotional limitations
    expect(limitations).toContainEqual('Emotional regulation challenges');
  });

  it('should identify most severe and frequent symptoms', async () => {
    const result = await agent.processData(sampleSymptomData);

    // Very Severe hip pain should be identified as most severe
    expect(result.overall.mostSevere).toContain('Very Severe');
    expect(result.overall.mostSevere).toContain('hip');

    // Memory (Constantly) should be identified as most frequent
    expect(result.overall.mostFrequent).toContain('Constantly');
    expect(result.overall.mostFrequent.toLowerCase()).toContain('memory');
  });

  it('should format output according to detail level', async () => {
    const result = await agent.processData(sampleSymptomData);
    const formatted = agent.format(result);

    // Should include section headers
    expect(formatted).toContain('Physical Symptoms');
    expect(formatted).toContain('Cognitive Symptoms');
    expect(formatted).toContain('Emotional Symptoms');

    // Should include severity and frequency information
    expect(formatted).toContain('Very Severe');
    expect(formatted).toContain('Rarely');
    expect(formatted).toContain('Constantly');

    // Should include limitations
    expect(formatted).toContain('Primary Limitations');
  });
});