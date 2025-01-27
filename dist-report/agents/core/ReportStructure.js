"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REPORT_STRUCTURE = exports.ReportSection = void 0;
exports.getSectionConfig = getSectionConfig;
exports.getOrderedSections = getOrderedSections;
const ReportSectionTypes_1 = require("./ReportSectionTypes");
var ReportSection;
(function (ReportSection) {
    ReportSection["THERAPIST_QUALIFICATIONS"] = "therapist_qualifications";
    ReportSection["DEMOGRAPHICS"] = "demographics";
    ReportSection["SUMMARY_OF_FINDINGS"] = "summary_of_findings";
    ReportSection["DOCUMENTATION"] = "documentation";
    ReportSection["PRE_ACCIDENT_HISTORY"] = "pre_accident_history";
    ReportSection["MECHANISM_OF_INJURY"] = "mechanism_of_injury";
    ReportSection["NATURE_OF_INJURY"] = "nature_of_injury";
    ReportSection["COURSE_OF_RECOVERY"] = "course_of_recovery";
    ReportSection["CURRENT_MEDICAL_TEAM"] = "current_medical_team";
    ReportSection["CURRENT_MEDICATIONS"] = "current_medications";
    ReportSection["SUBJECTIVE_INFORMATION"] = "subjective_information";
    ReportSection["SYMPTOM_MANAGEMENT"] = "symptom_management";
    ReportSection["FUNCTIONAL_OBSERVATIONS"] = "functional_observations";
    ReportSection["EMOTIONAL_PRESENTATION"] = "emotional_presentation";
    ReportSection["COGNITIVE_PRESENTATION"] = "cognitive_presentation";
    ReportSection["TYPICAL_DAY"] = "typical_day";
    ReportSection["ENVIRONMENTAL_ASSESSMENT"] = "environmental_assessment";
    ReportSection["LIVING_ARRANGEMENTS"] = "living_arrangements";
    ReportSection["ADL_ASSESSMENT"] = "adl_assessment";
    ReportSection["ATTENDANT_CARE"] = "attendant_care";
    ReportSection["AMA_GUIDES"] = "ama_guides";
})(ReportSection || (exports.ReportSection = ReportSection = {}));
exports.REPORT_STRUCTURE = {
    [ReportSection.THERAPIST_QUALIFICATIONS]: {
        type: ReportSectionTypes_1.ReportSectionType.STRUCTURED,
        order: 1,
        title: 'Therapist Qualifications'
    },
    [ReportSection.DEMOGRAPHICS]: {
        type: ReportSectionTypes_1.ReportSectionType.STRUCTURED,
        order: 2,
        title: 'Client Information'
    },
    [ReportSection.SUMMARY_OF_FINDINGS]: {
        type: ReportSectionTypes_1.ReportSectionType.FULL_NARRATIVE,
        order: 3,
        title: 'Summary of Findings'
    },
    [ReportSection.DOCUMENTATION]: {
        type: ReportSectionTypes_1.ReportSectionType.STRUCTURED,
        order: 4,
        title: 'Documentation Reviewed'
    },
    [ReportSection.PRE_ACCIDENT_HISTORY]: {
        type: ReportSectionTypes_1.ReportSectionType.MODERATE_NARRATIVE,
        order: 5,
        title: 'Pre-Accident Medical History'
    },
    [ReportSection.MECHANISM_OF_INJURY]: {
        type: ReportSectionTypes_1.ReportSectionType.MODERATE_NARRATIVE,
        order: 6,
        title: 'Mechanism of Injury'
    },
    [ReportSection.NATURE_OF_INJURY]: {
        type: ReportSectionTypes_1.ReportSectionType.MODERATE_NARRATIVE,
        order: 7,
        title: 'Nature of Injury'
    },
    [ReportSection.COURSE_OF_RECOVERY]: {
        type: ReportSectionTypes_1.ReportSectionType.MODERATE_NARRATIVE,
        order: 8,
        title: 'Course of Recovery to Date'
    },
    [ReportSection.CURRENT_MEDICAL_TEAM]: {
        type: ReportSectionTypes_1.ReportSectionType.STRUCTURED,
        order: 9,
        title: 'Current Medical/Rehabilitation Team'
    },
    [ReportSection.CURRENT_MEDICATIONS]: {
        type: ReportSectionTypes_1.ReportSectionType.STRUCTURED,
        order: 10,
        title: 'Current Medications'
    },
    [ReportSection.SUBJECTIVE_INFORMATION]: {
        type: ReportSectionTypes_1.ReportSectionType.FULL_NARRATIVE,
        order: 11,
        title: 'Subjective Information (Client Report)'
    },
    [ReportSection.SYMPTOM_MANAGEMENT]: {
        type: ReportSectionTypes_1.ReportSectionType.MODERATE_NARRATIVE,
        order: 12,
        title: 'Symptom Management Strategies'
    },
    [ReportSection.FUNCTIONAL_OBSERVATIONS]: {
        type: ReportSectionTypes_1.ReportSectionType.FULL_NARRATIVE,
        order: 13,
        title: 'Functional and Behavioural Observations'
    },
    [ReportSection.EMOTIONAL_PRESENTATION]: {
        type: ReportSectionTypes_1.ReportSectionType.MODERATE_NARRATIVE,
        order: 14,
        title: 'Emotional Presentation'
    },
    [ReportSection.COGNITIVE_PRESENTATION]: {
        type: ReportSectionTypes_1.ReportSectionType.MODERATE_NARRATIVE,
        order: 15,
        title: 'Cognitive Presentation'
    },
    [ReportSection.TYPICAL_DAY]: {
        type: ReportSectionTypes_1.ReportSectionType.FULL_NARRATIVE,
        order: 16,
        title: 'Typical Day'
    },
    [ReportSection.ENVIRONMENTAL_ASSESSMENT]: {
        type: ReportSectionTypes_1.ReportSectionType.MIXED,
        order: 17,
        title: 'Environmental Assessment'
    },
    [ReportSection.LIVING_ARRANGEMENTS]: {
        type: ReportSectionTypes_1.ReportSectionType.MODERATE_NARRATIVE,
        order: 18,
        title: 'Living Arrangements/Social Status'
    },
    [ReportSection.ADL_ASSESSMENT]: {
        type: ReportSectionTypes_1.ReportSectionType.FULL_NARRATIVE,
        order: 19,
        title: 'Activities of Daily Living'
    },
    [ReportSection.ATTENDANT_CARE]: {
        type: ReportSectionTypes_1.ReportSectionType.MIXED,
        order: 20,
        title: 'Attendant Care Requirements'
    },
    [ReportSection.AMA_GUIDES]: {
        type: ReportSectionTypes_1.ReportSectionType.FULL_NARRATIVE,
        order: 21,
        title: 'Assessment of the Four Spheres of Function'
    }
};
// Function to get section config
function getSectionConfig(section) {
    return exports.REPORT_STRUCTURE[section];
}
// Function to get ordered section list
function getOrderedSections() {
    return Object.entries(exports.REPORT_STRUCTURE)
        .sort(([, a], [, b]) => a.order - b.order)
        .map(([section]) => section);
}
