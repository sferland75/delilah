"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatBrief = formatBrief;
exports.formatStandard = formatStandard;
exports.formatDetailed = formatDetailed;
exports.formatSection = formatSection;
exports.formatSafetyConsiderations = formatSafetyConsiderations;
exports.formatIndependenceLevel = formatIndependenceLevel;
function formatBrief(data, formatIndependenceLevel) {
    return `
## IADL Status
Overall Independence: ${formatIndependenceLevel(data.overallIndependence)}

### Key Support Needs
${data.supportNeeds.map(need => `- ${need.category}: ${formatIndependenceLevel(need.level)}`).join('\n')}

### Safety Alerts
${formatSafetyConsiderations(data.safetyConsiderations)}
  `.trim();
}
function formatStandard(data, formatIndependenceLevel) {
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
function formatDetailed(data, formatIndependenceLevel) {
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
function formatSection(section, formatIndependenceLevel) {
    return section.map(activity => `
- ${activity.activity}:
  Independence Level: ${formatIndependenceLevel(activity.independence)}
  ${activity.notes ? `Notes: ${activity.notes}` : ''}
  ${activity.barriersIdentified?.length ? `Barriers: ${activity.barriersIdentified.join(', ')}` : ''}
  ${activity.adaptationsUsed?.length ? `Adaptations: ${activity.adaptationsUsed.join(', ')}` : ''}`).join('\n');
}
function formatSafetyConsiderations(safety) {
    if (safety.length === 0) {
        return 'No immediate safety concerns identified';
    }
    return safety.map(item => `
#### ${item.activity}
- Risk Identified: ${item.risk}
- Risk Mitigation: ${item.mitigation}`).join('\n');
}
function formatIndependenceLevel(level) {
    return level.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}
