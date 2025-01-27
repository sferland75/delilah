import { ReportSection } from '../../../../types/report';

export interface NarrativeExpectations {
    // Text content expectations
    includes?: string[];
    excludes?: string[];
    
    // Pattern expectations
    patterns?: RegExp[];
    
    // Structure expectations
    minimumLength?: number;
    maximumLength?: number;
    
    // Clinical term expectations
    clinicalTerms?: string[];
    
    // Temporal expectations
    temporalPatterns?: RegExp[];
    
    // Relationship expectations
    relationshipTerms?: string[];
}

export const expectNarrativeContent = (
    section: ReportSection, 
    expectations: NarrativeExpectations
) => {
    const content = section.content as string;
    
    // Basic validation
    expect(section.valid).toBe(true);
    expect(typeof content).toBe('string');
    expect(content.length).toBeGreaterThan(0);

    // Text content checks
    if (expectations.includes) {
        expectations.includes.forEach(text => {
            expect(content).toContain(text);
        });
    }

    if (expectations.excludes) {
        expectations.excludes.forEach(text => {
            expect(content).not.toContain(text);
        });
    }

    // Pattern matching
    if (expectations.patterns) {
        expectations.patterns.forEach(pattern => {
            expect(content).toMatch(pattern);
        });
    }

    // Length constraints
    if (expectations.minimumLength) {
        expect(content.length).toBeGreaterThanOrEqual(expectations.minimumLength);
    }

    if (expectations.maximumLength) {
        expect(content.length).toBeLessThanOrEqual(expectations.maximumLength);
    }

    // Clinical terminology
    if (expectations.clinicalTerms) {
        expectations.clinicalTerms.forEach(term => {
            expect(content.toLowerCase()).toContain(term.toLowerCase());
        });
    }

    // Temporal patterns
    if (expectations.temporalPatterns) {
        expectations.temporalPatterns.forEach(pattern => {
            expect(content).toMatch(pattern);
        });
    }

    // Relationship terms
    if (expectations.relationshipTerms) {
        expectations.relationshipTerms.forEach(term => {
            expect(content.toLowerCase()).toContain(term.toLowerCase());
        });
    }

    return content;
};

export const commonNarrativePatterns = {
    temporalProgression: /initially|subsequently|currently|now/i,
    clinicalAssessment: /assessment|evaluation|examination/i,
    treatmentResponse: /response|improvement|progress|change/i,
    functionalStatus: /ability|capable|manages|performs/i,
    supportNeeds: /assistance|support|help|aid/i
};

export const validateClinicalNarrative = (content: string) => {
    // No undefined or null values
    expect(content).not.toContain('undefined');
    expect(content).not.toContain('null');
    
    // No repeated words (common in template errors)
    const repeatedWords = content.match(/\b(\w+)\s+\1\b/g);
    expect(repeatedWords).toBeNull();
    
    // No missing spaces after punctuation
    const missingSpaces = content.match(/[.!?][A-Z]/g);
    expect(missingSpaces).toBeNull();
    
    // Proper sentence case
    const sentences = content.split(/[.!?]\s+/);
    sentences.forEach(sentence => {
        if (sentence.length > 0) {
            expect(sentence[0]).toMatch(/[A-Z]/);
        }
    });
};

export const expectTimeframeContinuity = (content: string) => {
    const timeframes = content.match(/\b(initially|subsequently|currently|now)\b/gi) || [];
    if (timeframes.length > 1) {
        const timeframeOrder = timeframes.join(' ').toLowerCase();
        expect(timeframeOrder).not.toContain('currently initially');
        expect(timeframeOrder).not.toContain('now initially');
    }
};

export const narrativeTestUtils = {
    expectNarrativeContent,
    commonNarrativePatterns,
    validateClinicalNarrative,
    expectTimeframeContinuity
};