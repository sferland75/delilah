import { 
  DemographicsData, 
  ProcessedDemographics, 
  DemographicsAnalysis,
  DemographicPerson 
} from './types';

export const calculateAge = (birthDate: string): number => {
  if (!birthDate) return 0;
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

export const identifyCaregivers = (members: DemographicPerson[]): DemographicPerson[] => {
  return members.filter(member => 
    member.notes?.toLowerCase().includes('caregiver') ||
    member.relationship.toLowerCase().includes('caregiver')
  ).map(member => ({
    ...member,
    isPrimary: member.notes?.toLowerCase().includes('primary')
  }));
};

export const analyzeLivingArrangement = (data: DemographicsData): DemographicsAnalysis => {
  const hasCaregivers = data.householdMembers.some(m => 
    m.notes?.toLowerCase().includes('caregiver')
  );

  const livingArrangement = data.householdMembers.length > 0 
    ? 'Lives with family/caregivers'
    : 'Lives alone';

  const supportNeeds = [];
  if (!hasCaregivers && data.householdMembers.length === 0) {
    supportNeeds.push('May need caregiver assessment');
  }

  const recommendations = [
    ...supportNeeds,
    // Add any specific recommendations based on living arrangement
    livingArrangement === 'Lives alone' ? 'Consider safety monitoring system' : null,
    !hasCaregivers ? 'Assess caregiver needs' : null
  ].filter(Boolean) as string[];

  return {
    hasCaregivers,
    livingArrangement,
    supportNeeds,
    recommendations
  };
};

export const formatDemographicsSection = (
  data: ProcessedDemographics,
  detailLevel: 'brief' | 'standard' | 'detailed'
): string => {
  const parts: string[] = [];

  // Basic information included in all formats
  parts.push(`Name: ${data.name}`);
  if (data.age) parts.push(`Age: ${data.age}`);
  parts.push(`Gender: ${data.gender}`);

  if (detailLevel === 'standard' || detailLevel === 'detailed') {
    if (data.occupation) {
      parts.push(`\nEmployment:`);
      parts.push(`Occupation: ${data.occupation}`);
      if (data.employer) parts.push(`Employer: ${data.employer}`);
    }

    if (data.caregivers.length > 0) {
      parts.push(`\nCaregivers:`);
      data.caregivers.forEach(cg => {
        parts.push(`- ${cg.name} (${cg.relationship})${cg.isPrimary ? ' - Primary' : ''}`);
      });
    }
  }

  if (detailLevel === 'detailed') {
    if (data.address) parts.push(`\nAddress: ${data.address}`);
    
    if (data.household.length > 0) {
      parts.push(`\nHousehold Members:`);
      data.household.forEach(member => {
        const details = [member.name, member.relationship].filter(Boolean).join(' - ');
        parts.push(`- ${details}`);
        if (member.notes) parts.push(`  Notes: ${member.notes}`);
      });
    }

    if (data.recommendations.length > 0) {
      parts.push(`\nRecommendations:`);
      data.recommendations.forEach(rec => parts.push(`- ${rec}`));
    }
  }

  return parts.join('\n');
};