import { BaseAgent } from './BaseAgent';
import { AgentContext, AssessmentData } from '../types';
import _ from 'lodash';

interface Document {
  title: string;
  date: string;
  type: string;
  summary?: string;
  provider?: string;
  relevantFindings?: string[];
  recommendations?: string[];
}

export interface DocumentationOutput {
  valid: boolean;
  medicalDocumentation: Document[];
  legalDocumentation: Document[];
  otherDocumentation?: Document[];
  recommendations: string[];
  errors?: string[];
}

export class DocumentationAgent extends BaseAgent {
  constructor(context: AgentContext) {
    super(context, 1.1, 'Documentation Review', ['documentation']);
  }

  async processData(data: AssessmentData): Promise<DocumentationOutput> {
    const docs = _.get(data, 'documentation', {
      medicalDocumentation: [],
      legalDocumentation: []
    });
    
    // Process documents by category
    const medicalDocs = this.processDocuments(docs.medicalDocumentation || []);
    const legalDocs = this.processDocuments(docs.legalDocumentation || []);

    // Generate recommendations
    const recommendations = this.generateRecommendations(medicalDocs, legalDocs);

    return {
      valid: true,
      medicalDocumentation: medicalDocs,
      legalDocumentation: legalDocs,
      recommendations
    };
  }

  private processDocuments(docs: any[]): Document[] {
    return docs.map(doc => ({
      title: doc.title || 'Untitled Document',
      date: doc.date || 'Unknown date',
      type: doc.type || 'Unknown type',
      summary: doc.summary,
      provider: doc.provider,
      relevantFindings: doc.findings || [],
      recommendations: doc.recommendations || []
    }));
  }

  private generateRecommendations(medicalDocs: Document[], legalDocs: Document[]): string[] {
    const recommendations = new Set<string>();

    // Collect recommendations from documents
    [...medicalDocs, ...legalDocs].forEach(doc => {
      doc.recommendations?.forEach(rec => recommendations.add(rec));
    });

    // Add recommendations based on missing documentation
    if (medicalDocs.length === 0) {
      recommendations.add('Obtain recent medical records');
    }

    const oldestDoc = this.findOldestDocument([...medicalDocs, ...legalDocs]);
    if (oldestDoc && this.isDocumentOld(oldestDoc.date)) {
      recommendations.add('Update medical documentation');
    }

    return Array.from(recommendations);
  }

  private findOldestDocument(docs: Document[]): Document | null {
    return docs.reduce((oldest, current) => {
      const currentDate = new Date(current.date);
      return !oldest || currentDate < new Date(oldest.date) ? current : oldest;
    }, null as Document | null);
  }

  private isDocumentOld(dateStr: string): boolean {
    const docDate = new Date(dateStr);
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    return docDate < sixMonthsAgo;
  }

  protected override formatBrief(data: DocumentationOutput): string {
    const sections = ['Documentation Summary'];

    // Medical documentation
    if (data.medicalDocumentation.length > 0) {
      sections.push(`\nMedical Documentation: ${data.medicalDocumentation.length} documents`);
    }

    // Legal documentation
    if (data.legalDocumentation.length > 0) {
      sections.push(`\nLegal Documentation: ${data.legalDocumentation.length} documents`);
    }

    // Urgent recommendations
    const urgentRecs = data.recommendations.filter(rec => 
      rec.toLowerCase().includes('urgent') || 
      rec.toLowerCase().includes('immediate') ||
      rec.toLowerCase().includes('required')
    );

    if (urgentRecs.length > 0) {
      sections.push('\nUrgent Needs:', ...urgentRecs.map(rec => `- ${rec}`));
    }

    return sections.join('\n');
  }

  protected override formatDetailed(data: DocumentationOutput): string {
    const sections = ['Documentation Review'];

    // Medical documentation
    if (data.medicalDocumentation.length > 0) {
      sections.push('\nMedical Documentation:');
      data.medicalDocumentation.forEach(doc => {
        sections.push(`\n${doc.type} - ${doc.date}`);
        if (doc.provider) sections.push(`Provider: ${doc.provider}`);
        if (doc.summary) sections.push(`Summary: ${doc.summary}`);
        
        if (doc.relevantFindings?.length) {
          sections.push('Findings:');
          doc.relevantFindings.forEach(finding => sections.push(`- ${finding}`));
        }
      });
    }

    // Legal documentation
    if (data.legalDocumentation.length > 0) {
      sections.push('\nLegal Documentation:');
      data.legalDocumentation.forEach(doc => {
        sections.push(`\n${doc.type} - ${doc.date}`);
        if (doc.provider) sections.push(`Provider: ${doc.provider}`);
        if (doc.summary) sections.push(`Summary: ${doc.summary}`);
      });
    }

    // Other documentation
    if (data.otherDocumentation?.length) {
      sections.push('\nOther Documentation:');
      data.otherDocumentation.forEach(doc => {
        sections.push(`\n${doc.type} - ${doc.date}`);
        if (doc.summary) sections.push(`Summary: ${doc.summary}`);
      });
    }

    // Recommendations
    if (data.recommendations.length > 0) {
      sections.push('\nRecommendations:');
      data.recommendations.forEach(rec => sections.push(`- ${rec}`));
    }

    return sections.join('\n');
  }
}