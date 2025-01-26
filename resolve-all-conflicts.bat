@echo off
echo Adding resolved Transfer agent files...
git add src/components/ReportGeneration/agents/TransfersAgentAnalysis.ts
git add src/components/ReportGeneration/agents/TransfersAgentRecommendations.ts
git add docs/TransfersAgent.md

echo Committing resolved conflicts...
git commit -m "chore: resolve merge conflicts in TransfersAgent files"

echo Adding Range of Motion agent files...
git add src/components/ReportGeneration/agents/RangeOfMotion/*
git add src/components/ReportGeneration/agents/BaseAgent.ts

echo Committing ROM agent...
git commit -m "feat(ROM): Implement Range of Motion Agent with tests"

echo Pushing changes...
git push origin feature/report-drafting