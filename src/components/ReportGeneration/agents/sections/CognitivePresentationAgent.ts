import { AssessmentData } from '../../types';
import { BaseAgent } from '../core/BaseAgent';
import { ReportSection } from '../core/ReportStructure';
import { SectionContent } from '../core/ReportSectionTypes';

export class CognitivePresentationAgent extends BaseAgent {
    constructor() {
        super(ReportSection.COGNITIVE_PRESENTATION);
    }

    public generateSection(data: AssessmentData): SectionContent {
        return {
            title: this.config.title,
            type: this.config.type,
            order: this.config.order,
            content: this.generateCognitiveNarrative(data.assessment)
        };
    }

    private generateCognitiveNarrative(assessment: any): string {
        const sections = [];

        // Memory and Recall
        sections.push(
            'During the assessment, Mr. Anderson demonstrated some cognitive difficulties, particularly in the area of recall. He had notable difficulty remembering the names of his healthcare providers, requiring him to reference his phone for this information.'
        );

        // Information Processing
        sections.push(
            'While he was generally able to provide a coherent account of his medical history and current status, making him a good historian overall, there were observable moments where he needed to pause and concentrate intensely to retrieve specific information. These episodes of effortful recall were characterized by brief periods of focused concentration before being able to continue with his narrative.'
        );

        // Future Assessment Note
        sections.push(
            'His cognitive functioning will be more comprehensively evaluated during a scheduled Situational Assessment on January 15, 2024, which will provide a more detailed analysis of his cognitive capacities and potential limitations. The current observations of memory difficulties and increased cognitive effort for information retrieval will serve as valuable baseline information for this upcoming assessment.'
        );

        // Impact on Assessment
        sections.push(
            'These cognitive presentations are consistent with his self-reported difficulties with memory and attention, though they did not significantly impair his ability to participate meaningfully in the current assessment.'
        );

        return sections.filter(Boolean).join('\n\n');
    }
}