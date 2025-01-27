import { BaseAgent } from '../BaseAgent';
import { AgentContext, AssessmentData } from '../../types';
import _ from 'lodash';

interface SymptomBase {
  symptom: string;
  severity: string;
  frequency: string;
  impact?: string;
  management?: string;
}

interface PhysicalSymptom extends SymptomBase {
  location?: string;
  description?: string;
  triggers?: string[];
}

interface CognitiveSymptom extends SymptomBase {
  notes?: string;
}

interface EmotionalSymptom extends SymptomBase {
  triggers?: string[];
}

interface IntegratedSymptoms {
  physical: PhysicalSymptom[];
  cognitive: CognitiveSymptom[];
  emotional: EmotionalSymptom[];
}

export interface SymptomIntegrationOutput {
  valid: boolean;
  symptoms: IntegratedSymptoms;
  patterns: {
    symptoms: { [key: string]: string[] };
    triggers: { [key: string]: string[] };
    impacts: { [key: string]: string[] };
  };
  summary: string[];
  errors?: string[];
}

export class SymptomIntegrationAgent extends BaseAgent {
  constructor(context: AgentContext) {
    super(context, 3.0, 'Symptom Integration', ['symptoms']);
  }

  async processData(data: AssessmentData): Promise<SymptomIntegrationOutput> {
    const symptomsData = _.get(data, 'symptoms', { physical: [], cognitive: [], emotional: [] });
    
    const processedSymptoms: IntegratedSymptoms = {
      physical: this.ensureArray<PhysicalSymptom>(symptomsData.physical || []),
      cognitive: this.ensureArray<CognitiveSymptom>(symptomsData.cognitive || []),
      emotional: this.ensureArray<EmotionalSymptom>(symptomsData.emotional || [])
    };

    const patterns = this.analyzePatterns(processedSymptoms);
    const summary = this.generateSummary(processedSymptoms);

    return {
      valid: true,
      symptoms: processedSymptoms,
      patterns,
      summary
    };
  }

  private ensureArray<T>(value: T[] | undefined | null): T[] {
    return Array.isArray(value) ? value : [];
  }

  private analyzePatterns(symptoms: IntegratedSymptoms) {
    const patterns = {
      symptoms: {} as { [key: string]: string[] },
      triggers: {} as { [key: string]: string[] },
      impacts: {} as { [key: string]: string[] }
    };

    // Group by impact
    this.allSymptoms(symptoms).forEach(symptom => {
      if (symptom.impact) {
        const key = symptom.impact.toLowerCase();
        patterns.impacts[key] = patterns.impacts[key] || [];
        patterns.impacts[key].push(symptom.symptom);
      }
    });

    // Group by triggers
    this.allSymptomsWithTriggers(symptoms).forEach(symptom => {
      if (symptom.triggers) {
        symptom.triggers.forEach(trigger => {
          const key = trigger.toLowerCase();
          patterns.triggers[key] = patterns.triggers[key] || [];
          patterns.triggers[key].push(symptom.symptom);
        });
      }
    });

    return patterns;
  }

  private allSymptoms(symptoms: IntegratedSymptoms): SymptomBase[] {
    return [
      ...symptoms.physical,
      ...symptoms.cognitive,
      ...symptoms.emotional
    ];
  }

  private allSymptomsWithTriggers(symptoms: IntegratedSymptoms): (PhysicalSymptom | EmotionalSymptom)[] {
    return [
      ...symptoms.physical,
      ...symptoms.emotional
    ];
  }

  private generateSummary(symptoms: IntegratedSymptoms): string[] {
    const summary = [];

    const counts = {
      physical: symptoms.physical.length,
      cognitive: symptoms.cognitive.length,
      emotional: symptoms.emotional.length
    };

    const total = counts.physical + counts.cognitive + counts.emotional;
    if (total === 0) {
      return ['No symptoms reported'];
    }

    summary.push(`Total symptoms reported: ${total}`);
    if (counts.physical > 0) summary.push(`- ${counts.physical} physical symptoms`);
    if (counts.cognitive > 0) summary.push(`- ${counts.cognitive} cognitive symptoms`);
    if (counts.emotional > 0) summary.push(`- ${counts.emotional} emotional symptoms`);

    return summary;
  }

  protected formatBrief(data: SymptomIntegrationOutput): string {
    return data.summary.join('\n');
  }

  protected formatStandard(data: SymptomIntegrationOutput): string {
    const sections = ['Symptom Assessment'];

    if (data.symptoms.physical.length > 0) {
      sections.push('\nPhysical Symptoms:');
      data.symptoms.physical.forEach(s => {
        sections.push(`- ${s.symptom} (${s.severity})`);
        if (s.location) sections.push(`  Location: ${s.location}`);
        sections.push(`  Management: ${s.management}`);
      });
    }

    if (data.symptoms.cognitive.length > 0) {
      sections.push('\nCognitive Symptoms:');
      data.symptoms.cognitive.forEach(s => {
        sections.push(`- ${s.symptom} (${s.severity})`);
        sections.push(`  Management: ${s.management}`);
      });
    }

    if (data.symptoms.emotional.length > 0) {
      sections.push('\nEmotional Symptoms:');
      data.symptoms.emotional.forEach(s => {
        sections.push(`- ${s.symptom} (${s.severity})`);
        sections.push(`  Management: ${s.management}`);
      });
    }

    return sections.join('\n');
  }

  protected formatDetailed(data: SymptomIntegrationOutput): string {
    const sections = ['Comprehensive Symptom Assessment'];

    // Physical Symptoms
    if (data.symptoms.physical.length > 0) {
      sections.push('\nPhysical Symptoms:');
      data.symptoms.physical.forEach(s => {
        sections.push(`\n${s.symptom}:`);
        if (s.location) sections.push(`  Location: ${s.location}`);
        if (s.description) sections.push(`  Description: ${s.description}`);
        sections.push(`  Severity: ${s.severity}`);
        sections.push(`  Frequency: ${s.frequency}`);
        if (s.impact) sections.push(`  Impact: ${s.impact}`);
        if (s.management) sections.push(`  Management: ${s.management}`);
        if (s.triggers?.length) sections.push(`  Triggers: ${s.triggers.join(', ')}`);
      });
    }

    // Cognitive Symptoms
    if (data.symptoms.cognitive.length > 0) {
      sections.push('\nCognitive Symptoms:');
      data.symptoms.cognitive.forEach(s => {
        sections.push(`\n${s.symptom}:`);
        sections.push(`  Severity: ${s.severity}`);
        sections.push(`  Frequency: ${s.frequency}`);
        if (s.impact) sections.push(`  Impact: ${s.impact}`);
        if (s.management) sections.push(`  Management: ${s.management}`);
      });
    }

    // Emotional Symptoms
    if (data.symptoms.emotional.length > 0) {
      sections.push('\nEmotional Symptoms:');
      data.symptoms.emotional.forEach(s => {
        sections.push(`\n${s.symptom}:`);
        sections.push(`  Severity: ${s.severity}`);
        sections.push(`  Frequency: ${s.frequency}`);
        if (s.impact) sections.push(`  Impact: ${s.impact}`);
        if (s.management) sections.push(`  Management: ${s.management}`);
        if (s.triggers?.length) sections.push(`  Triggers: ${s.triggers.join(', ')}`);
      });
    }

    // Analysis section
    sections.push('\nAnalysis:');
    sections.push('Symptom Distribution:');
    const severityGroups = _.groupBy(this.allSymptoms(data.symptoms), 'severity');
    Object.entries(severityGroups).forEach(([severity, symptoms]) => {
      sections.push(`- ${severity}: ${symptoms.length} symptom(s)`);
    });

    // Pattern Analysis
    const significantImpacts = Object.entries(data.patterns.impacts)
      .filter(([_, symptoms]) => symptoms.length > 1);
    
    if (significantImpacts.length > 0) {
      sections.push('\nCommon Impacts:');
      significantImpacts.forEach(([impact, symptoms]) => {
        sections.push(`- ${impact} affects: ${symptoms.join(', ')}`);
      });
    }

    return sections.join('\n');
  }
}