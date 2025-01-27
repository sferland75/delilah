export interface DemographicPerson {
  name: string;
  relationship: string;
  isPrimary?: boolean;
  notes?: string;
}

export interface ProcessedDemographics {
  name: string;
  age: number;
  gender: string;
  occupation?: string;
  employer?: string;
  address?: string;
  caregivers: DemographicPerson[];
  household: DemographicPerson[];
  recommendations: string[];
  concerns: string[];
}

export interface HouseholdMember {
  relationship: string;
  name?: string;
  notes?: string;
}

export interface DemographicsData {
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  gender: string;
  householdMembers: HouseholdMember[];
  occupation?: string;
  employer?: string;
  address?: string;
}

export interface DemographicsAnalysis {
  hasCaregivers: boolean;
  livingArrangement: string;
  supportNeeds: string[];
  recommendations: string[];
}