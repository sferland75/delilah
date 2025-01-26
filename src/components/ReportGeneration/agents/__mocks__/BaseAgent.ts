export class BaseAgent {
  protected context: any;
  protected sectionOrder: number;
  protected sectionTitle: string;
  protected requiredFields: string[];
  protected validationRules: Map<string, (value: any) => boolean>;

  constructor(context: any, sectionOrder: number, sectionTitle: string, requiredFields: string[] = []) {
    this.context = context;
    this.sectionOrder = sectionOrder;
    this.sectionTitle = sectionTitle;
    this.requiredFields = requiredFields;
    this.validationRules = new Map();
  }

  protected formatByDetailLevel(data: any, level: string): string {
    return '';
  }

  format(data: any): string {
    const { detailLevel = 'standard' } = this.context.options || {};
    return this.formatByDetailLevel(data, detailLevel);
  }

  protected getSectionKeys(): string[] {
    return [];
  }
}