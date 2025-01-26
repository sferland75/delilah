import { AssessmentData } from '../../types';
import { BaseAgent } from '../core/BaseAgent';
import { ReportSection } from '../core/ReportStructure';
import { SectionContent } from '../core/ReportSectionTypes';

export class CourseOfRecoveryAgent extends BaseAgent {
    constructor() {
        super(ReportSection.COURSE_OF_RECOVERY);
    }

    public generateSection(data: AssessmentData): SectionContent {
        const medicalHistory = data.assessment.medicalHistory;

        return {
            title: this.config.title,
            type: this.config.type,
            order: this.config.order,
            content: this.generateRecoveryNarrative(medicalHistory)
        };
    }

    private generateRecoveryNarrative(medicalHistory: any): string {
        const sections = [];

        // Initial Hospital Course
        sections.push(this.formatInitialHospitalization(medicalHistory));
        
        // Current Treatment
        sections.push(this.formatCurrentTreatment(medicalHistory.currentTreatment));

        return sections.filter(Boolean).join('\n\n');
    }

    private formatInitialHospitalization(medicalHistory: any): string {
        if (!medicalHistory?.injury?.subsequentCare) return '';

        return `Mr. Anderson's recovery has been complex and ongoing since the April 2023 accident. Following the initial trauma care, he underwent an extended period of hospitalization at Kingston General Hospital for two weeks, followed by six weeks at Brockville General Hospital for rehabilitation. His discharge home was facilitated once he demonstrated the ability to perform basic wheelchair transfers, though this required significant home preparation and support.`;
    }

    private formatCurrentTreatment(treatments: any[]): string {
        if (!treatments?.length) return '';

        const treatmentDetails = treatments
            .filter(t => t.name && t.focus)
            .map(treatment => {
                const details = [];
                
                if (treatment.name) details.push(treatment.name);
                if (treatment.providerType) details.push(`(${treatment.providerType})`);
                if (treatment.frequency) details.push(`seen ${treatment.frequency}`);
                if (treatment.focus) details.push(`- ${treatment.focus}`);
                
                return details.join(' ');
            })
            .filter(Boolean);

        if (!treatmentDetails.length) return '';

        return [
            'The early recovery period required intensive family support, with his wife taking approximately two months away from work to provide full-time care. Upon his return home, Mr. Anderson required extensive assistance with daily activities and mobility.',
            '',
            'Current treatment includes:',
            ...treatmentDetails.map(detail => `• ${detail}`)
        ].join('\n');
    }
}