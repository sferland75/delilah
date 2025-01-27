import { AgentContext } from '../types';

// Mock logger implementation
const noop = (_: string) => { /* no-op */ };

// Base context for testing
const mockContext: AgentContext = {
  logger: {
    log: noop,
    error: noop,
    warn: noop,
    info: noop
  },
  config: {
    detailLevel: 'standard'
  }
};

// Helper to create mock context with specific detail level
export function createMockContext(detailLevel: "brief" | "standard" | "detailed" = "standard"): AgentContext {
  return {
    ...mockContext,
    config: {
      detailLevel
    }
  };
}

export { mockContext };