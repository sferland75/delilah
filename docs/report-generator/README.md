# Delilah Report Generator

## Overview
The Report Generator module implements an agent-based architecture for transforming OT assessment data into professionally formatted clinical reports. Each agent specializes in a specific report section, handling the transformation from raw data to appropriate clinical narrative.

## Architecture

### Core Components
1. **Report Generator** (`generator.cjs`)
   - Orchestrates the report generation process
   - Manages agent coordination
   - Handles section assembly

2. **Report Formatter** (`formatter.cjs`)
   - Provides consistent text formatting
   - Handles clinical layout standards
   - Supports multiple content types

3. **Agents**
   Each agent specializes in transforming specific assessment data into clinically appropriate report sections.

### Agent Types

1. **Structured Data Agents**
   - Focus: Clean presentation of factual data
   - Examples: Demographics, Medical Team
   - Output: Formatted tables and lists

2. **Light Narrative Agents**
   - Focus: Brief, formatted text
   - Examples: Documentation Review
   - Output: Simple formatted paragraphs

3. **Moderate Narrative Agents**
   - Focus: Clinical observations with data
   - Examples: ROM, MMT
   - Output: Combined narrative and data

4. **Full Narrative Agents**
   - Focus: Complex clinical analysis
   - Examples: Summary, ADL Assessment
   - Output: Detailed clinical narratives

## Usage

### Basic Report Generation
```bash
npm run test-report
```

### Custom Report Generation
```javascript
const ReportGenerator = require('./report/generator.cjs');

const generator = new ReportGenerator();
const report = generator.generateReport(assessmentData);
```

## Development

### Adding New Agents
1. Create new agent in `scripts/report/agents/`
2. Extend BaseAgent
3. Implement generateSection method
4. Register with ReportGenerator

### Testing
1. Use test-report.cjs harness
2. Verify formatting with sample data
3. Check clinical content accuracy

## Clinical Standards
- Professional terminology
- Evidence-based reporting
- Consistent narrative style
- OT documentation best practices

## Project Structure
```
scripts/report/
├── formatter.cjs      # Text formatting utilities
├── generator.cjs      # Main report generator
├── agents/           # Section-specific agents
└── test-report.cjs   # Test harness
```

## Future Development
- Additional section agents
- Enhanced formatting options
- Template customization
- Report version tracking
- Metadata support

## Contributing
1. Review agent implementation patterns
2. Follow clinical documentation standards
3. Test with provided assessment data
4. Update documentation