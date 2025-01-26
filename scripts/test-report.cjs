const fs = require('fs');
const path = require('path');
const ReportGenerator = require('./report/generator.cjs');

async function testReportGeneration() {
    try {
        // Read the assessment file
        console.log('Reading assessment file...');
        const filePath = path.join(__dirname, '..', 'delilah_assessment_2025-01-14 (16).json');
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        
        // Generate report
        console.log('Generating report...');
        const generator = new ReportGenerator();
        const report = generator.generateReport(data);
        
        // Write output
        const outputPath = path.join(__dirname, '..', 'generated-report.txt');
        fs.writeFileSync(outputPath, report);
        
        console.log('Report written to:', outputPath);
        console.log('\nPreview (first 500 characters):');
        console.log('-'.repeat(50));
        console.log(report.substring(0, 500));
        console.log('-'.repeat(50));
    } catch (error) {
        console.error('Error generating report:', error);
        if (error.stack) {
            console.error(error.stack);
        }
    }
}

// Run the test
console.log('Starting report generation...');
testReportGeneration();