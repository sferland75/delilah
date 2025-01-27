"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MobilityAgent = void 0;
const BaseAgent_1 = require("./BaseAgent");
const lodash_1 = __importDefault(require("lodash"));
class MobilityAgent extends BaseAgent_1.BaseAgent {
    constructor(context) {
        super(context, 2.2, 'Mobility Assessment', ['functionalAssessment.mobility']);
    }
    async processData(data) {
        const mobility = lodash_1.default.get(data, 'functionalAssessment.mobility', {});
        const bergBalance = lodash_1.default.get(data, 'functionalAssessment.bergBalance.totalScore');
        const equipment = lodash_1.default.get(data, 'equipment', { current: [] });
        const safety = [];
        const recommendations = [];
        // Process mobility data
        const processedMobility = {
            walkingDistance: mobility.walkingDistance || 0,
            assistiveDevices: mobility.assistiveDevices || [],
            restrictions: mobility.restrictions || [],
            terrain: mobility.terrain || [],
            notes: mobility.notes
        };
        // Process balance data
        const balanceScore = bergBalance;
        const balanceRiskLevel = this.determineBalanceRisk(balanceScore);
        const balanceConcerns = [];
        if (balanceScore && balanceScore < 45) {
            balanceConcerns.push('Decreased balance per Berg Balance Score');
            recommendations.push('Physical therapy evaluation for balance training');
        }
        // Analyze safety concerns
        if (processedMobility.walkingDistance < 150) {
            safety.push('Limited community ambulation distance');
            recommendations.push('Gait training to improve walking distance');
        }
        // Check needed devices
        if (processedMobility.assistiveDevices && equipment.current) {
            const neededDevices = processedMobility.assistiveDevices.filter(device => !equipment.current.includes(device));
            if (neededDevices.length > 0) {
                recommendations.push(`Obtain needed mobility devices: ${neededDevices.join(', ')}`);
            }
        }
        if (processedMobility.restrictions.length > 0) {
            safety.push(...processedMobility.restrictions);
        }
        return {
            valid: true,
            mobility: processedMobility,
            balance: {
                score: balanceScore,
                riskLevel: balanceRiskLevel,
                concerns: balanceConcerns
            },
            safety,
            recommendations
        };
    }
    determineBalanceRisk(score) {
        if (!score)
            return 'high';
        if (score >= 45)
            return 'low';
        if (score >= 35)
            return 'moderate';
        return 'high';
    }
    formatBrief(data) {
        const sections = ['Mobility Status'];
        sections.push(`\nWalking Distance: ${data.mobility.walkingDistance} feet`);
        if (data.mobility.assistiveDevices.length > 0) {
            sections.push(`Uses: ${data.mobility.assistiveDevices.join(', ')}`);
        }
        if (data.balance.riskLevel !== 'low') {
            sections.push(`Fall Risk Level: ${data.balance.riskLevel}`);
        }
        return sections.join('\n');
    }
    formatStandard(data) {
        const sections = ['Mobility Assessment'];
        // Core mobility info
        sections.push(`\nWalking Distance: ${data.mobility.walkingDistance} feet`);
        if (data.mobility.assistiveDevices.length > 0) {
            sections.push(`Assistive Devices: ${data.mobility.assistiveDevices.join(', ')}`);
        }
        // Balance info
        if (data.balance.score !== undefined) {
            sections.push(`\nBerg Balance Score: ${data.balance.score}`);
            sections.push(`Fall Risk Level: ${data.balance.riskLevel}`);
        }
        // Key safety concerns
        if (data.safety.length > 0) {
            sections.push(`\nSafety Concerns: ${data.safety.join(', ')}`);
        }
        return sections.join('\n');
    }
    formatDetailed(data) {
        const sections = ['Mobility Assessment'];
        // Mobility details
        sections.push('\nAmbulation:');
        sections.push(`- Distance: ${data.mobility.walkingDistance} feet`);
        if (data.mobility.assistiveDevices.length > 0) {
            sections.push(`- Assistive Devices: ${data.mobility.assistiveDevices.join(', ')}`);
        }
        if (data.mobility.terrain.length > 0) {
            sections.push(`- Terrain: ${data.mobility.terrain.join(', ')}`);
        }
        if (data.mobility.restrictions.length > 0) {
            sections.push(`- Restrictions: ${data.mobility.restrictions.join(', ')}`);
        }
        // Balance assessment
        sections.push('\nBalance Assessment:');
        if (data.balance.score !== undefined) {
            sections.push(`- Berg Balance Score: ${data.balance.score}`);
        }
        sections.push(`- Risk Level: ${data.balance.riskLevel}`);
        if (data.balance.concerns.length > 0) {
            sections.push(`- Concerns: ${data.balance.concerns.join(', ')}`);
        }
        // Safety
        if (data.safety.length > 0) {
            sections.push('\nSafety Concerns:');
            data.safety.forEach(concern => {
                sections.push(`- ${concern}`);
            });
        }
        // Recommendations
        if (data.recommendations.length > 0) {
            sections.push('\nRecommendations:');
            data.recommendations.forEach(rec => {
                sections.push(`- ${rec}`);
            });
        }
        if (data.mobility.notes) {
            sections.push(`\nAdditional Notes: ${data.mobility.notes}`);
        }
        return sections.join('\n');
    }
}
exports.MobilityAgent = MobilityAgent;
