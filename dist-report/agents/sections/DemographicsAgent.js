"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DemographicsAgent = void 0;
const BaseAgent_1 = require("../core/BaseAgent");
const ReportStructure_1 = require("../core/ReportStructure");
class DemographicsAgent extends BaseAgent_1.BaseAgent {
    constructor() {
        super(ReportStructure_1.ReportSection.DEMOGRAPHICS);
    }
    generateSection(data) {
        const demographics = data.assessment.demographics;
        return {
            title: this.config.title,
            type: this.config.type,
            order: this.config.order,
            content: {
                clientInfo: {
                    name: `${demographics.firstName} ${demographics.lastName}`,
                    dateOfBirth: this.formatClinicalDate(demographics.dateOfBirth),
                    address: demographics.address || 'Not provided',
                    phone: demographics.phone || 'Not provided',
                    email: demographics.email || 'Not provided'
                },
                emergencyContact: demographics.emergencyContact ? {
                    name: demographics.emergencyContact.name,
                    relationship: demographics.emergencyContact.relationship,
                    phone: demographics.emergencyContact.phone
                } : null,
                lawyer: {
                    name: '',
                    firm: ''
                },
                insurer: {
                    name: '',
                    adjuster: '',
                    claimNumber: ''
                }
            }
        };
    }
}
exports.DemographicsAgent = DemographicsAgent;
