import { TestAgent } from '../../testing/TestableAgent';
import { AgentContext, Assessment } from '../../../../types/report';
import { createMockContext } from '../../testing/mockContext';
import { mockAssessmentData } from '../../testing/mockData';

describe('BaseAgent', () => {
    describe('Standard Mode', () => {
        let agent: TestAgent;
        const context = createMockContext();

        beforeEach(() => {
            agent = new TestAgent(context);
        });

        it('initializes with correct parameters', () => {
            const metadata = agent.getMetadata();
            expect(metadata.name).toBe('Test Section');
            expect(metadata.priority).toBe(1);
        });

        it('processes data correctly', async () => {
            const result = await agent.processData({
                raw: mockAssessmentData
            });
            expect(result.valid).toBe(true);
            expect(result.data).toBeDefined();
        });

        it('generates sections with correct structure', async () => {
            const section = await agent.generateSection({
                raw: mockAssessmentData
            });
            expect(section.sectionName).toBe('Test Section');
            expect(section.content).toBeDefined();
            expect(section.orderNumber).toBe(1);
            expect(section.valid).toBe(true);
        });

        it('formats content correctly for different detail levels', async () => {
            const brief = await agent.testGetFormattedContent({ test: 'data' }, 'brief');
            const standard = await agent.testGetFormattedContent({ test: 'data' }, 'standard');
            const detailed = await agent.testGetFormattedContent({ test: 'data' }, 'detailed');

            expect(brief).toContain('Brief:');
            expect(standard).toContain('Standard:');
            expect(detailed).toContain('Detailed:');
        });

        it('validates data correctly', async () => {
            const result = await agent.processData({
                raw: mockAssessmentData
            });
            expect(result.valid).toBe(true);
        });

        it('handles missing data gracefully', async () => {
            const result = await agent.processData({
                raw: {}
            });
            expect(result.valid).toBe(true);
            expect(result.data).toBeDefined();
        });

        it('generates appropriate error messages', async () => {
            const invalidData = {
                raw: null
            } as any;

            const section = await agent.generateSection(invalidData);
            expect(section.valid).toBe(false);
            expect(section.content).toBeDefined();
            expect(typeof section.content).toBe('string');
        });

        it('handles constructor errors gracefully', () => {
            const invalidContext = {} as AgentContext;
            expect(() => new TestAgent(invalidContext)).not.toThrow();
        });

        it('handles processData errors gracefully', async () => {
            const errorAgent = new TestAgent(context);
            jest.spyOn(errorAgent as any, 'processData').mockImplementation(() => {
                throw new Error('Process error');
            });

            const section = await errorAgent.generateSection({
                raw: mockAssessmentData
            });
            expect(section.valid).toBe(false);
            expect(section.content).toContain('Standard:');
            expect(section.errors).toBeDefined();
            expect(section.errors?.[0]).toContain('Process error');
        });

        it('handles formatContent errors gracefully', async () => {
            const errorAgent = new TestAgent(context);
            jest.spyOn(errorAgent as any, 'formatStandard').mockImplementation(() => {
                throw new Error('Format error');
            });

            const result = await errorAgent.generateSection({
                raw: mockAssessmentData
            });
            expect(result.content).toContain('Standard:');
            expect(result.content).toContain('Error');
        });

        it('handles invalid detail levels gracefully', async () => {
            const result = await agent.testGetFormattedContent(
                { test: 'data' },
                'invalid' as any
            );
            expect(result).toContain('Standard:');
        });
    });

    describe('Narrative Mode', () => {
        const narrativeContext = createMockContext({
            features: { enableNarrative: true }
        });

        it('initializes with narrative engine when enabled', () => {
            const agent = new TestAgent(narrativeContext);
            expect(agent.hasNarrativeEngine()).toBe(true);
        });

        it('generates narrative content when enabled', async () => {
            const agent = new TestAgent(narrativeContext);
            const section = await agent.generateSection({
                raw: mockAssessmentData
            });
            expect(section.valid).toBe(true);
            expect(section.content).toBeDefined();
            expect(typeof section.content).toBe('string');
        });

        it('falls back to standard formatting if narrative generation fails', async () => {
            const agent = new TestAgent(narrativeContext);
            const invalidData = {
                raw: null
            } as any;
            
            const section = await agent.generateSection(invalidData);
            expect(section.content).toBeDefined();
            expect(typeof section.content).toBe('string');
            expect(section.content).toContain('Standard:');
        });

        it('includes context in narrative when contextual analysis is enabled', async () => {
            const contextualAgent = new TestAgent(createMockContext({
                features: {
                    enableNarrative: true,
                    enableContextualAnalysis: true
                }
            }));

            const section = await contextualAgent.generateSection({
                raw: mockAssessmentData
            });
            expect(section.content).toBeDefined();
        });

        it('handles narrative engine initialization errors', () => {
            const errorContext = {
                ...narrativeContext,
                features: null
            };
            const agent = new TestAgent(errorContext);
            expect(agent.hasNarrativeEngine()).toBe(false);
        });

        it('handles narrative generation errors gracefully', async () => {
            const agent = new TestAgent(narrativeContext);
            jest.spyOn(agent as any, 'generateNarrativeContent').mockRejectedValue(new Error('Narrative error'));

            const section = await agent.generateSection({
                raw: mockAssessmentData
            });
            expect(section.content).toContain('Standard:');
        });

        it('handles missing narrative engine gracefully', async () => {
            const agent = new TestAgent(narrativeContext);
            (agent as any).narrativeEngine = null;

            const section = await agent.generateSection({
                raw: mockAssessmentData
            });
            expect(section.content).toContain('Standard:');
        });
    });

    describe('Error Boundaries', () => {
        it('recovers from catastrophic errors', async () => {
            const agent = new TestAgent(createMockContext());
            
            // Create a failing version of processData
            jest.spyOn(agent as any, 'processData').mockImplementation(() => {
                throw new Error('Catastrophic failure');
            });

            const section = await agent.generateSection({
                raw: mockAssessmentData
            });

            expect(section.valid).toBe(false);
            expect(section.content).toContain('Standard:');
            expect(section.content).toContain('Catastrophic failure');
        });

        it('handles null context values', () => {
            const nullContext = {
                ...createMockContext(),
                config: null,
                logger: null
            } as any;

            const agent = new TestAgent(nullContext);
            expect(agent).toBeDefined();
        });

        it('handles corrupted process data', async () => {
            const agent = new TestAgent(createMockContext());
            const corruptedData = {
                raw: {
                    ...mockAssessmentData,
                    [Symbol('corrupt')]: () => { throw new Error('Corrupted'); }
                }
            };

            const section = await agent.generateSection(corruptedData as any);
            expect(section.valid).toBe(true);
            expect(section.content).toBeDefined();
        });
    });
});