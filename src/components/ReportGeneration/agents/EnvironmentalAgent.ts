import { BaseAgent } from './BaseAgent';

export class EnvironmentalAgent extends BaseAgent {
  constructor(context: any) {
    super(
      context,
      5,
      'Environmental Assessment',
      ['environmental.propertyOverview']
    );
  }

  process(data: any) {
    const env = data.environmental;

    return {
      property: this.processProperty(env.propertyOverview),
      rooms: this.processRooms(env.rooms),
      safety: this.processSafety(env.safety),
      accessibility: this.assessAccessibility(env)
    };
  }

  private processProperty(overview: any) {
    if (!overview) return null;

    return {
      modifications: overview.recommendedModifications || [],
      hazards: overview.identifiedHazards || [],
      rooms: Object.keys(overview.rooms || {})
    };
  }

  private processRooms(rooms: any[]) {
    if (!rooms?.length) return [];

    return rooms.map(room => ({
      name: room.name,
      hazards: room.hazards || [],
      modifications: room.modifications || [],
      notes: room.notes
    }));
  }

  private processSafety(safety: any) {
    if (!safety) return null;

    return {
      hazards: safety.hazards || [],
      recommendations: safety.recommendations || []
    };
  }

  private assessAccessibility(env: any) {
    const issues = [];

    // Check for stairs
    if (env.propertyOverview?.rooms?.some(room => room.hasStairs)) {
      issues.push('Multiple levels present - stair access required');
    }

    // Check bathroom accessibility
    const bathrooms = env.rooms?.filter(room => room.name.toLowerCase().includes('bathroom'));
    bathrooms?.forEach(bathroom => {
      if (!bathroom.hasGrabBars) {
        issues.push('Bathroom lacking grab bars');
      }
    });

    return issues;
  }

  format(data: any): string {
    let report = 'ENVIRONMENTAL ASSESSMENT\n\n';

    // Property Overview
    if (data.property) {
      report += 'Property Overview:\n';
      if (data.property.rooms?.length) {
        report += 'Rooms Present:\n';
        data.property.rooms.forEach((room: string) => {
          report += `• ${room}\n`;
        });
        report += '\n';
      }
    }

    // Room Details
    if (data.rooms?.length) {
      report += 'Room-Specific Assessments:\n\n';
      data.rooms.forEach((room: any) => {
        if (room.hazards?.length || room.modifications?.length || room.notes) {
          report += `${room.name}:\n`;
          if (room.hazards?.length) {
            room.hazards.forEach((hazard: string) => {
              report += `• Hazard: ${hazard}\n`;
            });
          }
          if (room.modifications?.length) {
            room.modifications.forEach((mod: string) => {
              report += `• Modification: ${mod}\n`;
            });
          }
          if (room.notes) report += `Notes: ${room.notes}\n`;
          report += '\n';
        }
      });
    }

    // Safety Concerns
    if (data.safety) {
      if (data.safety.hazards?.length) {
        report += 'Safety Hazards:\n';
        data.safety.hazards.forEach((hazard: string) => {
          report += `• ${hazard}\n`;
        });
        report += '\n';
      }

      if (data.safety.recommendations?.length) {
        report += 'Safety Recommendations:\n';
        data.safety.recommendations.forEach((rec: string) => {
          report += `• ${rec}\n`;
        });
        report += '\n';
      }
    }

    // Accessibility Issues
    if (data.accessibility?.length) {
      report += 'Accessibility Concerns:\n';
      data.accessibility.forEach((issue: string) => {
        report += `• ${issue}\n`;
      });
    }

    return report;
  }
}