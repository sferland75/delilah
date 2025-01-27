"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CognitiveSymptomAgent = void 0;
const BaseAgent_1 = require("../BaseAgent");
const lodash_1 = __importDefault(require("lodash"));
class CognitiveSymptomAgent extends BaseAgent_1.BaseAgent {
    constructor(context) {
        super(context, 3.1, 'Cognitive Symptoms', ['symptoms.cognitive']);
    }
    async processData(data) {
        const symptoms = lodash_1.default.get(data, 'symptoms.cognitive', []);
        return {
            valid: true,
            symptoms: Array.isArray(symptoms) ? symptoms : []
        };
    }
    formatBrief(data) {
        if (data.symptoms.length === 0) {
            return 'No cognitive symptoms reported';
        }
        const sections = ['Cognitive Symptom Summary'];
        data.symptoms.forEach(s => {
            sections.push(`- ${s.symptom} (${s.severity}, ${s.frequency})`);
        });
        return sections.join('\n');
    }
    formatStandard(data) {
        if (data.symptoms.length === 0) {
            return 'No cognitive symptoms reported';
        }
        const sections = ['Cognitive Symptoms'];
        data.symptoms.forEach(s => {
            sections.push(`\n${s.symptom}:`);
            sections.push(`  Severity: ${s.severity}`);
            sections.push(`  Frequency: ${s.frequency}`);
            sections.push(`  Impact: ${s.impact}`);
            sections.push(`  Management: ${s.management}`);
        });
        return sections.join('\n');
    }
    formatDetailed(data) {
        if (data.symptoms.length === 0) {
            return 'No cognitive symptoms reported';
        }
        const sections = ['Cognitive Symptoms Assessment'];
        // Individual symptoms
        data.symptoms.forEach(s => {
            sections.push(`\n${s.symptom}:`);
            sections.push(`  Severity: ${s.severity}`);
            sections.push(`  Frequency: ${s.frequency}`);
            sections.push(`  Impact: ${s.impact}`);
            sections.push(`  Management: ${s.management}`);
        });
        // Analysis
        sections.push('\nAnalysis:');
        sections.push('Symptom Distribution:');
        const severityGroups = lodash_1.default.groupBy(data.symptoms, 'severity');
        Object.entries(severityGroups).forEach(([severity, symptoms]) => {
            sections.push(`- ${severity}: ${symptoms.length} symptom(s)`);
        });
        return sections.join('\n');
    }
}
exports.CognitiveSymptomAgent = CognitiveSymptomAgent;
