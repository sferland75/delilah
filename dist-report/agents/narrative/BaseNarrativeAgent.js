"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseNarrativeAgent = void 0;
/**
 * Abstract base class for narrative generation
 * Provides structure for generating clinical narratives from assessment data
 */
class BaseNarrativeAgent {
    /**
     * Generates a complete narrative section from assessment data
     * @param data Complete assessment data
     * @returns Formatted clinical narrative
     */
    generateNarrative(data) {
        const overview = this.generateOverview(data);
        const detailedAnalysis = this.generateDetailedAnalysis(data);
        const implications = this.generateImplications(data);
        return [overview, detailedAnalysis, implications]
            .filter(section => section) // Remove empty sections
            .join('\n\n');
    }
    /**
     * Utility method to format clinical measurements
     * @param value Numeric value
     * @param unit Unit of measurement
     */
    formatMeasurement(value, unit) {
        return `${value} ${unit}`;
    }
    /**
     * Utility method to create sentence lists
     * @param items Array of items to list
     * @param conjunction Joining word (default: "and")
     */
    createList(items, conjunction = 'and') {
        if (items.length === 0)
            return '';
        if (items.length === 1)
            return items[0];
        if (items.length === 2)
            return `${items[0]} ${conjunction} ${items[1]}`;
        const lastItem = items[items.length - 1];
        const previousItems = items.slice(0, -1).join(', ');
        return `${previousItems}, ${conjunction} ${lastItem}`;
    }
    /**
     * Utility method to ensure clinical terminology is used consistently
     * @param term Term to format
     */
    formatClinicalTerm(term) {
        // Add common clinical term formatting rules here
        return term.trim();
    }
}
exports.BaseNarrativeAgent = BaseNarrativeAgent;
