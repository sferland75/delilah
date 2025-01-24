# Report Generation System

## Overview
The report generation system uses an agent-based architecture to transform assessment data into formatted reports. Each section of the report is handled by a specialized agent that knows how to process, validate, and format its specific data.

## Architecture

```
ReportGeneration/
├── agents/               # Agent implementations
├── components/          # React components
├── testing/            # Test utilities
└── types/              # TypeScript definitions
```

## Key Components

### ReportOrchestrator
Manages the report generation process:
- Coordinates multiple agents
- Handles error aggregation
- Manages report assembly
- Validates overall report structure

### BaseAgent
Abstract base class for all agents:
- Defines common agent interface
- Provides shared utilities
- Handles error management
- Manages validation

### Specialized Agents
Each agent handles a specific report section:
- FunctionalAssessmentAgent: ROM, MMT, Balance data
- SymptomsAgent: Physical, cognitive, emotional symptoms
- MedicalHistoryAgent: Past medical history, current conditions
- ADLAgent: Activities of daily living assessment
- EnvironmentalAgent: Environmental assessment data
- AMAGuidesAgent: AMA guidelines scoring

## Usage

```typescript
import { createReportOrchestrator } from './ReportOrchestrator';

// Create orchestrator
const orchestrator = createReportOrchestrator(assessmentData, {
  detailLevel: 'standard'
});

// Generate report
const report = await orchestrator.generateReport();

// Use sections
const sections = report.sections;
```

## Implementing New Agents

1. Create new agent class:
```typescript
import { BaseAgent } from './BaseAgent';

class NewSectionAgent extends BaseAgent {
  constructor(context: AgentContext) {
    super(context, orderNumber, 'Section Title', ['required.fields']);
  }

  process(data: any) {
    // Transform data
    return transformedData;
  }

  format(processedData: any) {
    // Format for output
    return formattedContent;
  }
}
```

2. Register in orchestrator:
```typescript
this.agents = [
  // ... other agents
  new NewSectionAgent(context, 7, 'New Section'),
];
```

## Error Handling
- Agents report errors through the BaseAgent error system
- Orchestrator aggregates errors from all agents
- Each section tracks its own validation state
- System continues processing despite section errors

## Testing
Use the ReportGenerationTest component:
```typescript
import { ReportGenerationTest } from './testing';

<ReportGenerationTest 
  assessmentData={data}
  compareWithOriginal={true}
/>
```

## Extending the System
1. Add new agents for new sections
2. Modify existing agents for new fields
3. Update validation rules
4. Add new formatting options