import { BaseAgent } from './BaseAgent';
import { AgentContext, AssessmentData } from '../types';
import _ from 'lodash';

interface TransferLocation {
  assistanceLevel: string;
  equipment?: string[];
  modifications?: string[];
  safety_concerns?: string[];
}

interface TransferData {
  locations: string[];
  assistanceLevels: Record<string, string>;
  requiredEquipment: string[];
  safetyModifications: string[];
  concerns: string[];
}

export interface TransferOutput {
  valid: boolean;
  transferStatus: {
    locations: string[];
    requiredEquipment: string[];
  };
  riskFactors: string[];
  recommendations: string[];
  errors?: string[];
}

export class TransfersAgent extends BaseAgent {
  constructor(context: AgentContext) {
    super(context, 2.1, 'Transfer Assessment', ['functionalAssessment.transfers']);
  }

  async processData(data: AssessmentData): Promise<TransferOutput> {
    const transfers = _.get(data, 'functionalAssessment.transfers', {});
    const currentEquipment = _.get(data, 'equipment.current', []);
    const bergBalance = _.get(data, 'functionalAssessment.bergBalance.totalScore');
    
    const transferData = this.extractTransferData(transfers);
    const riskFactors = this.analyzeRiskFactors(transferData, bergBalance);
    const recommendations = this.generateRecommendations(transferData, currentEquipment, riskFactors);

    return {
      valid: true,
      transferStatus: {
        locations: transferData.locations,
        requiredEquipment: transferData.requiredEquipment
      },
      riskFactors,
      recommendations
    };
  }

  private extractTransferData(data: Record<string, any>): TransferData {
    const transferData: TransferData = {
      locations: [],
      assistanceLevels: {},
      requiredEquipment: [],
      safetyModifications: [],
      concerns: []
    };

    // Process bed mobility and sit-to-stand
    if (data.bedMobility) {
      transferData.locations.push('bed');
      transferData.assistanceLevels.bed = data.bedMobility;
    }

    if (data.sitToStand) {
      transferData.locations.push('chair');
      transferData.assistanceLevels.chair = data.sitToStand;
    }

    // Process specific transfer locations
    ['toilet', 'shower', 'tub', 'car'].forEach(location => {
      const transferInfo = data[location] as TransferLocation;
      if (transferInfo) {
        transferData.locations.push(location);
        transferData.assistanceLevels[location] = transferInfo.assistanceLevel;

        if (transferInfo.equipment) {
          transferData.requiredEquipment.push(...transferInfo.equipment);
        }

        if (transferInfo.modifications) {
          transferData.safetyModifications.push(...transferInfo.modifications);
        }

        if (transferInfo.safety_concerns) {
          transferData.concerns.push(...transferInfo.safety_concerns);
        }
      }
    });

    // Remove duplicates
    transferData.requiredEquipment = [...new Set(transferData.requiredEquipment)];
    transferData.safetyModifications = [...new Set(transferData.safetyModifications)];
    transferData.concerns = [...new Set(transferData.concerns)];

    return transferData;
  }

  private analyzeRiskFactors(data: TransferData, bergBalance?: number): string[] {
    const riskFactors: string[] = [];

    // Analyze assistance levels
    const needsAssistance = Object.values(data.assistanceLevels).some(level => 
      level !== 'Independent'
    );

    if (needsAssistance) {
      riskFactors.push('Requires assistance with transfers');
    }

    // Check equipment dependency
    if (data.requiredEquipment.length > 0) {
      riskFactors.push('Equipment dependent for safe transfers');
    }

    // Check explicit safety concerns
    if (data.concerns.length > 0) {
      riskFactors.push(...data.concerns);
    }

    // Check Berg Balance Score
    if (bergBalance !== undefined && bergBalance < 45) {
      riskFactors.push('Decreased balance per Berg Balance Score');
    }

    return riskFactors;
  }

  private generateRecommendations(
    data: TransferData, 
    currentEquipment: string[],
    riskFactors: string[]
  ): string[] {
    const recommendations: string[] = [];

    // Equipment recommendations
    const neededEquipment = data.requiredEquipment.filter(
      equipment => !currentEquipment.includes(equipment)
    );

    if (neededEquipment.length > 0) {
      recommendations.push(`Obtain needed transfer equipment: ${neededEquipment.join(', ')}`);
    }

    // Safety modification recommendations
    if (data.safetyModifications.length > 0) {
      recommendations.push(`Implement safety modifications: ${data.safetyModifications.join(', ')}`);
    }

    // Therapy recommendations based on risk factors
    if (riskFactors.some(risk => risk.toLowerCase().includes('balance'))) {
      recommendations.push('Physical therapy evaluation for balance training');
    }

    if (riskFactors.some(risk => risk.toLowerCase().includes('assistance'))) {
      recommendations.push('Occupational therapy for transfer training');
    }

    return recommendations;
  }

  protected formatBrief(data: TransferOutput): string {
    const sections = ['Transfer Status'];

    if (data.transferStatus.locations.length > 0) {
      sections.push(`\nTransfer Locations: ${data.transferStatus.locations.join(', ')}`);
    }

    if (data.riskFactors.length > 0) {
      sections.push(`\nRisk Factors: ${data.riskFactors.join(', ')}`);
    }

    return sections.join('\n');
  }

  protected formatStandard(data: TransferOutput): string {
    const sections = ['Transfer Assessment'];

    sections.push('\nTransfer Locations:');
    data.transferStatus.locations.forEach(location => {
      sections.push(`- ${location}`);
    });

    if (data.transferStatus.requiredEquipment.length > 0) {
      sections.push('\nRequired Equipment:');
      data.transferStatus.requiredEquipment.forEach(equipment => {
        sections.push(`- ${equipment}`);
      });
    }

    if (data.riskFactors.length > 0) {
      sections.push('\nRisk Factors:');
      data.riskFactors.forEach(risk => {
        sections.push(`- ${risk}`);
      });
    }

    return sections.join('\n');
  }

  protected formatDetailed(data: TransferOutput): string {
    const sections = this.formatStandard(data).split('\n');

    if (data.recommendations.length > 0) {
      sections.push('\nRecommendations:');
      data.recommendations.forEach(rec => {
        sections.push(`- ${rec}`);
      });
    }

    return sections.join('\n');
  }
}