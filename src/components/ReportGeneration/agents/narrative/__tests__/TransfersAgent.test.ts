import { NarrativeTransfersAgent } from '../TransfersAgent';
import { createMockContext } from '../../../testing/mockContext';
import { AssessmentData } from '../../../types';

describe('NarrativeTransfersAgent', () => {
  let agent: NarrativeTransfersAgent;

  const mockData: AssessmentData = {
    id: 'test-123',
    date: '2025-01-26',
    functionalAssessment: {
      transfers: {
        bedMobility: 'Modified Independent',
        sitToStand: 'Independent',
        toilet: {
          assistanceLevel: 'Modified Independent',
          equipment: ['grab_bars', 'toilet_riser']
        },
        shower: {
          assistanceLevel: 'Modified Independent',
          equipment: ['shower_chair', 'grab_bars']
        }
      },
      bergBalance: {
        totalScore: 35
      }
    },
    equipment: {
      current: ['grab_bars', 'shower_chair']
    }
  };

  beforeEach(() => {
    agent = new NarrativeTransfersAgent(createMockContext());
  });

  describe('processData', () => {
    it('generates narrative correctly', async () => {
      const result = await agent.processData(mockData);
      expect(result.valid).toBe(true);
      expect(result.narrative).toContain('modified independent');
      expect(result.narrative).toContain('transfers');
      expect(result.narrative.toLowerCase()).toContain('balance');
    });

    it('generates bullet points', async () => {
      const result = await agent.processData(mockData);
      expect(result.bullets).toContainEqual(expect.stringContaining('grab_bars'));
      expect(result.bullets).toContainEqual(expect.stringContaining('shower_chair'));
    });

    it('generates recommendations', async () => {
      const result = await agent.processData(mockData);
      expect(result.recommendations).toContainEqual(expect.stringContaining('training'));
    });
  });

  describe('formatting', () => {
    it('formats at different detail levels', async () => {
      const result = await agent.processData(mockData);

      const brief = agent.getFormattedContent(result, 'brief');
      expect(brief).toBe(result.narrative);

      const standard = agent.getFormattedContent(result, 'standard');
      expect(standard).toContain(result.narrative);
      expect(standard).toContain('Current Equipment:');

      const detailed = agent.getFormattedContent(result, 'detailed');
      expect(detailed).toContain(result.narrative);
      expect(detailed).toContain('Current Equipment:');
      expect(detailed).toContain('Recommendations:');
    });
  });
});