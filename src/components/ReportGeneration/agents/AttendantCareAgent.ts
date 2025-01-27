import { BaseAgent } from './BaseAgent';
import { AgentContext, Assessment } from '../../types';
import { IndependenceLevel, INDEPENDENCE_LEVELS } from './adl/types';
import _ from 'lodash';

interface AttendantCareCalculation {
  hours: number;
  rationale: string;
}

export class AttendantCareAgent extends BaseAgent {
  constructor(context: AgentContext) {
    super(context);
    this.priority = 5;
    this.name = 'Attendant Care';
    this.dataKeys = ['functionalAssessment.adl', 'functionalAssessment.iadl'];
  }

  private calculateBathingHours(adl: any): number {
    const baseHours = {
      independent: 0,
      modified_independent: 0.25,
      supervision: 0.5,
      minimal_assistance: 0.75,
      moderate_assistance: 1,
      maximal_assistance: 1.25,
      total_assistance: 1.5
    };
    const independence = adl.bathing?.independence || 'total_assistance';
    return (baseHours[independence] || 0) * 30; // Monthly hours
  }

  private calculateToiletingHours(adl: any): number {
    const baseHours = {
      independent: 0,
      modified_independent: 0.25,
      supervision: 0.5,
      minimal_assistance: 1,
      moderate_assistance: 1.5,
      maximal_assistance: 2,
      total_assistance: 2.5
    };
    const independence = adl.toileting?.independence || 'total_assistance';
    return (baseHours[independence] || 0) * 30;
  }

  private calculateTransferHours(adl: any): number {
    const baseHours = {
      independent: 0,
      modified_independent: 0.25,
      supervision: 0.5,
      minimal_assistance: 1,
      moderate_assistance: 1.5,
      maximal_assistance: 2,
      total_assistance: 2.5
    };
    const independence = adl.transfers?.independence || 'total_assistance';
    return (baseHours[independence] || 0) * 30;
  }

  private calculateOvernightTurningHours(adl: any): number {
    if (adl.transfers?.independence === 'independent' || 
        adl.transfers?.independence === 'modified_independent') {
      return 0;
    }
    return 60; // 2 hours per night * 30 days
  }

  private calculateDressingHours(adl: any): number {
    const baseHours = {
      independent: 0,
      modified_independent: 0.25,
      supervision: 0.5,
      minimal_assistance: 0.75,
      moderate_assistance: 1,
      maximal_assistance: 1.25,
      total_assistance: 1.5
    };
    const independence = adl.dressing?.independence || 'total_assistance';
    return (baseHours[independence] || 0) * 30;
  }

  private calculateCleaningHours(iadl: any): number {
    const baseHours = {
      independent: 0,
      modified_independent: 2,
      supervision: 4,
      minimal_assistance: 6,
      moderate_assistance: 8,
      maximal_assistance: 10,
      total_assistance: 12
    };
    const independence = iadl.housekeeping?.independence || 'total_assistance';
    return baseHours[independence] || 0;
  }

  private calculateLaundryHours(iadl: any): number {
    const baseHours = {
      independent: 0,
      modified_independent: 1,
      supervision: 2,
      minimal_assistance: 3,
      moderate_assistance: 4,
      maximal_assistance: 5,
      total_assistance: 6
    };
    const independence = iadl.laundry?.independence || 'total_assistance';
    return baseHours[independence] || 0;
  }

  private calculateMealPrepHours(iadl: any, meal: 'breakfast' | 'lunch' | 'dinner'): number {
    const baseHours = {
      independent: 0,
      modified_independent: 0.25,
      supervision: 0.5,
      minimal_assistance: 0.75,
      moderate_assistance: 1,
      maximal_assistance: 1.25,
      total_assistance: 1.5
    };
    const independence = iadl.mealPrep?.independence || 'total_assistance';
    return (baseHours[independence] || 0) * 30;
  }

  private calculateSchedulingHours(iadl: any): number {
    const baseHours = {
      independent: 0,
      modified_independent: 1,
      supervision: 2,
      minimal_assistance: 3,
      moderate_assistance: 4,
      maximal_assistance: 5,
      total_assistance: 6
    };
    const independence = iadl.scheduling?.independence || 'total_assistance';
    return baseHours[independence] || 0;
  }

  private calculateTransportationHours(iadl: any, type: 'medical' | 'community'): number {
    const baseHours = {
      independent: 0,
      modified_independent: 2,
      supervision: 4,
      minimal_assistance: 6,
      moderate_assistance: 8,
      maximal_assistance: 10,
      total_assistance: 12
    };
    const independence = iadl.transportation?.independence || 'total_assistance';
    return baseHours[independence] || 0;
  }

  async processData(data: Assessment): Promise<any> {
    const adl = _.get(data, 'functionalAssessment.adl', {});
    const iadl = _.get(data, 'functionalAssessment.iadl', {});

    const monthlyHours = [
      {
        category: 'Personal Care',
        activities: [
          {
            name: 'Bathing',
            hours: this.calculateBathingHours(adl),
            frequency: 'Daily'
          },
          {
            name: 'Toileting',
            hours: this.calculateToiletingHours(adl),
            frequency: 'Daily'
          },
          {
            name: 'Transfers',
            hours: this.calculateTransferHours(adl),
            frequency: 'Daily'
          },
          {
            name: 'Overnight Turning',
            hours: this.calculateOvernightTurningHours(adl),
            frequency: 'Nightly'
          },
          {
            name: 'Dressing',
            hours: this.calculateDressingHours(adl),
            frequency: 'Daily'
          }
        ]
      },
      {
        category: 'Household',
        activities: [
          {
            name: 'Cleaning',
            hours: this.calculateCleaningHours(iadl),
            frequency: 'Weekly'
          },
          {
            name: 'Laundry',
            hours: this.calculateLaundryHours(iadl),
            frequency: 'Weekly'
          }
        ]
      },
      {
        category: 'Meal Preparation',
        activities: [
          {
            name: 'Breakfast',
            hours: this.calculateMealPrepHours(iadl, 'breakfast'),
            frequency: 'Daily'
          },
          {
            name: 'Lunch',
            hours: this.calculateMealPrepHours(iadl, 'lunch'),
            frequency: 'Daily'
          },
          {
            name: 'Dinner',
            hours: this.calculateMealPrepHours(iadl, 'dinner'),
            frequency: 'Daily'
          }
        ]
      },
      {
        category: 'Community Access',
        activities: [
          {
            name: 'Scheduling',
            hours: this.calculateSchedulingHours(iadl),
            frequency: 'Weekly'
          },
          {
            name: 'Medical Transportation',
            hours: this.calculateTransportationHours(iadl, 'medical'),
            frequency: 'Weekly'
          }
        ]
      }
    ];

    const totalMonthly = monthlyHours.reduce((sum, category) => 
      sum + category.activities.reduce((catSum, activity) => catSum + activity.hours, 0), 0);

    return {
      monthlyHours,
      total: {
        monthly: totalMonthly,
        annual: totalMonthly * 12
      }
    };
  }

  protected formatBrief(data: any): string {
    return `Total Monthly Hours: ${data.total.monthly.toFixed(1)}\n` +
           `Total Annual Hours: ${data.total.annual.toFixed(1)}`;
  }

  protected formatStandard(data: any): string {
    const parts = ['Attendant Care Requirements:'];
    
    data.monthlyHours.forEach(category => {
      parts.push(`\n${category.category}:`);
      category.activities.forEach(activity => {
        if (activity.hours > 0) {
          parts.push(`- ${activity.name}: ${activity.hours.toFixed(1)} hours (${activity.frequency})`);
        }
      });
    });

    parts.push(`\nTotal Requirements:`);
    parts.push(`Monthly: ${data.total.monthly.toFixed(1)} hours`);
    parts.push(`Annual: ${data.total.annual.toFixed(1)} hours`);

    return parts.join('\n');
  }

  protected formatDetailed(data: any): string {
    const parts = ['Detailed Attendant Care Analysis'];

    data.monthlyHours.forEach(category => {
      parts.push(`\n${category.category}:`);
      category.activities.forEach(activity => {
        parts.push(`\n${activity.name}:`);
        parts.push(`  Hours: ${activity.hours.toFixed(1)}`);
        parts.push(`  Frequency: ${activity.frequency}`);
        if (activity.hours === 0) {
          parts.push('  Note: Independent with this activity');
        }
      });
    });

    parts.push('\nTotal Care Requirements:');
    parts.push(`Monthly Hours: ${data.total.monthly.toFixed(1)}`);
    parts.push(`Annual Hours: ${data.total.annual.toFixed(1)}`);

    return parts.join('\n');
  }
}