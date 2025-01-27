import { BaseAgent } from '../BaseAgent';
import { createMockContext } from '../../testing/mockContext';
import { mockAssessmentData } from '../../testing/mockData';
import { AgentContext, AssessmentData, ProcessedData } from '../../types';

class TestAgent extends BaseAgent {
  constructor(context: AgentContext) {
    super(context, 1, 'Test Section', ['demographics.firstName']);
  }

  async processData(_data: AssessmentData): Promise<ProcessedData> {
    return {
      valid: true,
      data: { processed: true }
    };
  }

  protected formatBrief(data: ProcessedData): string {
    return `Brief: ${JSON.stringify(data.data)}`;
  }

  protected formatStandard(data: ProcessedData): string {
    return `Standard: ${JSON.stringify(data.data)}`;
  }

  protected formatDetailed(data: ProcessedData): string {
    return `Detailed: ${JSON.stringify(data.data)}`;
  }

  // Expose protected method for testing
  public testFormatByDetailLevel(data: ProcessedData, level: "brief" | "standard" | "detailed"): string {
    return this.formatByDetailLevel(data, level);
  }
}

describe('BaseAgent', () => {
  let agent: TestAgent;
  const mockProcessedData: ProcessedData = {
    valid: true,
    data: { processed: true }
  };

  beforeEach(() => {
    agent = new TestAgent(createMockContext());
  });

  it('initializes with correct properties', () => {
    expect(agent.getSectionName()).toBe('Test Section');
    expect(agent.getOrderNumber()).toBe(1);
  });

  it('validates required fields', async () => {
    const result = await agent.validateData(mockAssessmentData);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('generates sections with different detail levels', async () => {
    const section = await agent.generateSection(mockAssessmentData);
    expect(section.valid).toBe(true);
    expect(section.content).toContain('Standard: ');
  });

  it('formats content at different detail levels', () => {
    expect(agent.getFormattedContent(mockProcessedData, 'brief')).toContain('Brief: ');
    expect(agent.getFormattedContent(mockProcessedData, 'standard')).toContain('Standard: ');
    expect(agent.getFormattedContent(mockProcessedData, 'detailed')).toContain('Detailed: ');
  });

  it('defaults to standard detail level when none specified', () => {
    expect(agent.getFormattedContent(mockProcessedData)).toContain('Standard: ');
  });
});