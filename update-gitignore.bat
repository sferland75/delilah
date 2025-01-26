@echo off
echo Adding updated .gitignore...
git add .gitignore

echo Committing .gitignore changes...
git commit -m "chore: update gitignore to exclude client data files"

echo Adding and committing development files...
git add .gitattributes
git add scripts/
git add *.bat
git add *.ps1
git add src/components/ReportGeneration/AgentOrchestrator.ts
git add src/components/ReportGeneration/__tests__/
git add src/components/ReportGeneration/agents/__mocks__/

git commit -m "chore: add development scripts and test infrastructure"

echo Pushing changes...
git push origin feature/report-drafting