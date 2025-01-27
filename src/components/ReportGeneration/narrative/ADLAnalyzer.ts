import { IndependenceLevel } from '../../../types';

interface ADLPattern {
    category: string;
    activities: any[];
    independenceLevel: string;
    limitations: string[];
    compensations: string[];
    clinicalContext: string;
}

interface FunctionalDomain {
    name: string;
    activities: string[];
    relatedSymptoms?: string[];
    impactLevel: 'high' | 'moderate' | 'low';
}

export class ADLAnalyzer {
    private static FUNCTIONAL_DOMAINS: FunctionalDomain[] = [
        {
            name: 'mobility',
            activities: ['bed_transfer', 'toilet_transfer', 'shower_transfer', 'position_changes'],
            impactLevel: 'high'
        },
        {
            name: 'self_care',
            activities: ['shower', 'grooming', 'oral_care', 'toileting', 'upper_body', 'lower_body'],
            impactLevel: 'high'
        },
        {
            name: 'home_management',
            activities: ['cleaning', 'laundry', 'meal_prep', 'home_maintenance'],
            impactLevel: 'moderate'
        },
        {
            name: 'community_integration',
            activities: ['transportation', 'shopping', 'money_management', 'communication'],
            impactLevel: 'moderate'
        }
    ];

    static analyzeADLPerformance(adlData: any, symptoms?: any[]): ADLPattern[] {
        const patterns: ADLPattern[] = [];

        // Analyze each functional domain
        this.FUNCTIONAL_DOMAINS.forEach(domain => {
            const domainActivities = this.extractDomainActivities(adlData, domain);
            if (domainActivities.length > 0) {
                const pattern = this.analyzeDomainPattern(domain, domainActivities, symptoms);
                patterns.push(pattern);
            }
        });

        return this.correlatePatterns(patterns);
    }

    private static extractDomainActivities(adlData: any, domain: FunctionalDomain): any[] {
        const activities: any[] = [];

        // Search through ADL data structure for matching activities
        Object.entries(adlData).forEach(([category, categoryData]: [string, any]) => {
            Object.entries(categoryData).forEach(([subcategory, subcategoryData]: [string, any]) => {
                Object.entries(subcategoryData).forEach(([activity, data]: [string, any]) => {
                    if (domain.activities.includes(activity)) {
                        activities.push({
                            name: activity,
                            ...data
                        });
                    }
                });
            });
        });

        return activities;
    }

    private static analyzeDomainPattern(
        domain: FunctionalDomain,
        activities: any[],
        symptoms?: any[]
    ): ADLPattern {
        const independenceLevels = activities.map(a => this.normalizeIndependenceLevel(a.independence));
        const overallIndependence = this.determineOverallIndependence(independenceLevels);
        
        const limitations = this.identifyLimitations(activities, domain);
        const compensations = this.identifyCompensations(activities);
        
        return {
            category: domain.name,
            activities,
            independenceLevel: overallIndependence,
            limitations,
            compensations,
            clinicalContext: this.generateClinicalContext(domain, activities, symptoms)
        };
    }

    private static normalizeIndependenceLevel(level: IndependenceLevel): string {
        if (!level) return 'not_assessed';
        return level.toLowerCase();
    }

    private static determineOverallIndependence(levels: string[]): string {
        const levelScores = levels.map(level => this.getIndependenceScore(level));
        const averageScore = levelScores.reduce((a, b) => a + b, 0) / levelScores.length;

        if (averageScore >= 4) return 'Independent with most activities';
        if (averageScore >= 3) return 'Modified independence';
        if (averageScore >= 2) return 'Requires assistance with most activities';
        return 'Dependent for most activities';
    }

    private static getIndependenceScore(level: string): number {
        const scores: { [key: string]: number } = {
            'independent': 5,
            'modified_independent': 4,
            'supervision': 3,
            'minimal_assistance': 2,
            'moderate_assistance': 1,
            'maximal_assistance': 0,
            'total_assistance': 0,
            'not_applicable': 0,
            'not_assessed': 0
        };
        return scores[level] || 0;
    }

    private static identifyLimitations(activities: any[], domain: FunctionalDomain): string[] {
        const limitations: string[] = [];

        activities.forEach(activity => {
            if (activity.independence !== 'independent') {
                limitations.push(this.generateLimitationDescription(activity, domain));
            }
        });

        return limitations;
    }

    private static generateLimitationDescription(activity: any, domain: FunctionalDomain): string {
        const activityName = activity.name.replace(/_/g, ' ');
        const level = this.normalizeIndependenceLevel(activity.independence);

        switch (level) {
            case 'modified_independent':
                return `Requires additional time/effort for ${activityName}`;
            case 'supervision':
                return `Needs supervision for safety during ${activityName}`;
            case 'minimal_assistance':
                return `Requires minimal physical assist with ${activityName}`;
            case 'moderate_assistance':
                return `Needs moderate assistance to complete ${activityName}`;
            case 'maximal_assistance':
            case 'total_assistance':
                return `Dependent for ${activityName}`;
            default:
                return `Limitation noted with ${activityName}`;
        }
    }

    private static identifyCompensations(activities: any[]): string[] {
        const compensations: string[] = [];

        activities.forEach(activity => {
            if (activity.notes) {
                const notes = activity.notes.toLowerCase();
                if (notes.includes('uses') || notes.includes('requires') || notes.includes('needs')) {
                    compensations.push(activity.notes);
                }
            }
        });

        return compensations;
    }

    private static generateClinicalContext(
        domain: FunctionalDomain,
        activities: any[],
        symptoms?: any[]
    ): string {
        const contextParts: string[] = [];

        // Overall domain status
        const independentCount = activities.filter(a => 
            this.normalizeIndependenceLevel(a.independence).includes('independent')
        ).length;
        const totalActivities = activities.length;
        const independenceRatio = independentCount / totalActivities;

        if (independenceRatio >= 0.8) {
            contextParts.push(`Maintains high level of independence in ${domain.name.replace(/_/g, ' ')} activities`);
        } else if (independenceRatio >= 0.5) {
            contextParts.push(`Moderate independence in ${domain.name.replace(/_/g, ' ')} activities with some limitations`);
        } else {
            contextParts.push(`Significant assistance required for ${domain.name.replace(/_/g, ' ')} activities`);
        }

        // Symptom impact if available
        if (symptoms && symptoms.length > 0) {
            const relatedSymptoms = this.findRelatedSymptoms(domain, symptoms);
            if (relatedSymptoms.length > 0) {
                contextParts.push(this.generateSymptomImpact(relatedSymptoms));
            }
        }

        return contextParts.join('. ');
    }

    private static findRelatedSymptoms(domain: FunctionalDomain, symptoms: any[]): any[] {
        // This would be enhanced with more sophisticated matching
        return symptoms.filter(symptom => 
            domain.relatedSymptoms?.includes(symptom.location.toLowerCase())
        );
    }

    private static generateSymptomImpact(symptoms: any[]): string {
        const severityCount = symptoms.reduce((acc: {[key: string]: number}, symptom) => {
            const severity = symptom.severity.toLowerCase();
            acc[severity] = (acc[severity] || 0) + 1;
            return acc;
        }, {});

        if (severityCount['severe'] > 0 || severityCount['very severe'] > 0) {
            return 'Performance significantly impacted by symptom severity';
        }
        if (severityCount['moderate'] > 0) {
            return 'Moderate symptom impact on functional performance';
        }
        return 'Minimal symptom impact on performance';
    }

    private static correlatePatterns(patterns: ADLPattern[]): ADLPattern[] {
        // Look for relationships between different functional domains
        if (patterns.length > 1) {
            const mobilityPattern = patterns.find(p => p.category === 'mobility');
            if (mobilityPattern) {
                patterns.forEach(pattern => {
                    if (pattern.category !== 'mobility') {
                        pattern.clinicalContext += this.analyzeRelatedMobility(pattern, mobilityPattern);
                    }
                });
            }
        }
        return patterns;
    }

    private static analyzeRelatedMobility(
        pattern: ADLPattern,
        mobilityPattern: ADLPattern
    ): string {
        if (mobilityPattern.limitations.length > 0) {
            return ` Mobility limitations impact performance of these activities.`;
        }
        return '';
    }
}