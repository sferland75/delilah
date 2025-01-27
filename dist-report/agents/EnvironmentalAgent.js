"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvironmentalAgent = void 0;
const BaseAgent_1 = require("./BaseAgent");
class EnvironmentalAgent extends BaseAgent_1.BaseAgent {
    constructor(context) {
        super(context, 5, 'Environmental Assessment', ['environmental.propertyOverview']);
    }
    process(data) {
        const env = data.environmental;
        return {
            property: this.processProperty(env.propertyOverview),
            rooms: this.processRooms(env.rooms),
            safety: this.processSafety(env.safety),
            accessibility: this.assessAccessibility(env)
        };
    }
    processProperty(overview) {
        if (!overview)
            return null;
        return {
            modifications: overview.recommendedModifications || [],
            hazards: overview.identifiedHazards || [],
            rooms: Object.keys(overview.rooms || {})
        };
    }
    processRooms(rooms) {
        if (!rooms?.length)
            return [];
        return rooms.map(room => ({
            name: room.name,
            hazards: room.hazards || [],
            modifications: room.modifications || [],
            notes: room.notes
        }));
    }
    processSafety(safety) {
        if (!safety)
            return null;
        return {
            hazards: safety.hazards || [],
            recommendations: safety.recommendations || []
        };
    }
    assessAccessibility(env) {
        const issues = [];
        // Check for stairs
        if (env.propertyOverview?.rooms?.some(room => room.hasStairs)) {
            issues.push('Multiple levels present - stair access required');
        }
        // Check bathroom accessibility
        const bathrooms = env.rooms?.filter(room => room.name.toLowerCase().includes('bathroom'));
        bathrooms?.forEach(bathroom => {
            if (!bathroom.hasGrabBars) {
                issues.push('Bathroom lacking grab bars');
            }
        });
        return issues;
    }
    format(data) {
        let report = 'ENVIRONMENTAL ASSESSMENT\n\n';
        // Property Overview
        if (data.property) {
            report += 'Property Overview:\n';
            if (data.property.rooms?.length) {
                report += 'Rooms Present:\n';
                data.property.rooms.forEach((room) => {
                    report += `• ${room}\n`;
                });
                report += '\n';
            }
        }
        // Room Details
        if (data.rooms?.length) {
            report += 'Room-Specific Assessments:\n\n';
            data.rooms.forEach((room) => {
                if (room.hazards?.length || room.modifications?.length || room.notes) {
                    report += `${room.name}:\n`;
                    if (room.hazards?.length) {
                        room.hazards.forEach((hazard) => {
                            report += `• Hazard: ${hazard}\n`;
                        });
                    }
                    if (room.modifications?.length) {
                        room.modifications.forEach((mod) => {
                            report += `• Modification: ${mod}\n`;
                        });
                    }
                    if (room.notes)
                        report += `Notes: ${room.notes}\n`;
                    report += '\n';
                }
            });
        }
        // Safety Concerns
        if (data.safety) {
            if (data.safety.hazards?.length) {
                report += 'Safety Hazards:\n';
                data.safety.hazards.forEach((hazard) => {
                    report += `• ${hazard}\n`;
                });
                report += '\n';
            }
            if (data.safety.recommendations?.length) {
                report += 'Safety Recommendations:\n';
                data.safety.recommendations.forEach((rec) => {
                    report += `• ${rec}\n`;
                });
                report += '\n';
            }
        }
        // Accessibility Issues
        if (data.accessibility?.length) {
            report += 'Accessibility Concerns:\n';
            data.accessibility.forEach((issue) => {
                report += `• ${issue}\n`;
            });
        }
        return report;
    }
}
exports.EnvironmentalAgent = EnvironmentalAgent;
