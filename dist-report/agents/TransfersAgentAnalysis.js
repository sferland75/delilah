"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransfersAgentAnalysis = void 0;
const TransfersAgentBase_1 = require("./TransfersAgentBase");
class TransfersAgentAnalysis extends TransfersAgentBase_1.TransfersAgentBase {
    async analyze(data) {
        const transferData = this.extractTransferData(data);
        const patterns = this.analyzeTransferPatterns(transferData);
        const risks = this.assessRiskFactors(transferData);
        const recommendations = this.generateRecommendations(transferData, patterns, risks);
        return {
            transferStatus: {
                locations: this.analyzeLocationSpecificTransfers(transferData),
                generalPatterns: patterns,
                requiredEquipment: this.identifyRequiredEquipment(transferData, patterns)
            },
            riskFactors: risks,
            recommendations
        };
    }
    async processData(data) {
        return this.analyze(data);
    }
    extractTransferData(data) {
        return {
            transfers: this.getField(data, 'functionalAssessment.transfers', {}),
            currentEquipment: this.getField(data, 'equipment.current', []),
            symptoms: {
                physical: this.getField(data, 'symptoms.physical', [])
            },
            environment: this.getField(data, 'environment.home', {})
        };
    }
}
exports.TransfersAgentAnalysis = TransfersAgentAnalysis;
