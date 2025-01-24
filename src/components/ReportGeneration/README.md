# Delilah Report Generation System

## Overview
The report generation system uses an intelligent agent-based architecture to transform assessment data into formatted reports. Each section of the report is handled by specialized agents that process, validate, and format their specific data domains.

## Components

```
ReportGeneration/
├── agents/               # Agent implementations
│   ├── BaseAgent.ts     # Base agent class
│   ├── MedicalHistoryAgent.ts
│   ├── SymptomsAgent.ts
│   ├── ADLAgent.ts
│   ├── EnvironmentalAgent.ts
│   └── AMAGuidesAgent.ts
├── templates/           # Report templates
│   ├── ReportTemplates.ts
│   └── README.md
├── utils/              # Utility functions
│   └── validation.ts
└── testing/           # Test utilities
    ├── ReportGenerationTest.tsx
    └── AgentTests.tsx

```

## Quick Start

```typescript
import { createReportOrchestrator } from './ReportOrchestrator';
import { TemplateManager } from './templates/ReportTemplates';

// Create template manager with desired options
const templateManager = new TemplateManager({
  detailLevel: 'detailed',
  format: 'markdown'
});

// Create orchestrator with assessment data
const orchestrator = createReportOrchestrator(assessmentData, {
  templateManager,
  validateData: true
});

// Generate report
const report = await orchestrator.generateReport();
```

## Features

### 1. Agent System
- Each section handled by specialized agent
- Built-in data validation
- Extensible processing pipeline
- Error handling and reporting

### 2. Template System
- Multiple detail levels (brief/standard/detailed)
- Multiple output formats (plain/markdown/html)
- Customizable section templates
- Data formatters for complex fields

### 3. Validation
- Field-level validation rules
- Custom validation functions
- Built-in common validators
- Comprehensive error reporting

## Adding New Features

### New Agent
1. Create new agent class extending BaseAgent
2. Implement process() and format() methods
3. Add to ReportOrchestrator
4. Add corresponding tests

```typescript
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

### New Template
1. Add template to ReportTemplates.ts
2. Define brief/standard/detailed versions
3. Add any needed formatters
4. Update tests

```typescript
templates.newSection = {
  title: 'New Section',
  order: nextOrder,
  templates: {
    brief: '...',
    standard: '...',
    detailed: '...'
  },
  formatters: {
    customField: (value) => `Formatted: ${value}`
  }
};
```

## Testing
Run the test suite:
```bash
npm test ReportGeneration
```

Or use the test component:
```typescript
import { ReportGenerationTest } from './testing';

<ReportGenerationTest 
  assessmentData={data}
  compareWithOriginal={true}
/>
```

## Next Steps
1. Add remaining report sections:
   - Care Plans
   - Recommendations
   - Appendices
2. Enhance validation rules
3. Add more output formats
4. Implement comparison tools