import type { AssessmentData } from '../types';
import type { TransferPattern, TransferLocation, TransfersAgentOutput } from '../types/transfers';
import { TransfersAgentBase } from './TransfersAgentBase';

export abstract class TransfersAgentAnalysis extends TransfersAgentBase {
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

  protected extractTransferData(data: AssessmentData): any {
    return {
      transfers: this.getField(data, 'functionalAssessment.transfers', {}),
      currentEquipment: this.getField(data, 'equipment.current', []),
      symptoms: {
        physical: this.getField(data, 'symptoms.physical', [])
      },
      environment: this.getField(data, 'environment.home', {})
    };
  }

  protected abstract analyzeTransferPatterns(data: any): TransferPattern[];
  protected abstract analyzeLocationSpecificTransfers(data: any): TransferLocation[];
  protected abstract assessRiskFactors(data: any): string[];
  protected abstract generateRecommendations(data: any, patterns: TransferPattern[], risks: string[]): string[];
  protected abstract identifyRequiredEquipment(data: any, patterns: TransferPattern[]): string[]; // Added this line
}