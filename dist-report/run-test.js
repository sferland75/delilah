"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ReportGenerator_1 = require("./ReportGenerator");
const ReportStructure_1 = require("./agents/core/ReportStructure");
const TherapistQualificationsAgent_1 = require("./agents/sections/TherapistQualificationsAgent");
const DemographicsAgent_1 = require("./agents/sections/DemographicsAgent");
const SummaryOfFindingsAgent_1 = require("./agents/sections/SummaryOfFindingsAgent");
async function testBasicReport() {
    // Start with just a few key sections to verify the flow
    const generator = new ReportGenerator_1.ReportGenerator();
    // Register core sections
    generator.registerAgent(ReportStructure_1.ReportSection.THERAPIST_QUALIFICATIONS, new TherapistQualificationsAgent_1.TherapistQualificationsAgent());
    generator.registerAgent(ReportStructure_1.ReportSection.DEMOGRAPHICS, new DemographicsAgent_1.DemographicsAgent());
    generator.registerAgent(ReportStructure_1.ReportSection.SUMMARY_OF_FINDINGS, new SummaryOfFindingsAgent_1.SummaryOfFindingsAgent());
    try {
        // Generate report using the Anderson assessment
        const report = await generator.generateReportFromFile('delilah_assessment_2025-01-14 (16).json');
        // Save output
        const outputPath = 'd:/delilah/test-report.txt';
        await window.fs.writeFile(outputPath, report);
        console.log(`Basic test report generated and saved to ${outputPath}`);
        console.log('\nPreview:');
        console.log(report.substring(0, 500) + '...');
    }
    catch (error) {
        console.error('Error in test:', error);
    }
}
console.log('Running basic report test...');
testBasicReport().catch(console.error);
