// Mock window.fs for file system operations
global.window = {
  ...global.window,
  fs: {
    readFile: jest.fn().mockImplementation(async (path: string) => {
      if (path.endsWith('.csv')) {
        return Buffer.from('header1,header2\nvalue1,value2');
      }
      return Buffer.from('mock file content');
    }),
    readFileSync: jest.fn().mockImplementation((path: string) => {
      if (path.endsWith('.csv')) {
        return Buffer.from('header1,header2\nvalue1,value2');
      }
      return Buffer.from('mock file content');
    })
  }
} as any;

// Extend Jest matchers
expect.extend({
  toBeValidNarrative(received: string) {
    const containsUndefined = received.includes('undefined');
    const containsNull = received.includes('null');
    const hasContent = received.length > 0;
    
    return {
      message: () =>
        `expected narrative to be valid, but found issues:\n` +
        `${containsUndefined ? '- contains "undefined"\n' : ''}` +
        `${containsNull ? '- contains "null"\n' : ''}` +
        `${!hasContent ? '- empty content\n' : ''}`,
      pass: hasContent && !containsUndefined && !containsNull
    };
  }
});