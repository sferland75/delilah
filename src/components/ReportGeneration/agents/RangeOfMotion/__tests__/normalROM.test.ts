import { describe, expect, it } from '@jest/globals';
import { normalROMData } from '../normalROM';

describe('Normal ROM Data', () => {
  it('should have expected joints defined', () => {
    const joints = Array.from(normalROMData.keys());
    const expectedJoints = [
      'cervical',
      'shoulder',
      'elbow',
      'wrist',
      'hip',
      'knee',
      'ankle',
      'spine'
    ];

    expectedJoints.forEach(joint => {
      expect(joints).toContain(joint);
    });
  });

  it('should have correct shoulder values', () => {
    const shoulderData = normalROMData.get('shoulder');
    expect(shoulderData?.get('flexion')).toBe(180);
    expect(shoulderData?.get('abduction')).toBe(180);
    expect(shoulderData?.get('externalRotation')).toBe(90);
  });

  it('should have correct knee values', () => {
    const kneeData = normalROMData.get('knee');
    expect(kneeData?.get('flexion')).toBe(140);
    expect(kneeData?.get('extension')).toBe(0);
  });
});
