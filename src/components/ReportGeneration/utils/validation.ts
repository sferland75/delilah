type ValidationRule = {
  field: string;
  type?: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  min?: number;
  max?: number;
  enum?: string[];
  custom?: (value: any) => boolean;
  message?: string;
};

export interface ValidationError {
  field: string;
  message: string;
}

export class DataValidator {
  private rules: ValidationRule[];

  constructor(rules: ValidationRule[]) {
    this.rules = rules;
  }

  validate(data: any): ValidationError[] {
    const errors: ValidationError[] = [];

    this.rules.forEach(rule => {
      const value = this.getNestedValue(data, rule.field);
      
      // Required check
      if (rule.required && (value === undefined || value === null || value === '')) {
        errors.push({
          field: rule.field,
          message: rule.message || `${rule.field} is required`
        });
        return;
      }

      // Skip other validations if value is not required and empty
      if (value === undefined || value === null || value === '') {
        return;
      }

      // Type check
      if (rule.type && typeof value !== rule.type) {
        errors.push({
          field: rule.field,
          message: rule.message || `${rule.field} must be a ${rule.type}`
        });
      }

      // String validations
      if (typeof value === 'string') {
        if (rule.minLength && value.length < rule.minLength) {
          errors.push({
            field: rule.field,
            message: rule.message || `${rule.field} must be at least ${rule.minLength} characters`
          });
        }

        if (rule.maxLength && value.length > rule.maxLength) {
          errors.push({
            field: rule.field,
            message: rule.message || `${rule.field} must be no more than ${rule.maxLength} characters`
          });
        }

        if (rule.pattern && !rule.pattern.test(value)) {
          errors.push({
            field: rule.field,
            message: rule.message || `${rule.field} has invalid format`
          });
        }
      }

      // Number validations
      if (typeof value === 'number') {
        if (rule.min !== undefined && value < rule.min) {
          errors.push({
            field: rule.field,
            message: rule.message || `${rule.field} must be at least ${rule.min}`
          });
        }

        if (rule.max !== undefined && value > rule.max) {
          errors.push({
            field: rule.field,
            message: rule.message || `${rule.field} must be no more than ${rule.max}`
          });
        }
      }

      // Enum validation
      if (rule.enum && !rule.enum.includes(value)) {
        errors.push({
          field: rule.field,
          message: rule.message || `${rule.field} must be one of: ${rule.enum.join(', ')}`
        });
      }

      // Custom validation
      if (rule.custom && !rule.custom(value)) {
        errors.push({
          field: rule.field,
          message: rule.message || `${rule.field} is invalid`
        });
      }
    });

    return errors;
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => {
      return current ? current[key] : undefined;
    }, obj);
  }
}

// Common validation rules
export const CommonRules = {
  dateString: (field: string): ValidationRule => ({
    field,
    pattern: /^\d{4}-\d{2}-\d{2}$/,
    message: `${field} must be in YYYY-MM-DD format`
  }),

  phoneNumber: (field: string): ValidationRule => ({
    field,
    pattern: /^\+?[\d\s-()]{10,}$/,
    message: `${field} must be a valid phone number`
  }),

  email: (field: string): ValidationRule => ({
    field,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: `${field} must be a valid email address`
  }),

  severity: (field: string): ValidationRule => ({
    field,
    enum: ['None', 'Mild', 'Moderate', 'Severe', 'Very Severe'],
    message: `${field} must be a valid severity level`
  }),

  frequency: (field: string): ValidationRule => ({
    field,
    enum: ['Rarely', 'Sometimes', 'Often', 'Most of the time', 'Constantly'],
    message: `${field} must be a valid frequency`
  })
};

// Example validation schema for symptoms
export const symptomValidationRules: ValidationRule[] = [
  {
    field: 'location',
    type: 'string',
    required: true,
    message: 'Symptom location is required'
  },
  CommonRules.severity('severity'),
  CommonRules.frequency('frequency'),
  {
    field: 'aggravating',
    type: 'string',
    maxLength: 500
  },
  {
    field: 'relieving',
    type: 'string',
    maxLength: 500
  }
];