import { SectionContent } from '../agents/core/ReportSectionTypes';
import { ReportSectionType } from '../agents/core/ReportStructure';

export class ReportTemplate {
    formatSection(content: SectionContent): string {
        switch (content.type) {
            case ReportSectionType.STRUCTURED:
                return this.formatStructuredSection(content);
            case ReportSectionType.MODERATE_NARRATIVE:
            case ReportSectionType.FULL_NARRATIVE:
                return this.formatNarrativeSection(content);
            default:
                return this.formatDefaultSection(content);
        }
    }

    private formatStructuredSection(content: SectionContent): string {
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

    private formatNarrativeSection(content: SectionContent): string {
        const sections = [];
        
        sections.push(this.formatHeader(content.title));
        
        if (typeof content.content === 'string') {
            sections.push(content.content);
        }

        return sections.join('\n\n');
    }

    private formatDefaultSection(content: SectionContent): string {
        return [
            this.formatHeader(content.title),
            typeof content.content === 'string' ? 
                content.content : 
                JSON.stringify(content.content, null, 2)
        ].join('\n\n');
    }

    private formatHeader(title: string): string {
        return `${title}\n${'-'.repeat(title.length)}`;
    }

    private formatStructuredTable(title: string, data: Record<string, any>): string {
        const rows = Object.entries(data).map(([key, value]) => {
            const label = key.replace(/([A-Z])/g, ' $1')
                .replace(/^./, str => str.toUpperCase());
            return `${label}: ${this.formatValue(value)}`;
        });

        return rows.join('\n');
    }

    private formatValue(value: any): string {
        if (value === null || value === undefined) return '';
        if (typeof value === 'object') return JSON.stringify(value);
        return value.toString();
    }
}