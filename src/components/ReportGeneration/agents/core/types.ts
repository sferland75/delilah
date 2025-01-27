export interface FormattingHelper {
  formatBrief(data: any): string;
  formatDetailed(data: any): string;
  formatStandard(data: any): string;
}

export interface ProcessedData {
  valid: boolean;
  errors?: string[];
  warnings?: string[];
  [key: string]: any;
}