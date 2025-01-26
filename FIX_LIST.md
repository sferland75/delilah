# Priority Fixes

1. Update Test Data
- [ ] Add mockAssessmentData with id/date to testing/mockData.ts
- [ ] Update all agent test files to use mockAssessmentData
- [ ] Fix symptom data structure in tests

2. Property Naming
- [ ] Change all isValid to valid in:
  - BaseAgent.ts
  - ValidationResult interface
  - Agent implementations
  - Test assertions

3. Agent Interfaces
- [ ] Add ProcessedTransfersData interface
- [ ] Add ProcessedSymptomData interface
- [ ] Add ProcessedROMData interface
- [ ] Update agent return types

4. Test Suite Issues
- [ ] Fix TransfersAgent config type
- [ ] Fix RangeOfMotionAgent formatByDetailLevel
- [ ] Fix MobilityAgent validation
- [ ] Update BasicADLAgent assertions

Would you like me to start working on any particular area first?