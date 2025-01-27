"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrentMedicationsAgent = void 0;
const BaseAgent_1 = require("../core/BaseAgent");
const ReportStructure_1 = require("../core/ReportStructure");
class CurrentMedicationsAgent extends BaseAgent_1.BaseAgent {
    constructor() {
        super(ReportStructure_1.ReportSection.CURRENT_MEDICATIONS);
    }
    generateSection(data) {
        const medications = data.assessment.medicalHistory?.medications || [];
        return {
            title: this.config.title,
            type: this.config.type,
            order: this.config.order,
            content: {
                medications: medications.map(med => ({
                    name: med.name,
                    dosage: med.dosage,
                    frequency: med.frequency,
                    purpose: med.purpose,
                    formattedText: this.formatMedication(med)
                }))
            }
        };
    }
    formatMedication(med) {
        const parts = [];
        if (med.name)
            parts.push(med.name);
        if (med.dosage)
            parts.push(med.dosage);
        if (med.frequency)
            parts.push(med.frequency);
        if (med.purpose)
            parts.push(`for ${med.purpose}`);
        return parts.join(' ');
    }
}
exports.CurrentMedicationsAgent = CurrentMedicationsAgent;
