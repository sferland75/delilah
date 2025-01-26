import { AssessmentData } from '../../types';
import { BaseAgent } from '../core/BaseAgent';
import { ReportSection } from '../core/ReportStructure';
import { SectionContent } from '../core/ReportSectionTypes';

export class DocumentationAgent extends BaseAgent {
    constructor() {
        super(ReportSection.DOCUMENTATION);
    }

    public generateSection(data: AssessmentData): SectionContent {
        const documentation = data.assessment.documentation;

        return {
            title: this.config.title,
            type: this.config.type,
            order: this.config.order,
            content: {
                medicalDocumentation: this.formatDocumentList(
                    'Medical Documentation',
                    documentation.medicalDocumentation
                ),
                legalDocumentation: this.formatDocumentList(
                    'Legal Documentation',
                    documentation.legalDocumentation
                )
            }
        };
    }

    private formatDocumentList(type: string, docs: any[]): any {
        if (!docs?.length) return { items: [] };

        return {
            items: docs.map((doc, index) => ({
                id: index + 1,
                description: doc
            }))
        };
    }
}