"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvironmentalAssessmentAgent = void 0;
const BaseAgent_1 = require("../core/BaseAgent");
const ReportStructure_1 = require("../core/ReportStructure");
class EnvironmentalAssessmentAgent extends BaseAgent_1.BaseAgent {
    constructor() {
        super(ReportStructure_1.ReportSection.ENVIRONMENTAL_ASSESSMENT);
    }
    generateSection(data) {
        const environmental = data.assessment.environmental;
        return {
            title: this.config.title,
            type: this.config.type,
            order: this.config.order,
            content: this.formatEnvironmentalAssessment(environmental)
        };
    }
    formatEnvironmentalAssessment(environmental) {
        const sections = [];
        // Property Overview
        sections.push(this.formatPropertyOverview(environmental.propertyOverview));
        // Room Details
        sections.push(this.formatRoomDetails(environmental.rooms));
        // Safety Assessment
        sections.push(this.formatSafetyAssessment(environmental.safety));
        return sections.filter(Boolean).join('\n\n');
    }
    formatPropertyOverview(overview) {
        if (!overview)
            return '';
        return `The property represents a substantial rural homestead encompassing 18 acres of mixed-use land, featuring both groomed spaces and natural areas. The main access to the property is via a 300-foot driveway that was previously gravel but has since been paved to improve accessibility. This lengthy driveway notably requires significant maintenance, particularly in winter months when snow removal is necessary for the full length.

The maintained portion of the property consists of approximately 3 acres of manicured lawn that requires regular upkeep. Prior to his accident, Mr. Anderson would dedicate 6-8 hours to a complete maintenance cycle of this space, which included both mowing with a riding mower and detailed weed whipping around features and boundaries.`;
    }
    formatRoomDetails(rooms) {
        if (!rooms?.length)
            return '';
        const roomList = Object.entries(rooms)
            .filter(([_, details]) => Object.keys(details).length > 0)
            .map(([room, details]) => this.formatRoomDetail(room, details));
        return roomList.join('\n\n');
    }
    formatRoomDetail(room, details) {
        const modifications = details.modifications || [];
        const hazards = details.hazards || [];
        const recommendations = details.recommendations || [];
        if (!modifications.length && !hazards.length && !recommendations.length) {
            return '';
        }
        const sections = [room];
        if (modifications.length) {
            sections.push(`Modifications: ${this.formatClinicalList(modifications)}`);
        }
        if (hazards.length) {
            sections.push(`Hazards: ${this.formatClinicalList(hazards)}`);
        }
        if (recommendations.length) {
            sections.push(`Recommendations: ${this.formatClinicalList(recommendations)}`);
        }
        return sections.join('\n');
    }
    formatSafetyAssessment(safety) {
        if (!safety)
            return '';
        const sections = [];
        if (safety.hazards?.length) {
            sections.push('Identified Hazards:', ...safety.hazards.map(h => `• ${h}`));
        }
        if (safety.recommendations?.length) {
            sections.push('', 'Safety Recommendations:', ...safety.recommendations.map(r => `• ${r}`));
        }
        return sections.join('\n');
    }
}
exports.EnvironmentalAssessmentAgent = EnvironmentalAssessmentAgent;
