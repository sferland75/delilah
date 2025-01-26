import { describe, expect, it } from '@jest/globals';
import { identifyPatterns, analyzeUpperExtremityFunction, analyzeLowerExtremityFunction } from '../analysis';
import { sampleJointData } from '../__fixtures__/sampleData';
import { JointROM } from '../types';

describe('ROM Analysis', () => {
  const joints = sampleJointData.functionalAssessment.rangeOfMotion as JointROM;

  describe('Pattern Identification', () => {
    it('should identify bilateral patterns', () => {
      const patterns = identifyPatterns(joints);
      const hasRestricted = patterns.restricted.some(p => p.match(/shoulder.*restricted/));
      expect(hasRestricted).toBe(true);
    });

    it('should identify asymmetrical patterns', () => {
      const patterns = identifyPatterns(joints);
      const hasAsymmetry = patterns.unilateral.some(p => p.match(/shoulder.*asymmetrical/));
      expect(hasAsymmetry).toBe(true);
    });

    it('should identify painful movements', () => {
      const patterns = identifyPatterns(joints);
      const hasPainful = patterns.painful.some(p => p.match(/shoulder.*painful/));
      expect(hasPainful).toBe(true);
    });
  });

  describe('Functional Analysis', () => {
    it('should analyze upper extremity function', () => {
      const impacts: string[] = [];
      analyzeUpperExtremityFunction(joints, {}, impacts);
      const hasOverheadImpact = impacts.some(i => i.match(/overhead reaching/));
      expect(hasOverheadImpact).toBe(true);
    });

    it('should analyze lower extremity function', () => {
      const impacts: string[] = [];
      const lowerData: JointROM = {
        knee: [{
          joint: 'knee',
          movement: 'flexion',
          active: {
            right: 80,
            left: 85,
            normal: 140
          }
        }]
      };
      
      analyzeLowerExtremityFunction(lowerData, {}, impacts);
      const hasStairImpact = impacts.some(i => i.match(/knee.*stair/));
      expect(hasStairImpact).toBe(true);
    });
  });
});