"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NarrativeDemographicsAgent = void 0;
const BaseNarrativeAgent_1 = require("./BaseNarrativeAgent");
class NarrativeDemographicsAgent extends BaseNarrativeAgent_1.BaseNarrativeAgent {
    generateOverview(data) {
        const demographics = data.assessment.demographics;
        const age = this.calculateAge(new Date(demographics.dateOfBirth));
        return `${demographics.firstName} ${demographics.lastName} is a ${age}-year-old ${demographics.gender.toLowerCase()} who ${this.formatMaritalStatus(demographics.maritalStatus)}. ${this.formatChildren(demographics.numberOfChildren, demographics.childrenDetails)}`;
    }
    generateDetailedAnalysis(data) {
        const demographics = data.assessment.demographics;
        const sections = [];
        // Contact Information
        sections.push(this.formatContactInfo(demographics));
        // Living Arrangements
        if (demographics.householdMembers && demographics.householdMembers.length > 0) {
            sections.push(this.formatHouseholdInfo(demographics.householdMembers));
        }
        // Family Support
        sections.push(this.formatFamilySupport(demographics));
        return sections.filter(Boolean).join('\n\n');
    }
    generateImplications(data) {
        const demographics = data.assessment.demographics;
        const implications = [];
        // Emergency Contact Analysis
        if (demographics.emergencyContact) {
            implications.push(this.formatEmergencyContactInfo(demographics.emergencyContact));
        }
        else {
            implications.push('No designated emergency contact has been identified, which may require attention in emergency planning.');
        }
        // Support System Analysis
        implications.push(this.analyzeSupportSystem(demographics));
        return implications.filter(Boolean).join(' ');
    }
    formatMaritalStatus(status) {
        const statusMap = {
            'married': 'is married',
            'single': 'is single',
            'divorced': 'is divorced',
            'widowed': 'is widowed',
            'commonLaw': 'is in a common-law relationship',
            'separated': 'is separated'
        };
        return statusMap[status] || 'marital status not specified';
    }
    formatChildren(count, details) {
        if (!count)
            return '';
        let text = `They have ${count} ${count === 1 ? 'child' : 'children'}`;
        if (details) {
            text += ` (${details.trim()})`;
        }
        return text;
    }
    formatContactInfo(demographics) {
        const parts = [];
        if (demographics.phone || demographics.email || demographics.address) {
            parts.push('Contact information includes:');
            if (demographics.phone)
                parts.push(`Phone: ${demographics.phone}`);
            if (demographics.email)
                parts.push(`Email: ${demographics.email}`);
            if (demographics.address)
                parts.push(`Address: ${demographics.address}`);
        }
        return parts.join(' ');
    }
    formatHouseholdInfo(members) {
        if (!members.length)
            return 'The client lives alone.';
        const memberDescriptions = members.map(member => {
            let desc = member.name;
            if (member.relationship)
                desc += ` (${member.relationship})`;
            if (member.notes)
                desc += ` - ${member.notes}`;
            return desc;
        });
        return `Household members include: ${memberDescriptions.join('; ')}.`;
    }
    formatFamilySupport(demographics) {
        const supports = [];
        if (demographics.householdMembers?.length > 0) {
            const caregivers = demographics.householdMembers.filter((m) => m.notes?.toLowerCase().includes('caregiver'));
            if (caregivers.length > 0) {
                supports.push(`Primary care support is provided by ${caregivers.map((c) => c.name).join(' and ')}.`);
            }
        }
        if (demographics.numberOfChildren > 0) {
            supports.push(this.formatChildren(demographics.numberOfChildren, demographics.childrenDetails));
        }
        return supports.join(' ');
    }
    formatEmergencyContactInfo(contact) {
        if (!contact.name)
            return '';
        return `Emergency contact is ${contact.name}${contact.relationship ? ` (${contact.relationship})` : ''}${contact.phone ? ` at ${contact.phone}` : ''}.`;
    }
    analyzeSupportSystem(demographics) {
        const support = [];
        // Analyze available support
        const hasSpouse = demographics.maritalStatus === 'married' || demographics.maritalStatus === 'commonLaw';
        const hasChildren = demographics.numberOfChildren > 0;
        const hasHouseholdMembers = demographics.householdMembers?.length > 0;
        if (hasSpouse && hasChildren) {
            support.push('Has immediate family support structure in place');
        }
        else if (!hasSpouse && !hasHouseholdMembers) {
            support.push('Limited immediate support system identified');
        }
        return support.join('. ') + '.';
    }
    calculateAge(birthDate) {
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }
}
exports.NarrativeDemographicsAgent = NarrativeDemographicsAgent;
