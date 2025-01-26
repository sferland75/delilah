import { MobilityAgent } from '../MobilityAgent';
import { createMockContext } from '../../testing/mockContext';
import { mockAssessmentData } from '../../testing/mockData';
import type { AssessmentData } from '../../types';

describe('MobilityAgent', () => {
  let agent: MobilityAgent;
  let mockContext;

  beforeEach(() => {
    mockContext = createMockContext();
    agent = new MobilityAgent(mockContext);
  });

  describe('Data Processing', () => {
    test('processes assessment data correctly', async () => {
      const result = await agent.analyze(mockAssessmentData);
      
      expect(result).toHaveProperty('mobilityStatus');
      expect(result).toHaveProperty('riskFactors');
      expect(result).toHaveProperty('recommendations');
      
      expect(result.mobilityStatus).toHaveProperty('indoorMobility');
      expect(result.mobilityStatus).toHaveProperty('outdoorMobility');
      expect(result.mobilityStatus).toHaveProperty('assistiveDevices');
      expect(result.mobilityStatus).toHaveProperty('distanceCapacity');
    });

    test('extracts mobility patterns from daily routines', async () => {
      const result = await agent.analyze(mockAssessmentData);
      
      expect(result.mobilityStatus.indoorMobility).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: expect.any(String),
            context: expect.any(String)
          })
        ])
      );
    });
  });

  describe('Distance Capacity Calculations', () => {
    test('calculates appropriate distances for good balance score', async () => {
      const goodBalanceData: AssessmentData = {
        ...mockAssessmentData,
        functionalAssessment: {
          ...mockAssessmentData.functionalAssessment,
          bergBalance: {
            ...mockAssessmentData.functionalAssessment.bergBalance,
            totalScore: 52
          }
        }
      };

      const result = await agent.analyze(goodBalanceData);
      
      expect(result.mobilityStatus.distanceCapacity.indoor.max).toBeGreaterThan(0);
      expect(result.mobilityStatus.distanceCapacity.outdoor.max).toBeGreaterThan(
        result.mobilityStatus.distanceCapacity.indoor.max
      );
    });

    test('reduces distances for poor balance score', async () => {
      const poorBalanceData: AssessmentData = {
        ...mockAssessmentData,
        functionalAssessment: {
          ...mockAssessmentData.functionalAssessment,
          bergBalance: {
            ...mockAssessmentData.functionalAssessment.bergBalance,
            totalScore: 20
          }
        }
      };

      const result = await agent.analyze(poorBalanceData);
      
      expect(result.mobilityStatus.distanceCapacity.indoor.max).toBeLessThan(50);
      expect(result.mobilityStatus.distanceCapacity.outdoor.max).toBeLessThan(100);
    });
  });

  describe('Risk Assessment', () => {
    test('identifies fall risk with low Berg score', async () => {
      const lowBergData: AssessmentData = {
        ...mockAssessmentData,
        functionalAssessment: {
          ...mockAssessmentData.functionalAssessment,
          bergBalance: {
            ...mockAssessmentData.functionalAssessment.bergBalance,
            totalScore: 35
          }
        }
      };

      const result = await agent.analyze(lowBergData);
      
      expect(result.riskFactors.some((risk: string) => 
        risk.toLowerCase().includes('fall risk')
      )).toBeTruthy();
    });

    test('identifies mobility limitations from symptoms', async () => {
      const result = await agent.analyze(mockAssessmentData);
      
      expect(result.riskFactors.some((risk: string) => 
        risk.toLowerCase().includes('hip') || risk.toLowerCase().includes('groin')
      )).toBeTruthy();
    });
  });

  describe('Recommendations', () => {
    test('recommends assistive devices for low balance scores', async () => {
      const lowBalanceData: AssessmentData = {
        ...mockAssessmentData,
        functionalAssessment: {
          ...mockAssessmentData.functionalAssessment,
          bergBalance: {
            ...mockAssessmentData.functionalAssessment.bergBalance,
            totalScore: 30
          }
        }
      };

      const result = await agent.analyze(lowBalanceData);
      
      expect(result.recommendations.some((rec: string) => 
        /walker|mobility aid|assistive device/i.test(rec)
      )).toBeTruthy();
    });

    test('includes activity modifications for severe symptoms', async () => {
      const result = await agent.analyze(mockAssessmentData);
      
      expect(result.recommendations).toContain('Activity modification and pain management program recommended');
    });
  });

  describe('Report Formatting', () => {
    test('formats brief report correctly', async () => {
      const report = await agent.analyze(mockAssessmentData);
      const briefOutput = agent['formatBrief'](report);
      
      expect(briefOutput).toContain('Mobility Assessment');
      expect(briefOutput).toContain('Key Findings');
    });

    test('formats detailed report correctly', async () => {
      const report = await agent.analyze(mockAssessmentData);
      const detailedOutput = agent['formatDetailed'](report);
      
      expect(detailedOutput).toContain('Mobility Status Analysis');
      expect(detailedOutput).toContain('Distance Capacity Analysis');
      expect(detailedOutput).toContain('Risk Factor Analysis');
    });
  });
});