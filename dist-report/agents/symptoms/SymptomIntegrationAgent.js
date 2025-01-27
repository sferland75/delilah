"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SymptomIntegrationAgent = void 0;
const BaseAgent_1 = require("../BaseAgent");
const lodash_1 = __importDefault(require("lodash"));
class SymptomIntegrationAgent extends BaseAgent_1.BaseAgent {
    constructor(context) {
        super(context, 3.0, 'Symptom Integration', ['symptoms']);
    }
    async processData(data) {
        const symptomsData = lodash_1.default.get(data, 'symptoms', { physical: [], cognitive: [], emotional: [] });
        const processedSymptoms = {
            physical: this.ensureArray(symptomsData.physical || []),
            cognitive: this.ensureArray(symptomsData.cognitive || []),
            emotional: this.ensureArray(symptomsData.emotional || [])
        };
        const patterns = this.analyzePatterns(processedSymptoms);
        const summary = this.generateSummary(processedSymptoms);
        return {
            valid: true,
            symptoms: processedSymptoms,
            patterns,
            summary
        };
    }
    ensureArray(value) {
        return Array.isArray(value) ? value : [];
    }
    analyzePatterns(symptoms) {
        const patterns = {
            symptoms: {},
            triggers: {},
            impacts: {}
        };
        // Group by impact
        this.allSymptoms(symptoms).forEach(symptom => {
            if (symptom.impact) {
                const key = symptom.impact.toLowerCase();
                patterns.impacts[key] = patterns.impacts[key] || [];
                patterns.impacts[key].push(symptom.symptom);
            }
        });
        // Group by triggers
        this.allSymptomsWithTriggers(symptoms).forEach(symptom => {
            if (symptom.triggers) {
                symptom.triggers.forEach(trigger => {
                    const key = trigger.toLowerCase();
                    patterns.triggers[key] = patterns.triggers[key] || [];
                    patterns.triggers[key].push(symptom.symptom);
                });
            }
        });
        return patterns;
    }
    allSymptoms(symptoms) {
        return [
            ...symptoms.physical,
            ...symptoms.cognitive,
            ...symptoms.emotional
        ];
    }
    allSymptomsWithTriggers(symptoms) {
        return [
            ...symptoms.physical,
            ...symptoms.emotional
        ];
    }
    generateSummary(symptoms) {
        const summary = [];
        const counts = {
            physical: symptoms.physical.length,
            cognitive: symptoms.cognitive.length,
            emotional: symptoms.emotional.length
        };
        const total = counts.physical + counts.cognitive + counts.emotional;
        if (total === 0) {
            return ['No symptoms reported'];
        }
        summary.push(`Total symptoms reported: ${total}`);
        if (counts.physical > 0)
            summary.push(`- ${counts.physical} physical symptoms`);
        if (counts.cognitive > 0)
            summary.push(`- ${counts.cognitive} cognitive symptoms`);
        if (counts.emotional > 0)
            summary.push(`- ${counts.emotional} emotional symptoms`);
        return summary;
    }
    formatBrief(data) {
        return data.summary.join('\n');
    }
    formatStandard(data) {
        const sections = ['Symptom Assessment'];
        if (data.symptoms.physical.length > 0) {
            sections.push('\nPhysical Symptoms:');
            data.symptoms.physical.forEach(s => {
                sections.push(`- ${s.symptom} (${s.severity})`);
                if (s.location)
                    sections.push(`  Location: ${s.location}`);
                sections.push(`  Management: ${s.management}`);
            });
        }
        if (data.symptoms.cognitive.length > 0) {
            sections.push('\nCognitive Symptoms:');
            data.symptoms.cognitive.forEach(s => {
                sections.push(`- ${s.symptom} (${s.severity})`);
                sections.push(`  Management: ${s.management}`);
            });
        }
        if (data.symptoms.emotional.length > 0) {
            sections.push('\nEmotional Symptoms:');
            data.symptoms.emotional.forEach(s => {
                sections.push(`- ${s.symptom} (${s.severity})`);
                sections.push(`  Management: ${s.management}`);
            });
        }
        return sections.join('\n');
    }
    formatDetailed(data) {
        const sections = ['Comprehensive Symptom Assessment'];
        // Physical Symptoms
        if (data.symptoms.physical.length > 0) {
            sections.push('\nPhysical Symptoms:');
            data.symptoms.physical.forEach(s => {
                sections.push(`\n${s.symptom}:`);
                if (s.location)
                    sections.push(`  Location: ${s.location}`);
                if (s.description)
                    sections.push(`  Description: ${s.description}`);
                sections.push(`  Severity: ${s.severity}`);
                sections.push(`  Frequency: ${s.frequency}`);
                if (s.impact)
                    sections.push(`  Impact: ${s.impact}`);
                if (s.management)
                    sections.push(`  Management: ${s.management}`);
                if (s.triggers?.length)
                    sections.push(`  Triggers: ${s.triggers.join(', ')}`);
            });
        }
        // Cognitive Symptoms
        if (data.symptoms.cognitive.length > 0) {
            sections.push('\nCognitive Symptoms:');
            data.symptoms.cognitive.forEach(s => {
                sections.push(`\n${s.symptom}:`);
                sections.push(`  Severity: ${s.severity}`);
                sections.push(`  Frequency: ${s.frequency}`);
                if (s.impact)
                    sections.push(`  Impact: ${s.impact}`);
                if (s.management)
                    sections.push(`  Management: ${s.management}`);
            });
        }
        // Emotional Symptoms
        if (data.symptoms.emotional.length > 0) {
            sections.push('\nEmotional Symptoms:');
            data.symptoms.emotional.forEach(s => {
                sections.push(`\n${s.symptom}:`);
                sections.push(`  Severity: ${s.severity}`);
                sections.push(`  Frequency: ${s.frequency}`);
                if (s.impact)
                    sections.push(`  Impact: ${s.impact}`);
                if (s.management)
                    sections.push(`  Management: ${s.management}`);
                if (s.triggers?.length)
                    sections.push(`  Triggers: ${s.triggers.join(', ')}`);
            });
        }
        // Analysis section
        sections.push('\nAnalysis:');
        sections.push('Symptom Distribution:');
        const severityGroups = lodash_1.default.groupBy(this.allSymptoms(data.symptoms), 'severity');
        Object.entries(severityGroups).forEach(([severity, symptoms]) => {
            sections.push(`- ${severity}: ${symptoms.length} symptom(s)`);
        });
        // Pattern Analysis
        const significantImpacts = Object.entries(data.patterns.impacts)
            .filter(([_, symptoms]) => symptoms.length > 1);
        if (significantImpacts.length > 0) {
            sections.push('\nCommon Impacts:');
            significantImpacts.forEach(([impact, symptoms]) => {
                sections.push(`- ${impact} affects: ${symptoms.join(', ')}`);
            });
        }
        return sections.join('\n');
    }
}
exports.SymptomIntegrationAgent = SymptomIntegrationAgent;
