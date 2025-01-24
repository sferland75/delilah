import { AgentContext, ReportSection } from './agents/types';
import { mergeAgentResults } from './agents/utils';
import { 
  FunctionalAssessmentAgent,
  SymptomsAgent,
  MedicalHistoryAgent,
  ADLAgent,
  EnvironmentalAgent,
  AMAGuidesAgent
} from './agents';

export class ReportOrchestrator {
  private context: AgentContext;
  private agents: any[];
  private sections: ReportSection[] = [];
  private errors: string[] = [];

  constructor(context: AgentContext) {
    this.context = context;
    this.agents = [
      new FunctionalAssessmentAgent(context, 1, 'Functional Assessment'),
      new SymptomsAgent(context, 2, 'Symptoms'),
      new MedicalHistoryAgent(context, 3, 'Medical History'),
      new ADLAgent(context, 4, 'Activities of Daily Living'),
      new EnvironmentalAgent(context, 5, 'Environmental Assessment'),
      new AMAGuidesAgent(context, 6, 'AMA Guides Assessment')
    ];
  }

  async generateReport(): Promise<{
    sections: ReportSection[];
    errors: string[];
    isValid: boolean;
  }> {
    this.sections = [];
    this.errors = [];

    try {
      // Generate each section using corresponding agent
      const sectionPromises = this.agents.map(agent => {
        try {
          const section = agent.generateSection(this.context.assessment);
          if (!section.isValid) {
            this.errors.push(...section.errors);
          }
          return section;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          this.errors.push(`Error in ${agent.constructor.name}: ${errorMessage}`);
          return null;
        }
      });

      // Wait for all sections to be generated
      const generatedSections = await Promise.all(sectionPromises);
      
      // Filter out null sections and merge results
      this.sections = mergeAgentResults(
        generatedSections.filter(Boolean)
      );

      return {
        sections: this.sections,
        errors: this.errors,
        isValid: this.errors.length === 0
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.errors.push(`Report generation failed: ${errorMessage}`);
      
      return {
        sections: [],
        errors: this.errors,
        isValid: false
      };
    }
  }

  getSection(title: string): ReportSection | undefined {
    return this.sections.find(section => section.title === title);
  }

  getSections(): ReportSection[] {
    return [...this.sections];
  }

  getErrors(): string[] {
    return [...this.errors];
  }
}

// Export a factory function for easier instantiation
export const createReportOrchestrator = (
  assessment: any,
  options = {}
): ReportOrchestrator => {
  const context: AgentContext = {
    assessment,
    options
  };
  return new ReportOrchestrator(context);
};