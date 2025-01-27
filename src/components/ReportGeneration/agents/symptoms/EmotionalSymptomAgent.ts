import { BaseAgent } from '../BaseAgent';
import { AgentContext, AssessmentData } from '../../types';
import _ from 'lodash';

interface EmotionalSymptom {
  symptom: string;
  severity: string;
  frequency: string;
  impact: string;
  management: string;
  triggers?: string[];
}

interface EmotionalOutput {
  valid: boolean;
  symptoms: EmotionalSymptom[];
  errors?: string[];
}

export class EmotionalSymptomAgent extends BaseAgent {
  constructor(context: AgentContext) {
    super(context, 3.1, 'Emotional Symptoms', ['symptoms.emotional']);
  }

  async processData(data: AssessmentData): Promise<EmotionalOutput> {
    const symptoms = _.get(data, 'symptoms.emotional', []);
    
    return {
      valid: true,
      symptoms: Array.isArray(symptoms) ? symptoms : []
    };
  }

  protected formatBrief(data: EmotionalOutput): string {
    if (data.symptoms.length === 0) {
      return 'No emotional symptoms reported';
    }

    const sections = ['Emotional Symptom Summary'];
    data.symptoms.forEach(s => {
      sections.push(`- ${s.symptom} (${s.severity}, ${s.frequency})`);
    });

    return sections.join('\n');
  }

  protected formatStandard(data: EmotionalOutput): string {
    if (data.symptoms.length === 0) {
      return 'No emotional symptoms reported';
    }

    const sections = ['Emotional Symptoms'];

    data.symptoms.forEach(s => {
      sections.push(`\n${s.symptom}:`);
      sections.push(`  Severity: ${s.severity}`);
      sections.push(`  Frequency: ${s.frequency}`);
      sections.push(`  Impact: ${s.impact}`);
      sections.push(`  Management: ${s.management}`);
      if (s.triggers?.length) {
        sections.push(`  Triggers: ${s.triggers.join(', ')}`);
      }
    });

    return sections.join('\n');
  }

  protected formatDetailed(data: EmotionalOutput): string {
    if (data.symptoms.length === 0) {
      return 'No emotional symptoms reported';
    }

    const sections = ['Emotional Symptoms Assessment'];

    // Individual symptoms
    data.symptoms.forEach(s => {
      sections.push(`\n${s.symptom}:`);
      sections.push(`  Severity: ${s.severity}`);
      sections.push(`  Frequency: ${s.frequency}`);
      sections.push(`  Impact: ${s.impact}`);
      sections.push(`  Management: ${s.management}`);
      if (s.triggers?.length) {
        sections.push(`  Triggers: ${s.triggers.join(', ')}`);
      }
    });

    // Analysis
    sections.push('\nAnalysis:');
    sections.push('Symptom Distribution:');
    const severityGroups = _.groupBy(data.symptoms, 'severity');
    Object.entries(severityGroups).forEach(([severity, symptoms]) => {
      sections.push(`- ${severity}: ${symptoms.length} symptom(s)`);
    });

    sections.push('\nTrigger Analysis:');
    const allTriggers = data.symptoms.reduce((acc, s) => {
      if (s.triggers) acc.push(...s.triggers);
      return acc;
    }, [] as string[]);
    
    if (allTriggers.length > 0) {
      const triggerFrequency = _.countBy(allTriggers);
      Object.entries(triggerFrequency)
        .sort(([,a], [,b]) => b - a)
        .forEach(([trigger, count]) => {
          sections.push(`- ${trigger}: ${count} symptom(s)`);
        });
    }

    return sections.join('\n');
  }
}