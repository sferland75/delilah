import { ReportGenerator } from './ReportGenerator';
import { ReportSection } from './agents/core/ReportStructure';
import { TherapistQualificationsAgent } from './agents/sections/TherapistQualificationsAgent';
import { DemographicsAgent } from './agents/sections/DemographicsAgent';
import { SummaryOfFindingsAgent } from './agents/sections/SummaryOfFindingsAgent';

async function testBasicReport() {
    // Start with just a few key sections to verify the flow
    const generator = new ReportGenerator();
    
    // Register core sections
    generator.registerAgent(ReportSection.THERAPIST_QUALIFICATIONS, new TherapistQualificationsAgent());
    generator.registerAgent(ReportSection.DEMOGRAPHICS, new DemographicsAgent());
    generator.registerAgent(ReportSection.SUMMARY_OF_FINDINGS, new SummaryOfFindingsAgent());

    try {
        // Generate report using the Anderson assessment
        const report = await generator.generateReportFromFile('delilah_assessment_2025-01-14 (16).json');
        
        // Save output
        const outputPath = 'd:/delilah/test-report.txt';
        await window.fs.writeFile(outputPath, report);
        
        console.log(`Basic test report generated and saved to ${outputPath}`);
        console.log('\nPreview:');
        console.log(report.substring(0, 500) + '...');
    } catch (error) {
        console.error('Error in test:', error);
    }
}

console.log('Running basic report test...');
testBasicReport().catch(console.error);