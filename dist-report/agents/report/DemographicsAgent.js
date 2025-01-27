"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DemographicsAgent = void 0;
const BaseReportAgent_1 = require("./BaseReportAgent");
class DemographicsAgent extends BaseReportAgent_1.BaseReportAgent {
    constructor() {
        super(...arguments);
        this.sectionType = BaseReportAgent_1.ReportSectionType.STRUCTURED;
    }
    generateSection(data) {
        const demographics = data.assessment.demographics;
        return {
            title: 'Demographics',
            type: this.sectionType,
            order: 1,
            content: {
                clientInfo: {
                    name: `${demographics.firstName} ${demographics.lastName}`,
                    dateOfBirth: demographics.dateOfBirth,
                    gender: demographics.gender,
                    contact: {
                        phone: demographics.phone || 'Not provided',
                        email: demographics.email || 'Not provided',
                        address: demographics.address || 'Not provided'
                    }
                },
                emergencyContact: demographics.emergencyContact ? {
                    name: demographics.emergencyContact.name,
                    relationship: demographics.emergencyContact.relationship,
                    phone: demographics.emergencyContact.phone
                } : null,
                familyStatus: {
                    maritalStatus: demographics.maritalStatus,
                    children: {
                        count: demographics.numberOfChildren,
                        details: demographics.childrenDetails
                    },
                    householdMembers: demographics.householdMembers
                }
            }
        };
    }
}
exports.DemographicsAgent = DemographicsAgent;
