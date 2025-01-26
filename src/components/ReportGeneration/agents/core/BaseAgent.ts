import { AssessmentData } from '../../types';
import { ReportSection, getSectionConfig, SectionConfig } from './ReportStructure';
import { ReportSectionType, SectionContent } from './ReportSectionTypes';

export abstract class BaseAgent {
    protected section: ReportSection;
    protected config: SectionConfig;

    constructor(section: ReportSection) {
        this.section = section;
        this.config = getSectionConfig(section);
    }

    /**
     * Main method to generate report section content
     */
    public abstract generateSection(data: AssessmentData): SectionContent;

    /**
     * Format structured data into report format
     */
    protected formatStructuredData(data: Record<string, any>): Record<string, any> {
        return data;
    }

    /**
     * Generate clinical observations with data integration
     */
    protected generateModerateNarrative(data: Record<string, any>): string {
        return '';
    }

    /**
     * Generate complex clinical analysis
     */
    protected generateFullNarrative(data: Record<string, any>): string {
        return '';
    }

    /**
     * Clinical measurement formatting
     */
    protected formatClinicalValue(value: any, unit?: string): string {
        if (!value) return 'Not assessed';
        return unit ? `${value} ${unit}` : value.toString();
    }

    /**
     * Create clinical lists with proper formatting
     */
    protected formatClinicalList(items: string[]): string {
        if (!items?.length) return '';
        if (items.length === 1) return items[0];
        
        const lastItem = items[items.length - 1];
        const otherItems = items.slice(0, -1);
        return `${otherItems.join(', ')} and ${lastItem}`;
    }

    /**
     * Format dates in clinical report style
     */
    protected formatClinicalDate(date: string | Date): string {
        if (!date) return '';
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
    protected validateContent(content: any): boolean {
        switch (this.config.type) {
            case ReportSectionType.STRUCTURED:
                return typeof content === 'object';
            case ReportSectionType.MODERATE_NARRATIVE:
            case ReportSectionType.FULL_NARRATIVE:
                return typeof content === 'string';
            default:
                return true;
        }
    }
}