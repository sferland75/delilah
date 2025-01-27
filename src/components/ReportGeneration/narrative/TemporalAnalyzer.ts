interface TimelineEvent {
    type: string;
    timestamp: Date;
    description: string;
    significance: string;
}

interface TemporalPattern {
    duration: string;
    progression: string;
    keyEvents: TimelineEvent[];
    clinicalContext: string;
}

export class TemporalAnalyzer {
    static analyzeTimeline(data: any): TemporalPattern {
        const events = this.extractTimelineEvents(data);
        const duration = this.calculateDuration(events);
        const progression = this.analyzeProgression(events);

        return {
            duration,
            progression,
            keyEvents: this.identifyKeyEvents(events),
            clinicalContext: this.generateClinicalContext(duration, progression, events)
        };
    }

    private static extractTimelineEvents(data: any): TimelineEvent[] {
        const events: TimelineEvent[] = [];

        // Extract injury event if present
        if (data.injury) {
            events.push({
                type: 'injury',
                timestamp: this.approximateTimestamp(data.injury.circumstance),
                description: data.injury.circumstance,
                significance: 'Initial injury event'
            });
        }

        // Extract treatment events
        if (data.currentTreatment) {
            data.currentTreatment.forEach((treatment: any) => {
                if (treatment.startDate) {
                    events.push({
                        type: 'treatment',
                        timestamp: new Date(treatment.startDate),
                        description: `Started ${treatment.providerType} with ${treatment.name}`,
                        significance: treatment.progress || 'Treatment initiation'
                    });
                }
            });
        }

        return events.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    }

    private static approximateTimestamp(description: string): Date {
        // This would be enhanced with natural language processing
        // For now, return current date as placeholder
        return new Date();
    }

    private static calculateDuration(events: TimelineEvent[]): string {
        if (events.length === 0) return 'Duration unclear';

        const firstEvent = events[0].timestamp;
        const now = new Date();
        const months = this.monthsDifference(firstEvent, now);

        if (months < 1) {
            return 'Acute presentation (less than 1 month)';
        } else if (months < 3) {
            return 'Sub-acute presentation (1-3 months)';
        } else if (months < 6) {
            return 'Early chronic presentation (3-6 months)';
        } else {
            return `Chronic presentation (${Math.floor(months)} months)`;
        }
    }

    private static monthsDifference(start: Date, end: Date): number {
        return (end.getFullYear() - start.getFullYear()) * 12 +
               (end.getMonth() - start.getMonth());
    }

    private static analyzeProgression(events: TimelineEvent[]): string {
        if (events.length < 2) return 'Insufficient data for progression analysis';

        // Analyze treatment events for progress indicators
        const treatmentEvents = events.filter(e => e.type === 'treatment');
        const progressTerms = treatmentEvents.map(e => e.significance.toLowerCase());

        if (progressTerms.some(p => p.includes('improving') || p.includes('progress'))) {
            return 'Shows improvement with intervention';
        } else if (progressTerms.some(p => p.includes('plateau') || p.includes('stable'))) {
            return 'Stable presentation';
        } else if (progressTerms.some(p => p.includes('decline') || p.includes('worsen'))) {
            return 'Declining function noted';
        }

        return 'Variable progression';
    }

    private static identifyKeyEvents(events: TimelineEvent[]): TimelineEvent[] {
        // Identify most significant events based on type and description
        return events.filter(event => 
            event.type === 'injury' || 
            event.significance.toLowerCase().includes('significant') ||
            event.significance.toLowerCase().includes('major')
        );
    }

    private static generateClinicalContext(
        duration: string,
        progression: string,
        events: TimelineEvent[]
    ): string {
        const contextParts = [
            `This represents a ${duration.toLowerCase()}.`,
            progression
        ];

        if (events.length > 0) {
            const keyEvents = events.filter(e => e.type === 'injury' || e.type === 'major');
            if (keyEvents.length > 0) {
                contextParts.push('Key events include: ' + 
                    keyEvents.map(e => e.description).join('; '));
            }
        }

        return contextParts.join(' ');
    }
}