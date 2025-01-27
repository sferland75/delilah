import { AssessmentData } from '../../../../types/report';
import { BaseAgent } from '../core/BaseAgent';
import { AgentConfig } from '../core/AgentConfig';

export class ADLAgent extends BaseAgent {
    constructor(config: AgentConfig) {
        super(config);
    }

    async processData(data: AssessmentData): Promise<any> {
        return data.assessment.adl;
    }

    protected async formatContent(adl: any): Promise<string> {
        const sections = ['Activities of Daily Living Assessment:'];

        // Format Basic ADLs
        sections.push('\nBasic ADLs:');
        if (adl.basic) {
            if (adl.basic.bathing) {
                sections.push(this.formatSection('Bathing', adl.basic.bathing));
            }
            if (adl.basic.dressing) {
                sections.push(this.formatSection('Dressing', adl.basic.dressing));
            }
            if (adl.basic.feeding) {
                sections.push(this.formatSection('Feeding', adl.basic.feeding));
            }
            if (adl.basic.transfers) {
                sections.push(this.formatSection('Transfers', adl.basic.transfers));
            }
        }

        // Format IADLs
        sections.push('\nInstrumental ADLs:');
        if (adl.iadl) {
            if (adl.iadl.household) {
                sections.push(this.formatSection('Household Management', adl.iadl.household));
            }
            if (adl.iadl.community) {
                sections.push(this.formatSection('Community Activities', adl.iadl.community));
            }
        }

        return sections.join('\n');
    }

    private formatSection(title: string, data: any): string {
        const lines = [`  ${title}:`];
        
        Object.entries(data).forEach(([activity, details]: [string, any]) => {
            if (details.independence) {
                lines.push(`    ${activity}: ${this.formatIndependenceLevel(details.independence)}`);
            }
            if (details.notes) {
                lines.push(`      Notes: ${details.notes}`);
            }
        });

        return lines.join('\n');
    }

    private formatIndependenceLevel(level: string): string {
        return level.split('_').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ');
    }
}