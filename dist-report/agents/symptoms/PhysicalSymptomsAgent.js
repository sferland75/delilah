"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhysicalSymptomsAgent = void 0;
const BaseAgent_1 = require("../BaseAgent");
const lodash_1 = __importDefault(require("lodash"));
class PhysicalSymptomsAgent extends BaseAgent_1.BaseAgent {
    constructor(context) {
        super(context, 3.1, 'Physical Symptoms', ['symptoms.physical']);
    }
    async processData(data) {
        const symptoms = lodash_1.default.get(data, 'symptoms.physical', []);
        return {
            valid: true,
            symptoms: Array.isArray(symptoms) ? symptoms : []
        };
    }
    formatBrief(data) {
        if (data.symptoms.length === 0) {
            return 'No physical symptoms reported';
        }
        const sections = ['Physical Symptom Summary'];
        data.symptoms.forEach(s => {
            const parts = [`- ${s.symptom} (${s.severity}, ${s.frequency})`];
            if (s.location) {
                parts.push(`  Location: ${s.location}`);
            }
            if (s.impact) {
                parts.push(`  Impact: ${s.impact}`);
            }
            sections.push(parts.join('\n'));
        });
        return sections.join('\n');
    }
    formatStandard(data) {
        if (data.symptoms.length === 0) {
            return 'No physical symptoms reported';
        }
        const sections = ['Physical Symptoms'];
        data.symptoms.forEach(s => {
            sections.push(`\n${s.symptom}:`);
            if (s.location)
                sections.push(`  Location: ${s.location}`);
            sections.push(`  Severity: ${s.severity}`);
            sections.push(`  Frequency: ${s.frequency}`);
            sections.push(`  Impact: ${s.impact}`);
            sections.push(`  Management: ${s.management}`);
            if (s.description)
                sections.push(`  Description: ${s.description}`);
        });
        return sections.join('\n');
    }
    formatDetailed(data) {
        if (data.symptoms.length === 0) {
            return 'No physical symptoms reported';
        }
        const sections = ['Physical Symptoms Assessment'];
        data.symptoms.forEach(s => {
            sections.push(`\n${s.symptom}:`);
            if (s.location)
                sections.push(`  Location: ${s.location}`);
            if (s.description)
                sections.push(`  Description: ${s.description}`);
            sections.push(`  Severity: ${s.severity}`);
            sections.push(`  Frequency: ${s.frequency}`);
            sections.push(`  Impact: ${s.impact}`);
            sections.push(`  Management: ${s.management}`);
            if (s.triggers?.length) {
                sections.push(`  Triggers: ${s.triggers.join(', ')}`);
            }
        });
        sections.push('\nAnalysis:');
        sections.push('Symptom Distribution:');
        const severityGroups = lodash_1.default.groupBy(data.symptoms, 'severity');
        Object.entries(severityGroups).forEach(([severity, symptoms]) => {
            sections.push(`- ${severity}: ${symptoms.length} symptom(s)`);
        });
        return sections.join('\n');
    }
}
exports.PhysicalSymptomsAgent = PhysicalSymptomsAgent;
