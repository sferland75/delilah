@echo off
echo Resolving merge conflicts...

echo Creating merged TransfersAgent.md...
(
echo # TransfersAgent Documentation
echo.
echo ## Overview
echo The TransfersAgent analyzes transfer patterns, safety considerations, and equipment needs across various transfer scenarios (bed, chair, toilet, shower/tub^).
echo.
echo ## Class Hierarchy
echo - TransfersAgent
echo   - extends TransfersAgentFormatting
echo     - extends TransfersAgentRecommendations
echo       - extends TransfersAgentPatterns
echo         - extends TransfersAgentAnalysis
echo           - extends TransfersAgentBase
echo.
echo ## Key Features
echo - Transfer pattern analysis
echo - Equipment needs assessment
echo - Safety risk evaluation
echo - Custom recommendations generation
echo - Multi-level detail formatting
echo.
echo ## Recent Updates (January 25, 2025^)
echo - Fixed inheritance chain for validateData and format methods
echo - Implemented proper TypeScript type definitions
echo - Added comprehensive AssessmentData interface
echo - Added abstract identifyRequiredEquipment method in TransfersAgentAnalysis
echo - Fixed equipment name formatting in recommendations
echo - All tests passing (10/10^)
echo.
echo ## Input Data Structure
echo Required fields:
echo - functionalAssessment.transfers
echo   - bedMobility
echo   - sitToStand
echo   - toilet
echo   - shower
echo - equipment.current
echo - symptoms.physical
echo - environment.home
echo.
echo ```typescript
echo interface AssessmentData {
echo   functionalAssessment?: {
echo     transfers?: {
echo       bedMobility?: string;
echo       sitToStand?: string;
echo       toilet?: {
echo         assistanceLevel?: string;
echo         equipment?: string[];
echo         modifications?: string[];
echo         safety_concerns?: string[];
echo       };
echo       // ... more fields
echo     };
echo   };
echo   equipment?: {
echo     current?: string[];
echo   };
echo   // ... other assessment sections
echo }
echo ```
echo.
echo ## Output Structure
echo ```typescript
echo interface TransfersAgentOutput {
echo   transferStatus: {
echo     locations: TransferLocation[];
echo     generalPatterns: TransferPattern[];
echo     requiredEquipment: string[];
echo   };
echo   riskFactors: string[];
echo   recommendations: string[];
echo }
echo ```
echo.
echo ## Usage Example
echo ```typescript
echo const agent = new TransfersAgent({
echo   config: {
echo     detailLevel: 'standard',
echo     validateData: true,
echo     includeMetadata: false
echo   },
echo   logger: { /* ... */ },
echo   templates: { /* ... */ }
echo });
echo.
echo const result = await agent.processData(assessmentData^);
echo ```
echo.
echo ## Testing
echo Run tests with:
echo ```bash
echo npm test src/components/ReportGeneration/agents/__tests__/TransfersAgent.test.ts
echo ```
echo.
echo ## Implementation Notes
echo - Equipment names maintain underscore format (e.g., 'grab_bars' not 'grab bars'^)
echo - Base classes provide default implementations that can be overridden
echo - Inheritance chain properly handles method delegation
echo - Comprehensive validation of assistance levels and required fields
echo - Three output detail levels: brief, standard, detailed
echo - Environmental hazards are location-specific
) > docs/TransfersAgent.md

git add docs/TransfersAgent.md

echo Committing resolved conflicts...
git commit -m "chore: resolve merge conflicts in TransfersAgent docs"

echo Now we can proceed with ROM agent commit...
git add src/components/ReportGeneration/agents/RangeOfMotion/*
git add src/components/ReportGeneration/agents/BaseAgent.ts

git commit -m "feat(ROM): Implement Range of Motion Agent with tests"

echo Pushing changes...
git push origin feature/report-drafting