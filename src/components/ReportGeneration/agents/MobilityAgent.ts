import { BaseAgent } from './BaseAgent';
import type { 
  AgentContext, 
  ProcessedData,
  AssessmentData
} from '../types';

export interface MovementPattern {
  type: 'high_risk' | 'limited' | 'modified' | 'routine';
  context: string;
  restrictions?: string[];
  pattern?: string;
}

export interface DistanceCapacity {
  max: number;
  sustainable: number;
  unit: string;
}

export interface DistanceAnalysis {
  indoor: DistanceCapacity;
  outdoor: DistanceCapacity;
}

export interface MobilityAgentOutput extends ProcessedData {
  mobilityStatus: {
    indoorMobility: MovementPattern[];
    outdoorMobility: MovementPattern[];
    assistiveDevices: string[];
    distanceCapacity: DistanceAnalysis;
  };
  riskFactors: string[];
  recommendations: string[];
}

export class MobilityAgent extends BaseAgent {
  constructor(context: AgentContext) {
    super(context, 3, 'Mobility Assessment', [
      'functionalAssessment.bergBalance',
      'functionalAssessment.posturalTolerances',
      'symptoms.physical',
      'typicalDay.current'
    ]);
  }

  protected initializeValidationRules(): void {
    this.validationRules.set('functionalAssessment.bergBalance.totalScore', 
      (value) => typeof value === 'number' && value >= 0 && value <= 56);
  }

  protected getSectionKeys(): string[] {
    return [
      'functionalAssessment.bergBalance',
      'functionalAssessment.posturalTolerances',
      'symptoms.physical',
      'typicalDay.current'
    ];
  }

  public async analyze(data: AssessmentData): Promise<MobilityAgentOutput> {
    const mobilityData = this.extractMobilityData(data);
    const patterns = this.analyzeMovementPatterns(mobilityData);
    const risks = this.assessRiskFactors(mobilityData);
    const recommendations = this.generateRecommendations(mobilityData);

    return {
      mobilityStatus: {
        indoorMobility: patterns.indoor,
        outdoorMobility: patterns.outdoor,
        assistiveDevices: this.identifyAssistiveDevices(mobilityData),
        distanceCapacity: this.calculateDistanceCapacity(mobilityData)
      },
      riskFactors: risks,
      recommendations
    };
  }

  public async processData(data: AssessmentData): Promise<MobilityAgentOutput> {
    return this.analyze(data);
  }

  private extractMobilityData(data: AssessmentData): any {
    return {
      balanceScore: this.getField(data, 'functionalAssessment.bergBalance.totalScore', 0),
      balanceItems: this.getField(data, 'functionalAssessment.bergBalance.items', {}),
      posturalTolerances: this.getField(data, 'functionalAssessment.posturalTolerances', {}),
      symptoms: this.getField(data, 'symptoms.physical', []),
      dailyRoutine: this.getField(data, 'typicalDay.current.daily', {})
    };
  }

  private analyzeMovementPatterns(data: any): {indoor: MovementPattern[], outdoor: MovementPattern[]} {
    const patterns = {
      indoor: [] as MovementPattern[],
      outdoor: [] as MovementPattern[]
    };

    // Add patterns based on Berg Balance Score
    if (data.balanceScore <= 45) {
      patterns.indoor.push({
        type: 'high_risk',
        context: 'balance_impairment',
        restrictions: ['Requires supervision for all mobility']
      });
    }

    // Add patterns based on symptoms
    const mobilityImpactingSymptoms = data.symptoms.filter((s: any) => 
      ['hip', 'knee', 'ankle', 'back', 'leg'].some(term => 
        s.location.toLowerCase().includes(term)
      )
    );

    if (mobilityImpactingSymptoms.length > 0) {
      patterns.indoor.push({
        type: 'modified',
        context: 'symptom_management',
        restrictions: mobilityImpactingSymptoms.map((s: any) => 
          `Modified movement due to ${s.location} ${s.painType.toLowerCase()}`
        )
      });
    }

    return patterns;
  }

  private calculateDistanceCapacity(data: any): DistanceAnalysis {
    const capacity: DistanceAnalysis = {
      indoor: {
        max: 0,
        sustainable: 0,
        unit: 'meters'
      },
      outdoor: {
        max: 0,
        sustainable: 0,
        unit: 'meters'
      }
    };

    // Calculate based on Berg Balance Score
    if (data.balanceScore >= 45) {
      capacity.indoor.max = 100;
      capacity.indoor.sustainable = 50;
      capacity.outdoor.max = 200;
      capacity.outdoor.sustainable = 100;
    } else if (data.balanceScore >= 35) {
      capacity.indoor.max = 50;
      capacity.indoor.sustainable = 25;
      capacity.outdoor.max = 100;
      capacity.outdoor.sustainable = 50;
    } else {
      capacity.indoor.max = 20;
      capacity.indoor.sustainable = 10;
      capacity.outdoor.max = 30;
      capacity.outdoor.sustainable = 15;
    }

    return capacity;
  }

  private identifyAssistiveDevices(data: any): string[] {
    const devices: string[] = [];
    
    if (data.balanceScore <= 20) {
      devices.push('Wheelchair');
    } else if (data.balanceScore <= 35) {
      devices.push('Walker');
    } else if (data.balanceScore <= 45) {
      devices.push('Cane');
    }

    return devices;
  }

  private assessRiskFactors(data: any): string[] {
    const risks: string[] = [];

    if (data.balanceScore <= 45) {
      risks.push('High fall risk due to impaired balance');
    }

    const severeSymptoms = data.symptoms.filter((s: any) => 
      ['Severe', 'Very Severe'].includes(s.severity)
    );
    
    severeSymptoms.forEach((symptom: any) => {
      risks.push(`Mobility limitation due to ${symptom.location} ${symptom.painType.toLowerCase()}`);
    });

    return risks;
  }

  private generateRecommendations(data: any): string[] {
    const recommendations: string[] = [];

    if (data.balanceScore <= 45) {
      recommendations.push('Physical therapy for balance training');
      recommendations.push('Home exercise program focusing on balance');
    }

    const devices = this.identifyAssistiveDevices(data);
    if (devices.length > 0) {
      recommendations.push(`Assessment for appropriate use of ${devices.join(', ')}`);
    }

    // Add activity modification for severe symptoms
    const severeSymptoms = data.symptoms.filter((s: any) => 
      ['Severe', 'Very Severe'].includes(s.severity)
    );
    
    if (severeSymptoms.length > 0) {
      recommendations.push('Activity modification and pain management program recommended');
    }

    return recommendations;
  }

  protected formatByDetailLevel(data: MobilityAgentOutput, detailLevel: string): string {
    switch (detailLevel) {
      case 'brief':
        return this.formatBrief(data);
      case 'detailed':
        return this.formatDetailed(data);
      default:
        return this.formatStandard(data);
    }
  }

  private formatBrief(data: MobilityAgentOutput): string {
    return `
## Mobility Assessment

Key Findings:
- Indoor Mobility: ${this.summarizePatterns(data.mobilityStatus.indoorMobility)}
- Outdoor Mobility: ${this.summarizePatterns(data.mobilityStatus.outdoorMobility)}
- Assistive Devices: ${data.mobilityStatus.assistiveDevices.join(', ') || 'None'}

Primary Concerns:
${data.riskFactors.map(r => `- ${r}`).join('\n')}
    `;
  }

  private formatStandard(data: MobilityAgentOutput): string {
    return `
## Mobility Assessment

### Current Status
Indoor Mobility:
${data.mobilityStatus.indoorMobility.map(p => `- ${p.context}: ${p.restrictions?.join(', ')}`).join('\n')}

Outdoor Mobility:
${data.mobilityStatus.outdoorMobility.map(p => `- ${p.context}: ${p.pattern}`).join('\n')}

Assistive Devices: ${data.mobilityStatus.assistiveDevices.join(', ') || 'None'}

Distance Capacity:
- Indoor: ${data.mobilityStatus.distanceCapacity.indoor.sustainable}m sustainable
- Outdoor: ${data.mobilityStatus.distanceCapacity.outdoor.sustainable}m sustainable

### Risk Factors
${data.riskFactors.map(r => `- ${r}`).join('\n')}

### Recommendations
${data.recommendations.map(r => `- ${r}`).join('\n')}
    `;
  }

  private formatDetailed(data: MobilityAgentOutput): string {
    return `
## Mobility Assessment

### Mobility Status Analysis

#### Indoor Mobility Patterns
${data.mobilityStatus.indoorMobility.map(p => `
- Context: ${p.context}
  - Type: ${p.type}
  - Restrictions: ${p.restrictions?.join(', ')}
`).join('\n')}

#### Outdoor Mobility Patterns
${data.mobilityStatus.outdoorMobility.map(p => `
- Context: ${p.context}
  - Type: ${p.type}
  - Pattern: ${p.pattern}
`).join('\n')}

#### Assistive Devices
${data.mobilityStatus.assistiveDevices.length > 0 
  ? data.mobilityStatus.assistiveDevices.map(d => `- ${d}`).join('\n')
  : '- No assistive devices currently in use'}

#### Distance Capacity Analysis
Indoor Mobility:
- Sustainable Distance: ${data.mobilityStatus.distanceCapacity.indoor.sustainable} meters
- Maximum Distance: ${data.mobilityStatus.distanceCapacity.indoor.max} meters

Outdoor Mobility:
- Sustainable Distance: ${data.mobilityStatus.distanceCapacity.outdoor.sustainable} meters
- Maximum Distance: ${data.mobilityStatus.distanceCapacity.outdoor.max} meters

### Risk Factor Analysis
${data.riskFactors.map(r => `- ${r}`).join('\n')}

### Detailed Recommendations
${data.recommendations.map(r => `- ${r}`).join('\n')}

### Notes
- Distance capacities are estimated based on balance scores and symptom impact
- Recommendations should be reviewed with the healthcare team
- Regular reassessment of mobility status is recommended
    `;
  }

  private summarizePatterns(patterns: MovementPattern[]): string {
    if (patterns.length === 0) return 'No significant patterns identified';
    
    const types = patterns.map(p => p.type);
    if (types.includes('high_risk')) return 'High risk - requires assistance';
    if (types.includes('limited')) return 'Limited - modifications required';
    if (types.includes('modified')) return 'Modified independence';
    return 'Independent with routine patterns';
  }
}