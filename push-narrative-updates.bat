@echo off
echo Checking git status...
git status

echo.
echo Adding changes...
git add .

echo.
echo Committing changes...
git commit -m "feat: improve BaseAgent coverage and add narrative development roadmap

- Increase BaseAgent test coverage to 84.78%
- Add comprehensive error handling tests
- Update documentation with narrative focus
- Add development roadmap for narrative components

Test coverage:
- BaseAgent: 84.78%
- NarrativeEngine: 26.74%
- Analyzers: 3-31%"

echo.
echo Pushing changes...
git push