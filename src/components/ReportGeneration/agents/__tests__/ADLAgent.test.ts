import { ADLAgent } from '../ADLAgent';
import { mockAssessmentData } from '../testing/mockData';
import { AgentContext } from '../../types';

describe('ADLAgent', () => {
  const mockContext: AgentContext = {
    config: {
      detailLevel: 'standard'
    }
  };

  it('should process ADL data correctly', async () => {
    const agent = new ADLAgent(mockContext);
    const result = await agent.processData(mockAssessmentData);
    
    expect(result.valid).toBe(true);
    expect(result.basic).toBeDefined();
    expect(result.instrumental).toBeDefined();
  });

  it('should format brief output correctly', async () => {
    const agent = new ADLAgent({ ...mockContext, config: { detailLevel: 'brief' }});
    const result = await agent.processData(mockAssessmentData);
    const formatted = await agent.getFormattedContent(result, 'brief');
    
    expect(formatted).toContain('ADL Assessment Summary');
    expect(formatted).toContain('feeding: Independent');
  });

  it('should format standard output correctly', async () => {
    const agent = new ADLAgent(mockContext);
    const result = await agent.processData(mockAssessmentData);
    const formatted = await agent.getFormattedContent(result, 'standard');
    
    expect(formatted).toContain('ADL Assessment');
    expect(formatted).toContain('Independent:');
    expect(formatted).toContain('Modified Independent:');
  });

  it('should format detailed output correctly', async () => {
    const agent = new ADLAgent({ ...mockContext, config: { detailLevel: 'detailed' }});
    const result = await agent.processData(mockAssessmentData);
    const formatted = await agent.getFormattedContent(result, 'detailed');
    
    expect(formatted).toContain('Detailed ADL Assessment');
    expect(formatted).toContain('feeding:');
    expect(formatted).toContain('bathing:');
    expect(formatted).toContain('Equipment Used: Shower chair');
  });
});