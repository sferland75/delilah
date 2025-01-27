"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedicalHistoryAgent = void 0;
const BaseAgent_1 = require("../core/BaseAgent");
const ReportStructure_1 = require("../core/ReportStructure");
class MedicalHistoryAgent extends BaseAgent_1.BaseAgent {
    constructor() {
        super(ReportStructure_1.ReportSection.PRE_ACCIDENT_HISTORY);
    }
    generateSection(data) {
        const medicalHistory = data.assessment.medicalHistory;
        const narrative = [
            this.formatPreExistingConditions(medicalHistory.preExisting),
            this.formatMedications(medicalHistory.medications),
            this.formatInjuryDetails(medicalHistory.injury),
            this.formatTreatmentHistory(medicalHistory.currentTreatment)
        ].filter(Boolean).join('\n\n');
        return {
            title: this.config.title,
            type: this.config.type,
            order: this.config.order,
            content: narrative
        };
    }
    formatPreExistingConditions(conditions) {
        if (!conditions)
            return '';
        return `Prior to the subject accident, the client's medical history included: ${conditions}`;
    }
    formatMedications(medications) {
        if (!medications?.length)
            return '';
        const medList = medications.map(med => {
            return `${med.name} ${med.dosage} ${med.frequency}${med.purpose ? ` for ${med.purpose}` : ''}`;
        });
        return `Current medications include: ${this.formatClinicalList(medList)}.`;
    }
    formatInjuryDetails(injury) {
        if (!injury)
            return '';
        const sections = [];
        if (injury.circumstance) {
            sections.push(`Injury Circumstance: ${injury.circumstance}`);
        }
        if (injury.immediateResponse) {
            sections.push(`Immediate Response: ${injury.immediateResponse}`);
        }
        if (injury.subsequentCare) {
            sections.push(`Subsequent Care: ${injury.subsequentCare}`);
        }
        return sections.join('\n\n');
    }
    formatTreatmentHistory(treatments) {
        if (!treatments?.length)
            return '';
        const currentProviders = treatments
            .filter(t => t.name && t.providerType)
            .map(t => {
            const details = [
                t.name,
                t.providerType,
                t.frequency,
                t.focus
            ].filter(Boolean);
            return details.join(' - ');
        });
        if (!currentProviders.length)
            return '';
        return 'Current treatment providers include:\n' +
            currentProviders.map(p => `• ${p}`).join('\n');
    }
}
exports.MedicalHistoryAgent = MedicalHistoryAgent;
