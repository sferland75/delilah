import { TransfersAgent } from '../TransfersAgent';
import { createTestSuite, runStandardTests, runNarrativeTests } from '../../testing/setup';
import { AssessmentData } from '../../types';
import { 
    narrativeTestUtils, 
    createNarrativeTestData,
    commonNarrativePatterns 
} from '../../testing/narrative';

const { expectNarrativeContent, validateClinicalNarrative, expectTimeframeContinuity } = narrativeTestUtils;

describe('TransfersAgent', () => {
    const mockTransferData: AssessmentData = {
        ...createNarrativeTestData(),
        functionalAssessment: {
            transfers: {
                bedMobility: 'Modified Independent',
                sitToStand: 'Independent',
                toilet: {
                    assistanceLevel: 'Modified Independent',
                    equipment: ['grab_bars', 'toilet_riser'],
                    modifications: ['Use both grab bars'],
                    safety_concerns: ['Fall risk with night transfers']
                },
                shower: {
                    assistanceLevel: 'Modified Independent',
                    equipment: ['shower_chair', 'grab_bars'],
                    modifications: ['Seated shower only']
                }
            },
            bergBalance: {
                totalScore: 40,
                items: {}
            }
        },
        equipment: {
            current: ['shower_chair']
        }
    };

    describe('Standard Mode', () => {
        const { agent } = createTestSuite(TransfersAgent);

        describe('Data Processing', () => {
            it('extracts transfer locations correctly', async () => {
                const result = await agent.processData(mockTransferData);
                expect(result.valid).toBe(true);
                expect(result.data.transferStatus.locations).toContain('bed');
                expect(result.data.transferStatus.locations).toContain('chair');
                expect(result.data.transferStatus.locations).toContain('toilet');
                expect(result.data.transferStatus.locations).toContain('shower');
            });

            it('identifies required equipment', async () => {
                const result = await agent.processData(mockTransferData);
                expect(result.data.transferStatus.requiredEquipment).toContain('grab_bars');
                expect(result.data.transferStatus.requiredEquipment).toContain('toilet_riser');
                expect(result.data.transferStatus.requiredEquipment).toContain('shower_chair');
            });

            it('analyzes risk factors', async () => {
                const result = await agent.processData(mockTransferData);
                const riskFactors = result.data.riskFactors.join(' ');
                expect(riskFactors).toContain('balance');
                expect(riskFactors).toContain('Fall risk');
            });
        });

        describe('Content Formatting', () => {
            it('formats content at different detail levels', async () => {
                const { brief, standard, detailed } = await runStandardTests({ 
                    agent, 
                    context: createTestSuite(TransfersAgent).context, 
                    testData: mockTransferData 
                });

                // Brief format
                expect(brief).toContain('Transfer Status');
                expect(brief).toContain('Transfer Locations');
                expect(brief).toContain('Risk Factors');

                // Standard format
                expect(standard).toContain('Transfer Assessment');
                expect(standard).toContain('Required Equipment');

                // Detailed format
                expect(detailed).toContain('Transfer Assessment');
                expect(detailed).toContain('Required Equipment');
                expect(detailed).toContain('Risk Factors');
                expect(detailed).toContain('Recommendations');
            });

            it('handles minimal data correctly', async () => {
                const minimalData = {
                    ...mockTransferData,
                    functionalAssessment: {
                        transfers: {
                            bedMobility: 'Independent'
                        }
                    }
                };

                const result = await agent.processData(minimalData);
                const content = await agent.getFormattedContent(result.data, 'standard');
                expect(content).toContain('bed');
                expect(content).not.toContain('undefined');
            });
        });
    });

    describe('Narrative Mode', () => {
        const { agent, context } = createTestSuite(TransfersAgent, {
            features: { enableNarrative: true }
        });

        it('generates comprehensive transfer narrative', async () => {
            const { section } = await runNarrativeTests({ agent, context, testData: mockTransferData });
            
            expectNarrativeContent(section, {
                includes: [
                    'Modified Independent',
                    'grab bars',
                    'shower chair',
                    'toilet riser'
                ],
                patterns: [
                    commonNarrativePatterns.functionalStatus,
                    /transfer.*ability/i,
                    /safety.*concerns/i
                ],
                clinicalTerms: [
                    'transfers',
                    'mobility',
                    'assistance level',
                    'modifications'
                ]
            });

            validateClinicalNarrative(section.content as string);
        });

        it('describes transfer abilities and patterns', async () => {
            const { section } = await runNarrativeTests({ agent, context, testData: mockTransferData });
            
            expectNarrativeContent(section, {
                includes: [
                    'bed mobility',
                    'sit to stand',
                    'toilet transfers',
                    'shower transfers'
                ],
                relationshipTerms: [
                    'requires',
                    'uses',
                    'manages',
                    'performs'
                ]
            });
        });

        it('integrates safety considerations', async () => {
            const { section } = await runNarrativeTests({ agent, context, testData: mockTransferData });
            
            expectNarrativeContent(section, {
                includes: [
                    'fall risk',
                    'night transfers',
                    'safety concerns'
                ],
                patterns: [
                    /safety.*measures/i,
                    /risk.*factors/i
                ]
            });
        });

        it('describes equipment usage patterns', async () => {
            const { section } = await runNarrativeTests({ agent, context, testData: mockTransferData });
            
            expectNarrativeContent(section, {
                includes: [
                    'grab bars',
                    'shower chair',
                    'toilet riser'
                ],
                patterns: [
                    /uses.*equipment/i,
                    /modified.*with/i
                ]
            });

            expectTimeframeContinuity(section.content as string);
        });

        it('provides contextual recommendations', async () => {
            const { section } = await runNarrativeTests({ agent, context, testData: mockTransferData });
            
            expectNarrativeContent(section, {
                patterns: [
                    /recommend/i,
                    /suggest/i,
                    /consider/i
                ],
                minimumLength: 100
            });
        });
    });

    describe('Edge Cases', () => {
        it('handles missing equipment data', async () => {
            const dataWithoutEquipment = {
                ...mockTransferData,
                equipment: { current: [] },
                functionalAssessment: {
                    ...mockTransferData.functionalAssessment,
                    transfers: {
                        ...mockTransferData.functionalAssessment.transfers,
                        toilet: {
                            ...mockTransferData.functionalAssessment.transfers.toilet,
                            equipment: []
                        },
                        shower: {
                            ...mockTransferData.functionalAssessment.transfers.shower,
                            equipment: []
                        }
                    }
                }
            };

            const { agent } = createTestSuite(TransfersAgent, {
                features: { enableNarrative: true }
            });

            const section = await agent.generateSection(dataWithoutEquipment);
            expect(section.content).not.toContain('undefined');
            expect(section.content).not.toContain('null');
            expect(section.content).toContain('transfer');
        });

        it('gracefully handles conflicting assistance levels', async () => {
            const conflictingData = {
                ...mockTransferData,
                functionalAssessment: {
                    ...mockTransferData.functionalAssessment,
                    transfers: {
                        ...mockTransferData.functionalAssessment.transfers,
                        bedMobility: 'Independent',
                        sitToStand: 'Maximum Assistance'
                    }
                }
            };

            const { agent } = createTestSuite(TransfersAgent, {
                features: { enableNarrative: true }
            });

            const section = await agent.generateSection(conflictingData);
            const content = section.content as string;
            
            expect(content).toMatch(/varies.*depending/i);
            validateClinicalNarrative(content);
        });
    });
});