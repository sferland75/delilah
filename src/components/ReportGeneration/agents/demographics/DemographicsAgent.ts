import { Assessment } from '../../../../types';
import { AgentContext, ReportSection, ReportSectionType } from '../../../../types/report';
import { BaseAgent } from '../BaseAgent';

export class DemographicsAgent extends BaseAgent {
    constructor(context: AgentContext) {
        super(context);
        this.priority = 1;
        this.name = 'DemographicsAgent';
        this.dataKeys = ['demographics'];
    }

    async processData(data: Assessment): Promise<any> {
        return data.assessment.demographics;
    }

    protected formatBrief(demographics: any): string {
        return `Client: ${demographics.firstName} ${demographics.lastName}
Date of Birth: ${this.formatDate(demographics.dateOfBirth)}
Contact: ${demographics.phone || 'Not provided'}`;
    }

    protected formatStandard(demographics: any): string {
        const sections = [
            `Client: ${demographics.firstName} ${demographics.lastName}`,
            `Date of Birth: ${this.formatDate(demographics.dateOfBirth)}`,
            `Gender: ${demographics.gender}`,
            `Contact Information:`,
            `  Phone: ${demographics.phone || 'Not provided'}`,
            `  Email: ${demographics.email || 'Not provided'}`,
            `  Address: ${demographics.address || 'Not provided'}`
        ];

        if (demographics.emergencyContact) {
            sections.push(
                `\nEmergency Contact:`,
                `  Name: ${demographics.emergencyContact.name}`,
                `  Relationship: ${demographics.emergencyContact.relationship}`,
                `  Phone: ${demographics.emergencyContact.phone || 'Not provided'}`
            );
        }

        return sections.join('\n');
    }

    protected formatDetailed(demographics: any): string {
        const sections = [this.formatStandard(demographics)];
        
        sections.push(
            `\nAdditional Information:`,
            `Marital Status: ${this.formatMaritalStatus(demographics.maritalStatus)}`,
            `Children: ${this.formatChildrenInfo(demographics.numberOfChildren, demographics.childrenDetails)}`
        );

        if (demographics.householdMembers?.length) {
            sections.push(
                `\nHousehold Members:`,
                ...demographics.householdMembers.map((member: any) => 
                    `  - ${member.name} (${member.relationship})${member.notes ? `: ${member.notes}` : ''}`
                )
            );
        }

        return sections.join('\n');
    }

    async generateSection(data: Assessment): Promise<ReportSection> {
        const processedData = await this.processData(data);
        const content = await this.getFormattedContent(
            processedData,
            this.context.config.detailLevel
        );

        return {
            title: 'Demographics',
            type: ReportSectionType.STRUCTURED,
            orderNumber: this.priority,
            content
        };
    }

    private formatDate(date: string): string {
        return new Date(date).toLocaleDateString();
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

    private formatChildrenInfo(count: number | undefined, details: string | undefined): string {
        if (!count) return 'None';
        let info = `${count} ${count === 1 ? 'child' : 'children'}`;
        if (details) {
            info += ` - ${details.trim()}`;
        }
        return info;
    }
}