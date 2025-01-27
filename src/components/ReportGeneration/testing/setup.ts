import { AgentContext, AssessmentData } from '../../../types/report';
import { createMockContext } from './mockContext';
import { mockAssessmentData } from './mockData';
import { TestableAgent } from './TestableAgent';
import { AgentMetadata } from '../agents/BaseAgent';

export interface TestSuite {
    agent: TestableAgent;
    context: AgentContext;
    testData: AssessmentData;
}

export interface TestSuiteOptions {
    features?: {
        enableNarrative?: boolean;
        enableDetailedFormatting?: boolean;
        enableContextualAnalysis?: boolean;
    };
    metadata?: Partial<AgentMetadata>;
    data?: Partial<AssessmentData>;
}

export const createTestSuite = (options: TestSuiteOptions = {}): TestSuite => {
    const context = createMockContext({
        features: options.features
    });

    const agent = new TestableAgent(context, options.metadata);
    const testData: AssessmentData = {
        raw: mockAssessmentData,
        ...options.data
    };

    return {
        agent,
        context,
        testData
    };
};

export const runStandardTests = async (suite: TestSuite) => {
    const { agent, testData } = suite;

    // Test data processing
    const result = await agent.processData(testData);
    expect(result.valid).toBe(true);

    // Test section generation
    const section = await agent.generateSection(testData);
    expect(section.valid).toBe(true);
    expect(section.content).toBeDefined();

    // Test formatting
    const brief = await agent.testGetFormattedContent(result.data, 'brief');
    expect(brief).toBeDefined();
    expect(typeof brief).toBe('string');

    const standard = await agent.testGetFormattedContent(result.data, 'standard');
    expect(standard).toBeDefined();
    expect(typeof standard).toBe('string');

    const detailed = await agent.testGetFormattedContent(result.data, 'detailed');
    expect(detailed).toBeDefined();
    expect(typeof detailed).toBe('string');

    return { result, section, brief, standard, detailed };
};

export const runNarrativeTests = async (suite: TestSuite) => {
    const { agent, testData } = suite;

    // Ensure narrative mode is enabled
    expect(agent.isNarrativeEnabledTest()).toBe(true);

    // Test section generation with narrative
    const section = await agent.generateSection(testData);
    expect(section.valid).toBe(true);
    expect(section.content).toBeDefined();
    expect(typeof section.content).toBe('string');

    // Test narrative content generation
    const processedData = await agent.processData(testData);
    const narrativeContent = await agent.testGenerateNarrativeContent(testData, processedData);
    expect(narrativeContent).toBeDefined();
    expect(typeof narrativeContent).toBe('string');
    expect(narrativeContent.length).toBeGreaterThan(0);

    return { section, narrativeContent };
};