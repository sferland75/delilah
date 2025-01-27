import { IADLAgent } from '../IADLAgent';
import { createMockContext } from '../../../testing/mockContext';
import { AssessmentData } from '../../../types';

describe('IADLAgent', () => {
  let agent: IADLAgent;

  const mockIADLData: AssessmentData = {
    id: 'test-123',
    date: '2025-01-26',
    functionalAssessment: {
      iadl: {
        mealPrep: {
          level: 'Modified Independent',
          notes: 'Uses adapted utensils',
          equipment: ['Electric can opener', 'Jar opener']
        },
        housekeeping: {
          level: 'Independent'
        },
        laundry: {
          level: 'Modified Independent',
          equipment: ['Front loading washer']
        }
      }
    }
  };

  beforeEach(() => {
    agent = new IADLAgent(createMockContext());
  });

  it('processes IADL data correctly', async () => {
    const result = await agent.processData(mockIADLData);
    expect(result.valid).toBe(true);
    expect(result.activities.mealPrep.level).toBe('Modified Independent');
    expect(result.activities.housekeeping.level).toBe('Independent');
  });

  it('formats output at different detail levels', async () => {
    const processed = await agent.processData(mockIADLData);

    const brief = agent.getFormattedContent(processed, 'brief');
    expect(brief).toContain('IADL Status');
    expect(brief).toContain('Meal Prep: Modified Independent');

    const standard = agent.getFormattedContent(processed, 'standard');
    expect(standard).toContain('\nModified Independent:');
    expect(standard).toContain('Meal Prep (uses Electric can opener, Jar opener)');
    expect(standard).toContain('\nIndependent:');

    const detailed = agent.getFormattedContent(processed, 'detailed');
    expect(detailed).toContain('Equipment Used: Electric can opener, Jar opener');
    expect(detailed).toContain('Notes: Uses adapted utensils');
  });

  it('generates appropriate recommendations', async () => {
    const result = await agent.processData(mockIADLData);
    expect(result.recommendations).toContainEqual(expect.stringContaining('Modified Independent'));
  });

  it('handles empty data gracefully', async () => {
    const emptyData: AssessmentData = {
      id: 'test-123',
      date: '2025-01-26',
      functionalAssessment: {
        iadl: {}
      }
    };
    const result = await agent.processData(emptyData);
    expect(result.valid).toBe(true);
    expect(result.activities).toEqual({});
  });
});