import { BaseAgent } from './BaseAgent';

export class ADLAgent extends BaseAgent {
  constructor(context: any) {
    super(
      context,
      4,
      'Activities of Daily Living',
      ['adl.basic', 'adl.iadl']
    );
  }

  process(data: any) {
    const adl = data.adl;

    return {
      basic: this.processBasicADL(adl.basic),
      instrumental: this.processIADL(adl.iadl),
      routines: this.processRoutines(adl.typicalDay),
      prePostComparison: this.comparePrePost(adl.typicalDay)
    };
  }

  private processBasicADL(basic: any) {
    if (!basic) return null;

    return {
      selfCare: {
        bathing: this.processActivity(basic.bathing),
        dressing: this.processActivity(basic.dressing),
        feeding: this.processActivity(basic.feeding),
        transfers: this.processActivity(basic.transfers)
      }
    };
  }

  private processIADL(iadl: any) {
    if (!iadl) return null;

    return {
      household: {
        cleaning: this.processActivity(iadl.household?.cleaning),
        laundry: this.processActivity(iadl.household?.laundry),
        mealPrep: this.processActivity(iadl.household?.meal_prep),
        maintenance: this.processActivity(iadl.household?.home_maintenance)
      },
      community: {
        transportation: this.processActivity(iadl.community?.transportation),
        shopping: this.processActivity(iadl.community?.shopping),
        finances: this.processActivity(iadl.community?.money_management),
        communication: this.processActivity(iadl.community?.communication)
      }
    };
  }

  private processActivity(activity: any) {
    if (!activity) return null;

    return {
      independence: activity.independence,
      notes: activity.notes,
      limitations: activity.limitations || []
    };
  }

  private processRoutines(typicalDay: any) {
    if (!typicalDay) return null;

    return {
      current: this.processDailySchedule(typicalDay.current),
      preAccident: this.processDailySchedule(typicalDay.preAccident)
    };
  }

  private processDailySchedule(schedule: any) {
    if (!schedule?.daily) return null;

    return {
      sleep: schedule.daily.sleepSchedule,
      morning: schedule.daily.routines?.morning?.activities,
      afternoon: schedule.daily.routines?.afternoon?.activities,
      evening: schedule.daily.routines?.evening?.activities
    };
  }

  private comparePrePost(typicalDay: any) {
    const changes = [];
    const pre = typicalDay?.preAccident;
    const post = typicalDay?.current;

    if (!pre || !post) return changes;

    // Compare sleep schedules
    if (pre.daily?.sleepSchedule?.wakeTime !== post.daily?.sleepSchedule?.wakeTime) {
      changes.push('Sleep schedule has changed');
    }

    // Compare routines
    ['morning', 'afternoon', 'evening'].forEach(time => {
      const preActivities = pre.daily?.routines?.[time]?.activities;
      const postActivities = post.daily?.routines?.[time]?.activities;
      if (preActivities !== postActivities) {
        changes.push(`${time} routine has changed`);
      }
    });

    return changes;
  }

  format(data: any): string {
    let report = 'ACTIVITIES OF DAILY LIVING\n\n';

    // Basic ADL
    if (data.basic) {
      report += 'Basic Activities of Daily Living:\n\n';
      
      const basic = data.basic.selfCare;
      
      if (basic.bathing) {
        report += 'Bathing and Hygiene:\n';
        report += `Independence Level: ${basic.bathing.independence}\n`;
        if (basic.bathing.notes) report += `${basic.bathing.notes}\n`;
        report += '\n';
      }

      if (basic.dressing) {
        report += 'Dressing:\n';
        report += `Independence Level: ${basic.dressing.independence}\n`;
        if (basic.dressing.notes) report += `${basic.dressing.notes}\n`;
        report += '\n';
      }
    }

    // IADL
    if (data.instrumental) {
      report += 'Instrumental Activities of Daily Living:\n\n';
      
      const household = data.instrumental.household;
      if (household) {
        report += 'Household Activities:\n';
        if (household.cleaning?.notes) report += `Cleaning: ${household.cleaning.notes}\n`;
        if (household.mealPrep?.notes) report += `Meal Preparation: ${household.mealPrep.notes}\n`;
        report += '\n';
      }

      const community = data.instrumental.community;
      if (community) {
        report += 'Community Activities:\n';
        if (community.transportation?.notes) report += `Transportation: ${community.transportation.notes}\n`;
        if (community.shopping?.notes) report += `Shopping: ${community.shopping.notes}\n`;
        report += '\n';
      }
    }

    // Daily Routines
    if (data.routines?.current) {
      report += 'Current Daily Routine:\n';
      const current = data.routines.current;
      if (current.morning) report += `Morning: ${current.morning}\n`;
      if (current.afternoon) report += `Afternoon: ${current.afternoon}\n`;
      if (current.evening) report += `Evening: ${current.evening}\n`;
      report += '\n';
    }

    // Changes from Pre-Accident
    if (data.prePostComparison?.length) {
      report += 'Changes from Pre-Accident Status:\n';
      data.prePostComparison.forEach((change: string) => {
        report += `• ${change}\n`;
      });
    }

    return report;
  }
}