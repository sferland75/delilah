import { TransfersAgentFormatting } from './TransfersAgentFormatting';
import type { AssessmentData } from '../types';
import type { TransfersAgentOutput } from '../types/transfers';
import type { AgentContext } from '../types';

export class TransfersAgent extends TransfersAgentFormatting {
  constructor(context: AgentContext) {
    super(context, 3, 'Transfers Assessment', [
      'functionalAssessment.transfers.bedMobility',
      'functionalAssessment.transfers.sitToStand'
    ]);
  }

  protected override initializeValidationRules(): void {
    const validAssistanceLevels = [
      'independent',
      'modified_independent',
      'minimal_assist',
      'moderate_assist',
      'maximum_assist'
    ];

    this.addValidationRule(
      (data: any) => {
        const bedMobility = this.getField(data, 'functionalAssessment.transfers.bedMobility', '');
        return validAssistanceLevels.includes(bedMobility);
      },
      'Invalid value for functionalAssessment.transfers.bedMobility'
    );

    this.addValidationRule(
      (data: any) => {
        const sitToStand = this.getField(data, 'functionalAssessment.transfers.sitToStand', '');
        return validAssistanceLevels.includes(sitToStand);
      },
      'Invalid value for functionalAssessment.transfers.sitToStand'
    );
  }

  protected override getSectionKeys(): string[] {
    return [
      'transferStatus.locations',
      'transferStatus.generalPatterns',
      'transferStatus.requiredEquipment',
      'riskFactors',
      'recommendations'
    ];
  }

  public async analyze(data: AssessmentData): Promise<TransfersAgentOutput> {
    const transferData = this.extractTransferData(data);
    const patterns = this.analyzeTransferPatterns(transferData);
    const risks = this.assessRiskFactors(transferData);
    const recommendations = this.generateRecommendations(transferData, patterns, risks);

    return {
      transferStatus: {
        locations: this.analyzeLocationSpecificTransfers(transferData),
        generalPatterns: patterns,
        requiredEquipment: this.identifyRequiredEquipment(transferData, patterns)
      },
      riskFactors: risks,
      recommendations
    };
  }

  public async processData(data: AssessmentData): Promise<TransfersAgentOutput> {
    return this.analyze(data);
  }
}