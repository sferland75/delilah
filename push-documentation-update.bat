@echo off
echo Updating documentation and pushing changes to git...

rem Add modified files
git add README.md
git add PROJECT_ORIENTATION.md
git add DEVELOPER_NEXT_STEPS.md

rem Commit changes
git commit -m "docs: update documentation to reflect current system status (January 2025)

- Update README.md with current features and test status
- Update PROJECT_ORIENTATION.md with implementation details
- Update DEVELOPER_NEXT_STEPS.md with development priorities
- Document web form completion
- Add JSON export status
- Add agentic drafting integration notes
- Update test status (74 tests passing)"

rem Push to remote
git push origin main

echo Documentation update complete.
pause