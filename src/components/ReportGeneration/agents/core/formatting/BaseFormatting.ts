import { FormattingHelper } from '../types';

export abstract class BaseFormatting implements FormattingHelper {
  protected sectionTitle: string;

  constructor(sectionTitle: string) {
    this.sectionTitle = sectionTitle;
  }

  protected formatHeader(level: string): string {
    return `${this.sectionTitle} (${level} format)\n`;
  }

  protected formatField(label: string, value: any): string {
    if (value === undefined || value === null) return '';
    return `${label}: ${value}\n`;
  }

  protected formatList(items: string[]): string {
    if (!items || items.length === 0) return '';
    return items.join('\n- ');
  }

  protected formatParagraph(text: string): string {
    if (!text) return '';
    return `${text}\n`;
  }

  abstract formatBrief(data: any): string;
  abstract formatDetailed(data: any): string;
  abstract formatStandard(data: any): string;
}