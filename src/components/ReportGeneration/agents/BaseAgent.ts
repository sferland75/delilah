import { ReportAgent, AgentContext, ReportSection } from './types';
import { validateData, createSection } from './utils';

export abstract class BaseAgent implements ReportAgent {
  protected context: AgentContext;
  protected sectionOrder: number;
  protected sectionTitle: string;
  protected requiredFields: string[];

  constructor(
    context: AgentContext,
    sectionOrder: number,
    sectionTitle: string,
    requiredFields: string[] = []
  ) {
    this.context = context;
    this.sectionOrder = sectionOrder;
    this.sectionTitle = sectionTitle;
    this.requiredFields = requiredFields;
  }

  abstract process(data: any): any;

  validate(data: any): boolean {
    return validateData(data, this.requiredFields);
  }

  format(processedData: any): string {
    // Default implementation - should be overridden by specific agents
    return JSON.stringify(processedData, null, 2);
  }

  generateSection(data: any): ReportSection {
    const isValid = this.validate(data);
    const processedData = isValid ? this.process(data) : null;
    const content = isValid ? this.format(processedData) : '';
    
    return createSection(
      this.sectionTitle,
      content,
      this.sectionOrder,
      isValid,
      isValid ? [] : ['Required data missing or invalid']
    );
  }

  protected getField(data: any, path: string, defaultValue: any = null): any {
    return path.split('.').reduce((obj, key) => 
      (obj && obj[key] !== undefined) ? obj[key] : defaultValue, data);
  }

  protected formatError(error: string): string {
    return `[${this.sectionTitle}] ${error}`;
  }
}