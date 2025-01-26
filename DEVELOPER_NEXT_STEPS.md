# Delilah Report Generation System - Development Guide

## Current Architecture Overview
Our system has evolved into a narrative-driven, agent-based report generation structure where each agent is responsible for transforming specific assessment data into clinically appropriate report sections.

### Core Components
1. **Report Generator**
   - Coordinates agent activities
   - Maintains report structure and formatting
   - Handles section assembly and output generation

2. **Agents**
   - Each agent specializes in a specific report section
   - Transforms raw assessment data into formatted narrative content
   - Follows clinical documentation standards

3. **Formatter**
   - Handles consistent text formatting
   - Maintains professional clinical layout
   - Supports various content types (structured data, narratives)

## Agent Types Based on Content
1. **Structured Data Agents**
   - Demographics
   - Current Medical Team
   - Current Medications
   Examples: `DemographicsAgent`, `CurrentMedicationsAgent`
   Focus: Clean, tabular presentation of factual data

2. **Light Narrative Agents**
   - Documentation Review
   - Pre-Accident History
   Examples: `DocumentationAgent`, `MedicalHistoryAgent`
   Focus: Brief, formatted text with minimal interpretation

3. **Moderate Narrative Agents**
   - Range of Motion
   - Manual Muscle Testing
   - Environmental Assessment
   Examples: `ROMAgent`, `MMTAgent`
   Focus: Clinical observations combined with structured data

4. **Full Narrative Agents**
   - Summary of Findings
   - ADL Assessment
   - AMA Guides Analysis
   Examples: `SummaryAgent`, `ADLAgent`, `AMAGuidesAgent`
   Focus: Complex clinical analysis and interpretation

## Next Development Steps

### 1. Complete Agent Implementation (Priority)
- [ ] Implement remaining agent types following established patterns
- [ ] Ensure consistent narrative style across related sections
- [ ] Add validation for required assessment data

### 2. Enhance Report Formatting
- [ ] Implement table formatting for structured data
- [ ] Add support for clinical measurement formatting
- [ ] Improve section and subsection formatting

### 3. Add Integration Features
- [ ] Add support for different report templates
- [ ] Implement report version tracking
- [ ] Add support for report metadata

### 4. Quality Assurance
- [ ] Create comprehensive test suite
- [ ] Add validation for clinical content
- [ ] Implement error handling for missing data

## Development Guidelines

### Creating New Agents
```typescript
class NewSectionAgent extends BaseAgent {
    constructor() {
        super(ReportSection.NEW_SECTION);
    }

    public generateSection(data: AssessmentData): SectionContent {
        // Transform assessment data into appropriate narrative
        return {
            title: this.config.title,
            type: this.config.type,
            order: this.config.order,
            content: this.generateContent(data)
        };
    }

    private generateContent(data: any): string {
        // Implement section-specific content generation
    }
}
```

### Testing Agents
1. Test data transformation
2. Verify formatting
3. Check clinical accuracy
4. Validate section integration

### Key Files
- `/scripts/report/generator.cjs` - Main report generation logic
- `/scripts/report/formatter.cjs` - Text formatting utilities
- `/scripts/test-report.cjs` - Test harness

## Clinical Standards
- Maintain professional terminology
- Follow OT documentation best practices
- Ensure consistency in narrative style
- Support evidence-based reporting

## Questions/Support
- Review existing agent implementations for patterns
- Check documentation in `/docs/report-generator`
- Reference sample reports in `/samples`
- Test with provided assessment data

Remember: Each agent's primary responsibility is transforming raw assessment data into clinically appropriate, well-formatted narrative content that contributes to a comprehensive OT report.