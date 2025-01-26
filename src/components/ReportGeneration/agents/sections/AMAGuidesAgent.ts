import { AssessmentData } from '../../types';
import { BaseAgent } from '../core/BaseAgent';
import { ReportSection } from '../core/ReportStructure';
import { SectionContent } from '../core/ReportSectionTypes';

export class AMAGuidesAgent extends BaseAgent {
    constructor() {
        super(ReportSection.AMA_GUIDES);
    }

    public generateSection(data: AssessmentData): SectionContent {
        const amaGuides = data.assessment.amaGuides;

        return {
            title: this.config.title,
            type: this.config.type,
            order: this.config.order,
            content: this.generateAMANarrative(amaGuides, data.assessment)
        };
    }

    private generateAMANarrative(amaGuides: any, assessment: any): string {
        const sections = [
            'The following functional analysis addresses the four spheres of function as outlined in Chapter 14, Section 14.6 of the AMA Guides:',
            '',
            this.formatActivitiesOfDailyLiving(assessment),
            '',
            this.formatSocialFunctioning(assessment),
            '',
            this.formatConcentrationPersistencePace(assessment),
            '',
            this.formatAdaptation(assessment)
        ];

        if (amaGuides?.generalNotes) {
            sections.push('', amaGuides.generalNotes);
        }

        sections.push('', 'This information is provided to assist co-assessors in determining appropriate impairment classifications according to the AMA Guides criteria.');

        return sections.join('\n');
    }

    private formatActivitiesOfDailyLiving(assessment: any): string {
        return `Activities of Daily Living:
Mr. Anderson has experienced significant changes in his ability to manage activities of daily living since the accident. Personal care tasks have become challenging, particularly those requiring bilateral arm use or reaching. He requires assistance with lower body dressing, including socks and footwear, and cannot independently apply deodorant to his left armpit due to right shoulder limitations. Bathing presents safety concerns, as he cannot effectively clean his feet and requires modified techniques for most hygiene tasks.`;
    }

    private formatSocialFunctioning(assessment: any): string {
        return `Social Functioning:
Mr. Anderson's social functioning has undergone notable changes post-accident. Previously described as even-tempered and patient, he now experiences significant difficulties in social situations. He becomes overwhelmed in environments with background noise and cannot maintain conversations when children are present. This particularly impacts his ability to interact with his grandchildren, whom he sees regularly.`;
    }

    private formatConcentrationPersistencePace(assessment: any): string {
        return `Concentration, Persistence and Pace:
Mr. Anderson demonstrates notable difficulties with cognitive functioning and task completion. He requires multiple viewings of news programs (2-3 times) to fully comprehend and retain information. He frequently loses track during conversations and experiences word-finding difficulties. Memory issues manifest in daily activities, such as misplacing items and forgetting appointments, requiring his wife to provide regular reminders.`;
    }

    private formatAdaptation(assessment: any): string {
        return `Adaptation:
Mr. Anderson's ability to adapt to stress and change has been significantly impacted. Documentation reveals recurring instances of poor judgment in activity selection, often attempting tasks beyond his current capabilities despite knowing they will result in increased pain. This pattern suggests difficulties in adapting to his post-injury limitations and implementing appropriate compensatory strategies.`;
    }
}