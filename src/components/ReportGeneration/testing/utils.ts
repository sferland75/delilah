import { Assessment, ReportSection, ProcessedData } from '../../../types/report';
import { mockAssessmentData } from './mockData';

export const createTestSection = (overrides?: Partial<ReportSection>): ReportSection => ({
  orderNumber: 1,
  sectionName: 'Test Section',
  title: 'Test Section',
  content: 'Test content',
  valid: true,
  ...overrides
});

export const createTestData = (overrides?: Partial<Assessment>): Assessment => ({
  ...mockAssessmentData,
  ...overrides
});

export const createProcessedData = (overrides?: Partial<ProcessedData>): ProcessedData => ({
  valid: true,
  data: mockAssessmentData,
  errors: [],
  ...overrides
});

export const waitForProcessing = async (ms: number = 100): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const expectValidSection = (section: ReportSection) => {
  expect(section).toHaveProperty('orderNumber');
  expect(section).toHaveProperty('title');
  expect(section).toHaveProperty('content');
  expect(section.valid).toBe(true);
};

export const expectValidReport = (sections: ReportSection[]) => {
  expect(Array.isArray(sections)).toBe(true);
  expect(sections.length).toBeGreaterThan(0);
  sections.forEach(expectValidSection);
  
  // Verify order
  const orderNumbers = sections.map(s => s.orderNumber);
  const sortedOrderNumbers = [...orderNumbers].sort((a, b) => a - b);
  expect(orderNumbers).toEqual(sortedOrderNumbers);
};