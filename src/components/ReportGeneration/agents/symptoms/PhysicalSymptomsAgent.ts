import { BaseAgent } from '../BaseAgent';
import { AgentContext, AssessmentData } from '../../types';
import _ from 'lodash';

interface PhysicalSymptom {
  symptom: string;
  severity: string;
  frequency: string;
  impact: string;
  management: string;
  location?: string;
  description?: string;
  triggers?: string[];
}

interface PhysicalSymptomOutput {
  valid: boolean;
  symptoms: PhysicalSymptom[];
  errors?: string[];
}

export class PhysicalSymptomsAgent extends BaseAgent {
  constructor(context: AgentContext) {
    super(context, 3.1, 'Physical Symptoms', ['symptoms.physical']);
  }

  async processData(data: AssessmentData): Promise<PhysicalSymptomOutput> {
    const symptoms = _.get(data, 'symptoms.physical', []);
    
    return {
      valid: true,
      symptoms: Array.isArray(symptoms) ? symptoms : []
    };
  }

  protected formatBrief(data: PhysicalSymptomOutput): string {
    if (data.symptoms.length === 0) {
      return 'No physical symptoms reported';
    }

    const sections = ['Physical Symptom Summary'];
    data.symptoms.forEach(s => {
      const parts = [`- ${s.symptom} (${s.severity}, ${s.frequency})`];
      if (s.location) {
        parts.push(`  Location: ${s.location}`);
      }
      if (s.impact) {
        parts.push(`  Impact: ${s.impact}`);
      }
      sections.push(parts.join('\n'));
    });

    return sections.join('\n');
  }

  protected formatStandard(data: PhysicalSymptomOutput): string {
    if (data.symptoms.length === 0) {
      return 'No physical symptoms reported';
    }

    const sections = ['Physical Symptoms'];

    data.symptoms.forEach(s => {
      sections.push(`\n${s.symptom}:`);
      if (s.location) sections.push(`  Location: ${s.location}`);
      sections.push(`  Severity: ${s.severity}`);
      sections.push(`  Frequency: ${s.frequency}`);
      sections.push(`  Impact: ${s.impact}`);
      sections.push(`  Management: ${s.management}`);
      if (s.description) sections.push(`  Description: ${s.description}`);
    });

    return sections.join('\n');
  }

  protected formatDetailed(data: PhysicalSymptomOutput): string {
    if (data.symptoms.length === 0) {
      return 'No physical symptoms reported';
    }

    const sections = ['Physical Symptoms Assessment'];

    data.symptoms.forEach(s => {
      sections.push(`\n${s.symptom}:`);
      if (s.location) sections.push(`  Location: ${s.location}`);
      if (s.description) sections.push(`  Description: ${s.description}`);
      sections.push(`  Severity: ${s.severity}`);
      sections.push(`  Frequency: ${s.frequency}`);
      sections.push(`  Impact: ${s.impact}`);
      sections.push(`  Management: ${s.management}`);
      if (s.triggers?.length) {
        sections.push(`  Triggers: ${s.triggers.join(', ')}`);
      }
    });

    sections.push('\nAnalysis:');
    sections.push('Symptom Distribution:');
    const severityGroups = _.groupBy(data.symptoms, 'severity');
    Object.entries(severityGroups).forEach(([severity, symptoms]) => {
      sections.push(`- ${severity}: ${symptoms.length} symptom(s)`);
    });

    return sections.join('\n');
  }
}