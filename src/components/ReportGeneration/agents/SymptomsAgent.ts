import { BaseAgent } from './BaseAgent';
import type { AgentContext } from './types';

interface ProcessedSymptom {
  category: string;
  severity: string;
  frequency: string;
  description: string;
  impact: string;
  aggravating?: string;
  relieving?: string;
  management?: string;
}

export class SymptomsAgent extends BaseAgent {
  private readonly severityOrder = ['Very Severe', 'Severe', 'Moderate', 'Mild', 'None'];
  private readonly frequencyOrder = ['Constantly', 'Most of the time', 'Often', 'Sometimes', 'Rarely'];

  constructor(context: AgentContext) {
    super(
      context,
      2,  // Priority in report
      'Symptoms Assessment',
      ['symptoms.physical', 'symptoms.cognitive', 'symptoms.emotional']
    );
  }

  process(data: any) {
    const symptoms = data.symptoms;
    if (!symptoms) return null;

    return {
      physicalSymptoms: this.processPhysicalSymptoms(symptoms.physical || []),
      cognitiveSymptoms: this.processCognitiveSymptoms(symptoms.cognitive || []),
      emotionalSymptoms: this.processEmotionalSymptoms(symptoms.emotional || []),
      generalNotes: symptoms.generalNotes,
      summaryAnalysis: this.analyzeSymptomsOverall(symptoms)
    };
  }

  private processPhysicalSymptoms(symptoms: any[]): ProcessedSymptom[] {
    return symptoms
      .sort((a, b) => 
        this.severityOrder.indexOf(a.severity) - this.severityOrder.indexOf(b.severity)
      )
      .map(symptom => ({
        category: 'Physical',
        severity: symptom.severity,
        frequency: symptom.frequency,
        description: `${symptom.painType || ''} ${symptom.location || ''}`.trim(),
        impact: this.formatSeverityImpact(symptom.severity, symptom.frequency),
        aggravating: symptom.aggravating,
        relieving: symptom.relieving,
        management: symptom.management
      }));
  }

  private processCognitiveSymptoms(symptoms: any[]): ProcessedSymptom[] {
    return symptoms
      .sort((a, b) => 
        this.severityOrder.indexOf(a.severity) - this.severityOrder.indexOf(b.severity)
      )
      .map(symptom => ({
        category: 'Cognitive',
        severity: symptom.severity,
        frequency: symptom.frequency,
        description: symptom.symptom,
        impact: symptom.impact,
        management: symptom.management
      }));
  }

  private processEmotionalSymptoms(symptoms: any[]): ProcessedSymptom[] {
    return symptoms
      .sort((a, b) => 
        this.severityOrder.indexOf(a.severity) - this.severityOrder.indexOf(b.severity)
      )
      .map(symptom => ({
        category: 'Emotional',
        severity: symptom.severity,
        frequency: symptom.frequency,
        description: symptom.symptom,
        impact: symptom.impact,
        management: symptom.management
      }));
  }

  private formatSeverityImpact(severity: string, frequency: string): string {
    const severityLevel = this.severityOrder.indexOf(severity);
    const frequencyLevel = this.frequencyOrder.indexOf(frequency);
    
    if (severityLevel <= 1 && frequencyLevel <= 2) {
      return 'Significantly impacts daily function';
    } else if (severityLevel <= 2 && frequencyLevel <= 3) {
      return 'Moderately impacts daily function';
    }
    return 'Minimally impacts daily function';
  }

  private analyzeSymptomsOverall(symptoms: any) {
    const analysis = {
      primaryConcerns: [] as string[],
      functionalImpacts: [] as string[],
      treatmentResponses: [] as string[]
    };

    // Identify primary concerns
    const severeSymptoms = [
      ...(symptoms.physical || []),
      ...(symptoms.cognitive || []),
      ...(symptoms.emotional || [])
    ].filter(s => ['Very Severe', 'Severe'].includes(s.severity));

    if (severeSymptoms.length > 0) {
      analysis.primaryConcerns = severeSymptoms.map(s => 
        `${s.symptom || s.location} (${s.severity.toLowerCase()})`
      );
    }

    // Analyze functional impacts
    const frequentSymptoms = [
      ...(symptoms.physical || []),
      ...(symptoms.cognitive || []),
      ...(symptoms.emotional || [])
    ].filter(s => ['Constantly', 'Most of the time'].includes(s.frequency));

    if (frequentSymptoms.length > 0) {
      analysis.functionalImpacts = frequentSymptoms
        .filter(s => s.impact)
        .map(s => s.impact);
    }

    // Analyze treatment responses
    const managedSymptoms = [
      ...(symptoms.physical || []),
      ...(symptoms.cognitive || []),
      ...(symptoms.emotional || [])
    ].filter(s => s.management || s.relieving);

    if (managedSymptoms.length > 0) {
      analysis.treatmentResponses = managedSymptoms
        .filter(s => s.management || s.relieving)
        .map(s => `${s.symptom || s.location}: ${s.management || s.relieving}`);
    }

    return analysis;
  }

  format(data: any): string {
    let report = 'SYMPTOMS ASSESSMENT\n\n';

    // Overall Analysis
    if (data.summaryAnalysis) {
      const analysis = data.summaryAnalysis;
      
      if (analysis.primaryConcerns.length > 0) {
        report += 'Primary Concerns:\n';
        analysis.primaryConcerns.forEach((concern: string) => {
          report += `• ${concern}\n`;
        });
        report += '\n';
      }
    }

    // Physical Symptoms
    if (data.physicalSymptoms?.length) {
      report += 'Physical Symptoms:\n\n';
      data.physicalSymptoms.forEach((symptom: ProcessedSymptom) => {
        report += `${symptom.description}\n`;
        report += `Severity: ${symptom.severity}, Frequency: ${symptom.frequency}\n`;
        if (symptom.aggravating) report += `Aggravating Factors: ${symptom.aggravating}\n`;
        if (symptom.relieving) report += `Relieving Factors: ${symptom.relieving}\n`;
        report += '\n';
      });
    }

    // Cognitive Symptoms
    if (data.cognitiveSymptoms?.length) {
      report += 'Cognitive Symptoms:\n\n';
      data.cognitiveSymptoms.forEach((symptom: ProcessedSymptom) => {
        report += `${symptom.description}\n`;
        report += `Severity: ${symptom.severity}, Frequency: ${symptom.frequency}\n`;
        if (symptom.impact) report += `Impact: ${symptom.impact}\n`;
        if (symptom.management) report += `Management: ${symptom.management}\n`;
        report += '\n';
      });
    }

    // Emotional Symptoms
    if (data.emotionalSymptoms?.length) {
      report += 'Emotional Symptoms:\n\n';
      data.emotionalSymptoms.forEach((symptom: ProcessedSymptom) => {
        report += `${symptom.description}\n`;
        report += `Severity: ${symptom.severity}, Frequency: ${symptom.frequency}\n`;
        if (symptom.impact) report += `Impact: ${symptom.impact}\n`;
        if (symptom.management) report += `Management: ${symptom.management}\n`;
        report += '\n';
      });
    }

    // General Notes
    if (data.generalNotes) {
      report += 'Additional Observations:\n';
      report += data.generalNotes + '\n\n';
    }

    return report;
  }
}