import { RangeOfMotionAgent } from '../RangeOfMotionAgent';
import { createMockContext } from '../../../testing/mockContext';
import { AssessmentData } from '../../../types';
import { ROMPattern } from '../types';

describe('RangeOfMotionAgent', () => {
  let agent: RangeOfMotionAgent;

  beforeEach(() => {
    agent = new RangeOfMotionAgent(createMockContext());
  });

  const sampleData: AssessmentData = {
    id: 'test',
    date: '2025-01-26',
    functionalAssessment: {
      rangeOfMotion: {
        shoulder: [
          {
            movement: 'flexion',
            active: {
              right: 160,
              left: 120,
              normal: 180
            },
            painScale: {
              right: 2,
              left: 6
            }
          }
        ],
        knee: [
          {
            movement: 'flexion',
            active: {
              right: 130,
              left: 130,
              normal: 140
            }
          }
        ]
      }
    }
  };

  describe('processData', () => {
    it('identifies asymmetrical movements', async () => {
      const result = await agent.processData(sampleData);
      expect(result.valid).toBe(true);
      expect(result.patterns?.unilateral).toBeDefined();
      
      const hasAsymmetry = result.patterns?.unilateral?.some((p: ROMPattern) => 
        p.joint === 'shoulder' && p.movement === 'flexion' && p.difference === 40
      );
      expect(hasAsymmetry).toBe(true);
    });

    it('identifies painful movements', async () => {
      const result = await agent.processData(sampleData);
      expect(result.valid).toBe(true);
      expect(result.patterns?.painful).toBeDefined();
      
      const hasPain = result.patterns?.painful?.some((p: ROMPattern) =>
        p.joint === 'shoulder' && p.movement === 'flexion' && p.intensity === 6
      );
      expect(hasPain).toBe(true);
    });
  });

  describe('formatting', () => {
    it('formats output at different detail levels', async () => {
      const result = await agent.processData(sampleData);
      expect(result.valid).toBe(true);

      const briefFormat = agent.getFormattedContent(result, 'brief');
      expect(briefFormat).toContain('Range of Motion Summary');
      expect(briefFormat).toContain('shoulder');
      expect(briefFormat).toContain('40');

      const standardFormat = agent.getFormattedContent(result, 'standard');
      expect(standardFormat).toContain('Range of Motion Assessment');
      expect(standardFormat).toContain('shoulder');
      expect(standardFormat).toContain('flexion');

      const detailedFormat = agent.getFormattedContent(result, 'detailed');
      expect(detailedFormat).toContain('Joint Measurements');
      expect(detailedFormat).toContain('Movement Pattern Analysis');
      expect(detailedFormat).toContain('Functional Analysis');
    });
  });
});