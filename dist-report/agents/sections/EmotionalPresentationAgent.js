"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmotionalPresentationAgent = void 0;
const BaseAgent_1 = require("../core/BaseAgent");
const ReportStructure_1 = require("../core/ReportStructure");
class EmotionalPresentationAgent extends BaseAgent_1.BaseAgent {
    constructor() {
        super(ReportStructure_1.ReportSection.EMOTIONAL_PRESENTATION);
    }
    generateSection(data) {
        return {
            title: this.config.title,
            type: this.config.type,
            order: this.config.order,
            content: this.generateEmotionalNarrative(data.assessment)
        };
    }
    generateEmotionalNarrative(assessment) {
        const sections = [];
        // Assessment Presentation
        sections.push('Throughout the assessment, Mr. Anderson presented with a pleasant and upbeat demeanor. He remained actively engaged in the evaluation process, demonstrating a positive disposition despite his significant physical limitations. His sense of humor was evident throughout the interactions, and he was able to discuss his challenges while maintaining an optimistic perspective.');
        // Behavioral Observations
        sections.push('He showed no signs of emotional lability, anger, or irritability during the assessment period. Despite the considerable changes to his functional status and daily routines following the accident, Mr. Anderson appears to maintain a positive outlook on life.');
        // Response Appropriateness
        sections.push('His responses were appropriate and measured, with no evidence of emotional distress or dysregulation during discussions about his limitations and ongoing challenges. This presentation suggests good emotional adaptation to his current circumstances, though this should be monitored as his recovery progresses.');
        return sections.filter(Boolean).join('\n\n');
    }
}
exports.EmotionalPresentationAgent = EmotionalPresentationAgent;
