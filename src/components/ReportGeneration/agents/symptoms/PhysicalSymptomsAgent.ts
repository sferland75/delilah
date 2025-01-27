import { Assessment } from '../../../../types';
import { AgentContext, ReportSection, ReportSectionType } from '../../../../types/report';
import { BaseAgent } from '../BaseAgent';

export class PhysicalSymptomsAgent extends BaseAgent {
    constructor(context: AgentContext) {
        super(context);
        this.priority = 3;
        this.name = 'PhysicalSymptomsAgent';
        this.dataKeys = ['symptoms'];
    }

    async processData(data: Assessment): Promise<any> {
        return data.assessment.symptoms;
    }

    protected formatBrief(symptoms: any): string {
        const sections = ['Physical Symptoms Summary:'];

        if (symptoms.physical?.length) {
            const mainSymptoms = symptoms.physical.map((s: any) => 
                `${s.location} (${s.severity})`
            ).join(', ');
            sections.push(`Primary symptoms: ${mainSymptoms}`);
        }

        return sections.join('\n');
    }

    protected formatStandard(symptoms: any): string {
        const sections = ['Physical Symptoms Assessment:'];

        if (symptoms.physical?.length) {
            sections.push('\nReported Symptoms:');
            symptoms.physical.forEach((symptom: any) => {
                sections.push(`  Location: ${symptom.location}`);
                sections.push(`  Pain Type: ${symptom.painType}`);
                sections.push(`  Severity: ${symptom.severity}`);
                sections.push(`  Frequency: ${symptom.frequency}`);
                sections.push('');
            });
        }

        return sections.join('\n');
    }

    protected formatDetailed(symptoms: any): string {
        const sections = ['Physical Symptoms (Detailed Assessment):'];

        if (symptoms.physical?.length) {
            sections.push('\nReported Symptoms:');
            symptoms.physical.forEach((symptom: any) => {
                sections.push(`  Location: ${symptom.location}`);
                sections.push(`  Pain Type: ${symptom.painType}`);
                sections.push(`  Severity: ${symptom.severity}`);
                sections.push(`  Frequency: ${symptom.frequency}`);
                sections.push(`  Aggravating Factors: ${symptom.aggravating}`);
                sections.push(`  Relieving Factors: ${symptom.relieving}`);
                sections.push('');
            });
        }

        if (symptoms.cognitive?.length) {
            sections.push('\nCognitive Symptoms:');
            symptoms.cognitive.forEach((symptom: any) => {
                sections.push(`  Symptom: ${symptom.symptom}`);
                sections.push(`  Severity: ${symptom.severity}`);
                sections.push(`  Frequency: ${symptom.frequency}`);
                sections.push(`  Impact: ${symptom.impact}`);
                sections.push(`  Management: ${symptom.management}`);
                sections.push('');
            });
        }

        if (symptoms.emotional?.length) {
            sections.push('\nEmotional/Psychological Symptoms:');
            symptoms.emotional.forEach((symptom: any) => {
                sections.push(`  Symptom: ${symptom.symptom}`);
                sections.push(`  Severity: ${symptom.severity}`);
                sections.push(`  Frequency: ${symptom.frequency}`);
                sections.push(`  Impact: ${symptom.impact}`);
                sections.push(`  Management: ${symptom.management}`);
                sections.push('');
            });
        }

        if (symptoms.generalNotes) {
            sections.push('\nAdditional Notes:');
            sections.push(symptoms.generalNotes);
        }

        return sections.join('\n');
    }

    async generateSection(data: Assessment): Promise<ReportSection> {
        const processedData = await this.processData(data);
        const content = await this.getFormattedContent(
            processedData,
            this.context.config.detailLevel
        );

        return {
            title: 'Symptoms Assessment',
            type: ReportSectionType.SYMPTOMS,
            orderNumber: this.priority,
            content
        };
    }
}