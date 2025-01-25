# ADL Assessment Agents

## Overview
The ADL (Activities of Daily Living) assessment agents are responsible for analyzing and reporting on a client's functional independence in daily activities. The system includes two main agents:

1. BasicADLAgent - For basic activities of daily living
2. IADLAgent - For instrumental activities of daily living

## IADLAgent Updates
Recent improvements include:
- Enhanced barrier extraction with context-aware phrase detection
- Improved type safety throughout the codebase
- Better handling of undefined/optional values
- More robust activity analysis
- Comprehensive test coverage

### Key Features
- Pattern-based barrier identification
- Multi-level independence assessment
- Safety consideration analysis
- Adaptive recommendations
- Context-aware reporting

## Architecture
The agents use a modular structure with separate concerns:
- Core agent logic (IADLAgent.ts)
- Type definitions (types.ts)
- Formatting utilities (formatters.ts)
- Analysis utilities (analysisUtils.ts)
- Risk patterns (riskPatterns.ts)
- Type safety utilities (typeUtils.ts)

## Usage Example
```typescript
const agent = new IADLAgent(context, sectionOrder, 'IADL Assessment');
const result = await agent.processData(iadlData);
const report = agent.format(result);
```

## Testing
Comprehensive test suite available in `__tests__` directory.
Run tests with:
```bash
npm test src/components/ReportGeneration/agents/adl/__tests__
```