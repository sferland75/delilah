"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockContext = void 0;
exports.createMockContext = createMockContext;
// Mock logger implementation
const noop = (_) => { };
// Base context for testing
const mockContext = {
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
exports.mockContext = mockContext;
// Helper to create mock context with specific detail level
function createMockContext(detailLevel = "standard") {
    return {
        ...mockContext,
        config: {
            detailLevel
        }
    };
}
