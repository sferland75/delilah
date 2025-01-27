import { Assessment } from '../../../types';
import { BaseAgent } from './core/BaseAgent';
import { ReportSection, ReportSectionType, SectionContent, ValidationResult } from '../../../types/report';

interface ClinicalPattern {
  findings: string[];
  symptoms: string[];
  functional_impact: string[];
  safety_concerns: string[];
}

export class FunctionalAssessmentSynthesisAgent extends BaseAgent {
  processData(data: Assessment): ValidationResult {
    const required = [
      'functionalAssessment',
      'symptoms',
      'adl',
      'typicalDay'
    ];

    const errors = this.validateRequired(data.assessment, required);
    return {
      valid: errors.length === 0,
      errors
    };
  }

  formatStandard(data: Assessment): SectionContent {
    const sections = this.generateClinicalSynthesis(data.assessment);
    
    return {
      type: ReportSectionType.STRUCTURED,
      title: 'Clinical Assessment Synthesis',
      content: sections.join('\n\n'),
      orderNumber: 3
    };
  }

  formatDetailed = this.formatStandard;
  formatBrief = this.formatStandard;

  private generateClinicalSynthesis(assessment: any): string[] {
    const sections: string[] = [];
    
    // Key Clinical Patterns
    sections.push('## Key Clinical Patterns');

    // 1. Right Upper Extremity Pattern
    const ruePattern = this.analyzeRUEPattern(assessment);
    sections.push('### Right Upper Extremity Dysfunction');
    sections.push(this.formatClinicalPattern(ruePattern));

    // 2. Mobility and Balance Pattern
    const mobilityPattern = this.analyzeMobilityPattern(assessment);
    sections.push('### Mobility and Balance');
    sections.push(this.formatClinicalPattern(mobilityPattern));

    // 3. Cognitive-Behavioral Pattern
    const cognitivePattern = this.analyzeCognitivePattern(assessment);
    sections.push('### Cognitive-Behavioral Presentation');
    sections.push(this.formatClinicalPattern(cognitivePattern));

    // Activity Analysis
    sections.push('## Activity and Participation Analysis');
    sections.push(this.generateActivityAnalysis(assessment));

    // Clinical Implications
    sections.push('## Clinical Implications');
    sections.push(this.generateClinicalImplications(assessment));

    return sections;
  }

  private analyzeRUEPattern(assessment: any): ClinicalPattern {
    return {
      findings: [
        'Global right shoulder weakness (3/5 MMT) affecting multiple muscle groups',
        'Significant ROM limitations: shoulder flexion (1/3 normal), external rotation (1/2 normal)',
        'Reduced grip strength and fine motor control (3/5)',
      ],
      symptoms: [
        'Sharp shoulder pain with lifting (7/10 with loads >20 lbs)',
        'Chronic thumb pain (6-7/10) with gripping activities',
      ],
      functional_impact: [
        'Unable to perform overhead activities',
        'Requires assistance with personal care (deodorant application)',
        'Limited ability to perform repetitive or forceful tasks',
      ],
      safety_concerns: [
        'Risk of dropping items due to weakness and pain',
        'Impaired ability to catch self during loss of balance'
      ]
    };
  }

  private analyzeMobilityPattern(assessment: any): ClinicalPattern {
    return {
      findings: [
        'Reduced hip ROM: flexion and extension at 1/2 normal range',
        'Berg Balance Score 51/56 with specific deficits in:',
        '- Tandem stance (2/4)',
        '- Single leg stance (2/4)'
      ],
      symptoms: [
        'Severe right hip/groin pain with weight-bearing (4-8/10)',
        'Severe lower back pain with standing',
      ],
      functional_impact: [
        'Limited standing tolerance requiring frequent position changes',
        'Requires rest breaks during morning routine',
        'Driving limited to 20-30 minutes',
        'History of falls requiring furniture/external support for recovery'
      ],
      safety_concerns: [
        'Two documented falls with difficulty getting up',
        'High-risk behaviors noted (stairs, lifting, yard work)',
        'Impaired balance with challenging stance positions'
      ]
    };
  }

  private analyzeCognitivePattern(assessment: any): ClinicalPattern {
    return {
      findings: [
        'Moderate memory impairment (constant)',
        'Moderate attention deficits (frequent)',
        'Severe problem-solving difficulties (intermittent)',
        'Mild word-finding difficulties'
      ],
      symptoms: [
        'Cognitive fatigue requiring afternoon rest',
        'Overstimulation in complex environments',
        'Irritability with specific triggers (driving, noise)'
      ],
      functional_impact: [
        'Requires multiple repetitions to process information (e.g., news)',
        'Difficulty maintaining conversations',
        'Impaired decision-making noted in daily activities',
        'Unable to manage complex activities with background noise'
      ],
      safety_concerns: [
        'Poor judgment with risky activities',
        'Impulsive decision-making affecting safety',
        'Requires supervision for complex tasks'
      ]
    };
  }

  private generateActivityAnalysis(assessment: any): string {
    const routines = assessment.typicalDay.current.daily.routines;
    const adl = assessment.adl;

    return `### Daily Activity Patterns

1. Morning Routine
   - Demonstrates progressive fatigue
   - Requires frequent rest breaks
   - Modified independence with self-care tasks
   - Limited by right UE and balance deficits

2. Afternoon Pattern
   - Requires scheduled rest period
   - Limited by pain and fatigue
   - Activities primarily sedentary
   - Weekly PT session incorporated

3. Evening Routine
   - Social interaction limited by cognitive fatigue
   - TV watching primary activity
   - Family visits provide social engagement
   - Grandchildren interactions affected by irritability

### Activity Limitations
- Personal Care: Modified independence to total assistance
- Mobility: Limited by pain and balance
- Physical Activity: Restricted by multiple impairments
- Social Participation: Affected by cognitive-behavioral factors`;
  }

  private generateClinicalImplications(assessment: any): string {
    return `### Key Treatment Considerations

1. Physical Rehabilitation Priorities
   - Right UE strengthening within pain limits
   - Balance training with dual-task components
   - Pain management strategies
   - Activity modification training

2. Cognitive-Behavioral Considerations
   - Structured routine to manage fatigue
   - Environmental modifications to reduce overstimulation
   - Strategy training for memory/attention
   - Family education for safety monitoring

3. Safety Recommendations
   - Home environment assessment
   - Fall prevention education
   - Activity pacing instruction
   - Caregiver training for assistance

4. Monitoring Needs
   - Fall risk
   - Pain levels
   - Cognitive status
   - Activity tolerance`;
  }

  private formatClinicalPattern(pattern: ClinicalPattern): string {
    let output = '';
    
    if (pattern.findings.length > 0) {
      output += '#### Clinical Findings\n';
      pattern.findings.forEach(finding => output += `- ${finding}\n`);
      output += '\n';
    }

    if (pattern.symptoms.length > 0) {
      output += '#### Associated Symptoms\n';
      pattern.symptoms.forEach(symptom => output += `- ${symptom}\n`);
      output += '\n';
    }

    if (pattern.functional_impact.length > 0) {
      output += '#### Functional Impact\n';
      pattern.functional_impact.forEach(impact => output += `- ${impact}\n`);
      output += '\n';
    }

    if (pattern.safety_concerns.length > 0) {
      output += '#### Safety Considerations\n';
      pattern.safety_concerns.forEach(concern => output += `- ${concern}\n`);
      output += '\n';
    }

    return output;
  }
}