# Quick Start Guide

## Installation
The report generation system is part of the main Delilah project. No additional installation required.

## Basic Usage

```typescript
// In your component:
import { ReportGenerator } from '@/components/ReportGeneration';
import type { Assessment } from '@/types';

const MyReport: React.FC<{ assessment: Assessment }> = ({ assessment }) => {
  return (
    <ReportGenerator 
      assessment={assessment}
      onError={(error) => console.error(error)}
    />
  );
};
```

## Development

### Adding New Agents

1. Create agent file in `agents` directory:
```typescript
// agents/MyNewAgent.ts
import { BaseAgent } from './BaseAgent';

export class MyNewAgent extends BaseAgent {
  constructor(context: AgentContext) {
    super(context, 8, 'My New Section', ['required.field']);
  }

  process(data: any) {
    // Transform data
    return {
      // processed data
    };
  }

  format(data: any) {
    return `Formatted content`;
  }
}
```

2. Register in orchestrator:
```typescript
// ReportOrchestrator.ts
import { MyNewAgent } from './agents/MyNewAgent';

// Add to agents array:
this.agents = [
  // ... existing agents
  new MyNewAgent(context),
];
```

### Testing

1. Use test component:
```typescript
import { ReportGenerationTest } from './testing';

// In your test page:
<ReportGenerationTest />
```

2. Or test specific agent:
```typescript
import { MyNewAgent } from './agents/MyNewAgent';

const agent = new MyNewAgent(context);
const section = agent.generateSection(testData);
expect(section.isValid).toBe(true);
```

### Common Tasks

#### Updating Section Format
1. Extend the base agent
2. Override format method
3. Update section tests

#### Adding Validation Rules
1. Add fields to requiredFields array
2. Add custom validation in validate method
3. Update error messages

#### Modifying Section Order
Update order number in agent constructor

## Troubleshooting

### Common Issues

1. Missing Data
- Check requiredFields in agent
- Verify assessment data structure
- Check for null/undefined values

2. Formatting Issues
- Review format method in agent
- Check for missing template strings
- Verify data transformation in process

3. Order Problems
- Check agent order numbers
- Verify orchestrator sorting
- Check section merging

### Getting Help
1. Review agent error messages
2. Check validation rules
3. Use test component for debugging
4. Review typed interfaces