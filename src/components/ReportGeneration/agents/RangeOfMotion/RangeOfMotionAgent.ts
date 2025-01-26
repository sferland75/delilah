import { BaseAgent, AgentContext } from '../BaseAgent';
import { ROMAnalysis, ROMData, JointROM } from './types';
import { normalROMData } from './normalROM';
import { 
  identifyPatterns, 
  analyzeUpperExtremityFunction, 
  analyzeLowerExtremityFunction, 
  analyzeSpineFunction 
} from './analysis';
import { formatBrief, formatStandard, formatDetailed } from './formatting';

interface ROMJointMap {
  [key: string]: ROMData[];
}

export class RangeOfMotionAgent extends BaseAgent {
  private normalROM: Map<string, Map<string, number>>;

  constructor(context: AgentContext) {
    super(context, 5.1, 'Range of Motion', ['functionalAssessment.rangeOfMotion']);
    this.normalROM = normalROMData;
  }

  protected initializeValidationRules(): void {
    // Validate ROM measurements are within possible ranges
    this.validationRules.set('rom', (data: ROMData) => {
      if (!data.active) return false;
      const normal = this.getNormalROM(data.joint, data.movement);
      if (data.active.right && (data.active.right < 0 || data.active.right > normal * 1.1)) return false;
      if (data.active.left && (data.active.left < 0 || data.active.left > normal * 1.1)) return false;
      return true;
    });
  }

  public async validateData(data: any): Promise<{ isValid: boolean; errors: string[] }> {
    const errors: string[] = [];
    
    try {
      const romData = data.functionalAssessment?.rangeOfMotion;
      if (!romData) {
        errors.push('Missing ROM data');
        return { isValid: false, errors };
      }

      Object.values(romData).forEach((jointData: any) => {
        if (Array.isArray(jointData)) {
          jointData.forEach((measurement: ROMData) => {
            if (!this.validationRules.get('rom')!(measurement)) {
              errors.push(`Invalid range for ${measurement.joint} ${measurement.movement}`);
            }
          });
        }
      });

      return {
        isValid: errors.length === 0,
        errors
      };
    } catch (error) {
      errors.push('Error validating ROM data');
      return { isValid: false, errors };
    }
  }

  private getNormalROM(joint: string, movement: string): number {
    return this.normalROM.get(joint)?.get(movement) || 0;
  }

  protected getSectionKeys(): string[] {
    return ['joints', 'patterns', 'functional', 'impact'];
  }

  async processData(data: any): Promise<ROMAnalysis> {
    const joints = this.processJoints(data.functionalAssessment.rangeOfMotion);
    const patterns = identifyPatterns(joints);
    const functional = this.analyzeFunctionalImpact(joints, patterns);
    const impact = this.determineOverallImpact(patterns, functional);

    return {
      joints,
      patterns,
      functional,
      impact
    };
  }

  private processJoints(data: ROMJointMap): JointROM {
    const result: JointROM = {};
    
    // Process each joint's measurements
    Object.keys(data).forEach(joint => {
      if (!data[joint]) return;
      
      const measurements = data[joint].map((measurement: any) => ({
        joint,
        movement: measurement.movement,
        active: {
          right: measurement.active?.right,
          left: measurement.active?.left,
          normal: this.getNormalROM(joint, measurement.movement)
        },
        passive: measurement.passive,
        painScale: measurement.painScale,
        endFeel: measurement.endFeel,
        notes: measurement.notes
      }));

      (result as ROMJointMap)[joint] = measurements;
    });

    return result;
  }

  private analyzeFunctionalImpact(joints: JointROM, patterns: any): {
    upperExtremity: string[];
    lowerExtremity: string[];
    spine: string[];
  } {
    const functional = {
      upperExtremity: [] as string[],
      lowerExtremity: [] as string[],
      spine: [] as string[]
    };

    if (joints.shoulder || joints.elbow || joints.wrist) {
      analyzeUpperExtremityFunction(joints, patterns, functional.upperExtremity);
    }

    if (joints.hip || joints.knee || joints.ankle) {
      analyzeLowerExtremityFunction(joints, patterns, functional.lowerExtremity);
    }

    if (joints.cervical || joints.spine) {
      analyzeSpineFunction(joints, patterns, functional.spine);
    }

    return functional;
  }

  private determineOverallImpact(patterns: any, functional: any): string[] {
    const impacts = [] as string[];

    if (patterns.bilateral.length > 2) {
      impacts.push('Multiple bilateral restrictions suggest systemic mobility impact');
    }

    if (patterns.painful.length > 2) {
      impacts.push('Multiple painful movements indicate activity modification needs');
    }

    impacts.push(...functional.upperExtremity);
    impacts.push(...functional.lowerExtremity);
    impacts.push(...functional.spine);

    return impacts;
  }

  protected formatByDetailLevel(data: ROMAnalysis, level: string): string {
    switch (level) {
      case 'brief':
        return formatBrief(data);
      case 'standard':
        return formatStandard(data);
      case 'detailed':
        return formatDetailed(data);
      default:
        return formatStandard(data);
    }
  }
}