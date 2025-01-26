import { ReportGenerator } from '../src/components/ReportGeneration/ReportGenerator';
import { ReportSection } from '../src/components/ReportGeneration/agents/core/ReportStructure';
import { TherapistQualificationsAgent } from '../src/components/ReportGeneration/agents/sections/TherapistQualificationsAgent';
import { DemographicsAgent } from '../src/components/ReportGeneration/agents/sections/DemographicsAgent';
import { SummaryOfFindingsAgent } from '../src/components/ReportGeneration/agents/sections/SummaryOfFindingsAgent';

async function generateTestReport() {
    console.log('Initializing report generator...');
    const generator = new ReportGenerator();

    // Register test sections
    console.log('Registering test sections...');
    generator.registerAgent(ReportSection.THERAPIST_QUALIFICATIONS, new TherapistQualificationsAgent());
    generator.registerAgent(ReportSection.DEMOGRAPHICS, new DemographicsAgent());
    generator.registerAgent(ReportSection.SUMMARY_OF_FINDINGS, new SummaryOfFindingsAgent());

    try {
        // Generate report
        console.log('Generating report...');
        const report = await generator.generateReportFromFile('delilah_assessment_2025-01-14 (16).json');
        
        // Save output
        console.log('Saving report...');
        const outputPath = 'generated-report.txt';
        await window.fs.writeFile(outputPath, report);
        
        console.log(`Report generated and saved to ${outputPath}`);
        console.log('\nFirst 500 characters:');
        console.log('-'.repeat(50));
        console.log(report.substring(0, 500));
        console.log('-'.repeat(50));
    } catch (error) {
        console.error('Error generating report:', error);
    }
}

// Run the test
generateTestReport().catch(console.error);