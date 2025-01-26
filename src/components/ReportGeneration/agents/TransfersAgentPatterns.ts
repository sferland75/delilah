import type { TransferPattern, TransferLocation } from '../types/transfers';
import { TransfersAgentAnalysis } from './TransfersAgentAnalysis';

interface TransferDetails {
  assistanceLevel?: 'independent' | 'modified_independent' | 'minimal_assist' | 'moderate_assist' | 'maximum_assist';
  equipment?: string[];
  modifications?: string[];
  safety_concerns?: string[];
}

interface EnvironmentDetails {
  hazards?: string[];
}

export class TransfersAgentPatterns extends TransfersAgentAnalysis {
  protected analyzeTransferPatterns(data: any): TransferPattern[] {
    const patterns: TransferPattern[] = [];
    const transfers = data.transfers || {};

    if (transfers.bedMobility && this.isValidAssistanceLevel(transfers.bedMobility)) {
      patterns.push({
        type: transfers.bedMobility,
        context: 'bed_mobility',
        modifications: this.getModifications(data, 'bed'),
        equipment: this.getRequiredEquipment(data, 'bed')
      });
    }

    if (transfers.sitToStand && this.isValidAssistanceLevel(transfers.sitToStand)) {
      patterns.push({
        type: transfers.sitToStand,
        context: 'sit_to_stand',
        modifications: this.getModifications(data, 'chair'),
        equipment: this.getRequiredEquipment(data, 'chair')
      });
    }

    return patterns;
  }

  private isValidAssistanceLevel(level: any): level is TransferPattern['type'] {
    return ['independent', 'modified_independent', 'minimal_assist', 'moderate_assist', 'maximum_assist'].includes(level);
  }

  protected analyzeLocationSpecificTransfers(data: any): TransferLocation[] {
    const locations: TransferLocation[] = [];
    const locationTypes = ['bed', 'chair', 'toilet', 'shower/tub'];
    
    locationTypes.forEach((location: string) => {
      locations.push({
        location,
        patterns: this.getLocationPatterns(data, location === 'shower/tub' ? 'shower' : location),
        risks: this.getLocationRisks(data, location === 'shower/tub' ? 'shower' : location)
      });
    });

    return locations;
  }

  protected getLocationPatterns(data: any, location: string): TransferPattern[] {
    const patterns: TransferPattern[] = [];
    const transfers = data.transfers || {};
    const transferData = transfers[location] as TransferDetails;

    if (transferData && transferData.assistanceLevel) {
      const type = this.isValidAssistanceLevel(transferData.assistanceLevel) 
        ? transferData.assistanceLevel 
        : 'independent';

      patterns.push({
        type,
        context: `${location}_transfer`,
        modifications: this.getModifications(data, location),
        equipment: this.getRequiredEquipment(data, location),
        safety_concerns: this.getSafetyConcerns(data, location)
      });
    }

    return patterns;
  }

  protected getLocationRisks(data: any, location: string): string[] {
    const risks: string[] = [];
    const transfers = data.transfers || {};
    const transferData = transfers[location] as TransferDetails;

    if (transferData?.safety_concerns) {
      risks.push(...transferData.safety_concerns);
    }

    const environmentRisks = this.getEnvironmentalRisks(data, location);
    if (environmentRisks.length > 0) {
      risks.push(...environmentRisks);
    }

    return risks;
  }

  protected getModifications(data: any, location: string): string[] {
    const modifications: string[] = [];
    const transfers = data.transfers || {};
    const transferData = transfers[location] as TransferDetails;

    if (transferData?.modifications) {
      modifications.push(...transferData.modifications);
    }

    return modifications;
  }

  protected getRequiredEquipment(data: any, location: string): string[] {
    const equipment: string[] = [];
    const transfers = data.transfers || {};
    const transferData = transfers[location] as TransferDetails;

    if (transferData?.equipment) {
      equipment.push(...transferData.equipment);
    }

    return equipment;
  }

  protected getSafetyConcerns(data: any, location: string): string[] {
    const concerns: string[] = [];
    const transfers = data.transfers || {};
    const transferData = transfers[location] as TransferDetails;

    if (transferData?.safety_concerns) {
      concerns.push(...transferData.safety_concerns);
    }

    return concerns;
  }

  protected getEnvironmentalRisks(data: any, location: string): string[] {
    const risks: string[] = [];
    const environment = data.environment || {};
    const environmentData = environment[location] as EnvironmentDetails;

    if (environmentData?.hazards) {
      risks.push(...environmentData.hazards.map((hazard: string) => `${location}: ${hazard}`));
    }

    return risks;
  }

  protected identifyRequiredEquipment(data: any, patterns: TransferPattern[]): string[] {
    const equipment = new Set<string>();

    // Add equipment from patterns
    for (const pattern of patterns) {
      if (pattern.equipment) {
        for (const item of pattern.equipment) {
          equipment.add(item);
        }
      }
    }

    // Add equipment from transfers
    const transfers = data.transfers || {};
    for (const details of Object.values(transfers)) {
      const transferDetails = details as TransferDetails;
      if (transferDetails?.equipment) {
        for (const item of transferDetails.equipment) {
          equipment.add(item);
        }
      }
    }

    // Add current equipment that's still needed
    const currentEquipment = data.currentEquipment || [];
    for (const item of currentEquipment) {
      if (this.isEquipmentRequired(item, patterns)) {
        equipment.add(item);
      }
    }

    return Array.from(equipment);
  }

  protected isEquipmentRequired(item: string, patterns: TransferPattern[]): boolean {
    return patterns.some((pattern: TransferPattern) => 
      pattern.type !== 'independent' && 
      pattern.equipment?.includes(item)
    );
  }
}