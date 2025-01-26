import { AssessmentData } from '../../types';
import { BaseAgent } from '../core/BaseAgent';
import { ReportSection } from '../core/ReportStructure';
import { SectionContent } from '../core/ReportSectionTypes';

export class CurrentMedicationsAgent extends BaseAgent {
    constructor() {
        super(ReportSection.CURRENT_MEDICATIONS);
    }

    public generateSection(data: AssessmentData): SectionContent {
        const medications = data.assessment.medicalHistory?.medications || [];

        return {
            title: this.config.title,
            type: this.config.type,
            order: this.config.order,
            content: {
                medications: medications.map(med => ({
                    name: med.name,
                    dosage: med.dosage,
                    frequency: med.frequency,
                    purpose: med.purpose,
                    formattedText: this.formatMedication(med)
                }))
            }
        };
    }

    private formatMedication(med: any): string {
        const parts = [];
        
        if (med.name) parts.push(med.name);
        if (med.dosage) parts.push(med.dosage);
        if (med.frequency) parts.push(med.frequency);
        if (med.purpose) parts.push(`for ${med.purpose}`);

        return parts.join(' ');
    }
}