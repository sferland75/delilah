# Range of Motion Agent

## Overview
The RangeOfMotionAgent processes and analyzes range of motion assessments, providing pattern recognition, functional impact analysis, and detailed reporting capabilities.

## Features
- Comprehensive ROM validation
- Bilateral/unilateral pattern detection
- Pain pattern analysis
- Functional impact assessment
- Multi-level reporting (brief, standard, detailed)

## Usage

```typescript
// Initialize agent
const agent = new RangeOfMotionAgent({
  options: { detailLevel: 'standard' }
});

// Process ROM data
const result = await agent.processData({
  functionalAssessment: {
    rangeOfMotion: {
      shoulder: [{
        joint: 'shoulder',
        movement: 'flexion',
        active: {
          right: 90,
          left: 160
        },
        passive: {
          right: 100,
          left: 170
        },
        painScale: {
          right: 6,
          left: 2
        }
      }]
    }
  }
});

// Validate data
const validation = await agent.validateData(data);
if (!validation.isValid) {
  console.error('Validation errors:', validation.errors);
}
```

## Integration Points
The RangeOfMotionAgent is designed to work with:
- ADL Agent (for functional impact correlation)
- Transfers Agent (for mobility assessment)
- Physical Capacity Agent (for work/activity recommendations)

## Testing
```bash
npm test src/components/ReportGeneration/agents/RangeOfMotion/__tests__/
```