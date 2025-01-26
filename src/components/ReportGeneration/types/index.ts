export interface Logger {
  info: (message: string, ...args: any[]) => void;
  error: (message: string, ...args: any[]) => void;
  warn: (message: string, ...args: any[]) => void;
  debug: (message: string, ...args: any[]) => void;
}

export interface Templates {
  getTemplate: (name: string) => Record<string, unknown>;
  formatValue: (value: any) => string;
}

export interface AgentContext {
  config: {
    detailLevel: 'brief' | 'standard' | 'detailed';
    validateData: boolean;
    includeMetadata: boolean;
  };
  logger: Logger;
  templates: Templates;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface AssessmentData {
  functionalAssessment?: {
    transfers?: {
      bedMobility?: string;
      sitToStand?: string;
      toilet?: {
        assistanceLevel?: string;
        equipment?: string[];
        modifications?: string[];
        safety_concerns?: string[];
      };
      shower?: {
        assistanceLevel?: string;
        equipment?: string[];
        modifications?: string[];
        safety_concerns?: string[];
      };
    };
    bergBalance?: {
      totalScore?: number;
      items?: Record<string, any>;
    };
  };
  equipment?: {
    current?: string[];
  };
  symptoms?: {
    physical?: Array<{
      location: string;
      painType: string;
      severity: string;
      frequency: string;
      aggravating: string;
      relieving: string;
    }>;
  };
  environment?: {
    home?: {
      bathroom?: {
        hazards?: string[];
      };
      [key: string]: any;
    };
  };
  typicalDay?: {
    current?: {
      daily?: {
        sleepSchedule?: {
          wakeTime?: string;
          bedTime?: string;
        };
        routines?: {
          morning?: {
            activities?: string;
          };
        };
      };
    };
  };
}