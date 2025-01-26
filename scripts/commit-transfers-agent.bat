@echo off
REM Navigate to project root (if needed)
cd /d "%~dp0\.."

REM Add the modified files
git add src/components/ReportGeneration/agents/TransfersAgentAnalysis.ts
git add src/components/ReportGeneration/agents/TransfersAgentRecommendations.ts
git add docs/TransfersAgent.md

REM Create commit
git commit -m "feat(transfers): fix equipment identification and add documentation" -m "- Add abstract identifyRequiredEquipment method to TransfersAgentAnalysis" -m "- Fix equipment name formatting in recommendations" -m "- Add comprehensive TransfersAgent documentation" -m "- All tests passing (10/10)" -m "" -m "Resolves the equipment identification issue in the TransfersAgent by:" -m "1. Adding missing abstract method declaration" -m "2. Maintaining underscore format in equipment names" -m "3. Adding full documentation with usage examples"

REM Push to remote
git push origin feature/report-drafting

pause