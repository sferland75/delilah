"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportGenerator = void 0;
const ReportStructure_1 = require("./agents/core/ReportStructure");
const Formatter_1 = require("./utils/Formatter");
const FileLoader_1 = require("./utils/FileLoader");
class ReportGenerator {
    constructor() {
        this.agents = new Map();
        this.formatter = new Formatter_1.ReportFormatter();
    }
    registerAgent(section, agent) {
        this.agents.set(section, agent);
    }
    async generateReportFromFile(filename) {
        const data = await (0, FileLoader_1.loadAssessmentData)(filename);
        return this.generateReport(data);
    }
    async generateReport(data) {
        const sections = ['OCCUPATIONAL THERAPY IN-HOME ASSESSMENT\n'];
        const orderedSections = (0, ReportStructure_1.getOrderedSections)();
        for (const section of orderedSections) {
            const agent = this.agents.get(section);
            if (!agent)
                continue;
            try {
                const content = agent.generateSection(data);
                sections.push(this.formatter.formatSection(content.title, content.content));
            }
            catch (error) {
                console.warn(`Error generating section ${section}:`, error);
            }
        }
        return sections.join('\n');
    }
}
exports.ReportGenerator = ReportGenerator;
