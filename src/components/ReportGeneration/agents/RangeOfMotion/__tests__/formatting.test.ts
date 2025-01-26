import { describe, expect, it } from '@jest/globals';
import { formatBrief, formatStandard, formatDetailed } from '../formatting';
import { sampleJointData } from '../__fixtures__/sampleData';
import { ROMAnalysis } from '../types';

describe('ROM Formatting', () => {
  const sampleAnalysis: ROMAnalysis = {
    joints: sampleJointData.functionalAssessment.rangeOfMotion,
    patterns: {
      bilateral: [],
      unilateral: ['shoulder flexion asymmetrical (70° difference)'],
      painful: ['shoulder flexion painful'],
      restricted: ['shoulder flexion severely restricted']
    },
    functional: {
      upperExtremity: ['Difficulty with overhead reaching'],
      lowerExtremity: [],
      spine: []
    },
    impact: [
      'Multiple painful movements indicate activity modification needs',
      'Difficulty with overhead reaching'
    ]
  };

  describe('Brief Format', () => {
    it('should include key findings', () => {
      const output = formatBrief(sampleAnalysis);
      
      expect(output).toContain('Range of Motion Summary');
      expect(output).toContain('severely restricted');
      expect(output).toContain('overhead reaching');
    });
  });

  describe('Standard Format', () => {
    it('should include movement patterns', () => {
      const output = formatStandard(sampleAnalysis);
      
      expect(output).toContain('Movement Patterns');
      expect(output).toContain('asymmetrical');
      expect(output).toContain('painful');
    });

    it('should include functional impacts', () => {
      const output = formatStandard(sampleAnalysis);
      
      expect(output).toContain('Functional Impact');
      expect(output).toContain('overhead reaching');
    });
  });

  describe('Detailed Format', () => {
    it('should include joint measurements', () => {
      const output = formatDetailed(sampleAnalysis);
      
      expect(output).toContain('Joint Measurements');
      expect(output).toContain('shoulder');
      expect(output).toContain('flexion');
      expect(output).toContain('R: 90°');
    });

    it('should include patterns and impacts', () => {
      const output = formatDetailed(sampleAnalysis);
      
      expect(output).toContain('Movement Patterns');
      expect(output).toContain('Functional Analysis');
      expect(output).toContain('Clinical Impact');
    });
  });
});