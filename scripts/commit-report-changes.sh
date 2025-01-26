#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Updating Report Generator Documentation...${NC}"

# Create docs directory if it doesn't exist
mkdir -p docs/report-generator

# Generate documentation
cat > docs/report-generator/README.md << 'EOF'
# Delilah Report Generator

## Overview
The Report Generator module converts assessment data into formatted clinical reports following OT documentation standards.

## Structure
- `scripts/report/`
  - `formatter.cjs` - Handles text formatting and layout
  - `generator.cjs` - Core report generation logic
  - `test-report.cjs` - Test harness

## Sections
1. Demographics & Client Information
2. Summary of Findings
3. Medical History
4. Current Medications
5. Injury Details
6. Subjective Information
7. Typical Day

## Usage
```bash
npm run test-report
```

## Output
Generated reports are saved as text files with proper clinical formatting including:
- Section headers
- Structured client information
- Wrapped text for readability
- Proper spacing and alignment

## Development
1. New sections can be added by extending the ReportGenerator class
2. Formatting can be customized in the ReportFormatter class
3. Test with real assessment data using test-report.cjs
EOF

echo -e "${GREEN}Documentation updated${NC}"

# Stage changes
echo -e "${BLUE}Staging changes...${NC}"
git add docs/report-generator/README.md
git add scripts/report/
git add scripts/test-report.cjs
git add generated-report.txt

# Create commit
echo -e "${BLUE}Creating commit...${NC}"
git commit -m "feat(reports): Add report generator with formatter and basic sections

- Add report formatter with proper clinical formatting
- Implement core sections (demographics, medical history, etc.)
- Add test harness with sample output
- Add documentation"

echo -e "${GREEN}Changes committed. Ready to push.${NC}"
echo -e "${BLUE}To push changes, run:${NC}"
echo "git push origin main"