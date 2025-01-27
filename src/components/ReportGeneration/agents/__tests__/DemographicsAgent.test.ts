import { DemographicsAgent } from '../DemographicsAgent';
import { Assessment } from '../../../../types/report';
import { createTestSuite, runStandardTests, runNarrativeTests, TestSuiteOptions } from '../../testing/setup';
import { mockAssessmentData } from '../../testing/mockData';

describe('DemographicsAgent', () => {
  const testData: Assessment = {
    ...mockAssessmentData,
    demographics: {
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1980-01-01',
      gender: 'Male',
      householdMembers: [
        {
          relationship: 'Spouse',
          name: 'Jane Doe',
          notes: 'Primary caregiver'
        }
      ],
      occupation: 'Software Developer',
      employer: 'Tech Corp',
      address: '123 Main St'
    }
  };

  describe('Standard Mode', () => {
    const { agent, context } = createTestSuite(DemographicsAgent);

    it('processes demographic data correctly', async () => {
      const result = await agent.processData(testData);
      expect(result.valid).toBe(true);
      expect(result.data).toMatchObject({
        name: 'John Doe',
        age: expect.any(Number),
        gender: 'Male',
        occupation: 'Software Developer'
      });
    });

    it('formats content at different detail levels', async () => {
      const { brief, standard, detailed } = await runStandardTests({ 
        agent, 
        context, 
        testData 
      });

      // Brief format checks
      expect(brief).toContain('John Doe');
      expect(brief).toContain('Male');

      // Standard format checks
      expect(standard).toContain('Software Developer');
      expect(standard).toContain('Tech Corp');

      // Detailed format checks
      expect(detailed).toContain('123 Main St');
      expect(detailed).toContain('Primary caregiver');
    });

    it('handles missing data gracefully', async () => {
      const minimalData: Assessment = {
        ...mockAssessmentData,
        demographics: {
          firstName: 'John',
          lastName: 'Doe',
          gender: 'Male',
          householdMembers: []
        }
      };

      const result = await agent.processData(minimalData);
      expect(result.valid).toBe(true);
      
      const section = await agent.generateSection(minimalData);
      expect(section.valid).toBe(true);
      expect(section.content).toContain('John Doe');
    });

    it('correctly identifies caregivers', async () => {
      const result = await agent.processData(testData);
      expect(result.data.caregivers).toBeDefined();
      expect(result.data.caregivers).toContainEqual({
        name: 'Jane Doe',
        relationship: 'Spouse',
        isPrimary: true
      });
    });

    it('generates appropriate recommendations', async () => {
      const result = await agent.processData(testData);
      expect(result.data.recommendations).toBeDefined();
      expect(Array.isArray(result.data.recommendations)).toBe(true);
    });
  });

  describe('Narrative Mode', () => {
    const narrativeOptions: TestSuiteOptions = {
      features: { enableNarrative: true }
    };

    const { agent, context } = createTestSuite(DemographicsAgent, narrativeOptions);

    it('generates narrative content with personal details', async () => {
      const { section } = await runNarrativeTests({ agent, context, testData });
      const content = section.content as string;
      
      expect(content).toContain('John Doe');
      expect(content).toContain('43-year-old');  // Age calculated from DOB
      expect(content).toContain('Male');
      expect(content).toContain('Software Developer');
    });

    it('includes caregiver information in narrative', async () => {
      const { section } = await runNarrativeTests({ agent, context, testData });
      const content = section.content as string;

      expect(content).toContain('Jane Doe');
      expect(content).toContain('Spouse');
      expect(content).toContain('Primary caregiver');
    });

    it('handles professional context in narrative', async () => {
      const { section } = await runNarrativeTests({ agent, context, testData });
      const content = section.content as string;

      expect(content).toContain('employed as');
      expect(content).toContain('Software Developer');
      expect(content).toContain('Tech Corp');
    });

    it('generates appropriate narrative without employment', async () => {
      const unemployedData = {
        ...testData,
        demographics: {
          ...testData.demographics,
          occupation: '',
          employer: ''
        }
      };

      const { section } = await runNarrativeTests({ 
        agent, 
        context, 
        testData: unemployedData 
      });
      const content = section.content as string;

      expect(content).not.toContain('employed as');
      expect(content).not.toContain('undefined');
      expect(content).not.toContain('null');
    });

    it('includes living situation in narrative when available', async () => {
      const dataWithLiving = {
        ...testData,
        demographics: {
          ...testData.demographics,
          householdMembers: [
            {
              relationship: 'Spouse',
              name: 'Jane Doe',
              notes: 'Primary caregiver'
            },
            {
              relationship: 'Child',
              name: 'John Jr',
              notes: 'Age 10'
            }
          ]
        }
      };

      const { section } = await runNarrativeTests({ 
        agent, 
        context, 
        testData: dataWithLiving 
      });
      const content = section.content as string;

      expect(content).toContain('lives with');
      expect(content).toContain('Spouse');
      expect(content).toContain('Child');
    });
  });

  describe('Edge Cases', () => {
    it('validates data structure', async () => {
      const invalidData = {
        ...testData,
        demographics: {
          firstName: null,
          lastName: undefined
        }
      };

      const result = await agent.processData(invalidData as any);
      expect(result.valid).toBe(true); // Should still be valid but with defaults
      expect(result.data.name).toBe('Unknown');
    });

    it('handles mode switching gracefully', async () => {
      // Start with standard mode
      const { agent: standardAgent } = createTestSuite(DemographicsAgent);
      const standardSection = await standardAgent.generateSection(testData);
      expect(standardSection.valid).toBe(true);

      // Switch to narrative mode
      const { agent: narrativeAgent } = createTestSuite(DemographicsAgent, {
        features: { enableNarrative: true }
      });
      const narrativeSection = await narrativeAgent.generateSection(testData);
      expect(narrativeSection.valid).toBe(true);

      // Content should be different between modes
      expect(narrativeSection.content).not.toBe(standardSection.content);
    });

    it('gracefully handles malformed dates', async () => {
      const badDateData = {
        ...testData,
        demographics: {
          ...testData.demographics,
          dateOfBirth: 'invalid-date'
        }
      };

      const { agent } = createTestSuite(DemographicsAgent, {
        features: { enableNarrative: true }
      });

      const section = await agent.generateSection(badDateData);
      expect(section.valid).toBe(true);
      expect(section.content).not.toContain('NaN');
      expect(section.content).not.toContain('undefined');
    });
  });
});