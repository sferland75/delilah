@echo off
echo Updating Report Generator Documentation...

:: Create docs directory if it doesn't exist
if not exist docs\report-generator mkdir docs\report-generator

:: Generate documentation
echo # Delilah Report Generator > docs\report-generator\README.md
echo. >> docs\report-generator\README.md
echo ## Overview >> docs\report-generator\README.md
echo The Report Generator module converts assessment data into formatted clinical reports following OT documentation standards. >> docs\report-generator\README.md
echo. >> docs\report-generator\README.md
echo ## Structure >> docs\report-generator\README.md
echo - `scripts/report/` >> docs\report-generator\README.md
echo   - `formatter.cjs` - Handles text formatting and layout >> docs\report-generator\README.md
echo   - `generator.cjs` - Core report generation logic >> docs\report-generator\README.md
echo   - `test-report.cjs` - Test harness >> docs\report-generator\README.md
echo. >> docs\report-generator\README.md
echo ## Sections >> docs\report-generator\README.md
echo 1. Demographics ^& Client Information >> docs\report-generator\README.md
echo 2. Summary of Findings >> docs\report-generator\README.md
echo 3. Medical History >> docs\report-generator\README.md
echo 4. Current Medications >> docs\report-generator\README.md
echo 5. Injury Details >> docs\report-generator\README.md
echo 6. Subjective Information >> docs\report-generator\README.md
echo 7. Typical Day >> docs\report-generator\README.md
echo. >> docs\report-generator\README.md
echo ## Usage >> docs\report-generator\README.md
echo ```bash >> docs\report-generator\README.md
echo npm run test-report >> docs\report-generator\README.md
echo ``` >> docs\report-generator\README.md

echo Documentation updated.

:: Stage changes
echo Staging changes...
git add docs/report-generator/README.md
git add scripts/report/
git add scripts/test-report.cjs
git add generated-report.txt

:: Create commit
echo Creating commit...
git commit -m "feat(reports): Add report generator with formatter and basic sections - Add report formatter with proper clinical formatting - Implement core sections (demographics, medical history, etc.) - Add test harness with sample output - Add documentation"

echo Changes committed. Ready to push.
echo To push changes, run: git push origin main