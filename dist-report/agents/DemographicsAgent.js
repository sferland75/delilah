"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DemographicsAgent = void 0;
const BaseAgent_1 = require("./BaseAgent");
const lodash_1 = __importDefault(require("lodash"));
class DemographicsAgent extends BaseAgent_1.BaseAgent {
    constructor(context) {
        super(context, 1.0, 'Demographics', ['demographics']);
    }
    async processData(data) {
        const demographics = lodash_1.default.get(data, 'demographics', {});
        return {
            valid: true,
            firstName: demographics.firstName || '',
            lastName: demographics.lastName || '',
            dateOfBirth: demographics.dateOfBirth,
            gender: demographics.gender,
            email: demographics.email,
            phone: demographics.phone,
            address: demographics.address,
            emergencyContact: demographics.emergencyContact,
            maritalStatus: demographics.maritalStatus,
            numberOfChildren: demographics.numberOfChildren,
            childrenDetails: demographics.childrenDetails,
            householdMembers: demographics.householdMembers
        };
    }
    formatBrief(data) {
        const sections = ['Demographics Summary'];
        sections.push(`\nName: ${data.firstName} ${data.lastName}`);
        sections.push(`Contact: ${data.phone}`);
        return sections.join('\n');
    }
    formatStandard(data) {
        const sections = ['Demographics Assessment'];
        // Basic info
        sections.push('\nPersonal Information:');
        sections.push(`- Name: ${data.firstName} ${data.lastName}`);
        sections.push(`- Contact: ${data.phone}`);
        if (data.email) {
            sections.push(`- Email: ${data.email}`);
        }
        if (data.address) {
            sections.push(`- Address: ${data.address}`);
        }
        if (data.dateOfBirth) {
            sections.push(`- Date of Birth: ${data.dateOfBirth}`);
        }
        if (data.gender) {
            sections.push(`- Gender: ${data.gender}`);
        }
        // Family status
        sections.push('\nFamily Status:');
        if (data.maritalStatus) {
            sections.push(`- Marital Status: ${data.maritalStatus}`);
        }
        if (data.numberOfChildren !== undefined) {
            sections.push(`- Number of Children: ${data.numberOfChildren}`);
            if (data.childrenDetails) {
                sections.push(`- Children Details: ${data.childrenDetails}`);
            }
        }
        // Emergency Contact
        if (data.emergencyContact) {
            sections.push('\nEmergency Contact:');
            sections.push(`- Name: ${data.emergencyContact.name}`);
            if (data.emergencyContact.phone) {
                sections.push(`- Phone: ${data.emergencyContact.phone}`);
            }
            if (data.emergencyContact.relationship) {
                sections.push(`- Relationship: ${data.emergencyContact.relationship}`);
            }
        }
        return sections.join('\n');
    }
    formatDetailed(data) {
        const sections = this.formatStandard(data).split('\n');
        // Household members
        if (data.householdMembers?.length) {
            sections.push('\nHousehold Members:');
            data.householdMembers.forEach(member => {
                sections.push(`- ${member.name}`);
                if (member.relationship) {
                    sections.push(`  Relationship: ${member.relationship}`);
                }
                if (member.notes) {
                    sections.push(`  Notes: ${member.notes}`);
                }
            });
        }
        return sections.join('\n');
    }
}
exports.DemographicsAgent = DemographicsAgent;
