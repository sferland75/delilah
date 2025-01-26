import { AssessmentData } from '../types';
import { BaseReportAgent, ReportSection, ReportSectionType } from './BaseReportAgent';

export class DemographicsAgent extends BaseReportAgent {
    protected sectionType = ReportSectionType.STRUCTURED;

    public generateSection(data: AssessmentData): ReportSection {
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