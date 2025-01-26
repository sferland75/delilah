import { BaseAgent } from './BaseAgent';
import { AgentContext, AssessmentData, ProcessedData } from '../types';
import _ from 'lodash';

interface ProcessedDemographics extends ProcessedData {
  personalInfo: {
    fullName: string;
    contact: {
      email?: string;
      phone?: string;
      address?: string;
    };
  };
  familyStatus: {
    maritalStatus?: string;
    children: {
      count: number;
      ages?: number[];
    };
    livingArrangement?: string;
  };
  valid: boolean;
}

export class DemographicsAgent extends BaseAgent {
  constructor(context: AgentContext) {
    super(context, 1.0, 'Demographics', ['demographics']);
  }

  async processData(data: AssessmentData): Promise<ProcessedDemographics> {
    const demographics = _.get(data, 'demographics', {});
    
    return {
      valid: true,
      personalInfo: {
        fullName: `${demographics.firstName || ''} ${demographics.lastName || ''}`.trim(),
        contact: {
          email: demographics.email,
          phone: demographics.phone,
          address: demographics.address
        }
      },
      familyStatus: {
        maritalStatus: demographics.maritalStatus,
        children: {
          count: demographics.children?.length || 0,
          ages: demographics.children?.map(c => c.age)
        },
        livingArrangement: demographics.livingArrangement
      }
    };
  }

  protected formatByDetailLevel(data: ProcessedDemographics, level: "brief" | "standard" | "detailed"): string {
    const sections = ['Demographics:'];

    // Basic info always included
    sections.push(`\nName: ${data.personalInfo.fullName}`);

    if (level !== 'brief') {
      // Contact info
      if (data.personalInfo.contact.phone) {
        sections.push(`Phone: ${data.personalInfo.contact.phone}`);
      }
      if (data.personalInfo.contact.email) {
        sections.push(`Email: ${data.personalInfo.contact.email}`);
      }
      
      // Family status
      if (data.familyStatus.maritalStatus) {
        sections.push(`\nMarital Status: ${data.familyStatus.maritalStatus}`);
      }
      sections.push(`Children: ${data.familyStatus.children.count}`);

      if (level === 'detailed') {
        // Additional details
        if (data.personalInfo.contact.address) {
          sections.push(`\nAddress: ${data.personalInfo.contact.address}`);
        }
        if (data.familyStatus.livingArrangement) {
          sections.push(`Living Arrangement: ${data.familyStatus.livingArrangement}`);
        }
        if (data.familyStatus.children.ages?.length) {
          sections.push(`Children's Ages: ${data.familyStatus.children.ages.join(', ')}`);
        }
      }
    }

    return sections.join('\n');
  }

  format(data: ProcessedDemographics): string {
    return this.formatByDetailLevel(data, this.context.config?.detailLevel || 'standard');
  }
}