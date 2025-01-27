import { BasicADLAgent } from '../BasicADLAgent';
import { createMockContext } from '../../../testing/mockContext';
import { AssessmentData } from '../../../types';
import { INDEPENDENCE_LEVELS } from '../ADLTypes';

describe('BasicADLAgent', () => {
  let agent: BasicADLAgent;

  const mockADLData: AssessmentData = {
    id: 'test-123',
    date: '2025-01-26',
    functionalAssessment: {
      adl: {
        feeding: {
          assistanceLevel: INDEPENDENCE_LEVELS.INDEPENDENT,
          notes: 'No issues noted'
        },
        bathing: {
          assistanceLevel: INDEPENDENCE_LEVELS.MODIFIED_INDEPENDENT,
          equipment: ['Shower chair', 'Hand-held shower'],
          notes: 'Uses equipment for safety'
        },
        dressing: {
          assistanceLevel: INDEPENDENCE_LEVELS.INDEPENDENT,
          notes: 'Independent with all clothing types'
        },
        toileting: {
          assistanceLevel: INDEPENDENCE_LEVELS.MODIFIED_INDEPENDENT,
          equipment: ['Raised toilet seat'],
          notes: 'Uses equipment for safety'
        },
        transfers: {
          assistanceLevel: INDEPENDENCE_LEVELS.TOTAL_ASSISTANCE
        },
        ambulation: {
          assistanceLevel: INDEPENDENCE_LEVELS.TOTAL_ASSISTANCE
        }
      }
    }
  };

  beforeEach(() => {
    agent = new BasicADLAgent(createMockContext());
  });

  it('processes ADL data correctly', async () => {
    const result = await agent.processData(mockADLData);
    expect(result.valid).toBe(true);
    
    expect(result.activities.feeding.assistanceLevel).toBe(INDEPENDENCE_LEVELS.INDEPENDENT);
    expect(result.activities.bathing.equipment).toContain('Shower chair');
    expect(result.activities.dressing.assistanceLevel).toBe(INDEPENDENCE_LEVELS.INDEPENDENT);
    expect(result.activities.toileting.equipment).toContain('Raised toilet seat');
  });

  it('generates appropriate recommendations', async () => {
    const result = await agent.processData(mockADLData);
    expect(result.recommendations).toContainEqual(expect.stringContaining('Modified Independent'));
  });

  it('formats output at different detail levels', async () => {
    const processed = await agent.processData(mockADLData);

    const brief = agent.getFormattedContent(processed, 'brief');
    expect(brief).toContain('ADL Status');
    expect(brief).toContain('feeding: Independent');

    const standard = agent.getFormattedContent(processed, 'standard');
    expect(standard).toContain('Independent:');
    expect(standard).toContain('Modified Independent:');
    expect(standard).toContain('bathing (uses Shower chair, Hand-held shower)');

    const detailed = agent.getFormattedContent(processed, 'detailed');
    expect(detailed).toContain('Equipment Used: Shower chair, Hand-held shower');
    expect(detailed).toContain('Notes: Uses equipment for safety');
  });

  it('handles empty data gracefully', async () => {
    const emptyData: AssessmentData = {
      id: 'test-123',
      date: '2025-01-26',
      functionalAssessment: {
        adl: {}
      }
    };
    const result = await agent.processData(emptyData);
    expect(result.valid).toBe(true);
    expect(result.activities.feeding.assistanceLevel).toBe(INDEPENDENCE_LEVELS.TOTAL_ASSISTANCE);
  });
});