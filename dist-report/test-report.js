"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ReportGenerator_1 = require("./ReportGenerator");
const FileLoader_1 = require("./utils/FileLoader");
async function main() {
    try {
        // 1. Load the sample data
        console.log('Loading assessment data...');
        const data = await (0, FileLoader_1.loadAssessmentData)('delilah_assessment_2025-01-14 (16).json');
        // 2. Create and set up report generator
        console.log('Initializing report generator...');
        const generator = new ReportGenerator_1.ReportGenerator();
        // 3. Generate report
        console.log('Generating report...');
        const report = await generator.generateReport(data);
        // 4. Save output
        console.log('Saving report...');
        await window.fs.writeFile('report-output.txt', report);
        console.log('Report generation complete. Output saved to report-output.txt');
    }
    catch (error) {
        console.error('Error generating report:', error);
    }
}
// Run it
main().catch(console.error);
