import { ROMAnalysis, ROMData } from './types';

export function formatROM(data: ROMAnalysis, level: 'brief' | 'standard' | 'detailed' = 'standard'): string {
  switch (level) {
    case 'brief':
      return formatBrief(data);
    case 'detailed':
      return formatDetailed(data);
    default:
      return formatStandard(data);
  }
}

function formatBrief(data: ROMAnalysis): string {
  return `
## Range of Motion Summary

Key Findings:
${data.patterns?.restricted?.map(p => `- ${p}`).join('\n') || '- No severe restrictions noted'}

Primary Functional Impacts:
${data.impact?.map(i => `- ${i}`).join('\n') || '- No significant functional impacts identified'}
  `.trim();
}

function formatStandard(data: ROMAnalysis): string {
  return `
## Range of Motion Assessment

### Movement Patterns
${data.patterns?.bilateral?.length ? '#### Bilateral Restrictions\n' + data.patterns.bilateral.map(p => `- ${p}`).join('\n') : ''}
${data.patterns?.unilateral?.length ? '#### Asymmetrical Findings\n' + data.patterns.unilateral.map(p => `- ${p}`).join('\n') : ''}
${data.patterns?.painful?.length ? '#### Pain with Motion\n' + data.patterns.painful.map(p => `- ${p}`).join('\n') : ''}

### Functional Impact
${[...(data.functional?.upperExtremity || []), 
   ...(data.functional?.lowerExtremity || []), 
   ...(data.functional?.spine || [])].map(i => `- ${i}`).join('\n') || '- No significant functional limitations identified'}

### Overall Impact
${data.impact?.map(i => `- ${i}`).join('\n') || '- No significant impacts noted'}
  `.trim();
}

function formatDetailedJoint(joint: string, measurements: ROMData[]): string {
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

function formatDetailed(data: ROMAnalysis): string {
  let report = `
## Comprehensive Range of Motion Assessment

### Joint Measurements\n`;

  // Add detailed joint measurements
  if (data.joints) {
    Object.entries(data.joints).forEach(([joint, measurements]) => {
      if (!measurements?.length) return;
      report += formatDetailedJoint(joint, measurements);
    });
  }

  // Add pattern analysis
  report += `
### Movement Patterns

#### Bilateral Restrictions
${data.patterns?.bilateral?.map(p => `- ${p}`).join('\n') || '- None identified'}

#### Asymmetrical Findings
${data.patterns?.unilateral?.map(p => `- ${p}`).join('\n') || '- None identified'}

#### Pain with Motion
${data.patterns?.painful?.map(p => `- ${p}`).join('\n') || '- No pain reported with motion'}

#### Severe Restrictions
${data.patterns?.restricted?.map(p => `- ${p}`).join('\n') || '- No severe restrictions noted'}

### Functional Analysis

#### Upper Extremity Function
${data.functional?.upperExtremity?.map(i => `- ${i}`).join('\n') || '- No significant limitations'}

#### Lower Extremity Function
${data.functional?.lowerExtremity?.map(i => `- ${i}`).join('\n') || '- No significant limitations'}

#### Spine Function
${data.functional?.spine?.map(i => `- ${i}`).join('\n') || '- No significant limitations'}

### Overall Clinical Impact
${data.impact?.map(i => `- ${i}`).join('\n') || '- No significant clinical impacts identified'}`;

  return report.trim();
}

function formatROMValues(values: Record<string, any> | undefined): string {
  if (!values) return 'Not tested';
  
  const parts = [];
  if ('right' in values) parts.push(`R: ${values.right}°`);
  if ('left' in values) parts.push(`L: ${values.left}°`);
  if ('normal' in values) parts.push(`(Normal: ${values.normal}°)`);
  return parts.join(' ') || 'Not recorded';
}