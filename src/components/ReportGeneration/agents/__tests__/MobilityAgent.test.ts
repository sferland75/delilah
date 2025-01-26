import { MobilityAgent } from '../MobilityAgent';
import { mockMobilityData, createMockContext } from '../../testing/mockData';
import { AssessmentData } from '../../types';

describe('MobilityAgent', () => {
  let agent: MobilityAgent;

  beforeEach(() => {
    agent = new MobilityAgent(createMockContext());
  });

  describe('processData', () => {
    it('processes mobility data correctly', async () => {
      const result = await agent.processData(mockMobilityData);
      expect(result.valid).toBe(true);
      expect(result.mobility.walkingDistance).toBe(100);
      expect(result.mobility.assistiveDevices).toContain('Cane');
      expect(result.mobility.restrictions).toContain('No running');
    });

    it('analyzes balance data', async () => {
      const dataWithBalance: AssessmentData = {
        ...mockMobilityData,
        functionalAssessment: {
          ...mockMobilityData.functionalAssessment,
          bergBalance: {
            totalScore: 35,
            items: {}
          }
        }
      };

      const result = await agent.processData(dataWithBalance);
      expect(result.balance.score).toBe(35);
      expect(result.balance.riskLevel).toBe('moderate');
      expect(result.balance.concerns.length).toBeGreaterThan(0);
    });

    it('generates appropriate recommendations', async () => {
      const result = await agent.processData(mockMobilityData);
      expect(result.recommendations.length).toBeGreaterThan(0);
      expect(result.recommendations.some(r => r.includes('training'))).toBe(true);
    });
  });

  describe('formatting', () => {
    it('formats at different detail levels', async () => {
      const result = await agent.processData(mockMobilityData);
      
      const brief = agent.getFormattedContent(result, 'brief');
      expect(brief).toContain('Mobility Status');
      expect(brief).toContain('Walking Distance');
      
      const detailed = agent.getFormattedContent(result, 'detailed');
      expect(detailed).toContain('Mobility Assessment');
      expect(detailed).toContain('Distance:');
      expect(detailed).toContain('Assistive Devices:');
    });

    it('handles minimal data gracefully', async () => {
      const minimalData: AssessmentData = {
        id: 'test',
        date: '2025-01-26',
        functionalAssessment: {
          mobility: {
            walkingDistance: 50
          }
        }
      };

      const result = await agent.processData(minimalData);
      const formatted = agent.getFormattedContent(result, 'standard');
      expect(formatted).toContain('50 feet');
      expect(formatted).not.toContain('undefined');
    });
  });
});