import { BaseAgent } from './BaseAgent';
import { AgentContext, AssessmentData } from '../types';
import _ from 'lodash';

interface Demographics {
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  gender?: string;
  email?: string;
  phone?: string;
  address?: string;
  emergencyContact?: {
    name: string;
    phone?: string;
    relationship?: string;
  };
  maritalStatus?: string;
  numberOfChildren?: number;
  childrenDetails?: string;
  householdMembers?: Array<{
    name: string;
    relationship?: string;
    notes?: string;
  }>;
}

interface DemographicsData {
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  gender?: string;
  email?: string;
  phone?: string;
  address?: string;
  emergencyContact?: {
    name: string;
    phone?: string;
    relationship?: string;
  };
  maritalStatus?: string;
  numberOfChildren?: number;
  childrenDetails?: string;
  householdMembers?: Array<{
    name: string;
    relationship?: string;
    notes?: string;
  }>;
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

  protected formatBrief(data: DemographicsData): string {
    const sections = ['Demographics Summary'];
    sections.push(`\nName: ${data.firstName} ${data.lastName}`);
    sections.push(`Contact: ${data.phone}`);
    return sections.join('\n');
  }

  protected formatStandard(data: DemographicsData): string {
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

  protected formatDetailed(data: DemographicsData): string {
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