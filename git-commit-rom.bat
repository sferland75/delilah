@echo off
echo Fetching latest changes...
git fetch origin feature/report-drafting

echo Pulling latest changes...
git pull origin feature/report-drafting

echo Adding Range of Motion files...
git add src/components/ReportGeneration/agents/RangeOfMotion/*
git add src/components/ReportGeneration/agents/BaseAgent.ts

echo Committing changes...
git commit -m "feat(ROM): Implement Range of Motion Agent with tests"

echo Pushing to feature branch...
git push origin feature/report-drafting

if errorlevel 1 (
    echo Error occurred during push. Attempting merge resolution...
    git pull --rebase origin feature/report-drafting
    git push origin feature/report-drafting
)