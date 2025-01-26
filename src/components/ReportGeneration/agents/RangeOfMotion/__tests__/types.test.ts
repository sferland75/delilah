import { ROMData, ROMPattern } from '../types';

describe('ROM Types', () => {
  describe('ROMData', () => {
    it('validates ROMData structure', () => {
      const measurement: ROMData = {
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
      };

      expect(measurement.movement).toBe('flexion');
      expect(measurement.active.right).toBe(160);
      expect(measurement.active.left).toBe(120);
      expect(measurement.active.normal).toBe(180);
    });

    it('handles optional fields', () => {
      const measurement: ROMData = {
        movement: 'flexion',
        active: {
          right: 130,
          left: 130
        }
      };

      expect(measurement.movement).toBe('flexion');
      expect(measurement.painScale).toBeUndefined();
      expect(measurement.endFeel).toBeUndefined();
    });
  });

  describe('ROMPattern', () => {
    it('validates unilateral pattern structure', () => {
      const pattern: ROMPattern = {
        joint: 'shoulder',
        movement: 'flexion',
        side: 'right',
        difference: 40
      };

      expect(pattern.joint).toBe('shoulder');
      expect(pattern.side).toBe('right');
      expect(pattern.difference).toBe(40);
    });

    it('validates painful pattern structure', () => {
      const pattern: ROMPattern = {
        joint: 'shoulder',
        movement: 'flexion',
        side: 'left',
        intensity: 6
      };

      expect(pattern.joint).toBe('shoulder');
      expect(pattern.intensity).toBe(6);
    });

    it('validates restricted pattern structure', () => {
      const pattern: ROMPattern = {
        joint: 'shoulder',
        movement: 'flexion',
        description: 'severely restricted'
      };

      expect(pattern.joint).toBe('shoulder');
      expect(pattern.description).toBe('severely restricted');
    });
  });
});