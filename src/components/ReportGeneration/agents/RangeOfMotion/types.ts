export interface ROMData {
  joint: string;
  movement: string;
  active: {
    right?: number;
    left?: number;
    normal?: number;  // Normal ROM for comparison
  };
  passive?: {
    right?: number;
    left?: number;
  };
  painScale?: {
    right?: number;
    left?: number;
  };
  endFeel?: {
    right?: string;
    left?: string;
  };
  notes?: string;
}

export interface JointROM {
  cervical?: ROMData[];
  shoulder?: ROMData[];
  elbow?: ROMData[];
  wrist?: ROMData[];
  hip?: ROMData[];
  knee?: ROMData[];
  ankle?: ROMData[];
  spine?: ROMData[];
}

export interface ROMAnalysis {
  joints: JointROM;
  patterns: {
    bilateral: string[];
    unilateral: string[];
    painful: string[];
    restricted: string[];
  };
  functional: {
    upperExtremity: string[];
    lowerExtremity: string[];
    spine: string[];
  };
  impact: string[];
}