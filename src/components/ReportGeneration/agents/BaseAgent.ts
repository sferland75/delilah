import { AgentContext, AssessmentData, ValidationResult, ReportSection } from '../types';
import _ from 'lodash';

export abstract class BaseAgent {
  protected context: AgentContext;
  protected orderNumber: number;
  protected sectionName: string;
  protected requiredFields: string[];
  protected validationRules: Map<string, (value: any) => boolean>;

  constructor(context: AgentContext, orderNumber: number, sectionName: string, requiredFields: string[] = []) {
    this.context = context;
    this.orderNumber = orderNumber;
    this.sectionName = sectionName;
    this.requiredFields = requiredFields;
    this.validationRules = new Map();
  }

  protected getField(data: any, path: string, defaultValue: any = undefined): any {
    return _.get(data, path, defaultValue);
  }

  async validateData(data: AssessmentData): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check required fields
    for (const field of this.requiredFields) {
      const value = this.getField(data, field);
      if (value === undefined) {
        errors.push(`Missing required field: ${field}`);
      }
    }

    // Run validation rules
    for (const [field, rule] of this.validationRules.entries()) {
      const value = this.getField(data, field);
      if (value !== undefined && !rule(value)) {
        errors.push(`Invalid value for field: ${field}`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  abstract processData(data: AssessmentData): Promise<any>;

  format(data: any): string {
    return this.formatByDetailLevel(data, this.context.config?.detailLevel || 'standard');
  }

  public getFormattedContent(data: any, level?: "brief" | "standard" | "detailed"): string {
    return this.formatByDetailLevel(data, level || 'standard');
  }

  protected formatByDetailLevel(data: any, level: "brief" | "standard" | "detailed"): string {
    switch (level) {
      case 'brief':
        return this.formatBrief(data);
      case 'detailed':
        return this.formatDetailed(data);
      default:
        return this.formatStandard(data);
    }
  }

  protected abstract formatBrief(data: any): string;
  protected abstract formatDetailed(data: any): string;
  protected abstract formatStandard(data: any): string;

  public getOrderNumber(): number {
    return this.orderNumber;
  }

  public getSectionName(): string {
    return this.sectionName;
  }

  async generateSection(data: AssessmentData): Promise<ReportSection> {
    const validationResult = await this.validateData(data);
    if (!validationResult.valid) {
      return {
        orderNumber: this.orderNumber,
        sectionName: this.sectionName,
        content: validationResult.errors.join('\n'),
        valid: false,
        title: this.sectionName,
        errors: validationResult.errors
      };
    }

    const processedData = await this.processData(data);
    return {
      orderNumber: this.orderNumber,
      sectionName: this.sectionName,
      content: this.getFormattedContent(processedData, this.context.config?.detailLevel),
      valid: processedData.valid,
      title: this.sectionName,
      errors: processedData.errors
    };
  }
}