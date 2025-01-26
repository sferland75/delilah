import { RangeOfMotionAgent } from './agents/RangeOfMotion';
import { ADLAgent } from './agents/ADLAgent';
import { TransfersAgent } from './agents/TransfersAgent';
import { AgentContext } from './agents/BaseAgent';

export class AgentOrchestrator {
  private romAgent: RangeOfMotionAgent;
  private adlAgent: ADLAgent;
  private transfersAgent: TransfersAgent;
  private context: AgentContext;

  constructor(context: AgentContext) {
    this.context = context;
    this.romAgent = new RangeOfMotionAgent(context);
    this.adlAgent = new ADLAgent(context);
    this.transfersAgent = new TransfersAgent(context);
  }

  async processAssessment(data: any) {
    // Process ROM data
    const romResults = await this.romAgent.processData(data);
    
    // Process ADL data with ROM context
    const adlResults = await this.adlAgent.processData({
      ...data,
      context: {
        rom: {
          restrictedMovements: romResults.patterns.restricted,
          painfulMovements: romResults.patterns.painful
        }
      }
    });

    // Process transfers with ROM and ADL context
    const transferResults = await this.transfersAgent.processData({
      ...data,
      context: {
        rom: {
          restrictions: romResults.patterns.restricted,
          pain: romResults.patterns.painful
        },
        adl: {
          assistanceNeeds: adlResults.assistanceNeeds
        }
      }
    });

    // Compile final report
    return {
      rangeOfMotion: romResults,
      adl: adlResults,
      transfers: transferResults,
      summary: this.generateSummary(romResults, adlResults, transferResults)
    };
  }

  private generateSummary(rom: any, adl: any, transfers: any) {
    return {
      keyFindings: [
        ...rom.impact,
        ...adl.impact,
        ...transfers.impact
      ],
      recommendations: this.correlateRecommendations(rom, adl, transfers)
    };
  }

  private correlateRecommendations(rom: any, adl: any, transfers: any) {
    const recommendations = [];

    // Correlate ROM and ADL impacts
    if (rom.patterns.restricted.length > 0 && adl.assistanceNeeds.length > 0) {
      recommendations.push('Consider adaptive equipment to compensate for ROM limitations');
    }

    // Correlate ROM and transfer impacts
    if (rom.patterns.painful.length > 0 && transfers.risks.length > 0) {
      recommendations.push('Transfer training needed with focus on pain management');
    }

    return recommendations;
  }
}