import type { AgentContext, ValidationResult } from '../types';

export class TransfersAgentBase {
  protected context: AgentContext;
  protected orderNumber: number;
  protected sectionTitle: string;
  protected requiredFields: string[];
  private validationRules: Array<{
    rule: (data: any) => boolean;
    errorMessage: string;
  }> = [];

  constructor(
    context: AgentContext,
    orderNumber: number,
    sectionTitle: string,
    requiredFields: string[]
  ) {
    this.context = context;
    this.orderNumber = orderNumber;
    this.sectionTitle = sectionTitle;
    this.requiredFields = requiredFields;
    this.initializeValidationRules();
  }

  protected initializeValidationRules(): void {
    // Default implementation that can be overridden
  }

  protected getSectionKeys(): string[] {
    return [];
  }

  public async validateData(data: any): Promise<ValidationResult> {
    const errors: string[] = [];

    // Check required fields
    if (this.context.config.validateData) {
      for (const field of this.requiredFields) {
        if (!this.getField(data, field)) {
          errors.push('Required fields missing');
          break;
        }
      }

      // Run custom validation rules
      for (const { rule, errorMessage } of this.validationRules) {
        if (!rule(data)) {
          errors.push(errorMessage);
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  protected addValidationRule(rule: (data: any) => boolean, errorMessage: string): void {
    this.validationRules.push({ rule, errorMessage });
  }

  protected getField(obj: any, path: string, defaultValue: any = undefined): any {
    const value = path
      .split('.')
      .reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), obj);
    return value !== undefined ? value : defaultValue;
  }
}