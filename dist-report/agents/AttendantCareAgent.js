"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendantCareAgent = void 0;
const BaseAgent_1 = require("./BaseAgent");
const form1Calculations_1 = require("./utils/form1Calculations");
const lodash_1 = __importDefault(require("lodash"));
class AttendantCareAgent extends BaseAgent_1.BaseAgent {
    constructor(context) {
        super(context, 5.0, 'Attendant Care', ['care', 'functionalAssessment']);
        this.defaultRate = {
            regular: 22.50, // Current PSW rate
            holiday: 33.75, // 1.5x regular rate
            complex: 28.13 // 1.25x regular rate for complex care
        };
    }
    async processData(data) {
        try {
            // Get direct care data and functional assessment data
            const care = lodash_1.default.get(data, 'care', {});
            const functional = lodash_1.default.get(data, 'functionalAssessment', {});
            // Process Level 1 - Personal Care
            const level1 = this.processLevel1Care(functional);
            // Process Level 2 - Housekeeping and Meals
            const level2 = this.processLevel2Care(functional);
            // Process Level 3 - Coordination
            const level3 = this.processLevel3Care(functional);
            // Calculate totals
            const calculations = (0, form1Calculations_1.calculateForm1Totals)(level1, level2, level3);
            const form1Data = {
                level1,
                level2,
                level3,
                calculations,
                assessor: {
                    name: "Assessor Name", // TODO: Get from context
                    credentials: "OT Reg. (Ont.)",
                    date: new Date().toISOString().split('T')[0]
                }
            };
            return {
                valid: true,
                data: form1Data
            };
        }
        catch (error) {
            this.context.logger.error(`Error processing attendant care: ${error}`);
            return {
                valid: false,
                data: {
                    level1: this.createEmptyLevel1(),
                    level2: this.createEmptyLevel2(),
                    level3: this.createEmptyLevel3(),
                    calculations: {
                        level1: { routineTotal: 0, overnightTotal: 0, levelTotal: 0, monthlyCost: 0 },
                        level2: { housekeepingTotal: 0, mealPrepTotal: 0, levelTotal: 0, monthlyCost: 0 },
                        level3: { coordinationTotal: 0, transportationTotal: 0, levelTotal: 0, monthlyCost: 0 },
                        summary: { totalHours: 0, totalCost: 0, annualCost: 0 }
                    }
                }
            };
        }
    }
    processLevel1Care(functional) {
        const adl = functional.adl || {};
        return {
            routinePersonalCare: {
                dressing: {
                    hours: this.calculateDressingHours(adl),
                    rate: this.defaultRate,
                    notes: "Based on ADL assessment"
                },
                bathing: {
                    hours: this.calculateBathingHours(adl),
                    rate: this.defaultRate,
                    notes: "Based on ADL assessment"
                },
                toileting: {
                    hours: this.calculateToiletingHours(adl),
                    rate: this.defaultRate,
                    notes: "Based on ADL assessment"
                },
                transferring: {
                    hours: this.calculateTransferHours(adl),
                    rate: this.defaultRate,
                    notes: "Based on transfer assessment"
                }
                // Additional activities...
            },
            overnightCare: {
                turning: {
                    hours: this.calculateOvernightTurningHours(adl),
                    rate: this.defaultRate,
                    notes: "Based on positioning needs"
                }
                // Additional overnight activities...
            }
        };
    }
    processLevel2Care(functional) {
        const iadl = functional.iadl || {};
        return {
            housekeeping: {
                cleaning: {
                    hours: this.calculateCleaningHours(iadl),
                    rate: this.defaultRate,
                    notes: "Based on IADL assessment"
                },
                laundry: {
                    hours: this.calculateLaundryHours(iadl),
                    rate: this.defaultRate,
                    notes: "Based on IADL assessment"
                }
                // Additional housekeeping activities...
            },
            mealPreparation: {
                breakfast: {
                    hours: this.calculateMealPrepHours(iadl, 'breakfast'),
                    rate: this.defaultRate,
                    notes: "Based on IADL assessment"
                },
                lunch: {
                    hours: this.calculateMealPrepHours(iadl, 'lunch'),
                    rate: this.defaultRate,
                    notes: "Based on IADL assessment"
                },
                dinner: {
                    hours: this.calculateMealPrepHours(iadl, 'dinner'),
                    rate: this.defaultRate,
                    notes: "Based on IADL assessment"
                }
                // Additional meal activities...
            }
        };
    }
    processLevel3Care(functional) {
        const iadl = functional.iadl || {};
        return {
            coordination: {
                scheduling: {
                    hours: this.calculateSchedulingHours(iadl),
                    rate: this.defaultRate,
                    notes: "Based on IADL assessment"
                }
                // Additional coordination activities...
            },
            transportation: {
                medical: {
                    hours: this.calculateTransportationHours(iadl, 'medical'),
                    rate: this.defaultRate,
                    notes: "Based on IADL assessment"
                }
                // Additional transportation activities...
            }
        };
    }
    // Calculation helpers
    calculateDressingHours(adl) {
        const independence = lodash_1.default.get(adl, 'dressing.independence', 'independent');
        const baseHours = {
            'independent': 0,
            'modified_independent': 0.5,
            'supervision': 1,
            'minimal_assistance': 1.5,
            'moderate_assistance': 2,
            'maximal_assistance': 2.5,
            'total_assistance': 3
        };
        return (baseHours[independence] || 0) * 30; // Monthly hours
    }
    // Add more calculation helpers for each activity...
    formatBrief(data) {
        if (!data.valid)
            return 'Unable to process attendant care requirements';
        const sections = ['Form 1: Assessment of Attendant Care Needs'];
        const totals = data.data.calculations.summary;
        sections.push(`\nTotal Monthly Care Required: ${totals.totalHours.toFixed(1)} hours`);
        sections.push(`Monthly Cost: $${totals.totalCost.toFixed(2)}`);
        sections.push(`Annual Cost: $${totals.annualCost.toFixed(2)}`);
        return sections.join('\n');
    }
    formatStandard(data) {
        if (!data.valid)
            return 'Unable to process attendant care requirements';
        const sections = ['Form 1: Assessment of Attendant Care Needs'];
        // Level 1 Summary
        sections.push('\nLevel 1: Personal Care');
        sections.push(`Routine Personal Care: ${data.data.calculations.level1.routineTotal.toFixed(1)} hours`);
        sections.push(`Overnight Care: ${data.data.calculations.level1.overnightTotal.toFixed(1)} hours`);
        sections.push(`Total Level 1: ${data.data.calculations.level1.levelTotal.toFixed(1)} hours`);
        sections.push(`Monthly Cost: $${data.data.calculations.level1.monthlyCost.toFixed(2)}`);
        // Level 2 Summary
        sections.push('\nLevel 2: Housekeeping');
        sections.push(`Housekeeping: ${data.data.calculations.level2.housekeepingTotal.toFixed(1)} hours`);
        sections.push(`Meal Preparation: ${data.data.calculations.level2.mealPrepTotal.toFixed(1)} hours`);
        sections.push(`Total Level 2: ${data.data.calculations.level2.levelTotal.toFixed(1)} hours`);
        sections.push(`Monthly Cost: $${data.data.calculations.level2.monthlyCost.toFixed(2)}`);
        // Level 3 Summary
        sections.push('\nLevel 3: Coordination');
        sections.push(`Coordination: ${data.data.calculations.level3.coordinationTotal.toFixed(1)} hours`);
        sections.push(`Transportation: ${data.data.calculations.level3.transportationTotal.toFixed(1)} hours`);
        sections.push(`Total Level 3: ${data.data.calculations.level3.levelTotal.toFixed(1)} hours`);
        sections.push(`Monthly Cost: $${data.data.calculations.level3.monthlyCost.toFixed(2)}`);
        // Overall Summary
        sections.push('\nTotal Care Requirements');
        sections.push(`Total Monthly Hours: ${data.data.calculations.summary.totalHours.toFixed(1)}`);
        sections.push(`Total Monthly Cost: $${data.data.calculations.summary.totalCost.toFixed(2)}`);
        sections.push(`Total Annual Cost: $${data.data.calculations.summary.annualCost.toFixed(2)}`);
        return sections.join('\n');
    }
    formatDetailed(data) {
        if (!data.valid)
            return 'Unable to process attendant care requirements';
        const sections = ['Form 1: Detailed Assessment of Attendant Care Needs'];
        // Level 1 Details
        sections.push('\nLevel 1: Personal Care');
        sections.push('\nRoutine Personal Care:');
        Object.entries(data.data.level1.routinePersonalCare).forEach(([activity, details]) => {
            if (details.hours > 0) {
                sections.push(`- ${activity}:`);
                sections.push(`  Hours: ${details.hours.toFixed(1)}`);
                sections.push(`  Rate: $${details.rate.regular}/hr (Regular), $${details.rate.holiday}/hr (Holiday)`);
                if (details.notes)
                    sections.push(`  Notes: ${details.notes}`);
            }
        });
        // ... Similar detailed sections for Level 2 and 3
        // Calculations Summary
        sections.push('\nSummary of Care Requirements:');
        sections.push(`\nLevel 1 Total: ${data.data.calculations.level1.levelTotal.toFixed(1)} hours`);
        sections.push(`- Routine Care: ${data.data.calculations.level1.routineTotal.toFixed(1)} hours`);
        sections.push(`- Overnight Care: ${data.data.calculations.level1.overnightTotal.toFixed(1)} hours`);
        sections.push(`- Monthly Cost: $${data.data.calculations.level1.monthlyCost.toFixed(2)}`);
        sections.push(`\nLevel 2 Total: ${data.data.calculations.level2.levelTotal.toFixed(1)} hours`);
        sections.push(`- Housekeeping: ${data.data.calculations.level2.housekeepingTotal.toFixed(1)} hours`);
        sections.push(`- Meal Preparation: ${data.data.calculations.level2.mealPrepTotal.toFixed(1)} hours`);
        sections.push(`- Monthly Cost: $${data.data.calculations.level2.monthlyCost.toFixed(2)}`);
        sections.push(`\nLevel 3 Total: ${data.data.calculations.level3.levelTotal.toFixed(1)} hours`);
        sections.push(`- Coordination: ${data.data.calculations.level3.coordinationTotal.toFixed(1)} hours`);
        sections.push(`- Transportation: ${data.data.calculations.level3.transportationTotal.toFixed(1)} hours`);
        sections.push(`- Monthly Cost: $${data.data.calculations.level3.monthlyCost.toFixed(2)}`);
        sections.push('\nOverall Totals:');
        sections.push(`Total Monthly Hours: ${data.data.calculations.summary.totalHours.toFixed(1)}`);
        sections.push(`Total Monthly Cost: $${data.data.calculations.summary.totalCost.toFixed(2)}`);
        sections.push(`Total Annual Cost: $${data.data.calculations.summary.annualCost.toFixed(2)}`);
        // Assessor Information
        if (data.data.assessor) {
            sections.push('\nAssessment Details:');
            sections.push(`Completed by: ${data.data.assessor.name}`);
            sections.push(`Credentials: ${data.data.assessor.credentials}`);
            sections.push(`Date: ${data.data.assessor.date}`);
        }
        return sections.join('\n');
    }
    createEmptyLevel1() {
        return {
            routinePersonalCare: {},
            overnightCare: {}
        };
    }
    createEmptyLevel2() {
        return {
            housekeeping: {},
            mealPreparation: {}
        };
    }
    createEmptyLevel3() {
        return {
            coordination: {},
            transportation: {}
        };
    }
}
exports.AttendantCareAgent = AttendantCareAgent;
