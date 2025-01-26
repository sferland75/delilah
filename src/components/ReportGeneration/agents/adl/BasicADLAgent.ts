import { BaseAgent } from '../BaseAgent';
import { AgentContext } from '../types';
import { 
  BasicADLData, 
  ProcessedADLData, 
  IndependenceLevel, 
  ADLSection,
  ADLSectionData 
} from './ADLTypes';

export class BasicADLAgent extends BaseAgent {
  constructor(context: AgentContext) {
    super(context, 4.1, 'Basic ADLs', ['adl.basic']);
  }

  protected initializeValidationRules(): void {
    this.validationRules.set('independence', this.validateIndependenceLevel);
  }

  protected getSectionKeys(): string[] {
    return [
      'bathing',
      'dressing',
      'feeding',
      'transfers'
    ];
  }

  private validateIndependenceLevel(level: IndependenceLevel): boolean {
    const validLevels: IndependenceLevel[] = [
      'independent',
      'modified_independent',
      'supervision',
      'minimal_assistance',
      'moderate_assistance',
      'maximal_assistance',
      'total_assistance',
      'not_applicable'
    ];
    return validLevels.includes(level);
  }

  async processData(data: BasicADLData): Promise<ProcessedADLData> {
    const sections = {
      bathing: this.processSection(data.bathing),
      dressing: this.processSection(data.dressing),
      feeding: this.processSection(data.feeding),
      transfers: this.processSection(data.transfers)
    };

    const overallIndependence = this.determineOverallIndependence(sections);
    const supportNeeds = this.analyzeSupportNeeds(sections);
    const recommendedAssistance = this.generateRecommendations(sections, supportNeeds);

    return {
      sections,
      overallIndependence,
      supportNeeds,
      recommendedAssistance
    };
  }

  private processSection(data: ADLSectionData): ADLSection[] {
    return Object.entries(data).map(([activityName, details]) => ({
      activity: activityName,
      notes: details.notes || '',
      independence: details.independence || 'not_applicable'
    }));
  }

  private determineOverallIndependence(sections: ProcessedADLData['sections']): IndependenceLevel {
    const levels: IndependenceLevel[] = [];
    
    Object.values(sections).forEach(section => {
      section.forEach(activity => {
        if (activity.independence !== 'not_applicable') {
          levels.push(activity.independence);
        }
      });
    });

    const levelOrder: IndependenceLevel[] = [
      'total_assistance',
      'maximal_assistance',
      'moderate_assistance',
      'minimal_assistance',
      'supervision',
      'modified_independent',
      'independent'
    ];

    // Find the most dependent level used
    for (const level of levelOrder) {
      if (levels.includes(level)) {
        return level;
      }
    }

    return 'not_applicable';
  }

  private analyzeSupportNeeds(sections: ProcessedADLData['sections']): ProcessedADLData['supportNeeds'] {
    const supportNeeds: ProcessedADLData['supportNeeds'] = [];

    // Analyze bathing needs
    const bathingNeeds = this.analyzeSectionNeeds(sections.bathing, 'Bathing');
    if (bathingNeeds) supportNeeds.push(bathingNeeds);

    // Analyze dressing needs
    const dressingNeeds = this.analyzeSectionNeeds(sections.dressing, 'Dressing');
    if (dressingNeeds) supportNeeds.push(dressingNeeds);

    // Analyze feeding needs
    const feedingNeeds = this.analyzeSectionNeeds(sections.feeding, 'Feeding');
    if (feedingNeeds) supportNeeds.push(feedingNeeds);

    // Analyze transfer needs
    const transferNeeds = this.analyzeSectionNeeds(sections.transfers, 'Transfers');
    if (transferNeeds) supportNeeds.push(transferNeeds);

    return supportNeeds;
  }

  private analyzeSectionNeeds(section: ADLSection[], category: string) {
    const highestNeed = this.findHighestAssistanceLevel(section.map(s => s.independence));
    
    if (highestNeed === 'independent' || highestNeed === 'not_applicable') {
      return null;
    }

    return {
      category,
      level: highestNeed,
      rationale: this.generateSupportRationale(section, category, highestNeed)
    };
  }

  private findHighestAssistanceLevel(levels: IndependenceLevel[]): IndependenceLevel {
    const levelOrder: IndependenceLevel[] = [
      'total_assistance',
      'maximal_assistance',
      'moderate_assistance',
      'minimal_assistance',
      'supervision',
      'modified_independent',
      'independent'
    ];

    for (const level of levelOrder) {
      if (levels.includes(level)) {
        return level;
      }
    }

    return 'not_applicable';
  }

  private generateSupportRationale(section: ADLSection[], category: string, level: IndependenceLevel): string {
    const activitiesAtLevel = section.filter(s => s.independence === level);
    
    if (activitiesAtLevel.length === 0) {
      return `Support needed for ${category.toLowerCase()} activities`;
    }

    const rationales = activitiesAtLevel
      .map(activity => activity.notes)
      .filter(note => note && note.length > 0);

    if (rationales.length > 0) {
      return rationales.join('. ');
    }

    return `${level.replace('_', ' ')} required for ${category.toLowerCase()} activities`;
  }

  private generateRecommendations(
    sections: ProcessedADLData['sections'],
    supportNeeds: ProcessedADLData['supportNeeds']
  ): ProcessedADLData['recommendedAssistance'] {
    const recommendations: ProcessedADLData['recommendedAssistance'] = [];

    supportNeeds.forEach(need => {
      const sectionActivities = sections[need.category.toLowerCase() as keyof typeof sections];
      
      sectionActivities.forEach(activity => {
        if (this.requiresAssistance(activity.independence)) {
          recommendations.push({
            activity: need.category,
            type: this.determineAssistanceType(activity.independence),
            frequency: this.determineAssistanceFrequency(activity.independence),
            rationale: activity.notes || need.rationale
          });
        }
      });
    });

    return this.consolidateRecommendations(recommendations);
  }

  private requiresAssistance(level: IndependenceLevel): boolean {
    return ![
      'independent',
      'modified_independent',
      'not_applicable'
    ].includes(level);
  }

  private determineAssistanceType(level: IndependenceLevel): string {
    switch(level) {
      case 'supervision':
        return 'Supervision and cueing';
      case 'minimal_assistance':
        return 'Light physical assistance';
      case 'moderate_assistance':
        return 'Moderate physical assistance';
      case 'maximal_assistance':
      case 'total_assistance':
        return 'Full physical assistance';
      default:
        return 'Support as needed';
    }
  }

  private determineAssistanceFrequency(level: IndependenceLevel): string {
    switch(level) {
      case 'supervision':
        return 'As needed during activity';
      case 'minimal_assistance':
      case 'moderate_assistance':
        return 'Throughout activity duration';
      case 'maximal_assistance':
      case 'total_assistance':
        return 'Continuous during activity';
      default:
        return 'As needed';
    }
  }

  private consolidateRecommendations(
    recommendations: ProcessedADLData['recommendedAssistance']
  ): ProcessedADLData['recommendedAssistance'] {
    const consolidated = new Map<string, ProcessedADLData['recommendedAssistance'][0]>();

    recommendations.forEach(rec => {
      const key = `${rec.activity}-${rec.type}`;
      if (consolidated.has(key)) {
        const existing = consolidated.get(key)!;
        existing.rationale = `${existing.rationale}. ${rec.rationale}`;
      } else {
        consolidated.set(key, {...rec});
      }
    });

    return Array.from(consolidated.values());
  }

  protected formatByDetailLevel(data: ProcessedADLData, level: string): string {
    switch (level) {
      case 'brief':
        return this.formatBrief(data);
      case 'standard':
        return this.formatStandard(data);
      case 'detailed':
        return this.formatDetailed(data);
      default:
        return this.formatStandard(data);
    }
  }

  private formatBrief(data: ProcessedADLData): string {
    return `
## Basic ADL Status
Overall Independence Level: ${this.formatIndependenceLevel(data.overallIndependence)}

Support Needs:
${data.supportNeeds.map(need => `- ${need.category}: ${this.formatIndependenceLevel(need.level)}`).join('\n')}
    `.trim();
  }

  private formatStandard(data: ProcessedADLData): string {
    return `
## Basic ADL Assessment

### Overall Status
Independence Level: ${this.formatIndependenceLevel(data.overallIndependence)}

### Support Needs
${data.supportNeeds.map(need => `
#### ${need.category}
- Level: ${this.formatIndependenceLevel(need.level)}
- Rationale: ${need.rationale}`).join('\n')}

### Recommendations
${data.recommendedAssistance.map(rec => `
- ${rec.activity}:
  Type: ${rec.type}
  Frequency: ${rec.frequency}
  Rationale: ${rec.rationale}`).join('\n')}
    `.trim();
  }

  private formatDetailed(data: ProcessedADLData): string {
    return `
## Comprehensive ADL Assessment

### Overall Independence Status
Current Level: ${this.formatIndependenceLevel(data.overallIndependence)}

### Detailed Section Analysis

#### Bathing Activities
${this.formatSection(data.sections.bathing)}

#### Dressing Activities
${this.formatSection(data.sections.dressing)}

#### Feeding Activities
${this.formatSection(data.sections.feeding)}

#### Transfer Activities
${this.formatSection(data.sections.transfers)}

### Support Requirements
${data.supportNeeds.map(need => `
#### ${need.category}
- Required Assistance: ${this.formatIndependenceLevel(need.level)}
- Clinical Rationale: ${need.rationale}`).join('\n')}

### Recommended Assistance Plan
${data.recommendedAssistance.map(rec => `
#### ${rec.activity}
- Assistance Type: ${rec.type}
- Frequency: ${rec.frequency}
- Clinical Rationale: ${rec.rationale}`).join('\n')}
    `.trim();
  }

  private formatSection(section: ADLSection[]): string {
    return section.map(activity => `
- ${activity.activity}:
  Independence Level: ${this.formatIndependenceLevel(activity.independence)}
  ${activity.notes ? `Notes: ${activity.notes}` : ''}`).join('\n');
  }

  private formatIndependenceLevel(level: IndependenceLevel): string {
    return level.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }
}