interface MedicationPattern {
    category: string;
    medications: any[];
    clinicalSignificance: string;
    implications: string[];
}

export class MedicationAnalyzer {
    private static MEDICATION_CATEGORIES = new Map([
        ['pain_management', {
            keywords: ['ibuprofen', 'meloxicam', 'nabilone'],
            description: 'pain management'
        }],
        ['gastric', {
            keywords: ['esomeprazole', 'pantoprazole'],
            description: 'gastric acid management'
        }],
        ['cardiovascular', {
            keywords: ['perindopril', 'rosuvastatin'],
            description: 'cardiovascular health'
        }],
        ['metabolic', {
            keywords: ['metformin'],
            description: 'metabolic regulation'
        }],
        ['urologic', {
            keywords: ['silodocin'],
            description: 'urologic symptoms'
        }],
        ['sleep_mood', {
            keywords: ['trazodone'],
            description: 'sleep and mood regulation'
        }]
    ]);

    static analyzeMedications(medications: any[]): MedicationPattern[] {
        const patterns: MedicationPattern[] = [];
        const categorizedMeds = this.categorizeMedications(medications);

        // Analyze each category
        for (const [category, meds] of categorizedMeds.entries()) {
            const pattern = this.analyzeCategory(category, meds);
            if (pattern) {
                patterns.push(pattern);
            }
        }

        return patterns;
    }

    private static categorizeMedications(medications: any[]): Map<string, any[]> {
        const categorized = new Map<string, any[]>();

        medications.forEach(med => {
            const category = this.determineMedicationCategory(med.name.toLowerCase());
            if (!categorized.has(category)) {
                categorized.set(category, []);
            }
            categorized.get(category)?.push(med);
        });

        return categorized;
    }

    private static determineMedicationCategory(medName: string): string {
        for (const [category, info] of this.MEDICATION_CATEGORIES.entries()) {
            if (info.keywords.some(keyword => medName.includes(keyword))) {
                return category;
            }
        }
        return 'other';
    }

    private static analyzeCategory(category: string, medications: any[]): MedicationPattern | null {
        const categoryInfo = this.MEDICATION_CATEGORIES.get(category);
        if (!categoryInfo) return null;

        const implications: string[] = [];
        let clinicalSignificance = '';

        switch(category) {
            case 'pain_management':
                clinicalSignificance = this.analyzePainMedications(medications, implications);
                break;
            case 'gastric':
                clinicalSignificance = this.analyzeGastricMedications(medications, implications);
                break;
            case 'cardiovascular':
                clinicalSignificance = this.analyzeCardiovascularMedications(medications, implications);
                break;
            // Add more specific analyses as needed
        }

        return {
            category,
            medications,
            clinicalSignificance,
            implications
        };
    }

    private static analyzePainMedications(medications: any[], implications: string[]): string {
        const hasNSAIDs = medications.some(med => 
            ['meloxicam', 'ibuprofen'].some(name => 
                med.name.toLowerCase().includes(name)
            )
        );
        const hasNabilone = medications.some(med => 
            med.name.toLowerCase().includes('nabilone')
        );

        implications.push('Pain levels should be monitored during functional activities');
        
        if (hasNSAIDs && hasNabilone) {
            implications.push('Multi-modal pain management suggests significant chronic pain impact');
            return 'Complex pain management regime indicating chronic pain requiring both inflammatory and neuropathic pain control';
        } else if (hasNSAIDs) {
            implications.push('Anti-inflammatory medications may help manage activity-related pain');
            return 'Inflammatory pain management suggesting activity-related discomfort';
        }

        return 'Basic pain management approach';
    }

    private static analyzeGastricMedications(medications: any[], implications: string[]): string {
        const highDose = medications.some(med => {
            const dosage = parseInt(med.dosage);
            return !isNaN(dosage) && dosage >= 40;
        });

        implications.push('Consider timing of meals and position during ADLs');
        
        if (highDose) {
            implications.push('High-dose acid suppression may indicate need for dietary modifications');
            return 'Significant gastric symptom management required';
        }

        return 'Routine gastric symptom management';
    }

    private static analyzeCardiovascularMedications(medications: any[], implications: string[]): string {
        const hasMultipleAgents = medications.length > 1;

        implications.push('Monitor exertion levels during activities');
        
        if (hasMultipleAgents) {
            implications.push('Multiple cardiovascular medications suggest need for activity pacing');
            return 'Complex cardiovascular management indicating multiple risk factors';
        }

        return 'Routine cardiovascular health management';
    }
}