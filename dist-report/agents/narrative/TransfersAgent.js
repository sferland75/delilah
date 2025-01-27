"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NarrativeTransfersAgent = void 0;
const BaseAgent_1 = require("../BaseAgent");
const lodash_1 = __importDefault(require("lodash"));
class NarrativeTransfersAgent extends BaseAgent_1.BaseAgent {
    constructor(context) {
        super(context, 2.1, 'Transfer Narrative', ['functionalAssessment.transfers']);
    }
    async processData(data) {
        const transfers = lodash_1.default.get(data, 'functionalAssessment.transfers', {});
        const bergBalance = lodash_1.default.get(data, 'functionalAssessment.bergBalance.totalScore');
        const currentEquipment = lodash_1.default.get(data, 'equipment.current', []);
        const narrative = this.generateNarrative(transfers, bergBalance);
        const bullets = this.generateBulletPoints(transfers, currentEquipment);
        const recommendations = this.generateRecommendations(transfers, bergBalance, currentEquipment);
        return {
            valid: true,
            narrative,
            bullets,
            recommendations
        };
    }
    generateNarrative(transfers, bergBalance) {
        const sections = [];
        const overallLevel = this.determineOverallLevel(transfers);
        sections.push(`Patient demonstrates ${overallLevel} transfer abilities.`);
        const specifics = this.getTransferSpecifics(transfers);
        if (specifics) {
            sections.push(specifics);
        }
        if (bergBalance !== undefined) {
            sections.push(this.getBalanceNarrative(bergBalance));
        }
        return sections.join(' ');
    }
    determineOverallLevel(transfers) {
        const levels = [
            transfers.bedMobility,
            transfers.sitToStand,
            transfers.toilet?.assistanceLevel,
            transfers.shower?.assistanceLevel
        ].filter(Boolean);
        if (levels.every(l => l === 'Independent')) {
            return 'independent';
        }
        if (levels.every(l => l === 'Independent' || l === 'Modified Independent')) {
            return 'modified independent';
        }
        if (levels.some(l => l === 'Dependent')) {
            return 'dependent';
        }
        return 'varied levels of independence with';
    }
    getTransferSpecifics(transfers) {
        const details = [];
        if (transfers.bedMobility) {
            details.push(`bed mobility is ${transfers.bedMobility.toLowerCase()}`);
        }
        if (transfers.sitToStand) {
            details.push(`sit-to-stand transfers are ${transfers.sitToStand.toLowerCase()}`);
        }
        if (transfers.toilet) {
            const toiletDetails = [];
            toiletDetails.push(`toilet transfers are ${transfers.toilet.assistanceLevel.toLowerCase()}`);
            if (transfers.toilet.equipment?.length) {
                toiletDetails.push(`using ${transfers.toilet.equipment.join(' and ')}`);
            }
            details.push(toiletDetails.join(' '));
        }
        if (transfers.shower) {
            const showerDetails = [];
            showerDetails.push(`shower transfers are ${transfers.shower.assistanceLevel.toLowerCase()}`);
            if (transfers.shower.equipment?.length) {
                showerDetails.push(`using ${transfers.shower.equipment.join(' and ')}`);
            }
            details.push(showerDetails.join(' '));
        }
        return details.length > 0 ? details.join(', and ') + '.' : '';
    }
    getBalanceNarrative(bergBalance) {
        if (bergBalance >= 45) {
            return 'Balance testing indicates low fall risk.';
        }
        else if (bergBalance >= 35) {
            return 'Balance testing indicates moderate fall risk.';
        }
        else {
            return 'Balance testing indicates high fall risk.';
        }
    }
    generateBulletPoints(transfers, currentEquipment) {
        const bullets = [];
        // Equipment utilization
        const allEquipment = new Set([
            ...(transfers.toilet?.equipment || []),
            ...(transfers.shower?.equipment || []),
            ...currentEquipment
        ]);
        if (allEquipment.size > 0) {
            bullets.push(`Currently using: ${Array.from(allEquipment).join(', ')}`);
        }
        // Safety concerns
        const concerns = [
            ...(transfers.toilet?.safety_concerns || []),
            ...(transfers.shower?.safety_concerns || [])
        ];
        if (concerns.length > 0) {
            bullets.push(`Safety concerns: ${concerns.join(', ')}`);
        }
        // Modifications
        const modifications = [
            ...(transfers.toilet?.modifications || []),
            ...(transfers.shower?.modifications || [])
        ];
        if (modifications.length > 0) {
            bullets.push(`Required modifications: ${modifications.join(', ')}`);
        }
        return bullets;
    }
    generateRecommendations(transfers, bergBalance, currentEquipment = []) {
        const recommendations = [];
        // Equipment recommendations
        const neededEquipment = [
            ...(transfers.toilet?.equipment || []),
            ...(transfers.shower?.equipment || [])
        ].filter(item => !currentEquipment.includes(item));
        if (neededEquipment.length > 0) {
            recommendations.push(`Obtain: ${neededEquipment.join(', ')}`);
        }
        // Balance-based recommendations
        if (bergBalance !== undefined && bergBalance < 45) {
            recommendations.push('Physical therapy evaluation for balance training');
        }
        // Assistance-based recommendations
        const needsAssistance = [
            transfers.bedMobility,
            transfers.sitToStand,
            transfers.toilet?.assistanceLevel,
            transfers.shower?.assistanceLevel
        ].some(level => level && level !== 'Independent');
        if (needsAssistance) {
            recommendations.push('Transfer training with occupational therapy');
        }
        return recommendations;
    }
    formatBrief(data) {
        return data.narrative;
    }
    formatStandard(data) {
        const sections = [data.narrative];
        if (data.bullets.length > 0) {
            sections.push('\nCurrent Equipment:');
            data.bullets.forEach(bullet => sections.push(`- ${bullet}`));
        }
        if (data.recommendations.length > 0) {
            sections.push('\nRecommendations:');
            data.recommendations.forEach(rec => sections.push(`- ${rec}`));
        }
        return sections.join('\n');
    }
    formatDetailed(data) {
        const sections = [data.narrative];
        if (data.bullets.length > 0) {
            sections.push('\nCurrent Equipment:');
            data.bullets.forEach(bullet => sections.push(`- ${bullet}`));
        }
        if (data.recommendations.length > 0) {
            sections.push('\nRecommendations:');
            data.recommendations.forEach(rec => sections.push(`- ${rec}`));
        }
        return sections.join('\n');
    }
}
exports.NarrativeTransfersAgent = NarrativeTransfersAgent;
