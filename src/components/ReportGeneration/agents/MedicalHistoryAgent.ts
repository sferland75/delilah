import { Assessment } from '../../../types';
import { AgentContext, ReportSection, ReportSectionType } from '../../../types/report';
import { BaseAgent } from './BaseAgent';
import { MedicationAnalyzer } from '../narrative/MedicationAnalyzer';

export class MedicalHistoryAgent extends BaseAgent {
    constructor(context: AgentContext) {
        super(context);
        this.priority = 2;
        this.name = 'MedicalHistoryAgent';
        this.dataKeys = ['medicalHistory'];
    }

    async processData(data: Assessment): Promise<any> {
        return data.assessment.medicalHistory;
    }

    protected formatBrief(data: any): string {
        const sections = ['Medical History Summary'];
        
        // Analyze medication patterns
        if (data.medications?.length) {
            const patterns = MedicationAnalyzer.analyzeMedications(data.medications);
            sections.push('\nMedication Profile:');
            patterns.forEach(pattern => {
                if (pattern.clinicalSignificance) {
                    sections.push(`  ${pattern.clinicalSignificance}`);
                }
            });
        }

        // Injury summary
        if (data.injury) {
            sections.push('\nInjury Profile:');
            sections.push(`  ${this.formatInjuryNarrative(data.injury)}`);
        }

        return sections.join('\n');
    }

    protected formatStandard(data: any): string {
        const sections = ['Medical History Assessment'];

        // Comprehensive medication analysis
        if (data.medications?.length) {
            const patterns = MedicationAnalyzer.analyzeMedications(data.medications);
            sections.push('\nMedication Management:');
            patterns.forEach(pattern => {
                if (pattern.medications.length > 0) {
                    sections.push(`\n${this.capitalizeFirst(pattern.category)} Management:`);
                    sections.push(`  Clinical Significance: ${pattern.clinicalSignificance}`);
                    pattern.medications.forEach(med => {
                        sections.push(`  - ${med.name} (${med.dosage}, ${med.frequency})`);
                    });
                    if (pattern.implications.length > 0) {
                        sections.push('  Functional Implications:');
                        pattern.implications.forEach(imp => {
                            sections.push(`    • ${imp}`);
                        });
                    }
                }
            });
        }

        // Detailed injury analysis
        if (data.injury) {
            sections.push('\nInjury Analysis:');
            sections.push(this.formatDetailedInjuryNarrative(data.injury));
            if (data.currentTreatment?.length) {
                sections.push('\nTreatment Response:');
                sections.push(this.analyzeTreatmentResponse(data.currentTreatment));
            }
        }

        return sections.join('\n');
    }

    protected formatDetailed(data: any): string {
        const sections = this.formatStandard(data);
        const additionalDetails: string[] = [];

        if (data.preExisting) {
            additionalDetails.push('\nPre-existing Conditions & Impact:');
            additionalDetails.push(this.analyzePreExistingConditions(data.preExisting));
        }

        if (data.surgeries) {
            additionalDetails.push('\nSurgical History & Implications:');
            additionalDetails.push(this.analyzeSurgicalHistory(data.surgeries));
        }

        return sections + '\n' + additionalDetails.join('\n');
    }

    private formatInjuryNarrative(injury: any): string {
        return `${injury.circumstance} Initial presentation included ${injury.immediateResponse.toLowerCase()}. ` +
               `Subsequent care involved ${injury.subsequentCare.toLowerCase()}.`;
    }

    private formatDetailedInjuryNarrative(injury: any): string {
        const narrativePoints = [
            `Mechanism of Injury: ${injury.circumstance}`,
            `Initial Response: ${injury.immediateResponse}`,
            `Care Progression: ${injury.subsequentCare}`,
            `Current Status: ${this.analyzeCurrentStatus(injury)}`
        ];

        return narrativePoints.join('\n  • ');
    }

    private analyzeCurrentStatus(injury: any): string {
        // This would be expanded based on comparing initial vs current symptoms
        // and treatment response patterns
        return 'Currently undergoing active treatment and monitoring';
    }

    private analyzeTreatmentResponse(treatments: any[]): string {
        const responsePatterns = treatments.map(treatment => {
            return `${treatment.name} (${treatment.providerType}): ` +
                   `${treatment.frequency} sessions focusing on ${treatment.focus.toLowerCase()}. ` +
                   `Progress noted as ${treatment.progress.toLowerCase()}.`;
        });

        return responsePatterns.join('\n  • ');
    }

    private analyzePreExistingConditions(conditions: string): string {
        // This would be expanded to identify interaction patterns between
        // pre-existing conditions and current presentation
        return `  ${conditions}\n  Clinical Impact: Requires ongoing monitoring and consideration during treatment planning.`;
    }

    private analyzeSurgicalHistory(surgeries: string): string {
        // This would be expanded to analyze surgical outcomes and current functional impacts
        return `  ${surgeries}\n  Functional Considerations: May influence treatment approach and recovery expectations.`;
    }

    private capitalizeFirst(str: string): string {
        return str.charAt(0).toUpperCase() + str.slice(1).replace('_', ' ');
    }
}