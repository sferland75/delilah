import { AssessmentData } from '../../types';
import { BaseAgent } from '../core/BaseAgent';
import { ReportSection } from '../core/ReportStructure';
import { SectionContent } from '../core/ReportSectionTypes';

export class SymptomManagementAgent extends BaseAgent {
    constructor() {
        super(ReportSection.SYMPTOM_MANAGEMENT);
    }

    public generateSection(data: AssessmentData): SectionContent {
        return {
            title: this.config.title,
            type: this.config.type,
            order: this.config.order,
            content: this.generateManagementNarrative(data.assessment)
        };
    }

    private generateManagementNarrative(assessment: any): string {
        const sections = [];

        // Primary Management Approaches
        sections.push(
            'Mr. Anderson currently employs several strategies to manage his symptoms and maintain function. His primary management approaches include rest periods throughout the day, particularly when symptoms are exacerbated, and strategic activity avoidance to prevent symptom aggravation. He relies on a structured medication regime that includes both prescription medications for pain and inflammation management, as well as medications to address sleep disturbance and mood regulation.'
        );

        // Mobility and Positioning
        sections.push(this.formatMobilityStrategies(assessment));

        // Daily Activities
        sections.push(this.formatDailyStrategies(assessment));

        // Professional Support
        sections.push(this.formatProfessionalSupport(assessment));

        // Cognitive Management
        sections.push(this.formatCognitiveStrategies(assessment));

        return sections.filter(Boolean).join('\n\n');
    }

    private formatMobilityStrategies(assessment: any): string {
        return 'For mobility and positioning, Mr. Anderson uses several adaptive strategies. He employs a cane for ambulation support and has modified his seating arrangements, including the use of cushions and positioning aids. In his vehicle, he has adapted by using a folded towel behind his head to manage neck positioning while driving. He is limited to driving periods of 20-30 minutes before requiring rest breaks with position changes.';
    }

    private formatDailyStrategies(assessment: any): string {
        return 'During daily activities, Mr. Anderson implements pacing strategies, particularly evident in his morning routine where he alternates between activity and rest periods. He has adapted his daily schedule to accommodate regular rest periods, typically including a 20-30 minute nap at noon due to fatigue and pain. Following these rest periods, he engages in gentle movement and maintains essential activities such as letting the dog out.';
    }

    private formatProfessionalSupport(assessment: any): string {
        const treatments = assessment.medicalHistory?.currentTreatment || [];
        if (!treatments.length) return '';

        return 'Professional rehabilitation support plays a key role in his symptom management, with regular physiotherapy sessions incorporating both traditional treatment and acupuncture. His physiotherapist has recommended swimming as an additional therapeutic activity, and plans are in place to obtain a YMCA membership to facilitate this intervention.';
    }

    private formatCognitiveStrategies(assessment: any): string {
        if (!assessment.symptoms?.cognitive) return '';

        return 'For cognitive symptom management, Mr. Anderson has developed compensatory strategies such as reviewing information multiple times for better retention, as demonstrated by his approach to watching news cycles 2-3 times to ensure comprehension. He relies significantly on his wife for cognitive support, particularly in decision-making and planning activities.';
    }
}