import { AssessmentData } from '../../types';
import { BaseAgent } from '../core/BaseAgent';
import { ReportSection } from '../core/ReportStructure';
import { SectionContent } from '../core/ReportSectionTypes';

export class MedicalHistoryAgent extends BaseAgent {
    constructor() {
        super(ReportSection.PRE_ACCIDENT_HISTORY);
    }

    public generateSection(data: AssessmentData): SectionContent {
        const medicalHistory = data.assessment.medicalHistory;

        const narrative = [
            this.formatPreExistingConditions(medicalHistory.preExisting),
            this.formatMedications(medicalHistory.medications),
            this.formatInjuryDetails(medicalHistory.injury),
            this.formatTreatmentHistory(medicalHistory.currentTreatment)
        ].filter(Boolean).join('\n\n');

        return {
            title: this.config.title,
            type: this.config.type,
            order: this.config.order,
            content: narrative
        };
    }

    private formatPreExistingConditions(conditions: string): string {
        if (!conditions) return '';
        return `Prior to the subject accident, the client's medical history included: ${conditions}`;
    }

    private formatMedications(medications: any[]): string {
        if (!medications?.length) return '';

        const medList = medications.map(med => {
            return `${med.name} ${med.dosage} ${med.frequency}${med.purpose ? ` for ${med.purpose}` : ''}`;
        });

        return `Current medications include: ${this.formatClinicalList(medList)}.`;
    }

    private formatInjuryDetails(injury: any): string {
        if (!injury) return '';

        const sections = [];

        if (injury.circumstance) {
            sections.push(`Injury Circumstance: ${injury.circumstance}`);
        }

        if (injury.immediateResponse) {
            sections.push(`Immediate Response: ${injury.immediateResponse}`);
        }

        if (injury.subsequentCare) {
            sections.push(`Subsequent Care: ${injury.subsequentCare}`);
        }

        return sections.join('\n\n');
    }

    private formatTreatmentHistory(treatments: any[]): string {
        if (!treatments?.length) return '';

        const currentProviders = treatments
            .filter(t => t.name && t.providerType)
            .map(t => {
                const details = [
                    t.name,
                    t.providerType,
                    t.frequency,
                    t.focus
                ].filter(Boolean);
                return details.join(' - ');
            });

        if (!currentProviders.length) return '';
        
        return 'Current treatment providers include:\n' + 
            currentProviders.map(p => `• ${p}`).join('\n');
    }
}