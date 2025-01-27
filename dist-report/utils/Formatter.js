"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportFormatter = void 0;
class ReportFormatter {
    formatSection(title, content) {
        const sections = [
            this.formatTitle(title),
            this.formatContent(content),
            '' // Add blank line after each section
        ];
        return sections.join('\n');
    }
    formatTitle(title) {
        const line = '='.repeat(title.length);
        return `${title}\n${line}`;
    }
    formatContent(content) {
        if (typeof content === 'string') {
            return content;
        }
        if (Array.isArray(content)) {
            return content.join('\n');
        }
        if (typeof content === 'object') {
            return JSON.stringify(content, null, 2);
        }
        return String(content);
    }
}
exports.ReportFormatter = ReportFormatter;
