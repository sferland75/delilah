import { BaseAgent } from '../BaseAgent';
import { AgentContext, AssessmentData, SymptomAgentOutput } from '../../types';

export abstract class BaseSymptomAgent extends BaseAgent {
  protected sectionTitle: string;

  constructor(context: AgentContext, orderNumber: number, sectionTitle: string) {
    super(context, orderNumber, sectionTitle);
    this.sectionTitle = sectionTitle;
  }

  protected formatBrief(data: SymptomAgentOutput): string {
    if (data.symptoms.length === 0) {
      return `No ${this.sectionTitle.toLowerCase()} reported`;
    }

    const sections = [`${this.sectionTitle}:`];
    
    data.symptoms.forEach(s => {
      sections.push(`- ${s.symptom} (${s.severity})`);
    });

    return sections.join('\n');
  }

  protected formatStandard(data: SymptomAgentOutput): string {
    if (data.symptoms.length === 0) {
      return `No ${this.sectionTitle.toLowerCase()} reported`;
    }

    const sections = [`${this.sectionTitle}:`];
    
    data.symptoms.forEach(s => {
      sections.push(`\n${s.symptom}:`);
      sections.push(`  Severity: ${s.severity}`);
      sections.push(`  Frequency: ${s.frequency}`);
      if (s.impact) {
        sections.push(`  Impact: ${s.impact}`);
      }
    });

    return sections.join('\n');
  }

  protected formatDetailed(data: SymptomAgentOutput): string {
    if (data.symptoms.length === 0) {
      return `No ${this.sectionTitle.toLowerCase()} reported`;
    }

    const sections = [`${this.sectionTitle} - Detailed Assessment:`];
    
    data.symptoms.forEach(s => {
      sections.push(`\n${s.symptom}:`);
      sections.push(`  Severity: ${s.severity}`);
      sections.push(`  Frequency: ${s.frequency}`);
      if (s.impact) {
        sections.push(`  Impact: ${s.impact}`);
      }
      if (s.management) {
        sections.push(`  Management: ${s.management}`);
      }
      if (s.notes) {
        sections.push(`  Additional Notes: ${s.notes}`);
      }
    });

    return sections.join('\n');
  }
}