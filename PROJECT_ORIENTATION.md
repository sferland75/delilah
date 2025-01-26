# Welcome to Delilah: OT Assessment & Report Generation System

## Quick Start
1. Clone the repository
2. `npm install`
3. Run test report: `npm run test-report`
4. Check `generated-report.txt` for output

## Project Overview
Delilah is an occupational therapy assessment and report generation system. We're moving to an agent-based architecture where specialized components (agents) transform assessment data into clinically appropriate report sections.

### Key Features
- Digital OT assessment form
- Structured data collection
- Automated report generation
- Clinical narrative synthesis

## Core Architecture

### Assessment Data → Report Pipeline:
```
JSON Assessment Data → Report Agents → Formatted Clinical Report
                          ↓
                    [Agent Types]
                    - Structured
                    - Light Narrative
                    - Moderate Narrative
                    - Full Narrative
```

## Where to Start

### 1. Current Development Focus
Look at `DEVELOPER_NEXT_STEPS.md` for:
- Current project status
- Immediate priorities
- Implementation guidelines

### 2. Report Generation
Start with `/scripts/report/`:
- `generator.cjs` - Main report generation logic
- `formatter.cjs` - Text formatting utilities
- `test-report.cjs` - Test harness

### 3. Documentation
Review in this order:
1. `/docs/report-generator/README.md` - Report generation overview
2. `/src/components/ReportGeneration/agents/` - Agent implementations
3. Sample assessment data: `delilah_assessment_2025-01-14 (16).json`

## Current Work

### What's Working
- Basic report generation framework
- Demographics section
- Medical history
- Initial formatting system

### What's Next
1. Implement remaining report sections
2. Enhance narrative generation
3. Improve clinical formatting
4. Add validation

## Development Guidelines

### Adding New Report Sections
1. Review existing agents in `/src/components/ReportGeneration/agents/sections/`
2. Choose appropriate agent type based on content
3. Implement using established patterns
4. Add to test harness

### Testing Your Work
1. Add test data to assessment JSON
2. Run `npm run test-report`
3. Check generated-report.txt
4. Verify clinical formatting

## Important Files

### Report Generation
- `/scripts/report/generator.cjs`
- `/scripts/report/formatter.cjs`
- `/scripts/test-report.cjs`

### Key Documents
- `DEVELOPER_NEXT_STEPS.md`
- `/docs/report-generator/README.md`

### Sample Data
- `delilah_assessment_2025-01-14 (16).json`

## Design Principles
1. Each agent focuses on one report section
2. Clinical accuracy is paramount
3. Professional formatting is required
4. Modular, maintainable code

## Clinical Context
Remember you're generating professional OT documentation. Key considerations:
- Use proper clinical terminology
- Follow OT documentation standards
- Maintain professional narrative style
- Support evidence-based reporting

## Common Tasks

### Running Tests
```bash
npm run test-report
```

### Adding a New Agent
```typescript
class NewSectionAgent extends BaseAgent {
    constructor() {
        super(ReportSection.NEW_SECTION);
    }

    public generateSection(data: AssessmentData): SectionContent {
        return {
            title: this.config.title,
            type: this.config.type,
            order: this.config.order,
            content: this.generateContent(data)
        };
    }
}
```

## Getting Help
1. Check existing agent implementations
2. Review documentation in `/docs`
3. Test with sample data
4. Look for similar patterns in codebase

## Next Steps
1. Review `DEVELOPER_NEXT_STEPS.md`
2. Generate a test report
3. Study the agent architecture
4. Look at section order in Anderson report

Remember: The goal is transforming assessment data into professional, clinically accurate reports through a modular, agent-based system.