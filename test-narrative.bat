@echo off
cls
echo Running TypeScript type checks...
call npm run test:types

echo.
echo Running Base Agent tests...
call npm test src/components/ReportGeneration/agents/__tests__/BaseAgent.test.ts

echo.
echo Running TestableAgent tests...
call npm test src/components/ReportGeneration/testing/TestableAgent.test.ts