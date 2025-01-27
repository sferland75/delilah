"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransfersAgent = void 0;
const BaseAgent_1 = require("./BaseAgent");
const lodash_1 = __importDefault(require("lodash"));
class TransfersAgent extends BaseAgent_1.BaseAgent {
    constructor(context) {
        super(context, 2.1, 'Transfer Assessment', ['functionalAssessment.transfers']);
    }
    async processData(data) {
        const transfers = lodash_1.default.get(data, 'functionalAssessment.transfers', {});
        const currentEquipment = lodash_1.default.get(data, 'equipment.current', []);
        const bergBalance = lodash_1.default.get(data, 'functionalAssessment.bergBalance.totalScore');
        const transferData = this.extractTransferData(transfers);
        const riskFactors = this.analyzeRiskFactors(transferData, bergBalance);
        const recommendations = this.generateRecommendations(transferData, currentEquipment, riskFactors);
        return {
            valid: true,
            transferStatus: {
                locations: transferData.locations,
                requiredEquipment: transferData.requiredEquipment
            },
            riskFactors,
            recommendations
        };
    }
    extractTransferData(data) {
        const transferData = {
            locations: [],
            assistanceLevels: {},
            requiredEquipment: [],
            safetyModifications: [],
            concerns: []
        };
        // Process bed mobility and sit-to-stand
        if (data.bedMobility) {
            transferData.locations.push('bed');
            transferData.assistanceLevels.bed = data.bedMobility;
        }
        if (data.sitToStand) {
            transferData.locations.push('chair');
            transferData.assistanceLevels.chair = data.sitToStand;
        }
        // Process specific transfer locations
        ['toilet', 'shower', 'tub', 'car'].forEach(location => {
            const transferInfo = data[location];
            if (transferInfo) {
                transferData.locations.push(location);
                transferData.assistanceLevels[location] = transferInfo.assistanceLevel;
                if (transferInfo.equipment) {
                    transferData.requiredEquipment.push(...transferInfo.equipment);
                }
                if (transferInfo.modifications) {
                    transferData.safetyModifications.push(...transferInfo.modifications);
                }
                if (transferInfo.safety_concerns) {
                    transferData.concerns.push(...transferInfo.safety_concerns);
                }
            }
        });
        // Remove duplicates
        transferData.requiredEquipment = [...new Set(transferData.requiredEquipment)];
        transferData.safetyModifications = [...new Set(transferData.safetyModifications)];
        transferData.concerns = [...new Set(transferData.concerns)];
        return transferData;
    }
    analyzeRiskFactors(data, bergBalance) {
        const riskFactors = [];
        // Analyze assistance levels
        const needsAssistance = Object.values(data.assistanceLevels).some(level => level !== 'Independent');
        if (needsAssistance) {
            riskFactors.push('Requires assistance with transfers');
        }
        // Check equipment dependency
        if (data.requiredEquipment.length > 0) {
            riskFactors.push('Equipment dependent for safe transfers');
        }
        // Check explicit safety concerns
        if (data.concerns.length > 0) {
            riskFactors.push(...data.concerns);
        }
        // Check Berg Balance Score
        if (bergBalance !== undefined && bergBalance < 45) {
            riskFactors.push('Decreased balance per Berg Balance Score');
        }
        return riskFactors;
    }
    generateRecommendations(data, currentEquipment, riskFactors) {
        const recommendations = [];
        // Equipment recommendations
        const neededEquipment = data.requiredEquipment.filter(equipment => !currentEquipment.includes(equipment));
        if (neededEquipment.length > 0) {
            recommendations.push(`Obtain needed transfer equipment: ${neededEquipment.join(', ')}`);
        }
        // Safety modification recommendations
        if (data.safetyModifications.length > 0) {
            recommendations.push(`Implement safety modifications: ${data.safetyModifications.join(', ')}`);
        }
        // Therapy recommendations based on risk factors
        if (riskFactors.some(risk => risk.toLowerCase().includes('balance'))) {
            recommendations.push('Physical therapy evaluation for balance training');
        }
        if (riskFactors.some(risk => risk.toLowerCase().includes('assistance'))) {
            recommendations.push('Occupational therapy for transfer training');
        }
        return recommendations;
    }
    formatBrief(data) {
        const sections = ['Transfer Status'];
        if (data.transferStatus.locations.length > 0) {
            sections.push(`\nTransfer Locations: ${data.transferStatus.locations.join(', ')}`);
        }
        if (data.riskFactors.length > 0) {
            sections.push(`\nRisk Factors: ${data.riskFactors.join(', ')}`);
        }
        return sections.join('\n');
    }
    formatStandard(data) {
        const sections = ['Transfer Assessment'];
        sections.push('\nTransfer Locations:');
        data.transferStatus.locations.forEach(location => {
            sections.push(`- ${location}`);
        });
        if (data.transferStatus.requiredEquipment.length > 0) {
            sections.push('\nRequired Equipment:');
            data.transferStatus.requiredEquipment.forEach(equipment => {
                sections.push(`- ${equipment}`);
            });
        }
        if (data.riskFactors.length > 0) {
            sections.push('\nRisk Factors:');
            data.riskFactors.forEach(risk => {
                sections.push(`- ${risk}`);
            });
        }
        return sections.join('\n');
    }
    formatDetailed(data) {
        const sections = this.formatStandard(data).split('\n');
        if (data.recommendations.length > 0) {
            sections.push('\nRecommendations:');
            data.recommendations.forEach(rec => {
                sections.push(`- ${rec}`);
            });
        }
        return sections.join('\n');
    }
}
exports.TransfersAgent = TransfersAgent;
