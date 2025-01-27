import { AgentContext } from '../../../types/report';
import { DEFAULT_FEATURES } from '../../../types/features';
import { BaseAgent } from './BaseAgent';
import { ADLAgent } from './ADLAgent';
import { AMAGuidesAgent } from './AMAGuidesAgent';
import { AttendantCareAgent } from './AttendantCareAgent';
import { DemographicsAgent } from './DemographicsAgent';
import { DocumentationAgent } from './DocumentationAgent';
import { EnvironmentalAgent } from './EnvironmentalAgent';
import { MedicalHistoryAgent } from './MedicalHistoryAgent';
import { MobilityAgent } from './MobilityAgent';
import { SymptomsAgent } from './SymptomsAgent';
import { TransfersAgent } from './TransfersAgent';
import { TypicalDayAgent } from './TypicalDayAgent';

export type AgentType = 
  | 'adl'
  | 'amaGuides'
  | 'attendantCare'
  | 'demographics'
  | 'documentation'
  | 'environmental'
  | 'medicalHistory'
  | 'mobility'
  | 'symptoms'
  | 'transfers'
  | 'typicalDay';

export const createAgent = (type: AgentType, context: AgentContext): BaseAgent => {
  // Ensure context has feature flags
  const enhancedContext: AgentContext = {
    ...context,
    features: {
      ...DEFAULT_FEATURES,
      ...(context.features || {})
    }
  };

  switch (type) {
    case 'adl':
      return new ADLAgent(enhancedContext);
    case 'amaGuides':
      return new AMAGuidesAgent(enhancedContext);
    case 'attendantCare':
      return new AttendantCareAgent(enhancedContext);
    case 'demographics':
      return new DemographicsAgent(enhancedContext);
    case 'documentation':
      return new DocumentationAgent(enhancedContext);
    case 'environmental':
      return new EnvironmentalAgent(enhancedContext);
    case 'medicalHistory':
      return new MedicalHistoryAgent(enhancedContext);
    case 'mobility':
      return new MobilityAgent(enhancedContext);
    case 'symptoms':
      return new SymptomsAgent(enhancedContext);
    case 'transfers':
      return new TransfersAgent(enhancedContext);
    case 'typicalDay':
      return new TypicalDayAgent(enhancedContext);
    default:
      throw new Error(`Unknown agent type: ${type}`);
  }
};

// Helper to create an agent with narrative enabled
export const createNarrativeAgent = (type: AgentType, context: AgentContext): BaseAgent => {
  return createAgent(type, {
    ...context,
    features: {
      ...DEFAULT_FEATURES,
      ...(context.features || {}),
      enableNarrative: true
    }
  });
};