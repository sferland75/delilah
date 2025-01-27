import { BaseAgent, AgentMetadata } from '../agents/BaseAgent';
import { AgentContext, AssessmentData, ProcessedData } from '../../../types/report';

// Rename to TestAgent for consistency
export class TestAgent extends BaseAgent {
    constructor(context: AgentContext) {
        super(context, {
            name: 'Test Section',
            priority: 1,
            dataKeys: ['test']
        });
    }

    async processData(data: AssessmentData): Promise<ProcessedData> {
        if (!data || !data.raw) {
            return {
                valid: false,
                data: {},
                errors: ['Invalid or missing data']
            };
        }

        return {
            valid: true,
            data: {
                test: 'data'
            }
        };
    }

    // Expose protected methods for testing
    public async testGetFormattedContent(data: any, level: 'brief' | 'standard' | 'detailed'): Promise<string> {
        return this.getFormattedContent(data, level);
    }

    protected formatBrief(data: any): string {
        return `Brief: ${JSON.stringify(data)}`;
    }

    protected formatStandard(data: any): string {
        return `Standard: ${JSON.stringify(data)}`;
    }

    protected formatDetailed(data: any): string {
        return `Detailed: ${JSON.stringify(data)}`;
    }

    // Test helper methods
    public hasNarrativeEngine(): boolean {
        return this.isNarrativeEnabled() && (this as any).narrativeEngine !== null;
    }

    public getMetadata(): AgentMetadata {
        return this.metadata;
    }

    public getContext(): AgentContext {
        return this.context;
    }
}