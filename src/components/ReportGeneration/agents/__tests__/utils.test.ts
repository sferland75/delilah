import { validateData, formatDate, sanitizeText, createSection } from '../utils';

describe('Utils', () => {
  describe('validateData', () => {
    it('should validate required fields correctly', () => {
      const data = {
        demographics: {
          firstName: 'John',
          lastName: 'Doe'
        }
      };
      
      expect(validateData(data, ['demographics.firstName'])).toBe(true);
      expect(validateData(data, ['demographics.missing'])).toBe(false);
    });
  });

  describe('formatDate', () => {
    it('should format dates correctly', () => {
      expect(formatDate('2025-01-14')).toContain('2025');
      expect(formatDate('')).toBe('');
    });
  });

  describe('sanitizeText', () => {
    it('should remove unsafe content', () => {
      expect(sanitizeText('<script>alert("test")</script>')).toBe('scriptalert("test")/script');
    });
  });

  describe('createSection', () => {
    it('should create a valid section', () => {
      const section = createSection('Test', 'Content', 1);
      expect(section.title).toBe('Test');
      expect(section.content).toBe('Content');
      expect(section.order).toBe(1);
      expect(section.isValid).toBe(true);
    });
  });
});