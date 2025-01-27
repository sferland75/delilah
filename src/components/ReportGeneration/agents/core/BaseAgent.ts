import { AgentContext, AssessmentData, ReportSection } from '../../../../types/report';
import { AgentConfig } from './AgentConfig';

export abstract class BaseAgent {
    protected context: AgentContext;
    protected config: AgentConfig;

    constructor(config: AgentConfig) {
        this.context = config.context;
        this.config = config;
    }

    abstract processData(data: AssessmentData): Promise<any>;
    
    async generateSection(data: AssessmentData): Promise<ReportSection> {
        const processedData = await this.processData(data);
        return {
            title: this.config.title,
            orderNumber: this.config.order,
            type: 'structured',
            content: await this.formatContent(processedData)
        };
    }

    protected abstract formatContent(data: any): Promise<string | any>;

    protected formatClinicalList(items: string[]): string {
        if (!items || items.length === 0) return '';
        
        if (items.length === 1) return items[0];
        
        if (items.length === 2) return `${items[0]} and ${items[1]}`;
        
        const lastItem = items[items.length - 1];
        const otherItems = items.slice(0, -1).join(', ');
        return `${otherItems}, and ${lastItem}`;
    }

    protected formatClinicalValue(value: number, unit: string): string {
        return `${value.toLocaleString()} ${unit}`;
    }

    protected formatClinicalDate(date: string): string {
        return new Date(date).toLocaleDateString('en-CA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    protected validateRequired(data: any, fields: string[]): string[] {
        const errors: string[] = [];
        
        for (const field of fields) {
            if (!data || data[field] === undefined || data[field] === null || data[field] === '') {
                errors.push(`Missing required field: ${field}`);
            }
        }
        
        return errors;
    }
}