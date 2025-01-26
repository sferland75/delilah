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

## Recent Updates
- Added abstract `identifyRequiredEquipment` method declaration in TransfersAgentAnalysis
- Fixed equipment name formatting in recommendations
- Completed test suite implementation
- All tests passing (10/10)

## Usage
```typescript
const agent = new TransfersAgent(context);
const result = await agent.processData(assessmentData);
```

## Input Data Structure
Required fields:
- functionalAssessment.transfers
  - bedMobility
  - sitToStand
  - toilet
  - shower
- equipment.current
- symptoms.physical
- environment.home

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

## Testing
Run tests with:
```bash
npm test src/components/ReportGeneration/agents/__tests__/TransfersAgent.test.ts
```

## Known Considerations
- Equipment names maintain underscore format (e.g., 'grab_bars' not 'grab bars')
- Assistance levels must match predefined types
- Environmental hazards are location-specific