import { BaseAgent } from '../BaseAgent';
import { AgentContext } from '../types';
import { SymptomData } from './SymptomTypes';
import { validateSymptomData } from './validation';

export class PhysicalSymptomsAgent extends BaseAgent {
  constructor(context: AgentContext) {
    super(context, 3.1, 'Physical Symptoms', ['symptoms.physical']);
  }

  protected initializeValidationRules(): void {
    this.validationRules.set('physical', (data) => Array.isArray(data) && data.every(validateSymptomData));
  }

  async processData(data: any): Promise<SymptomData[]> {
    return data.map((symptom: any) => ({
      location: symptom.location,
      painType: symptom.painType,
      severity: symptom.severity,
      frequency: symptom.frequency,
      aggravating: symptom.aggravating,
      relieving: symptom.relieving,
      impact: this.processImpact(symptom)
    }));
  }

  protected getSectionKeys(): string[] {
    return ['location', 'painType', 'severity', 'frequency', 'aggravating', 'relieving', 'impact'];
  }

  private processImpact(symptom: any): string {
    const impacts = [];
    
    if (symptom.aggravating) {
      impacts.push(`Aggravated by: ${symptom.aggravating}`);
    }
    
    if (symptom.frequency === 'Constantly' || symptom.frequency === 'Most of the time') {
      impacts.push('Persistent impact on daily activities');
    }
    
    if (symptom.severity === 'Severe' || symptom.severity === 'Very Severe') {
      impacts.push('Significantly limits functional capacity');
    }

    return impacts.join('. ') || 'Impact not specified';
  }

  protected formatByDetailLevel(data: SymptomData[], level: string): string {
    switch (level) {
      case 'brief':
        return this.formatBrief(data);
      case 'standard':
        return this.formatStandard(data);
      case 'detailed':
        return this.formatDetailed(data);
      default:
        return this.formatStandard(data);
    }
  }

  private formatBrief(data: SymptomData[]): string {
    return data
      .map(s => `${s.location}: ${s.severity} (${s.frequency})`)
      .join('\n');
  }

  private formatStandard(data: SymptomData[]): string {
    return data
      .map(s => `
- Location: ${s.location}
  Severity: ${s.severity}
  Frequency: ${s.frequency}
  Type: ${s.painType || 'Not specified'}`
      ).join('\n');
  }

  private formatDetailed(data: SymptomData[]): string {
    return data
      .map(s => `
### ${s.location}
- Pain Type: ${s.painType || 'Not specified'}
- Severity: ${s.severity}
- Frequency: ${s.frequency}
- Aggravating Factors: ${s.aggravating || 'Not specified'}
- Relieving Factors: ${s.relieving || 'Not specified'}
- Impact: ${s.impact}`
      ).join('\n');
  }
}