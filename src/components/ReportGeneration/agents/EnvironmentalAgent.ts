import { BaseAgent } from './BaseAgent';
import { AgentContext, Assessment } from '../../types';
import _ from 'lodash';

interface EnvironmentalOutput {
  property: {
    type: string;
    description: string;
    accessibility: {
      entrance: string[];
      interior: string[];
    };
  };
  rooms: RoomAssessment[];
  safety: {
    hazards: string[];
    recommendations: string[];
  };
  modifications: {
    current: string[];
    recommended: string[];
  };
}

interface RoomAssessment {
  name: string;
  accessibility: {
    issues: string[];
    recommendations: string[];
  };
  safety: {
    hazards: string[];
    recommendations: string[];
  };
  modifications: {
    current: string[];
    recommended: string[];
  };
}

export class EnvironmentalAgent extends BaseAgent {
  constructor(context: AgentContext) {
    super(context);
    this.priority = 4;
    this.name = 'Environmental Assessment';
    this.dataKeys = ['environmental'];
  }

  async processData(data: Assessment): Promise<EnvironmentalOutput> {
    const env = _.get(data, 'environmental', {});
    
    const property = this.assessProperty(env);
    const rooms = this.assessRooms(env);
    const safety = this.assessSafety(env);
    const modifications = this.assessModifications(env);

    return {
      property,
      rooms,
      safety,
      modifications
    };
  }

  private assessProperty(env: any) {
    return {
      type: env.propertyType || 'Not specified',
      description: env.description || '',
      accessibility: {
        entrance: this.identifyEntranceIssues(env),
        interior: this.identifyInteriorIssues(env)
      }
    };
  }

  private identifyEntranceIssues(env: any): string[] {
    const issues: string[] = [];
    
    if (env.propertyOverview?.stairs) {
      issues.push('Stairs at entrance');
    }
    
    if (env.propertyOverview?.rooms?.some(room => room.hasStairs)) {
      issues.push('Interior level changes');
    }

    return issues;
  }

  private identifyInteriorIssues(env: any): string[] {
    const issues: string[] = [];
    const corridorWidth = env.propertyOverview?.corridorWidth;
    
    if (corridorWidth && corridorWidth < 36) {
      issues.push('Narrow corridors');
    }

    return issues;
  }

  private assessRooms(env: any): RoomAssessment[] {
    if (!Array.isArray(env.rooms)) return [];

    return env.rooms.map(room => this.assessRoom(room));
  }

  private assessRoom(room: any): RoomAssessment {
    return {
      name: room.name || 'Unnamed Room',
      accessibility: {
        issues: this.identifyRoomAccessibilityIssues(room),
        recommendations: this.generateAccessibilityRecommendations(room)
      },
      safety: {
        hazards: Array.isArray(room.hazards) ? room.hazards : [],
        recommendations: this.generateSafetyRecommendations(room)
      },
      modifications: {
        current: Array.isArray(room.modifications) ? room.modifications : [],
        recommended: this.generateModificationRecommendations(room)
      }
    };
  }

  private identifyRoomAccessibilityIssues(room: any): string[] {
    const issues: string[] = [];

    if (room.hasStairs) {
      issues.push('Level changes present');
    }

    if (room.name.toLowerCase().includes('bathroom')) {
      const bathrooms = room;
      if (!bathrooms.modifications?.includes('grab bars')) {
        issues.push('No grab bars installed');
      }
      if (!bathrooms.modifications?.includes('raised toilet')) {
        issues.push('Standard height toilet');
      }
    }

    return issues;
  }

  private generateAccessibilityRecommendations(room: any): string[] {
    const recommendations: string[] = [];
    const issues = this.identifyRoomAccessibilityIssues(room);

    if (issues.includes('Level changes present')) {
      recommendations.push('Consider ramp installation');
    }

    if (room.name.toLowerCase().includes('bathroom')) {
      if (issues.includes('No grab bars installed')) {
        recommendations.push('Install grab bars by toilet and in shower');
      }
      if (issues.includes('Standard height toilet')) {
        recommendations.push('Consider raised toilet seat or comfort height toilet');
      }
    }

    return recommendations;
  }

  private generateSafetyRecommendations(room: any): string[] {
    const recommendations: string[] = [];

    if (room.hazards?.includes('poor lighting')) {
      recommendations.push('Improve lighting');
    }

    if (room.hazards?.includes('loose rugs')) {
      recommendations.push('Secure or remove loose rugs');
    }

    return recommendations;
  }

  private generateModificationRecommendations(room: any): string[] {
    const recommendations: string[] = [];
    const currentMods = room.modifications || [];

    if (room.name.toLowerCase().includes('bathroom')) {
      if (!currentMods.includes('grab bars')) {
        recommendations.push('Install grab bars');
      }
      if (!currentMods.includes('non-slip mat')) {
        recommendations.push('Add non-slip mat in tub/shower');
      }
    }

    return recommendations;
  }

  private assessSafety(env: any): { hazards: string[]; recommendations: string[] } {
    const hazards: string[] = [];
    const recommendations: string[] = [];

    if (env.safety?.hazards) {
      hazards.push(...env.safety.hazards);
    }

    if (env.safety?.recommendations) {
      recommendations.push(...env.safety.recommendations);
    }

    return { hazards, recommendations };
  }

  private assessModifications(env: any): { current: string[]; recommended: string[] } {
    const current: string[] = [];
    const recommended: string[] = [];

    env.rooms?.forEach((room: any) => {
      if (Array.isArray(room.modifications)) {
        current.push(...room.modifications);
      }
      
      const roomRecommendations = this.generateModificationRecommendations(room);
      recommended.push(...roomRecommendations);
    });

    return {
      current: [...new Set(current)],
      recommended: [...new Set(recommended)]
    };
  }

  protected formatBrief(data: EnvironmentalOutput): string {
    const parts = ['Environmental Assessment Summary:'];

    if (data.safety.hazards.length > 0) {
      parts.push('\nKey Safety Concerns:');
      parts.push(data.safety.hazards.map(h => `- ${h}`).join('\n'));
    }

    if (data.modifications.recommended.length > 0) {
      parts.push('\nRecommended Modifications:');
      parts.push(data.modifications.recommended.map(r => `- ${r}`).join('\n'));
    }

    return parts.join('\n');
  }

  protected formatStandard(data: EnvironmentalOutput): string {
    const parts = ['Environmental Assessment'];

    // Property Overview
    parts.push('\nProperty Overview:');
    parts.push(`Type: ${data.property.type}`);
    if (data.property.accessibility.entrance.length > 0) {
      parts.push('Entrance Issues:');
      parts.push(data.property.accessibility.entrance.map(i => `- ${i}`).join('\n'));
    }

    // Safety Assessment
    if (data.safety.hazards.length > 0) {
      parts.push('\nSafety Concerns:');
      parts.push(data.safety.hazards.map(h => `- ${h}`).join('\n'));
    }

    // Modifications
    if (data.modifications.current.length > 0) {
      parts.push('\nCurrent Modifications:');
      parts.push(data.modifications.current.map(m => `- ${m}`).join('\n'));
    }

    if (data.modifications.recommended.length > 0) {
      parts.push('\nRecommended Modifications:');
      parts.push(data.modifications.recommended.map(r => `- ${r}`).join('\n'));
    }

    return parts.join('\n');
  }

  protected formatDetailed(data: EnvironmentalOutput): string {
    const parts = ['Detailed Environmental Assessment'];

    // Property Details
    parts.push('\nProperty Details:');
    parts.push(`Type: ${data.property.type}`);
    parts.push(`Description: ${data.property.description}`);

    if (data.property.accessibility.entrance.length > 0) {
      parts.push('\nEntrance Accessibility:');
      parts.push(data.property.accessibility.entrance.map(i => `- ${i}`).join('\n'));
    }

    if (data.property.accessibility.interior.length > 0) {
      parts.push('\nInterior Accessibility:');
      parts.push(data.property.accessibility.interior.map(i => `- ${i}`).join('\n'));
    }

    // Room-by-Room Assessment
    parts.push('\nRoom-by-Room Assessment:');
    data.rooms.forEach(room => {
      parts.push(`\n${room.name}:`);
      
      if (room.accessibility.issues.length > 0) {
        parts.push('Accessibility Issues:');
        parts.push(room.accessibility.issues.map(i => `- ${i}`).join('\n'));
      }

      if (room.safety.hazards.length > 0) {
        parts.push('Safety Hazards:');
        parts.push(room.safety.hazards.map(h => `- ${h}`).join('\n'));
      }

      if (room.modifications.current.length > 0) {
        parts.push('Current Modifications:');
        parts.push(room.modifications.current.map(m => `- ${m}`).join('\n'));
      }

      if (room.modifications.recommended.length > 0) {
        parts.push('Recommended Modifications:');
        parts.push(room.modifications.recommended.map(m => `- ${m}`).join('\n'));
      }
    });

    // Overall Safety Assessment
    parts.push('\nOverall Safety Assessment:');
    if (data.safety.hazards.length > 0) {
      parts.push('Identified Hazards:');
      parts.push(data.safety.hazards.map(h => `- ${h}`).join('\n'));
    }
    if (data.safety.recommendations.length > 0) {
      parts.push('\nSafety Recommendations:');
      parts.push(data.safety.recommendations.map(r => `- ${r}`).join('\n'));
    }

    // Modification Summary
    parts.push('\nModification Summary:');
    if (data.modifications.current.length > 0) {
      parts.push('Currently Implemented:');
      parts.push(data.modifications.current.map(m => `- ${m}`).join('\n'));
    }
    if (data.modifications.recommended.length > 0) {
      parts.push('\nRecommended Modifications:');
      parts.push(data.modifications.recommended.map(r => `- ${r}`).join('\n'));
    }

    return parts.join('\n');
  }
}