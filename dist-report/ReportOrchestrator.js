"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReportOrchestrator = exports.ReportOrchestrator = void 0;
const utils_1 = require("./agents/utils");
const agents_1 = require("./agents");
class ReportOrchestrator {
    constructor(context) {
        this.sections = [];
        this.errors = [];
        this.context = context;
        this.agents = [
            new agents_1.FunctionalAssessmentAgent(context, 1, 'Functional Assessment'),
            new agents_1.SymptomsAgent(context, 2, 'Symptoms'),
            new agents_1.MedicalHistoryAgent(context, 3, 'Medical History'),
            new agents_1.ADLAgent(context, 4, 'Activities of Daily Living'),
            new agents_1.EnvironmentalAgent(context, 5, 'Environmental Assessment'),
            new agents_1.AMAGuidesAgent(context, 6, 'AMA Guides Assessment')
        ];
    }
    async generateReport() {
        this.sections = [];
        this.errors = [];
        try {
            // Generate each section using corresponding agent
            const sectionPromises = this.agents.map(agent => {
                try {
                    const section = agent.generateSection(this.context.assessment);
                    if (!section.isValid) {
                        this.errors.push(...section.errors);
                    }
                    return section;
                }
                catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                    this.errors.push(`Error in ${agent.constructor.name}: ${errorMessage}`);
                    return null;
                }
            });
            // Wait for all sections to be generated
            const generatedSections = await Promise.all(sectionPromises);
            // Filter out null sections and merge results
            this.sections = (0, utils_1.mergeAgentResults)(generatedSections.filter(Boolean));
            return {
                sections: this.sections,
                errors: this.errors,
                isValid: this.errors.length === 0
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            this.errors.push(`Report generation failed: ${errorMessage}`);
            return {
                sections: [],
                errors: this.errors,
                isValid: false
            };
        }
    }
    getSection(title) {
        return this.sections.find(section => section.title === title);
    }
    getSections() {
        return [...this.sections];
    }
    getErrors() {
        return [...this.errors];
    }
}
exports.ReportOrchestrator = ReportOrchestrator;
// Export a factory function for easier instantiation
const createReportOrchestrator = (assessment, options = {}) => {
    const context = {
        assessment,
        options
    };
    return new ReportOrchestrator(context);
};
exports.createReportOrchestrator = createReportOrchestrator;
