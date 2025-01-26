import { AssessmentData } from './types';
import { ReportSection, getOrderedSections } from './agents/core/ReportStructure';
import { BaseAgent } from './agents/core/BaseAgent';
import { ReportFormatter } from './utils/Formatter';
import { loadAssessmentData } from './utils/FileLoader';

export class ReportGenerator {
    private agents: Map<ReportSection, BaseAgent>;
    private formatter: ReportFormatter;

    constructor() {
        this.agents = new Map();
        this.formatter = new ReportFormatter();
    }

    public registerAgent(section: ReportSection, agent: BaseAgent) {
        this.agents.set(section, agent);
    }

    public async generateReportFromFile(filename: string): Promise<string> {
        const data = await loadAssessmentData(filename);
        return this.generateReport(data);
    }

    public async generateReport(data: AssessmentData): Promise<string> {
        const sections = ['OCCUPATIONAL THERAPY IN-HOME ASSESSMENT\n'];
        const orderedSections = getOrderedSections();

        for (const section of orderedSections) {
            const agent = this.agents.get(section);
            if (!agent) continue;

            try {
                const content = agent.generateSection(data);
                sections.push(this.formatter.formatSection(content.title, content.content));
            } catch (error) {
                console.warn(`Error generating section ${section}:`, error);
            }
        }

        return sections.join('\n');
    }
}