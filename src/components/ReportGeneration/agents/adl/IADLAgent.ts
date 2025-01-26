import { BaseAgent } from '../BaseAgent';
import { IndependenceLevel } from './ADLTypes';
import { IADLData, ProcessedIADLData, IADLSection } from './IADLTypes';
import { formatBrief, formatStandard, formatDetailed, formatIndependenceLevel } from './formatters';
import { identifyRisks } from './riskPatterns';
import { ensureActivity, ensureIndependenceLevel, ensureString } from './typeUtils';
import {
  extractBarriers,
  determineOverallIndependence,
  processCategoryNeeds,
  determineSupportType,
  determineFrequency,
  determineAdaptation,
  generateRationale
} from './analysisUtils';

export class IADLAgent extends BaseAgent {
  protected initializeValidationRules(): void {
    this.validationRules.set('household', (value) => {
      return value && typeof value === 'object';
    });
    this.validationRules.set('community', (value) => {
      return value && typeof value === 'object';
    });
  }

  async processData(data: IADLData): Promise<ProcessedIADLData> {
    const sections = {
      household: this.processSection(data.household),
      community: this.processSection(data.community)
    };

    const overallIndependence = determineOverallIndependence(data);
    const supportNeeds = this.determineSupportNeeds(data);
    const recommendations = this.generateRecommendations(data);
    const safetyConsiderations = this.identifySafetyConsiderations(data);

    return {
      sections,
      overallIndependence,
      supportNeeds,
      recommendations,
      safetyConsiderations
    };
  }

  protected formatByDetailLevel(data: unknown, detailLevel: 'brief' | 'standard' | 'detailed'): string {
    const iadlData = data as ProcessedIADLData;
    switch (detailLevel) {
      case 'brief':
        return formatBrief(iadlData, formatIndependenceLevel);
      case 'detailed':
        return formatDetailed(iadlData, formatIndependenceLevel);
      default:
        return formatStandard(iadlData, formatIndependenceLevel);
    }
  }

  protected getSectionKeys(): string[] {
    return ['household', 'community'];
  }

  private processSection(data: any): IADLSection[] {
    return Object.entries(data).map(([activity, details]: [string, any]) => ({
      activity,
      notes: ensureString(details.notes),
      independence: ensureIndependenceLevel(details.independence),
      barriersIdentified: extractBarriers(ensureString(details.notes)),
      adaptationsUsed: details.adaptations || []
    }));
  }

  private determineSupportNeeds(data: IADLData): ProcessedIADLData['supportNeeds'] {
    const needs: ProcessedIADLData['supportNeeds'] = [];

    const processedHousehold = Object.entries(data.household).reduce((acc, [key, value]) => {
      acc[key] = ensureActivity(value);
      return acc;
    }, {} as Record<string, { independence: IndependenceLevel; notes: string }>);

    const processedCommunity = Object.entries(data.community).reduce((acc, [key, value]) => {
      acc[key] = ensureActivity(value);
      return acc;
    }, {} as Record<string, { independence: IndependenceLevel; notes: string }>);

    processCategoryNeeds(processedHousehold, 'Household', needs);
    processCategoryNeeds(processedCommunity, 'Community', needs);

    return needs;
  }

  private generateRecommendations(data: IADLData): ProcessedIADLData['recommendations'] {
    const recommendations: ProcessedIADLData['recommendations'] = [];

    Object.entries({ ...data.household, ...data.community }).forEach(([activity, details]) => {
      const processedDetails = ensureActivity(details);
      if (processedDetails.independence === 'not_applicable' || processedDetails.independence === 'independent') {
        return;
      }

      recommendations.push({
        activity,
        adaptation: determineAdaptation(activity, processedDetails),
        supportType: determineSupportType(processedDetails.independence),
        frequency: determineFrequency(processedDetails.independence),
        rationale: generateRationale(activity, processedDetails)
      });
    });

    return recommendations;
  }

  private identifySafetyConsiderations(data: IADLData): ProcessedIADLData['safetyConsiderations'] {
    const considerations: ProcessedIADLData['safetyConsiderations'] = [];

    Object.entries({ ...data.household, ...data.community }).forEach(([activity, details]) => {
      const processedDetails = ensureActivity(details);
      const risks = identifyRisks(activity, processedDetails);
      if (risks) {
        considerations.push(risks);
      }
    });

    return considerations;
  }
}