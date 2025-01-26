import { AssessmentData } from '../../types';
import { BaseAgent } from '../core/BaseAgent';
import { ReportSection } from '../core/ReportStructure';
import { SectionContent } from '../core/ReportSectionTypes';

export class CurrentMedicalTeamAgent extends BaseAgent {
    constructor() {
        super(ReportSection.CURRENT_MEDICAL_TEAM);
    }

    public generateSection(data: AssessmentData): SectionContent {
        const treatments = data.assessment.medicalHistory?.currentTreatment || [];

        return {
            title: this.config.title,
            type: this.config.type,
            order: this.config.order,
            content: {
                providers: treatments.map(provider => ({
                    name: provider.name || '',
                    type: provider.providerType || '',
                    frequency: provider.frequency || '',
                    focus: provider.focus || '',
                    progress: provider.progress || '',
                    startDate: provider.startDate ? this.formatClinicalDate(provider.startDate) : ''
                }))
            }
        };
    }
}