import { BaseAgent } from './BaseAgent';
import { AgentContext, AssessmentData } from '../types';
import _ from 'lodash';

interface Demographics {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  address?: string;
  emergencyContact?: {
    name: string;
    phone?: string;
    relationship?: string;
  };
  maritalStatus?: string;
  children?: Array<{
    age: number;
  }>;
  livingArrangement?: string;
}

interface DemographicsData {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  address?: string;
  emergencyContact?: {
    name: string;
    phone?: string;
    relationship?: string;
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

  async processData(data: AssessmentData): Promise<DemographicsData> {
    const demographics = _.get(data, 'demographics', {}) as Demographics;
    
    return {
      valid: true,
      firstName: demographics.firstName || '',
      lastName: demographics.lastName || '',
      email: demographics.email,
      phone: demographics.phone,
      address: demographics.address,
      emergencyContact: demographics.emergencyContact ? {
        name: demographics.emergencyContact.name,
        phone: demographics.emergencyContact.phone,
        relationship: demographics.emergencyContact.relationship
      } : undefined,
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

  protected formatBrief(data: DemographicsData): string {
    const sections = ['Demographics:'];
    sections.push(`\nName: ${data.firstName} ${data.lastName}`);
    return sections.join('\n');
  }

  protected formatStandard(data: DemographicsData): string {
    const sections = ['Demographics:'];
    
    // Basic info
    sections.push(`\nName: ${data.firstName} ${data.lastName}`);
    
    // Contact info
    if (data.phone) {
      sections.push(`Phone: ${data.phone}`);
    }
    if (data.email) {
      sections.push(`Email: ${data.email}`);
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
    
    // Family status
    if (data.familyStatus.maritalStatus) {
      sections.push(`\nMarital Status: ${data.familyStatus.maritalStatus}`);
    }
    sections.push(`Children: ${data.familyStatus.children.count}`);

    return sections.join('\n');
  }

  protected formatDetailed(data: DemographicsData): string {
    const sections = this.formatStandard(data).split('\n');
    
    // Additional details
    if (data.address) {
      sections.push(`\nAddress: ${data.address}`);
    }
    if (data.familyStatus.livingArrangement) {
      sections.push(`Living Arrangement: ${data.familyStatus.livingArrangement}`);
    }
    if (data.familyStatus.children.ages?.length) {
      sections.push(`Children's Ages: ${data.familyStatus.children.ages.join(', ')}`);
    }

    return sections.join('\n');
  }
}