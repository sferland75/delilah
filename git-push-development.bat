@echo off
echo Preparing comprehensive development update for git...

rem Stage all tracked files with modifications
git add -u

rem Stage all new files in src directory
git add src\*

rem Stage all documentation updates
git add *.md
git add docs\*

rem Stage configuration changes
git add *.json
git add *.js
git add *.ts
git add *.config.*

rem Stage test results and logs (if tracked)
git add TEST_ERRORLOG.txt
git add test-report-output.txt

rem Stage bat and ps1 scripts
git add *.bat
git add *.ps1

rem Create commit message file
echo feat: integrate web form and agentic drafting (January 2025)> commit_msg.txt
echo.>> commit_msg.txt
echo Major Updates:>> commit_msg.txt
echo - Complete web-based assessment form integration>> commit_msg.txt
echo - Add JSON export functionality>> commit_msg.txt
echo - Implement agentic drafting in report generation>> commit_msg.txt
echo - Enhance test coverage (74 tests passing)>> commit_msg.txt
echo.>> commit_msg.txt
echo Technical Changes:>> commit_msg.txt
echo - Update agent architecture for report generation>> commit_msg.txt
echo - Add document processing capabilities>> commit_msg.txt
echo - Implement TypeScript interfaces for documentation>> commit_msg.txt
echo - Add error handling and validation>> commit_msg.txt
echo - Update test framework>> commit_msg.txt
echo.>> commit_msg.txt
echo Documentation:>> commit_msg.txt
echo - Update system status documentation>> commit_msg.txt
echo - Add implementation details>> commit_msg.txt
echo - Update development priorities>> commit_msg.txt
echo - Document new features>> commit_msg.txt
echo.>> commit_msg.txt
echo Testing:>> commit_msg.txt
echo - Add new test suites>> commit_msg.txt
echo - Expand coverage to 74 tests>> commit_msg.txt
echo - Implement integration tests>> commit_msg.txt
echo - Add validation tests>> commit_msg.txt
echo.>> commit_msg.txt
echo Dev Tools:>> commit_msg.txt
echo - Update build scripts>> commit_msg.txt
echo - Add development utilities>> commit_msg.txt
echo - Update git scripts>> commit_msg.txt

rem Commit with message from file
git commit -F commit_msg.txt

rem Clean up commit message file
del commit_msg.txt

rem Push to current branch
git push origin HEAD

echo Development update complete.
echo Review the changes in your git repository.
pause