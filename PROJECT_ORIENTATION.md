# Delilah Project Orientation

## Project Overview
Delilah is an occupational therapy assessment and report generation system. The project handles complex assessment data capture and intelligent report generation using an agent-based architecture.

## Key Files and Locations

### Assessment Data
- Main assessment JSON: `delilah_assessment_2025-01-14 (16).json`
- Example report PDF: `Anderson, Patrick CVSIHACAT.pdf`
Both located in project root directory (`d:/delilah/`)

### Report Generation System
Location: `src/components/ReportGeneration/`
- `README.md` - Core system documentation
- `agents/` - Agent implementations for report sections
- `templates/` - Report templates and formatting
- `utils/` - Validation and utility functions
- `testing/` - Test components and utilities

### Documentation to Review Before Starting
1. `/src/components/ReportGeneration/README.md`
   - System architecture overview
   - Component structure
   - Implementation guidelines

2. `/src/components/ReportGeneration/templates/README.md`
   - Template system usage
   - Available templates
   - Customization guide

3. `/src/components/ReportGeneration/testing/README.md`
   - Test component usage
   - Testing guidelines

### Project Structure
```
d:/delilah/
├── delilah_assessment_2025-01-14 (16).json  # Example assessment
├── Anderson, Patrick CVSIHACAT.pdf          # Example report
├── src/
│   ├── components/
│   │   └── ReportGeneration/               # Report system
│   ├── types/                             # TypeScript definitions
│   ├── utils/                             # Shared utilities
│   └── App.tsx                            # Main application
├── package.json
└── PROJECT_ORIENTATION.md                   # This file
```

## Before Starting Work

1. Review Documentation:
   - Read project orientation (this file)
   - Review report generation README
   - Check template system documentation
   - Understand testing approach

2. Examine Example Files:
   - Study assessment JSON structure
   - Review example report PDF
   - Note required report sections

3. Check Active Branch:
   ```bash
   git checkout feature/report-drafting
   git pull origin feature/report-drafting
   ```

4. Run Tests:
   ```bash
   npm test ReportGeneration
   ```

## Development Workflow

1. Navigate to relevant subsystem:
   ```bash
   cd src/components/ReportGeneration
   ```

2. Review related agents and templates in:
   - `agents/`
   - `templates/`

3. Use test component:
   ```typescript
   import { ReportGenerationTest } from './testing';
   ```

4. Run validation:
   ```typescript
   import { DataValidator } from './utils/validation';
   ```

## Key Concepts

1. Agent Architecture
   - Each report section has dedicated agent
   - Agents handle processing and formatting
   - BaseAgent provides common functionality

2. Template System
   - Multiple detail levels
   - Various output formats
   - Customizable by section

3. Validation Framework
   - Field-level validation
   - Custom validation rules
   - Common validators included

4. Testing Tools
   - Component testing
   - Agent unit tests
   - Template verification

## Common Tasks

1. Adding New Report Section:
   - Create agent in `agents/`
   - Add template in `templates/`
   - Update orchestrator
   - Add tests

2. Modifying Templates:
   - Update `ReportTemplates.ts`
   - Add formatters if needed
   - Test all detail levels

3. Enhanced Validation:
   - Add rules to `validation.ts`
   - Update agent validation
   - Add test cases

## Next Steps

1. Review current development in:
   - `feature/report-drafting` branch
   - Recent pull requests
   - Open issues

2. Test existing functionality:
   - Run test suite
   - Check example report generation
   - Verify template outputs

3. Plan next features based on:
   - Product backlog
   - Open issues
   - Documentation TODO items

## Contact & Resources

- Project repository: [URL]
- Documentation: See README files in each directory
- Issues: GitHub issue tracker

Always start by reviewing this orientation document and relevant README files before beginning new development.