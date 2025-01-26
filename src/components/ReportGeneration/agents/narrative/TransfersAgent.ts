import { BaseAgent } from '../BaseAgent';
import { AgentContext, AssessmentData } from '../../types';
import _ from 'lodash';

interface NarrativeTransferOutput {
  valid: boolean;
  narrative: string;
  bullets: string[];
  recommendations: string[];
  errors?: string[];
}

export class NarrativeTransfersAgent extends BaseAgent {
  constructor(context: AgentContext) {
    super(context, 2.1, 'Transfer Narrative', ['functionalAssessment.transfers']);
  }

  async processData(data: AssessmentData): Promise<NarrativeTransferOutput> {
    const transfers = _.get(data, 'functionalAssessment.transfers', {});
    const currentEquipment = _.get(data, 'equipment.current', []);
    const bergBalance = _.get(data, 'functionalAssessment.bergBalance.totalScore');

    const narrative = this.generateNarrative(transfers, bergBalance);
    const bullets = this.generateBulletPoints(transfers, currentEquipment);
    const recommendations = this.generateRecommendations(transfers, bergBalance, currentEquipment);

    return {
      valid: true,
      narrative,
      bullets,
      recommendations
    };
  }

  private generateNarrative(transfers: Record<string, any>, bergBalance?: number): string {
    const sections: string[] = [];

    // Overall transfer ability
    const overallLevel = this.determineOverallLevel(transfers);
    sections.push(`Patient demonstrates ${overallLevel} transfer abilities.`);

    // Add specific details about different transfers
    const specifics = this.getTransferSpecifics(transfers);
    if (specifics) {
      sections.push(specifics);
    }

    // Add balance information if available
    if (bergBalance !== undefined) {
      sections.push(this.getBalanceNarrative(bergBalance));
    }

    return sections.join(' ');
  }

  private determineOverallLevel(transfers: Record<string, any>): string {
    const levels = [
      transfers.bedMobility,
      transfers.sitToStand,
      ...(transfers.toilet ? [transfers.toilet.assistanceLevel] : []),
      ...(transfers.shower ? [transfers.shower.assistanceLevel] : [])
    ].filter(Boolean);

    if (levels.every(l => l === 'Independent')) {
      return 'independent';
    }
    
    if (levels.every(l => l === 'Independent' || l === 'Modified Independent')) {
      return 'modified independent';
    }
    
    if (levels.some(l => l === 'Dependent')) {
      return 'dependent';
    }
    
    return 'varied levels of independence with';
  }

  private getTransferSpecifics(transfers: Record<string, any>): string {
    const details: string[] = [];

    if (transfers.bedMobility) {
      details.push(`Bed mobility is ${transfers.bedMobility.toLowerCase()}`);
    }

    if (transfers.sitToStand) {
      details.push(`sit-to-stand transfers are ${transfers.sitToStand.toLowerCase()}`);
    }

    if (transfers.toilet) {
      const toiletDetails = [];
      toiletDetails.push(`toilet transfers are ${transfers.toilet.assistanceLevel.toLowerCase()}`);
      
      if (transfers.toilet.equipment?.length) {
        toiletDetails.push(`using ${transfers.toilet.equipment.join(' and ')}`);
      }
      
      details.push(toiletDetails.join(' '));
    }

    if (transfers.shower) {
      const showerDetails = [];
      showerDetails.push(`shower transfers are ${transfers.shower.assistanceLevel.toLowerCase()}`);
      
      if (transfers.shower.equipment?.length) {
        showerDetails.push(`using ${transfers.shower.equipment.join(' and ')}`);
      }
      
      details.push(showerDetails.join(' '));
    }

    return details.length > 0 ? details.join(', and ') + '.' : '';
  }

  private getBalanceNarrative(bergBalance: number): string {
    if (bergBalance >= 45) {
      return 'Balance testing indicates low fall risk.';
    } else if (bergBalance >= 35) {
      return 'Balance testing indicates moderate fall risk.';
    } else {
      return 'Balance testing indicates high fall risk.';
    }
  }

  private generateBulletPoints(transfers: Record<string, any>, currentEquipment: string[]): string[] {
    const bullets: string[] = [];

    // Equipment utilization
    const allEquipment = new Set([
      ...(transfers.toilet?.equipment || []),
      ...(transfers.shower?.equipment || []),
      ...currentEquipment
    ]);

    if (allEquipment.size > 0) {
      bullets.push(`Currently using: ${Array.from(allEquipment).join(', ')}`);
    }

    // Safety concerns
    const concerns = [
      ...(transfers.toilet?.safety_concerns || []),
      ...(transfers.shower?.safety_concerns || [])
    ];

    if (concerns.length > 0) {
      bullets.push(`Safety concerns: ${concerns.join(', ')}`);
    }

    // Modifications
    const modifications = [
      ...(transfers.toilet?.modifications || []),
      ...(transfers.shower?.modifications || [])
    ];

    if (modifications.length > 0) {
      bullets.push(`Required modifications: ${modifications.join(', ')}`);
    }

    return bullets;
  }

  private generateRecommendations(
    transfers: Record<string, any>,
    bergBalance?: number,
    currentEquipment: string[] = []
  ): string[] {
    const recommendations: string[] = [];

    // Equipment recommendations
    const neededEquipment = [
      ...(transfers.toilet?.equipment || []),
      ...(transfers.shower?.equipment || [])
    ].filter(item => !currentEquipment.includes(item));

    if (neededEquipment.length > 0) {
      recommendations.push(`Obtain: ${neededEquipment.join(', ')}`);
    }

    // Balance-based recommendations
    if (bergBalance !== undefined && bergBalance < 45) {
      recommendations.push('Physical therapy evaluation for balance training');
    }

    // Assistance-based recommendations
    const needsAssistance = [
      transfers.bedMobility,
      transfers.sitToStand,
      transfers.toilet?.assistanceLevel,
      transfers.shower?.assistanceLevel
    ].some(level => level && level !== 'Independent');

    if (needsAssistance) {
      recommendations.push('Transfer training with occupational therapy');
    }

    return recommendations;
  }

  format(data: NarrativeTransferOutput): string {
    return this.formatByDetailLevel(data, this.context.config?.detailLevel || 'standard');
  }

  protected override formatBrief(data: NarrativeTransferOutput): string {
    return data.narrative;
  }

  protected override formatDetailed(data: NarrativeTransferOutput): string {
    const sections = [data.narrative];

    if (data.bullets.length > 0) {
      sections.push('\nKey Points:');
      data.bullets.forEach(bullet => {
        sections.push(`• ${bullet}`);
      });
    }

    if (data.recommendations.length > 0) {
      sections.push('\nRecommendations:');
      data.recommendations.forEach(rec => {
        sections.push(`• ${rec}`);
      });
    }

    return sections.join('\n');
  }
}