import { AssessmentData } from '../types';
import { BaseNarrativeAgent } from './BaseNarrativeAgent';

interface DemographicInfo {
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
    };
}

/**
 * DemographicsAgent generates clinical narratives for patient demographic information
 */
export class DemographicsAgent extends BaseNarrativeAgent {
    protected generateOverview(data: AssessmentData): string {
        const info = this.extractDemographicInfo(data);
        const { personalInfo, familyStatus } = info;

        const overviewParts = [
            `${personalInfo.fullName} is a ${personalInfo.age}-year-old ${personalInfo.gender}`,
            familyStatus.maritalStatus && `who is ${familyStatus.maritalStatus.toLowerCase()}`,
            this.formatChildrenInfo(familyStatus.children)
        ];

        return overviewParts.filter(Boolean).join(' ') + '.';
    }

    protected generateDetailedAnalysis(data: AssessmentData): string {
        const info = this.extractDemographicInfo(data);
        const { supportSystem, careContext } = info;

        const sections = [];

        // Living situation and household
        if (supportSystem.householdMembers.length > 0) {
            const householdDescription = this.describeHouseholdMembers(supportSystem.householdMembers);
            sections.push(householdDescription);
        } else {
            sections.push('Patient lives alone.');
        }

        // Care support system
        if (careContext.primaryCaregiver || careContext.secondarySupports?.length) {
            sections.push(this.describeCareSupport(careContext));
        }

        // Support gaps
        if (supportSystem.supportGaps?.length) {
            sections.push(this.describeSupportGaps(supportSystem.supportGaps));
        }

        return sections.join(' ');
    }

    protected generateImplications(data: AssessmentData): string {
        const info = this.extractDemographicInfo(data);
        const implications = [];

        // Emergency contact implications
        if (info.emergency.contact.name) {
            implications.push(
                `Emergency contact is available through ${info.emergency.contact.name} ` +
                `(${info.emergency.contact.relationship}) at ${info.emergency.contact.phone}.`
            );
        } else {
            implications.push('No emergency contact has been designated, which may require attention.');
        }

        // Support system implications
        if (info.supportSystem.supportGaps?.length) {
            implications.push(
                'Support system gaps may require additional community resources or services.'
            );
        }

        // Caregiver availability implications
        if (info.supportSystem.caregiverAvailability) {
            implications.push(
                `Current caregiver availability indicates ${info.supportSystem.caregiverAvailability.toLowerCase()}.`
            );
        }

        return implications.join(' ');
    }

    private extractDemographicInfo(data: AssessmentData): DemographicInfo {
        const demographics = data.demographics;
        
        return {
            personalInfo: {
                fullName: `${demographics.firstName} ${demographics.lastName}`,
                age: this.calculateAge(new Date(demographics.dateOfBirth)),
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
                householdMembers: this.processHouseholdMembers(demographics.householdMembers || []),
                caregiverAvailability: this.assessCaregiverAvailability(demographics.householdMembers || []),
                supportGaps: this.identifySupportGaps(demographics)
            },
            careContext: this.analyzeCareContext(demographics.householdMembers || [])
        };
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

        return statusMap[status.toLowerCase()] || status;
    }

    private formatChildrenInfo(children: { count: number; details: string }): string {
        if (children.count === 0) return '';
        
        const countDescription = `${children.count} ${children.count === 1 ? 'child' : 'children'}`;
        return children.details ? 
            `with ${countDescription} (${children.details})` : 
            `with ${countDescription}`;
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
        
        if (notes.includes('primary caregiver')) return 'Primary Caregiver';
        if (notes.includes('caregiver')) return 'Secondary Caregiver';
        if (relationship.includes('spouse')) return 'Potential Caregiver';
        
        return '';
    }

    private analyzeCareContext(members: Array<any>): any {
        const primaryCaregiver = members.find(m => m.caregivingRole === 'Primary Caregiver');
        const secondarySupports = members
            .filter(m => m.caregivingRole === 'Secondary Caregiver')
            .map(m => m.name);

        return {
            primaryCaregiver: primaryCaregiver?.name,
            secondarySupports: secondarySupports.length > 0 ? secondarySupports : undefined,
            careSchedule: this.determineCareSchedule(members)
        };
    }

    private determineCareSchedule(members: Array<any>): string {
        const caregivers = members.filter(m => m.caregivingRole);
        if (!caregivers.length) return '';

        const scheduleNotes = caregivers
            .map(cg => cg.notes)
            .filter(Boolean)
            .join(' ');

        return scheduleNotes || 'Care schedule not specified';
    }

    private describeHouseholdMembers(members: Array<any>): string {
        const descriptions = members.map(member => {
            const parts = [
                member.name,
                member.relationship && `(${member.relationship})`,
                member.caregivingRole && `serves as ${member.caregivingRole.toLowerCase()}`
            ];
            return parts.filter(Boolean).join(' ');
        });

        return `Patient resides with ${this.createList(descriptions)}.`;
    }

    private describeCareSupport(careContext: any): string {
        const parts = [];

        if (careContext.primaryCaregiver) {
            parts.push(`${careContext.primaryCaregiver} serves as primary caregiver`);
        }

        if (careContext.secondarySupports?.length) {
            parts.push(
                `with additional support provided by ${this.createList(careContext.secondarySupports)}`
            );
        }

        if (careContext.careSchedule) {
            parts.push(`(${careContext.careSchedule})`);
        }

        return parts.join(' ') + '.';
    }

    private describeSupportGaps(gaps: string[]): string {
        return `Notable support considerations include ${this.createList(gaps)}.`;
    }

    private assessCaregiverAvailability(members: Array<any>): string {
        const caregivers = members.filter(m => m.caregivingRole);
        
        if (!caregivers.length) return 'No identified caregivers';
        return caregivers.length === 1 ? 
            'Single caregiver system' : 
            `Multiple caregivers available (${caregivers.length})`;
    }

    private identifySupportGaps(demographics: any): string[] {
        const gaps: string[] = [];

        if (!demographics.emergencyContact?.name) {
            gaps.push('lack of designated emergency contact');
        }

        if (!demographics.householdMembers?.length) {
            gaps.push('lives alone - may need community support');
        }

        const hasCaregivers = (demographics.householdMembers || [])
            .some(m => m.notes?.toLowerCase().includes('caregiver'));
        
        if (!hasCaregivers) {
            gaps.push('no designated caregivers identified');
        }

        return gaps;
    }
}