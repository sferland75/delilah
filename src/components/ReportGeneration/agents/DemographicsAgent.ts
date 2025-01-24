import { BaseAgent } from './BaseAgent';
import { AgentContext, ProcessedData } from './types';
import { formatDate } from './utils';

interface DemographicsData extends ProcessedData {
  personalInfo: {
    fullName: string;
    age: number;
    birthDate: string;
    gender: string;
    contact: {
      phone: string;
      email: string;
      address: string;
    };
  };
  familyStatus: {
    maritalStatus: string;
    children: {
      count: number;
      details: string;
    };
  };
  emergency: {
    contact: {
      name: string;
      phone: string;
      relationship: string;
    };
  };
  supportSystem: {
    householdMembers: Array<{
      name: string;
      relationship: string;
      notes: string;
      caregivingRole?: string;
    }>;
    caregiverAvailability?: string;
    supportGaps?: string[];
  };
  careContext: {
    primaryCaregiver?: string;
    secondarySupports?: string[];
    careSchedule?: string;
    limitations?: string[];
  };
}

export class DemographicsAgent extends BaseAgent {
  constructor(context: AgentContext, sectionOrder: number) {
    super(
      context, 
      sectionOrder,
      'Demographics',
      ['demographics.firstName', 'demographics.lastName', 'demographics.dateOfBirth']
    );
  }

  protected initializeValidationRules(): void {
    // Email validation
    this.validationRules.set('demographics.email', (value: string) => {
      if (!value) return true; // Optional field
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    });

    // Phone validation (North American format)
    const phoneValidator = (value: string) => {
      if (!value) return true; // Optional field
      return /^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/.test(value);
    };
    
    this.validationRules.set('demographics.phone', phoneValidator);
    this.validationRules.set('demographics.emergencyContact.phone', phoneValidator);

    // Date validation
    this.validationRules.set('demographics.dateOfBirth', (value: string) => {
      const date = new Date(value);
      return !isNaN(date.getTime());
    });
  }

  protected getSectionKeys(): string[] {
    return [
      'firstName',
      'lastName',
      'dateOfBirth',
      'gender',
      'phone',
      'email',
      'address',
      'maritalStatus',
      'numberOfChildren',
      'childrenDetails',
      'emergencyContact',
      'householdMembers'
    ];
  }

  async processData(data: any): Promise<DemographicsData> {
    const demographics = data.demographics;
    
    // Calculate age
    const birthDate = new Date(demographics.dateOfBirth);
    const age = this.calculateAge(birthDate);

    // Process household members and identify caregivers
    const householdMembers = this.processHouseholdMembers(demographics.householdMembers || []);
    const careContext = this.analyzeCareContext(householdMembers);

    // Identify potential support gaps
    const supportGaps = this.identifySupportGaps(demographics, householdMembers);

    return {
      metadata: {
        processedAt: new Date(),
        version: '1.0'
      },
      personalInfo: {
        fullName: `${demographics.firstName} ${demographics.lastName}`,
        age,
        birthDate: demographics.dateOfBirth,
        gender: demographics.gender || '',
        contact: {
          phone: demographics.phone || '',
          email: demographics.email || '',
          address: demographics.address || ''
        }
      },
      familyStatus: {
        maritalStatus: this.formatMaritalStatus(demographics.maritalStatus),
        children: {
          count: demographics.numberOfChildren || 0,
          details: demographics.childrenDetails || ''
        }
      },
      emergency: {
        contact: {
          name: demographics.emergencyContact?.name || '',
          phone: demographics.emergencyContact?.phone || '',
          relationship: demographics.emergencyContact?.relationship || ''
        }
      },
      supportSystem: {
        householdMembers,
        supportGaps,
        caregiverAvailability: this.assessCaregiverAvailability(householdMembers)
      },
      careContext
    };
  }

  protected formatByDetailLevel(data: DemographicsData, detailLevel: 'brief' | 'standard' | 'detailed'): string {
    switch (detailLevel) {
      case 'brief':
        return this.formatBrief(data);
      case 'standard':
        return this.formatStandard(data);
      case 'detailed':
        return this.formatDetailed(data);
      default:
        return this.formatStandard(data);
    }
  }

  private formatBrief(data: DemographicsData): string {
    return [
      `${data.personalInfo.fullName} is a ${data.personalInfo.age} year old ${data.personalInfo.gender}.`,
      data.familyStatus.maritalStatus ? `They are ${data.familyStatus.maritalStatus.toLowerCase()}.` : '',
      data.familyStatus.children.count ? 
        `They have ${data.familyStatus.children.count} ${data.familyStatus.children.count === 1 ? 'child' : 'children'}.` : ''
    ].filter(Boolean).join(' ');
  }

  private formatStandard(data: DemographicsData): string {
    const sections = [
      `## Personal Information`,
      `${data.personalInfo.fullName} is a ${data.personalInfo.age} year old ${data.personalInfo.gender}.`,
      `Date of Birth: ${formatDate(data.personalInfo.birthDate)}`,
      ``,
      `### Contact Information`,
      `- Phone: ${data.personalInfo.contact.phone}`,
      `- Email: ${data.personalInfo.contact.email}`,
      `- Address: ${data.personalInfo.contact.address}`,
      ``,
      `### Family Status`,
      data.familyStatus.maritalStatus ? `Marital Status: ${data.familyStatus.maritalStatus}` : '',
      data.familyStatus.children.count > 0 ? 
        `Has ${data.familyStatus.children.count} children. ${data.familyStatus.children.details}` : 
        'No children.',
      ``,
      `### Emergency Contact`,
      data.emergency.contact.name ? 
        `${data.emergency.contact.name} (${data.emergency.contact.relationship}) - ${data.emergency.contact.phone}` :
        'No emergency contact provided.'
    ];

    return sections.filter(Boolean).join('\n');
  }

  private formatDetailed(data: DemographicsData): string {
    const standardFormat = this.formatStandard(data);
    
    const additionalSections = [
      ``,
      `### Household Members and Support System`,
      data.supportSystem.householdMembers.length > 0 ?
        data.supportSystem.householdMembers.map(member => 
          `- ${member.name}${member.relationship ? ` (${member.relationship})` : ''}` +
          `${member.caregivingRole ? `\n  Role: ${member.caregivingRole}` : ''}` +
          `${member.notes ? `\n  Notes: ${member.notes}` : ''}`
        ).join('\n') :
        'Lives alone.',
      ``,
      `### Care Context`,
      data.careContext.primaryCaregiver ? 
        `Primary Caregiver: ${data.careContext.primaryCaregiver}` : '',
      data.careContext.careSchedule ? 
        `Care Schedule: ${data.careContext.careSchedule}` : '',
      ``,
      `### Support Considerations`,
      data.supportSystem.caregiverAvailability ? 
        `Caregiver Availability: ${data.supportSystem.caregiverAvailability}` : '',
      data.supportSystem.supportGaps?.length ? 
        `\nIdentified Support Gaps:\n${data.supportSystem.supportGaps.map(gap => `- ${gap}`).join('\n')}` : ''
    ];

    return standardFormat + '\n' + additionalSections.filter(Boolean).join('\n');
  }

  private calculateAge(birthDate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  private formatMaritalStatus(status: string | undefined): string {
    if (!status) return '';
    
    const statusMap: { [key: string]: string } = {
      'single': 'Single',
      'married': 'Married',
      'divorced': 'Divorced',
      'widowed': 'Widowed',
      'separated': 'Separated',
      'commonLaw': 'Common Law'
    };

    return statusMap[status] || status;
  }

  private processHouseholdMembers(members: Array<any>): Array<any> {
    return members.map(member => ({
      ...member,
      caregivingRole: this.determineCaregivingRole(member)
    }));
  }

  private determineCaregivingRole(member: any): string {
    const notes = (member.notes || '').toLowerCase();
    const relationship = (member.relationship || '').toLowerCase();
    
    if (notes.includes('primary caregiver') || notes.includes('main caregiver')) {
      return 'Primary Caregiver';
    }
    
    if (notes.includes('caregiver') || notes.includes('care ')) {
      return 'Secondary Caregiver';
    }

    if (relationship.includes('spouse') || relationship.includes('wife') || relationship.includes('husband')) {
      this.addWarning('Spousal caregiver role not explicitly defined');
      return 'Potential Caregiver';
    }

    return '';
  }

  private analyzeCareContext(householdMembers: Array<any>): any {
    const primaryCaregiver = householdMembers.find(m => m.caregivingRole === 'Primary Caregiver');
    const secondarySupports = householdMembers
      .filter(m => m.caregivingRole === 'Secondary Caregiver')
      .map(m => m.name);

    return {
      primaryCaregiver: primaryCaregiver?.name || undefined,
      secondarySupports: secondarySupports.length > 0 ? secondarySupports : undefined,
      careSchedule: this.determineCareSchedule(householdMembers)
    };
  }

  private determineCareSchedule(householdMembers: Array<any>): string {
    const caregivers = householdMembers.filter(m => m.caregivingRole);
    if (!caregivers.length) return '';

    const scheduleNotes = caregivers
      .map(cg => cg.notes)
      .filter(Boolean)
      .join(' ');

    return scheduleNotes || 'Care schedule not specified';
  }

  private assessCaregiverAvailability(householdMembers: Array<any>): string {
    const caregivers = householdMembers.filter(m => m.caregivingRole);
    
    if (!caregivers.length) {
      this.addWarning('No identified caregivers in household');
      return 'No identified caregivers';
    }

    return caregivers.length === 1 ? 
      'Single caregiver system' : 
      `Multiple caregivers available (${caregivers.length})`;
  }

  private identifySupportGaps(demographics: any, householdMembers: Array<any>): string[] {
    const gaps: string[] = [];

    // Check for emergency contact
    if (!demographics.emergencyContact?.name) {
      gaps.push('No emergency contact designated');
    }

    // Check for caregiver identification
    const hasCaregivers = householdMembers.some(m => m.caregivingRole);
    if (!hasCaregivers) {
      gaps.push('No designated caregivers identified');
    }

    // Check for living alone
    if (!householdMembers.length) {
      gaps.push('Lives alone - may need community support');
    }

    return gaps;
  }
}