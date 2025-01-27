"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseSymptomAgent = void 0;
const BaseAgent_1 = require("../BaseAgent");
class BaseSymptomAgent extends BaseAgent_1.BaseAgent {
    constructor(context, orderNumber, sectionTitle) {
        super(context, orderNumber, sectionTitle);
        this.sectionTitle = sectionTitle;
    }
    formatBrief(data) {
        if (data.symptoms.length === 0) {
            return `No ${this.sectionTitle.toLowerCase()} reported`;
        }
        const sections = [`${this.sectionTitle}:`];
        data.symptoms.forEach(s => {
            sections.push(`- ${s.symptom} (${s.severity})`);
        });
        return sections.join('\n');
    }
    formatStandard(data) {
        if (data.symptoms.length === 0) {
            return `No ${this.sectionTitle.toLowerCase()} reported`;
        }
        const sections = [`${this.sectionTitle}:`];
        data.symptoms.forEach(s => {
            sections.push(`\n${s.symptom}:`);
            sections.push(`  Severity: ${s.severity}`);
            sections.push(`  Frequency: ${s.frequency}`);
            if (s.impact) {
                sections.push(`  Impact: ${s.impact}`);
            }
        });
        return sections.join('\n');
    }
    formatDetailed(data) {
        if (data.symptoms.length === 0) {
            return `No ${this.sectionTitle.toLowerCase()} reported`;
        }
        const sections = [`${this.sectionTitle} - Detailed Assessment:`];
        data.symptoms.forEach(s => {
            sections.push(`\n${s.symptom}:`);
            sections.push(`  Severity: ${s.severity}`);
            sections.push(`  Frequency: ${s.frequency}`);
            if (s.impact) {
                sections.push(`  Impact: ${s.impact}`);
            }
            if (s.management) {
                sections.push(`  Management: ${s.management}`);
            }
            if (s.notes) {
                sections.push(`  Additional Notes: ${s.notes}`);
            }
        });
        return sections.join('\n');
    }
}
exports.BaseSymptomAgent = BaseSymptomAgent;
