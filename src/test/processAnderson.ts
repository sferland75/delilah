import { generateReport } from '../components/ReportGeneration/generateReport';
import * as fs from 'fs/promises';
import * as path from 'path';
import { AgentContext } from '../types/report';

async function processAnderson() {
  try {
    // Read the assessment data
    const rawData = await fs.readFile(
      path.join(process.cwd(), 'delilah_assessment_2025-01-14 (16).json'),
      'utf8'
    );
    const assessmentData = JSON.parse(rawData);
    
    // Create agent context
    const context: AgentContext = {
      config: {
        detailLevel: 'standard',
        includeMetrics: true,
        validateData: true,
        formatPreference: 'clinical'
      },
      logger: console
    };
    
    // Generate the report
    const report = await generateReport(assessmentData, context);
    
    // Write the output
    await fs.writeFile(
      path.join(process.cwd(), 'anderson-report.txt'),
      report
    );
    console.log('Report generated successfully');
    
  } catch (error) {
    console.error('Error processing Anderson assessment:', error);
    process.exit(1);
  }
}

processAnderson().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});