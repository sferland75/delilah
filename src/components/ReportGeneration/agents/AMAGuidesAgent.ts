import { BaseAgent } from './BaseAgent';

export class AMAGuidesAgent extends BaseAgent {
  constructor(context: any) {
    super(
      context,
      6,
      'AMA Guides Assessment',
      ['amaGuides']
    );
  }

  process(data: any) {
    const ama = data.amaGuides;
    if (!ama) return null;

    return {
      activities: this.processActivities(ama.activities),
      social: this.processSocial(ama.social),
      concentration: this.processConcentration(ama.concentration),
      workAdaptation: this.processWorkAdaptation(ama.workAdaptation),
      overallRating: ama.overallRating,
      generalNotes: ama.generalNotes,
      impairmentClass: this.calculateImpairmentClass(ama)
    };
  }

  private processActivities(activities: any) {
    if (!activities) return null;

    return {
      self: this.rateImpairment(activities.self),
      travel: this.rateImpairment(activities.travel),
      social: this.rateImpairment(activities.social),
      recreational: this.rateImpairment(activities.recreational)
    };
  }

  private processSocial(social: any) {
    if (!social) return null;

    return {
      family: this.rateImpairment(social.family),
      friends: this.rateImpairment(social.friends),
      community: this.rateImpairment(social.community)
    };
  }

  private processConcentration(concentration: any) {
    if (!concentration) return null;

    return {
      tasks: this.rateImpairment(concentration.tasks),
      pace: this.rateImpairment(concentration.pace),
      adaptability: this.rateImpairment(concentration.adaptability)
    };
  }

  private processWorkAdaptation(workAdaptation: any) {
    if (!workAdaptation) return null;

    return {
      performance: this.rateImpairment(workAdaptation.performance),
      flexibility: this.rateImpairment(workAdaptation.flexibility),
      sustainability: this.rateImpairment(workAdaptation.sustainability)
    };
  }

  private rateImpairment(score: number): string {
    if (score === undefined || score === null) return 'Not Assessed';
    
    // Based on AMA Guides 4th Edition
    if (score <= 1) return 'No Impairment';
    if (score <= 2) return 'Mild Impairment';
    if (score <= 3) return 'Moderate Impairment';
    if (score <= 4) return 'Severe Impairment';
    return 'Very Severe Impairment';
  }

  private calculateImpairmentClass(ama: any): string {
    const scores = [
      ...Object.values(ama.activities || {}),
      ...Object.values(ama.social || {}),
      ...Object.values(ama.concentration || {}),
      ...Object.values(ama.workAdaptation || {})
    ].filter(score => typeof score === 'number');

    if (scores.length === 0) return 'Unable to Determine';

    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;

    if (avgScore <= 1) return 'Class 1: No Impairment';
    if (avgScore <= 2) return 'Class 2: Mild Impairment';
    if (avgScore <= 3) return 'Class 3: Moderate Impairment';
    if (avgScore <= 4) return 'Class 4: Marked Impairment';
    return 'Class 5: Extreme Impairment';
  }

  format(data: any): string {
    if (!data) return 'AMA GUIDES ASSESSMENT\n\nInsufficient data for assessment.\n';

    let report = 'AMA GUIDES ASSESSMENT\n\n';

    // Overall Classification
    report += `Impairment Classification: ${data.impairmentClass}\n\n`;

    // Activities
    if (data.activities) {
      report += 'Activities of Daily Living:\n';
      const act = data.activities;
      report += `• Self Care: ${act.self}\n`;
      report += `• Travel: ${act.travel}\n`;
      report += `• Social Activities: ${act.social}\n`;
      report += `• Recreational Activities: ${act.recreational}\n\n`;
    }

    // Social
    if (data.social) {
      report += 'Social Functioning:\n';
      const soc = data.social;
      report += `• Family: ${soc.family}\n`;
      report += `• Friends: ${soc.friends}\n`;
      report += `• Community: ${soc.community}\n\n`;
    }

    // Concentration
    if (data.concentration) {
      report += 'Concentration, Persistence and Pace:\n';
      const conc = data.concentration;
      report += `• Task Completion: ${conc.tasks}\n`;
      report += `• Work Pace: ${conc.pace}\n`;
      report += `• Adaptability: ${conc.adaptability}\n\n`;
    }

    // Work Adaptation
    if (data.workAdaptation) {
      report += 'Work Adaptation:\n';
      const work = data.workAdaptation;
      report += `• Performance: ${work.performance}\n`;
      report += `• Flexibility: ${work.flexibility}\n`;
      report += `• Sustainability: ${work.sustainability}\n\n`;
    }

    // Notes
    if (data.generalNotes) {
      report += 'Additional Observations:\n';
      report += data.generalNotes + '\n\n';
    }

    return report;
  }
}