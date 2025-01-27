"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportTemplate = void 0;
const ReportStructure_1 = require("../agents/core/ReportStructure");
class ReportTemplate {
    formatSection(content) {
        switch (content.type) {
            case ReportStructure_1.ReportSectionType.STRUCTURED:
                return this.formatStructuredSection(content);
            case ReportStructure_1.ReportSectionType.MODERATE_NARRATIVE:
            case ReportStructure_1.ReportSectionType.FULL_NARRATIVE:
                return this.formatNarrativeSection(content);
            default:
                return this.formatDefaultSection(content);
        }
    }
    formatStructuredSection(content) {
        const sections = [];
        sections.push(this.formatHeader(content.title));
        if (typeof content.content === 'object') {
            Object.entries(content.content).forEach(([key, value]) => {
                if (value && typeof value === 'object') {
                    sections.push(this.formatStructuredTable(key, value));
                }
            });
        }
        return sections.join('\n\n');
    }
    formatNarrativeSection(content) {
        const sections = [];
        sections.push(this.formatHeader(content.title));
        if (typeof content.content === 'string') {
            sections.push(content.content);
        }
        return sections.join('\n\n');
    }
    formatDefaultSection(content) {
        return [
            this.formatHeader(content.title),
            typeof content.content === 'string' ?
                content.content :
                JSON.stringify(content.content, null, 2)
        ].join('\n\n');
    }
    formatHeader(title) {
        return `${title}\n${'-'.repeat(title.length)}`;
    }
    formatStructuredTable(title, data) {
        const rows = Object.entries(data).map(([key, value]) => {
            const label = key.replace(/([A-Z])/g, ' $1')
                .replace(/^./, str => str.toUpperCase());
            return `${label}: ${this.formatValue(value)}`;
        });
        return rows.join('\n');
    }
    formatValue(value) {
        if (value === null || value === undefined)
            return '';
        if (typeof value === 'object')
            return JSON.stringify(value);
        return value.toString();
    }
}
exports.ReportTemplate = ReportTemplate;
