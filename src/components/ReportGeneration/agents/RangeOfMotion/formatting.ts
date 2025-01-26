import { ROMAnalysis, ROMData } from './types';

export function formatBrief(data: ROMAnalysis): string {
  return `
## Range of Motion Summary

Key Findings:
${data.patterns.restricted.map(p => `- ${p}`).join('\n')}

Primary Functional Impacts:
${data.impact.map(i => `- ${i}`).join('\n')}
  `.trim();
}

export function formatStandard(data: ROMAnalysis): string {
  return `
## Range of Motion Assessment

### Movement Patterns
${data.patterns.bilateral.length ? '#### Bilateral Restrictions\n' + data.patterns.bilateral.map(p => `- ${p}`).join('\n') : ''}
${data.patterns.unilateral.length ? '#### Asymmetrical Findings\n' + data.patterns.unilateral.map(p => `- ${p}`).join('\n') : ''}
${data.patterns.painful.length ? '#### Pain with Motion\n' + data.patterns.painful.map(p => `- ${p}`).join('\n') : ''}

### Functional Impact
${[...data.functional.upperExtremity, ...data.functional.lowerExtremity, ...data.functional.spine].map(i => `- ${i}`).join('\n')}

### Overall Impact
${data.impact.map(i => `- ${i}`).join('\n')}
  `.trim();
}

export function formatDetailedJoint(joint: string, measurements: ROMData[]): string {
  let output = `\n#### ${joint.charAt(0).toUpperCase() + joint.slice(1)}\n`;
  
  measurements.forEach(rom => {
    output += `
${rom.movement}:
- Active ROM: ${formatROMValues(rom.active)}
${rom.passive ? `- Passive ROM: ${formatROMValues(rom.passive)}` : ''}
${rom.painScale ? `- Pain Scale: ${formatROMValues(rom.painScale)}` : ''}
${rom.endFeel ? `- End Feel: ${formatROMValues(rom.endFeel)}` : ''}
${rom.notes ? `- Notes: ${rom.notes}` : ''}`;
  });

  return output;
}

export function formatDetailed(data: ROMAnalysis): string {
  let report = `
## Comprehensive Range of Motion Assessment

### Joint Measurements\n`;

  // Add detailed joint measurements
  Object.entries(data.joints).forEach(([joint, measurements]) => {
    if (!measurements?.length) return;
    report += formatDetailedJoint(joint, measurements);
  });

  // Add pattern analysis
  report += `
### Movement Patterns

#### Bilateral Restrictions
${data.patterns.bilateral.map(p => `- ${p}`).join('\n')}

#### Asymmetrical Findings
${data.patterns.unilateral.map(p => `- ${p}`).join('\n')}

#### Pain with Motion
${data.patterns.painful.map(p => `- ${p}`).join('\n')}

#### Severe Restrictions
${data.patterns.restricted.map(p => `- ${p}`).join('\n')}

### Functional Analysis

#### Upper Extremity Function
${data.functional.upperExtremity.map(i => `- ${i}`).join('\n')}

#### Lower Extremity Function
${data.functional.lowerExtremity.map(i => `- ${i}`).join('\n')}

#### Spine Function
${data.functional.spine.map(i => `- ${i}`).join('\n')}

### Overall Clinical Impact
${data.impact.map(i => `- ${i}`).join('\n')}`;

  return report.trim();
}

function formatROMValues(values: any): string {
  if (typeof values === 'object') {
    const parts = [];
    if ('right' in values) parts.push(`R: ${values.right}°`);
    if ('left' in values) parts.push(`L: ${values.left}°`);
    if ('normal' in values) parts.push(`(Normal: ${values.normal}°)`);
    return parts.join(' ');
  }
  return String(values);
}