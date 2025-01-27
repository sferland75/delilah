import { generateReport } from '../generateReport';
import { Assessment } from '../../../types/report';
import { createMockContext } from '../testing/mockContext';

describe('Anderson Report Generation', () => {
  let assessmentData: Assessment;
  const context = createMockContext();

  beforeAll(async () => {
    const response = await window.fs.readFile('delilah_assessment_2025-01-14 (16).json', { encoding: 'utf8' });
    assessmentData = JSON.parse(response);
  });

  it('should generate a complete assessment report', async () => {
    const report = await generateReport(assessmentData, context);
    
    // Save report output
    await window.fs.writeFile('anderson-report.txt', report);

    // Basic validation
    expect(report).toContain('OCCUPATIONAL THERAPY IN-HOME ASSESSMENT');
    expect(report).toContain('Patrick Anderson');
    expect(report).toContain('Date of Assessment:');
    
    // Section validation
    expect(report).toContain('Client Information');
    expect(report).toContain('Medical History');
    expect(report).toContain('Physical Assessment');
    expect(report).toContain('Functional Assessment');
  });

  it('handles missing data gracefully', async () => {
    const partialData = {
      ...assessmentData,
      medicalHistory: undefined
    };
    const report = await generateReport(partialData, context);
    expect(report).toBeDefined();
    expect(report).toContain('OCCUPATIONAL THERAPY IN-HOME ASSESSMENT');
  });

  it('includes all required sections', async () => {
    const report = await generateReport(assessmentData, context);
    
    const requiredSections = [
      'Demographics',
      'Medical History',
      'ADL Assessment',
      'Environmental Assessment',
      'Functional Assessment'
    ];

    requiredSections.forEach(section => {
      expect(report).toContain(section);
    });
  });
});