import { TransfersAgent } from '../TransfersAgent';
import type { AgentContext } from '../../types';
import type { TransfersAgentOutput } from '../../types/transfers';

describe('TransfersAgent', () => {
  let agent: TransfersAgent;
  let context: AgentContext;

  // Sample typicalDay data to be included in all test cases
  const typicalDayData = {
    current: {
      daily: {
        sleepSchedule: {
          wakeTime: '07:00',
          bedTime: '22:00'
        },
        routines: {
          morning: {
            activities: 'Basic ADLs'
          }
        }
      }
    }
  };

  beforeEach(() => {
    context = {
      config: {
        detailLevel: 'standard',
        validateData: true,
        includeMetadata: false
      },
      logger: {
        info: (_: any) => {},
        error: (_: any) => {},
        warn: (_: any) => {},
        debug: (_: any) => {}
      },
      templates: {
        getTemplate: (_: string) => ({}),
        formatValue: (value: any) => String(value)
      }
    };
    agent = new TransfersAgent(context);
  });

  describe('validation', () => {
    it('should validate required fields', async () => {
      const data = {
        functionalAssessment: {
          transfers: {
            bedMobility: 'independent',
            sitToStand: 'modified_independent'
          },
          bergBalance: {
            totalScore: 45,
            items: {}
          }
        },
        equipment: {
          current: ['bed_rail', 'toilet_riser']
        },
        symptoms: {
          physical: []
        },
        environment: {
          home: {}
        },
        typicalDay: typicalDayData
      };

      const result = await agent.validateData(data);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail validation when required fields are missing', async () => {
      const data = {
        functionalAssessment: {},
        typicalDay: typicalDayData
      };

      const result = await agent.validateData(data);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Required fields missing');
    });

    it('should validate transfer assistance levels', async () => {
      const data = {
        functionalAssessment: {
          transfers: {
            bedMobility: 'invalid_level', // Invalid level
            sitToStand: 'modified_independent'
          },
          bergBalance: {
            totalScore: 45,
            items: {}
          }
        },
        equipment: {
          current: []
        },
        symptoms: {
          physical: []
        },
        environment: {
          home: {}
        },
        typicalDay: typicalDayData
      };

      const result = await agent.validateData(data);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid value for functionalAssessment.transfers.bedMobility');
    });
  });

  describe('analysis', () => {
    it('should analyze transfer patterns correctly', async () => {
      const data = {
        functionalAssessment: {
          transfers: {
            bedMobility: 'modified_independent',
            sitToStand: 'minimal_assist',
            toilet: {
              assistanceLevel: 'minimal_assist',
              equipment: ['toilet_riser'],
              modifications: ['uses_handles']
            }
          },
          bergBalance: {
            totalScore: 45,
            items: {}
          }
        },
        equipment: {
          current: ['bed_rail', 'toilet_riser']
        },
        symptoms: {
          physical: [
            {
              location: 'hip',
              painType: 'Pain',
              severity: 'Moderate',
              frequency: 'Intermittent',
              aggravating: 'Movement',
              relieving: 'Rest'
            }
          ]
        },
        environment: {
          home: {
            bathroom: {
              hazards: ['slippery_floor']
            }
          }
        },
        typicalDay: typicalDayData
      };

      const result = await agent.processData(data);
      
      // Check transfer status
      expect(result.transferStatus.locations).toHaveLength(4); // bed, chair, toilet, shower/tub
      expect(result.transferStatus.requiredEquipment).toContain('toilet_riser');
      
      // Check risk factors
      const risks = result.riskFactors.join(' ').toLowerCase();
      expect(risks).toContain('hip');
      
      // Check recommendations
      expect(result.recommendations.length).toBeGreaterThan(0);
    });

    it('should identify required equipment', async () => {
      const data = {
        functionalAssessment: {
          transfers: {
            bedMobility: 'minimal_assist',
            sitToStand: 'minimal_assist',
            toilet: {
              assistanceLevel: 'minimal_assist',
              equipment: ['toilet_riser', 'grab_bars']
            }
          },
          bergBalance: {
            totalScore: 45,
            items: {}
          }
        },
        equipment: {
          current: ['toilet_riser']
        },
        symptoms: {
          physical: []
        },
        environment: {
          home: {}
        },
        typicalDay: typicalDayData
      };

      const result = await agent.processData(data);
      expect(result.transferStatus.requiredEquipment).toContain('grab_bars');
      const recommendations = result.recommendations.join(' ').toLowerCase();
      expect(recommendations).toContain('grab_bars');
    });

    it('should handle complex transfer patterns with multiple modifications', async () => {
      const data = {
        functionalAssessment: {
          transfers: {
            bedMobility: 'modified_independent',
            sitToStand: 'minimal_assist',
            toilet: {
              assistanceLevel: 'minimal_assist',
              equipment: ['toilet_riser', 'grab_bars'],
              modifications: ['uses_handles', 'needs_supervision'],
              safety_concerns: ['balance_issues']
            },
            shower: {
              assistanceLevel: 'moderate_assist',
              equipment: ['shower_chair', 'grab_bars'],
              modifications: ['seated_transfers'],
              safety_concerns: ['slippery_surface']
            }
          },
          bergBalance: {
            totalScore: 45,
            items: {}
          }
        },
        equipment: {
          current: ['toilet_riser']
        },
        symptoms: {
          physical: [
            {
              location: 'back',
              painType: 'Pain',
              severity: 'Severe',
              frequency: 'Constant',
              aggravating: 'Movement',
              relieving: 'Rest'
            }
          ]
        },
        environment: {
          home: {
            bathroom: {
              hazards: ['slippery_floor', 'limited_space']
            }
          }
        },
        typicalDay: typicalDayData
      };

      const result = await agent.processData(data);
      
      // Check transfer status
      expect(result.transferStatus.locations).toHaveLength(4);
      
      // Verify equipment recommendations
      expect(result.transferStatus.requiredEquipment).toContain('shower_chair');
      expect(result.transferStatus.requiredEquipment).toContain('grab_bars');
      
      // Check risk factors for back pain
      const risks = result.riskFactors.join(' ').toLowerCase();
      expect(risks).toContain('back');
      expect(risks).toContain('bathroom: limited_space');
      
      // Check recommendations for comprehensive coverage
      const recommendations = result.recommendations.join(' ').toLowerCase();
      expect(recommendations).toContain('caregiver training');
      expect(recommendations).toContain('grab_bars');
    });
  });

  describe('formatting', () => {
    const sampleData: TransfersAgentOutput = {
      transferStatus: {
        locations: [
          {
            location: 'bed',
            patterns: [
              {
                type: 'modified_independent',
                context: 'bed_mobility',
                equipment: ['bed_rail']
              }
            ],
            risks: ['Limited trunk control']
          }
        ],
        generalPatterns: [
          {
            type: 'modified_independent',
            context: 'bed_mobility',
            equipment: ['bed_rail']
          }
        ],
        requiredEquipment: ['bed_rail']
      },
      riskFactors: ['Limited trunk control'],
      recommendations: ['Continue using bed rail for safety']
    };

    it('should format brief output correctly', () => {
      context.config.detailLevel = 'brief';
      const formatted = agent.format(sampleData);
      expect(formatted).toContain('Key Findings');
      expect(formatted).toContain('Equipment Needs');
      expect(formatted).toContain('Primary Concerns');
      expect(formatted).toContain('bed rail');
    });

    it('should format standard output correctly', () => {
      context.config.detailLevel = 'standard';
      const formatted = agent.format(sampleData);
      expect(formatted).toContain('Current Status');
      expect(formatted).toContain('Risk Factors');
      expect(formatted).toContain('Recommendations');
      expect(formatted).toContain('bed_mobility');
      expect(formatted).toContain('Limited trunk control');
    });

    it('should format detailed output correctly', () => {
      context.config.detailLevel = 'detailed';
      const formatted = agent.format(sampleData);
      expect(formatted).toContain('Transfer Analysis by Location');
      expect(formatted).toContain('Equipment Requirements');
      expect(formatted).toContain('Comprehensive Risk Analysis');
      expect(formatted).toContain('Detailed Recommendations');
      expect(formatted).toContain('Current Equipment Needs');
      expect(formatted).toContain('Location-Specific Risks');
    });

    it('should handle missing optional fields in formatting', () => {
      const minimalData: TransfersAgentOutput = {
        transferStatus: {
          locations: [],
          generalPatterns: [],
          requiredEquipment: []
        },
        riskFactors: [],
        recommendations: []
      };

      context.config.detailLevel = 'standard';
      const formatted = agent.format(minimalData);
      expect(formatted).toContain('Current Status');
      expect(formatted).toContain('Risk Factors');
      expect(formatted).toContain('Recommendations');
      expect(formatted).not.toContain('undefined');
    });
  });
});