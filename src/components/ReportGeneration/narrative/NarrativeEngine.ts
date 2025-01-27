import { Assessment, AssessmentData } from '../../../types/report';
import { AgentContext } from '../../../types/report';
import { MedicationAnalyzer } from './MedicationAnalyzer';
import { SymptomAnalyzer } from './SymptomAnalyzer';
import { TemporalAnalyzer } from './TemporalAnalyzer';
import { ADLAnalyzer } from './ADLAnalyzer';

interface NarrativeContext {
    clientName: string;
    timeline: any;
    symptoms: any[];
    medications: any[];
    adlPatterns: any[];
    functionalStatus: string;
}

export class NarrativeEngine {
    private context: AgentContext;
    private narrativeContext: NarrativeContext | null = null;

    constructor(context: AgentContext) {
        this.context = context;
    }

    async generateNarrative(data: Assessment | AssessmentData | undefined | null, section: string): Promise<string> {
        if (!data) {
            return 'No data available for narrative generation';
        }

        // Handle both AssessmentData and raw Assessment
        const assessment: Assessment = 'raw' in data ? data.raw : data;

        try {
            // Initialize narrative context if not already done
            if (!this.narrativeContext) {
                this.narrativeContext = await this.buildNarrativeContext(assessment);
            }

            switch (section.toLowerCase()) {
                case 'overview':
                    return this.generateOverviewNarrative();
                case 'medicalhistory':
                    return this.generateMedicalNarrative(assessment.medicalHistory);
                case 'symptoms':
                    return this.generateSymptomNarrative(assessment.symptoms);
                case 'functional':
                    return this.generateFunctionalNarrative(assessment.adl);
                default:
                    return this.generateSectionNarrative(section, assessment);
            }
        } catch (error) {
            console.warn('Error in narrative generation:', error);
            return `Unable to generate narrative for ${section}`;
        }
    }

    private async buildNarrativeContext(data: Assessment): Promise<NarrativeContext> {
        if (!data || !data.demographics) {
            throw new Error('Invalid assessment data structure');
        }

        const demographics = data.demographics;
        const timeline = TemporalAnalyzer.analyzeTimeline(data);
        const symptoms = data.symptoms?.physical ? 
            SymptomAnalyzer.analyzeSymptoms(data.symptoms.physical) : [];
        const adlPatterns = data.adl ? 
            ADLAnalyzer.analyzeADLPerformance(data.adl, data.symptoms?.physical || []) : [];

        return {
            clientName: `${demographics.firstName} ${demographics.lastName}`,
            timeline,
            symptoms,
            medications: data.medicalHistory?.medications || [],
            adlPatterns,
            functionalStatus: this.determineFunctionalStatus(adlPatterns)
        };
    }

    private generateOverviewNarrative(): string {
        if (!this.narrativeContext) return 'Overview information not available';
        const ctx = this.narrativeContext;

        return `
${ctx.clientName} presents with ${this.summarizeSymptoms(ctx.symptoms)}. 
${ctx.timeline?.clinicalContext || ''}

Current functional status indicates ${ctx.functionalStatus}. 
${this.generateMedicationSummary(ctx.medications)}

${this.generateFunctionalSummary(ctx.adlPatterns)}
        `.trim();
    }

    private generateMedicalNarrative(medicalHistory: any): string {
        if (!medicalHistory) return 'No medical history information available';
        
        const narrativeBlocks: string[] = [];

        if (medicalHistory.medications?.length) {
            const medicationPatterns = MedicationAnalyzer.analyzeMedications(medicalHistory.medications);
            narrativeBlocks.push(
                "Current medications include: " + 
                medicalHistory.medications.map((m: any) => m.name).join(", ")
            );
        }

        if (medicalHistory.currentTreatment?.length) {
            narrativeBlocks.push(
                "Current treatment includes: " +
                medicalHistory.currentTreatment.map((t: any) => 
                    `${t.name} (${t.providerType})`
                ).join(", ")
            );
        }

        return narrativeBlocks.join('\n\n') || 'No current medical treatments documented';
    }

    private generateSymptomNarrative(symptoms: any): string {
        if (!symptoms?.physical?.length) return 'No significant symptoms reported';
        
        const summaries = symptoms.physical.map((s: any) => 
            `${s.location} (${s.severity})`
        );

        return `Current symptoms include: ${summaries.join(", ")}`;
    }

    private generateFunctionalNarrative(adl: any): string {
        if (!adl) return 'No functional assessment data available';
        
        const sections = [];
        
        if (adl.feeding) {
            sections.push(`Feeding: ${adl.feeding.independence}`);
        }
        if (adl.bathing) {
            sections.push(`Bathing: ${adl.bathing.independence}`);
        }
        if (adl.dressing) {
            sections.push(`Dressing: ${adl.dressing.independence}`);
        }

        return sections.join('\n') || 'No specific ADL information documented';
    }

    private generateSectionNarrative(section: string, data: any): string {
        return `${section} information available`;
    }

    private summarizeSymptoms(symptoms: any[]): string {
        if (!symptoms?.length) return 'no reported symptoms';
        
        return symptoms
            .map(s => `${s.severity} ${s.location}`)
            .join(', ');
    }

    private determineFunctionalStatus(patterns: any[]): string {
        if (!patterns?.length) return 'baseline functional status';
        
        const independenceLevels = patterns.map(p => p.independenceLevel || 'unknown');
        const requiresAssistance = independenceLevels.filter(
            level => level.toLowerCase().includes('assistance')
        ).length;

        if (requiresAssistance === 0) {
            return 'maintained independence in most activities';
        } else if (requiresAssistance < patterns.length / 2) {
            return 'modified independence with some activities requiring assistance';
        } else {
            return 'requires assistance with multiple activities';
        }
    }

    private generateMedicationSummary(medications: any[]): string {
        if (!medications?.length) return 'No current medications reported';
        
        return `Current medications: ${medications.map(m => m.name).join(', ')}.`;
    }

    private generateFunctionalSummary(patterns: any[]): string {
        if (!patterns?.length) return '';

        const limitations = patterns
            .filter(p => p.limitations?.length)
            .map(p => p.limitations[0]);

        if (!limitations.length) return '';

        return `Key functional limitations: ${limitations.join(', ')}.`;
    }
}