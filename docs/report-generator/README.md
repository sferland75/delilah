# Delilah Report Generator 
 
## Overview 
The Report Generator module converts assessment data into formatted clinical reports following OT documentation standards. 
 
## Structure 
- `scripts/report/` 
  - `formatter.cjs` - Handles text formatting and layout 
  - `generator.cjs` - Core report generation logic 
  - `test-report.cjs` - Test harness 
 
## Sections 
1. Demographics & Client Information 
2. Summary of Findings 
3. Medical History 
4. Current Medications 
5. Injury Details 
6. Subjective Information 
7. Typical Day 
 
## Usage 
```bash 
npm run test-report 
``` 
