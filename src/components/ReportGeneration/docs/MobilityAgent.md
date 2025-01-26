# Mobility Agent Documentation

## Overview
The MobilityAgent is responsible for analyzing and reporting on a client's mobility status, incorporating data from:
- Berg Balance Scale
- Physical symptoms
- Typical daily activities
- Postural tolerances

## Features

### Movement Pattern Analysis
- Indoor/outdoor mobility pattern detection
- Activity-based pattern extraction
- Risk level classification (high_risk, limited, modified, routine)

### Distance Capacity Assessment
- Indoor and outdoor distance calculations
- Sustainable vs maximum distance analysis
- Balance score based adjustments

### Assistive Device Recommendations
- Automated device suggestions based on Berg Balance scores:
  - Wheelchair (≤20)
  - Walker (21-35)
  - Cane (36-45)

### Risk Factor Assessment
- Fall risk evaluation
- Symptom impact analysis
- Movement limitation identification

## Usage

```typescript
const mobilityAgent = new MobilityAgent(context);
const result = await mobilityAgent.analyze(assessmentData);

// Access different aspects of the analysis
const {
  mobilityStatus,
  riskFactors,
  recommendations
} = result;
```

## Output Format
The agent provides reports in three detail levels:

### Brief Format
- Key mobility findings
- Primary risk factors
- Essential recommendations

### Standard Format
- Current mobility status
- Distance capacities
- Risk factors
- Recommendations

### Detailed Format
- Comprehensive mobility analysis
- Pattern breakdowns
- Distance analysis with max/sustainable values
- Full risk factor assessment
- Detailed recommendations

## Integration Points
- Works with ADL/IADL assessments
- Informs environmental recommendations
- Supports cross-analysis with symptoms

## Test Coverage
- Data processing validation
- Distance calculations
- Risk assessment accuracy
- Recommendation appropriateness
- Report formatting consistency

## Status
- Version: 1.0
- Completion: 100%
- Test Coverage: Full
- Latest Update: January 25, 2025