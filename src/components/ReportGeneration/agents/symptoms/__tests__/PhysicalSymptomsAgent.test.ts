import { PhysicalSymptomsAgent } from '../PhysicalSymptomsAgent';
import { mockContext, sampleSymptomData } from '../../../testing/mockData';

describe('PhysicalSymptomsAgent', () => {
  const agent = new PhysicalSymptomsAgent(mockContext);

  it('processes physical symptoms correctly', async () => {
    const result = await agent.processData(sampleSymptomData);
    expect(result.valid).toBe(true);
    expect(result.symptoms[0]).toHaveProperty('location', 'Lower Back');
    expect(result.symptoms[0]).toHaveProperty('severity', 'Moderate');
  });

  it('formats symptoms by detail level', async () => {
    const processed = await agent.processData(sampleSymptomData);
    
    const brief = agent.formatByDetailLevel(processed, 'brief');
    expect(brief).toContain('Pain (Moderate)');
    
    const standard = agent.formatByDetailLevel(processed, 'standard');
    expect(standard).toContain('Frequency: Daily');
    
    const detailed = agent.formatByDetailLevel(processed, 'detailed');
    expect(detailed).toContain('Management: Medication');
  });

  it('generates a complete section', async () => {
    const section = await agent.generateSection(sampleSymptomData);
    expect(section.valid).toBe(true);
    expect(section.content).toContain('Physical Symptoms');
  });
});