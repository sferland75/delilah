"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseAgent = void 0;
const ReportStructure_1 = require("./ReportStructure");
const ReportSectionTypes_1 = require("./ReportSectionTypes");
class BaseAgent {
    constructor(section) {
        this.section = section;
        this.config = (0, ReportStructure_1.getSectionConfig)(section);
    }
    /**
     * Format structured data into report format
     */
    formatStructuredData(data) {
        return data;
    }
    /**
     * Generate clinical observations with data integration
     */
    generateModerateNarrative(data) {
        return '';
    }
    /**
     * Generate complex clinical analysis
     */
    generateFullNarrative(data) {
        return '';
    }
    /**
     * Clinical measurement formatting
     */
    formatClinicalValue(value, unit) {
        if (!value)
            return 'Not assessed';
        return unit ? `${value} ${unit}` : value.toString();
    }
    /**
     * Create clinical lists with proper formatting
     */
    formatClinicalList(items) {
        if (!items?.length)
            return '';
        if (items.length === 1)
            return items[0];
        const lastItem = items[items.length - 1];
        const otherItems = items.slice(0, -1);
        return `${otherItems.join(', ')} and ${lastItem}`;
    }
    /**
     * Format dates in clinical report style
     */
    formatClinicalDate(date) {
        if (!date)
            return '';
        const d = new Date(date);
        return d.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
    /**
     * Validate section content matches expected type
     */
    validateContent(content) {
        switch (this.config.type) {
            case ReportSectionTypes_1.ReportSectionType.STRUCTURED:
                return typeof content === 'object';
            case ReportSectionTypes_1.ReportSectionType.MODERATE_NARRATIVE:
            case ReportSectionTypes_1.ReportSectionType.FULL_NARRATIVE:
                return typeof content === 'string';
            default:
                return true;
        }
    }
}
exports.BaseAgent = BaseAgent;
