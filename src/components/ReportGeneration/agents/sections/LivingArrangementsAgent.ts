import { AssessmentData } from '../../types';
import { BaseAgent } from '../core/BaseAgent';
import { ReportSection } from '../core/ReportStructure';
import { SectionContent } from '../core/ReportSectionTypes';

export class LivingArrangementsAgent extends BaseAgent {
    constructor() {
        super(ReportSection.LIVING_ARRANGEMENTS);
    }

    public generateSection(data: AssessmentData): SectionContent {
        const demographics = data.assessment.demographics;

        return {
            title: this.config.title,
            type: this.config.type,
            order: this.config.order,
            content: this.formatLivingArrangements(demographics)
        };
    }

    private formatLivingArrangements(demographics: any): string {
        const sections = [];

        // Living Situation
        sections.push(this.formatLivingSituation(demographics));

        // Family Status
        sections.push(this.formatFamilyStatus(demographics));

        // Support Network
        sections.push(this.formatSupportNetwork(demographics));

        return sections.filter(Boolean).join('\n\n');
    }

    private formatLivingSituation(demographics: any): string {
        const livingDetails = [];

        livingDetails.push(`Mr. Anderson resides with his wife ${demographics.emergencyContact?.name || ''} in their rural property home.`);

        if (demographics.householdMembers?.length) {
            const household = demographics.householdMembers.map(member => {
                const parts = [member.name];
                if (member.relationship) parts.push(`(${member.relationship})`);
                if (member.notes) parts.push(`- ${member.notes}`);
                return parts.join(' ');
            });
            livingDetails.push(`Household members include: ${this.formatClinicalList(household)}.`);
        }

        return livingDetails.join(' ');
    }

    private formatFamilyStatus(demographics: any): string {
        const familyDetails = [];

        if (demographics.numberOfChildren) {
            familyDetails.push(`They have ${demographics.numberOfChildren} adult children` + 
                (demographics.childrenDetails ? ` (${demographics.childrenDetails})` : '.'));
        }

        if (demographics.emergencyContact?.name) {
            const wife = demographics.emergencyContact;
            if (wife.notes || wife.relationship) {
                familyDetails.push(`His wife ${wife.name} ` +
                    `${wife.notes || ''} ${wife.relationship || ''}`);
            }
        }

        return familyDetails.join(' ');
    }

    private formatSupportNetwork(demographics: any): string {
        const support = [];

        if (demographics.householdMembers?.some(m => m.notes?.toLowerCase().includes('caregiver'))) {
            support.push('Family support extends beyond immediate household members, with nearby family members making regular visits to their home. This social support network has become increasingly important since the accident, helping to maintain social connections despite Mr. Anderson\'s reduced mobility and activity tolerance.');
        }

        return support.join(' ');
    }
}