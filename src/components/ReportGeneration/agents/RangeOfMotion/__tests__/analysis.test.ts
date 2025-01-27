import { JointROM } from '../types';
import { processROM } from '../analysis';

describe('ROM Analysis', () => {
  it('identifies restricted patterns', () => {
    const joints: JointROM = {
      shoulder: [{
        movement: 'flexion',
        active: {
          right: 90,
          left: 160,
          normal: 180
        }
      }]
    };

    const result = processROM(joints);
    expect(result.patterns.restricted.length).toBeGreaterThan(0);
    const hasRestricted = result.patterns.restricted.some(p => 
      p.joint === 'shoulder' && p.movement === 'flexion');
    expect(hasRestricted).toBe(true);
  });

  it('identifies asymmetrical patterns', () => {
    const joints: JointROM = {
      shoulder: [{
        movement: 'flexion',
        active: {
          right: 90,
          left: 160,
          normal: 180
        }
      }]
    };

    const result = processROM(joints);
    expect(result.patterns.unilateral.length).toBeGreaterThan(0);
    const hasAsymmetry = result.patterns.unilateral.some(p => 
      p.joint === 'shoulder' && p.movement === 'flexion' && p.side === 'left');
    expect(hasAsymmetry).toBe(true);
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

    const result = processROM(joints);
    expect(result.patterns.painful.length).toBeGreaterThan(0);
    const hasPain = result.patterns.painful.some(p => 
      p.joint === 'shoulder' && p.movement === 'flexion' && p.side === 'right');
    expect(hasPain).toBe(true);
  });
});