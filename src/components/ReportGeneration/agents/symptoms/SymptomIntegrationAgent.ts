import { BaseAgent } from '../BaseAgent';
import { AgentContext } from '../types';
import { SymptomData, ProcessedSymptomData } from './SymptomTypes';
import { PhysicalSymptomsAgent } from './PhysicalSymptomsAgent';
import { CognitiveSymptomAgent } from './CognitiveSymptomAgent';
import { EmotionalSymptomAgent } from './EmotionalSymptomAgent';

export class SymptomIntegrationAgent extends BaseAgent {
  constructor(context: AgentContext) {
    super(context, 3.0, 'Symptom Integration', [
      'symptoms.physical',
      'symptoms.cognitive',
      'symptoms.emotional'
    ]);
  }

  protected initializeValidationRules(): void {
    // Validation handled by individual agents
  }

  protected getSectionKeys(): string[] {
    return [
      'physical',
      'cognitive',
      'emotional',
      'patterns',
      'overall'
    ];
  }

  async processData(data: any): Promise<ProcessedSymptomData> {
    // Process through individual agents
    const physicalAgent = new PhysicalSymptomsAgent(this.context);
    const cognitiveAgent = new CognitiveSymptomAgent(this.context);
    const emotionalAgent = new EmotionalSymptomAgent(this.context);

    const physical = await physicalAgent.processData(data.symptoms.physical);
    const cognitive = await cognitiveAgent.processData(data.symptoms.cognitive);
    const emotional = await emotionalAgent.processData(data.symptoms.emotional);

    // Identify cross-symptom patterns
    const patterns = this.identifyPatterns(physical, cognitive, emotional);

    // Analyze overall impact
    const overall = this.analyzeOverallImpact(physical, cognitive, emotional);

    return {
      physical,
      cognitive,
      emotional,
      patterns,
      overall
    };
  }

  private identifyPatterns(
    physical: SymptomData[],
    cognitive: SymptomData[],
    emotional: SymptomData[]
  ) {
    return {
      timeOfDay: this.identifyTimePatterns([...physical, ...cognitive, ...emotional]),
      weather: this.identifyWeatherPatterns(physical),
      activities: this.identifyActivityPatterns([...physical, ...cognitive, ...emotional])
    };
  }

  private identifyTimePatterns(symptoms: SymptomData[]): string[] {
    const patterns = [];
    const morningSymptoms = symptoms.filter(s => 
      s.impact?.toLowerCase().includes('morning'));
    const eveningSymptoms = symptoms.filter(s => 
      s.impact?.toLowerCase().includes('evening') || 
      s.impact?.toLowerCase().includes('night'));

    if (morningSymptoms.length > 0) {
      patterns.push('Symptoms typically worse in morning');
    }
    if (eveningSymptoms.length > 0) {
      patterns.push('Symptoms intensify in evening');
    }

    return patterns;
  }

  private identifyWeatherPatterns(physical: SymptomData[]): string[] {
    const patterns = [];
    const weatherSensitive = physical.filter(s => 
      s.aggravating?.toLowerCase().includes('weather') ||
      s.aggravating?.toLowerCase().includes('cold') ||
      s.aggravating?.toLowerCase().includes('damp')
    );

    if (weatherSensitive.length > 0) {
      patterns.push('Weather sensitivity noted');
      if (weatherSensitive.some(s => s.aggravating?.toLowerCase().includes('cold'))) {
        patterns.push('Cold weather particularly aggravating');
      }
    }

    return patterns;
  }

  private identifyActivityPatterns(symptoms: SymptomData[]): string[] {
    const patterns = [];
    
    // Check for physical activity triggers
    const liftingRelated = symptoms.filter(s => 
      s.aggravating?.toLowerCase().includes('lift') ||
      s.aggravating?.toLowerCase().includes('load')
    );
    
    const movementRelated = symptoms.filter(s => 
      s.aggravating?.toLowerCase().includes('step') ||
      s.aggravating?.toLowerCase().includes('stand') ||
      s.aggravating?.toLowerCase().includes('mov')
    );

    if (liftingRelated.length > 0 || movementRelated.length > 0) {
      patterns.push('Activity-dependent symptom exacerbation');
    }

    const highImpact = symptoms.filter(s => 
      (s.severity === 'Severe' || s.severity === 'Very Severe') &&
      (s.aggravating?.toLowerCase().includes('activity') ||
       s.aggravating?.toLowerCase().includes('movement') ||
       s.aggravating?.toLowerCase().includes('exertion') ||
       s.aggravating?.toLowerCase().includes('lift') ||
       s.aggravating?.toLowerCase().includes('step'))
    );

    if (highImpact.length > 0) {
      patterns.push('Severe symptoms with physical exertion');
    }

    return patterns;
  }

  private analyzeOverallImpact(
    physical: SymptomData[],
    cognitive: SymptomData[],
    emotional: SymptomData[]
  ): { mostSevere: string; mostFrequent: string; primaryLimitations: string[] } {
    const allSymptoms = [...physical, ...cognitive, ...emotional];
    
    // Find most severe symptom
    const severityOrder = ['Very Severe', 'Severe', 'Moderate', 'Mild', 'None'];
    const mostSevereSymptom = allSymptoms.reduce((prev, curr) => {
      const prevSeverityIndex = severityOrder.indexOf(prev.severity);
      const currSeverityIndex = severityOrder.indexOf(curr.severity);
      return currSeverityIndex < prevSeverityIndex ? curr : prev;
    });

    // Find most frequent symptom
    const frequencyOrder = ['Constantly', 'Most of the time', 'Often', 'Sometimes', 'Rarely'];
    const mostFrequentSymptom = allSymptoms.reduce((prev, curr) => {
      const prevFrequencyIndex = frequencyOrder.indexOf(prev.frequency);
      const currFrequencyIndex = frequencyOrder.indexOf(curr.frequency);
      return currFrequencyIndex < prevFrequencyIndex ? curr : prev;
    });

    // Identify primary limitations
    const primaryLimitations = this.identifyPrimaryLimitations(physical, cognitive, emotional);

    return {
      mostSevere: `${mostSevereSymptom.location || mostSevereSymptom.painType} (${mostSevereSymptom.severity})`,
      mostFrequent: `${mostFrequentSymptom.location || mostFrequentSymptom.painType} (${mostFrequentSymptom.frequency})`,
      primaryLimitations
    };
  }

  private identifyPrimaryLimitations(
    physical: SymptomData[],
    cognitive: SymptomData[],
    emotional: SymptomData[]
  ): string[] {
    const limitations = [];

    // Physical limitations
    const severePhysical = physical.filter(s => 
      s.severity === 'Severe' || s.severity === 'Very Severe'
    );
    if (severePhysical.length > 0) {
      limitations.push('Significant physical functional restrictions');
      if (severePhysical.some(s => s.location?.toLowerCase().includes('back') || 
                                  s.location?.toLowerCase().includes('spine'))) {
        limitations.push('Limited mobility due to spinal symptoms');
      }
    }

    // Cognitive limitations
    const significantCognitive = cognitive.filter(s => 
      s.severity === 'Severe' || s.severity === 'Moderate'
    );
    if (significantCognitive.length > 0) {
      limitations.push('Cognitive processing difficulties');
      if (significantCognitive.some(s => 
        s.location === 'Memory' || s.location === 'Attention'
      )) {
        limitations.push('Memory and attention deficits affecting daily function');
      }
    }

    // Emotional limitations
    const significantEmotional = emotional.filter(s => 
      s.severity === 'Severe' || s.severity === 'Moderate'
    );
    if (significantEmotional.length > 0) {
      limitations.push('Emotional regulation challenges');
      if (significantEmotional.some(s => s.impact?.toLowerCase().includes('social'))) {
        limitations.push('Social interaction difficulties');
      }
    }

    return limitations;
  }

  protected formatByDetailLevel(data: ProcessedSymptomData, level: string): string {
    switch (level) {
      case 'brief':
        return this.formatBrief(data);
      case 'standard':
        return this.formatStandard(data);
      case 'detailed':
        return this.formatDetailed(data);
      default:
        return this.formatStandard(data);
    }
  }

  private formatBrief(data: ProcessedSymptomData): string {
    return `
## Symptoms Overview
Most Severe: ${data.overall.mostSevere}
Most Frequent: ${data.overall.mostFrequent}

Primary Limitations:
${data.overall.primaryLimitations.map(l => `- ${l}`).join('\n')}
    `.trim();
  }

  private formatStandard(data: ProcessedSymptomData): string {
    return `
## Symptoms Assessment

### Physical Symptoms
${this.formatSymptomList(data.physical)}

### Cognitive Symptoms
${this.formatSymptomList(data.cognitive)}

### Emotional Symptoms
${this.formatSymptomList(data.emotional)}

### Overall Impact
Most Severe Symptom: ${data.overall.mostSevere}
Most Frequent Symptom: ${data.overall.mostFrequent}

Primary Limitations:
${data.overall.primaryLimitations.map(l => `- ${l}`).join('\n')}
    `.trim();
  }

  private formatDetailed(data: ProcessedSymptomData): string {
    return `
## Comprehensive Symptoms Assessment

### Physical Symptoms
${this.formatDetailedSymptoms(data.physical)}

### Cognitive Symptoms
${this.formatDetailedSymptoms(data.cognitive)}

### Emotional Symptoms
${this.formatDetailedSymptoms(data.emotional)}

### Identified Patterns
Time of Day Patterns:
${data.patterns.timeOfDay?.map(p => `- ${p}`).join('\n') || '- None identified'}

Weather-Related Patterns:
${data.patterns.weather?.map(p => `- ${p}`).join('\n') || '- None identified'}

Activity-Related Patterns:
${data.patterns.activities?.map(p => `- ${p}`).join('\n') || '- None identified'}

### Overall Impact Assessment
Most Severe Symptom: ${data.overall.mostSevere}
Most Frequent Symptom: ${data.overall.mostFrequent}

Primary Functional Limitations:
${data.overall.primaryLimitations.map(l => `- ${l}`).join('\n')}
    `.trim();
  }

  private formatSymptomList(symptoms: SymptomData[]): string {
    return symptoms
      .map(s => `- ${s.location || s.painType}: ${s.severity} (${s.frequency})`)
      .join('\n');
  }

  private formatDetailedSymptoms(symptoms: SymptomData[]): string {
    return symptoms
      .map(s => `
#### ${s.location || s.painType}
- Severity: ${s.severity}
- Frequency: ${s.frequency}
${s.aggravating ? `- Aggravating Factors: ${s.aggravating}` : ''}
${s.relieving ? `- Relieving Factors: ${s.relieving}` : ''}
${s.impact ? `- Impact: ${s.impact}` : ''}
${s.management ? `- Management: ${s.management}` : ''}`
      ).join('\n');
  }
}