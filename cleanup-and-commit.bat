@echo off
echo Adding git config files...
git add .gitignore
git add .gitattributes

echo Adding scripts...
git add scripts/
git add *.bat
git add *.ps1

echo Adding agent files...
git add src/components/ReportGeneration/AgentOrchestrator.ts
git add src/components/ReportGeneration/__tests__/
git add src/components/ReportGeneration/agents/__mocks__/

echo Committing support files...
git commit -m "chore: add development scripts and test infrastructure"

echo Pushing changes...
git push origin feature/report-drafting