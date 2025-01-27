import { Assessment } from '../../../types';
import { AgentContext, ReportSection, ReportSectionType } from '../../../types/report';
import { BaseAgent } from './BaseAgent';

export class MobilityAgent extends BaseAgent {
    constructor(context: AgentContext) {
        super(context);
        this.priority = 4;
        this.name = 'MobilityAgent';
        this.dataKeys = ['functionalAssessment'];
    }

    async processData(data: Assessment): Promise<any> {
        return data.assessment.functionalAssessment;
    }

    protected formatBrief(assessment: any): string {
        const sections = ['Mobility Assessment Summary:'];

        if (assessment.rangeOfMotion?.measurements?.length) {
            const limitedROM = assessment.rangeOfMotion.measurements
                .filter((m: any) => 
                    this.isLimitedROM(m.left?.active, m.normalROM) || 
                    this.isLimitedROM(m.right?.active, m.normalROM))
                .map((m: any) => m.joint)
                .join(', ');
            
            if (limitedROM) {
                sections.push(`\nLimited range of motion: ${limitedROM}`);
            }
        }

        return sections.join('\n');
    }

    protected formatStandard(assessment: any): string {
        const sections = ['Mobility Assessment:'];

        if (assessment.rangeOfMotion?.measurements?.length) {
            sections.push('\nRange of Motion Assessment:');
            assessment.rangeOfMotion.measurements.forEach((measurement: any) => {
                sections.push(`\n${measurement.joint} - ${measurement.movement}:`);
                sections.push(`  Left: ${measurement.left?.active || 'Not tested'} (Active)`);
                sections.push(`  Right: ${measurement.right?.active || 'Not tested'} (Active)`);
                if (measurement.painLeft || measurement.painRight) {
                    sections.push('  Pain noted during testing');
                }
            });
        }

        return sections.join('\n');
    }

    protected formatDetailed(assessment: any): string {
        const sections = ['Detailed Mobility Assessment:'];

        if (assessment.rangeOfMotion?.measurements?.length) {
            sections.push('\nRange of Motion Assessment:');
            assessment.rangeOfMotion.measurements.forEach((measurement: any) => {
                sections.push(`\n${measurement.joint} - ${measurement.movement}:`);
                sections.push(`  Normal ROM: ${measurement.normalROM}`);
                sections.push(`  Left:`);
                sections.push(`    Active: ${measurement.left?.active || 'Not tested'}`);
                sections.push(`    Passive: ${measurement.left?.passive || 'Not tested'}`);
                sections.push(`    Pain: ${measurement.painLeft ? 'Yes' : 'No'}`);
                sections.push(`  Right:`);
                sections.push(`    Active: ${measurement.right?.active || 'Not tested'}`);
                sections.push(`    Passive: ${measurement.right?.passive || 'Not tested'}`);
                sections.push(`    Pain: ${measurement.painRight ? 'Yes' : 'No'}`);
                if (measurement.notes) {
                    sections.push(`  Notes: ${measurement.notes}`);
                }
            });
        }

        if (assessment.rangeOfMotion?.generalNotes) {
            sections.push('\nGeneral ROM Notes:');
            sections.push(assessment.rangeOfMotion.generalNotes);
        }

        if (assessment.manualMuscleTesting?.grades) {
            sections.push('\nManual Muscle Testing:');
            Object.entries(assessment.manualMuscleTesting.grades).forEach(([region, movements]: [string, any]) => {
                sections.push(`\n${region}:`);
                Object.entries(movements).forEach(([movement, grades]: [string, any]) => {
                    sections.push(`  ${movement}:`);
                    if (grades.left) sections.push(`    Left: ${grades.left}`);
                    if (grades.right) sections.push(`    Right: ${grades.right}`);
                });
            });
        }

        return sections.join('\n');
    }

    async generateSection(data: Assessment): Promise<ReportSection> {
        const processedData = await this.processData(data);
        const content = await this.getFormattedContent(
            processedData,
            this.context.config.detailLevel
        );

        return {
            title: 'Mobility Assessment',
            type: ReportSectionType.PHYSICAL_ASSESSMENT,
            orderNumber: this.priority,
            content
        };
    }

    private isLimitedROM(measured: string, normal: string): boolean {
        if (!measured || !normal) return false;
        const measuredNum = parseInt(measured);
        const normalNum = parseInt(normal);
        return !isNaN(measuredNum) && !isNaN(normalNum) && measuredNum < normalNum * 0.9;
    }
}