import { Assessment } from '../../../types';
import { BaseAgent } from './core/BaseAgent';
import { ReportSection, ReportSectionType, SectionContent, ValidationResult } from '../../../types/report';

export class FunctionalAssessmentAgent extends BaseAgent {
  processData(data: Assessment): ValidationResult {
    const assessment = data.assessment.functionalAssessment;
    
    if (!assessment) {
      return {
        valid: false,
        errors: ['Missing functional assessment data']
      };
    }

    const errors = this.validateRequired(assessment, [
      'rangeOfMotion',
      'manualMuscleTesting',
      'bergBalance'
    ]);

    return {
      valid: errors.length === 0,
      errors
    };
  }

  formatBrief(data: Assessment): SectionContent {
    const assessment = data.assessment.functionalAssessment;
    const sections = this.generateBriefSummary(assessment);

    return {
      type: ReportSectionType.STRUCTURED,
      title: 'Functional Assessment Summary',
      content: sections.join('\n\n'),
      orderNumber: 4
    };
  }

  formatDetailed(data: Assessment): SectionContent {
    const assessment = data.assessment.functionalAssessment;
    const sections = this.generateDetailedSummary(assessment);

    return {
      type: ReportSectionType.STRUCTURED,
      title: 'Detailed Functional Assessment',
      content: sections.join('\n\n'),
      orderNumber: 4
    };
  }

  formatStandard(data: Assessment): SectionContent {
    const assessment = data.assessment.functionalAssessment;
    const sections = this.generateStandardSummary(assessment);

    return {
      type: ReportSectionType.STRUCTURED,
      title: 'Functional Assessment',
      content: sections.join('\n\n'),
      orderNumber: 4
    };
  }

  private generateBriefSummary(assessment: any): string[] {
    const sections: string[] = ['## Functional Status Overview'];

    // ROM Summary
    const romLimitations = assessment.rangeOfMotion.measurements
      .filter((m: any) => m.notes && !m.notes.includes('No identified limitations'))
      .map((m: any) => ({
        joint: m.joint,
        movement: m.movement,
        notes: m.notes
      }));

    if (romLimitations.length > 0) {
      sections.push('### Range of Motion Limitations');
      romLimitations.forEach((limitation: any) => {
        sections.push(`- ${limitation.joint} ${limitation.movement}: ${limitation.notes}`);
      });
    }

    // MMT Summary
    const muscleGrades = assessment.manualMuscleTesting.grades;
    const weaknesses = [];
    for (const joint in muscleGrades) {
      for (const muscle in muscleGrades[joint]) {
        for (const movement in muscleGrades[joint][muscle]) {
          const grades = muscleGrades[joint][muscle][movement];
          if (grades.right && Number(grades.right) <= 3) {
            weaknesses.push(`${joint} ${muscle} (${movement}): ${grades.right}/5`);
          }
          if (grades.left && Number(grades.left) <= 3) {
            weaknesses.push(`${joint} ${muscle} (${movement}): ${grades.left}/5`);
          }
        }
      }
    }

    if (weaknesses.length > 0) {
      sections.push('### Notable Muscle Weakness');
      weaknesses.forEach(weakness => sections.push(`- ${weakness}`));
    }

    // Balance Summary
    const bergScore = assessment.bergBalance.totalScore;
    sections.push('### Balance Assessment');
    sections.push(`Berg Balance Score: ${bergScore}/56`);
    if (assessment.bergBalance.generalNotes) {
      sections.push(assessment.bergBalance.generalNotes);
    }

    return sections;
  }

  private generateDetailedSummary(assessment: any): string[] {
    const sections: string[] = [];

    // Range of Motion
    sections.push('## Range of Motion Assessment');
    const measurements = assessment.rangeOfMotion.measurements;
    let currentJoint = '';

    measurements.forEach((m: any) => {
      if (m.joint !== currentJoint) {
        sections.push(`\n### ${m.joint}`);
        currentJoint = m.joint;
      }

      sections.push(`#### ${m.movement}`);
      sections.push(`- Normal ROM: ${m.normalROM}`);
      sections.push(`- Left: Active ${m.left.active}, Passive ${m.left.passive}${m.painLeft ? ' (Pain)' : ''}`);
      sections.push(`- Right: Active ${m.right.active}, Passive ${m.right.passive}${m.painRight ? ' (Pain)' : ''}`);
      if (m.notes) sections.push(`- Notes: ${m.notes}`);
    });

    // Manual Muscle Testing
    sections.push('\n## Manual Muscle Testing');
    const grades = assessment.manualMuscleTesting.grades;
    
    for (const joint in grades) {
      sections.push(`\n### ${joint}`);
      for (const muscle in grades[joint]) {
        sections.push(`#### ${muscle}`);
        for (const movement in grades[joint][muscle]) {
          const score = grades[joint][muscle][movement];
          const left = score.left ? `Left: ${score.left}/5` : '';
          const right = score.right ? `Right: ${score.right}/5` : '';
          const scores = [left, right].filter(Boolean).join(', ');
          sections.push(`- ${movement}: ${scores}`);
        }
      }
    }

    // Berg Balance
    sections.push('\n## Berg Balance Scale');
    sections.push(`Total Score: ${assessment.bergBalance.totalScore}/56`);
    
    const items = assessment.bergBalance.items;
    for (const item in items) {
      const formattedName = this.formatBalanceItem(item);
      sections.push(`\n### ${formattedName}`);
      sections.push(`Score: ${items[item].score}/4`);
      if (items[item].notes) sections.push(items[item].notes);
    }

    if (assessment.bergBalance.generalNotes) {
      sections.push('\n### Additional Balance Notes');
      sections.push(assessment.bergBalance.generalNotes);
    }

    return sections;
  }

  private generateStandardSummary(assessment: any): string[] {
    const sections: string[] = [];

    // ROM Summary by Joint
    sections.push('## Range of Motion');
    let currentJoint = '';
    assessment.rangeOfMotion.measurements.forEach((m: any) => {
      if (m.joint !== currentJoint) {
        sections.push(`\n### ${m.joint}`);
        currentJoint = m.joint;
      }
      if (m.notes && !m.notes.includes('No identified limitations')) {
        sections.push(`- ${m.movement}: ${m.notes}`);
      }
    });

    // Key Muscle Strength Findings
    sections.push('\n## Muscle Strength');
    const grades = assessment.manualMuscleTesting.grades;
    for (const joint in grades) {
      const weaknesses = [];
      for (const muscle in grades[joint]) {
        for (const movement in grades[joint][muscle]) {
          const score = grades[joint][muscle][movement];
          if (score.right && Number(score.right) <= 3) {
            weaknesses.push(`${muscle} ${movement} (Right): ${score.right}/5`);
          }
          if (score.left && Number(score.left) <= 3) {
            weaknesses.push(`${muscle} ${movement} (Left): ${score.left}/5`);
          }
        }
      }
      if (weaknesses.length > 0) {
        sections.push(`\n### ${joint}`);
        weaknesses.forEach(w => sections.push(`- ${w}`));
      }
    }

    // Balance Summary
    sections.push('\n## Balance Assessment');
    sections.push(`Berg Balance Score: ${assessment.bergBalance.totalScore}/56`);
    
    // List items scoring 2 or less
    const lowScoreItems = Object.entries(assessment.bergBalance.items)
      .filter(([_, value]: [string, any]) => value.score <= 2)
      .map(([item, value]: [string, any]) => ({
        name: this.formatBalanceItem(item),
        score: value.score,
        notes: value.notes
      }));

    if (lowScoreItems.length > 0) {
      sections.push('\n### Areas of Concern');
      lowScoreItems.forEach(item => {
        sections.push(`- ${item.name}: ${item.score}/4`);
        if (item.notes) sections.push(`  ${item.notes}`);
      });
    }

    if (assessment.bergBalance.generalNotes) {
      sections.push('\n### Balance Notes');
      sections.push(assessment.bergBalance.generalNotes);
    }

    return sections;
  }

  private formatBalanceItem(item: string): string {
    return item
      .split(/(?=[A-Z])/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
}