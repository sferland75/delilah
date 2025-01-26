import { ROMAnalysis, ROMPattern } from '../types';
import { formatROM } from '../formatting';

describe('ROM Formatting', () => {
  const samplePatterns: Record<string, ROMPattern[]> = {
    unilateral: [{
      joint: 'shoulder',
      movement: 'flexion',
      side: 'right',
      difference: 70
    }],
    painful: [{
      joint: 'shoulder',
      movement: 'flexion',
      side: 'left',
      intensity: 6
    }],
    restricted: [{
      joint: 'shoulder',
      movement: 'flexion',
      description: 'severely restricted'
    }],
    bilateral: []
  };

  const sampleData: ROMAnalysis = {
    joints: {
      shoulder: [{
        movement: 'flexion',
        active: {
          right: 160,
          left: 90,
          normal: 180
        },
        painScale: {
          right: 2,
          left: 6
        }
      }]
    },
    patterns: samplePatterns,
    functional: {
      upperExtremity: ['Difficulty with overhead reaching'],
      lowerExtremity: [],
      spine: []
    },
    impact: ['Limited shoulder mobility affects daily tasks']
  };

  it('formats brief output correctly', () => {
    const output = formatROM(sampleData, 'brief');
    expect(output).toContain('Range of Motion Summary');
    expect(output).toContain('shoulder');
    expect(output).toContain('restricted');
  });

  it('formats standard output correctly', () => {
    const output = formatROM(sampleData, 'standard');
    expect(output).toContain('Range of Motion Assessment');
    expect(output).toContain('Movement Patterns');
    expect(output).toContain('Functional Impact');
  });

  it('formats detailed output correctly', () => {
    const output = formatROM(sampleData, 'detailed');
    expect(output).toContain('Comprehensive Range of Motion Assessment');
    expect(output).toContain('Joint Measurements');
    expect(output).toContain('Movement Patterns');
    expect(output).toContain('Functional Analysis');
  });

  it('handles empty data gracefully', () => {
    const emptyData: ROMAnalysis = {
      joints: {},
      patterns: {
        bilateral: [],
        unilateral: [],
        painful: [],
        restricted: []
      },
      functional: {
        upperExtremity: [],
        lowerExtremity: [],
        spine: []
      },
      impact: []
    };

    const output = formatROM(emptyData);
    expect(output).not.toContain('undefined');
    expect(output).not.toContain('null');
  });
});