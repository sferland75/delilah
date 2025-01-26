import { IndependenceLevel } from './ADLTypes';
import { ProcessedIADLData } from './IADLTypes';

export function formatBrief(data: ProcessedIADLData, formatIndependenceLevel: (level: IndependenceLevel) => string): string {
  return `
## IADL Status
Overall Independence: ${formatIndependenceLevel(data.overallIndependence)}

### Key Support Needs
${data.supportNeeds.map(need => 
  `- ${need.category}: ${formatIndependenceLevel(need.level)}`
).join('\n')}

### Safety Alerts
${formatSafetyConsiderations(data.safetyConsiderations)}
  `.trim();
}

export function formatStandard(data: ProcessedIADLData, formatIndependenceLevel: (level: IndependenceLevel) => string): string {
  return `
## Instrumental ADL Assessment

### Overall Status
Independence Level: ${formatIndependenceLevel(data.overallIndependence)}

### Support Needs
${data.supportNeeds.map(need => `
#### ${need.category}
- Level: ${formatIndependenceLevel(need.level)}
- Barriers: ${need.barriers.length > 0 ? need.barriers.join(', ') : 'None identified'}
- Rationale: ${need.rationale}`).join('\n')}

### Recommendations
${data.recommendations.map(rec => `
#### ${rec.activity}
- Support Type: ${rec.supportType}
- Frequency: ${rec.frequency}
- Adaptations: ${rec.adaptation}
- Rationale: ${rec.rationale}`).join('\n')}

### Safety Considerations
${formatSafetyConsiderations(data.safetyConsiderations)}
  `.trim();
}

export function formatDetailed(data: ProcessedIADLData, formatIndependenceLevel: (level: IndependenceLevel) => string): string {
  return `
## Comprehensive IADL Assessment

### Overall Independence Status
Current Level: ${formatIndependenceLevel(data.overallIndependence)}

### Detailed Section Analysis

#### Household Activities
${formatSection(data.sections.household, formatIndependenceLevel)}

#### Community Activities
${formatSection(data.sections.community, formatIndependenceLevel)}

### Support Requirements
${data.supportNeeds.map(need => `
#### ${need.category}
- Required Assistance: ${formatIndependenceLevel(need.level)}
- Identified Barriers:
${need.barriers.map(barrier => `  - ${barrier}`).join('\n')}
- Clinical Rationale: ${need.rationale}`).join('\n')}

### Recommended Support Plan
${data.recommendations.map(rec => `
#### ${rec.activity}
- Assistance Type: ${rec.supportType}
- Support Frequency: ${rec.frequency}
- Current/Recommended Adaptations: ${rec.adaptation}
- Clinical Rationale: ${rec.rationale}`).join('\n')}

### Safety Assessment
${formatSafetyConsiderations(data.safetyConsiderations)}
  `.trim();
}

export function formatSection(
  section: Array<{ 
    activity: string; 
    notes: string; 
    independence: IndependenceLevel; 
    barriersIdentified?: string[]; 
    adaptationsUsed?: string[] 
  }>,
  formatIndependenceLevel: (level: IndependenceLevel) => string
): string {
  return section.map(activity => `
- ${activity.activity}:
  Independence Level: ${formatIndependenceLevel(activity.independence)}
  ${activity.notes ? `Notes: ${activity.notes}` : ''}
  ${activity.barriersIdentified?.length ? `Barriers: ${activity.barriersIdentified.join(', ')}` : ''}
  ${activity.adaptationsUsed?.length ? `Adaptations: ${activity.adaptationsUsed.join(', ')}` : ''}`
  ).join('\n');
}

export function formatSafetyConsiderations(safety: ProcessedIADLData['safetyConsiderations']): string {
  if (safety.length === 0) {
    return 'No immediate safety concerns identified';
  }

  return safety.map(item => `
#### ${item.activity}
- Risk Identified: ${item.risk}
- Risk Mitigation: ${item.mitigation}`
  ).join('\n');
}

export function formatIndependenceLevel(level: IndependenceLevel): string {
  return level.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}