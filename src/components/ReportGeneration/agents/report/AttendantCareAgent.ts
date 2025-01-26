import { AssessmentData } from '../types';
import { BaseReportAgent, ReportSection, ReportSectionType } from './BaseReportAgent';

export class AttendantCareAgent extends BaseReportAgent {
    protected sectionType = ReportSectionType.MODERATE_NARRATIVE;

    public generateSection(data: AssessmentData): ReportSection {
        const care = data.assessment.care;
        
        return {
            title: 'Attendant Care Requirements',
            type: this.sectionType,
            order: 6,
            content: {
                personalCare: this.analyzePersonalCare(care.personalCare),
                housekeeping: this.analyzeHousekeeping(care.housekeeping),
                mealPreparation: this.analyzeMealPrep(care.mealPreparation),
                transportation: this.analyzeTransportation(care.transportation),
                costSummary: this.formatCostSummary(care.costSummary)
            }
        };
    }

    private analyzePersonalCare(data: any): string {
        if (!data) return '';
        
        return this.generateModerateNarrative({
            type: data.type,
            frequency: data.frequency,
            provider: data.provider,
            notes: data.notes
        });
    }

    private analyzeHousekeeping(data: any): string {
        if (!data) return '';

        return this.generateModerateNarrative({
            type: data.type,
            frequency: data.frequency,
            provider: data.provider,
            notes: data.notes
        });
    }

    private analyzeMealPrep(data: any): string {
        if (!data) return '';

        return this.generateModerateNarrative({
            type: data.type,
            frequency: data.frequency,
            provider: data.provider,
            notes: data.notes
        });
    }

    private analyzeTransportation(data: any): string {
        if (!data) return '';

        return this.generateModerateNarrative({
            type: data.type,
            frequency: data.frequency,
            provider: data.provider,
            notes: data.notes
        });
    }

    private formatCostSummary(data: any): Record<string, any> {
        if (!data) return {};

        return {
            monthlyCost: this.formatClinicalValue(data.monthly, 'CAD'),
            annualCost: this.formatClinicalValue(data.annual, 'CAD'),
            notes: data.notes
        };
    }
}