import { BaseAgent } from '../BaseAgent';
import { AgentContext, AssessmentData, SymptomAgentOutput } from '../../types';
import _ from 'lodash';

export class CognitiveSymptomAgent extends BaseAgent {
  constructor(context: AgentContext) {
    super(context, 3.2, 'Cognitive Symptoms', ['symptoms.cognitive']);
  }

  async processData(data: AssessmentData): Promise<SymptomAgentOutput> {
    const symptoms = _.get(data, 'symptoms.cognitive', []);
    
    return {
      valid: true,
      symptoms: symptoms.map(s => ({
        symptom: s.symptom,
        severity: s.severity,
        frequency: s.frequency,
        impact: s.impact,
        management: s.management
      }))
    };
  }

  public formatByDetailLevel(data: SymptomAgentOutput, level: "brief" | "standard" | "detailed"): string {
    if (data.symptoms.length === 0) {
      return "No cognitive symptoms reported";
    }

    const sections = ['Cognitive Symptoms:'];
    
    data.symptoms.forEach(s => {
      if (level === 'brief') {
        sections.push(`- ${s.symptom} (${s.severity})`);
      } else {
        sections.push(`\n${s.symptom}:`);
        sections.push(`  Severity: ${s.severity}`);
        sections.push(`  Frequency: ${s.frequency}`);
        if (level === 'detailed') {
          sections.push(`  Impact: ${s.impact}`);
          sections.push(`  Management: ${s.management}`);
        }
      }
    });

    return sections.join('\n');
  }

  format(data: SymptomAgentOutput): string {
    return this.formatByDetailLevel(data, this.context.config?.detailLevel || 'standard');
  }
}