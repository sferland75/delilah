"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MechanismOfInjuryAgent = void 0;
const BaseAgent_1 = require("../core/BaseAgent");
const ReportStructure_1 = require("../core/ReportStructure");
class MechanismOfInjuryAgent extends BaseAgent_1.BaseAgent {
    constructor() {
        super(ReportStructure_1.ReportSection.MECHANISM_OF_INJURY);
    }
    generateSection(data) {
        const injury = data.assessment.medicalHistory.injury;
        return {
            title: this.config.title,
            type: this.config.type,
            order: this.config.order,
            content: this.generateInjuryNarrative(injury)
        };
    }
    generateInjuryNarrative(injury) {
        if (!injury)
            return '';
        const sections = [];
        // Circumstances
        if (injury.circumstance) {
            sections.push(`The subject accident occurred on April 28, 2023, when ${injury.circumstance}`);
        }
        // Immediate response
        if (injury.immediateResponse) {
            sections.push(`Following the collision, ${injury.immediateResponse}`);
        }
        // Subsequent care
        if (injury.subsequentCare) {
            sections.push(injury.subsequentCare);
        }
        return sections.filter(Boolean).join('\n\n');
    }
}
exports.MechanismOfInjuryAgent = MechanismOfInjuryAgent;
