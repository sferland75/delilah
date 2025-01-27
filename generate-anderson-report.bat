@echo off
echo Installing dependencies...
call npm install

echo Building report generation code...
call npm run build:report

echo Generating Anderson Assessment Report...
node scripts/generate-report.js "delilah_assessment_2025-01-14 (16).json" "anderson-report.docx"

echo Report generation complete. Check anderson-report.docx
pause