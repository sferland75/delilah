import { describe, expect, it } from '@jest/globals';
import { ROMData, JointROM } from '../types';

describe('ROM Data Types', () => {
  it('should validate a basic ROM measurement', () => {
    const measurement: ROMData = {
      joint: 'shoulder',
      movement: 'flexion',
      active: {
        right: 180,
        left: 175,
        normal: 180
      }
    };

    expect(measurement.joint).toBe('shoulder');
    expect(measurement.active.normal).toBe(180);
  });

  it('should allow optional fields', () => {
    const measurement: ROMData = {
      joint: 'knee',
      movement: 'flexion',
      active: {
        right: 130
      }
    };

    expect(measurement.passive).toBeUndefined();
    expect(measurement.painScale).toBeUndefined();
  });

  it('should validate a complete joint ROM set', () => {
    const shoulderROM: JointROM = {
      shoulder: [
        {
          joint: 'shoulder',
          movement: 'flexion',
          active: {
            right: 180,
            left: 175,
            normal: 180
          }
        },
        {
          joint: 'shoulder',
          movement: 'abduction',
          active: {
            right: 170,
            left: 165,
            normal: 180
          }
        }
      ]
    };

    // Add null check before accessing array
    if (shoulderROM.shoulder) {
      expect(shoulderROM.shoulder).toHaveLength(2);
      expect(shoulderROM.shoulder[0].movement).toBe('flexion');
    } else {
      fail('Shoulder measurements should be defined');
    }
  });
});