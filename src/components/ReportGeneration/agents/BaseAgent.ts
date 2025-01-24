import { ReportAgent, AgentContext, ReportSection, ValidationResult, ProcessedData } from './types';
import { validateData, createSection } from './utils';

export abstract class BaseAgent implements ReportAgent {
  protected context: AgentContext;
  protected sectionOrder: number;
  protected sectionTitle: string;
  protected requiredFields: string[];
  protected validationRules: Map<string, (value: any) => boolean>;
  protected warnings: string[] = [];

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
    this.validationRules = new Map();
    this.initializeValidationRules();
  }

  protected abstract initializeValidationRules(): void;
  
  abstract processData(data: any): Promise<ProcessedData>;

  async validateData(data: any): Promise<ValidationResult> {
    const errors: string[] = [];
    this.warnings = [];

    // Check required fields
    if (!validateData(data, this.requiredFields)) {
      errors.push('Required fields missing');
    }

    // Run custom validation rules
    for (const [field, validator] of this.validationRules.entries()) {
      const value = this.getField(data, field);
      if (value !== null && !validator(value)) {
        errors.push(`Invalid value for ${field}`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings: this.warnings
    };
  }

  format(processedData: ProcessedData): string {
    const { detailLevel = 'standard' } = this.context.options || {};
    return this.formatByDetailLevel(processedData, detailLevel);
  }

  protected abstract formatByDetailLevel(
    data: ProcessedData,
    detailLevel: 'brief' | 'standard' | 'detailed'
  ): string;

  async generateSection(data: any): Promise<ReportSection> {
    try {
      // Validate
      const validationResult = await this.validateData(data);
      
      if (!validationResult.isValid) {
        return createSection(
          this.sectionTitle,
          '',
          this.sectionOrder,
          false,
          validationResult.errors,
          validationResult.warnings
        );
      }

      // Process
      const processedData = await this.processData(data);

      // Format
      const content = this.format(processedData);

      // Create section
      return createSection(
        this.sectionTitle,
        content,
        this.sectionOrder,
        true,
        [],
        validationResult.warnings
      );

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return createSection(
        this.sectionTitle,
        '',
        this.sectionOrder,
        false,
        [this.formatError(errorMessage)],
        []
      );
    }
  }

  protected getField<T>(data: any, path: string, defaultValue: T | null = null): T | null {
    return path.split('.').reduce((obj, key) => 
      (obj && obj[key] !== undefined) ? obj[key] : defaultValue, data);
  }

  protected addWarning(warning: string): void {
    this.warnings.push(this.formatWarning(warning));
  }

  protected formatError(error: string): string {
    return `[${this.sectionTitle}] Error: ${error}`;
  }

  protected formatWarning(warning: string): string {
    return `[${this.sectionTitle}] Warning: ${warning}`;
  }

  protected abstract getSectionKeys(): string[];
}