import { Assessment } from '../../../types';
import { BaseAgent } from './core/BaseAgent';
import { ReportSection, ReportSectionType, SectionContent, ValidationResult } from '../../../types/report';

export class SymptomsAgent extends BaseAgent {
  processData(data: Assessment): ValidationResult {
    const symptoms = data.assessment.symptoms;
    
    if (!symptoms) {
      return {
        valid: false,
        errors: ['Missing symptoms data']
      };
    }

    const errors = this.validateRequired(symptoms, [
      'physical',
      'cognitive',
      'emotional'
    ]);

    return {
      valid: errors.length === 0,
      errors
    };
  }

  formatBrief(data: Assessment): SectionContent {
    const symptoms = data.assessment.symptoms;
    const sections = this.generateBriefSummary(symptoms);

    return {
      type: ReportSectionType.NARRATIVE,
      title: 'Current Symptoms Overview',
      content: sections.join('\n\n'),
      orderNumber: 3
    };
  }

  formatDetailed(data: Assessment): SectionContent {
    const symptoms = data.assessment.symptoms;
    const sections = this.generateDetailedSummary(symptoms);

    return {
      type: ReportSectionType.STRUCTURED,
      title: 'Detailed Symptoms Assessment',
      content: sections.join('\n\n'),
      orderNumber: 3
    };
  }

  formatStandard(data: Assessment): SectionContent {
    const symptoms = data.assessment.symptoms;
    const sections = this.generateStandardSummary(symptoms);

    return {
      type: ReportSectionType.STRUCTURED,
      title: 'Current Symptoms',
      content: sections.join('\n\n'),
      orderNumber: 3
    };
  }

  private generateBriefSummary(symptoms: any): string[] {
    const sections: string[] = [];

    // Physical Symptoms Summary
    if (symptoms.physical?.length) {
      sections.push('### Physical Symptoms');
      const locations = symptoms.physical.map((s: any) => s.location);
      sections.push(`Client reports pain/symptoms in: ${this.formatClinicalList(locations)}`);
    }

    // Cognitive Symptoms Summary
    if (symptoms.cognitive?.length) {
      sections.push('### Cognitive Symptoms');
      const issues = symptoms.cognitive.map((s: any) => s.symptom);
      sections.push(`Client reports difficulties with: ${this.formatClinicalList(issues)}`);
    }

    return sections;
  }

  private generateDetailedSummary(symptoms: any): string[] {
    const sections: string[] = [];

    // Physical Symptoms Details
    if (symptoms.physical?.length) {
      sections.push('## Physical Symptoms');
      symptoms.physical.forEach((symptom: any) => {
        sections.push(`### ${symptom.location}`);
        sections.push(`- **Type:** ${symptom.painType}`);
        sections.push(`- **Severity:** ${symptom.severity}`);
        sections.push(`- **Frequency:** ${symptom.frequency}`);
        sections.push('#### Aggravating Factors');
        sections.push(symptom.aggravating);
        sections.push('#### Relieving Factors');
        sections.push(symptom.relieving);
      });
    }

    // Cognitive Symptoms Details
    if (symptoms.cognitive?.length) {
      sections.push('## Cognitive Symptoms');
      symptoms.cognitive.forEach((symptom: any) => {
        sections.push(`### ${symptom.symptom}`);
        sections.push(`- **Severity:** ${symptom.severity}`);
        sections.push(`- **Frequency:** ${symptom.frequency}`);
        sections.push('#### Impact');
        sections.push(symptom.impact);
        if (symptom.management) {
          sections.push('#### Management Strategies');
          sections.push(symptom.management);
        }
      });
    }

    // Emotional Symptoms Details
    if (symptoms.emotional?.length) {
      sections.push('## Emotional Symptoms');
      symptoms.emotional.forEach((symptom: any) => {
        sections.push(`### ${symptom.symptom}`);
        sections.push(`- **Severity:** ${symptom.severity}`);
        sections.push(`- **Frequency:** ${symptom.frequency}`);
        sections.push('#### Impact');
        sections.push(symptom.impact);
        if (symptom.management) {
          sections.push('#### Management Strategies');
          sections.push(symptom.management);
        }
      });
    }

    // General Notes
    if (symptoms.generalNotes) {
      sections.push('## Additional Notes');
      sections.push(symptoms.generalNotes);
    }

    return sections;
  }

  private generateStandardSummary(symptoms: any): string[] {
    const sections: string[] = [];

    // Physical Symptoms
    if (symptoms.physical?.length) {
      sections.push('### Physical Symptoms');
      symptoms.physical.forEach((symptom: any) => {
        sections.push(`#### ${symptom.location} (${symptom.painType})`);
        sections.push(`- Severity: ${symptom.severity}`);
        sections.push(`- Frequency: ${symptom.frequency}`);
        sections.push(`- Aggravating: ${symptom.aggravating}`);
      });
    }

    // Cognitive and Emotional
    const nonPhysical = [...(symptoms.cognitive || []), ...(symptoms.emotional || [])];
    if (nonPhysical.length) {
      sections.push('### Cognitive and Emotional Symptoms');
      nonPhysical.forEach((symptom: any) => {
        sections.push(`#### ${symptom.symptom}`);
        sections.push(`- Severity: ${symptom.severity}`);
        sections.push(`- Frequency: ${symptom.frequency}`);
        sections.push(`- Impact: ${symptom.impact}`);
      });
    }

    return sections;
  }
}