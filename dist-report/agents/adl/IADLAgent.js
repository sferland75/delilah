"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IADLAgent = void 0;
const BaseAgent_1 = require("../BaseAgent");
const lodash_1 = __importDefault(require("lodash"));
class IADLAgent extends BaseAgent_1.BaseAgent {
    constructor(context) {
        super(context, 3.2, 'IADL Assessment', ['functionalAssessment.iadl']);
    }
    async processData(data) {
        const iadlData = lodash_1.default.get(data, 'functionalAssessment.iadl', {});
        const activities = {};
        const recommendations = [];
        Object.entries(iadlData).forEach(([key, value]) => {
            const activity = this.processActivity(value);
            activities[key] = activity;
            if (activity.level !== 'Independent') {
                recommendations.push(this.generateRecommendation(key, activity));
            }
        });
        return {
            valid: true,
            activities,
            recommendations
        };
    }
    processActivity(data) {
        if (typeof data === 'string') {
            return { level: data };
        }
        return {
            level: data.level || 'Dependent',
            equipment: data.equipment,
            notes: data.notes
        };
    }
    generateRecommendation(activity, details) {
        return `Consider support for ${this.formatActivityName(activity)} - currently at ${details.level} level`;
    }
    formatActivityName(key) {
        return key
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase())
            .trim();
    }
    formatBrief(data) {
        const sections = ['IADL Status'];
        Object.entries(data.activities).forEach(([key, activity]) => {
            sections.push(`${this.formatActivityName(key)}: ${activity.level}`);
        });
        return sections.join('\n');
    }
    formatStandard(data) {
        const sections = ['Instrumental ADL Assessment'];
        const byLevel = {};
        Object.entries(data.activities).forEach(([key, activity]) => {
            byLevel[activity.level] = byLevel[activity.level] || [];
            if (activity.equipment?.length) {
                byLevel[activity.level].push(`${this.formatActivityName(key)} (uses ${activity.equipment.join(', ')})`);
            }
            else {
                byLevel[activity.level].push(this.formatActivityName(key));
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
        const sections = ['IADL Assessment'];
        Object.entries(data.activities).forEach(([key, activity]) => {
            sections.push(`\n${this.formatActivityName(key)}:`);
            sections.push(`  Assistance Level: ${activity.level}`);
            if (activity.equipment?.length) {
                sections.push(`  Equipment Used: ${activity.equipment.join(', ')}`);
            }
            if (activity.notes) {
                sections.push(`  Notes: ${activity.notes}`);
            }
        });
        if (data.recommendations.length > 0) {
            sections.push('\nRecommendations:');
            data.recommendations.forEach(rec => sections.push(`- ${rec}`));
        }
        return sections.join('\n');
    }
}
exports.IADLAgent = IADLAgent;
