import { BaseAgent } from '../BaseAgent';
import { AgentContext, AssessmentData } from '../../types';
import _ from 'lodash';

interface ADLActivity {
  assistanceLevel: string;
  equipment?: string[];
  notes?: string;
  modifiers?: string[];
}

interface ADLOutput {
  valid: boolean;
  activities: {
    feeding: ADLActivity;
    bathing: ADLActivity;
    dressing: ADLActivity;
    toileting: ADLActivity;
    transfers?: ADLActivity;
    ambulation?: ADLActivity;
  };
  safety: string[];
  recommendations: string[];
  errors?: string[];
}

export class BasicADLAgent extends BaseAgent {
  constructor(context: AgentContext) {
    super(context, 3.1, 'Basic ADL Assessment', ['functionalAssessment.adl']);
  }

  async processData(data: AssessmentData): Promise<ADLOutput> {
    const adlData = _.get(data, 'functionalAssessment.adl', {});
    const safety: string[] = [];
    const recommendations: string[] = [];

    // Process each ADL activity
    const activities = {
      feeding: this.processActivity(adlData.feeding),
      bathing: this.processActivity(adlData.bathing),
      dressing: this.processActivity(adlData.dressing),
      toileting: this.processActivity(adlData.toileting)
    };

    // Check for safety concerns and generate recommendations
    Object.entries(activities).forEach(([activity, details]) => {
      if (details.assistanceLevel !== 'Independent') {
        safety.push(`Requires assistance with ${activity}`);
        if (!details.equipment?.length) {
          recommendations.push(`Consider adaptive equipment for ${activity}`);
        }
      }
    });

    return {
      valid: true,
      activities,
      safety,
      recommendations
    };
  }

  private processActivity(data: any): ADLActivity {
    if (typeof data === 'string') {
      return {
        assistanceLevel: data
      };
    }

    return {
      assistanceLevel: data?.assistanceLevel || 'Dependent',
      equipment: data?.equipment || [],
      notes: data?.notes,
      modifiers: data?.modifiers
    };
  }

  protected override formatBrief(data: ADLOutput): string {
    const sections = ['Basic ADL Status'];

    Object.entries(data.activities).forEach(([activity, details]) => {
      sections.push(`${activity}: ${details.assistanceLevel}`);
    });

    return sections.join('\n');
  }

  protected override formatDetailed(data: ADLOutput): string {
    const sections = ['Basic ADL Assessment'];

    // Activities
    sections.push('\nActivities:');
    Object.entries(data.activities).forEach(([activity, details]) => {
      sections.push(`\n${activity.charAt(0).toUpperCase() + activity.slice(1)}:`);
      sections.push(`  Assistance Level: ${details.assistanceLevel}`);
      
      if (details.equipment?.length) {
        sections.push(`  Equipment: ${details.equipment.join(', ')}`);
      }
      
      if (details.modifiers?.length) {
        sections.push(`  Modifiers: ${details.modifiers.join(', ')}`);
      }
      
      if (details.notes) {
        sections.push(`  Notes: ${details.notes}`);
      }
    });

    // Safety Concerns
    if (data.safety.length > 0) {
      sections.push('\nSafety Concerns:');
      data.safety.forEach(concern => {
        sections.push(`- ${concern}`);
      });
    }

    // Recommendations
    if (data.recommendations.length > 0) {
      sections.push('\nRecommendations:');
      data.recommendations.forEach(rec => {
        sections.push(`- ${rec}`);
      });
    }

    return sections.join('\n');
  }
}