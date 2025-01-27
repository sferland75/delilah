import { ReactNode } from 'react';
import { FeatureFlags, DEFAULT_FEATURES } from './features';

// Core Assessment Types
export interface Assessment {
    id?: string;
    date?: string;
    demographics: DemographicsData;
    adl: ADLData;
    symptoms: SymptomsData;
    environmental: EnvironmentalData;
    medicalHistory: MedicalHistoryData;
    functionalAssessment: FunctionalAssessmentData;
    documentation: DocumentationData;
    typicalDay: TypicalDayData;
    amaGuides: AMAGuidesData;
}

// Report Generation Types
export interface AssessmentData {
    raw: Assessment;
    processed?: any;
    metadata?: {
        version: string;
        exportDate: string;
        lastModified: string;
        exportType: string;
    };
}

export interface AgentConfig {
    detailLevel: 'brief' | 'standard' | 'detailed';
    validateData: boolean;
    formatPreference: 'text' | 'markdown' | 'html' | 'clinical' | 'plain';
    includeMetrics: boolean;
}

export interface AgentContext {
    logger: {
        log: (message: string) => void;
        error: (message: string) => void;
        warn: (message: string) => void;
        info: (message: string) => void;
    };
    config: AgentConfig;
    features: FeatureFlags;
}

export const createDefaultContext = (overrides?: Partial<AgentContext>): AgentContext => ({
    logger: console,
    config: {
        detailLevel: 'standard',
        validateData: true,
        formatPreference: 'clinical',
        includeMetrics: false,
        ...(overrides?.config || {})
    },
    features: {
        ...DEFAULT_FEATURES,
        ...(overrides?.features || {})
    }
});

export interface ValidationResult {
    valid: boolean;
    errors: string[];
}

export interface ProcessedData {
    valid: boolean;
    data: any;
    errors?: string[];
}

export interface ReportSection {
    sectionName: string;
    orderNumber: number;
    title: string;
    content: string | ReactNode;
    valid: boolean;
    errors?: string[];
    type?: string;
}

export interface NarrativeGenerationOptions {
    detailLevel: 'brief' | 'standard' | 'detailed';
    includeContext?: boolean;
    includeRecommendations?: boolean;
    format?: 'text' | 'markdown' | 'html';
}

// Re-export feature flags
export { FeatureFlags, DEFAULT_FEATURES };