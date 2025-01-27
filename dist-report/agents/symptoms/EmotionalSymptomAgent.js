"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmotionalSymptomAgent = void 0;
const BaseAgent_1 = require("../BaseAgent");
const lodash_1 = __importDefault(require("lodash"));
class EmotionalSymptomAgent extends BaseAgent_1.BaseAgent {
    constructor(context) {
        super(context, 3.1, 'Emotional Symptoms', ['symptoms.emotional']);
    }
    async processData(data) {
        const symptoms = lodash_1.default.get(data, 'symptoms.emotional', []);
        return {
            valid: true,
            symptoms: Array.isArray(symptoms) ? symptoms : []
        };
    }
    formatBrief(data) {
        if (data.symptoms.length === 0) {
            return 'No emotional symptoms reported';
        }
        const sections = ['Emotional Symptom Summary'];
        data.symptoms.forEach(s => {
            sections.push(`- ${s.symptom} (${s.severity}, ${s.frequency})`);
        });
        return sections.join('\n');
    }
    formatStandard(data) {
        if (data.symptoms.length === 0) {
            return 'No emotional symptoms reported';
        }
        const sections = ['Emotional Symptoms'];
        data.symptoms.forEach(s => {
            sections.push(`\n${s.symptom}:`);
            sections.push(`  Severity: ${s.severity}`);
            sections.push(`  Frequency: ${s.frequency}`);
            sections.push(`  Impact: ${s.impact}`);
            sections.push(`  Management: ${s.management}`);
            if (s.triggers?.length) {
                sections.push(`  Triggers: ${s.triggers.join(', ')}`);
            }
        });
        return sections.join('\n');
    }
    formatDetailed(data) {
        if (data.symptoms.length === 0) {
            return 'No emotional symptoms reported';
        }
        const sections = ['Emotional Symptoms Assessment'];
        // Individual symptoms
        data.symptoms.forEach(s => {
            sections.push(`\n${s.symptom}:`);
            sections.push(`  Severity: ${s.severity}`);
            sections.push(`  Frequency: ${s.frequency}`);
            sections.push(`  Impact: ${s.impact}`);
            sections.push(`  Management: ${s.management}`);
            if (s.triggers?.length) {
                sections.push(`  Triggers: ${s.triggers.join(', ')}`);
            }
        });
        // Analysis
        sections.push('\nAnalysis:');
        sections.push('Symptom Distribution:');
        const severityGroups = lodash_1.default.groupBy(data.symptoms, 'severity');
        Object.entries(severityGroups).forEach(([severity, symptoms]) => {
            sections.push(`- ${severity}: ${symptoms.length} symptom(s)`);
        });
        sections.push('\nTrigger Analysis:');
        const allTriggers = data.symptoms.reduce((acc, s) => {
            if (s.triggers)
                acc.push(...s.triggers);
            return acc;
        }, []);
        if (allTriggers.length > 0) {
            const triggerFrequency = lodash_1.default.countBy(allTriggers);
            Object.entries(triggerFrequency)
                .sort(([, a], [, b]) => b - a)
                .forEach(([trigger, count]) => {
                sections.push(`- ${trigger}: ${count} symptom(s)`);
            });
        }
        return sections.join('\n');
    }
}
exports.EmotionalSymptomAgent = EmotionalSymptomAgent;
