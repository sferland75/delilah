import { AssessmentData, ReportSection, AgentContext } from './types';
import { BaseAgent } from './agents/BaseAgent';
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

export class AgentOrchestrator {
  private agents: Array<BaseAgent>;

  constructor(context: AgentContext) {
    // Initialize all agents in order
    this.agents = [
      new DocumentationAgent(context),
      new MobilityAgent(context),
      new RangeOfMotionAgent(context),
      new TransfersAgent(context),
      new BasicADLAgent(context),
      new IADLAgent(context),
      new PhysicalSymptomsAgent(context),
      new CognitiveSymptomAgent(context),
      new EmotionalSymptomAgent(context),
      new SymptomIntegrationAgent(context)
    ];
    
    // Sort by order number
    this.agents.sort((a, b) => a.getOrderNumber() - b.getOrderNumber());
  }

  async generateReport(data: AssessmentData): Promise<ReportSection[]> {
    // Generate all sections in parallel
    const sections = await Promise.all(
      this.agents.map(agent => agent.generateSection(data))
    );

    return sections;
  }
}