export interface Document {
  title: string;
  date: string;
  type: string;
  provider?: string;
  summary?: string;
  findings?: string[];
  relevantFindings?: string[];
  recommendations?: string[];
}

export interface DocumentationData {
  medicalDocumentation: Document[];
  legalDocumentation: Document[];
  otherDocumentation?: Document[];
}

export interface DocumentationOutput extends DocumentationData {
  valid: boolean;
  recommendations: string[];
  errors?: string[];
}