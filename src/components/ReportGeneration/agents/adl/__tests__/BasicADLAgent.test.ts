import { BasicADLAgent } from '../BasicADLAgent';
import { createMockContext } from '../../../testing/mockContext';
import { sampleADLData } from '../../../testing/mockData';

describe('BasicADLAgent', () => {
  let agent: BasicADLAgent;

  beforeEach(() => {
    agent = new BasicADLAgent(createMockContext());
  });

  it('processes ADL data correctly', async () => {
    const result = await agent.processData(sampleADLData);
    expect(result.valid).toBe(true);
    expect(result.activities.feeding.assistanceLevel).toBe('Independent');
    expect(result.activities.bathing.assistanceLevel).toBe('Modified Independent');
    expect(result.activities.dressing.assistanceLevel).toBe('Independent');
    expect(result.activities.toileting.assistanceLevel).toBe('Independent');
  });

  it('formats output at different detail levels', async () => {
    const processed = await agent.processData(sampleADLData);
    expect(processed.valid).toBe(true);

    const brief = agent.getFormattedContent(processed, 'brief');
    expect(brief).toContain('Basic ADL Status');
    expect(brief).toContain('feeding: Independent');

    const detailed = agent.getFormattedContent(processed, 'detailed');
    expect(detailed).toContain('Basic ADL Assessment');
    expect(detailed).toContain('Assistance Level: Modified Independent');
  });

  it('handles missing data gracefully', async () => {
    const minimalData = {
      id: 'test',
      date: '2025-01-26',
      functionalAssessment: {
        adl: {
          feeding: 'Independent'
        }
      }
    };

    const result = await agent.processData(minimalData);
    expect(result.valid).toBe(true);
    expect(result.activities.feeding.assistanceLevel).toBe('Independent');
    expect(result.activities.bathing.assistanceLevel).toBe('Dependent');
  });

  it('generates complete section', async () => {
    const section = await agent.generateSection(sampleADLData);
    expect(section.valid).toBe(true);
    expect(section.content).toContain('Basic ADL Assessment');
  });
});