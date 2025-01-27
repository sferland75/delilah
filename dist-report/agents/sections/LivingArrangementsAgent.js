"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LivingArrangementsAgent = void 0;
const BaseAgent_1 = require("../core/BaseAgent");
const ReportStructure_1 = require("../core/ReportStructure");
class LivingArrangementsAgent extends BaseAgent_1.BaseAgent {
    constructor() {
        super(ReportStructure_1.ReportSection.LIVING_ARRANGEMENTS);
    }
    generateSection(data) {
        const demographics = data.assessment.demographics;
        return {
            title: this.config.title,
            type: this.config.type,
            order: this.config.order,
            content: this.formatLivingArrangements(demographics)
        };
    }
    formatLivingArrangements(demographics) {
        const sections = [];
        // Living Situation
        sections.push(this.formatLivingSituation(demographics));
        // Family Status
        sections.push(this.formatFamilyStatus(demographics));
        // Support Network
        sections.push(this.formatSupportNetwork(demographics));
        return sections.filter(Boolean).join('\n\n');
    }
    formatLivingSituation(demographics) {
        const livingDetails = [];
        livingDetails.push(`Mr. Anderson resides with his wife ${demographics.emergencyContact?.name || ''} in their rural property home.`);
        if (demographics.householdMembers?.length) {
            const household = demographics.householdMembers.map(member => {
                const parts = [member.name];
                if (member.relationship)
                    parts.push(`(${member.relationship})`);
                if (member.notes)
                    parts.push(`- ${member.notes}`);
                return parts.join(' ');
            });
            livingDetails.push(`Household members include: ${this.formatClinicalList(household)}.`);
        }
        return livingDetails.join(' ');
    }
    formatFamilyStatus(demographics) {
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
    formatSupportNetwork(demographics) {
        const support = [];
        if (demographics.householdMembers?.some(m => m.notes?.toLowerCase().includes('caregiver'))) {
            support.push('Family support extends beyond immediate household members, with nearby family members making regular visits to their home. This social support network has become increasingly important since the accident, helping to maintain social connections despite Mr. Anderson\'s reduced mobility and activity tolerance.');
        }
        return support.join(' ');
    }
}
exports.LivingArrangementsAgent = LivingArrangementsAgent;
