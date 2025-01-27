export interface ADLActivity {
  assistanceLevel: string;
  equipment?: string[];
  notes?: string;
}

export interface ADLData {
  feeding: ADLActivity;
  bathing: ADLActivity;
  dressing: ADLActivity;
  toileting: ADLActivity;
  transfers: ADLActivity;
  ambulation: ADLActivity;
}

export interface ADLOutput {
  valid: boolean;
  activities: {
    feeding: ADLActivity;
    bathing: ADLActivity;
    dressing: ADLActivity;
    toileting: ADLActivity;
    transfers: ADLActivity;
    ambulation: ADLActivity;
  };
  recommendations: string[];
  errors?: string[];
}