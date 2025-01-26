import { IADLAgent } from '../IADLAgent';
import { createMockContext } from '../../../testing/mockContext';
import { AssessmentData } from '../../../types';

describe('IADLAgent', () => {
  let agent: IADLAgent;

  const mockData: AssessmentData = {
    id: 'test',
    date: '2025-01-26',
    functionalAssessment: {
      iadl: {
        mealPrep: {
          level: 'Modified Independent',
          notes: 'Uses adaptive equipment',
          equipment: ['adapted utensils', 'jar opener'],
          frequency: 'Daily'
        },
        housekeeping: 'Independent',
        laundry: {
          level: 'Modified Independent',
          frequency: 'Weekly',
          notes: 'Uses front-loading washer'
        }
      }
    }
  };

  beforeEach(() => {
    agent = new IADLAgent(createMockContext());
  });

  it('validates IADL data correctly', async () => {
    const result = await agent.validateData(mockData);
    expect(result.valid).toBe(true);
  });

  it('processes IADL data with notes', async () => {
    const result = await agent.processData(mockData);
    expect(result.valid).toBe(true);
    expect(result.activities.mealPrep?.notes).toBe('Uses adaptive equipment');
    expect(result.activities.mealPrep?.equipment).toContain('jar opener');
  });

  it('formats output at different detail levels', async () => {
    const processed = await agent.processData(mockData);
    
    const brief = agent.getFormattedContent(processed, 'brief');
    expect(brief).toContain('IADL Status');
    expect(brief).toContain('mealPrep: Modified Independent');

    const standard = agent.getFormattedContent(processed, 'standard');
    expect(standard).toContain('Assistance Level: Modified Independent');

    const detailed = agent.getFormattedContent(processed, 'detailed');
    expect(detailed).toContain('Equipment Used: adapted utensils, jar opener');
  });

  it('handles missing activities gracefully', async () => {
    const minimalData = {
      id: 'test',
      date: '2025-01-26',
      functionalAssessment: {
        iadl: {
          mealPrep: 'Independent'
        }
      }
    };

    const result = await agent.processData(minimalData);
    expect(result.valid).toBe(true);
    expect(result.activities.mealPrep?.level).toBe('Independent');
  });

  it('generates complete section', async () => {
    const section = await agent.generateSection(mockData);
    expect(section.valid).toBe(true);
    expect(section.content).toContain('Instrumental ADL Assessment');
  });
});