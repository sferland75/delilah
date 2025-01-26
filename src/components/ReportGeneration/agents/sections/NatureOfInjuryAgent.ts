import { AssessmentData } from '../../types';
import { BaseAgent } from '../core/BaseAgent';
import { ReportSection } from '../core/ReportStructure';
import { SectionContent } from '../core/ReportSectionTypes';

export class NatureOfInjuryAgent extends BaseAgent {
    constructor() {
        super(ReportSection.NATURE_OF_INJURY);
    }

    public generateSection(data: AssessmentData): SectionContent {
        const injuries = this.extractInjuries(data);

        return {
            title: this.config.title,
            type: this.config.type,
            order: this.config.order,
            content: this.generateInjuryNarrative(injuries)
        };
    }

    private extractInjuries(data: AssessmentData): any[] {
        // This would ideally come from a structured injuries section
        // For now, extracting from symptoms and medical history
        const injuries = [];
        
        const symptoms = data.assessment.symptoms?.physical || [];
        const medicalHistory = data.assessment.medicalHistory;

        // Add injuries from symptoms
        symptoms.forEach(symptom => {
            injuries.push({
                location: symptom.location,
                type: symptom.painType,
                severity: symptom.severity
            });
        });

        // Add surgeries/treatments
        if (medicalHistory.surgeries) {
            injuries.push({
                description: medicalHistory.surgeries
            });
        }

        return injuries;
    }

    private generateInjuryNarrative(injuries: any[]): string {
        if (!injuries.length) return '';

        return `The collision resulted in multiple severe traumatic injuries. These included ${this.formatInjuryList(injuries)}. Initial medical assessment and treatment included immediate stabilization and imaging studies. Surgical intervention was undertaken to address the most severe injuries.`;
    }

    private formatInjuryList(injuries: any[]): string {
        const formattedInjuries = injuries.map(injury => {
            if (injury.description) return injury.description;
            
            const parts = [injury.location];
            if (injury.type) parts.push(injury.type.toLowerCase());
            if (injury.severity) parts.push(`(${injury.severity.toLowerCase()})`);
            
            return parts.join(' ');
        });

        return this.formatClinicalList(formattedInjuries);
    }
}