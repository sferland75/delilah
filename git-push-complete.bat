@echo off
echo Starting complete repository push...

REM Add all files including new ones
git add -A

REM Commit with timestamp
git commit -m "Complete repository update %date% %time%"

REM Push to remote
git push origin main

echo Push complete!
pause