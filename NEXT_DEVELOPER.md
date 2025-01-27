# Next Steps for Agent System Fixes

## Current Status
We've begun the process of fixing TypeScript errors and implementing proper format methods across all agents. Several key issues remain to be addressed.

## Priority Fixes Needed

### 1. Format Method Implementation
Several agents are missing their required format methods:
- `CognitiveSymptomAgent`: Missing formatBrief, formatDetailed, formatStandard
- `RangeOfMotionAgent`: Missing formatStandard
- `BasicADLAgent`: Missing formatStandard
- `IADLAgent`: Missing formatStandard
- `SymptomIntegrationAgent`: Missing formatStandard

### 2. Type Safety Issues
- `EmotionalSymptomAgent`: Parameter 's' has implicit any type in forEach loops
- `ROMPattern` unused import in analysis test (cleanup needed)
- `DocumentationAgent`: Provider property missing from type definition

### 3. Test Access Issues
Tests are attempting to access protected methods directly. Need to update:
- Use `getFormattedContent` instead of `formatByDetailLevel`
- Most tests are using the incorrect method for accessing formatted content

### 4. Documentation Type Issues
`DocumentationAgent` test data structure doesn't match expected types:
```typescript
// Current issue with provider property
provider: 'Dr. Smith'  // Not in type definition
```

## Approach for Fixes

1. **Format Methods**
   - Use the BaseAgent pattern established in other agents
   - Implement all three required format methods:
     ```typescript
     protected formatBrief(data: T): string
     protected formatStandard(data: T): string
     protected formatDetailed(data: T): string
     ```

2. **Test Updates**
   - Replace direct format method access with:
     ```typescript
     agent.getFormattedContent(data, 'brief')
     agent.getFormattedContent(data, 'standard')
     agent.getFormattedContent(data, 'detailed')
     ```

3. **Type Safety**
   - Add proper type annotations to all callbacks
   - Remove unused imports
   - Update interface definitions before fixing implementations

## Files to Focus On
1. `/agents/symptoms/EmotionalSymptomAgent.ts`
2. `/agents/symptoms/CognitiveSymptomAgent.ts`
3. `/agents/RangeOfMotion/RangeOfMotionAgent.ts`
4. `/agents/DocumentationAgent.ts`
5. All corresponding test files in `__tests__` directories

## Testing
After each fix:
1. Run tests for the specific agent: `npm test src/components/ReportGeneration/agents/__tests__/[AgentName].test.ts`
2. Run all tests to ensure no regressions: `npm test`

## Notes
- All agents must follow the BaseAgent pattern
- Format methods should be protected
- Public access should be through getFormattedContent
- Keep types consistent across all agents
- Consider creating shared interfaces for common patterns