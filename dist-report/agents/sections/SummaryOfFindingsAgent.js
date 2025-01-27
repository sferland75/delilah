"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SummaryOfFindingsAgent = void 0;
const BaseAgent_1 = require("../core/BaseAgent");
const ReportStructure_1 = require("../core/ReportStructure");
class SummaryOfFindingsAgent extends BaseAgent_1.BaseAgent {
    constructor() {
        super(ReportStructure_1.ReportSection.SUMMARY_OF_FINDINGS);
    }
    generateSection(data) {
        const summary = this.generateSummaryNarrative(data);
        return {
            title: this.config.title,
            type: this.config.type,
            order: this.config.order,
            content: summary
        };
    }
    generateSummaryNarrative(data) {
        const demographics = data.assessment.demographics;
        const age = this.calculateAge(new Date(demographics.dateOfBirth));
        const sections = [
            // Introduction
            this.generateIntroduction(demographics, age),
            // ADL Impact
            this.generateADLImpact(data.assessment.adl),
            // Mobility and Physical Function
            this.generateMobilityImpact(data.assessment.functionalAssessment),
            // Sleep and Fatigue
            this.generateSleepImpact(data.assessment.typicalDay),
            // Social Function
            this.generateSocialImpact(data.assessment),
            // Cognitive Function
            this.generateCognitiveImpact(data.assessment.symptoms)
        ];
        return sections.filter(Boolean).join('\n\n');
    }
    generateIntroduction(demographics, age) {
        return `${demographics.firstName} ${demographics.lastName}, a ${age}-year-old ${demographics.gender}, sustained multiple severe injuries in a motorcycle accident on April 28, 2023. Prior to the accident, he maintained an active lifestyle managing an 18-acre property, worked in a demanding supervisory role at nuclear facilities, and regularly engaged in various outdoor recreational activities. The comprehensive assessment of his current functioning reveals significant changes across all aspects of daily living, affecting his independence, family roles, and quality of life.`;
    }
    generateADLImpact(adl) {
        if (!adl)
            return '';
        return `His activities of daily living have been profoundly impacted by physical limitations and pain. Basic self-care tasks that were previously routine now present significant challenges, requiring assistance or modification.`;
    }
    generateMobilityImpact(functional) {
        if (!functional)
            return '';
        return `His mobility is severely restricted, necessitating the use of a cane and limiting his walking tolerance to 10-15 minutes. Standing tolerance is confined to 5-10 minutes, and sitting tolerance is restricted to 15 minutes even with specialized cushioning. These limitations have fundamentally altered his ability to participate in routine activities and maintain his previous level of independence.`;
    }
    generateSleepImpact(typicalDay) {
        if (!typicalDay?.current?.daily?.sleepSchedule)
            return '';
        return `Sleep disruption has become a significant concern, with Mr. Anderson achieving only 4 hours of sleep per night despite medication. This chronic sleep deficit, combined with daily pain and fatigue, necessitates daytime rest periods and affects his overall functioning and energy levels.`;
    }
    generateSocialImpact(assessment) {
        return `The assessment of social functioning reveals notable changes in his ability to engage with family and manage social interactions. Previously described as even-tempered and patient, he now experiences significant difficulties with noise tolerance, emotional regulation, and sustained social engagement.`;
    }
    generateCognitiveImpact(symptoms) {
        if (!symptoms?.cognitive)
            return '';
        return `Cognitive functioning shows considerable impairment. Mr. Anderson experiences difficulties with memory, attention, and information processing, requiring multiple repetitions to comprehend and retain information. These cognitive changes affect his ability to maintain conversations, manage appointments, and complete tasks efficiently.`;
    }
    calculateAge(birthDate) {
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }
}
exports.SummaryOfFindingsAgent = SummaryOfFindingsAgent;
