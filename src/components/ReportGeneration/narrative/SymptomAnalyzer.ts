interface SymptomPattern {
    region: string;
    symptoms: any[];
    primaryCharacteristics: string[];
    temporalPattern: string;
    functionalImpact: string[];
    aggravatingFactors: string[];
    relievingFactors: string[];
    clinicalSignificance: string;
}

export class SymptomAnalyzer {
    private static BODY_REGIONS = new Map([
        ['spine', {
            keywords: ['neck', 'cervical', 'thoracic', 'lumbar', 'back'],
            description: 'spinal symptoms'
        }],
        ['upper_extremity', {
            keywords: ['shoulder', 'arm', 'elbow', 'wrist', 'hand', 'finger', 'thumb'],
            description: 'upper extremity symptoms'
        }],
        ['lower_extremity', {
            keywords: ['hip', 'leg', 'knee', 'ankle', 'foot', 'toe'],
            description: 'lower extremity symptoms'
        }],
        ['head', {
            keywords: ['head', 'facial', 'jaw', 'cranial'],
            description: 'head and facial symptoms'
        }]
    ]);

    static analyzeSymptoms(symptoms: any[]): SymptomPattern[] {
        const patterns: SymptomPattern[] = [];
        const groupedSymptoms = this.groupSymptomsByRegion(symptoms);

        for (const [region, regionSymptoms] of groupedSymptoms.entries()) {
            const pattern = this.analyzeRegionPattern(region, regionSymptoms);
            if (pattern) {
                patterns.push(pattern);
            }
        }

        return this.correlatePatterns(patterns);
    }

    private static groupSymptomsByRegion(symptoms: any[]): Map<string, any[]> {
        const grouped = new Map<string, any[]>();

        symptoms.forEach(symptom => {
            const region = this.determineBodyRegion(symptom.location.toLowerCase());
            if (!grouped.has(region)) {
                grouped.set(region, []);
            }
            grouped.get(region)?.push(symptom);
        });

        return grouped;
    }

    private static determineBodyRegion(location: string): string {
        for (const [region, info] of this.BODY_REGIONS.entries()) {
            if (info.keywords.some(keyword => location.includes(keyword))) {
                return region;
            }
        }
        return 'other';
    }

    private static analyzeRegionPattern(region: string, symptoms: any[]): SymptomPattern {
        const characteristics = this.analyzeCharacteristics(symptoms);
        const temporal = this.analyzeTemporalPattern(symptoms);
        const impact = this.analyzeFunctionalImpact(region, symptoms);
        const modifying = this.analyzeModifyingFactors(symptoms);

        return {
            region,
            symptoms,
            primaryCharacteristics: characteristics,
            temporalPattern: temporal,
            functionalImpact: impact,
            aggravatingFactors: modifying.aggravating,
            relievingFactors: modifying.relieving,
            clinicalSignificance: this.determineClinicalSignificance(region, symptoms, characteristics)
        };
    }

    private static analyzeCharacteristics(symptoms: any[]): string[] {
        const characteristics: string[] = [];
        
        // Analyze pain types
        const painTypes = new Set(symptoms.map(s => s.painType.toLowerCase()));
        if (painTypes.has('sharp') || painTypes.has('stabbing')) {
            characteristics.push('acute/sharp nature');
        }
        if (painTypes.has('aching') || painTypes.has('dull')) {
            characteristics.push('chronic/persistent nature');
        }

        // Analyze severity patterns
        const severities = symptoms.map(s => s.severity.toLowerCase());
        if (severities.some(s => s.includes('severe'))) {
            characteristics.push('high intensity');
        }

        return characteristics;
    }

    private static analyzeTemporalPattern(symptoms: any[]): string {
        const frequencies = symptoms.map(s => s.frequency.toLowerCase());
        
        if (frequencies.some(f => f.includes('constant') || f.includes('most of the time'))) {
            return 'persistent presentation';
        }
        if (frequencies.some(f => f.includes('often'))) {
            return 'frequent recurrence';
        }
        if (frequencies.every(f => f.includes('rarely'))) {
            return 'occasional presentation';
        }

        return 'variable presentation';
    }

    private static analyzeFunctionalImpact(region: string, symptoms: any[]): string[] {
        const impacts: string[] = [];
        const severityPresent = symptoms.some(s => 
            s.severity.toLowerCase().includes('severe') || 
            s.severity.toLowerCase().includes('moderate')
        );

        switch(region) {
            case 'spine':
                impacts.push('May affect posture and core stability');
                if (severityPresent) {
                    impacts.push('Likely impacts lifting and carrying activities');
                }
                break;
            case 'upper_extremity':
                impacts.push('May affect reaching and handling activities');
                if (severityPresent) {
                    impacts.push('Likely impacts fine motor tasks and strength activities');
                }
                break;
            case 'lower_extremity':
                impacts.push('May affect mobility and transfers');
                if (severityPresent) {
                    impacts.push('Likely impacts weight-bearing activities and endurance');
                }
                break;
        }

        return impacts;
    }

    private static analyzeModifyingFactors(symptoms: any[]): {
        aggravating: string[];
        relieving: string[];
    } {
        const aggravating = new Set<string>();
        const relieving = new Set<string>();

        symptoms.forEach(symptom => {
            if (symptom.aggravating) {
                aggravating.add(symptom.aggravating.toLowerCase());
            }
            if (symptom.relieving) {
                relieving.add(symptom.relieving.toLowerCase());
            }
        });

        return {
            aggravating: Array.from(aggravating),
            relieving: Array.from(relieving)
        };
    }

    private static determineClinicalSignificance(
        region: string, 
        symptoms: any[], 
        characteristics: string[]
    ): string {
        const severity = Math.max(...symptoms.map(s => this.severityToNumber(s.severity)));
        const frequency = this.calculateFrequencyScore(symptoms);
        const impact = severity * frequency;

        if (impact > 7) {
            return `Significant ${region.replace('_', ' ')} involvement with major functional implications`;
        } else if (impact > 4) {
            return `Moderate ${region.replace('_', ' ')} involvement affecting daily activities`;
        } else {
            return `Mild ${region.replace('_', ' ')} involvement with minimal functional impact`;
        }
    }

    private static severityToNumber(severity: string): number {
        const severityMap: { [key: string]: number } = {
            'none': 0,
            'mild': 2,
            'moderate': 5,
            'severe': 8,
            'very severe': 10
        };
        return severityMap[severity.toLowerCase()] || 0;
    }

    private static calculateFrequencyScore(symptoms: any[]): number {
        const frequencyMap: { [key: string]: number } = {
            'rarely': 0.4,
            'sometimes': 0.6,
            'often': 0.8,
            'most of the time': 1,
            'constant': 1
        };

        const frequencies = symptoms.map(s => 
            frequencyMap[s.frequency.toLowerCase()] || 0.5
        );
        return Math.max(...frequencies);
    }

    private static correlatePatterns(patterns: SymptomPattern[]): SymptomPattern[] {
        // Look for relationships between different body regions
        if (patterns.length > 1) {
            patterns.forEach(pattern => {
                const related = patterns.filter(p => p.region !== pattern.region);
                if (related.length > 0) {
                    pattern.clinicalSignificance += this.analyzeRelatedPatterns(pattern, related);
                }
            });
        }
        return patterns;
    }

    private static analyzeRelatedPatterns(
        primary: SymptomPattern, 
        related: SymptomPattern[]
    ): string {
        const relatedRegions = related.map(p => p.region.replace('_', ' ')).join(' and ');
        return `, with possible relationship to ${relatedRegions} symptoms`;
    }
}