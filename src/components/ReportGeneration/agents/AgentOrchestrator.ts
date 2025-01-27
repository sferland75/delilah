import { DemographicsAgent } from './demographics/DemographicsAgent';
import { ADLAgent } from './adl/ADLAgent';
import { MobilityAgent } from './MobilityAgent';
import { PhysicalSymptomsAgent } from './symptoms/PhysicalSymptomsAgent';
import { MedicalHistoryAgent } from './MedicalHistoryAgent';
import { BaseAgent } from './BaseAgent';
import { AgentContext, ReportSection, ReportSectionType } from '../../../types/report';
import { Assessment } from '../../../types';

export class AgentOrchestrator {
    private agents: BaseAgent[];

    constructor(context: AgentContext) {
        // Initialize agents in report order
        this.agents = [
            new DemographicsAgent(context),
            new MedicalHistoryAgent(context),
            new PhysicalSymptomsAgent(context),
            new MobilityAgent(context),
            new ADLAgent(context)
        ];
    }

    async generateReport(assessment: Assessment): Promise<ReportSection[]> {
        try {
            // Process each agent in sequence
            const sections = await Promise.all(
                this.agents.map(agent => agent.generateSection(assessment))
            );

            // Apply narrative integration and sort by order
            return this.integrateNarrative(sections);
        } catch (error) {
            console.error('Error generating report sections:', error);
            throw error;
        }
    }

    private integrateNarrative(sections: ReportSection[]): ReportSection[] {
        // Sort by order number
        const orderedSections = sections.sort((a, b) => a.orderNumber - b.orderNumber);
        
        // Add narrative transitions
        return orderedSections.map((section, index) => {
            if (index > 0) {
                section.transition = this.generateTransition(orderedSections[index - 1], section);
            }
            return section;
        });
    }

    private generateTransition(prevSection: ReportSection, currentSection: ReportSection): string {
        switch (currentSection.type) {
            case ReportSectionType.PHYSICAL_ASSESSMENT:
                return 'Physical examination revealed the following findings:';
            case ReportSectionType.FUNCTIONAL_ASSESSMENT:
                return 'Functional assessment demonstrates the following capabilities:';
            case ReportSectionType.MEDICAL_HISTORY:
                return 'Review of medical history indicates:';
            case ReportSectionType.SYMPTOMS:
                return 'The client reports the following symptoms:';
            case ReportSectionType.RECOMMENDATIONS:
                return 'Based on the above findings, the following recommendations are made:';
            default:
                return '';
        }
    }
}

// Add a type guard for debugging
function isValidReportSection(section: any): section is ReportSection {
    return (
        section &&
        typeof section.title === 'string' &&
        typeof section.orderNumber === 'number' &&
        (typeof section.content === 'string' || typeof section.content === 'object')
    );
}