import { AssessmentData } from '../../types';
import { BaseAgent } from '../core/BaseAgent';
import { ReportSection } from '../core/ReportStructure';
import { SectionContent } from '../core/ReportSectionTypes';

export class MechanismOfInjuryAgent extends BaseAgent {
    constructor() {
        super(ReportSection.MECHANISM_OF_INJURY);
    }

    public generateSection(data: AssessmentData): SectionContent {
        const injury = data.assessment.medicalHistory.injury;

        return {
            title: this.config.title,
            type: this.config.type,
            order: this.config.order,
            content: this.generateInjuryNarrative(injury)
        };
    }

    private generateInjuryNarrative(injury: any): string {
        if (!injury) return '';

        const sections = [];

        // Circumstances
        if (injury.circumstance) {
            sections.push(
                `The subject accident occurred on April 28, 2023, when ${injury.circumstance}`
            );
        }

        // Immediate response
        if (injury.immediateResponse) {
            sections.push(
                `Following the collision, ${injury.immediateResponse}`
            );
        }

        // Subsequent care
        if (injury.subsequentCare) {
            sections.push(injury.subsequentCare);
        }

        return sections.filter(Boolean).join('\n\n');
    }
}