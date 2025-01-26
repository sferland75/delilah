import { ReportSectionType } from './ReportSectionTypes';

export enum ReportSection {
    THERAPIST_QUALIFICATIONS = 'therapist_qualifications',
    DEMOGRAPHICS = 'demographics',
    SUMMARY_OF_FINDINGS = 'summary_of_findings',
    DOCUMENTATION = 'documentation',
    PRE_ACCIDENT_HISTORY = 'pre_accident_history',
    MECHANISM_OF_INJURY = 'mechanism_of_injury',
    NATURE_OF_INJURY = 'nature_of_injury',
    COURSE_OF_RECOVERY = 'course_of_recovery',
    CURRENT_MEDICAL_TEAM = 'current_medical_team',
    CURRENT_MEDICATIONS = 'current_medications',
    SUBJECTIVE_INFORMATION = 'subjective_information',
    SYMPTOM_MANAGEMENT = 'symptom_management',
    FUNCTIONAL_OBSERVATIONS = 'functional_observations',
    EMOTIONAL_PRESENTATION = 'emotional_presentation',
    COGNITIVE_PRESENTATION = 'cognitive_presentation',
    TYPICAL_DAY = 'typical_day',
    ENVIRONMENTAL_ASSESSMENT = 'environmental_assessment',
    LIVING_ARRANGEMENTS = 'living_arrangements',
    ADL_ASSESSMENT = 'adl_assessment',
    ATTENDANT_CARE = 'attendant_care',
    AMA_GUIDES = 'ama_guides'
}

export const REPORT_STRUCTURE = {
    [ReportSection.THERAPIST_QUALIFICATIONS]: {
        type: ReportSectionType.STRUCTURED,
        order: 1,
        title: 'Therapist Qualifications'
    },
    [ReportSection.DEMOGRAPHICS]: {
        type: ReportSectionType.STRUCTURED,
        order: 2,
        title: 'Client Information'
    },
    [ReportSection.SUMMARY_OF_FINDINGS]: {
        type: ReportSectionType.FULL_NARRATIVE,
        order: 3,
        title: 'Summary of Findings'
    },
    [ReportSection.DOCUMENTATION]: {
        type: ReportSectionType.STRUCTURED,
        order: 4,
        title: 'Documentation Reviewed'
    },
    [ReportSection.PRE_ACCIDENT_HISTORY]: {
        type: ReportSectionType.MODERATE_NARRATIVE,
        order: 5,
        title: 'Pre-Accident Medical History'
    },
    [ReportSection.MECHANISM_OF_INJURY]: {
        type: ReportSectionType.MODERATE_NARRATIVE,
        order: 6,
        title: 'Mechanism of Injury'
    },
    [ReportSection.NATURE_OF_INJURY]: {
        type: ReportSectionType.MODERATE_NARRATIVE,
        order: 7,
        title: 'Nature of Injury'
    },
    [ReportSection.COURSE_OF_RECOVERY]: {
        type: ReportSectionType.MODERATE_NARRATIVE,
        order: 8,
        title: 'Course of Recovery to Date'
    },
    [ReportSection.CURRENT_MEDICAL_TEAM]: {
        type: ReportSectionType.STRUCTURED,
        order: 9,
        title: 'Current Medical/Rehabilitation Team'
    },
    [ReportSection.CURRENT_MEDICATIONS]: {
        type: ReportSectionType.STRUCTURED,
        order: 10,
        title: 'Current Medications'
    },
    [ReportSection.SUBJECTIVE_INFORMATION]: {
        type: ReportSectionType.FULL_NARRATIVE,
        order: 11,
        title: 'Subjective Information (Client Report)'
    },
    [ReportSection.SYMPTOM_MANAGEMENT]: {
        type: ReportSectionType.MODERATE_NARRATIVE,
        order: 12,
        title: 'Symptom Management Strategies'
    },
    [ReportSection.FUNCTIONAL_OBSERVATIONS]: {
        type: ReportSectionType.FULL_NARRATIVE,
        order: 13,
        title: 'Functional and Behavioural Observations'
    },
    [ReportSection.EMOTIONAL_PRESENTATION]: {
        type: ReportSectionType.MODERATE_NARRATIVE,
        order: 14,
        title: 'Emotional Presentation'
    },
    [ReportSection.COGNITIVE_PRESENTATION]: {
        type: ReportSectionType.MODERATE_NARRATIVE,
        order: 15,
        title: 'Cognitive Presentation'
    },
    [ReportSection.TYPICAL_DAY]: {
        type: ReportSectionType.FULL_NARRATIVE,
        order: 16,
        title: 'Typical Day'
    },
    [ReportSection.ENVIRONMENTAL_ASSESSMENT]: {
        type: ReportSectionType.MIXED,
        order: 17,
        title: 'Environmental Assessment'
    },
    [ReportSection.LIVING_ARRANGEMENTS]: {
        type: ReportSectionType.MODERATE_NARRATIVE,
        order: 18,
        title: 'Living Arrangements/Social Status'
    },
    [ReportSection.ADL_ASSESSMENT]: {
        type: ReportSectionType.FULL_NARRATIVE,
        order: 19,
        title: 'Activities of Daily Living'
    },
    [ReportSection.ATTENDANT_CARE]: {
        type: ReportSectionType.MIXED,
        order: 20,
        title: 'Attendant Care Requirements'
    },
    [ReportSection.AMA_GUIDES]: {
        type: ReportSectionType.FULL_NARRATIVE,
        order: 21,
        title: 'Assessment of the Four Spheres of Function'
    }
} as const;

// Helper types
export type ReportSectionKey = keyof typeof REPORT_STRUCTURE;
export type SectionConfig = typeof REPORT_STRUCTURE[ReportSectionKey];

// Function to get section config
export function getSectionConfig(section: ReportSection): SectionConfig {
    return REPORT_STRUCTURE[section];
}

// Function to get ordered section list
export function getOrderedSections(): ReportSection[] {
    return Object.entries(REPORT_STRUCTURE)
        .sort(([,a], [,b]) => a.order - b.order)
        .map(([section]) => section as ReportSection);
}