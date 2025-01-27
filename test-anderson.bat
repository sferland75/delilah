@echo off
echo Testing Anderson assessment report generation...
npm run process-anderson

echo.
echo Checking report contents...
echo =====================================
type anderson-report.txt

pause