import { BaseAgent } from '../BaseAgent';
import { AgentContext, AssessmentData } from '../../types';
import _ from 'lodash';
import { 
  BasicADLData,
  Activity,
  IndependenceLevel,
  INDEPENDENCE_LEVELS,
  ProcessedADLData,
  ADLSectionConfig
} from './types';

interface ADLOutput {
  valid: boolean;
  activities: BasicADLData;
  recommendations: string[];
  errors?: string[];
}

export class BasicADLAgent extends BaseAgent {
  private config: ADLSectionConfig;

  constructor(context: AgentContext) {
    super(context);
    this.priority = 3.1;
    this.name = 'Basic ADL Assessment';
    this.dataKeys = ['functionalAssessment.adl'];

    // Default configuration
    this.config = {
      includeRiskAnalysis: true,
      includeAdaptations: true,
      includeProgressionNotes: true,
      detailLevel: 'standard'
    };
  }

  async processData(data: AssessmentData): Promise<ADLOutput> {
    try {
      const adlData = _.get(data, 'functionalAssessment.adl', {}) as Partial<BasicADLData>;
      
      const activities: BasicADLData = {
        feeding: this.processActivity(adlData.feeding),
        bathing: this.processActivity(adlData.bathing),
        dressing: this.processActivity(adlData.dressing),
        toileting: this.processActivity(adlData.toileting),
        transfers: this.processActivity(adlData.transfers),
        ambulation: this.processActivity(adlData.ambulation)
      };

      const recommendations = this.generateRecommendations(activities);

      return {
        valid: true,
        activities,
        recommendations
      };
    } catch (error) {
      return {
        valid: false,
        activities: {} as BasicADLData,
        recommendations: [],
        errors: [(error as Error).message]
      };
    }
  }

  private processActivity(data: any): Activity {
    if (!data) {
      return {
        assistanceLevel: INDEPENDENCE_LEVELS.TOTAL_ASSISTANCE,
        equipment: []
      };
    }

    if (typeof data === 'string') {
      return {
        assistanceLevel: data as IndependenceLevel,
        equipment: []
      };
    }

    let assistanceLevel: IndependenceLevel;
    if (typeof data.assistanceLevel === 'string') {
      assistanceLevel = data.assistanceLevel;
    } else {
      assistanceLevel = INDEPENDENCE_LEVELS.TOTAL_ASSISTANCE;
    }

    return {
      assistanceLevel,
      equipment: Array.isArray(data.equipment) ? data.equipment : [],
      notes: data.notes
    };
  }

  private generateRecommendations(activities: BasicADLData): string[] {
    const recommendations: string[] = [];

    Object.entries(activities).forEach(([activity, details]) => {
      if (details.assistanceLevel === INDEPENDENCE_LEVELS.NOT_APPLICABLE) {
        return;
      }

      if (details.assistanceLevel !== INDEPENDENCE_LEVELS.INDEPENDENT) {
        const recommendation = this.generateRecommendation(activity, details);
        if (recommendation) {
          recommendations.push(recommendation);
        }
      }
    });

    return recommendations;
  }

  private generateRecommendation(activity: string, details: Activity): string {
    switch (details.assistanceLevel) {
      case INDEPENDENCE_LEVELS.MODIFIED_INDEPENDENT:
        if (!details.equipment?.length) {
          return `${activity}: Modified Independent - Consider adaptive equipment assessment`;
        }
        return `${activity}: Modified Independent using ${details.equipment.join(', ')}`;
      
      case INDEPENDENCE_LEVELS.TOTAL_ASSISTANCE:
        return `Requires full assistance with ${activity}`;
      
      case INDEPENDENCE_LEVELS.SUPERVISION:
        return `${activity} requires supervision for safety`;
      
      case INDEPENDENCE_LEVELS.MINIMAL_ASSISTANCE:
        return `${activity} requires minimal assistance`;
      
      case INDEPENDENCE_LEVELS.MODERATE_ASSISTANCE:
        return `${activity} requires moderate assistance`;
      
      case INDEPENDENCE_LEVELS.MAXIMAL_ASSISTANCE:
        return `${activity} requires maximal assistance`;
      
      default:
        return `${activity} currently at ${this.formatAssistanceLevel(details.assistanceLevel)} level`;
    }
  }

  protected formatAssistanceLevel(level: IndependenceLevel): string {
    const mapping: Record<IndependenceLevel, string> = {
      [INDEPENDENCE_LEVELS.INDEPENDENT]: 'Independent',
      [INDEPENDENCE_LEVELS.MODIFIED_INDEPENDENT]: 'Modified Independent',
      [INDEPENDENCE_LEVELS.SUPERVISION]: 'Supervision',
      [INDEPENDENCE_LEVELS.MINIMAL_ASSISTANCE]: 'Minimal Assistance',
      [INDEPENDENCE_LEVELS.MODERATE_ASSISTANCE]: 'Moderate Assistance',
      [INDEPENDENCE_LEVELS.MAXIMAL_ASSISTANCE]: 'Maximal Assistance',
      [INDEPENDENCE_LEVELS.TOTAL_ASSISTANCE]: 'Total Assistance',
      [INDEPENDENCE_LEVELS.NOT_APPLICABLE]: 'Not Applicable'
    };

    return mapping[level] || 'Unknown';
  }

  protected formatBrief(data: ADLOutput): string {
    if (!data.valid) {
      return 'ADL Status: Unable to process data';
    }

    const sections = ['ADL Status'];
    Object.entries(data.activities).forEach(([activity, details]) => {
      if (details.assistanceLevel !== INDEPENDENCE_LEVELS.NOT_APPLICABLE) {
        sections.push(`${activity}: ${this.formatAssistanceLevel(details.assistanceLevel)}`);
      }
    });

    return sections.join('\n');
  }

  protected formatStandard(data: ADLOutput): string {
    if (!data.valid) {
      return 'Basic ADL Assessment: Unable to process data';
    }

    const sections = ['Basic ADL Assessment'];
    const byLevel: Record<string, string[]> = {};
    
    Object.entries(data.activities).forEach(([activity, details]) => {
      if (details.assistanceLevel === INDEPENDENCE_LEVELS.NOT_APPLICABLE) {
        return;
      }

      const level = this.formatAssistanceLevel(details.assistanceLevel);
      byLevel[level] = byLevel[level] || [];
      
      if (details.equipment?.length) {
        byLevel[level].push(`${activity} (uses ${details.equipment.join(', ')})`);
      } else {
        byLevel[level].push(activity);
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

  protected formatDetailed(data: ADLOutput): string {
    if (!data.valid) {
      return 'Basic ADL Assessment: Unable to process data\n' + 
             (data.errors?.join('\n') || 'Unknown error occurred');
    }

    const sections = ['Basic ADL Assessment'];

    Object.entries(data.activities).forEach(([activity, details]) => {
      if (details.assistanceLevel === INDEPENDENCE_LEVELS.NOT_APPLICABLE) {
        return;
      }

      sections.push(`\n${activity}:`);
      sections.push(`  Assistance Level: ${this.formatAssistanceLevel(details.assistanceLevel)}`);
      
      if (details.equipment?.length) {
        sections.push(`  Equipment Used: ${details.equipment.join(', ')}`);
      }
      
      if (details.notes) {
        sections.push(`  Notes: ${details.notes}`);
      }
    });

    if (data.recommendations.length > 0) {
      sections.push('\nRecommendations:');
      data.recommendations.forEach(rec => sections.push(`- ${rec}`));
    }

    return sections.join('\n');
  }
}