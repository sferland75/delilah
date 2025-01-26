import { JointROM, ROMPattern } from '../types';
import { identifyPatterns, analyzeUpperExtremityFunction, analyzeLowerExtremityFunction } from '../analysis';

describe('ROM Analysis', () => {
  describe('identifyPatterns', () => {
    it('identifies restricted ranges', () => {
      const joints: JointROM = {
        shoulder: [{
          movement: 'flexion',
          active: {
            right: 90,
            left: 85,
            normal: 180
          }
        }]
      };

      const patterns = identifyPatterns(joints);
      expect(patterns.bilateral.length).toBeGreaterThan(0);
      expect(patterns.bilateral[0].description).toContain('restricted');
    });

    it('identifies asymmetrical patterns', () => {
      const joints: JointROM = {
        shoulder: [{
          movement: 'flexion',
          active: {
            right: 160,
            left: 90,
            normal: 180
          }
        }]
      };

      const patterns = identifyPatterns(joints);
      expect(patterns.unilateral.length).toBeGreaterThan(0);
      expect(patterns.unilateral[0].difference).toBeDefined();
      expect(patterns.unilateral[0].side).toBeDefined();
    });

    it('identifies painful movements', () => {
      const joints: JointROM = {
        shoulder: [{
          movement: 'flexion',
          active: {
            right: 160,
            left: 160,
            normal: 180
          },
          painScale: {
            right: 6,
            left: 2
          }
        }]
      };

      const patterns = identifyPatterns(joints);
      expect(patterns.painful.length).toBeGreaterThan(0);
      expect(patterns.painful[0].intensity).toBeDefined();
      expect(patterns.painful[0].side).toBeDefined();
    });
  });

  describe('analyzeUpperExtremityFunction', () => {
    it('analyzes shoulder limitations', () => {
      const joints: JointROM = {
        shoulder: [{
          movement: 'flexion',
          active: {
            right: 90,
            left: 90,
            normal: 180
          }
        }]
      };

      const impacts: string[] = [];
      const emptyPatterns = {
        bilateral: [],
        unilateral: [],
        painful: [],
        restricted: []
      };

      analyzeUpperExtremityFunction(joints, emptyPatterns, impacts);
      expect(impacts.length).toBeGreaterThan(0);
      expect(impacts[0]).toContain('reaching');
    });
  });

  describe('analyzeLowerExtremityFunction', () => {
    it('analyzes knee limitations', () => {
      const lowerData: JointROM = {
        knee: [{
          movement: 'flexion',
          active: {
            right: 80,
            left: 80,
            normal: 140
          }
        }]
      };

      const impacts: string[] = [];
      const emptyPatterns = {
        bilateral: [],
        unilateral: [],
        painful: [],
        restricted: []
      };

      analyzeLowerExtremityFunction(lowerData, emptyPatterns, impacts);
      expect(impacts.length).toBeGreaterThan(0);
      expect(impacts[0]).toContain('stair');
    });
  });
});