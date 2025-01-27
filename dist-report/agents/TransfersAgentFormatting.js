"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransfersAgentFormatting = void 0;
const TransfersAgentRecommendations_1 = require("./TransfersAgentRecommendations");
class TransfersAgentFormatting extends TransfersAgentRecommendations_1.TransfersAgentRecommendations {
    format(data) {
        return this.formatByDetailLevel(data, this.context.config.detailLevel);
    }
    formatByDetailLevel(data, detailLevel) {
        switch (detailLevel) {
            case 'brief':
                return this.formatBrief(data);
            case 'detailed':
                return this.formatDetailed(data);
            default:
                return this.formatStandard(data);
        }
    }
    formatBrief(data) {
        const sections = [
            '## Transfers Assessment\n',
            'Key Findings:',
            ...data.transferStatus.locations.map((loc) => `- ${loc.location.charAt(0).toUpperCase() + loc.location.slice(1)} Transfers: ${this.summarizePatterns(loc.patterns)}`),
            '\nEquipment Needs:',
            `- ${data.transferStatus.requiredEquipment.map((e) => e.replace('_', ' ')).join(', ') || 'No specialized equipment required'}`,
            '\nPrimary Concerns:',
            ...data.riskFactors.map((r) => `- ${r}`)
        ];
        return sections.join('\n');
    }
    formatStandard(data) {
        const sections = [
            '## Transfers Assessment\n',
            '### Current Status',
            ...data.transferStatus.locations.map((loc) => [
                `${loc.location.charAt(0).toUpperCase() + loc.location.slice(1)} Transfers:`,
                ...loc.patterns.map((p) => [
                    `- ${p.context}: ${p.type.replace('_', ' ')}`,
                    p.equipment ? `  - Required Equipment: ${p.equipment.map((e) => e.replace('_', ' ')).join(', ')}` : '',
                    p.modifications ? `  - Modifications: ${p.modifications.map((m) => m.replace('_', ' ')).join(', ')}` : ''
                ].filter(Boolean)).flat()
            ]).flat(),
            '\nRequired Equipment:',
            ...data.transferStatus.requiredEquipment.map((e) => `- ${e.replace('_', ' ')}`) || ['- No specialized equipment required'],
            '\n### Risk Factors',
            ...data.riskFactors.map((r) => `- ${r}`) || ['- No significant risk factors identified'],
            '\n### Recommendations',
            ...data.recommendations.map((r) => `- ${r}`) || ['- Continue current transfer techniques']
        ];
        return sections.join('\n');
    }
    formatDetailed(data) {
        const sections = [
            '## Transfers Assessment\n',
            '### Transfer Analysis by Location\n',
            ...data.transferStatus.locations.map((loc) => [
                `#### ${loc.location.charAt(0).toUpperCase() + loc.location.slice(1)} Transfers`,
                ...loc.patterns.map((p) => [
                    '',
                    `- Assistance Level: ${p.type.replace('_', ' ')}`,
                    `  - Context: ${p.context}`,
                    p.modifications ? `  - Required Modifications:\n    ${p.modifications.map((m) => `- ${m.replace('_', ' ')}`).join('\n    ')}` : '',
                    p.equipment ? `  - Required Equipment:\n    ${p.equipment.map((e) => `- ${e.replace('_', ' ')}`).join('\n    ')}` : '',
                    p.safety_concerns ? `  - Safety Concerns:\n    ${p.safety_concerns.map((s) => `- ${s}`).join('\n    ')}` : ''
                ].filter(Boolean)).flat(),
                '\nLocation-Specific Risks:',
                ...loc.risks.map((r) => `- ${r}`) || ['- No specific risks identified']
            ]).flat(),
            '\n### Equipment Requirements',
            'Current Equipment Needs:',
            ...data.transferStatus.requiredEquipment.map((e) => `- ${e.replace('_', ' ')}`) || ['- No specialized equipment required'],
            '\n### Comprehensive Risk Analysis',
            ...data.riskFactors.map((r) => `- ${r}`) || ['- No significant risk factors identified'],
            '\n### Detailed Recommendations',
            ...data.recommendations.map((r) => `- ${r}`),
            '\n### Notes',
            '- Equipment recommendations based on current transfer patterns and safety needs',
            '- Risk factors consider both physical capabilities and environmental factors',
            '- Recommendations prioritize safety and independence',
            '- Regular reassessment of transfer status is recommended'
        ];
        return sections.join('\n');
    }
    summarizePatterns(patterns) {
        if (patterns.length === 0)
            return 'Not assessed';
        const types = patterns.map(p => p.type);
        if (types.includes('maximum_assist'))
            return 'Maximum assistance required';
        if (types.includes('moderate_assist'))
            return 'Moderate assistance required';
        if (types.includes('minimal_assist'))
            return 'Minimal assistance required';
        if (types.includes('modified_independent'))
            return 'Modified independence';
        return 'Independent';
    }
}
exports.TransfersAgentFormatting = TransfersAgentFormatting;
