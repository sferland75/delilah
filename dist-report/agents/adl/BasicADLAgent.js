"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasicADLAgent = void 0;
const BaseAgent_1 = require("../BaseAgent");
const lodash_1 = __importDefault(require("lodash"));
const ADLTypes_1 = require("./ADLTypes");
class BasicADLAgent extends BaseAgent_1.BaseAgent {
    constructor(context) {
        super(context, 3.1, 'Basic ADL Assessment', ['functionalAssessment.adl']);
    }
    async processData(data) {
        try {
            const adlData = lodash_1.default.get(data, 'functionalAssessment.adl', {});
            const activities = {
                feeding: this.processActivity(adlData.feeding),
                bathing: this.processActivity(adlData.bathing),
                dressing: this.processActivity(adlData.dressing),
                toileting: this.processActivity(adlData.toileting),
                transfers: this.processActivity(adlData.transfers),
                ambulation: this.processActivity(adlData.ambulation)
            };
            const recommendations = this.generateRecommendations(activities);
            return {
                valid: true,
                activities,
                recommendations
            };
        }
        catch (error) {
            return {
                valid: false,
                activities: {},
                recommendations: [],
                errors: [error.message]
            };
        }
    }
    processActivity(data) {
        // Changed default behavior to return TOTAL_ASSISTANCE for empty/missing data
        if (!data) {
            return {
                assistanceLevel: ADLTypes_1.INDEPENDENCE_LEVELS.TOTAL_ASSISTANCE,
                equipment: []
            };
        }
        // If we receive the direct assistance level value
        if (typeof data === 'string') {
            return {
                assistanceLevel: data,
                equipment: []
            };
        }
        // Process the assistance level
        let assistanceLevel;
        if (typeof data.assistanceLevel === 'string') {
            assistanceLevel = data.assistanceLevel;
        }
        else {
            // Changed default to TOTAL_ASSISTANCE
            assistanceLevel = ADLTypes_1.INDEPENDENCE_LEVELS.TOTAL_ASSISTANCE;
        }
        return {
            assistanceLevel,
            equipment: Array.isArray(data.equipment) ? data.equipment : [],
            notes: data.notes
        };
    }
    generateRecommendations(activities) {
        const recommendations = [];
        Object.entries(activities).forEach(([activity, details]) => {
            if (details.assistanceLevel === ADLTypes_1.INDEPENDENCE_LEVELS.NOT_APPLICABLE) {
                return;
            }
            if (details.assistanceLevel !== ADLTypes_1.INDEPENDENCE_LEVELS.INDEPENDENT) {
                const recommendation = this.generateRecommendation(activity, details);
                if (recommendation) {
                    recommendations.push(recommendation);
                }
            }
        });
        return recommendations;
    }
    generateRecommendation(activity, details) {
        switch (details.assistanceLevel) {
            case ADLTypes_1.INDEPENDENCE_LEVELS.MODIFIED_INDEPENDENT:
                if (!details.equipment?.length) {
                    return `${activity}: Modified Independent - Consider adaptive equipment assessment`;
                }
                return `${activity}: Modified Independent using ${details.equipment.join(', ')}`;
            case ADLTypes_1.INDEPENDENCE_LEVELS.TOTAL_ASSISTANCE:
                return `Requires full assistance with ${activity}`;
            case ADLTypes_1.INDEPENDENCE_LEVELS.SUPERVISION:
                return `${activity} requires supervision for safety`;
            case ADLTypes_1.INDEPENDENCE_LEVELS.MINIMAL_ASSISTANCE:
                return `${activity} requires minimal assistance`;
            case ADLTypes_1.INDEPENDENCE_LEVELS.MODERATE_ASSISTANCE:
                return `${activity} requires moderate assistance`;
            case ADLTypes_1.INDEPENDENCE_LEVELS.MAXIMAL_ASSISTANCE:
                return `${activity} requires maximal assistance`;
            default:
                return `${activity} currently at ${this.formatAssistanceLevel(details.assistanceLevel)} level`;
        }
    }
    formatAssistanceLevel(level) {
        const mapping = {
            [ADLTypes_1.INDEPENDENCE_LEVELS.INDEPENDENT]: 'Independent',
            [ADLTypes_1.INDEPENDENCE_LEVELS.MODIFIED_INDEPENDENT]: 'Modified Independent',
            [ADLTypes_1.INDEPENDENCE_LEVELS.SUPERVISION]: 'Supervision',
            [ADLTypes_1.INDEPENDENCE_LEVELS.MINIMAL_ASSISTANCE]: 'Minimal Assistance',
            [ADLTypes_1.INDEPENDENCE_LEVELS.MODERATE_ASSISTANCE]: 'Moderate Assistance',
            [ADLTypes_1.INDEPENDENCE_LEVELS.MAXIMAL_ASSISTANCE]: 'Maximal Assistance',
            [ADLTypes_1.INDEPENDENCE_LEVELS.TOTAL_ASSISTANCE]: 'Total Assistance',
            [ADLTypes_1.INDEPENDENCE_LEVELS.NOT_APPLICABLE]: 'Not Applicable'
        };
        return mapping[level] || 'Unknown';
    }
    formatBrief(data) {
        if (!data.valid) {
            return 'ADL Status: Unable to process data';
        }
        const sections = ['ADL Status'];
        Object.entries(data.activities).forEach(([activity, details]) => {
            if (details.assistanceLevel !== ADLTypes_1.INDEPENDENCE_LEVELS.NOT_APPLICABLE) {
                sections.push(`${activity}: ${this.formatAssistanceLevel(details.assistanceLevel)}`);
            }
        });
        return sections.join('\n');
    }
    formatStandard(data) {
        if (!data.valid) {
            return 'Basic ADL Assessment: Unable to process data';
        }
        const sections = ['Basic ADL Assessment'];
        const byLevel = {};
        Object.entries(data.activities).forEach(([activity, details]) => {
            if (details.assistanceLevel === ADLTypes_1.INDEPENDENCE_LEVELS.NOT_APPLICABLE) {
                return;
            }
            const level = this.formatAssistanceLevel(details.assistanceLevel);
            byLevel[level] = byLevel[level] || [];
            if (details.equipment?.length) {
                byLevel[level].push(`${activity} (uses ${details.equipment.join(', ')})`);
            }
            else {
                byLevel[level].push(activity);
            }
        });
        Object.entries(byLevel).forEach(([level, activities]) => {
            if (activities.length > 0) {
                sections.push(`\n${level}:`);
                activities.forEach(activity => sections.push(`- ${activity}`));
            }
        });
        if (data.recommendations.length > 0) {
            sections.push('\nRecommendations:');
            data.recommendations.forEach(rec => sections.push(`- ${rec}`));
        }
        return sections.join('\n');
    }
    formatDetailed(data) {
        if (!data.valid) {
            return 'Basic ADL Assessment: Unable to process data\n' +
                (data.errors?.join('\n') || 'Unknown error occurred');
        }
        const sections = ['Basic ADL Assessment'];
        Object.entries(data.activities).forEach(([activity, details]) => {
            if (details.assistanceLevel === ADLTypes_1.INDEPENDENCE_LEVELS.NOT_APPLICABLE) {
                return;
            }
            sections.push(`\n${activity}:`);
            sections.push(`  Assistance Level: ${this.formatAssistanceLevel(details.assistanceLevel)}`);
            if (details.equipment?.length) {
                sections.push(`  Equipment Used: ${details.equipment.join(', ')}`);
            }
            if (details.notes) {
                sections.push(`  Notes: ${details.notes}`);
            }
        });
        if (data.recommendations.length > 0) {
            sections.push('\nRecommendations:');
            data.recommendations.forEach(rec => sections.push(`- ${rec}`));
        }
        return sections.join('\n');
    }
}
exports.BasicADLAgent = BasicADLAgent;
