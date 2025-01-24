import { BaseAgent } from '../BaseAgent';
import { AgentContext } from '../types';
import { SymptomData } from './SymptomTypes';
import { validateSymptomData } from './validation';

export class CognitiveSymptomAgent extends BaseAgent {
  constructor(context: AgentContext) {
    super(context, 3.2, 'Cognitive Symptoms', ['symptoms.cognitive']);
  }

  protected initializeValidationRules(): void {
    this.validationRules.set('cognitive', (data) => Array.isArray(data) && data.every(validateSymptomData));
  }

  protected getSectionKeys(): string[] {
    return ['symptom', 'severity', 'frequency', 'impact', 'management'];
  }

  async processData(data: any): Promise<SymptomData[]> {
    return data.map((symptom: any) => ({
      location: symptom.symptom,
      severity: symptom.severity,
      frequency: symptom.frequency,
      impact: symptom.impact,
      management: symptom.management
    }));
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
- ${s.location}:
  Severity: ${s.severity}
  Frequency: ${s.frequency}
  Impact: ${s.impact || 'Not specified'}`
      ).join('\n');
  }

  private formatDetailed(data: SymptomData[]): string {
    return data
      .map(s => `
### ${s.location}
- Severity: ${s.severity}
- Frequency: ${s.frequency}
- Impact: ${s.impact || 'Not specified'}
- Management Strategies: ${s.management || 'Not specified'}`
      ).join('\n');
  }
}