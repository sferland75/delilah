import { DemographicsAgent } from '../DemographicsAgent';
import { mockAssessmentData, createMockContext } from '../../testing/mockData';

describe('DemographicsAgent', () => {
  let agent: DemographicsAgent;

  beforeEach(() => {
    agent = new DemographicsAgent(createMockContext());
  });

  describe('processData', () => {
    it('processes demographic data correctly', async () => {
      const result = await agent.processData(mockAssessmentData);
      expect(result.valid).toBe(true);
      expect(result.firstName).toBe('John');
      expect(result.lastName).toBe('Doe');
      expect(result.emergencyContact?.name).toBe('Jane Doe');
    });
  });

  describe('formatting', () => {
    it('formats output at different detail levels', async () => {
      const processed = await agent.processData(mockAssessmentData);
      
      const brief = agent.getFormattedContent(processed, 'brief');
      expect(brief).toContain('John Doe');
      
      const standard = agent.getFormattedContent(processed, 'standard');
      expect(standard).toContain('John Doe');
      expect(standard).toContain('Emergency Contact');
      
      const detailed = agent.getFormattedContent(processed, 'detailed');
      expect(detailed).toContain('John Doe');
      expect(detailed).toContain('Jane Doe');
      expect(detailed).toContain('555-0123');
    });
  });
});