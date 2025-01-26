import { TransfersAgent } from '../TransfersAgent';
import { createMockContext } from '../../testing/mockContext';
import { AssessmentData } from '../../types';

describe('TransfersAgent', () => {
  let agent: TransfersAgent;

  beforeEach(() => {
    agent = new TransfersAgent(createMockContext());
  });

  const mockTransferData: AssessmentData = {
    id: 'test',
    date: '2025-01-26',
    functionalAssessment: {
      transfers: {
        bedMobility: 'Modified Independent',
        sitToStand: 'Independent',
        toilet: {
          assistanceLevel: 'Modified Independent',
          equipment: ['grab_bars', 'toilet_riser'],
          modifications: ['Use both grab bars'],
          safety_concerns: ['Fall risk with night transfers']
        },
        shower: {
          assistanceLevel: 'Modified Independent',
          equipment: ['shower_chair', 'grab_bars'],
          modifications: ['Seated shower only']
        }
      },
      bergBalance: {
        totalScore: 40,
        items: {}
      }
    },
    equipment: {
      current: ['shower_chair']
    }
  };

  describe('processData', () => {
    it('extracts transfer locations correctly', async () => {
      const result = await agent.processData(mockTransferData);
      expect(result.valid).toBe(true);
      expect(result.transferStatus.locations).toContain('bed');
      expect(result.transferStatus.locations).toContain('chair');
      expect(result.transferStatus.locations).toContain('toilet');
      expect(result.transferStatus.locations).toContain('shower');
    });

    it('identifies required equipment', async () => {
      const result = await agent.processData(mockTransferData);
      expect(result.transferStatus.requiredEquipment).toContain('grab_bars');
      expect(result.transferStatus.requiredEquipment).toContain('toilet_riser');
      expect(result.transferStatus.requiredEquipment).toContain('shower_chair');
    });

    it('analyzes risk factors', async () => {
      const result = await agent.processData(mockTransferData);
      const riskFactors = result.riskFactors.join(' ');
      expect(riskFactors).toContain('balance');
      expect(riskFactors).toContain('Fall risk');
    });

    it('generates appropriate recommendations', async () => {
      const result = await agent.processData(mockTransferData);
      const recommendations = result.recommendations.join(' ');
      expect(recommendations).toContain('grab_bars');
      expect(recommendations).toContain('toilet_riser');
      expect(recommendations).toContain('therapy');
    });
  });

  describe('formatting', () => {
    it('formats brief output correctly', async () => {
      const result = await agent.processData(mockTransferData);
      const formatted = agent.getFormattedContent(result, 'brief');
      expect(formatted).toContain('Transfer Status');
      expect(formatted).toContain('Transfer Locations');
      expect(formatted).toContain('Risk Factors');
    });

    it('formats standard output correctly', async () => {
      const result = await agent.processData(mockTransferData);
      const formatted = agent.getFormattedContent(result, 'standard');
      expect(formatted).toContain('Transfer Assessment');
      expect(formatted).toContain('Required Equipment');
    });

    it('formats detailed output correctly', async () => {
      const result = await agent.processData(mockTransferData);
      const formatted = agent.getFormattedContent(result, 'detailed');
      expect(formatted).toContain('Transfer Assessment');
      expect(formatted).toContain('Required Equipment');
      expect(formatted).toContain('Risk Factors');
      expect(formatted).toContain('Recommendations');
    });

    it('handles minimal data correctly', async () => {
      const minimalData: AssessmentData = {
        id: 'test',
        date: '2025-01-26',
        functionalAssessment: {
          transfers: {
            bedMobility: 'Independent'
          }
        }
      };

      const result = await agent.processData(minimalData);
      const formatted = agent.getFormattedContent(result, 'standard');
      expect(formatted).toContain('bed');
      expect(formatted).not.toContain('undefined');
    });
  });
});