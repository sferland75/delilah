import { AssessmentData, ReportSection, AgentContext } from './types';
import { BaseAgent } from './agents/BaseAgent';
import { DemographicsAgent } from './agents/DemographicsAgent';
import { DocumentationAgent } from './agents/DocumentationAgent';
import { MobilityAgent } from './agents/MobilityAgent';
import { RangeOfMotionAgent } from './agents/RangeOfMotion/RangeOfMotionAgent';
import { TransfersAgent } from './agents/TransfersAgent';
import { BasicADLAgent } from './agents/adl/BasicADLAgent';
import { IADLAgent } from './agents/adl/IADLAgent';
import { PhysicalSymptomsAgent } from './agents/symptoms/PhysicalSymptomsAgent';
import { CognitiveSymptomAgent } from './agents/symptoms/CognitiveSymptomAgent';
import { EmotionalSymptomAgent } from './agents/symptoms/EmotionalSymptomAgent';
import { SymptomIntegrationAgent } from './agents/symptoms/SymptomIntegrationAgent';
import { TypicalDayAgent } from './agents/TypicalDayAgent';
import { AttendantCareAgent } from './agents/AttendantCareAgent';

export class AgentOrchestrator {
  private agents: Array<BaseAgent>;
  private context: AgentContext;

  constructor(context: AgentContext) {
    this.context = context;
    // Initialize all agents in order
    this.agents = [
      new DemographicsAgent(context),
      new DocumentationAgent(context),
      new MobilityAgent(context),
      new RangeOfMotionAgent(context),
      new TransfersAgent(context),
      new BasicADLAgent(context),
      new IADLAgent(context),
      new PhysicalSymptomsAgent(context),
      new CognitiveSymptomAgent(context),
      new EmotionalSymptomAgent(context),
      new SymptomIntegrationAgent(context),
      new TypicalDayAgent(context),
      new AttendantCareAgent(context)
    ];
    
    // Sort by order number
    this.agents.sort((a, b) => a.getOrderNumber() - b.getOrderNumber());
  }

  async generateReport(data: AssessmentData | null | undefined): Promise<ReportSection[]> {
    // Handle null/undefined data
    if (!data) {
      this.context.logger.warn('No assessment data provided');
      return [{
        orderNumber: 0,
        sectionName: 'Assessment Summary',
        title: 'Assessment Summary',
        content: 'No assessment data available for processing.',
        valid: true
      }];
    }

    // Handle missing required fields
    if (!data.id || !data.date) {
      this.context.logger.warn('Missing required assessment fields');
      return [{
        orderNumber: 0,
        sectionName: 'Assessment Summary',
        title: 'Assessment Summary',
        content: 'Assessment data is missing required fields.',
        valid: true
      }];
    }

    try {
      // Log start of processing
      this.context.logger.log('Starting report generation...');
      
      // Generate sections in parallel with error handling for each agent
      const sections = await Promise.all(
        this.agents.map(async agent => {
          try {
            const section = await agent.generateSection(data);
            
            // Log successful section generation
            this.context.logger.log(`Generated section: ${agent.getSectionName()}`);
            
            // Ensure valid sections for empty data
            if (!section.content || section.content.trim() === '') {
              return {
                orderNumber: agent.getOrderNumber(),
                sectionName: agent.getSectionName(),
                title: agent.getSectionName(),
                content: 'No data available for this section.',
                valid: true
              };
            }

            // Ensure section validity
            return {
              ...section,
              valid: true
            };
          } catch (error) {
            this.context.logger.error(`Error in ${agent.constructor.name}: ${(error as Error).message}`);
            return {
              orderNumber: agent.getOrderNumber(),
              sectionName: agent.getSectionName(),
              title: agent.getSectionName(),
              content: 'Unable to process this section.',
              valid: true,
              errors: [(error as Error).message]
            };
          }
        })
      );

      // Filter out any null/undefined sections and sort by order number
      const processedSections = sections
        .filter((section): section is ReportSection => section !== null && section !== undefined)
        .sort((a, b) => a.orderNumber - b.orderNumber);

      // Log completion
      this.context.logger.log(`Generated ${processedSections.length} sections`);
      
      return processedSections;
        
    } catch (error) {
      this.context.logger.error(`Error generating report: ${(error as Error).message}`);
      return [{
        orderNumber: 0,
        sectionName: 'Error',
        title: 'Error',
        content: 'An error occurred while generating the report.',
        valid: true,
        errors: [(error as Error).message]
      }];
    }
  }
}