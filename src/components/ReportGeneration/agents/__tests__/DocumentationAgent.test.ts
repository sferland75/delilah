import { DocumentationAgent } from '../DocumentationAgent';
import { createMockContext } from '../../testing/mockContext';
import { AssessmentData } from '../../types';

describe('DocumentationAgent', () => {
  let agent: DocumentationAgent;

  const mockData: AssessmentData = {
    id: 'test',
    date: '2025-01-26',
    documentation: {
      medicalDocumentation: [
        {
          title: 'Annual Physical',
          date: '2025-01-15',
          type: 'Medical Report',
          provider: 'Dr. Smith',
          summary: 'Annual physical exam',
          findings: ['Normal vital signs', 'Stable condition'],
          recommendations: ['Continue current medications']
        }
      ],
      legalDocumentation: [
        {
          title: 'Healthcare POA',
          date: '2024-12-01',
          type: 'Power of Attorney',
          provider: 'Law Office LLC',
          summary: 'Healthcare POA document'
        }
      ]
    }
  };

  beforeEach(() => {
    agent = new DocumentationAgent(createMockContext());
  });

  describe('processData', () => {
    it('processes documentation correctly', async () => {
      const result = await agent.processData(mockData);
      expect(result.valid).toBe(true);
      expect(result.medicalDocumentation).toHaveLength(1);
      expect(result.legalDocumentation).toHaveLength(1);
    });

    it('processes medical documentation details', async () => {
      const result = await agent.processData(mockData);
      const medDoc = result.medicalDocumentation[0];
      expect(medDoc.title).toBe('Annual Physical');
      expect(medDoc.provider).toBe('Dr. Smith');
      expect(medDoc.relevantFindings).toContain('Normal vital signs');
    });

    it('generates recommendations when needed', async () => {
      const oldData: AssessmentData = {
        id: 'test',
        date: '2025-01-26',
        documentation: {
          medicalDocumentation: [
            {
              title: 'Old Report',
              date: '2024-06-01',
              type: 'Medical Report',
              provider: 'Dr. Smith',
              recommendations: ['Update records annually']
            }
          ],
          legalDocumentation: []
        }
      };

      const result = await agent.processData(oldData);
      expect(result.recommendations).toContain('Update medical documentation');
    });
  });

  describe('formatting', () => {
    it('formats at different detail levels', async () => {
      const result = await agent.processData(mockData);
      
      const brief = agent.getFormattedContent(result, 'brief');
      expect(brief).toContain('Documentation Summary');
      expect(brief).toContain('Medical Documentation: 1');
      
      const detailed = agent.getFormattedContent(result, 'detailed');
      expect(detailed).toContain('Documentation Review');
      expect(detailed).toContain('Dr. Smith');
      expect(detailed).toContain('Normal vital signs');
    });

    it('handles minimal data gracefully', async () => {
      const minimalData: AssessmentData = {
        id: 'test',
        date: '2025-01-26',
        documentation: {
          medicalDocumentation: [
            {
              title: 'Basic Report',
              date: '2025-01-15',
              type: 'Medical Report'
            }
          ],
          legalDocumentation: []
        }
      };

      const result = await agent.processData(minimalData);
      const formatted = agent.getFormattedContent(result, 'standard');
      expect(formatted).toContain('Medical Report');
      expect(formatted).not.toContain('undefined');
    });
  });
});