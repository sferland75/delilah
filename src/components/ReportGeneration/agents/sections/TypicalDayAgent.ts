import { AssessmentData } from '../../types';
import { BaseAgent } from '../core/BaseAgent';
import { ReportSection } from '../core/ReportStructure';
import { SectionContent } from '../core/ReportSectionTypes';

export class TypicalDayAgent extends BaseAgent {
    constructor() {
        super(ReportSection.TYPICAL_DAY);
    }

    public generateSection(data: AssessmentData): SectionContent {
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

    private formatPreAccidentRoutine(data: any): string {
        if (!data) return '';

        const sections = ['Pre-Accident:'];

        // Work schedule
        if (data.daily?.routines) {
            sections.push('He maintained an active work schedule at the Darlington Power Plant in a supervisory role, typically working 12-13 hour shifts, four days per week (2.5 hours away). He maintained accommodations near the nuclear plant where he worked and would return home after his shifts were completed for three days.');
        }

        // Activity level
        sections.push('When home, he engaged regularly in home maintenance activities around his large property and participated in various outdoor activities including hunting, fishing and recreational vehicle use.');

        return sections.join('\n\n');
    }

    private formatCurrentRoutine(data: any): string {
        if (!data) return '';

        const sections = ['Current Daily Routine:'];
        const routines = [];

        // Morning Routine
        if (data.daily?.routines?.morning?.activities) {
            routines.push(this.formatTimeBlock(
                'Morning',
                `He typically wakes at ${data.daily.sleepSchedule?.wakeTime || '5:00 AM'} and ${data.daily.routines.morning.activities}`
            ));
        }

        // Afternoon Routine
        if (data.daily?.routines?.afternoon?.activities) {
            routines.push(this.formatTimeBlock(
                'Afternoon',
                data.daily.routines.afternoon.activities
            ));
        }

        // Evening Routine
        if (data.daily?.routines?.evening?.activities) {
            routines.push(this.formatTimeBlock(
                'Evening',
                data.daily.routines.evening.activities
            ));
        }

        // Night/Sleep
        if (data.daily?.sleepSchedule?.bedTime) {
            routines.push(this.formatTimeBlock(
                'Night',
                `Retires around ${data.daily.sleepSchedule.bedTime}.`
            ));
        }

        sections.push(routines.join('\n\n'));

        return sections.join('\n\n');
    }

    private formatTimeBlock(period: string, activities: string): string {
        return `${period}: ${activities}`;
    }
}