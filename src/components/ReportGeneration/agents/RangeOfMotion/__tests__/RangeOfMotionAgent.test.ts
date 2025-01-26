import { describe, expect, it } from '@jest/globals';
import { RangeOfMotionAgent } from '../RangeOfMotionAgent';
import { sampleJointData } from '../__fixtures__/sampleData';

// Test helper class to access protected methods
class TestRangeOfMotionAgent extends RangeOfMotionAgent {
  public async testFormatting(data: any, level: string): Promise<string> {
    return this.formatByDetailLevel(data, level);
  }
}

describe('RangeOfMotionAgent', () => {
  const mockContext = {
    options: { detailLevel: 'standard' }
  };

  const agent = new TestRangeOfMotionAgent(mockContext as any);

  describe('Data Processing', () => {
    it('should process ROM data correctly', async () => {
      const result = await agent.processData(sampleJointData);
      
      expect(result.joints.shoulder).toBeDefined();
      expect(result.joints.cervical).toBeDefined();
      expect(result.patterns).toBeDefined();
      expect(result.functional).toBeDefined();
      expect(result.impact).toBeDefined();
    });

    it('should identify movement patterns', async () => {
      const result = await agent.processData(sampleJointData);
      
      // Should identify shoulder asymmetry
      const hasAsymmetry = result.patterns.unilateral.some(p => 
        p.match(/shoulder.*asymmetrical/i)
      );
      expect(hasAsymmetry).toBe(true);
      
      // Should identify painful movements
      const hasPain = result.patterns.painful.some(p => 
        p.match(/shoulder.*painful/i)
      );
      expect(hasPain).toBe(true);
    });
  });

  describe('Validation', () => {
    it('should validate ROM measurements', async () => {
      const invalidData = {
        functionalAssessment: {
          rangeOfMotion: {
            shoulder: [{
              joint: 'shoulder',
              movement: 'flexion',
              active: {
                right: 250, // Invalid - beyond normal range
                left: 180,
                normal: 180
              }
            }]
          }
        }
      };

      const validation = await agent.validateData(invalidData);
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContainEqual(expect.stringMatching(/Invalid.*range/i));
    });
  });

  describe('Formatting', () => {
    it('should format output according to detail level', async () => {
      const result = await agent.processData(sampleJointData);
      const formatted = await agent.testFormatting(result, 'standard');
      
      // Should include movement patterns
      expect(formatted).toContain('Movement Patterns');
      
      // Should include functional impacts
      expect(formatted).toContain('Functional Impact');
      
      // Should include measurements
      expect(formatted).toContain('shoulder');
      expect(formatted).toContain('cervical');
    });
  });
});