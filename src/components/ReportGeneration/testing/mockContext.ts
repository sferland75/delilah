import { AgentContext } from '../../../types/report';
import { DEFAULT_FEATURES } from '../../../types/features';

const noop = (_: string) => { /* no-op */ };

export const createMockContext = (overrides?: Partial<AgentContext>): AgentContext => ({
  logger: {
    log: noop,
    error: noop,
    warn: noop,
    info: noop,
    ...(overrides?.logger || {})
  },
  config: {
    detailLevel: 'standard',
    validateData: true,
    formatPreference: 'text',
    includeMetrics: true,
    ...(overrides?.config || {})
  },
  features: {
    ...DEFAULT_FEATURES,
    ...(overrides?.features || {})
  }
});