import { AssessmentData } from '../types';

/**
 * Base interface for all narrative generation agents
 */
export interface NarrativeAgent {
    generateNarrative(data: AssessmentData): string;
}

/**
 * Abstract base class for narrative generation
 * Provides structure for generating clinical narratives from assessment data
 */
export abstract class BaseNarrativeAgent implements NarrativeAgent {
    /**
     * Generates a complete narrative section from assessment data
     * @param data Complete assessment data
     * @returns Formatted clinical narrative
     */
    public generateNarrative(data: AssessmentData): string {
        const overview = this.generateOverview(data);
        const detailedAnalysis = this.generateDetailedAnalysis(data);
        const implications = this.generateImplications(data);

        return [overview, detailedAnalysis, implications]
            .filter(section => section) // Remove empty sections
            .join('\n\n');
    }

    /**
     * Generates an overview summary of the assessment area
     * @param data Assessment data
     */
    protected abstract generateOverview(data: AssessmentData): string;

    /**
     * Generates detailed analysis of assessment findings
     * @param data Assessment data
     */
    protected abstract generateDetailedAnalysis(data: AssessmentData): string;

    /**
     * Generates clinical implications and recommendations
     * @param data Assessment data
     */
    protected abstract generateImplications(data: AssessmentData): string;

    /**
     * Utility method to format clinical measurements
     * @param value Numeric value
     * @param unit Unit of measurement
     */
    protected formatMeasurement(value: number, unit: string): string {
        return `${value} ${unit}`;
    }

    /**
     * Utility method to create sentence lists
     * @param items Array of items to list
     * @param conjunction Joining word (default: "and")
     */
    protected createList(items: string[], conjunction: string = 'and'): string {
        if (items.length === 0) return '';
        if (items.length === 1) return items[0];
        if (items.length === 2) return `${items[0]} ${conjunction} ${items[1]}`;
        
        const lastItem = items[items.length - 1];
        const previousItems = items.slice(0, -1).join(', ');
        return `${previousItems}, ${conjunction} ${lastItem}`;
    }

    /**
     * Utility method to ensure clinical terminology is used consistently
     * @param term Term to format
     */
    protected formatClinicalTerm(term: string): string {
        // Add common clinical term formatting rules here
        return term.trim();
    }
}