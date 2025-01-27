"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RISK_PATTERNS = void 0;
exports.identifyRisks = identifyRisks;
exports.RISK_PATTERNS = {
    transportation: [
        {
            triggers: ['pain', 'break', 'fatigue'],
            risk: 'Risk of unsafe driving due to pain/fatigue',
            mitigation: 'Regular breaks, limit driving duration, consider alternative transportation'
        }
    ],
    cleaning: [
        {
            triggers: ['balance', 'fall', 'dizzy'],
            risk: 'Fall risk during cleaning activities',
            mitigation: 'Use of stable equipment, seated cleaning when possible, assistance for high-risk tasks'
        }
    ],
    meal_prep: [
        {
            triggers: ['burn', 'cut', 'sharp'],
            risk: 'Risk of injury during food preparation',
            mitigation: 'Use of adaptive equipment, safety mechanisms on appliances, supervision during high-risk tasks'
        }
    ],
    shopping: [
        {
            triggers: ['carry', 'lift', 'heavy'],
            risk: 'Risk of injury from lifting/carrying',
            mitigation: 'Use of cart/delivery services, assistance for heavy items'
        }
    ],
    laundry: [
        {
            triggers: ['balance', 'carry', 'lift'],
            risk: 'Risk of falls/injury during laundry tasks',
            mitigation: 'Front-loading machines, laundry service, assistance for heavy loads'
        }
    ],
    home_maintenance: [
        {
            triggers: ['ladder', 'climb', 'height'],
            risk: 'Risk of falls from heights',
            mitigation: 'Professional services for elevated tasks, avoid climbing'
        },
        {
            triggers: ['tools', 'power', 'equipment'],
            risk: 'Risk of injury from power tools/equipment',
            mitigation: 'Professional services for complex maintenance tasks'
        }
    ]
};
function identifyRisks(activity, details) {
    const notesLower = details.notes.toLowerCase();
    // Check if any patterns match for this activity
    const activityPatterns = exports.RISK_PATTERNS[activity] || [];
    for (const pattern of activityPatterns) {
        if (pattern.triggers.some(trigger => notesLower.includes(trigger))) {
            return {
                activity,
                risk: pattern.risk,
                mitigation: pattern.mitigation
            };
        }
    }
    // Generic risk assessment based on independence level
    if (['maximal_assistance', 'total_assistance'].includes(details.independence)) {
        return {
            activity,
            risk: `High risk of injury due to significant functional limitations`,
            mitigation: 'Close supervision and assistance required for all aspects of task'
        };
    }
    return null;
}
