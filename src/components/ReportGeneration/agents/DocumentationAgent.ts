import { BaseAgent } from './BaseAgent';
import { AgentContext, ProcessedData } from './types';
import { formatDate } from './utils';

interface TimelineEntry {
  date: string;
  event: string;
  source: string;
  type: 'medical' | 'legal';
  significance: 'high' | 'medium' | 'low';
}

interface DocumentSummary {
  title: string;
  date: string;
  type: string;
  provider?: string;
  keyFindings: string[];
  recommendations: string[];
  significance: 'high' | 'medium' | 'low';
}

interface DocumentationData extends ProcessedData {
  medical: DocumentSummary[];
  legal: DocumentSummary[];
  keyFindings: string[];
  recommendations: string[];
  timeline: TimelineEntry[];
  synthesis: {
    primaryConditions: string[];
    treatmentProgression: string[];
    barriersToRecovery: string[];
    prognosis: string[];
  };
}

export class DocumentationAgent extends BaseAgent {
  private keywordPatterns = {
    findings: [
      /(?:reveals?|shows?|indicates?|demonstrates?)\s+([^.]+)/i,
      /(?:diagnosed|assessment|impression)(?:\s+(?:of|with|as))?\s+([^.]+)/i,
      /(?:presents?|presenting)\s+with\s+([^.]+)/i,
      /MRI\s+shows?\s+([^.]+)/i
    ],
    recommendations: [
      /recommend(?:ed|s|ing)?\s+([^.]+)/i,
      /advised?\s+to\s+([^.]+)/i,
      /(?:should|needs to|must)\s+([^.]+)/i,
      /treatment\s+plan\s+includes?\s+([^.]+)/i,
      /include[sd]?\s+([^.]+)/i,
      /to\s+use\s+([^.]+)/i
    ],
    prognosis: [
      /prognosis\s+(?:is|remains)\s+([^.]+)/i,
      /expected\s+(?:to|that)\s+([^.]+)/i,
      /(?:likely|unlikely)\s+to\s+([^.]+)/i,
      /may\s+(?:be|require)\s+([^.]+)/i
    ],
    barriers: [
      /(?:limited|limiting)\s+(?:by|due to)\s+([^.]+)/i,
      /barrier(?:s)?\s+(?:include|are)\s+([^.]+)/i,
      /complicated\s+by\s+([^.]+)/i
    ]
  };

  constructor(context: AgentContext, sectionOrder: number) {
    super(context, sectionOrder, 'Documentation', []);
  }

  protected initializeValidationRules(): void {
    this.validationRules.set('documentation.medicalDocumentation[].date', (value: string) => {
      if (!value) return true;
      return !isNaN(new Date(value).getTime());
    });

    this.validationRules.set('documentation.legalDocumentation[].date', (value: string) => {
      if (!value) return true;
      return !isNaN(new Date(value).getTime());
    });
  }

  protected getSectionKeys(): string[] {
    return ['medicalDocumentation', 'legalDocumentation'];
  }

  async processData(data: any): Promise<DocumentationData> {
    const { documentation } = data;
    
    if (!documentation?.medicalDocumentation?.length && !documentation?.legalDocumentation?.length) {
      this.addWarning('No documentation provided for review');
    }

    const medical = this.processMedicalDocuments(documentation.medicalDocumentation || []);
    const legal = this.processLegalDocuments(documentation.legalDocumentation || []);

    const keyFindings = this.extractKeyFindings([...medical, ...legal])
        .map(finding => this.capitalizeFirstLetter(finding));
    const recommendations = this.extractRecommendations([...medical, ...legal])
        .map(rec => this.capitalizeFirstLetter(rec));

    const timeline = this.createTimeline(medical, legal);
    const synthesis = this.synthesizeInformation(medical, timeline);

    return {
      metadata: {
        processedAt: new Date(),
        version: '1.0'
      },
      medical,
      legal,
      keyFindings,
      recommendations,
      timeline,
      synthesis
    };
  }

  private processMedicalDocuments(documents: any[]): DocumentSummary[] {
    return documents.map(doc => {
      if (!doc.date) {
        this.addWarning(`Document "${doc.title}" missing date`);
      }

      const fullText = `${doc.title || ''}. ${doc.notes || ''}`;
      const findings = this.extractPatternMatches(fullText, this.keywordPatterns.findings);
      const explicitRecs = this.extractPatternMatches(fullText, this.keywordPatterns.recommendations);
      
      // Convert findings to recommendations where appropriate
      const impliedRecs = findings
        .filter(finding => 
          finding.toLowerCase().includes('limited ROM') ||
          finding.toLowerCase().includes('rotator cuff tear')
        )
        .map(finding => {
          if (finding.toLowerCase().includes('limited ROM')) return 'Gentle ROM exercises';
          if (finding.toLowerCase().includes('rotator cuff tear')) return 'Conservative treatment';
          return null;
        })
        .filter(Boolean) as string[];

      return {
        title: doc.title || 'Untitled Document',
        date: doc.date || 'Date not specified',
        type: 'medical',
        provider: this.extractProvider(doc.title || '', doc.notes || ''),
        keyFindings: findings,
        recommendations: [...explicitRecs, ...impliedRecs],
        significance: this.assessSignificance(doc)
      };
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  private processLegalDocuments(documents: any[]): DocumentSummary[] {
    return documents.map(doc => {
      if (!doc.date) {
        this.addWarning(`Legal document "${doc.title}" missing date`);
      }

      const fullText = `${doc.title || ''}. ${doc.notes || ''}`;
      
      return {
        title: doc.title || 'Untitled Legal Document',
        date: doc.date || 'Date not specified',
        type: 'legal',
        keyFindings: this.extractPatternMatches(fullText, this.keywordPatterns.findings),
        recommendations: this.extractPatternMatches(fullText, this.keywordPatterns.recommendations),
        significance: this.assessSignificance(doc)
      };
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  private extractProvider(title: string, notes: string): string | undefined {
    const providerPatterns = [
      /(?:Dr\.|Doctor)\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?/,
      /[A-Z][a-z]+\s+(?:Clinic|Hospital|Centre|Center)/,
      /(?:PT|OT|SLP|MD):\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?/
    ];

    for (const pattern of providerPatterns) {
      const match = (title + ' ' + notes).match(pattern);
      if (match) return match[0];
    }

    return undefined;
  }

  private extractKeyFindings(documents: DocumentSummary[]): string[] {
    const findings = documents.flatMap(doc => doc.keyFindings);
    return [...new Set(findings)].filter(Boolean);
  }

  private extractRecommendations(documents: DocumentSummary[]): string[] {
    const recommendations = documents.flatMap(doc => doc.recommendations);
    return [...new Set(recommendations)].filter(Boolean);
  }

  private createTimeline(medical: DocumentSummary[], legal: DocumentSummary[]): TimelineEntry[] {
    const timeline: TimelineEntry[] = [
      ...medical.map(doc => ({
        date: doc.date,
        event: `${doc.title}: ${doc.keyFindings.join('. ')}`,
        source: doc.provider || doc.title,
        type: 'medical' as const,
        significance: doc.significance
      })),
      ...legal.map(doc => ({
        date: doc.date,
        event: doc.title,
        source: 'Legal Documentation',
        type: 'legal' as const,
        significance: doc.significance
      }))
    ];

    return timeline.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  private synthesizeInformation(medical: DocumentSummary[], timeline: TimelineEntry[]) {
    return {
      primaryConditions: this.identifyPrimaryConditions(medical),
      treatmentProgression: this.analyzeTreatmentProgression(timeline),
      barriersToRecovery: this.identifyBarriers(medical),
      prognosis: this.extractPrognosis(medical)
    };
  }

  private identifyPrimaryConditions(medical: DocumentSummary[]): string[] {
    const conditions = medical.flatMap(doc => doc.keyFindings)
      .filter(finding => 
        finding.toLowerCase().includes('diagnosis') ||
        finding.toLowerCase().includes('condition') ||
        finding.toLowerCase().includes('presents with')
      );
    
    return [...new Set(conditions)];
  }

  private analyzeTreatmentProgression(timeline: TimelineEntry[]): string[] {
    const progression: string[] = [];
    let lastMedicalEvent: TimelineEntry | null = null;

    timeline.forEach(event => {
      if (event.type === 'medical') {
        if (lastMedicalEvent) {
          const daysBetween = this.daysBetween(
            new Date(event.date),
            new Date(lastMedicalEvent.date)
          );
          if (daysBetween > 30) {
            progression.push(`${daysBetween} days between ${event.source} and ${lastMedicalEvent.source}`);
          }
        }
        lastMedicalEvent = event;
      }
    });

    return progression;
  }

  private daysBetween(date1: Date, date2: Date): number {
    const oneDay = 24 * 60 * 60 * 1000;
    return Math.round(Math.abs((date1.getTime() - date2.getTime()) / oneDay));
  }

  private identifyBarriers(medical: DocumentSummary[]): string[] {
    return medical.flatMap(doc => 
      this.extractPatternMatches(doc.keyFindings.join('. '), this.keywordPatterns.barriers)
    );
  }

  private extractPrognosis(medical: DocumentSummary[]): string[] {
    return medical.flatMap(doc => 
      this.extractPatternMatches(doc.keyFindings.join('. '), this.keywordPatterns.prognosis)
    );
  }

  private extractPatternMatches(text: string, patterns: RegExp[]): string[] {
    if (!text) return [];
    
    return patterns.flatMap(pattern => {
      const matches = text.match(pattern);
      return matches ? [matches[1].trim()] : [];
    });
  }

  private assessSignificance(doc: any): 'high' | 'medium' | 'low' {
    const text = `${doc.title || ''} ${doc.notes || ''}`.toLowerCase();
    
    if (
      text.includes('urgent') ||
      text.includes('immediate') ||
      text.includes('critical') ||
      text.includes('severe') ||
      text.includes('significant')
    ) {
      return 'high';
    }

    if (
      text.includes('recommend') ||
      text.includes('should') ||
      text.includes('needs') ||
      text.includes('requires')
    ) {
      return 'medium';
    }

    return 'low';
  }

  private capitalizeFirstLetter(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  protected formatByDetailLevel(data: DocumentationData, detailLevel: 'brief' | 'standard' | 'detailed'): string {
    switch (detailLevel) {
      case 'brief':
        return this.formatBrief(data);
      case 'standard':
        return this.formatStandard(data);
      case 'detailed':
        return this.formatDetailed(data);
      default:
        return this.formatStandard(data);
    }
  }

  private formatBrief(data: DocumentationData): string {
    const sections = [
      '## Documentation Summary',
      '',
      '### Key Findings',
      ...data.keyFindings.map(finding => `- ${finding}`),
      '',
      '### Primary Recommendations',
      ...data.recommendations.map(rec => `- ${rec}`)
    ];

    return sections.filter(Boolean).join('\n');
  }

  private formatStandard(data: DocumentationData): string {
    const sections = [
      '## Documentation Review',
      '',
      '### Medical Documentation',
      ...data.medical.map(doc => [
        `#### ${doc.title} (${formatDate(doc.date)})`,
        doc.provider ? `Provider: ${doc.provider}` : '',
        'Key Findings:',
        ...doc.keyFindings.map(finding => `- ${finding}`),
        'Recommendations:',
        ...doc.recommendations.map(rec => `- ${rec}`),
        ''
      ].filter(Boolean).join('\n')),
      '',
      '### Legal Documentation',
      ...data.legal.map(doc => [
        `#### ${doc.title} (${formatDate(doc.date)})`,
        'Key Points:',
        ...doc.keyFindings.map(finding => `- ${finding}`),
        ''
      ].filter(Boolean).join('\n'))
    ];

    return sections.filter(Boolean).join('\n');
  }

  private formatDetailed(data: DocumentationData): string {
    const standardFormat = this.formatStandard(data);
    
    const additionalSections = [
      '',
      '### Treatment Timeline',
      ...data.timeline
        .filter(entry => entry.type === 'medical')
        .map(entry => `- ${formatDate(entry.date)}: ${entry.event}`),
      '',
      '### Treatment Recommendations',
      ...data.recommendations.map(rec => `- ${rec}`),
      '',
      '### Treatment Progression Analysis',
      ...data.synthesis.treatmentProgression.map(prog => `- ${prog}`),
      '',
      '### Timeline of Care',
      ...data.timeline
        .map(entry => `- ${formatDate(entry.date)}: ${entry.source}`),
      '',
      '### Barriers to Recovery',
      ...data.synthesis.barriersToRecovery.map(barrier => `- ${barrier}`),
      '',
      '### Prognosis',
      ...data.synthesis.prognosis.map(prog => `- ${prog}`)
    ];

    return standardFormat + '\n' + additionalSections.filter(Boolean).join('\n');
  }
}