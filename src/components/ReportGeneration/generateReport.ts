import { ReportSection, AgentContext, DetailLevel, StructuredContent } from '../../types/report';
import { Assessment } from '../../types';
import { AgentOrchestrator } from './agents/AgentOrchestrator';
import { formatReport } from './formatting/reportFormatter';

export async function generateReport(
    data: Assessment,
    context: AgentContext
): Promise<string> {
    try {
        // Initialize agent orchestrator
        const orchestrator = new AgentOrchestrator(context);

        // Generate sections through agents
        const sections = await orchestrator.generateReport(data);

        // Format the report
        const formattedReport = await formatReport(sections, context);

        return formattedReport;
    } catch (error) {
        console.error('Error generating report:', error);
        throw error;
    }
}

export async function generateStructuredReport(
    data: Assessment,
    context: AgentContext
): Promise<ReportSection[]> {
    const orchestrator = new AgentOrchestrator(context);
    return orchestrator.generateReport(data);
}