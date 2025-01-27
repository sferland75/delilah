const fs = require('fs').promises;
const path = require('path');
const { Document, Paragraph, TextRun, HeadingLevel, TableOfContents, Packer } = require('docx');

async function loadAssessment(filepath) {
    const data = await fs.readFile(filepath, 'utf8');
    return JSON.parse(data);
}

function createSection(title, content) {
    return [
        new Paragraph({
            text: title,
            heading: HeadingLevel.HEADING_1,
            spacing: {
                before: 400,
                after: 200
            }
        }),
        ...content.split('\n').map(line => {
            if (!line.trim()) return new Paragraph({ text: '' });
            if (line.startsWith('-')) {
                return new Paragraph({
                    text: line,
                    bullet: {
                        level: 0
                    }
                });
            }
            return new Paragraph({ text: line });
        })
    ];
}

async function generateWordDoc(reportSections) {
    const doc = new Document({
        sections: [
            {
                children: [
                    new Paragraph({
                        text: "Assessment Report",
                        heading: HeadingLevel.TITLE,
                        spacing: { after: 400 }
                    }),
                    ...reportSections.flatMap(section => 
                        createSection(section.title || section.sectionName, section.content)
                    )
                ]
            }
        ]
    });

    return doc;
}

async function main() {
    try {
        // Get command line arguments
        const [inputFile, outputFile] = process.argv.slice(2);
        if (!inputFile || !outputFile) {
            console.error('Usage: node generate-report.js <input-json> <output-docx>');
            process.exit(1);
        }

        // Load assessment data
        console.log('Loading assessment data...');
        const assessmentData = await loadAssessment(inputFile);

        // Process through agents
        console.log('Processing assessment...');
        const { AgentOrchestrator } = require('../dist-report/AgentOrchestrator');
        const orchestrator = new AgentOrchestrator({
            logger: console,
            config: { detailLevel: 'detailed' }
        });

        const sections = await orchestrator.generateReport(assessmentData.assessment);

        // Generate Word document
        console.log('Generating Word document...');
        const doc = await generateWordDoc(sections);

        // Save the document
        console.log('Saving document...');
        const buffer = await Packer.toBuffer(doc);
        await fs.writeFile(outputFile, buffer);

        console.log(`Report saved to ${outputFile}`);

    } catch (error) {
        console.error('Error generating report:', error);
        process.exit(1);
    }
}

main();