import { BaseAgent } from '../BaseAgent';
import { AgentContext, AssessmentData, ProcessedData } from '../../types';
import _ from 'lodash';

interface SymptomBase {
  symptom: string;
  severity: string;
  frequency: string;
  impact: string;
  management: string;
}

interface PhysicalSymptom extends SymptomBase {
  location?: string;
  description?: string;
  triggers?: string[];
}

interface CognitiveSymptom extends SymptomBase {}
interface EmotionalSymptom extends SymptomBase {}

interface IntegratedSymptoms {
  physical: PhysicalSymptom[];
  cognitive: CognitiveSymptom[];
  emotional: EmotionalSymptom[];
}

interface SymptomProcessedData extends ProcessedData {
  symptoms: IntegratedSymptoms;
}

export class SymptomIntegrationAgent extends BaseAgent {
  constructor(context: AgentContext) {
    super(context, 3.4, 'Symptom Integration', ['symptoms']);
  }

  private ensureArray<T>(value: T[] | undefined | null): T[] {
    return Array.isArray(value) ? value : [];
  }

  async processData(data: AssessmentData): Promise<SymptomProcessedData> {
    const symptomsData = _.get(data, 'symptoms', {});
    
    const processedSymptoms: IntegratedSymptoms = {
      physical: this.ensureArray<PhysicalSymptom>(_.get(symptomsData, 'physical')),
      cognitive: this.ensureArray<CognitiveSymptom>(_.get(symptomsData, 'cognitive')),
      emotional: this.ensureArray<EmotionalSymptom>(_.get(symptomsData, 'emotional'))
    };
    
    return {
      valid: true,
      symptoms: processedSymptoms
    };
  }

  format(data: SymptomProcessedData): string {
    const { symptoms } = data;
    const sections: string[] = [];

    if (symptoms.physical.length > 0) {
      sections.push('Physical Symptoms:', ...symptoms.physical.map(s => 
        `  - ${s.symptom} (${s.severity}): ${s.frequency}, ${s.management}` +
        (s.location ? ` - ${s.location}` : '')
      ));
    }

    if (symptoms.cognitive.length > 0) {
      sections.push('\nCognitive Symptoms:', ...symptoms.cognitive.map(s =>
        `  - ${s.symptom} (${s.severity}): ${s.frequency}, ${s.management}`
      ));
    }

    if (symptoms.emotional.length > 0) {
      sections.push('\nEmotional Symptoms:', ...symptoms.emotional.map(s =>
        `  - ${s.symptom} (${s.severity}): ${s.frequency}, ${s.management}`
      ));
    }

    return sections.length > 0 ? sections.join('\n') : 'No symptoms reported';
  }

  protected override formatBrief(data: SymptomProcessedData): string {
    const { symptoms } = data;
    const sections: string[] = ['Symptom Summary:'];

    const countByType = {
      physical: symptoms.physical.length,
      cognitive: symptoms.cognitive.length,
      emotional: symptoms.emotional.length
    };

    if (countByType.physical > 0) {
      sections.push(`  - Physical: ${countByType.physical} reported`);
    }
    if (countByType.cognitive > 0) {
      sections.push(`  - Cognitive: ${countByType.cognitive} reported`);
    }
    if (countByType.emotional > 0) {
      sections.push(`  - Emotional: ${countByType.emotional} reported`);
    }

    return sections.join('\n');
  }

  protected override formatDetailed(data: SymptomProcessedData): string {
    const { symptoms } = data;
    const sections: string[] = ['Detailed Symptom Assessment:'];

    if (symptoms.physical.length > 0) {
      sections.push('\nPhysical Symptoms:');
      symptoms.physical.forEach(s => {
        sections.push(`  - ${s.symptom}`);
        sections.push(`    Severity: ${s.severity}`);
        sections.push(`    Frequency: ${s.frequency}`);
        sections.push(`    Impact: ${s.impact}`);
        sections.push(`    Management: ${s.management}`);
        if (s.location) sections.push(`    Location: ${s.location}`);
        if (s.description) sections.push(`    Description: ${s.description}`);
        if (s.triggers?.length) sections.push(`    Triggers: ${s.triggers.join(', ')}`);
      });
    }

    if (symptoms.cognitive.length > 0) {
      sections.push('\nCognitive Symptoms:');
      symptoms.cognitive.forEach(s => {
        sections.push(`  - ${s.symptom}`);
        sections.push(`    Severity: ${s.severity}`);
        sections.push(`    Frequency: ${s.frequency}`);
        sections.push(`    Impact: ${s.impact}`);
        sections.push(`    Management: ${s.management}`);
      });
    }

    if (symptoms.emotional.length > 0) {
      sections.push('\nEmotional Symptoms:');
      symptoms.emotional.forEach(s => {
        sections.push(`  - ${s.symptom}`);
        sections.push(`    Severity: ${s.severity}`);
        sections.push(`    Frequency: ${s.frequency}`);
        sections.push(`    Impact: ${s.impact}`);
        sections.push(`    Management: ${s.management}`);
      });
    }

    return sections.join('\n');
  }
}