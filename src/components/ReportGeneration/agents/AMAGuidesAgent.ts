import { BaseAgent } from './BaseAgent';
import { AgentContext, Assessment } from '../../types';
import _ from 'lodash';

interface AMAOutput {
  activities: {
    self: AMAMetric;
    life: AMAMetric;
    travel: AMAMetric;
  };
  impairments: {
    physical: AMAImpairment[];
    mental: AMAImpairment[];
  };
  analysis: {
    totalPhysicalImpairment: number;
    totalMentalImpairment: number;
    combinedImpairment: number;
  };
}

interface AMAMetric {
  class: number;
  description: string;
  limitations: string[];
}

interface AMAImpairment {
  bodyPart: string;
  percentage: number;
  rationale: string;
}

export class AMAGuidesAgent extends BaseAgent {
  constructor(context: AgentContext) {
    super(context);
    this.priority = 6;
    this.name = 'AMA Guides Assessment';
    this.dataKeys = ['amaGuides'];
  }

  async processData(data: Assessment): Promise<AMAOutput> {
    const amaData = _.get(data, 'amaGuides', {});

    const activities = {
      self: this.processMetric(_.get(amaData, 'activities.self', {})),
      life: this.processMetric(_.get(amaData, 'activities.life', {})),
      travel: this.processMetric(_.get(amaData, 'activities.travel', {}))
    };

    const impairments = {
      physical: this.processImpairments(_.get(amaData, 'impairments.physical', [])),
      mental: this.processImpairments(_.get(amaData, 'impairments.mental', []))
    };

    const analysis = this.calculateTotalImpairment(impairments);

    return {
      activities,
      impairments,
      analysis
    };
  }

  private processMetric(data: any): AMAMetric {
    return {
      class: data.class || 1,
      description: data.description || 'No significant limitations',
      limitations: Array.isArray(data.limitations) ? data.limitations : []
    };
  }

  private processImpairments(impairments: any[]): AMAImpairment[] {
    if (!Array.isArray(impairments)) return [];
    
    return impairments.map(imp => ({
      bodyPart: imp.body_part || imp.bodyPart || 'Unspecified',
      percentage: typeof imp.percentage === 'number' ? imp.percentage : 0,
      rationale: imp.rationale || 'No rationale provided'
    }));
  }

  private calculateTotalImpairment(impairments: {
    physical: AMAImpairment[];
    mental: AMAImpairment[];
  }): {
    totalPhysicalImpairment: number;
    totalMentalImpairment: number;
    combinedImpairment: number;
  } {
    const totalPhysical = impairments.physical.reduce((sum, imp) => sum + imp.percentage, 0);
    const totalMental = impairments.mental.reduce((sum, imp) => sum + imp.percentage, 0);
    
    // Combined impairment using combined values formula
    const combined = 100 - ((100 - totalPhysical) * (100 - totalMental) / 100);

    return {
      totalPhysicalImpairment: totalPhysical,
      totalMentalImpairment: totalMental,
      combinedImpairment: Number(combined.toFixed(1))
    };
  }

  protected formatBrief(data: AMAOutput): string {
    const parts = ['AMA Guides Assessment Summary:'];
    
    if (data.analysis.combinedImpairment > 0) {
      parts.push(`Combined Impairment: ${data.analysis.combinedImpairment}%`);
    } else {
      parts.push('No significant impairment identified');
    }

    return parts.join('\n');
  }

  protected formatStandard(data: AMAOutput): string {
    const parts = ['AMA Guides Assessment'];

    // Activities
    parts.push('\nActivity Classifications:');
    Object.entries(data.activities).forEach(([domain, metric]) => {
      parts.push(`${domain.charAt(0).toUpperCase() + domain.slice(1)}:`);
      parts.push(`- Class ${metric.class}`);
      if (metric.limitations.length > 0) {
        parts.push(`- Limitations: ${metric.limitations.join(', ')}`);
      }
    });

    // Impairments
    if (data.impairments.physical.length > 0) {
      parts.push('\nPhysical Impairments:');
      data.impairments.physical.forEach(imp => {
        parts.push(`- ${imp.bodyPart}: ${imp.percentage}%`);
      });
      parts.push(`Total Physical Impairment: ${data.analysis.totalPhysicalImpairment}%`);
    }

    if (data.impairments.mental.length > 0) {
      parts.push('\nMental Impairments:');
      data.impairments.mental.forEach(imp => {
        parts.push(`- ${imp.bodyPart}: ${imp.percentage}%`);
      });
      parts.push(`Total Mental Impairment: ${data.analysis.totalMentalImpairment}%`);
    }

    parts.push(`\nCombined Impairment Rating: ${data.analysis.combinedImpairment}%`);

    return parts.join('\n');
  }

  protected formatDetailed(data: AMAOutput): string {
    const parts = ['AMA Guides Detailed Assessment'];

    // Activities
    parts.push('\nActivity Classifications:');
    Object.entries(data.activities).forEach(([domain, metric]) => {
      parts.push(`\n${domain.charAt(0).toUpperCase() + domain.slice(1)}:`);
      parts.push(`Class: ${metric.class}`);
      parts.push(`Description: ${metric.description}`);
      if (metric.limitations.length > 0) {
        parts.push('Limitations:');
        metric.limitations.forEach(lim => parts.push(`- ${lim}`));
      }
    });

    // Physical Impairments
    if (data.impairments.physical.length > 0) {
      parts.push('\nPhysical Impairments:');
      data.impairments.physical.forEach(imp => {
        parts.push(`\n${imp.bodyPart}:`);
        parts.push(`Percentage: ${imp.percentage}%`);
        parts.push(`Rationale: ${imp.rationale}`);
      });
      parts.push(`\nTotal Physical Impairment: ${data.analysis.totalPhysicalImpairment}%`);
    }

    // Mental Impairments
    if (data.impairments.mental.length > 0) {
      parts.push('\nMental Impairments:');
      data.impairments.mental.forEach(imp => {
        parts.push(`\n${imp.bodyPart}:`);
        parts.push(`Percentage: ${imp.percentage}%`);
        parts.push(`Rationale: ${imp.rationale}`);
      });
      parts.push(`\nTotal Mental Impairment: ${data.analysis.totalMentalImpairment}%`);
    }

    // Combined Analysis
    parts.push('\nCombined Impairment Analysis:');
    parts.push(`Physical Component: ${data.analysis.totalPhysicalImpairment}%`);
    parts.push(`Mental Component: ${data.analysis.totalMentalImpairment}%`);
    parts.push(`Combined Rating: ${data.analysis.combinedImpairment}%`);

    return parts.join('\n');
  }
}