export interface TemplateOptions {
  detailLevel: 'brief' | 'standard' | 'detailed';
  includeAppendices: boolean;
  format: 'markdown' | 'html' | 'plain';
  customSections?: string[];
}

export interface SectionTemplate {
  title: string;
  order: number;
  templates: {
    brief: string;
    standard: string;
    detailed: string;
  };
  formatters?: {
    [key: string]: (value: any) => string;
  };
}

const defaultOptions: TemplateOptions = {
  detailLevel: 'standard',
  includeAppendices: false,
  format: 'plain',
  customSections: []
};

export const templates: Record<string, SectionTemplate> = {
  medicalHistory: {
    title: 'Medical History',
    order: 1,
    templates: {
      brief: `
MEDICAL HISTORY

Pre-existing Conditions:
{{preExisting}}

Current Medications:
{{medications}}`,
      
      standard: `
MEDICAL HISTORY

Pre-existing Conditions:
{{preExisting}}

Current Medications:
{{medications}}

Recent Treatments:
{{treatments}}

Surgical History:
{{surgeries}}`,
      
      detailed: `
MEDICAL HISTORY

Pre-existing Conditions:
{{preExisting}}

Current Medications:
{{medications}}

Recent Treatments:
{{treatments}}

Surgical History:
{{surgeries}}

Treatment Response:
{{treatmentResponse}}

Medication Effects:
{{medicationEffects}}`
    },
    formatters: {
      medications: (meds: any[]) => meds.map(m => 
        `- ${m.name} ${m.dosage} ${m.frequency}`).join('\n'),
      treatments: (treatments: any[]) => treatments.map(t =>
        `- ${t.provider}: ${t.focus}`).join('\n')
    }
  },

  symptoms: {
    title: 'Symptoms',
    order: 2,
    templates: {
      brief: `
SYMPTOMS

Physical:
{{physicalSymptoms}}

Cognitive:
{{cognitiveSymptoms}}`,

      standard: `
SYMPTOMS

Physical:
{{physicalSymptoms}}

Cognitive:
{{cognitiveSymptoms}}

Emotional:
{{emotionalSymptoms}}

Impact on Function:
{{functionalImpact}}`,

      detailed: `
SYMPTOMS

Physical Symptoms:
{{physicalSymptoms}}

Aggravating Factors:
{{aggravatingFactors}}

Relieving Factors:
{{relievingFactors}}

Cognitive Symptoms:
{{cognitiveSymptoms}}

Emotional Symptoms:
{{emotionalSymptoms}}

Functional Impact:
{{functionalImpact}}

Treatment Response:
{{treatmentResponse}}

Pattern Analysis:
{{patternAnalysis}}`
    },
    formatters: {
      physicalSymptoms: (symptoms: any[]) => symptoms.map(s => 
        `- ${s.location}: ${s.severity} ${s.painType} pain, ${s.frequency}`).join('\n'),
      cognitiveSymptoms: (symptoms: any[]) => symptoms.map(s =>
        `- ${s.symptom}: ${s.severity}, ${s.frequency}`).join('\n')
    }
  }
};

export class TemplateManager {
  private options: TemplateOptions;

  constructor(options: Partial<TemplateOptions> = {}) {
    this.options = { ...defaultOptions, ...options };
  }

  formatSection(sectionKey: string, data: any): string {
    const template = templates[sectionKey];
    if (!template) return '';

    const templateString = template.templates[this.options.detailLevel];
    let formattedContent = templateString;

    // Replace placeholders
    Object.entries(data).forEach(([key, value]) => {
      const formatter = template.formatters?.[key];
      const formattedValue = formatter ? formatter(value) : value;
      formattedContent = formattedContent.replace(
        new RegExp(`{{${key}}}`, 'g'),
        String(formattedValue)
      );
    });

    // Format based on output type
    return this.formatOutput(formattedContent);
  }

  private formatOutput(content: string): string {
    switch (this.options.format) {
      case 'markdown':
        return this.toMarkdown(content);
      case 'html':
        return this.toHtml(content);
      default:
        return content;
    }
  }

  private toMarkdown(content: string): string {
    return content
      .replace(/^([A-Z\s]+)$/gm, '# $1')  // Headers
      .replace(/^([A-Z][^:]+):$/gm, '## $1')  // Subheaders
      .replace(/^- /gm, '* ')  // List items
      .trim();
  }

  private toHtml(content: string): string {
    return content
      .replace(/^([A-Z\s]+)$/gm, '<h1>$1</h1>')  // Headers
      .replace(/^([A-Z][^:]+):$/gm, '<h2>$1</h2>')  // Subheaders
      .replace(/^- (.*?)$/gm, '<li>$1</li>')  // List items
      .replace(/((?:<li>.*?<\/li>\n)+)/g, '<ul>$1</ul>')  // Wrap lists
      .replace(/\n\n/g, '<br/><br/>')  // Line breaks
      .trim();
  }
}