import { PhysicalSymptomsAgent } from '../PhysicalSymptomsAgent';
import { sampleSymptomData } from '../__fixtures__/sampleData';

describe('PhysicalSymptomsAgent', () => {
  const mockContext = {
    options: { detailLevel: 'standard' }
  };
  
  const agent = new PhysicalSymptomsAgent(mockContext as any);

  it('should process physical symptoms correctly', async () => {
    const result = await agent.processData(sampleSymptomData.symptoms.physical);
    
    expect(result).toHaveLength(3);
    expect(result[0]).toMatchObject({
      location: 'Right hip/Groin',
      painType: 'Sharp',
      severity: 'Very Severe',
      frequency: 'Rarely'
    });
  });

  it('should include aggravating and relieving factors', async () => {
    const result = await agent.processData(sampleSymptomData.symptoms.physical);
    
    expect(result[0].aggravating).toContain('Every step');
    expect(result[0].relieving).toContain('Moving');
    
    expect(result[1].aggravating).toContain('Standing');
    expect(result[1].relieving).toContain('Lying down');
  });

  it('should process impact information', async () => {
    const result = await agent.processData(sampleSymptomData.symptoms.physical);
    
    // Should identify severe impacts
    const severeSymptoms = result.filter(s => 
      s.severity === 'Severe' || s.severity === 'Very Severe'
    );
    severeSymptoms.forEach(symptom => {
      expect(symptom.impact).toContain('Significantly limits');
    });
  });

  it('should format output appropriately', async () => {
    const result = await agent.processData(sampleSymptomData.symptoms.physical);
    const formatted = agent.format(result);
    
    // Should include severity levels
    expect(formatted).toContain('Very Severe');
    expect(formatted).toContain('Severe');
    
    // Should include locations
    expect(formatted).toContain('Right hip/Groin');
    expect(formatted).toContain('Lower back');
    expect(formatted).toContain('Right shoulder/arm');
    
    // Should include pain types
    expect(formatted).toContain('Sharp');
    expect(formatted).toContain('Stabbing');
  });
});