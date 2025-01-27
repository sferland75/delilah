import { MedicalHistoryAgent } from '../MedicalHistoryAgent';
import { Assessment } from '../../../../types';
import { createTestSuite, runStandardTests, runNarrativeTests, TestSuiteOptions } from '../../testing/setup';
import { mockAssessmentData } from '../../testing/mockData';

describe('MedicalHistoryAgent', () => {
    const testData: Assessment = {
        ...mockAssessmentData,
        assessment: {
            ...mockAssessmentData.assessment,
            medicalHistory: {
                currentTreatment: [
                    {
                        name: 'Dr. Smith',
                        providerType: 'Physical Therapist',
                        frequency: 'Weekly',
                        focus: 'Lower back rehabilitation',
                        progress: 'Improving',
                        startDate: '2025-01-01'
                    },
                    {
                        name: 'Dr. Jones',
                        providerType: 'Pain Management',
                        frequency: 'Monthly',
                        focus: 'Medication management',
                        progress: 'Stable',
                        startDate: '2024-12-15'
                    }
                ],
                medications: [
                    {
                        name: 'Ibuprofen',
                        dosage: '400mg',
                        frequency: 'As needed',
                        purpose: 'Pain management',
                        sideEffects: 'None reported'
                    },
                    {
                        name: 'Cyclobenzaprine',
                        dosage: '10mg',
                        frequency: 'At bedtime',
                        purpose: 'Muscle relaxant',
                        sideEffects: 'Morning drowsiness'
                    }
                ],
                injury: {
                    position: 'Lower back',
                    circumstance: 'Workplace lifting incident',
                    immediateResponse: 'Immediate rest and ice',
                    subsequentCare: 'Started PT within 48 hours',
                    date: '2024-12-10'
                },
                preExisting: 'Mild hypertension, controlled with diet',
                surgeries: 'Appendectomy (2015)',
                allergies: ['Penicillin'],
                treatments: ['Heat therapy', 'TENS unit']
            }
        }
    };

    describe('Standard Mode', () => {
        const { agent, context } = createTestSuite(MedicalHistoryAgent);

        it('processes medical history data correctly', async () => {
            const result = await agent.processData(testData);
            expect(result.valid).toBe(true);
            expect(result.data.currentTreatment).toHaveLength(2);
            expect(result.data.medications).toHaveLength(2);
        });

        it('formats content at different detail levels', async () => {
            const { brief, standard, detailed } = await runStandardTests({ 
                agent, 
                context, 
                testData 
            });

            // Brief format checks
            expect(brief).toContain('Dr. Smith');
            expect(brief).toContain('Ibuprofen');
            expect(brief).not.toContain('Pre-existing Conditions');

            // Standard format checks
            expect(standard).toContain('Physical Therapist');
            expect(standard).toContain('Weekly');
            expect(standard).toContain('400mg');

            // Detailed format checks
            expect(detailed).toContain('Pre-existing Conditions');
            expect(detailed).toContain('Mild hypertension');
            expect(detailed).toContain('Morning drowsiness');
        });

        it('handles missing data gracefully', async () => {
            const minimalData = {
                ...testData,
                assessment: {
                    ...testData.assessment,
                    medicalHistory: {
                        currentTreatment: [],
                        medications: [],
                        injury: null,
                        preExisting: '',
                        surgeries: '',
                        allergies: [],
                        treatments: []
                    }
                }
            };

            const result = await agent.processData(minimalData);
            expect(result.valid).toBe(true);
            
            const section = await agent.generateSection(minimalData);
            expect(section.valid).toBe(true);
            expect(section.content).toContain('No current treatment reported');
        });
    });

    describe('Narrative Mode', () => {
        const narrativeOptions: TestSuiteOptions = {
            features: { enableNarrative: true }
        };

        const { agent, context } = createTestSuite(MedicalHistoryAgent, narrativeOptions);

        it('generates comprehensive treatment narrative', async () => {
            const { section } = await runNarrativeTests({ agent, context, testData });
            const content = section.content as string;
            
            expect(content).toContain('currently receiving treatment from');
            expect(content).toContain('Dr. Smith');
            expect(content).toContain('Physical Therapist');
            expect(content).toContain('Lower back rehabilitation');
            expect(content).toContain('Improving');
        });

        it('includes medication management details', async () => {
            const { section } = await runNarrativeTests({ agent, context, testData });
            const content = section.content as string;

            expect(content).toContain('medication regimen includes');
            expect(content).toContain('Ibuprofen');
            expect(content).toContain('pain management');
            expect(content).toContain('Cyclobenzaprine');
            expect(content).toContain('muscle relaxant');
        });

        it('synthesizes injury history narrative', async () => {
            const { section } = await runNarrativeTests({ agent, context, testData });
            const content = section.content as string;

            expect(content).toContain('sustained a workplace injury');
            expect(content).toContain('lower back');
            expect(content).toContain('immediate care included');
            expect(content).toContain('physical therapy was initiated');
        });

        it('integrates medical background appropriately', async () => {
            const { section } = await runNarrativeTests({ agent, context, testData });
            const content = section.content as string;

            expect(content).toContain('medical history includes');
            expect(content).toContain('hypertension');
            expect(content).toContain('appendectomy');
            expect(content).toContain('allergic to penicillin');
        });

        it('describes treatment progression', async () => {
            const { section } = await runNarrativeTests({ agent, context, testData });
            const content = section.content as string;

            expect(content).toContain('treatment progression');
            expect(content).toMatch(/initially.*subsequently/i);
            expect(content).toContain('current status');
        });
    });

    describe('Edge Cases', () => {
        it('handles incomplete medication information', async () => {
            const incompleteData = {
                ...testData,
                assessment: {
                    ...testData.assessment,
                    medicalHistory: {
                        ...testData.assessment.medicalHistory,
                        medications: [
                            {
                                name: 'Ibuprofen',
                                dosage: '',
                                frequency: '',
                                purpose: ''
                            }
                        ]
                    }
                }
            };

            const { agent } = createTestSuite(MedicalHistoryAgent, {
                features: { enableNarrative: true }
            });

            const section = await agent.generateSection(incompleteData);
            expect(section.valid).toBe(true);
            expect(section.content).toContain('Ibuprofen');
            expect(section.content).not.toContain('undefined');
            expect(section.content).not.toContain('null');
        });

        it('manages conflicting treatment information', async () => {
            const conflictingData = {
                ...testData,
                assessment: {
                    ...testData.assessment,
                    medicalHistory: {
                        ...testData.assessment.medicalHistory,
                        currentTreatment: [
                            {
                                name: 'Dr. Smith',
                                providerType: 'Physical Therapist',
                                frequency: 'Weekly',
                                focus: 'Lower back rehabilitation',
                                progress: 'Worsening'
                            },
                            {
                                name: 'Dr. Jones',
                                providerType: 'Physical Therapist',
                                frequency: 'Weekly',
                                focus: 'Lower back rehabilitation',
                                progress: 'Improving'
                            }
                        ]
                    }
                }
            };

            const { agent } = createTestSuite(MedicalHistoryAgent, {
                features: { enableNarrative: true }
            });

            const section = await agent.generateSection(conflictingData);
            expect(section.valid).toBe(true);
            expect(section.content).toContain('mixed treatment responses');
        });

        it('handles mode switching with complex data', async () => {
            // Standard mode
            const { agent: standardAgent } = createTestSuite(MedicalHistoryAgent);
            const standardSection = await standardAgent.generateSection(testData);
            expect(standardSection.valid).toBe(true);

            // Narrative mode
            const { agent: narrativeAgent } = createTestSuite(MedicalHistoryAgent, {
                features: { enableNarrative: true }
            });
            const narrativeSection = await narrativeAgent.generateSection(testData);
            expect(narrativeSection.valid).toBe(true);

            // Content should differ but both be valid
            expect(narrativeSection.content).not.toBe(standardSection.content);
            expect(typeof narrativeSection.content).toBe('string');
            expect(typeof standardSection.content).toBe('string');
        });
    });
});