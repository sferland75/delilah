# Delilah Assessment System

## Overview
Delilah is an occupational therapy assessment and report generation system designed for comprehensive patient evaluation and documentation. The system employs an agent-based architecture to intelligently process and integrate complex assessment data.

## Key Features
- Comprehensive assessment data capture via web-based form
- JSON export functionality for data portability
- Intelligent report generation through agentic drafting
- Multi-agent processing architecture for complex analysis
- Pattern recognition across domains
- Configurable detail levels

## Core Components
1. **Assessment System**
   - Web-based form interface
   - Complex data capture
   - Validation framework
   - Real-time processing
   - JSON export capability

2. **Report Generation**
   - Agent-based processing
   - Multi-level templates
   - Integrated analysis
   - Agentic drafting support
   - See [Report Generation Documentation](src/components/ReportGeneration/README.md)

3. **Analysis System**
   - Pattern recognition
   - Cross-domain correlation
   - Impact analysis
   - Intelligent narrative generation

## Deployment Status
- ✅ Web-based assessment form (functional)
- ✅ JSON data export
- ✅ Agentic drafting integration
- ✅ Basic report generation
- 🚧 Enhanced narrative features (in development)

## Getting Started
1. Review [Project Orientation](PROJECT_ORIENTATION.md)
2. Check [Report Quick Start Guide](src/components/ReportGeneration/QUICKSTART.md)
3. Explore component documentation in respective directories

## Development
- Requires Node.js 16+
- TypeScript codebase
- Jest for testing (74 tests implemented)

### Setup
```bash
npm install
npm test
```

### Key Directories
- `/src/components/` - Core components
- `/src/types/` - TypeScript definitions
- `/src/utils/` - Shared utilities

## Documentation
- [Project Orientation](PROJECT_ORIENTATION.md)
- [Report Generation](src/components/ReportGeneration/README.md)
- [Report Quick Start](src/components/ReportGeneration/QUICKSTART.md)
- [Agent Structure](src/components/ReportGeneration/docs/AGENT_STRUCTURE.md)

## Testing Status
- 21 test suites implemented
- 74 tests passing
- Coverage across all major components