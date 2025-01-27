export interface Assessment {
  demographics: DemographicsData;
  adl: ADLData;
  symptoms: SymptomsData;
  environmental: EnvironmentalData;
  medicalHistory: MedicalHistoryData;
  functionalAssessment: FunctionalAssessmentData;
  documentation: DocumentationData;
  typicalDay: TypicalDayData;
  amaGuides: AMAGuidesData;
}

export interface DemographicsData {
  name: string;
  dateOfBirth: string;
  gender: string;
  householdMembers: HouseholdMember[];
  occupation?: string;
  employer?: string;
  address?: string;
}

export interface HouseholdMember {
  relationship: string;
  name?: string;
  notes?: string;
}

export interface ADLData {
  bathing: ADLActivity;
  dressing: ADLActivity;
  transfers: ADLActivity;
  toileting: ADLActivity;
  feeding: ADLActivity;
}

export interface ADLActivity {
  independence: IndependenceLevel;
  notes?: string;
  adaptations?: string[];
}

export type IndependenceLevel =
  | 'independent'
  | 'modified_independent'
  | 'supervision'
  | 'minimal_assistance'
  | 'moderate_assistance'
  | 'maximal_assistance'
  | 'total_assistance';

export interface SymptomsData {
  physical: Symptom[];
  cognitive: Symptom[];
  emotional: Symptom[];
}

export interface Symptom {
  symptom: string;
  severity: string;
  frequency: string;
  impact: string;
  management: string;
  location?: string;
}

export interface EnvironmentalData {
  propertyType: string;
  rooms: Room[];
  safety: SafetyAssessment;
}

export interface Room {
  name: string;
  hasStairs: boolean;
  modifications: string[];
  hazards: string[];
}

export interface SafetyAssessment {
  hazards: string[];
  recommendations: string[];
}

export interface MedicalHistoryData {
  injury: InjuryData;
  treatments: TreatmentData[];
  medications: MedicationData[];
  procedures: ProcedureData[];
  currentTreatment: CurrentTreatmentData[];
}

export interface InjuryData {
  date: string;
  mechanism: string;
  diagnosis: string[];
  impactAreas: string[];
}

export interface TreatmentData {
  type: string;
  provider: string;
  frequency: string;
  duration: string;
  outcome: string;
}

export interface MedicationData {
  name: string;
  dosage: string;
  frequency: string;
  purpose: string;
  sideEffects: string[];
}

export interface ProcedureData {
  name: string;
  date: string;
  outcome: string;
  complications: string[];
}

export interface CurrentTreatmentData {
  provider: string;
  specialty: string;
  frequency: string;
  lastVisit: string;
  nextVisit?: string;
}

export interface FunctionalAssessmentData {
  mobility: MobilityData;
  balance: BalanceData;
  endurance: EnduranceData;
}

export interface MobilityData {
  walking: MovementCapability;
  stairs: MovementCapability;
  transfers: MovementCapability;
}

export interface MovementCapability {
  independence: IndependenceLevel;
  distance?: string;
  assistiveDevices?: string[];
  limitations?: string[];
}

export interface BalanceData {
  static: BalanceMetric;
  dynamic: BalanceMetric;
}

export interface BalanceMetric {
  level: string;
  concerns: string[];
  compensations: string[];
}

export interface EnduranceData {
  level: string;
  limitations: string[];
  activities: ActivityTolerance[];
}

export interface ActivityTolerance {
  activity: string;
  duration: string;
  limitingFactors: string[];
}

export interface DocumentationData {
  sources: DocumentSource[];
  gaps: string[];
  reliability: string;
}

export interface DocumentSource {
  type: string;
  date: string;
  provider: string;
  relevance: string;
}

export interface TypicalDayData {
  routines: DailyRoutines;
  analysis?: RoutineAnalysis;
}

export interface DailyRoutines {
  morning?: RoutineData;
  afternoon?: RoutineData;
  evening?: RoutineData;
  night?: RoutineData;
}

export interface RoutineData {
  activities: string;
  assistance?: string;
  notes?: string;
}

export interface RoutineAnalysis {
  activityLevels?: {
    morning?: string;
    afternoon?: string;
    evening?: string;
  };
  patterns?: string[];
  concerns?: string[];
}

export interface AMAGuidesData {
  activities: AMAActivities;
  impairments: AMAImpairments;
}

export interface AMAActivities {
  self: AMAMetric;
  life: AMAMetric;
  travel: AMAMetric;
}

export interface AMAMetric {
  class: number;
  description: string;
  limitations: string[];
}

export interface AMAImpairments {
  physical: AMAImpairment[];
  mental: AMAImpairment[];
}

export interface AMAImpairment {
  body_part: string;
  percentage: number;
  rationale: string;
}