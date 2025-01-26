import { describe, expect, it } from '@jest/globals';
import { AgentOrchestrator } from '../AgentOrchestrator';
import { sampleJointData } from '../agents/RangeOfMotion/__fixtures__/sampleData';

describe('AgentOrchestrator', () => {
  const mockContext = {
    options: { detailLevel: 'standard' }
  };

  const orchestrator = new AgentOrchestrator(mockContext);

  describe('Assessment Processing', () => {
    it('should integrate ROM findings with ADL assessment', async () => {
      // Sample data combining ROM and ADL
      const testData = {
        ...sampleJointData,
        adl: {
          basic: {
            bathing: {
              independence: 'modified',
              notes: 'Needs assistance with overhead washing'
            }
          }
        }
      };

      const result = await orchestrator.processAssessment(testData);

      // Should correlate ROM limitations with ADL needs
      expect(result.summary.recommendations).toContain(
        expect.stringMatching(/adaptive equipment.*ROM/)
      );
    });

    it('should integrate ROM findings with transfer assessment', async () => {
      // Sample data combining ROM and transfers
      const testData = {
        ...sampleJointData,
        transfers: {
          bedMobility: {
            independence: 'modified',
            notes: 'Difficulty with rolling due to shoulder pain'
          }
        }
      };

      const result = await orchestrator.processAssessment(testData);

      // Should correlate ROM pain with transfer needs
      expect(result.summary.recommendations).toContain(
        expect.stringMatching(/transfer training.*pain/)
      );
    });
  });
});