export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}

export interface AgentContext {
  options?: {
    detailLevel?: 'brief' | 'standard' | 'detailed';
  };
}

export abstract class BaseAgent {
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
  
  abstract processData(data: any): Promise<any>;

  protected abstract formatByDetailLevel(data: any, level: string): string;

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
}