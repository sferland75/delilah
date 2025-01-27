"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypicalDayAgent = void 0;
const BaseAgent_1 = require("../core/BaseAgent");
const ReportStructure_1 = require("../core/ReportStructure");
class TypicalDayAgent extends BaseAgent_1.BaseAgent {
    constructor() {
        super(ReportStructure_1.ReportSection.TYPICAL_DAY);
    }
    generateSection(data) {
        const typicalDay = data.assessment.typicalDay;
        const content = [
            this.formatPreAccidentRoutine(typicalDay.preAccident),
            this.formatCurrentRoutine(typicalDay.current)
        ].filter(Boolean).join('\n\n');
        return {
            title: this.config.title,
            type: this.config.type,
            order: this.config.order,
            content
        };
    }
    formatPreAccidentRoutine(data) {
        if (!data)
            return '';
        const sections = ['Pre-Accident:'];
        // Work schedule
        if (data.daily?.routines) {
            sections.push('He maintained an active work schedule at the Darlington Power Plant in a supervisory role, typically working 12-13 hour shifts, four days per week (2.5 hours away). He maintained accommodations near the nuclear plant where he worked and would return home after his shifts were completed for three days.');
        }
        // Activity level
        sections.push('When home, he engaged regularly in home maintenance activities around his large property and participated in various outdoor activities including hunting, fishing and recreational vehicle use.');
        return sections.join('\n\n');
    }
    formatCurrentRoutine(data) {
        if (!data)
            return '';
        const sections = ['Current Daily Routine:'];
        const routines = [];
        // Morning Routine
        if (data.daily?.routines?.morning?.activities) {
            routines.push(this.formatTimeBlock('Morning', `He typically wakes at ${data.daily.sleepSchedule?.wakeTime || '5:00 AM'} and ${data.daily.routines.morning.activities}`));
        }
        // Afternoon Routine
        if (data.daily?.routines?.afternoon?.activities) {
            routines.push(this.formatTimeBlock('Afternoon', data.daily.routines.afternoon.activities));
        }
        // Evening Routine
        if (data.daily?.routines?.evening?.activities) {
            routines.push(this.formatTimeBlock('Evening', data.daily.routines.evening.activities));
        }
        // Night/Sleep
        if (data.daily?.sleepSchedule?.bedTime) {
            routines.push(this.formatTimeBlock('Night', `Retires around ${data.daily.sleepSchedule.bedTime}.`));
        }
        sections.push(routines.join('\n\n'));
        return sections.join('\n\n');
    }
    formatTimeBlock(period, activities) {
        return `${period}: ${activities}`;
    }
}
exports.TypicalDayAgent = TypicalDayAgent;
