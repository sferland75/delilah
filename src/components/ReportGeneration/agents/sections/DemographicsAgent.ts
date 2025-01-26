import { AssessmentData } from '../../types';
import { BaseAgent } from '../core/BaseAgent';
import { ReportSection } from '../core/ReportStructure';
import { SectionContent } from '../core/ReportSectionTypes';

export class DemographicsAgent extends BaseAgent {
    constructor() {
        super(ReportSection.DEMOGRAPHICS);
    }

    public generateSection(data: AssessmentData): SectionContent {
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