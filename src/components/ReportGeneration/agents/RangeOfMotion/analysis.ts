import { JointROM, ROMData } from './types';

export function identifyPatterns(joints: JointROM): {
  bilateral: string[];
  unilateral: string[];
  painful: string[];
  restricted: string[];
} {
  const patterns = {
    bilateral: [] as string[],
    unilateral: [] as string[],
    painful: [] as string[],
    restricted: [] as string[]
  };

  // Analyze each joint
  Object.entries(joints).forEach(([jointName, measurements]) => {
    if (!measurements) return;

    measurements.forEach((rom: ROMData) => {
      // Check for bilateral restrictions
      if (rom.active.right && rom.active.left && 
          rom.active.normal && 
          rom.active.right < rom.active.normal * 0.75 && 
          rom.active.left < rom.active.normal * 0.75) {
        patterns.bilateral.push(
          `${jointName} ${rom.movement} bilaterally restricted`
        );
      }

      // Check for unilateral restrictions
      if (rom.active.right && rom.active.left && rom.active.normal) {
        const rightDiff = Math.abs(rom.active.right - rom.active.left);
        if (rightDiff > rom.active.normal * 0.2) {
          patterns.unilateral.push(
            `${jointName} ${rom.movement} asymmetrical (${rightDiff}° difference)`
          );
        }
      }

      // Check for painful movements
      if (rom.painScale) {
        if ((rom.painScale.right && rom.painScale.right >= 5) || 
            (rom.painScale.left && rom.painScale.left >= 5)) {
          patterns.painful.push(
            `${jointName} ${rom.movement} painful`
          );
        }
      }

      // Check for severe restrictions
      if (rom.active.normal) {
        const threshold = rom.active.normal * 0.5;
        if ((rom.active.right && rom.active.right < threshold) || 
            (rom.active.left && rom.active.left < threshold)) {
          patterns.restricted.push(
            `${jointName} ${rom.movement} severely restricted`
          );
        }
      }
    });
  });

  return patterns;
}

export function analyzeUpperExtremityFunction(joints: JointROM, _patterns: any, impacts: string[]): void {
  // Overhead reaching
  if (joints.shoulder) {
    const flexion = joints.shoulder.find(m => m.movement === 'flexion');
    const abduction = joints.shoulder.find(m => m.movement === 'abduction');
    
    if (flexion?.active.right && flexion.active.right < 120 ||
        flexion?.active.left && flexion.active.left < 120) {
      impacts.push('Difficulty with overhead reaching');
    }

    if (abduction?.active.right && abduction.active.right < 120 ||
        abduction?.active.left && abduction.active.left < 120) {
      impacts.push('Limited shoulder elevation impacts reaching');
    }
  }

  // Analyze elbow function
  if (joints.elbow) {
    const flexion = joints.elbow.find(m => m.movement === 'flexion');
    if (flexion?.active.right && flexion.active.right < 100 ||
        flexion?.active.left && flexion.active.left < 100) {
      impacts.push('Limited elbow mobility affects self-care tasks');
    }
  }

  // Analyze grasp/manipulation
  if (joints.wrist) {
    const extension = joints.wrist.find(m => m.movement === 'extension');
    if (extension?.active.right && extension.active.right < 30 ||
        extension?.active.left && extension.active.left < 30) {
      impacts.push('Limited wrist extension impacts grip strength and manipulation');
    }
  }
}

export function analyzeLowerExtremityFunction(joints: JointROM, _patterns: any, impacts: string[]): void {
  // Analyze hip and knee motion for functional activities
  if (joints.hip) {
    const flexion = joints.hip.find(m => m.movement === 'flexion');
    if (flexion?.active.right && flexion.active.right < 90 ||
        flexion?.active.left && flexion.active.left < 90) {
      impacts.push('Difficulty with sit-to-stand transitions');
    }
  }

  // Analyze knee function
  if (joints.knee) {
    const flexion = joints.knee.find(m => m.movement === 'flexion');
    if (flexion?.active.right && flexion.active.right < 90 ||
        flexion?.active.left && flexion.active.left < 90) {
      impacts.push('Limited knee flexion affects stair navigation');
    }
  }

  // Analyze ankle function
  if (joints.ankle) {
    const dorsiflexion = joints.ankle.find(m => m.movement === 'dorsiflexion');
    if (dorsiflexion?.active.right && dorsiflexion.active.right < 10 ||
        dorsiflexion?.active.left && dorsiflexion.active.left < 10) {
      impacts.push('Limited ankle dorsiflexion affects gait pattern');
    }
  }
}

export function analyzeSpineFunction(joints: JointROM, _patterns: any, impacts: string[]): void {
  // Analyze cervical motion
  if (joints.cervical) {
    const rotation = joints.cervical.find(m => m.movement === 'rotation');
    if (rotation?.active.right && rotation.active.right < 45 ||
        rotation?.active.left && rotation.active.left < 45) {
      impacts.push('Limited cervical rotation impacts driving safety');
    }

    const extension = joints.cervical.find(m => m.movement === 'extension');
    if (extension?.active.right && extension.active.right < 30) {
      impacts.push('Limited cervical extension affects overhead visual scanning');
    }
  }

  // Analyze thoracolumbar motion
  if (joints.spine) {
    const flexion = joints.spine.find(m => m.movement === 'flexion');
    if (flexion?.active.right && flexion.active.right < 40) {
      impacts.push('Limited spinal flexion affects lower body dressing');
    }

    const rotation = joints.spine.find(m => m.movement === 'rotation');
    if (rotation?.active.right && rotation.active.right < 30 ||
        rotation?.active.left && rotation.active.left < 30) {
      impacts.push('Limited trunk rotation affects bed mobility');
    }
  }
}