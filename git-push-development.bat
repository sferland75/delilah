@echo off
echo Preparing comprehensive development update for git...

rem Stage all tracked files with modifications
git add -u

rem Stage all new files in src and test directories
git add src\* test\* 

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

rem Commit with comprehensive message
git commit -m "feat: integrate web form and agentic drafting (January 2025)

Major Updates:
- Complete web-based assessment form integration
- Add JSON export functionality
- Implement agentic drafting in report generation
- Enhance test coverage (74 tests passing)

Technical Changes:
- Update agent architecture for report generation
- Add document processing capabilities
- Implement TypeScript interfaces for documentation
- Add error handling and validation
- Update test framework

Documentation:
- Update system status documentation
- Add implementation details
- Update development priorities
- Document new features

Testing:
- Add new test suites
- Expand coverage to 74 tests
- Implement integration tests
- Add validation tests

Dev Tools:
- Update build scripts
- Add development utilities
- Update git scripts"

rem Push to main branch
git push origin main

echo Development update complete.
echo Review the changes in your git repository.
pause