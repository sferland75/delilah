import { AssessmentData } from '../../types';
import { BaseAgent } from '../core/BaseAgent';
import { ReportSectionType, SectionContent } from '../core/ReportSectionTypes';

export class DemographicsAgent extends BaseAgent {
    constructor() {
        super({
            order: 1,
            title: 'Client Information',
            sectionType: ReportSectionType.STRUCTURED
        });
    }

    public generateSection(data: AssessmentData): SectionContent {
        const demographics = data.assessment.demographics;

        return {
            title: this.config.title,
            type: this.config.sectionType,
            order: this.config.order,
            content: {
                clientTable: {
                    name: {
                        label: 'Client Name',
                        value: `${demographics.firstName} ${demographics.lastName}`
                    },
                    dateOfBirth: {
                        label: 'Date of Birth',
                        value: this.formatClinicalDate(demographics.dateOfBirth)
                    },
                    gender: {
                        label: 'Gender',
                        value: demographics.gender
                    },
                    contact: {
                        label: 'Contact Information',
                        value: {
                            phone: demographics.phone || 'Not provided',
                            email: demographics.email || 'Not provided',
                            address: demographics.address || 'Not provided'
                        }
                    }
                },
                emergencyContactTable: demographics.emergencyContact ? {
                    name: {
                        label: 'Emergency Contact',
                        value: demographics.emergencyContact.name
                    },
                    relationship: {
                        label: 'Relationship',
                        value: demographics.emergencyContact.relationship
                    },
                    phone: {
                        label: 'Emergency Phone',
                        value: demographics.emergencyContact.phone || 'Not provided'
                    }
                } : null,
                socialStatusTable: {
                    maritalStatus: {
                        label: 'Marital Status',
                        value: this.formatMaritalStatus(demographics.maritalStatus)
                    },
                    children: {
                        label: 'Children',
                        value: this.formatChildrenInfo(demographics.numberOfChildren, demographics.childrenDetails)
                    }
                }
            }
        };
    }

    private formatMaritalStatus(status: string): string {
        const statusMap: Record<string, string> = {
            'married': 'Married',
            'single': 'Single',
            'divorced': 'Divorced',
            'widowed': 'Widowed',
            'commonLaw': 'Common Law',
            'separated': 'Separated'
        };

        return statusMap[status] || status;
    }

    private formatChildrenInfo(count: number, details: string): string {
        if (!count) return 'None';
        let info = `${count} ${count === 1 ? 'child' : 'children'}`;
        if (details) {
            info += ` - ${details.trim()}`;
        }
        return info;
    }
}