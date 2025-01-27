import { BaseAgent } from '../BaseAgent';
import { AgentContext, AssessmentData } from '../../types';
import { processROM } from './analysis';
import { ROMAnalysis } from './types';
import { formatROM } from './formatting';
import _ from 'lodash';

export interface ROMOutput extends ROMAnalysis {
  valid: boolean;
}

export class RangeOfMotionAgent extends BaseAgent {
  constructor(context: AgentContext) {
    super(context, 2.3, 'Range of Motion', ['functionalAssessment.rangeOfMotion']);
  }

  async processData(data: AssessmentData): Promise<ROMOutput> {
    const rom = _.get(data, 'functionalAssessment.rangeOfMotion', {});
    const processedData = processROM(rom);
    
    return {
      valid: true,
      ...processedData
    };
  }

  protected formatBrief(data: ROMOutput): string {
    return formatROM(data, 'brief');
  }

  protected formatStandard(data: ROMOutput): string {
    return formatROM(data, 'standard');
  }

  protected formatDetailed(data: ROMOutput): string {
    return formatROM(data, 'detailed');
  }
}