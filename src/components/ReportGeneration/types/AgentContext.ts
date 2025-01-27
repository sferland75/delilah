export interface AgentConfig {
  detailLevel: 'brief' | 'standard' | 'detailed';
  validateData?: boolean;
  type?: string;
}

export interface AgentContext {
  config: AgentConfig;
  logger?: {
    debug: (message: string) => void;
    info: (message: string) => void;
    warn: (message: string) => void;
    error: (message: string) => void;
  };
}