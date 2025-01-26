export interface ROMRange {
  right?: number;
  left?: number;
  normal?: number;
}

export interface ROMEndFeel {
  right?: string;
  left?: string;
}

export interface ROMData {
  movement: string;
  active: ROMRange;
  passive?: ROMRange;
  painScale?: ROMRange;
  endFeel?: ROMEndFeel;
  notes?: string;
}

export interface ROMPattern {
  joint: string;
  movement: string;
  side?: 'right' | 'left' | 'bilateral';
  difference?: number;
  intensity?: number;
  description?: string;
}

export interface JointROM {
  [key: string]: ROMData[];
}

export interface ROMAnalysis {
  joints: JointROM;
  patterns: {
    bilateral: ROMPattern[];
    unilateral: ROMPattern[];
    painful: ROMPattern[];
    restricted: ROMPattern[];
  };
  functional: {
    upperExtremity: string[];
    lowerExtremity: string[];
    spine: string[];
  };
  impact: string[];
}