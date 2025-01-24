# Report Templates

The template system allows for flexible report generation with different levels of detail and output formats.

## Usage Example

```typescript
import { TemplateManager } from './ReportTemplates';

// Create template manager with options
const templateManager = new TemplateManager({
  detailLevel: 'detailed',
  format: 'markdown',
  includeAppendices: true
});

// Format medical history section
const medicalData = {
  preExisting: "Patient has history of...",
  medications: [
    { name: "Tylenol", dosage: "500mg", frequency: "As needed" }
  ],
  treatments: [
    { provider: "PT", focus: "Range of motion" }
  ]
};

const formattedSection = templateManager.formatSection('medicalHistory', medicalData);

// Format symptoms section
const symptomsData = {
  physicalSymptoms: [
    { 
      location: "Lower back",
      severity: "Moderate",
      painType: "aching",
      frequency: "Daily"
    }
  ]
};

const formattedSymptoms = templateManager.formatSection('symptoms', symptomsData);
```

## Available Templates

1. Medical History
   - Brief: Basic conditions and medications
   - Standard: Adds treatments and surgical history
   - Detailed: Adds treatment response and medication effects

2. Symptoms
   - Brief: Physical and cognitive symptoms
   - Standard: Adds emotional symptoms and functional impact
   - Detailed: Adds aggravating/relieving factors and pattern analysis

## Adding Custom Templates

```typescript
templates.customSection = {
  title: 'Custom Section',
  order: 10,
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