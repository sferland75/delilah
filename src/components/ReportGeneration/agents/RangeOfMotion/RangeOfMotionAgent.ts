import { BaseAgent } from '../BaseAgent';
import { AgentContext, AssessmentData } from '../../types';
import { processROM } from './analysis';
import { ROMAnalysis } from './types';
import _ from 'lodash';

export interface ROMOutput extends ROMAnalysis {
  valid: boolean;
}

export class RangeOfMotionAgent extends BaseAgent {
  constructor(context: AgentContext) {
    super(context, 2.3, 'Range of Motion', ['functionalAssessment.rangeOfMotion']);
  }

  async processData(data: AssessmentData): Promise<ROMOutput> {
    const rom = _.get(data, 'functionalAssessment.rangeOfMotion', {});
    const processedData = processROM(rom);
    
    return {
      valid: true,
      ...processedData
    };
  }

  format(data: ROMOutput): string {
    return this.getFormattedContent(data, 'standard');
  }

  protected override formatBrief(data: ROMOutput): string {
    const sections = ['Range of Motion Summary'];
    
    if (data.patterns?.unilateral?.length > 0) {
      sections.push('\nAsymmetrical Movements:');
      data.patterns.unilateral.forEach(p => {
        sections.push(`- ${p.joint} (${p.side || 'unknown'}): ${p.difference || 'significant'} difference`);
      });
    }

    if (data.patterns?.painful?.length > 0) {
      sections.push('\nPainful Movements:');
      data.patterns.painful.forEach(p => {
        sections.push(`- ${p.joint} ${p.movement}: ${p.intensity || 'reported'}/10 pain`);
      });
    }

    if (data.impact?.length > 0) {
      sections.push('\nFunctional Impact:');
      data.impact.forEach(impact => {
        sections.push(`- ${impact}`);
      });
    }

    return sections.join('\n');
  }

  protected override formatDetailed(data: ROMOutput): string {
    const sections = ['Range of Motion Assessment'];
    
    // Joint measurements
    if (Object.keys(data.joints || {}).length > 0) {
      sections.push('\nJoint Measurements:');
      Object.entries(data.joints || {}).forEach(([joint, measurements]) => {
        if (!measurements?.length) return;
        
        sections.push(`\n${joint}:`);
        measurements.forEach(rom => {
          sections.push(`  ${rom.movement}:`);
          if (rom.active) {
            sections.push(`    Active: R: ${rom.active.right || 'NT'}°, L: ${rom.active.left || 'NT'}°`);
            if (rom.active.normal) {
              sections.push(`    Normal: ${rom.active.normal}°`);
            }
          }
          if (rom.passive) {
            sections.push(`    Passive: R: ${rom.passive.right || 'NT'}°, L: ${rom.passive.left || 'NT'}°`);
          }
          if (rom.painScale) {
            sections.push(`    Pain: R: ${rom.painScale.right || 0}/10, L: ${rom.painScale.left || 0}/10`);
          }
          if (rom.endFeel) {
            sections.push(`    End Feel: R: ${rom.endFeel.right || 'NT'}, L: ${rom.endFeel.left || 'NT'}`);
          }
          if (rom.notes) {
            sections.push(`    Notes: ${rom.notes}`);
          }
        });
      });
    }

    // Movement Patterns
    sections.push('\nMovement Pattern Analysis:');

    if (data.patterns?.bilateral?.length > 0) {
      sections.push('\n  Bilateral Restrictions:');
      data.patterns.bilateral.forEach(p => {
        sections.push(`  - ${p.joint} ${p.movement}: ${p.description}`);
      });
    }

    if (data.patterns?.unilateral?.length > 0) {
      sections.push('\n  Asymmetrical Movements:');
      data.patterns.unilateral.forEach(p => {
        sections.push(`  - ${p.joint} ${p.movement} (${p.side}): ${p.difference}° difference`);
      });
    }

    if (data.patterns?.painful?.length > 0) {
      sections.push('\n  Painful Movements:');
      data.patterns.painful.forEach(p => {
        sections.push(`  - ${p.joint} ${p.movement}: ${p.intensity}/10 pain (${p.side} side)`);
      });
    }

    if (data.patterns?.restricted?.length > 0) {
      sections.push('\n  Severe Restrictions:');
      data.patterns.restricted.forEach(p => {
        sections.push(`  - ${p.joint} ${p.movement}: ${p.description}`);
      });
    }

    // Functional Analysis
    sections.push('\nFunctional Analysis:');

    if (data.functional.upperExtremity.length > 0) {
      sections.push('\n  Upper Extremity Impact:');
      data.functional.upperExtremity.forEach(impact => {
        sections.push(`  - ${impact}`);
      });
    }

    if (data.functional.lowerExtremity.length > 0) {
      sections.push('\n  Lower Extremity Impact:');
      data.functional.lowerExtremity.forEach(impact => {
        sections.push(`  - ${impact}`);
      });
    }

    if (data.functional.spine.length > 0) {
      sections.push('\n  Spine Function Impact:');
      data.functional.spine.forEach(impact => {
        sections.push(`  - ${impact}`);
      });
    }

    if (data.impact.length > 0) {
      sections.push('\nOverall Clinical Impact:');
      data.impact.forEach(impact => {
        sections.push(`- ${impact}`);
      });
    }

    return sections.join('\n');
  }
}