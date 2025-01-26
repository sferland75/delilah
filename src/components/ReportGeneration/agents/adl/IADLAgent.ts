import { BaseAgent } from '../BaseAgent';
import { AgentContext, AssessmentData } from '../../types';
import _ from 'lodash';

interface IADLActivity {
  level: string;
  notes?: string;
  equipment?: string[];
  frequency?: string;
  support?: string[];
}

type IADLActivityKey = 'mealPrep' | 'housekeeping' | 'laundry' | 'shopping' | 
                      'transportation' | 'medication' | 'finances' | 'communication';

interface IADLOutput {
  valid: boolean;
  activities: {
    [K in IADLActivityKey]?: IADLActivity;
  };
  recommendations: string[];
  errors?: string[];
}

export class IADLAgent extends BaseAgent {
  private readonly activityKeys: IADLActivityKey[] = [
    'mealPrep', 'housekeeping', 'laundry', 'shopping',
    'transportation', 'medication', 'finances', 'communication'
  ];

  constructor(context: AgentContext) {
    super(context, 3.2, 'Instrumental ADL Assessment', ['functionalAssessment.iadl']);
  }

  async processData(data: AssessmentData): Promise<IADLOutput> {
    const iadlData = _.get(data, 'functionalAssessment.iadl', {});
    const activities: IADLOutput['activities'] = {};
    const recommendations: string[] = [];

    // Process each IADL activity
    this.activityKeys.forEach(key => {
      const activityData = iadlData[key];
      if (activityData) {
        activities[key] = this.processActivity(activityData);
        
        // Generate recommendations based on assistance needs
        if (activities[key]?.level !== 'Independent') {
          recommendations.push(this.generateRecommendation(key, activities[key]!));
        }
      }
    });

    return {
      valid: true,
      activities,
      recommendations
    };
  }

  private processActivity(data: any): IADLActivity {
    if (typeof data === 'string') {
      return { level: data };
    }

    return {
      level: data.level || 'Dependent',
      notes: data.notes,
      equipment: data.equipment,
      frequency: data.frequency,
      support: data.support
    };
  }

  private generateRecommendation(activity: IADLActivityKey, details: IADLActivity): string {
    const baseRec = `Consider support for ${activity}`;
    
    if (details.level === 'Dependent') {
      return `${baseRec} - requires full assistance`;
    }
    
    if (details.level === 'Modified Independent' && !details.equipment?.length) {
      return `${baseRec} - may benefit from adaptive equipment`;
    }
    
    return `${baseRec} - currently at ${details.level} level`;
  }

  protected override formatBrief(data: IADLOutput): string {
    const sections = ['IADL Status'];

    this.activityKeys.forEach(key => {
      const activity = data.activities[key];
      if (activity) {
        sections.push(`${key}: ${activity.level}`);
      }
    });

    return sections.join('\n');
  }

  protected override formatDetailed(data: IADLOutput): string {
    const sections = ['Instrumental ADL Assessment'];

    // Activities
    Object.entries(data.activities).forEach(([key, details]) => {
      if (!details) return;

      sections.push(`\n${key.charAt(0).toUpperCase() + key.slice(1)}:`);
      sections.push(`  Assistance Level: ${details.level}`);
      
      if (details.equipment?.length) {
        sections.push(`  Equipment Used: ${details.equipment.join(', ')}`);
      }
      
      if (details.support?.length) {
        sections.push(`  Support System: ${details.support.join(', ')}`);
      }
      
      if (details.frequency) {
        sections.push(`  Frequency: ${details.frequency}`);
      }
      
      if (details.notes) {
        sections.push(`  Notes: ${details.notes}`);
      }
    });

    // Recommendations
    if (data.recommendations.length > 0) {
      sections.push('\nRecommendations:');
      data.recommendations.forEach(rec => sections.push(`- ${rec}`));
    }

    return sections.join('\n');
  }
}