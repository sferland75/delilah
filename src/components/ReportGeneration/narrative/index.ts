export { NarrativeEngine } from './NarrativeEngine';
export { MedicationAnalyzer } from './MedicationAnalyzer';
export { SymptomAnalyzer } from './SymptomAnalyzer';
export { ADLAnalyzer } from './ADLAnalyzer';
export { TemporalAnalyzer } from './TemporalAnalyzer';

// Export interfaces for use in agents
export interface NarrativeOptions {
    includeContext?: boolean;
    detailLevel: 'brief' | 'standard' | 'detailed';
    format?: 'clinical' | 'plain';
}

export interface NarrativeResult {
    content: string;
    context?: {
        timeframe: string;
        symptoms: any[];
        medications: any[];
        functionalStatus: string;
    };
    patterns?: any[];
}