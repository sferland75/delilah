@echo off
echo Running BaseAgent tests...
npm test src/components/ReportGeneration/agents/__tests__/BaseAgent.test.ts > test-output.txt 2>&1

echo.
echo Running DemographicsAgent tests...
npm test src/components/ReportGeneration/agents/__tests__/DemographicsAgent.test.ts >> test-output.txt 2>&1