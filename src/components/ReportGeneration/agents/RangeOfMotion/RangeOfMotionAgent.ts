import { BaseAgent } from '../BaseAgent';
import { AgentContext, AssessmentData } from '../../types';
import _ from 'lodash';

interface ROMResult {
  valid: boolean;
  joints: Array<{
    joint: string;
    movement: string;
    normalROM: string;
    left: {
      active: string;
      passive: string;
    };
    right: {
      active: string;
      passive: string;
    };
    painLeft: boolean;
    painRight: boolean;
    notes?: string;
  }>;
  generalNotes?: string;
}

export class RangeOfMotionAgent extends BaseAgent {
  constructor(context: AgentContext) {
    super(context, 2.3, 'Range of Motion', ['functionalAssessment.rangeOfMotion']);
  }

  async processData(data: AssessmentData): Promise<ROMResult> {
    try {
      const romData = _.get(data, 'functionalAssessment.rangeOfMotion', {});
      const measurements = romData.measurements || [];
      const generalNotes = romData.generalNotes;

      return {
        valid: true,
        joints: measurements,
        generalNotes
      };
    } catch (error) {
      return {
        valid: false,
        joints: [],
        generalNotes: `Error processing ROM data: ${(error as Error).message}`
      };
    }
  }

  protected formatBrief(data: ROMResult): string {
    const sections = ['Range of Motion Assessment'];

    if (data.joints.length === 0) {
      return sections[0] + '\nNo ROM measurements available.';
    }

    // Group by joint
    const byJoint = _.groupBy(data.joints, 'joint');

    Object.entries(byJoint).forEach(([joint, measurements]) => {
      sections.push(`\n${joint}:`);
      measurements.forEach(m => {
        let status = '';
        if (m.painLeft || m.painRight) {
          status = ' (Pain reported)';
        }
        sections.push(`- ${m.movement}${status}`);
      });
    });

    return sections.join('\n');
  }

  protected formatStandard(data: ROMResult): string {
    const sections = ['Range of Motion Assessment'];

    if (data.joints.length === 0) {
      return sections[0] + '\nNo ROM measurements available.';
    }

    // Group by joint
    const byJoint = _.groupBy(data.joints, 'joint');

    Object.entries(byJoint).forEach(([joint, measurements]) => {
      sections.push(`\n${joint}:`);
      measurements.forEach(m => {
        sections.push(`\n  ${m.movement}:`);
        sections.push(`  - Normal Range: ${m.normalROM}`);
        sections.push(`  - Left: Active ${m.left.active}, Passive ${m.left.passive}${m.painLeft ? ' (Pain)' : ''}`);
        sections.push(`  - Right: Active ${m.right.active}, Passive ${m.right.passive}${m.painRight ? ' (Pain)' : ''}`);
        if (m.notes) {
          sections.push(`  - Notes: ${m.notes}`);
        }
      });
    });

    if (data.generalNotes) {
      sections.push(`\nGeneral Notes:\n${data.generalNotes}`);
    }

    return sections.join('\n');
  }

  protected formatDetailed(data: ROMResult): string {
    const sections = ['Range of Motion Assessment'];

    if (data.joints.length === 0) {
      return sections[0] + '\nNo ROM measurements available.';
    }

    // Group by joint system
    const jointSystems = {
      'Upper Extremity': ['Shoulder', 'Elbow', 'Wrist'],
      'Lower Extremity': ['Hip', 'Knee', 'Ankle'],
      'Spine': ['Cervical Spine', 'Thoracic/Lumbar Spine']
    };

    Object.entries(jointSystems).forEach(([system, joints]) => {
      const systemMeasurements = data.joints.filter(m => joints.includes(m.joint));
      if (systemMeasurements.length > 0) {
        sections.push(`\n${system}:`);
        const byJoint = _.groupBy(systemMeasurements, 'joint');
        
        Object.entries(byJoint).forEach(([joint, measurements]) => {
          sections.push(`\n  ${joint}:`);
          measurements.forEach(m => {
            sections.push(`\n    ${m.movement}:`);
            sections.push(`    - Normal Range: ${m.normalROM}`);
            sections.push(`    - Left: Active ${m.left.active}, Passive ${m.left.passive}${m.painLeft ? ' (Pain)' : ''}`);
            sections.push(`    - Right: Active ${m.right.active}, Passive ${m.right.passive}${m.painRight ? ' (Pain)' : ''}`);
            if (m.notes) {
              sections.push(`    - Notes: ${m.notes}`);
            }
          });
        });
      }
    });

    // Add findings section
    sections.push('\nKey Findings:');
    const painJoints = data.joints.filter(m => m.painLeft || m.painRight);
    if (painJoints.length > 0) {
      sections.push('- Pain reported in:');
      painJoints.forEach(m => {
        const sides = [];
        if (m.painLeft) sides.push('left');
        if (m.painRight) sides.push('right');
        sections.push(`  * ${m.joint} ${m.movement} (${sides.join(' and ')})`);
      });
    }

    if (data.generalNotes) {
      sections.push(`\nGeneral Notes:\n${data.generalNotes}`);
    }

    return sections.join('\n');
  }
}