"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrentMedicalTeamAgent = void 0;
const BaseAgent_1 = require("../core/BaseAgent");
const ReportStructure_1 = require("../core/ReportStructure");
class CurrentMedicalTeamAgent extends BaseAgent_1.BaseAgent {
    constructor() {
        super(ReportStructure_1.ReportSection.CURRENT_MEDICAL_TEAM);
    }
    generateSection(data) {
        const treatments = data.assessment.medicalHistory?.currentTreatment || [];
        return {
            title: this.config.title,
            type: this.config.type,
            order: this.config.order,
            content: {
                providers: treatments.map(provider => ({
                    name: provider.name || '',
                    type: provider.providerType || '',
                    frequency: provider.frequency || '',
                    focus: provider.focus || '',
                    progress: provider.progress || '',
                    startDate: provider.startDate ? this.formatClinicalDate(provider.startDate) : ''
                }))
            }
        };
    }
}
exports.CurrentMedicalTeamAgent = CurrentMedicalTeamAgent;
