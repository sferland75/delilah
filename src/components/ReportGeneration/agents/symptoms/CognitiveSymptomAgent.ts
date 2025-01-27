import { BaseAgent } from '../BaseAgent';
import { AgentContext, AssessmentData } from '../../types';
import _ from 'lodash';

interface CognitiveSymptom {
  symptom: string;
  severity: string;
  frequency: string;
  impact: string;
  management: string;
}

interface CognitiveOutput {
  valid: boolean;
  symptoms: CognitiveSymptom[];
  errors?: string[];
}

export class CognitiveSymptomAgent extends BaseAgent {
  constructor(context: AgentContext) {
    super(context, 3.1, 'Cognitive Symptoms', ['symptoms.cognitive']);
  }

  async processData(data: AssessmentData): Promise<CognitiveOutput> {
    const symptoms = _.get(data, 'symptoms.cognitive', []);
    
    return {
      valid: true,
      symptoms: Array.isArray(symptoms) ? symptoms : []
    };
  }

  protected formatBrief(data: CognitiveOutput): string {
    if (data.symptoms.length === 0) {
      return 'No cognitive symptoms reported';
    }

    const sections = ['Cognitive Symptom Summary'];
    data.symptoms.forEach(s => {
      sections.push(`- ${s.symptom} (${s.severity}, ${s.frequency})`);
    });

    return sections.join('\n');
  }

  protected formatStandard(data: CognitiveOutput): string {
    if (data.symptoms.length === 0) {
      return 'No cognitive symptoms reported';
    }

    const sections = ['Cognitive Symptoms'];

    data.symptoms.forEach(s => {
      sections.push(`\n${s.symptom}:`);
      sections.push(`  Severity: ${s.severity}`);
      sections.push(`  Frequency: ${s.frequency}`);
      sections.push(`  Impact: ${s.impact}`);
      sections.push(`  Management: ${s.management}`);
    });

    return sections.join('\n');
  }

  protected formatDetailed(data: CognitiveOutput): string {
    if (data.symptoms.length === 0) {
      return 'No cognitive symptoms reported';
    }

    const sections = ['Cognitive Symptoms Assessment'];

    // Individual symptoms
    data.symptoms.forEach(s => {
      sections.push(`\n${s.symptom}:`);
      sections.push(`  Severity: ${s.severity}`);
      sections.push(`  Frequency: ${s.frequency}`);
      sections.push(`  Impact: ${s.impact}`);
      sections.push(`  Management: ${s.management}`);
    });

    // Analysis
    sections.push('\nAnalysis:');
    sections.push('Symptom Distribution:');
    const severityGroups = _.groupBy(data.symptoms, 'severity');
    Object.entries(severityGroups).forEach(([severity, symptoms]) => {
      sections.push(`- ${severity}: ${symptoms.length} symptom(s)`);
    });

    return sections.join('\n');
  }
}