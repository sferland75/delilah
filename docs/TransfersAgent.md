# TransfersAgent Documentation

## Overview
The TransfersAgent analyzes transfer patterns, safety considerations, and equipment needs across various transfer scenarios (bed, chair, toilet, shower/tub).

## Class Hierarchy
- TransfersAgent
  - extends TransfersAgentFormatting
    - extends TransfersAgentRecommendations
      - extends TransfersAgentPatterns
        - extends TransfersAgentAnalysis
          - extends TransfersAgentBase

## Key Features
- Transfer pattern analysis
- Equipment needs assessment
- Safety risk evaluation
- Custom recommendations generation
- Multi-level detail formatting

## Recent Updates (January 25, 2025)
- Fixed inheritance chain for validateData and format methods
- Implemented proper TypeScript type definitions
- Added comprehensive AssessmentData interface
- All tests passing (10/10)
- Added proper method implementations in each class
- Fixed equipment name formatting in recommendations

## Input Data Structure
```typescript
interface AssessmentData {
  functionalAssessment?: {
    transfers?: {
      bedMobility?: string;
      sitToStand?: string;
      toilet?: {
        assistanceLevel?: string;
        equipment?: string[];
        modifications?: string[];
        safety_concerns?: string[];
      };
      // ... more fields
    };
  };
  equipment?: {
    current?: string[];
  };
  // ... other assessment sections
}
```

## Output Structure
```typescript
interface TransfersAgentOutput {
  transferStatus: {
    locations: TransferLocation[];
    generalPatterns: TransferPattern[];
    requiredEquipment: string[];
  };
  riskFactors: string[];
  recommendations: string[];
}
```

## Usage Example
```typescript
const agent = new TransfersAgent({
  config: {
    detailLevel: 'standard',
    validateData: true,
    includeMetadata: false
  },
  logger: { /* ... */ },
  templates: { /* ... */ }
});

const result = await agent.processData(assessmentData);
```

## Testing
Run tests with:
```bash
npm test src/components/ReportGeneration/agents/__tests__/TransfersAgent.test.ts
```

## Implementation Notes
- Equipment names maintain underscore format (e.g., 'grab_bars' not 'grab bars')
- Base classes provide default implementations that can be overridden
- Inheritance chain properly handles method delegation
- Comprehensive validation of assistance levels and required fields
- Three output detail levels: brief, standard, detailed