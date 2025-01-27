"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubjectiveInformationAgent = void 0;
const BaseAgent_1 = require("../core/BaseAgent");
const ReportStructure_1 = require("../core/ReportStructure");
class SubjectiveInformationAgent extends BaseAgent_1.BaseAgent {
    constructor() {
        super(ReportStructure_1.ReportSection.SUBJECTIVE_INFORMATION);
    }
    generateSection(data) {
        const symptoms = data.assessment.symptoms;
        const narrative = [
            this.formatPhysicalSymptoms(symptoms.physical),
            this.formatCognitiveSymptoms(symptoms.cognitive),
            this.formatEmotionalSymptoms(symptoms.emotional),
            symptoms.generalNotes
        ].filter(Boolean).join('\n\n');
        return {
            title: this.config.title,
            type: this.config.type,
            order: this.config.order,
            content: narrative
        };
    }
    formatPhysicalSymptoms(symptoms) {
        if (!symptoms?.length)
            return '';
        const formattedSymptoms = symptoms.map(symptom => {
            const parts = [];
            parts.push(`${symptom.location}: `);
            const descriptors = [
                symptom.painType,
                symptom.severity ? `${symptom.severity} severity` : null,
                symptom.frequency ? `occurring ${symptom.frequency.toLowerCase()}` : null
            ].filter(Boolean);
            if (descriptors.length) {
                parts.push(this.formatClinicalList(descriptors));
            }
            if (symptom.aggravating) {
                parts.push(`\nAggravating factors: ${symptom.aggravating}`);
            }
            if (symptom.relieving) {
                parts.push(`\nRelieving factors: ${symptom.relieving}`);
            }
            return parts.join('');
        });
        return 'Physical Symptoms:\n' + formattedSymptoms.join('\n\n');
    }
    formatCognitiveSymptoms(symptoms) {
        if (!symptoms?.length)
            return '';
        const formattedSymptoms = symptoms.map(symptom => {
            const parts = [];
            parts.push(`${symptom.symptom}: `);
            const descriptors = [
                symptom.severity ? `${symptom.severity} severity` : null,
                symptom.frequency ? `occurring ${symptom.frequency.toLowerCase()}` : null
            ].filter(Boolean);
            if (descriptors.length) {
                parts.push(this.formatClinicalList(descriptors));
            }
            if (symptom.impact) {
                parts.push(`\nImpact: ${symptom.impact}`);
            }
            if (symptom.management) {
                parts.push(`\nManagement: ${symptom.management}`);
            }
            return parts.join('');
        });
        return '\nCognitive Symptoms:\n' + formattedSymptoms.join('\n\n');
    }
    formatEmotionalSymptoms(symptoms) {
        if (!symptoms?.length)
            return '';
        const formattedSymptoms = symptoms.map(symptom => {
            const parts = [];
            parts.push(`${symptom.symptom}: `);
            const descriptors = [
                symptom.severity ? `${symptom.severity} severity` : null,
                symptom.frequency ? `occurring ${symptom.frequency.toLowerCase()}` : null
            ].filter(Boolean);
            if (descriptors.length) {
                parts.push(this.formatClinicalList(descriptors));
            }
            if (symptom.impact) {
                parts.push(`\nImpact: ${symptom.impact}`);
            }
            if (symptom.management) {
                parts.push(`\nManagement: ${symptom.management}`);
            }
            return parts.join('');
        });
        return '\nEmotional Symptoms:\n' + formattedSymptoms.join('\n\n');
    }
}
exports.SubjectiveInformationAgent = SubjectiveInformationAgent;
