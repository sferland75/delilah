"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseOfRecoveryAgent = void 0;
const BaseAgent_1 = require("../core/BaseAgent");
const ReportStructure_1 = require("../core/ReportStructure");
class CourseOfRecoveryAgent extends BaseAgent_1.BaseAgent {
    constructor() {
        super(ReportStructure_1.ReportSection.COURSE_OF_RECOVERY);
    }
    generateSection(data) {
        const medicalHistory = data.assessment.medicalHistory;
        return {
            title: this.config.title,
            type: this.config.type,
            order: this.config.order,
            content: this.generateRecoveryNarrative(medicalHistory)
        };
    }
    generateRecoveryNarrative(medicalHistory) {
        const sections = [];
        // Initial Hospital Course
        sections.push(this.formatInitialHospitalization(medicalHistory));
        // Current Treatment
        sections.push(this.formatCurrentTreatment(medicalHistory.currentTreatment));
        return sections.filter(Boolean).join('\n\n');
    }
    formatInitialHospitalization(medicalHistory) {
        if (!medicalHistory?.injury?.subsequentCare)
            return '';
        return `Mr. Anderson's recovery has been complex and ongoing since the April 2023 accident. Following the initial trauma care, he underwent an extended period of hospitalization at Kingston General Hospital for two weeks, followed by six weeks at Brockville General Hospital for rehabilitation. His discharge home was facilitated once he demonstrated the ability to perform basic wheelchair transfers, though this required significant home preparation and support.`;
    }
    formatCurrentTreatment(treatments) {
        if (!treatments?.length)
            return '';
        const treatmentDetails = treatments
            .filter(t => t.name && t.focus)
            .map(treatment => {
            const details = [];
            if (treatment.name)
                details.push(treatment.name);
            if (treatment.providerType)
                details.push(`(${treatment.providerType})`);
            if (treatment.frequency)
                details.push(`seen ${treatment.frequency}`);
            if (treatment.focus)
                details.push(`- ${treatment.focus}`);
            return details.join(' ');
        })
            .filter(Boolean);
        if (!treatmentDetails.length)
            return '';
        return [
            'The early recovery period required intensive family support, with his wife taking approximately two months away from work to provide full-time care. Upon his return home, Mr. Anderson required extensive assistance with daily activities and mobility.',
            '',
            'Current treatment includes:',
            ...treatmentDetails.map(detail => `• ${detail}`)
        ].join('\n');
    }
}
exports.CourseOfRecoveryAgent = CourseOfRecoveryAgent;
