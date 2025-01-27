import { AgentContext } from '../../../../types/report';

export interface AgentConfig {
    detailLevel: 'brief' | 'standard' | 'detailed';
    validateData?: boolean;
    includeMetrics: boolean;
    formatPreference: 'clinical' | 'plain';
}

export function createAgentContext(context: AgentContext): AgentContext {
    return {
        config: {
            detailLevel: context.config.detailLevel,
            validateData: context.config.validateData,
            includeMetrics: context.config.includeMetrics,
            formatPreference: context.config.formatPreference
        },
        logger: context.logger
    };
}