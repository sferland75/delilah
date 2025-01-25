import { BasicADLAgent } from '../BasicADLAgent';
import { sampleADLData } from '../__fixtures__/sampleData';
import { BasicADLData, IndependenceLevel } from '../ADLTypes';

describe('BasicADLAgent', () => {
  const mockContext = {
    options: { detailLevel: 'standard' }
  };
  
  const agent = new BasicADLAgent(mockContext as any);

  it('should process basic ADL data correctly', async () => {
    const result = await agent.processData(sampleADLData.adl.basic);
    
    expect(result.sections).toBeDefined();
    expect(result.overallIndependence).toBeDefined();
    expect(result.supportNeeds).toBeDefined();
    expect(result.recommendedAssistance).toBeDefined();
  });

  it('should correctly identify the overall independence level', async () => {
    const result = await agent.processData(sampleADLData.adl.basic);
    
    // Should be total_assistance due to lower body dressing needs
    expect(result.overallIndependence).toBe('total_assistance');
  });

  it('should correctly analyze bathing support needs', async () => {
    const result = await agent.processData(sampleADLData.adl.basic);
    
    const bathingNeeds = result.supportNeeds.find(need => need.category === 'Bathing');
    expect(bathingNeeds).toBeDefined();
    expect(bathingNeeds?.level).toBe('modified_independent');
    expect(bathingNeeds?.rationale).toContain('deodorant');
  });

  it('should correctly analyze dressing support needs', async () => {
    const result = await agent.processData(sampleADLData.adl.basic);
    
    const dressingNeeds = result.supportNeeds.find(need => need.category === 'Dressing');
    expect(dressingNeeds).toBeDefined();
    expect(dressingNeeds?.level).toBe('total_assistance');
    expect(dressingNeeds?.rationale).toContain('socks');
  });

  it('should generate appropriate assistance recommendations', async () => {
    const result = await agent.processData(sampleADLData.adl.basic);
    
    const recommendations = result.recommendedAssistance;
    
    // Check dressing recommendations
    const dressingRec = recommendations.find(rec => rec.activity === 'Dressing');
    expect(dressingRec).toBeDefined();
    expect(dressingRec?.type).toBe('Full physical assistance');
    expect(dressingRec?.frequency).toBe('Continuous during activity');
  });

  it('should format output according to detail level', async () => {
    const result = await agent.processData(sampleADLData.adl.basic);
    const formatted = agent.format(result);
    
    // Should include section headers
    expect(formatted).toContain('Overall Status');
    expect(formatted).toContain('Support Needs');
    expect(formatted).toContain('Recommendations');

    // Should include specific details
    expect(formatted).toContain('Total Assistance');
    expect(formatted).toContain('Modified Independent');
    expect(formatted).toContain('socks');
  });

  it('should handle missing or undefined values gracefully', async () => {
    const incompleteData: BasicADLData = {
      bathing: {
        shower: { notes: '', independence: 'not_applicable' as IndependenceLevel },
        grooming: { notes: '', independence: 'not_applicable' as IndependenceLevel },
        oral_care: { notes: '', independence: 'not_applicable' as IndependenceLevel },
        toileting: { notes: '', independence: 'not_applicable' as IndependenceLevel }
      },
      dressing: {
        upper_body: { notes: '', independence: 'not_applicable' as IndependenceLevel },
        lower_body: { notes: '', independence: 'not_applicable' as IndependenceLevel },
        footwear: { notes: '', independence: 'not_applicable' as IndependenceLevel }
      },
      feeding: {
        eating: { notes: '', independence: 'not_applicable' as IndependenceLevel },
        setup: { notes: '', independence: 'not_applicable' as IndependenceLevel },
        drinking: { notes: '', independence: 'not_applicable' as IndependenceLevel }
      },
      transfers: {
        bed_transfer: { notes: '', independence: 'not_applicable' as IndependenceLevel },
        toilet_transfer: { notes: '', independence: 'not_applicable' as IndependenceLevel },
        shower_transfer: { notes: '', independence: 'not_applicable' as IndependenceLevel },
        position_changes: { notes: '', independence: 'not_applicable' as IndependenceLevel }
      }
    };

    const result = await agent.processData(incompleteData);
    
    expect(result.overallIndependence).toBe('not_applicable');
    expect(result.supportNeeds).toHaveLength(0);
    expect(result.recommendedAssistance).toHaveLength(0);
  });
});