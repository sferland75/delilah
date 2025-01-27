@echo off
echo Running all agent tests...
npm test src/components/ReportGeneration/agents/__tests__/BaseAgent.test.ts
echo.
echo Testing specific agents...
npm test src/components/ReportGeneration/agents/__tests__/DemographicsAgent.test.ts
npm test src/components/ReportGeneration/agents/__tests__/MobilityAgent.test.ts
npm test src/components/ReportGeneration/agents/__tests__/MedicalHistoryAgent.test.ts
npm test src/components/ReportGeneration/agents/__tests__/TransfersAgent.test.ts