import { AgentContext } from '../types';

const noop = (_: string) => { /* no-op */ };

const defaultLogger = {
  log: noop,
  error: noop,
  warn: noop,
  info: noop
};

const defaultConfig = {
  detailLevel: 'standard' as const
};

export const createMockContext = (overrides?: Partial<AgentContext>): AgentContext => {
  const defaultContext: AgentContext = {
    logger: defaultLogger,
    config: defaultConfig
  };

  if (!overrides) return defaultContext;

  return {
    ...defaultContext,
    ...(overrides || {}),
    logger: {
      ...defaultLogger,
      ...(overrides.logger || {})
    },
    config: {
      ...defaultConfig,
      ...(overrides.config || {})
    }
  };
};

export const mockContext = createMockContext();