import type { TransferPattern, TransferLocation, TransfersAgentOutput } from '../types/transfers';
import { TransfersAgentRecommendations } from './TransfersAgentRecommendations';

export abstract class TransfersAgentFormatting extends TransfersAgentRecommendations {
  public format(data: TransfersAgentOutput): string {
    return this.formatByDetailLevel(data, this.context.config.detailLevel);
  }

  protected formatByDetailLevel(data: TransfersAgentOutput, detailLevel: string): string {
    switch (detailLevel) {
      case 'brief':
        return this.formatBrief(data);
      case 'detailed':
        return this.formatDetailed(data);
      default:
        return this.formatStandard(data);
    }
  }

  protected formatBrief(data: TransfersAgentOutput): string {
    const sections = [
      '## Transfers Assessment\n',
      'Key Findings:',
      ...data.transferStatus.locations.map((loc: TransferLocation) => 
        `- ${loc.location.charAt(0).toUpperCase() + loc.location.slice(1)} Transfers: ${this.summarizePatterns(loc.patterns)}`
      ),
      '\nEquipment Needs:',
      `- ${data.transferStatus.requiredEquipment.map((e: string) => e.replace('_', ' ')).join(', ') || 'No specialized equipment required'}`,
      '\nPrimary Concerns:',
      ...data.riskFactors.map((r: string) => `- ${r}`)
    ];

    return sections.join('\n');
  }

  protected formatStandard(data: TransfersAgentOutput): string {
    const sections = [
      '## Transfers Assessment\n',
      '### Current Status',
      ...data.transferStatus.locations.map((loc: TransferLocation) => [
        `${loc.location.charAt(0).toUpperCase() + loc.location.slice(1)} Transfers:`,
        ...loc.patterns.map((p: TransferPattern) => [
          `- ${p.context}: ${p.type.replace('_', ' ')}`,
          p.equipment ? `  - Required Equipment: ${p.equipment.map((e: string) => e.replace('_', ' ')).join(', ')}` : '',
          p.modifications ? `  - Modifications: ${p.modifications.map((m: string) => m.replace('_', ' ')).join(', ')}` : ''
        ].filter(Boolean)).flat()
      ]).flat(),
      '\nRequired Equipment:',
      ...data.transferStatus.requiredEquipment.map((e: string) => `- ${e.replace('_', ' ')}`) || ['- No specialized equipment required'],
      '\n### Risk Factors',
      ...data.riskFactors.map((r: string) => `- ${r}`) || ['- No significant risk factors identified'],
      '\n### Recommendations',
      ...data.recommendations.map((r: string) => `- ${r}`) || ['- Continue current transfer techniques']
    ];

    return sections.join('\n');
  }

  protected formatDetailed(data: TransfersAgentOutput): string {
    const sections = [
      '## Transfers Assessment\n',
      '### Transfer Analysis by Location\n',
      ...data.transferStatus.locations.map((loc: TransferLocation) => [
        `#### ${loc.location.charAt(0).toUpperCase() + loc.location.slice(1)} Transfers`,
        ...loc.patterns.map((p: TransferPattern) => [
          '',
          `- Assistance Level: ${p.type.replace('_', ' ')}`,
          `  - Context: ${p.context}`,
          p.modifications ? `  - Required Modifications:\n    ${p.modifications.map((m: string) => `- ${m.replace('_', ' ')}`).join('\n    ')}` : '',
          p.equipment ? `  - Required Equipment:\n    ${p.equipment.map((e: string) => `- ${e.replace('_', ' ')}`).join('\n    ')}` : '',
          p.safety_concerns ? `  - Safety Concerns:\n    ${p.safety_concerns.map((s: string) => `- ${s}`).join('\n    ')}` : ''
        ].filter(Boolean)).flat(),
        '\nLocation-Specific Risks:',
        ...loc.risks.map((r: string) => `- ${r}`) || ['- No specific risks identified']
      ]).flat(),
      '\n### Equipment Requirements',
      'Current Equipment Needs:',
      ...data.transferStatus.requiredEquipment.map((e: string) => `- ${e.replace('_', ' ')}`) || ['- No specialized equipment required'],
      '\n### Comprehensive Risk Analysis',
      ...data.riskFactors.map((r: string) => `- ${r}`) || ['- No significant risk factors identified'],
      '\n### Detailed Recommendations',
      ...data.recommendations.map((r: string) => `- ${r}`),
      '\n### Notes',
      '- Equipment recommendations based on current transfer patterns and safety needs',
      '- Risk factors consider both physical capabilities and environmental factors',
      '- Recommendations prioritize safety and independence',
      '- Regular reassessment of transfer status is recommended'
    ];

    return sections.join('\n');
  }

  protected summarizePatterns(patterns: TransferPattern[]): string {
    if (patterns.length === 0) return 'Not assessed';
    
    const types = patterns.map(p => p.type);
    if (types.includes('maximum_assist')) return 'Maximum assistance required';
    if (types.includes('moderate_assist')) return 'Moderate assistance required';
    if (types.includes('minimal_assist')) return 'Minimal assistance required';
    if (types.includes('modified_independent')) return 'Modified independence';
    return 'Independent';
  }
}