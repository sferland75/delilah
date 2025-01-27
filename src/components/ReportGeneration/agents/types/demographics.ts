export interface DemographicsChild {
  age: number;
}

export interface EmergencyContact {
  name: string;
  phone?: string;
  relationship?: string;
}

export interface DemographicsInput {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  address?: string;
  emergencyContact?: EmergencyContact;
  maritalStatus?: string;
  children?: DemographicsChild[];
  livingArrangement?: string;
}

export interface ProcessedDemographics {
  valid: boolean;
  firstName: string;
  lastName: string;
  fullName: string;
  email?: string;
  phone?: string;
  address?: string;
  emergencyContact?: EmergencyContact;
  familyStatus: {
    maritalStatus?: string;
    children: {
      count: number;
      ages?: number[];
    };
    livingArrangement?: string;
  };
}