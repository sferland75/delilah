import { Assessment } from '../../../types';
import { BaseAgent } from './core/BaseAgent';
import { ReportSection, ReportSectionType, SectionContent, ValidationResult } from '../../../types/report';

interface RoutineData {
  activities?: string;
  notes?: string;
}

interface DailyRoutines {
  morning?: RoutineData;
  afternoon?: RoutineData;
  evening?: RoutineData;
  night?: RoutineData;
}

export class TypicalDayAgent extends BaseAgent {
  processData(data: Assessment): ValidationResult {
    const typicalDay = data.assessment.typicalDay;
    
    if (!typicalDay) {
      return {
        valid: false,
        errors: ['Missing typical day assessment data']
      };
    }

    const errors = this.validateRequired(typicalDay.current.daily, [
      'sleepSchedule',
      'routines'
    ]);

    return {
      valid: errors.length === 0,
      errors
    };
  }

  formatBrief(data: Assessment): SectionContent {
    const typicalDay = data.assessment.typicalDay;
    const sections = this.generateBriefSummary(typicalDay);

    return {
      type: ReportSectionType.NARRATIVE,
      title: 'Typical Day Overview',
      content: sections.join('\n\n'),
      orderNumber: 5
    };
  }

  formatDetailed(data: Assessment): SectionContent {
    const typicalDay = data.assessment.typicalDay;
    const sections = this.generateDetailedSummary(typicalDay);

    return {
      type: ReportSectionType.STRUCTURED,
      title: 'Detailed Daily Routine',
      content: sections.join('\n\n'),
      orderNumber: 5
    };
  }

  formatStandard(data: Assessment): SectionContent {
    const typicalDay = data.assessment.typicalDay;
    const sections = this.generateStandardSummary(typicalDay);

    return {
      type: ReportSectionType.STRUCTURED,
      title: 'Current Daily Routine',
      content: sections.join('\n\n'),
      orderNumber: 5
    };
  }

  private generateBriefSummary(typicalDay: any): string[] {
    const sections: string[] = [];
    const current = typicalDay.current.daily;
    
    // Sleep Schedule
    const sleep = current.sleepSchedule;
    if (sleep.wakeTime && sleep.bedTime) {
      sections.push(`Client's day typically begins at ${sleep.wakeTime} and ends at ${sleep.bedTime}.`);
    }

    // Basic routine summary
    sections.push('### Daily Routine Summary');
    
    const routines = current.routines;
    const periods = ['morning', 'afternoon', 'evening'] as const;
    
    periods.forEach(period => {
      if (routines[period]?.activities) {
        sections.push(`**${this.formatPeriod(period)}:** ${this.summarizeActivities(routines[period].activities)}`);
      }
    });

    return sections;
  }

  private generateDetailedSummary(typicalDay: any): string[] {
    const sections: string[] = [];
    const current = typicalDay.current.daily;
    
    // Sleep Schedule
    sections.push('## Sleep Schedule');
    const sleep = current.sleepSchedule;
    if (sleep.wakeTime && sleep.bedTime) {
      sections.push(`- Wake Time: ${sleep.wakeTime}`);
      sections.push(`- Bed Time: ${sleep.bedTime}`);
    }

    // Detailed routines
    sections.push('## Daily Routines');
    
    const routines = current.routines;
    const periods = ['morning', 'afternoon', 'evening', 'night'] as const;
    
    periods.forEach(period => {
      if (routines[period]?.activities) {
        sections.push(`### ${this.formatPeriod(period)} Activities`);
        const activities = routines[period].activities.split('\n');
        sections.push(activities.map((activity: string) => `- ${activity}`).join('\n'));
      }
    });

    return sections;
  }

  private generateStandardSummary(typicalDay: any): string[] {
    const sections: string[] = [];
    const current = typicalDay.current.daily;
    
    // Sleep Schedule
    sections.push('### Sleep Pattern');
    const sleep = current.sleepSchedule;
    if (sleep.wakeTime && sleep.bedTime) {
      sections.push(`Client maintains a sleep schedule of ${sleep.bedTime} to ${sleep.wakeTime}.`);
    }

    // Daily Routines
    sections.push('### Daily Activities');
    
    const routines = current.routines;
    const periods = ['morning', 'afternoon', 'evening'] as const;
    
    periods.forEach(period => {
      if (routines[period]?.activities) {
        sections.push(`#### ${this.formatPeriod(period)}`);
        const activities = routines[period].activities.split('\n');
        sections.push(activities.map((activity: string) => `- ${activity.trim()}`).join('\n'));
      }
    });

    return sections;
  }

  private formatPeriod(period: string): string {
    return period.charAt(0).toUpperCase() + period.slice(1);
  }

  private summarizeActivities(activities: string): string {
    const lines = activities.split('\n');
    if (lines.length <= 2) return activities;
    
    return lines.slice(0, 2).join('. ') + '...';
  }
}