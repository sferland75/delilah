import type { TransferPattern } from '../types/transfers';
import { TransfersAgentPatterns } from './TransfersAgentPatterns';

type AssistanceLevel = 'independent' | 'modified_independent' | 'minimal_assist' | 'moderate_assist' | 'maximum_assist';

interface TransferDetails {
  assistanceLevel?: AssistanceLevel;
  equipment?: string[];
  modifications?: string[];
  safety_concerns?: string[];
}

interface EnvironmentDetails {
  hazards?: string[];
}

export abstract class TransfersAgentRecommendations extends TransfersAgentPatterns {
  protected assessRiskFactors(data: any): string[] {
    const risks: string[] = [];

    // First check symptoms
    const physicalSymptoms = data?.symptoms?.physical || [];
    for (const symptom of physicalSymptoms) {
      if (['hip', 'knee', 'back', 'shoulder'].some((term: string) => 
        symptom.location.toLowerCase().includes(term)
      )) {
        risks.push(`${symptom.location} ${symptom.severity.toLowerCase()} ${symptom.painType.toLowerCase()} impacts transfer safety`);
      }
    }

    // Then check assistance levels
    const transfers = data.transfers || {};
    for (const [location, details] of Object.entries(transfers)) {
      const transferDetails = details as TransferDetails;
      if (transferDetails?.assistanceLevel && ['moderate_assist', 'maximum_assist'].includes(transferDetails.assistanceLevel)) {
        risks.push(`High assistance needs for ${location} transfers`);
      }
    }

    // Finally add environmental risks
    const environment = data.environment || {};
    for (const [location, details] of Object.entries(environment)) {
      const envDetails = details as EnvironmentDetails;
      if (envDetails?.hazards) {
        for (const hazard of envDetails.hazards) {
          risks.push(`${location}: ${hazard}`);
        }
      }
    }

    return risks;
  }

  protected generateRecommendations(data: any, patterns: TransferPattern[], risks: string[]): string[] {
    const recommendations: string[] = [];

    // Equipment recommendations
    const requiredEquipment = this.identifyRequiredEquipment(data, patterns);
    const currentEquipment = new Set(data.currentEquipment || []);
    
    requiredEquipment.forEach((item: string) => {
      if (!currentEquipment.has(item)) {
        // Maintain original format with underscores
        recommendations.push(`Obtain ${item} for safe transfers`);
      }
    });

    // Training recommendations
    if (patterns.some((p: TransferPattern) => p.type !== 'independent' && p.type !== 'modified_independent')) {
      recommendations.push('Transfer training with physical therapy recommended');
    }

    // Environmental modifications
    risks.forEach((risk: string) => {
      if (risk.toLowerCase().includes('hazard')) {
        recommendations.push(`Address ${risk}`);
      }
    });

    // Check all location patterns for assistance levels
    const transfers = data.transfers || {};
    let needsCaregiverTraining = false;

    for (const details of Object.values(transfers)) {
      const transferDetails = details as TransferDetails;
      if (transferDetails?.assistanceLevel === 'moderate_assist' || transferDetails?.assistanceLevel === 'maximum_assist') {
        needsCaregiverTraining = true;
        break;
      }
    }

    if (needsCaregiverTraining) {
      recommendations.push('Caregiver training for safe transfer techniques recommended');
    }

    return recommendations;
  }
}