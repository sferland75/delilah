import { Assessment } from '../../../../types';
import { BaseAgent } from '../BaseAgent';
import { AgentContext, ReportSection, ReportSectionType } from '../../../../types/report';
import { IndependenceLevel } from '../../../../types';

export class ADLAgent extends BaseAgent {
    constructor(context: AgentContext) {
        super(context);
        this.priority = 5;
        this.name = 'ADLAgent';
        this.dataKeys = ['adl'];
    }

    async processData(data: Assessment): Promise<any> {
        return data.assessment.adl;
    }

    async generateSection(data: Assessment): Promise<ReportSection> {
        const processedData = await this.processData(data);
        const content = await this.getFormattedContent(
            processedData,
            this.context.config.detailLevel
        );

        return {
            title: 'Activities of Daily Living',
            type: ReportSectionType.FUNCTIONAL_ASSESSMENT,
            orderNumber: this.priority,
            content
        };
    }

    protected formatBrief(adl: any): string {
        const sections = ['Activities of Daily Living Summary:'];

        // Basic ADLs summary
        const basicADLs = this.summarizeIndependenceLevels(adl.basic);
        sections.push('\nBasic ADLs:');
        sections.push(basicADLs);

        // IADLs brief summary
        const iadls = this.summarizeIndependenceLevels(adl.iadl);
        sections.push('\nInstrumental ADLs:');
        sections.push(iadls);

        return sections.join('\n');
    }

    protected formatStandard(adl: any): string {
        const sections = ['Activities of Daily Living Assessment:'];

        // Basic ADLs
        sections.push('\nBasic ADLs:');
        sections.push(this.formatADLCategory(adl.basic));

        // IADLs
        sections.push('\nInstrumental ADLs:');
        sections.push(this.formatADLCategory(adl.iadl));

        return sections.join('\n');
    }

    protected formatDetailed(adl: any): string {
        const sections = ['Detailed ADL Assessment:'];

        // Basic ADLs with notes
        sections.push('\nBasic ADLs:');
        sections.push(this.formatADLCategoryDetailed(adl.basic));

        // IADLs with notes
        sections.push('\nInstrumental ADLs:');
        sections.push(this.formatADLCategoryDetailed(adl.iadl));

        // Health Management
        sections.push('\nHealth Management:');
        sections.push(this.formatADLCategoryDetailed(adl.health));

        // Work Status
        if (adl.work?.status) {
            sections.push('\nWork Status:');
            sections.push(this.formatADLCategoryDetailed(adl.work.status));
        }

        return sections.join('\n');
    }

    private summarizeIndependenceLevels(category: any): string {
        const summary: { [key: string]: number } = {
            independent: 0,
            modified_independent: 0,
            supervision: 0,
            assistance: 0
        };

        this.traverseADLCategory(category, (activity: any) => {
            if (activity.independence) {
                if (activity.independence.includes('independent')) {
                    summary.independent++;
                } else if (activity.independence.includes('modified')) {
                    summary.modified_independent++;
                } else if (activity.independence.includes('supervision')) {
                    summary.supervision++;
                } else {
                    summary.assistance++;
                }
            }
        });

        return Object.entries(summary)
            .filter(([_, count]) => count > 0)
            .map(([level, count]) => `${count} activities: ${this.formatIndependenceLevel(level as IndependenceLevel)}`)
            .join('\n');
    }

    private formatADLCategory(category: any): string {
        const lines: string[] = [];
        this.traverseADLCategory(category, (activity: any, name: string) => {
            if (activity.independence) {
                lines.push(`  ${this.formatActivityName(name)}: ${this.formatIndependenceLevel(activity.independence as IndependenceLevel)}`);
            }
        });
        return lines.join('\n');
    }

    private formatADLCategoryDetailed(category: any): string {
        const lines: string[] = [];
        this.traverseADLCategory(category, (activity: any, name: string) => {
            if (activity.independence) {
                lines.push(`  ${this.formatActivityName(name)}:`);
                lines.push(`    Level: ${this.formatIndependenceLevel(activity.independence as IndependenceLevel)}`);
                if (activity.notes) {
                    lines.push(`    Notes: ${activity.notes}`);
                }
            }
        });
        return lines.join('\n');
    }

    private traverseADLCategory(category: any, callback: (activity: any, name: string) => void) {
        Object.entries(category).forEach(([subcategory, activities]: [string, any]) => {
            Object.entries(activities).forEach(([name, activity]: [string, any]) => {
                callback(activity, name);
            });
        });
    }

    private formatActivityName(name: string): string {
        return name.split('_').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    private formatIndependenceLevel(level: IndependenceLevel): string {
        return level.split('_').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }
}