import { RangeOfMotionAgent } from '../RangeOfMotionAgent';
import { createMockContext } from '../../../testing/mockContext';
import { Assessment } from '../../../../../types/report';
import { mockAssessmentData } from '../../../testing/mockData';

describe('RangeOfMotionAgent', () => {
  let agent: RangeOfMotionAgent;

  beforeEach(() => {
    agent = new RangeOfMotionAgent(createMockContext());
  });

  const testData: Assessment = {
    ...mockAssessmentData,
    functionalAssessment: {
      ...mockAssessmentData.functionalAssessment,
      rangeOfMotion: {
        shoulder: [
          {
            joint: 'shoulder',
            side: 'right',
            movement: 'flexion',
            active: 150,
            passive: 160,
            pain: true,
            notes: 'Pain at end range'
          }
        ],
        cervical: []
      }
    }
  };

  it('processes data correctly', async () => {
    const result = await agent.processData(testData);
    expect(result.valid).toBe(true);
    expect(result.data.patterns).toBeDefined();
  });

  it('identifies unilateral patterns', async () => {
    const result = await agent.processData(testData);
    expect(result.data.patterns.unilateral).toBeDefined();
    expect(result.data.patterns.unilateral).toContainEqual({
      joint: 'shoulder',
      side: 'right'
    });
  });

  it('identifies painful movements', async () => {
    const result = await agent.processData(testData);
    expect(result.data.patterns.painful).toBeDefined();
    expect(result.data.patterns.painful).toContainEqual({
      joint: 'shoulder',
      movement: 'flexion',
      side: 'right'
    });
  });

  it('formats brief content correctly', async () => {
    const result = await agent.processData(testData);
    const briefFormat = await (agent as any).getFormattedContent(result, 'brief');
    expect(briefFormat).toContain('Range of Motion Summary');
    expect(briefFormat).toContain('shoulder');
  });

  it('formats standard content correctly', async () => {
    const result = await agent.processData(testData);
    const standardFormat = await (agent as any).getFormattedContent(result, 'standard');
    expect(standardFormat).toContain('Range of Motion Assessment');
    expect(standardFormat).toContain('Shoulder');
  });

  it('formats detailed content correctly', async () => {
    const result = await agent.processData(testData);
    const detailedFormat = await (agent as any).getFormattedContent(result, 'detailed');
    expect(detailedFormat).toContain('Detailed Range of Motion Assessment');
    expect(detailedFormat).toContain('Pain Patterns');
  });
});