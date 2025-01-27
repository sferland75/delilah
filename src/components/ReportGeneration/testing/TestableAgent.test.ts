import { TestAgent } from './TestableAgent';
import { createMockContext } from './mockContext';
import { mockAssessmentData } from './mockData';

describe('TestAgent', () => {
    describe('Core Functionality', () => {
        const context = createMockContext();
        const agent = new TestAgent(context);

        it('initializes with correct metadata', () => {
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
        });
    });

    describe('Narrative Mode', () => {
        const narrativeContext = createMockContext({
            features: { enableNarrative: true }
        });
        const agent = new TestAgent(narrativeContext);

        it('detects narrative mode correctly', () => {
            expect(agent.hasNarrativeEngine()).toBe(true);
        });

        it('generates narrative content when enabled', async () => {
            const result = await agent.processData({
                raw: mockAssessmentData
            });
            expect(result.valid).toBe(true);
            expect(result.data).toBeDefined();
        });
    });

    describe('Protected Method Access', () => {
        const context = createMockContext();
        const agent = new TestAgent(context);

        it('allows access to getFormattedContent', async () => {
            const content = await agent.testGetFormattedContent({ test: 'data' }, 'standard');
            expect(content).toBeDefined();
            expect(content).toContain('Standard:');
        });

        it('formats content at different detail levels', async () => {
            const data = { test: 'data' };
            
            const brief = await agent.testGetFormattedContent(data, 'brief');
            expect(brief).toContain('Brief:');

            const standard = await agent.testGetFormattedContent(data, 'standard');
            expect(standard).toContain('Standard:');

            const detailed = await agent.testGetFormattedContent(data, 'detailed');
            expect(detailed).toContain('Detailed:');
        });
    });

    describe('Error Handling', () => {
        const context = createMockContext();
        const agent = new TestAgent(context);

        it('handles invalid data gracefully', async () => {
            const section = await agent.generateSection({} as any);
            expect(section.valid).toBe(false);
            expect(section.content).toBeDefined();
        });

        it('handles missing data in formatting', async () => {
            const content = await agent.testGetFormattedContent(null, 'standard');
            expect(content).toContain('Standard:');
        });
    });
});