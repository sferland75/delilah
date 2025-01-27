"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransfersAgent = void 0;
const TransfersAgentFormatting_1 = require("./TransfersAgentFormatting");
class TransfersAgent extends TransfersAgentFormatting_1.TransfersAgentFormatting {
    constructor(context) {
        super(context, 3, 'Transfers Assessment', [
            'functionalAssessment.transfers.bedMobility',
            'functionalAssessment.transfers.sitToStand'
        ]);
    }
    initializeValidationRules() {
        const validAssistanceLevels = [
            'independent',
            'modified_independent',
            'minimal_assist',
            'moderate_assist',
            'maximum_assist'
        ];
        this.addValidationRule((data) => {
            const bedMobility = this.getField(data, 'functionalAssessment.transfers.bedMobility', '');
            return validAssistanceLevels.includes(bedMobility);
        }, 'Invalid value for functionalAssessment.transfers.bedMobility');
        this.addValidationRule((data) => {
            const sitToStand = this.getField(data, 'functionalAssessment.transfers.sitToStand', '');
            return validAssistanceLevels.includes(sitToStand);
        }, 'Invalid value for functionalAssessment.transfers.sitToStand');
    }
    getSectionKeys() {
        return [
            'transferStatus.locations',
            'transferStatus.generalPatterns',
            'transferStatus.requiredEquipment',
            'riskFactors',
            'recommendations'
        ];
    }
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
}
exports.TransfersAgent = TransfersAgent;
