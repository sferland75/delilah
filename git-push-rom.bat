@echo off
echo Pushing Range of Motion Agent updates...

git add src/components/ReportGeneration/agents/RangeOfMotion/*
git add src/components/ReportGeneration/agents/BaseAgent.ts
git commit -m "feat(ROM): Implement Range of Motion Agent with tests"
git push origin main