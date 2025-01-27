export interface NarrativeTransferOutput {
  valid: boolean;
  narrative: string;
  bullets: string[];
  recommendations: string[];
  errors?: string[];
}

export interface TransferDetails {
  assistanceLevel: string;
  equipment?: string[];
  safety_concerns?: string[];
  modifications?: string[];
}

export interface TransferData {
  bedMobility: string;
  sitToStand: string;
  toilet?: TransferDetails;
  shower?: TransferDetails;
}