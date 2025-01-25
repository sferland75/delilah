import { IndependenceLevel } from './ADLTypes';

export interface IADLSafetyPattern {
  triggers: string[];
  risk: string;
  mitigation: string;
}

export interface IADLRiskPatterns {
  [key: string]: IADLSafetyPattern[];
}

export const LEVEL_ORDER: { [key in IndependenceLevel]: number } = {
  'independent': 7,
  'modified_independent': 6,
  'supervision': 5,
  'minimal_assistance': 4,
  'moderate_assistance': 3,
  'maximal_assistance': 2,
  'total_assistance': 1,
  'not_applicable': 0
};

export const COMMON_ADAPTATIONS: { [key: string]: string[] } = {
  cleaning: ['Lightweight equipment', 'Extended handles', 'Frequent rest breaks'],
  shopping: ['Electric cart', 'Delivery services', 'Shopping assistant'],
  transportation: ['Transportation service', 'Modified vehicle controls', 'Route planning'],
  meal_prep: ['Seated workstation', 'Modified utensils', 'Meal delivery service'],
  laundry: ['Front loading machines', 'Laundry service', 'Assistive devices'],
  home_maintenance: ['Home maintenance service', 'Adapted tools', 'Task modification']
};