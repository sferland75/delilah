"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransfersAgentRecommendations = void 0;
const TransfersAgentPatterns_1 = require("./TransfersAgentPatterns");
class TransfersAgentRecommendations extends TransfersAgentPatterns_1.TransfersAgentPatterns {
    assessRiskFactors(data) {
        const risks = [];
        // First check symptoms
        const physicalSymptoms = data?.symptoms?.physical || [];
        for (const symptom of physicalSymptoms) {
            if (['hip', 'knee', 'back', 'shoulder'].some((term) => symptom.location.toLowerCase().includes(term))) {
                risks.push(`${symptom.location} ${symptom.severity.toLowerCase()} ${symptom.painType.toLowerCase()} impacts transfer safety`);
            }
        }
        // Then check assistance levels
        const transfers = data.transfers || {};
        for (const [location, details] of Object.entries(transfers)) {
            const transferDetails = details;
            if (transferDetails?.assistanceLevel && ['moderate_assist', 'maximum_assist'].includes(transferDetails.assistanceLevel)) {
                risks.push(`High assistance needs for ${location} transfers`);
            }
        }
        // Finally add environmental risks
        const environment = data.environment || {};
        for (const [location, details] of Object.entries(environment)) {
            const envDetails = details;
            if (envDetails?.hazards) {
                for (const hazard of envDetails.hazards) {
                    risks.push(`${location}: ${hazard}`);
                }
            }
        }
        return risks;
    }
    generateRecommendations(data, patterns, risks) {
        const recommendations = [];
        // Equipment recommendations
        const requiredEquipment = this.identifyRequiredEquipment(data, patterns);
        const currentEquipment = new Set(data.currentEquipment || []);
        requiredEquipment.forEach((item) => {
            if (!currentEquipment.has(item)) {
                // Maintain original format with underscores
                recommendations.push(`Obtain ${item} for safe transfers`);
            }
        });
        // Training recommendations
        if (patterns.some((p) => p.type !== 'independent' && p.type !== 'modified_independent')) {
            recommendations.push('Transfer training with physical therapy recommended');
        }
        // Environmental modifications
        risks.forEach((risk) => {
            if (risk.toLowerCase().includes('hazard')) {
                recommendations.push(`Address ${risk}`);
            }
        });
        // Check all location patterns for assistance levels
        const transfers = data.transfers || {};
        let needsCaregiverTraining = false;
        for (const details of Object.values(transfers)) {
            const transferDetails = details;
            if (transferDetails?.assistanceLevel === 'moderate_assist' || transferDetails?.assistanceLevel === 'maximum_assist') {
                needsCaregiverTraining = true;
                break;
            }
        }
        if (needsCaregiverTraining) {
            recommendations.push('Caregiver training for safe transfer techniques recommended');
        }
        return recommendations;
    }
}
exports.TransfersAgentRecommendations = TransfersAgentRecommendations;
