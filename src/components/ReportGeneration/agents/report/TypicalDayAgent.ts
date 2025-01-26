import { AssessmentData } from '../types';
import { BaseReportAgent, ReportSection, ReportSectionType } from './BaseReportAgent';

export class TypicalDayAgent extends BaseReportAgent {
    protected sectionType = ReportSectionType.FULL_NARRATIVE;

    public generateSection(data: AssessmentData): ReportSection {
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

    private analyzePreAccidentRoutine(data: any): string {
        if (!data) return '';

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

    private analyzeCurrentRoutine(data: any): string {
        if (!data) return '';

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

    private analyzeSleepSchedule(schedule: any, timeframe: string): string {
        if (!schedule) return '';

        return this.generateModerateNarrative({
            timeframe,
            wakeTime: schedule.wakeTime,
            bedTime: schedule.bedTime
        });
    }

    private analyzeRoutines(routines: any, timeframe: string): string {
        if (!routines) return '';

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

    private describeRoutine(period: string, activities: string): string {
        return `${period}: ${activities}`;
    }

    private analyzeWeeklyPattern(weekly: any, timeframe: string): string {
        if (!weekly) return '';
        return this.generateModerateNarrative({ timeframe, weekly });
    }

    private generateRoutineComparison(preAccident: any, current: any): string {
        return this.generateFullNarrative({
            preAccident,
            current,
            changes: this.identifySignificantChanges(preAccident, current)
        });
    }

    private identifySignificantChanges(preAccident: any, current: any): string[] {
        const changes = [];
        // Compare sleep schedules
        // Compare activity levels
        // Compare independence levels
        // etc.
        return changes;
    }
}