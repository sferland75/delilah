import { NarrativeTransfersAgent } from '../TransfersAgent';
import { createMockContext } from '../../../testing/mockContext';
import { AssessmentData } from '../../../types';

describe('NarrativeTransfersAgent', () => {
  let agent: NarrativeTransfersAgent;

  beforeEach(() => {
    agent = new NarrativeTransfersAgent(createMockContext());
  });

  const mockData: AssessmentData = {
    id: 'test',
    date: '2025-01-26',
    functionalAssessment: {
      transfers: {
        bedMobility: 'Modified Independent',
        sitToStand: 'Independent',
        toilet: {
          assistanceLevel: 'Modified Independent',
          equipment: ['grab_bars', 'toilet_riser'],
          modifications: ['Use both grab bars'],
          safety_concerns: ['Fall risk with night transfers']
        },
        shower: {
          assistanceLevel: 'Modified Independent',
          equipment: ['shower_chair', 'grab_bars'],
          modifications: ['Seated shower only']
        }
      },
      bergBalance: {
        totalScore: 40
      }
    },
    equipment: {
      current: ['shower_chair']
    }
  };

  describe('processData', () => {
    it('generates narrative correctly', async () => {
      const result = await agent.processData(mockData);
      expect(result.valid).toBe(true);
      expect(result.narrative).toContain('modified independent');
      expect(result.narrative).toContain('transfers');
      expect(result.narrative).toContain('balance');
    });

    it('generates bullet points', async () => {
      const result = await agent.processData(mockData);
      expect(result.bullets).toContainEqual(expect.stringContaining('grab_bars'));
      expect(result.bullets).toContainEqual(expect.stringContaining('Fall risk'));
      expect(result.bullets).toContainEqual(expect.stringContaining('modifications'));
    });

    it('generates recommendations', async () => {
      const result = await agent.processData(mockData);
      expect(result.recommendations).toContainEqual(expect.stringContaining('grab_bars'));
      expect(result.recommendations).toContainEqual(expect.stringContaining('therapy'));
    });
  });

  describe('formatting', () => {
    it('formats brief output correctly', async () => {
      const result = await agent.processData(mockData);
      const brief = agent.getFormattedContent(result, 'brief');
      expect(brief).toBe(result.narrative);
    });

    it('formats detailed output correctly', async () => {
      const result = await agent.processData(mockData);
      const detailed = agent.getFormattedContent(result, 'detailed');
      expect(detailed).toContain('Key Points');
      expect(detailed).toContain('Recommendations');
    });

    it('handles minimal data gracefully', async () => {
      const minimalData: AssessmentData = {
        id: 'test',
        date: '2025-01-26',
        functionalAssessment: {
          transfers: {
            bedMobility: 'Independent'
          }
        }
      };

      const result = await agent.processData(minimalData);
      expect(result.valid).toBe(true);
      expect(result.narrative).toContain('independent');
      expect(result.narrative).not.toContain('undefined');
    });
  });
});