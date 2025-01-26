import { ADLAgent } from './adl/BasicADLAgent';
import { MobilityAgent } from './MobilityAgent';
import { PhysicalSymptomsAgent } from './symptoms/PhysicalSymptomsAgent';
import { AgentContext, AssessmentData, ReportSection } from '../types';

export class AgentOrchestrator {
  private adlAgent: ADLAgent;
  private mobilityAgent: MobilityAgent;
  private symptomsAgent: PhysicalSymptomsAgent;

  constructor(context: AgentContext) {
    this.adlAgent = new ADLAgent(context);
    this.mobilityAgent = new MobilityAgent(context);
    this.symptomsAgent = new PhysicalSymptomsAgent(context);
  }

  async generateReport(assessment: AssessmentData): Promise<ReportSection[]> {
    const sections = await Promise.all([
      this.adlAgent.generateSection(assessment),
      this.mobilityAgent.generateSection(assessment),
      this.symptomsAgent.generateSection(assessment)
    ]);

    return sections.sort((a, b) => a.orderNumber - b.orderNumber);
  }
}