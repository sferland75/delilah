"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseFormatting = void 0;
class BaseFormatting {
    constructor(sectionTitle) {
        this.sectionTitle = sectionTitle;
    }
    formatHeader(level) {
        return `${this.sectionTitle} (${level} format)\n`;
    }
    formatField(label, value) {
        if (value === undefined || value === null)
            return '';
        return `${label}: ${value}\n`;
    }
    formatList(items) {
        if (!items || items.length === 0)
            return '';
        return items.join('\n- ');
    }
    formatParagraph(text) {
        if (!text)
            return '';
        return `${text}\n`;
    }
}
exports.BaseFormatting = BaseFormatting;
