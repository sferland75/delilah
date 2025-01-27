import { BaseAgent } from '../BaseAgent';
import { AgentContext, AssessmentData } from '../../types';
import _ from 'lodash';

interface IADLActivity {
  level: string;
  equipment?: string[];
  notes?: string;
}

interface IADLOutput {
  valid: boolean;
  activities: Record<string, IADLActivity>;
  recommendations: string[];
  errors?: string[];
}

export class IADLAgent extends BaseAgent {
  constructor(context: AgentContext) {
    super(context, 3.2, 'IADL Assessment', ['functionalAssessment.iadl']);
  }

  async processData(data: AssessmentData): Promise<IADLOutput> {
    const iadlData = _.get(data, 'functionalAssessment.iadl', {});
    const activities: Record<string, IADLActivity> = {};
    const recommendations: string[] = [];

    Object.entries(iadlData).forEach(([key, value]) => {
      const activity = this.processActivity(value);
      activities[key] = activity;
      
      if (activity.level !== 'Independent') {
        recommendations.push(this.generateRecommendation(key, activity));
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
      equipment: data.equipment,
      notes: data.notes
    };
  }

  private generateRecommendation(activity: string, details: IADLActivity): string {
    return `Consider support for ${this.formatActivityName(activity)} - currently at ${details.level} level`;
  }

  private formatActivityName(key: string): string {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }

  protected formatBrief(data: IADLOutput): string {
    const sections = ['IADL Status'];
    
    Object.entries(data.activities).forEach(([key, activity]) => {
      sections.push(`${this.formatActivityName(key)}: ${activity.level}`);
    });

    return sections.join('\n');
  }

  protected formatStandard(data: IADLOutput): string {
    const sections = ['Instrumental ADL Assessment'];
    const byLevel: Record<string, string[]> = {};

    Object.entries(data.activities).forEach(([key, activity]) => {
      byLevel[activity.level] = byLevel[activity.level] || [];
      if (activity.equipment?.length) {
        byLevel[activity.level].push(`${this.formatActivityName(key)} (uses ${activity.equipment.join(', ')})`);
      } else {
        byLevel[activity.level].push(this.formatActivityName(key));
      }
    });

    Object.entries(byLevel).forEach(([level, activities]) => {
      if (activities.length > 0) {
        sections.push(`\n${level}:`);
        activities.forEach(activity => sections.push(`- ${activity}`));
      }
    });

    if (data.recommendations.length > 0) {
      sections.push('\nRecommendations:');
      data.recommendations.forEach(rec => sections.push(`- ${rec}`));
    }

    return sections.join('\n');
  }

  protected formatDetailed(data: IADLOutput): string {
    const sections = ['IADL Assessment'];

    Object.entries(data.activities).forEach(([key, activity]) => {
      sections.push(`\n${this.formatActivityName(key)}:`);
      sections.push(`  Assistance Level: ${activity.level}`);
      
      if (activity.equipment?.length) {
        sections.push(`  Equipment Used: ${activity.equipment.join(', ')}`);
      }
      
      if (activity.notes) {
        sections.push(`  Notes: ${activity.notes}`);
      }
    });

    if (data.recommendations.length > 0) {
      sections.push('\nRecommendations:');
      data.recommendations.forEach(rec => sections.push(`- ${rec}`));
    }

    return sections.join('\n');
  }
}