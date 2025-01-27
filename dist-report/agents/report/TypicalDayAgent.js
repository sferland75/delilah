"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypicalDayAgent = void 0;
const BaseReportAgent_1 = require("./BaseReportAgent");
class TypicalDayAgent extends BaseReportAgent_1.BaseReportAgent {
    constructor() {
        super(...arguments);
        this.sectionType = BaseReportAgent_1.ReportSectionType.FULL_NARRATIVE;
    }
    generateSection(data) {
        const typicalDay = data.assessment.typicalDay;
        return {
            title: 'Typical Day Analysis',
            type: this.sectionType,
            order: 5,
            content: this.generateFullNarrative({
                preAccident: this.analyzePreAccidentRoutine(typicalDay.preAccident),
                current: this.analyzeCurrentRoutine(typicalDay.current),
                comparison: this.generateRoutineComparison(typicalDay.preAccident, typicalDay.current)
            })
        };
    }
    analyzePreAccidentRoutine(data) {
        if (!data)
            return '';
        const routineNarrative = [];
        if (data.daily?.sleepSchedule) {
            routineNarrative.push(this.analyzeSleepSchedule(data.daily.sleepSchedule, 'Pre-accident'));
        }
        if (data.daily?.routines) {
            routineNarrative.push(this.analyzeRoutines(data.daily.routines, 'Pre-accident'));
        }
        if (data.weekly) {
            routineNarrative.push(this.analyzeWeeklyPattern(data.weekly, 'Pre-accident'));
        }
        return routineNarrative.join('\n\n');
    }
    analyzeCurrentRoutine(data) {
        if (!data)
            return '';
        const routineNarrative = [];
        if (data.daily?.sleepSchedule) {
            routineNarrative.push(this.analyzeSleepSchedule(data.daily.sleepSchedule, 'Current'));
        }
        if (data.daily?.routines) {
            routineNarrative.push(this.analyzeRoutines(data.daily.routines, 'Current'));
        }
        if (data.weekly) {
            routineNarrative.push(this.analyzeWeeklyPattern(data.weekly, 'Current'));
        }
        return routineNarrative.join('\n\n');
    }
    analyzeSleepSchedule(schedule, timeframe) {
        if (!schedule)
            return '';
        return this.generateModerateNarrative({
            timeframe,
            wakeTime: schedule.wakeTime,
            bedTime: schedule.bedTime
        });
    }
    analyzeRoutines(routines, timeframe) {
        if (!routines)
            return '';
        const routineDescriptions = [];
        if (routines.morning?.activities) {
            routineDescriptions.push(this.describeRoutine('Morning', routines.morning.activities));
        }
        if (routines.afternoon?.activities) {
            routineDescriptions.push(this.describeRoutine('Afternoon', routines.afternoon.activities));
        }
        if (routines.evening?.activities) {
            routineDescriptions.push(this.describeRoutine('Evening', routines.evening.activities));
        }
        if (routines.night?.activities) {
            routineDescriptions.push(this.describeRoutine('Night', routines.night.activities));
        }
        return routineDescriptions.join('\n\n');
    }
    describeRoutine(period, activities) {
        return `${period}: ${activities}`;
    }
    analyzeWeeklyPattern(weekly, timeframe) {
        if (!weekly)
            return '';
        return this.generateModerateNarrative({ timeframe, weekly });
    }
    generateRoutineComparison(preAccident, current) {
        return this.generateFullNarrative({
            preAccident,
            current,
            changes: this.identifySignificantChanges(preAccident, current)
        });
    }
    identifySignificantChanges(preAccident, current) {
        const changes = [];
        // Compare sleep schedules
        // Compare activity levels
        // Compare independence levels
        // etc.
        return changes;
    }
}
exports.TypicalDayAgent = TypicalDayAgent;
