import { ReportSection, AgentContext, StructuredContent } from '../../../types/report';

export async function formatReport(
    sections: ReportSection[],
    context: AgentContext
): Promise<string> {
    const formattedSections = sections
        .sort((a, b) => a.orderNumber - b.orderNumber)
        .map(section => formatSection(section))
        .filter(Boolean);

    return formattedSections.join('\n\n');
}

function formatSection(section: ReportSection): string {
    const { title, content, transition } = section;
    const parts = [title];

    if (transition) {
        parts.push(transition);
    }

    if (typeof content === 'string') {
        parts.push(content);
    } else {
        parts.push(formatStructuredContent(content));
    }

    return parts.join('\n');
}

function formatStructuredContent(content: StructuredContent): string {
    const formattedParts: string[] = [];

    if (content.clientTable) {
        formattedParts.push(formatTable(content.clientTable, 'Client Information'));
    }

    if (content.emergencyContactTable) {
        formattedParts.push(formatTable(content.emergencyContactTable, 'Emergency Contact'));
    }

    Object.entries(content)
        .filter(([key]) => !['clientTable', 'emergencyContactTable'].includes(key))
        .forEach(([key, value]) => {
            if (typeof value === 'string') {
                formattedParts.push(`${key}: ${value}`);
            } else if (Array.isArray(value)) {
                formattedParts.push(`${key}:\n${value.map(item => `  - ${item}`).join('\n')}`);
            }
        });

    return formattedParts.join('\n\n');
}

function formatTable(table: { [key: string]: { label: string; value: string | object } }, title: string): string {
    const rows = Object.entries(table)
        .map(([key, { label, value }]) => {
            const formattedValue = typeof value === 'object' 
                ? JSON.stringify(value, null, 2) 
                : value;
            return `${label}: ${formattedValue}`;
        })
        .join('\n');

    return `${title}:\n${rows}`;
}