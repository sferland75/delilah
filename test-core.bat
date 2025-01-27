@echo off
echo Running type checks...
npm run test:types

echo.
echo Running core tests...
npm test src/components/ReportGeneration/agents/__tests__/BaseAgent.test.ts
npm test src/components/ReportGeneration/testing/TestableAgent.test.ts