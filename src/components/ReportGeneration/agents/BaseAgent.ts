import { AgentContext, AssessmentData, ProcessedData, ReportSection } from '../../../types/report';
import { NarrativeEngine } from '../narrative/NarrativeEngine';

export interface AgentMetadata {
    name: string;
    priority: number;
    dataKeys: string[];
}

export abstract class BaseAgent {
    protected context: AgentContext;
    protected metadata: AgentMetadata;
    private narrativeEngine: NarrativeEngine | null = null;

    constructor(context: AgentContext, metadata?: Partial<AgentMetadata>) {
        this.context = context || { 
            logger: console,
            config: {
                detailLevel: 'standard',
                validateData: true,
                formatPreference: 'clinical',
                includeMetrics: false
            },
            features: {}
        };
        
        this.metadata = {
            name: 'BaseAgent',
            priority: 0,
            dataKeys: [],
            ...metadata
        };
        
        if (this.isNarrativeEnabled()) {
            this.narrativeEngine = new NarrativeEngine(this.context);
        }
    }

    abstract processData(data: AssessmentData): Promise<ProcessedData>;
    
    protected abstract formatBrief(data: any): string;
    protected abstract formatStandard(data: any): string;
    protected abstract formatDetailed(data: any): string;
    
    protected isNarrativeEnabled(): boolean {
        return this.context.features?.enableNarrative ?? false;
    }

    async generateSection(data: AssessmentData): Promise<ReportSection> {
        try {
            // Process raw data
            const processedData = await this.processData(data);

            // If data processing failed, return error section
            if (!processedData.valid) {
                return {
                    sectionName: this.metadata.name,
                    title: this.generateTitle(),
                    type: this.getSectionType(),
                    orderNumber: this.metadata.priority,
                    content: `Standard: Error processing ${this.metadata.name.toLowerCase()} data`,
                    valid: false,
                    errors: processedData.errors
                };
            }

            // Generate content based on whether narrative is enabled
            const content = this.isNarrativeEnabled() 
                ? await this.generateNarrativeContent(data, processedData)
                : await this.generateStandardContent(processedData);

            return {
                sectionName: this.metadata.name,
                title: this.generateTitle(),
                type: this.getSectionType(),
                orderNumber: this.metadata.priority,
                content,
                valid: true
            };
        } catch (error) {
            return {
                sectionName: this.metadata.name,
                title: this.generateTitle(),
                type: this.getSectionType(),
                orderNumber: this.metadata.priority,
                content: `Standard: Error in ${this.metadata.name.toLowerCase()} - ${error instanceof Error ? error.message : 'Unknown error'}`,
                valid: false,
                errors: [error instanceof Error ? error.message : 'Unknown error']
            };
        }
    }

    protected async generateStandardContent(processedData: ProcessedData): Promise<string> {
        try {
            return await this.getFormattedContent(processedData.data, this.context.config.detailLevel);
        } catch (error) {
            return `Standard: Error formatting ${this.metadata.name.toLowerCase()} content`;
        }
    }

    protected async generateNarrativeContent(data: AssessmentData, processedData: ProcessedData): Promise<string> {
        if (!this.narrativeEngine) {
            return this.generateStandardContent(processedData);
        }

        try {
            const sectionType = this.getSectionType().toLowerCase();
            const narrative = await this.narrativeEngine.generateNarrative(data.raw, sectionType);
            
            // If narrative generation fails or returns placeholder content, fall back to standard
            if (!narrative || 
                narrative === 'No data available for narrative generation' ||
                narrative.includes('Unable to generate narrative')) {
                return this.generateStandardContent(processedData);
            }

            return this.formatWithNarrative(processedData.data, narrative);
        } catch (error) {
            return this.generateStandardContent(processedData);
        }
    }

    protected async getFormattedContent(data: any, detailLevel: 'brief' | 'standard' | 'detailed'): Promise<string> {
        try {
            switch (detailLevel) {
                case 'brief':
                    return this.formatBrief(data);
                case 'standard':
                    return this.formatStandard(data);
                case 'detailed':
                    return this.formatDetailed(data);
                default:
                    return this.formatStandard(data);
            }
        } catch (error) {
            return `Standard: Error formatting ${this.metadata.name.toLowerCase()} content`;
        }
    }

    protected generateTitle(): string {
        return this.metadata.name.replace(/Agent$/, '');
    }

    protected getSectionType(): string {
        return this.metadata.name.replace(/Agent$/, '').toUpperCase();
    }

    protected formatWithNarrative(data: any, narrative: string): string {
        try {
            const sections: string[] = [];

            if (narrative) {
                sections.push(narrative);
            }

            if (this.context.config.detailLevel === 'detailed') {
                const detailedContent = this.formatDetailed(data);
                if (detailedContent && !detailedContent.includes('Error')) {
                    sections.push(detailedContent);
                }
            }

            return sections.filter(Boolean).join('\n\n') || 
                   `Standard: No content available for ${this.metadata.name.toLowerCase()}`;
        } catch (error) {
            return this.generateStandardContent({
                valid: false,
                data: data,
                errors: [error instanceof Error ? error.message : 'Error formatting narrative']
            });
        }
    }
}