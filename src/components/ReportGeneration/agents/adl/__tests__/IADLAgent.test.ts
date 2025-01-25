import { IADLAgent } from '../IADLAgent';
import { IADLData, IndependenceLevel } from '../IADLTypes';
import type { AgentContext } from '../../types';

describe('IADLAgent', () => {
  const mockAssessment = {
    demographics: {
      emergencyContact: {},
    },
    documentation: {
      medicalDocumentation: [],
      legalDocumentation: []
    },
    medicalHistory: {
      medications: [],
      treatments: []
    },
    typicalDay: {
      preAccident: {
        daily: {
          sleepSchedule: {},
          routines: {
            morning: {},
            afternoon: {},
            evening: {},
            night: {}
          }
        },
        weekly: {}
      },
      current: {
        daily: {
          sleepSchedule: {},
          routines: {
            morning: {},
            afternoon: {},
            evening: {},
            night: {}
          }
        },
        weekly: {}
      }
    },
    functionalAssessment: {
      rangeOfMotion: {
        measurements: [],
        generalNotes: ''
      },
      manualMuscleTesting: {
        grades: {},
        generalNotes: ''
      }
    },
    symptoms: {
      physical: [],
      cognitive: [],
      emotional: [],
      generalNotes: ''
    },
    environmental: {
      propertyOverview: {
        recommendedModifications: [],
        identifiedHazards: []
      },
      rooms: [],
      exterior: [],
      safety: {
        hazards: [],
        recommendations: []
      }
    }
  };

  const mockContext: AgentContext = {
    assessment: mockAssessment,
    options: { detailLevel: 'standard' }
  };
  
  const agent = new IADLAgent(
    mockContext,
    2,  // sectionOrder
    'Instrumental ADL Assessment' // sectionTitle
  );

  const sampleData: IADLData = {
    household: {
      cleaning: {
        notes: "Cannot vaccuum or do heavy cleaning. Wife looks after most cleaning tasks.",
        independence: "maximal_assistance" as IndependenceLevel
      },
      laundry: {
        notes: "",
        independence: "not_applicable" as IndependenceLevel
      },
      meal_prep: {
        notes: "Manages basic breakfast preparation but no complex cooking",
        independence: "modified_independent" as IndependenceLevel
      },
      home_maintenance: {
        notes: "Previous maintained 18 acres, now unable to manage basic maintenance tasks",
        independence: "total_assistance" as IndependenceLevel
      }
    },
    community: {
      transportation: {
        notes: "Can only drive 20-30 minutes, requires breaks due to pain",
        independence: "modified_independent" as IndependenceLevel
      },
      shopping: {
        notes: "Unable to carry groceries or navigate stores for long periods",
        independence: "maximal_assistance" as IndependenceLevel
      },
      money_management: {
        notes: "",
        independence: "independent" as IndependenceLevel
      },
      communication: {
        notes: "",
        independence: "independent" as IndependenceLevel
      }
    }
  };

  it('should process IADL data correctly', async () => {
    const result = await agent.processData(sampleData);
    
    expect(result.sections).toBeDefined();
    expect(result.sections.household).toBeDefined();
    expect(result.sections.community).toBeDefined();
    expect(result.overallIndependence).toBeDefined();
    expect(result.supportNeeds).toBeDefined();
    expect(result.recommendations).toBeDefined();
    expect(result.safetyConsiderations).toBeDefined();
  });

  it('should correctly identify overall independence level', async () => {
    const result = await agent.processData(sampleData);
    
    // Should be total_assistance due to home maintenance needs
    expect(result.overallIndependence).toBe('total_assistance');
  });

  it('should identify barriers from notes', async () => {
    const result = await agent.processData(sampleData);
    
    const householdNeeds = result.supportNeeds.find((need: { category: string }) => 
      need.category === 'Household'
    );
    expect(householdNeeds).toBeDefined();
    expect(householdNeeds?.barriers).toContainEqual(expect.stringMatching(/unable to manage/i));
  });

  it('should generate appropriate recommendations', async () => {
    const result = await agent.processData(sampleData);
    
    const cleaning = result.recommendations.find((rec: { activity: string }) => 
      rec.activity === 'cleaning'
    );
    expect(cleaning).toBeDefined();
    expect(cleaning?.supportType).toBe('Complete support required');
    expect(cleaning?.frequency).toBe('For entire duration of activity');
  });

  it('should identify safety considerations', async () => {
    const result = await agent.processData(sampleData);
    
    // Should identify driving safety considerations
    const drivingSafety = result.safetyConsiderations.find(
      (item: { activity: string }) => item.activity === 'transportation'
    );
    expect(drivingSafety).toBeDefined();
    expect(drivingSafety?.risk).toContain('pain');
  });

  it('should format output appropriately', async () => {
    const result = await agent.processData(sampleData);
    const formatted = agent.format(result);

    expect(formatted).toContain('Instrumental ADL Assessment');
    expect(formatted).toContain('Support Needs');
    expect(formatted).toContain('Recommendations');
    expect(formatted).toContain('Safety Considerations');
  });

  it('should handle missing or undefined values gracefully', async () => {
    const incompleteData: IADLData = {
      household: {
        cleaning: { notes: '', independence: 'not_applicable' as IndependenceLevel },
        laundry: { notes: '', independence: 'not_applicable' as IndependenceLevel },
        meal_prep: { notes: '', independence: 'not_applicable' as IndependenceLevel },
        home_maintenance: { notes: '', independence: 'not_applicable' as IndependenceLevel }
      },
      community: {
        transportation: { notes: '', independence: 'not_applicable' as IndependenceLevel },
        shopping: { notes: '', independence: 'not_applicable' as IndependenceLevel },
        money_management: { notes: '', independence: 'not_applicable' as IndependenceLevel },
        communication: { notes: '', independence: 'not_applicable' as IndependenceLevel }
      }
    };

    const result = await agent.processData(incompleteData);
    
    expect(result.overallIndependence).toBe('not_applicable');
    expect(result.supportNeeds).toHaveLength(0);
    expect(result.recommendations).toHaveLength(0);
    expect(result.safetyConsiderations).toHaveLength(0);
  });
});